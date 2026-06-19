"""
AgroVision - Main FastAPI Application v3.0
Crop Disease Detection with STRICT Dual-Agent AI Verification Pipeline

FIX 1: SKEPTICAL Verification - Gemini asks "What are the DIFFERENCES?"
FIX 2: LIVE Chat - Calls Gemini on EVERY request

Architecture:
- Agent 1 (OpenAI GPT-4o): Initial Visual Screener
- Agent 2 (Google Gemini 2.5 Pro): CRITICAL SKEPTICAL Verifier - Rejects if <90% match
- Chat: Gemini 2.5 Pro - LIVE generation on every request
"""

import os
import uuid
import json
import base64
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

import requests
from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from google.cloud import storage
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Local imports
from app.database import get_db, Consultation, init_db
from app.schemas import (
    DISEASE_REFERENCE_MAP,
    DISEASES_BY_CROP,
    ConsultationResponse,
    CropEnum,
)

# =============================================================================
# CONFIGURATION
# =============================================================================

# GCS Configuration
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "agrovision-uploads")

# OpenAI Configuration (Agent 1)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Google Gemini Configuration (Agent 2)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY not set. Agent 2 (Gemini Verifier) will be disabled.")
    gemini_model = None
    gemini_chat_model = None
else:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use 1.5 Pro for verification, 2.5 Pro for chat
    gemini_model = genai.GenerativeModel('gemini-1.5-pro')
    gemini_chat_model = genai.GenerativeModel('gemini-2.5-pro')
    print("✅ Gemini 1.5 Pro configured as Agent 2 (STRICT Skeptical Verifier)")
    print("✅ Gemini 2.5 Pro configured for LIVE Chat")

# Initialize GCS client
storage_client = storage.Client()

# =============================================================================
# FASTAPI APP INITIALIZATION
# =============================================================================

app = FastAPI(
    title="AgroVision API v3.0",
    description="Crop Disease Detection with STRICT Skeptical Verification + LIVE Chat",
    version="3.0.0",
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    init_db()
    print("✅ AgroVision API v3.0 started successfully!")
    print("   🤖 Agent 1: OpenAI GPT-4o (Visual Screener)")
    print(f"   🧠 Agent 2: {'Google Gemini 1.5 Pro (STRICT Skeptical Verifier)' if gemini_model else 'DISABLED'}")
    print(f"   💬 Chat: {'Gemini 2.5 Pro (LIVE Generation)' if gemini_chat_model else 'DISABLED'}")


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def get_weather(lat: float, lon: float) -> str:
    """Fetch past 7 days of weather from Open-Meteo Archive API."""
    try:
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=7)
        
        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "daily": "temperature_2m_max,rain_sum",
            "timezone": "auto"
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        daily = data.get("daily", {})
        temps = daily.get("temperature_2m_max", [])
        rain = daily.get("rain_sum", [])
        
        avg_temp = sum(t for t in temps if t is not None) / len(temps) if temps else 0
        total_rain = sum(r for r in rain if r is not None) if rain else 0
        
        if total_rain > 50:
            conditions = "Very Wet (Heavy Rain)"
        elif total_rain > 20:
            conditions = "Wet (Moderate Rain)"
        elif total_rain > 5:
            conditions = "Slightly Wet (Light Rain)"
        else:
            conditions = "Dry"
        
        humidity_note = ""
        if total_rain > 30 and avg_temp > 20:
            humidity_note = " - High humidity favorable for fungal diseases"
        
        summary = f"Avg Temp: {avg_temp:.1f}°C, Total Rain: {total_rain:.1f}mm, Conditions: {conditions}{humidity_note}"
        return summary
        
    except Exception as e:
        return f"Weather data unavailable: {str(e)}"


def upload_images(files: List[UploadFile], session_id: str) -> List[str]:
    """Upload images to Google Cloud Storage."""
    uploaded_urls = []
    
    try:
        bucket = storage_client.bucket(GCS_BUCKET_NAME)
        
        for idx, file in enumerate(files):
            file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
            blob_name = f"{session_id}/image_{idx + 1}.{file_extension}"
            
            blob = bucket.blob(blob_name)
            blob.upload_from_file(file.file, content_type=file.content_type)
            blob.make_public()
            
            public_url = blob.public_url
            uploaded_urls.append(public_url)
            file.file.seek(0)
        
        return uploaded_urls
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload images: {str(e)}")


