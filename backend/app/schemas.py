"""
AgroVision Pydantic Schemas
Input/Output validation and Disease Reference Mapping
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field


# =============================================================================
# ENUMS
# =============================================================================

class CropEnum(str, Enum):
    """Supported crop types for disease detection."""
    APPLE = "Apple"
    RICE = "Rice"
    TOMATO = "Tomato"


# =============================================================================
# DISEASE REFERENCE MAP - Golden Reference Images
# =============================================================================
# Maps Disease Name -> Reference Image Filename in GCS bucket
# These are used for the "Thinking Model" comparison step

DISEASE_REFERENCE_MAP: Dict[str, str] = {
    # Apple Diseases
    "Apple Scab": "refs/apple_scab.jpg",
    "Apple Black Rot": "refs/apple_black_rot.jpg",
    "Apple Cedar Rust": "refs/apple_cedar_rust.jpg",
    
    # Rice Diseases
    "Rice Blast": "refs/rice_blast.jpg",
    "Rice Brown Spot": "refs/rice_brown_spot.jpg",
    "Rice Bacterial Leaf Blight": "refs/rice_bacterial_leaf_blight.jpg",
    
    # Tomato Diseases
    "Tomato Early Blight": "refs/tomato_early_blight.jpg",
    "Tomato Late Blight": "refs/tomato_late_blight.jpg",
    "Tomato Leaf Mold": "refs/tomato_leaf_mold.jpg",
    "Tomato Septoria Leaf Spot": "refs/tomato_septoria_leaf_spot.jpg",
}

# Reverse mapping: Get diseases by crop type
DISEASES_BY_CROP: Dict[str, List[str]] = {
    "Apple": ["Apple Scab", "Apple Black Rot", "Apple Cedar Rust"],
    "Rice": ["Rice Blast", "Rice Brown Spot", "Rice Bacterial Leaf Blight"],
    "Tomato": ["Tomato Early Blight", "Tomato Late Blight", "Tomato Leaf Mold", "Tomato Septoria Leaf Spot"],
}


# =============================================================================
# NESTED SCHEMAS
# =============================================================================

class Coordinates(BaseModel):
    """GPS coordinates for farmer location."""
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lng: float = Field(..., ge=-180, le=180, description="Longitude")


class FarmerMetadata(BaseModel):
    """Farmer identification and location information."""
    name: str = Field(..., min_length=1, max_length=100, description="Farmer's name")
    village: str = Field(..., min_length=1, max_length=100, description="Village name")
    coordinates: Optional[Coordinates] = Field(None, description="GPS coordinates")


class CropMetadata(BaseModel):
    """Crop details provided by the farmer."""
    crop_name: CropEnum = Field(..., description="Type of crop")
    sown_date: Optional[date] = Field(None, description="Date when crop was sown")
    observations: Optional[str] = Field(
        None, 
        max_length=500, 
        description="Farmer's observations about the issue"
    )


class TreatmentPlan(BaseModel):
    """Structured treatment recommendations."""
    immediate: List[str] = Field(default_factory=list, description="Immediate actions to take")
    preventive: List[str] = Field(default_factory=list, description="Preventive measures")
    products: List[str] = Field(default_factory=list, description="Recommended products")


class FinalResult(BaseModel):
    """Final diagnosis output from the AI pipeline."""
    disease_name: str = Field(..., description="Identified disease name")
    confidence_score: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    severity: Optional[str] = Field(None, description="Severity level: mild, moderate, severe")
    treatment_plan: Optional[TreatmentPlan] = Field(None, description="Treatment recommendations")


class AIDiagnosisLog(BaseModel):
    """
    The 'Thinking Process' - captures the AI's reasoning.
    Records comparison between user image and Golden Reference.
    """
    initial_prediction: str = Field(..., description="Initial disease prediction from visual model")
    reference_image_used: str = Field(..., description="Path to the reference image used")
    visual_match_score: float = Field(..., ge=0, le=1, description="Visual similarity score")
    comparison_notes: str = Field(..., description="Detailed comparison observations")
    weather_correlation: Optional[str] = Field(None, description="How weather data supports/contradicts diagnosis")
    confidence_adjustment: Optional[str] = Field(None, description="Adjustments made based on context")


# =============================================================================
# API INPUT SCHEMAS
# =============================================================================

class ConsultationCreate(BaseModel):
    """
    Input schema for creating a new disease detection consultation.
    This is the main API input for the /consult endpoint.
    """
    farmer_metadata: FarmerMetadata = Field(..., description="Farmer information")
    crop_metadata: CropMetadata = Field(..., description="Crop details")
    
    class Config:
        json_schema_extra = {
            "example": {
                "farmer_metadata": {
                    "name": "Rajesh Kumar",
                    "village": "Baramati",
                    "coordinates": {"lat": 18.15, "lng": 74.58}
                },
                "crop_metadata": {
                    "crop_name": "Apple",
                    "sown_date": "2025-06-15",
                    "observations": "Yellow and brown spots appearing on leaves, spreading quickly"
                }
            }
        }


# =============================================================================
# API RESPONSE SCHEMAS
# =============================================================================

class ConsultationResponse(BaseModel):
    """Response schema for a consultation."""
    session_id: UUID
    created_at: datetime
    farmer_metadata: Optional[Dict[str, Any]] = None
    crop_metadata: Optional[Dict[str, Any]] = None
    weather_context: Optional[str] = None
    ai_diagnosis_log: Optional[Dict[str, Any]] = None
    final_result: Optional[Dict[str, Any]] = None
    image_urls: Optional[List[str]] = None

    class Config:
        from_attributes = True


class ConsultationSummary(BaseModel):
    """Lightweight response for listing consultations."""
    session_id: UUID
    created_at: datetime
    crop_name: Optional[str] = None
    disease_name: Optional[str] = None
    confidence_score: Optional[float] = None

    class Config:
        from_attributes = True


class HealthCheckResponse(BaseModel):
    """Health check endpoint response."""
    status: str = "healthy"
    database: str = "connected"
    storage: str = "connected"