def get_location_name(lat: float, lon: float) -> Optional[str]:
    """Get village/city name from coordinates using Google Geocoding API."""
    google_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not google_api_key:
        return None
    
    try:
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "latlng": f"{lat},{lon}",
            "key": google_api_key,
            "result_type": "locality|sublocality|administrative_area_level_3"
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") == "OK" and data.get("results"):
            for result in data["results"]:
                for component in result.get("address_components", []):
                    types = component.get("types", [])
                    if "locality" in types or "sublocality" in types:
                        return component.get("long_name")
        return None
        
    except Exception:
        return None


def get_reference_image_url(disease_name: str) -> Optional[str]:
    """Get the public URL for a disease reference image. Case-insensitive lookup."""
    disease_name_lower = disease_name.lower().strip()
    
    matched_key = None
    for key in DISEASE_REFERENCE_MAP.keys():
        if key.lower().strip() == disease_name_lower:
            matched_key = key
            break
    
    if not matched_key:
        return None
    
    ref_path = DISEASE_REFERENCE_MAP[matched_key]
    
    try:
        bucket = storage_client.bucket(GCS_BUCKET_NAME)
        base_path = ref_path.rsplit('.', 1)[0] if '.' in ref_path else ref_path
        extensions = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG']
        
        for ext in extensions:
            test_path = f"{base_path}{ext}"
            blob = bucket.blob(test_path)
            if blob.exists():
                return f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/{test_path}"
        
        return f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/{ref_path}"
        
    except Exception:
        return f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/{ref_path}"


def download_image_as_base64(url: str) -> Optional[str]:
    """Download an image from URL and return as base64."""
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        return base64.b64encode(response.content).decode('utf-8')
    except Exception as e:
        print(f"Failed to download image {url}: {str(e)}")
        return None


def get_image_mime_type(url: str) -> str:
    """Determine MIME type from URL."""
    url_lower = url.lower()
    if '.png' in url_lower:
        return 'image/png'
    elif '.webp' in url_lower:
        return 'image/webp'
    return 'image/jpeg'


# =============================================================================
# DUAL-AGENT AI PIPELINE
# =============================================================================

def agent1_openai_screener(image_urls: List[str], crop_name: str) -> dict:
    """
    AGENT 1: OpenAI GPT-4o - Initial Visual Screener
    Analyzes user images to predict disease name and confidence.
    """
    print("🤖 Agent 1 (GPT-4o): Starting visual screening...")
    
    try:
        image_content = []
        for url in image_urls:
            image_content.append({
                "type": "image_url",
                "image_url": {"url": url, "detail": "high"}
            })
        
        possible_diseases = DISEASES_BY_CROP.get(crop_name, [])
        disease_list = ", ".join(possible_diseases) if possible_diseases else "any plant disease"
        
        messages = [
            {
                "role": "system",
                "content": f"""You are an expert agricultural pathologist.
Analyze the images of a {crop_name} plant and identify any visible diseases.
Known diseases for {crop_name}: {disease_list}

Return JSON with exactly these fields:
- "disease_name": The disease name (use exact names from the list, or "Healthy" if no disease, or "Unknown Disease" if unsure)
- "confidence": A score between 0.0 and 1.0
- "visual_symptoms": Detailed description of lesion shape, color, distribution
- "preliminary_reasoning": Brief explanation

Return ONLY valid JSON."""
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Analyze these {crop_name} plant images for diseases:"},
                    *image_content
                ]
            }
        ]
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=800,
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Clean JSON
        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
        result_text = result_text.strip()
        
        result = json.loads(result_text)
        
        print(f"🤖 Agent 1 Result: {result.get('disease_name')} ({result.get('confidence', 0):.0%})")
        
        return {
            "disease_name": result.get("disease_name", "Unknown Disease"),
            "confidence": float(result.get("confidence", 0.5)),
            "visual_symptoms": result.get("visual_symptoms", ""),
            "preliminary_reasoning": result.get("preliminary_reasoning", ""),
            "agent": "OpenAI GPT-4o",
            "status": "success"
        }
        
    except Exception as e:
        return {
            "disease_name": "Error",
            "confidence": 0.0,
            "visual_symptoms": f"Agent 1 error: {str(e)}",
            "preliminary_reasoning": "",
            "agent": "OpenAI GPT-4o",
            "status": "error"
        }


def verify_disease_strict(
    user_image_urls: List[str],
    reference_image_url: str,
    suspected_disease: str,
    weather_summary: str,
    crop_name: str
) -> dict:
    """
    FIX 1: SKEPTICAL VERIFICATION LOGIC
    
    NEW APPROACH: Ask Gemini to LIST THE DIFFERENCES, not confirm similarities.
    REJECTION THRESHOLD: If visual symptoms are not 90%+ identical, REJECT.
    """
    print(f"🔍 STRICT Verification: Analyzing '{suspected_disease}'...")
    
    if not gemini_model:
        return {
            "is_match": False,
            "reasoning": "Gemini not configured - cannot verify",
            "confidence": 0.0
        }
    
    try:
        # Download images
        image_parts = []
        for idx, url in enumerate(user_image_urls):
            img_data = download_image_as_base64(url)
            if img_data:
                image_parts.append({
                    "mime_type": get_image_mime_type(url),
                    "data": img_data
                })
                print(f"   📷 User image {idx + 1} loaded")
        
        ref_data = download_image_as_base64(reference_image_url)
        if not ref_data:
            return {
                "is_match": False,
                "reasoning": "Reference image could not be loaded",
                "confidence": 0.0
            }
        
        reference_part = {
            "mime_type": get_image_mime_type(reference_image_url),
            "data": ref_data
        }
        print(f"   📚 Reference image loaded")
        
        # THE NEW SKEPTICAL PROMPT - Focus on DIFFERENCES
        prompt = f"""You are a CRITICAL Phytopathologist with 25+ years of experience.

## YOUR TASK
You must verify if the SUSPECTED IMAGE matches the VERIFIED REFERENCE IMAGE for the disease: **{suspected_disease}**

## CRITICAL INSTRUCTIONS
DO NOT look for similarities. Instead, **LIST THE DIFFERENCES** between the images.

## IMAGES PROVIDED
1. **SUSPECTED IMAGE** (first {len(image_parts)} images): The farmer's crop photo
2. **VERIFIED REFERENCE** (last image): Gold standard reference for {suspected_disease}

## ANALYSIS PROTOCOL

### STEP 1: Analyze the SUSPECTED image lesion characteristics
- Shape: Circular, angular, irregular?
- Color: Brown, black, yellow, olive-green?
- Halo: Present or absent? Color?
- Texture: Flat, raised, sunken, necrotic?
- Distribution: Random, clustered, vein-aligned?

### STEP 2: Compare strictly to the REFERENCE image
**LIST EVERY DIFFERENCE YOU OBSERVE:**
- If lesion shapes differ → DOCUMENT IT
- If colors don't match → DOCUMENT IT
- If halos are different → DOCUMENT IT
- If texture differs → DOCUMENT IT
- If distribution patterns differ → DOCUMENT IT

### STEP 3: Weather Check
Weather: {weather_summary}
- Does this weather support {suspected_disease}?
- Fungal diseases need wet/humid conditions
- If weather is DRY and disease needs WET → FLAG THIS

### STEP 4: VERDICT
**REJECTION THRESHOLD: If visual symptoms are NOT 90%+ identical, you MUST REJECT.**

- If you found 3+ major differences → REJECT
- If weather doesn't support disease → REJECT
- If lesion color is completely different → REJECT
- If lesion shape is inconsistent → REJECT

## OUTPUT FORMAT
Return valid JSON:
{{
    "is_match": true or false,
    "reasoning": "Detailed step-by-step explanation listing ALL differences found (or confirming 90%+ match)",
    "confidence": 0.0 to 1.0,
    "differences_found": [
        "Difference 1: ...",
        "Difference 2: ...",
        "Difference 3: ..."
    ],
    "weather_supports": true or false,
    "verdict": "CONFIRMED" or "REJECTED",
    "alternative_diagnosis": "If rejected, suggest what disease this might actually be"
}}

**Be SKEPTICAL. Default to rejection unless evidence is overwhelming (90%+ match).**

Return ONLY valid JSON."""

        # Build content
        content_parts = [prompt]
        for img_part in image_parts:
            content_parts.append(img_part)
        content_parts.append(reference_part)
        
        # Call Gemini
        response = gemini_model.generate_content(content_parts)
        result_text = response.text.strip()
        
        # Clean JSON
        if result_text.startswith("```"):
            lines = result_text.split("\n")
            result_text = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
            if result_text.startswith("json"):
                result_text = result_text[4:].strip()
        
        verification = json.loads(result_text)
        
        is_match = verification.get("is_match", False)
        print(f"   {'✅ CONFIRMED' if is_match else '❌ REJECTED'}: {suspected_disease}")
        print(f"   Confidence: {verification.get('confidence', 0):.0%}")
        
        return verification
        
    except Exception as e:
        print(f"   ❌ Verification Error: {str(e)}")
        return {
            "is_match": False,
            "reasoning": f"Verification failed: {str(e)}",
            "confidence": 0.0,
            "verdict": "ERROR"
        }


# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "🌱 AgroVision API v3.0 is running!",
        "version": "3.0.0",
        "architecture": "STRICT Skeptical Dual-Agent + LIVE Chat",
        "agents": {
            "agent1": "OpenAI GPT-4o (Visual Screener)",
            "agent2": f"Google Gemini 1.5 Pro (STRICT Skeptical Verifier - 90% threshold) - {'Active' if gemini_model else 'Disabled'}",
            "chat": f"Google Gemini 2.5 Pro (LIVE Generation) - {'Active' if gemini_chat_model else 'Disabled'}"
        },
        "fixes": {
            "fix1": "Skeptical Verification - Gemini asks 'What are the DIFFERENCES?'",
            "fix2": "LIVE Chat - Calls Gemini on EVERY request"
        }
    }


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Detailed health check endpoint."""
    health_status = {
        "status": "healthy",
        "database": "unknown",
        "storage": "unknown",
        "agent1_openai": "unknown",
        "agent2_gemini": "unknown",
        "chat_gemini": "unknown"
    }
    
    # Check database
    try:
        db.execute(text("SELECT 1"))
        health_status["database"] = "connected"
    except Exception as e:
        health_status["database"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
    
    # Check GCS
    try:
        bucket = storage_client.bucket(GCS_BUCKET_NAME)
        bucket.exists()
        health_status["storage"] = "connected"
    except Exception as e:
        health_status["storage"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
    
    # Check OpenAI
    try:
        openai_client.models.list()
        health_status["agent1_openai"] = "connected"
    except Exception as e:
        health_status["agent1_openai"] = f"error: {str(e)}"
    
    # Check Gemini
    if gemini_model:
        health_status["agent2_gemini"] = "connected (Gemini 1.5 Pro - STRICT)"
    else:
        health_status["agent2_gemini"] = "disabled"
    
    if gemini_chat_model:
        health_status["chat_gemini"] = "connected (Gemini 2.5 Pro - LIVE)"
    else:
        health_status["chat_gemini"] = "disabled"
    
    return health_status


@app.post("/analyze", response_model=ConsultationResponse)
async def analyze_crop(
    lat: float = Form(...),
    lon: float = Form(...),
    farmer_name: str = Form(...),
    village: str = Form(...),
    crop_name: CropEnum = Form(...),
    sown_date: Optional[str] = Form(None),
    observations: Optional[str] = Form(None),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    🌾 Main Disease Analysis Endpoint - STRICT Dual-Agent Pipeline
    
    Stage 1: GPT-4o Visual Screening
    Stage 2: Gemini STRICT Skeptical Verification (90% threshold)
    """
    
    # Validate files
    if len(files) < 1:
        raise HTTPException(status_code=400, detail="Please upload at least 1 image")
    if len(files) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 images allowed")
    
    # Create Session
    session_id = str(uuid.uuid4())
    print(f"\n{'='*60}")
    print(f"📋 New Consultation: {session_id}")
    print(f"{'='*60}")
    
    # Upload Images
    print(f"📤 Uploading {len(files)} images...")
    image_urls = upload_images(files, session_id)
    print(f"✅ Images uploaded")
    
    # Get Weather
    print(f"🌤️ Fetching weather...")
    weather_summary = get_weather(lat, lon)
    print(f"✅ Weather: {weather_summary}")
    
    # AGENT 1: GPT-4o Screening
    print(f"\n--- AGENT 1: Visual Screening ---")
    agent1_result = agent1_openai_screener(image_urls, crop_name.value)
    suspected_disease = agent1_result.get("disease_name", "Unknown Disease")
    
    # Get Reference Image
    reference_url = get_reference_image_url(suspected_disease)
    
    # AGENT 2: STRICT Gemini Verification
    print(f"\n--- AGENT 2: STRICT Skeptical Verification ---")
    
    if not reference_url:
        print(f"⚠️ No reference image for '{suspected_disease}' - cannot verify")
        verification_result = {
            "is_match": False,
            "reasoning": f"No reference image available for {suspected_disease}",
            "confidence": agent1_result.get("confidence", 0.5) * 0.7,
            "verdict": "UNVERIFIED"
        }
        final_disease = suspected_disease
        final_confidence = verification_result["confidence"]
    else:
        verification_result = verify_disease_strict(
            user_image_urls=image_urls,
            reference_image_url=reference_url,
            suspected_disease=suspected_disease,
            weather_summary=weather_summary,
            crop_name=crop_name.value
        )
        
        if verification_result.get("is_match"):
            final_disease = suspected_disease
            final_confidence = verification_result.get("confidence", 0.5)
        else:
            final_disease = verification_result.get("alternative_diagnosis", "Uncertain - Verification Failed")
            final_confidence = verification_result.get("confidence", 0.3)
    
    # Build diagnosis log
    ai_diagnosis_log = {
        "agent1_model": "OpenAI GPT-4o",
        "agent1_prediction": suspected_disease,
        "agent1_confidence": agent1_result.get("confidence"),
        "agent1_visual_symptoms": agent1_result.get("visual_symptoms"),
        "agent1_reasoning": agent1_result.get("preliminary_reasoning"),
        
        "agent2_model": "Google Gemini 1.5 Pro (STRICT)",
        "agent2_verification_approach": "Skeptical - Focus on DIFFERENCES",
        "agent2_verdict": verification_result.get("verdict", "UNKNOWN"),
        "agent2_is_match": verification_result.get("is_match", False),
        "agent2_reasoning": verification_result.get("reasoning", ""),
        "agent2_differences_found": verification_result.get("differences_found", []),
        "agent2_weather_supports": verification_result.get("weather_supports", False),
        "agent2_alternative_diagnosis": verification_result.get("alternative_diagnosis", ""),
        
        "reference_image_used": reference_url or "No reference available",
        "weather_context": weather_summary,
        "final_confidence": final_confidence
    }
    
    # Build final result
    final_result = {
        "disease_name": final_disease,
        "confidence_score": final_confidence,
        "severity": "moderate",
        "treatment_plan": {
            "immediate": ["Consult local agricultural extension officer for confirmation"],
            "preventive": ["Monitor crop regularly", "Maintain proper plant hygiene"],
            "products": []
        }
    }
    
    print(f"\n✅ Final Diagnosis: {final_disease} ({final_confidence:.0%})")
    
    # Get geocoded location
    geocoded_location = get_location_name(lat, lon)
    
    farmer_metadata = {
        "name": farmer_name,
        "village": village,
        "geocoded_village": geocoded_location,
        "coordinates": {"lat": lat, "lng": lon}
    }
    
    crop_metadata = {
        "crop_name": crop_name.value,
        "sown_date": sown_date,
        "observations": observations
    }
    
    # Save to database
    print(f"💾 Saving consultation...")
    consultation = Consultation(
        session_id=uuid.UUID(session_id),
        farmer_metadata=farmer_metadata,
        crop_metadata=crop_metadata,
        weather_context=weather_summary,
        ai_diagnosis_log=ai_diagnosis_log,
        final_result=final_result,
        image_urls=image_urls
    )
    
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    
    print(f"✅ Consultation saved!")
    print(f"{'='*60}\n")
    
    return ConsultationResponse(
        session_id=consultation.session_id,
        created_at=consultation.created_at,
        farmer_metadata=consultation.farmer_metadata,
        crop_metadata=consultation.crop_metadata,
        weather_context=consultation.weather_context,
        ai_diagnosis_log=consultation.ai_diagnosis_log,
        final_result=consultation.final_result,
        image_urls=consultation.image_urls
    )


# =============================================================================
# FIX 2: LIVE CHAT ENDPOINT
# =============================================================================

class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
    session_id: str


@app.post("/chat", response_model=ChatResponse)
async def chat_live(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    FIX 2: LIVE CHAT GENERATION
    
    CRITICAL: This endpoint calls Gemini 2.5 Pro on EVERY request.
    NO STATIC RESPONSES. NO CACHING. LIVE GENERATION ONLY.
    """
    session_id = request.session_id
    user_message = request.message.strip()
    
    print(f"\n{'='*50}")
    print(f"💬 LIVE CHAT REQUEST")
    print(f"   Session: {session_id}")
    print(f"   Question: '{user_message}'")
    print(f"{'='*50}")
    
    # Validate Gemini is available
    if not gemini_chat_model:
        raise HTTPException(status_code=503, detail="Chat service unavailable - Gemini not configured")
    
    # Fetch consultation
    try:
        consultation_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID format")
    
    consultation = db.query(Consultation).filter(
        Consultation.session_id == consultation_uuid
    ).first()
    
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    
    # Extract context
    disease_name = consultation.final_result.get("disease_name", "Unknown") if consultation.final_result else "Unknown"
    verification_log = consultation.ai_diagnosis_log.get("agent2_reasoning", "No reasoning available") if consultation.ai_diagnosis_log else "No log"
    weather = consultation.weather_context or "Unknown"
    
    chat_history = consultation.chat_history or []
    
    print(f"   Disease: {disease_name}")
    print(f"   Verification: {verification_log[:100]}...")
    
    # Construct LIVE prompt
    prompt = f"""You are an expert Agronomist.

CONTEXT: You diagnosed a crop with: {disease_name}

YOUR VERIFICATION REASONING:
{verification_log}

WEATHER CONDITIONS: {weather}

USER'S QUESTION: "{user_message}"

INSTRUCTIONS:
- Answer the user's SPECIFIC question directly
- If they ask why you diagnosed this, explain based on your verification reasoning
- If they ask about treatment, provide specific recommendations
- If the question is unrelated to agriculture, politely redirect: "I can only help with crop disease questions."
- Keep your answer SHORT (2-3 sentences)
- Use simple language

Your response:"""

    print(f"   📤 Calling Gemini 2.5 Pro LIVE...")
    
    # CRITICAL: LIVE GENERATION - Create fresh model instance
    try:
        live_gemini = genai.GenerativeModel('gemini-2.5-pro')
        response = live_gemini.generate_content(prompt)
        generated_answer = response.text.strip()
        
        print(f"   📥 Generated: {generated_answer[:100]}...")
        
    except Exception as e:
        print(f"   ❌ Gemini Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat generation failed: {str(e)}")
    
    # Save to database
    try:
        new_history = list(chat_history)
        new_history.append({"role": "user", "content": user_message})
        new_history.append({"role": "assistant", "content": generated_answer})
        
        consultation.chat_history = new_history
        db.commit()
        
        print(f"   💾 Saved (History: {len(new_history)} messages)")
        
    except Exception as e:
        print(f"   ⚠️ DB save error: {str(e)}")
        db.rollback()
    
    print(f"   ✅ Returning LIVE response")
    print(f"{'='*50}\n")
    
    return ChatResponse(
        response=generated_answer,
        session_id=session_id
    )


@app.get("/consultation/{session_id}", response_model=ConsultationResponse)
async def get_consultation(session_id: str, db: Session = Depends(get_db)):
    """Retrieve a consultation by session ID."""
    try:
        consultation_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID format")
    
    consultation = db.query(Consultation).filter(
        Consultation.session_id == consultation_uuid
    ).first()
    
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    
    return ConsultationResponse(
        session_id=consultation.session_id,
        created_at=consultation.created_at,
        farmer_metadata=consultation.farmer_metadata,
        crop_metadata=consultation.crop_metadata,
        weather_context=consultation.weather_context,
        ai_diagnosis_log=consultation.ai_diagnosis_log,
        final_result=consultation.final_result,
        image_urls=consultation.image_urls
    )


@app.get("/diseases")
async def list_diseases():
    """List all supported diseases and their reference images."""
    return {
        "diseases_by_crop": DISEASES_BY_CROP,
        "reference_map": DISEASE_REFERENCE_MAP,
        "total_diseases": len(DISEASE_REFERENCE_MAP)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
