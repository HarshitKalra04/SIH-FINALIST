import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	Award,
	Calendar,
	Camera,
	CheckCircle,
	CloudRain,
	Coins,
	FileText,
	Flame,
	Globe,
	ImagePlus,
	Leaf,
	Loader2,
	MapPin,
	MessageSquare,
	Microscope,
	RefreshCw,
	Send,
	Shield,
	Star,
	Trash2,
	Trophy,
	Upload,
	User,
	X,
	Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
	en: {
		// Language selector
		selectLanguage: "Select Your Language",
		chooseLanguage: "Choose your preferred language to continue",

		// Navbar
		home: "Home",
		aboutUs: "About Us",
		tryForFree: "Try for Free",

		// Landing
		trustedBy: "Trusted by",
		farmers: "Farmers Across India",
		stopDisease: "Stop Crop Disease",
		beforeSpreads: "Before It Spreads",
		heroDesc:
			"Instant, accurate diagnosis on your phone. Powered by advanced AI verified against scientific data and your local weather.",
		diagnoseNow: "Diagnose My Plant Now (Free)",
		noCreditCard: "No credit card needed",
		accuracy: "95%+ Accuracy",
		howWorks: "How It Works",
		step1: "Upload Photos",
		step1Desc: "Take 1-3 clear photos of affected leaves",
		step2: "AI Analysis",
		step2Desc: "Dual-agent AI with weather correlation",
		step3: "Get Treatment",
		step3Desc: "Specific medicine & preventive measures",

		// Form
		newConsultation: "New Consultation",
		fillDetails:
			"Fill in the details below and upload images of your affected crop.",
		location: "Location",
		useLocation: "Use My Current Location",
		latitude: "Latitude",
		longitude: "Longitude",
		farmerDetails: "Farmer Details",
		yourName: "Your Name",
		enterName: "Enter your full name",
		village: "Village/Town",
		enterVillage: "Enter your village name",
		cropDetails: "Crop Details",
		selectCrop: "Select Crop",
		apple: "Apple",
		rice: "Rice",
		tomato: "Tomato",
		sownDate: "Sown Date (Optional)",
		observations: "Your Observations (Optional)",
		observationsPlaceholder:
			"Describe what you've noticed... (e.g., yellow spots, wilting)",
		uploadImages: "Upload Images (1-3 photos)",
		clickUpload: "Click to upload or drag and drop",
		jpegPng: "JPEG, PNG, WebP up to 5MB each",
		analyzeCrop: "Analyze Crop Disease",

		// Analyzing
		analyzingCrop: "Analyzing Your Crop",
		pleaseWait: "Please wait while our AI examines your images...",
		uploadingImages: "Uploading images to cloud...",
		fetchingWeather: "Fetching weather data...",
		runningDiagnosis: "Running visual diagnosis...",
		verifyingRef: "Verifying with reference images...",
		generatingPlan: "Generating treatment plan...",

		// Results
		diagnosisResults: "Diagnosis Results",
		newAnalysis: "New Analysis",
		identifiedDisease: "Identified Disease",
		confidence: "Confidence",
		severity: "Severity",
		mild: "Mild",
		moderate: "Moderate",
		severe: "Severe",
		analyzedImages: "Analyzed Images",
		treatmentPlan: "Treatment Plan",
		immediateActions: "Immediate Actions",
		preventive: "Preventive Measures",
		recommendedProducts: "Recommended Products",
		aiVerification: "AI Verification Log",
		initialPrediction: "Initial Prediction",
		referenceAvailable: "Reference Available",
		textureAnalysis: "Texture Analysis",
		comparisonNotes: "Comparison Notes",
		askQuestions: "Ask Questions",
		chatWithAI: "Chat with our AI assistant",
		askAbout: "Ask about the diagnosis...",

		// Common
		back: "Back",
		loading: "Loading...",
		error: "Error",
		success: "Success",
	},

	hi: {
		// Language selector
		selectLanguage: "अपनी भाषा चुनें",
		chooseLanguage: "जारी रखने के लिए अपनी पसंदीदा भाषा चुनें",

		// Navbar
		home: "होम",
		aboutUs: "हमारे बारे में",
		tryForFree: "मुफ्त में आजमाएं",

		// Landing
		trustedBy: "विश्वसनीय",
		farmers: "भारत भर के किसान",
		stopDisease: "फसल रोग रोकें",
		beforeSpreads: "फैलने से पहले",
		heroDesc:
			"अपने फोन पर तुरंत, सटीक निदान। वैज्ञानिक डेटा और स्थानीय मौसम के साथ उन्नत AI।",
		diagnoseNow: "अभी मुफ्त में जांच करें",
		noCreditCard: "क्रेडिट कार्ड की आवश्यकता नहीं",
		accuracy: "95%+ सटीकता",
		howWorks: "यह कैसे काम करता है",
		step1: "फोटो अपलोड करें",
		step1Desc: "प्रभावित पत्तियों की 1-3 स्पष्ट फोटो लें",
		step2: "AI विश्लेषण",
		step2Desc: "मौसम सहसंबंध के साथ Dual-agent AI",
		step3: "उपचार प्राप्त करें",
		step3Desc: "विशिष्ट दवा और निवारक उपाय",

		// Form
		newConsultation: "नया परामर्श",
		fillDetails: "नीचे विवरण भरें और अपनी प्रभावित फसल की छवियां अपलोड करें।",
		location: "स्थान",
		useLocation: "मेरा वर्तमान स्थान उपयोग करें",
		latitude: "अक्षांश",
		longitude: "देशांतर",
		farmerDetails: "किसान विवरण",
		yourName: "आपका नाम",
		enterName: "अपना पूरा नाम दर्ज करें",
		village: "गाँव/शहर",
		enterVillage: "अपने गाँव का नाम दर्ज करें",
		cropDetails: "फसल विवरण",
		selectCrop: "फसल चुनें",
		apple: "सेब",
		rice: "चावल",
		tomato: "टमाटर",
		sownDate: "बुवाई की तारीख (वैकल्पिक)",
		observations: "आपकी टिप्पणियाँ (वैकल्पिक)",
		observationsPlaceholder: "आपने क्या देखा... (जैसे, पीले धब्बे, मुरझाना)",
		uploadImages: "छवियां अपलोड करें (1-3 फोटो)",
		clickUpload: "अपलोड करने के लिए क्लिक करें या ड्रैग एंड ड्रॉप करें",
		jpegPng: "प्रत्येक 5MB तक JPEG, PNG, WebP",
		analyzeCrop: "फसल रोग का विश्लेषण करें",

		// Analyzing
		analyzingCrop: "आपकी फसल का विश्लेषण",
		pleaseWait: "कृपया प्रतीक्षा करें जबकि हमारा AI आपकी छवियों की जांच करता है...",
		uploadingImages: "क्लाउड पर छवियां अपलोड हो रही हैं...",
		fetchingWeather: "मौसम डेटा प्राप्त किया जा रहा है...",
		runningDiagnosis: "दृश्य निदान चल रहा है...",
		verifyingRef: "संदर्भ छवियों के साथ सत्यापन...",
		generatingPlan: "उपचार योजना बनाई जा रही है...",

		// Results
		diagnosisResults: "निदान परिणाम",
		newAnalysis: "नया विश्लेषण",
		diseaseDetected: "रोग का पता चला",
		confidence: "विश्वास",
		severity: "गंभीरता",
		treatmentPlan: "उपचार योजना",
		immediateActions: "तत्काल कार्रवाई",
		preventive: "निवारक उपाय",
		recommendedProducts: "अनुशंसित उत्पाद",
		dosage: "खुराक",
		application: "आवेदन",
		weatherContext: "मौसम संदर्भ",
		aiVerification: "AI सत्यापन लॉग",
		howAnalyzed: "हमने आपकी फसल का विश्लेषण कैसे किया:",
		chatAssistant: "AI सहायक के साथ चैट करें",
		askQuestion: "निदान के बारे में पूछें...",

		// Common
		back: "वापस",
		loading: "लोड हो रहा है...",
		error: "त्रुटि",
		success: "सफलता",
	},

	mr: {
		// Marathi
		selectLanguage: "तुमची भाषा निवडा",
		chooseLanguage: "सुरू ठेवण्यासाठी तुमची पसंतीची भाषा निवडा",
		home: "होम",
		aboutUs: "आमच्याबद्दल",
		tryForFree: "मोफत वापरून पहा",
		trustedBy: "विश्वसनीय",
		farmers: "भारतातील शेतकरी",
		stopDisease: "पीक रोग थांबवा",
		beforeSpreads: "पसरण्याआधी",
		heroDesc:
			"तुमच्या फोनवर त्वरित, अचूक निदान। वैज्ञानिक डेटा आणि स्थानिक हवामानासह प्रगत AI.",
		diagnoseNow: "आता मोफत तपासा",
		noCreditCard: "क्रेडिट कार्डची आवश्यकता नाही",
		accuracy: "95%+ अचूकता",
		howWorks: "हे कसे काम करते",
		step1: "फोटो अपलोड करा",
		step1Desc: "प्रभावित पानांचे 1-3 स्पष्ट फोटो घ्या",
		step2: "AI विश्लेषण",
		step2Desc: "हवामान सहसंबंधासह Dual-agent AI",
		step3: "उपचार मिळवा",
		step3Desc: "विशिष्ट औषध आणि प्रतिबंधात्मक उपाय",
		newConsultation: "नवीन सल्लामसलत",
		fillDetails: "खाली तपशील भरा आणि तुमच्या प्रभावित पिकाच्या प्रतिमा अपलोड करा.",
		location: "स्थान",
		useLocation: "माझे वर्तमान स्थान वापरा",
		latitude: "अक्षांश",
		longitude: "रेखांश",
		farmerDetails: "शेतकरी तपशील",
		yourName: "तुमचे नाव",
		enterName: "तुमचे पूर्ण नाव प्रविष्ट करा",
		village: "गाव/शहर",
		enterVillage: "तुमच्या गावाचे नाव प्रविष्ट करा",
		cropDetails: "पीक तपशील",
		selectCrop: "पीक निवडा",
		apple: "सफरचंद",
		rice: "तांदूळ",
		tomato: "टोमॅटो",
		sownDate: "पेरणीची तारीख (ऐच्छिक)",
		observations: "तुमची निरीक्षणे (ऐच्छिक)",
		observationsPlaceholder:
			"तुम्ही काय पाहिले ते वर्णन करा... (उदा., पिवळे डाग, कोमेजणे)",
		uploadImages: "प्रतिमा अपलोड करा (1-3 फोटो)",
		clickUpload: "अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग आणि ड्रॉप करा",
		jpegPng: "प्रत्येकी 5MB पर्यंत JPEG, PNG, WebP",
		analyzeCrop: "पीक रोगाचे विश्लेषण करा",
		analyzingCrop: "तुमच्या पिकाचे विश्लेषण",
		pleaseWait: "कृपया प्रतीक्षा करा जेव्हा आमचे AI तुमच्या प्रतिमा तपासत आहे...",
		uploadingImages: "क्लाउडवर प्रतिमा अपलोड होत आहेत...",
		fetchingWeather: "हवामान डेटा मिळवत आहे...",
		runningDiagnosis: "दृश्य निदान चालू आहे...",
		verifyingRef: "संदर्भ प्रतिमांसह सत्यापन...",
		generatingPlan: "उपचार योजना तयार करत आहे...",
		diagnosisResults: "निदान परिणाम",
		newAnalysis: "नवीन विश्लेषण",
		diseaseDetected: "रोग आढळला",
		confidence: "आत्मविश्वास",
		severity: "तीव्रता",
		treatmentPlan: "उपचार योजना",
		immediateActions: "तात्काळ कृती",
		preventive: "प्रतिबंधात्मक उपाय",
		recommendedProducts: "शिफारस केलेली उत्पादने",
		dosage: "डोस",
		application: "अर्ज",
		weatherContext: "हवामान संदर्भ",
		aiVerification: "AI सत्यापन लॉग",
		howAnalyzed: "आम्ही तुमच्या पिकाचे विश्लेषण कसे केले:",
		chatAssistant: "AI सहाय्यकासह चॅट करा",
		askQuestion: "निदानाबद्दल विचारा...",
		back: "मागे",
		loading: "लोड होत आहे...",
		error: "त्रुटी",
		success: "यश",
	},

	te: {
		// Telugu
		selectLanguage: "మీ భాషను ఎంచుకోండి",
		chooseLanguage: "కొనసాగించడానికి మీ ఇష్టమైన భాషను ఎంచుకోండి",
		home: "హోమ్",
		aboutUs: "మా గురించి",
		tryForFree: "ఉచితంగా ప్రయత్నించండి",
		trustedBy: "నమ్మదగిన",
		farmers: "భారతదేశంలోని రైతులు",
		stopDisease: "పంట వ్యాధిని ఆపండి",
		beforeSpreads: "వ్యాపించే ముందు",
		heroDesc:
			"మీ ఫోన్‌లో తక్షణ, ఖచ్చితమైన రోగనిర్ధారణ. శాస్త్రీయ డేటా మరియు స్థానిక వాతావరణంతో అధునాతన AI.",
		diagnoseNow: "ఇప్పుడే ఉచితంగా తనిఖీ చేయండి",
		noCreditCard: "క్రెడిట్ కార్డ్ అవసరం లేదు",
		accuracy: "95%+ ఖచ్చితత్వం",
		howWorks: "ఇది ఎలా పనిచేస్తుంది",
		step1: "ఫోటోలను అప్‌లోడ్ చేయండి",
		step1Desc: "ప్రభావిత ఆకుల 1-3 స్పష్టమైన ఫోటోలను తీయండి",
		step2: "AI విశ్లేషణ",
		step2Desc: "వాతావరణ సహసంబంధంతో Dual-agent AI",
		step3: "చికిత్స పొందండి",
		step3Desc: "నిర్దిష్ట ఔషధం & నివారణ చర్యలు",
		newConsultation: "కొత్త సంప్రదింపు",
		fillDetails: "దిగువ వివరాలను పూరించండి మరియు మీ ప్రభావిత పంట చిత్రాలను అప్‌లోడ్ చేయండి.",
		location: "స్థానం",
		useLocation: "నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి",
		latitude: "అక్షాంశం",
		longitude: "రేఖాంశం",
		farmerDetails: "రైతు వివరాలు",
		yourName: "మీ పేరు",
		enterName: "మీ పూర్తి పేరును నమోదు చేయండి",
		village: "గ్రామం/పట్టణం",
		enterVillage: "మీ గ్రామం పేరును నమోదు చేయండి",
		cropDetails: "పంట వివరాలు",
		selectCrop: "పంటను ఎంచుకోండి",
		apple: "ఆపిల్",
		rice: "బియ్యం",
		tomato: "టమాటో",
		sownDate: "విత్తిన తేదీ (ఐచ్ఛికం)",
		observations: "మీ పరిశీలనలు (ఐచ్ఛికం)",
		observationsPlaceholder:
			"మీరు గమనించినది వివరించండి... (ఉదా., పసుపు మచ్చలు, వాడిపోవడం)",
		uploadImages: "చిత్రాలను అప్‌లోడ్ చేయండి (1-3 ఫోటోలు)",
		clickUpload: "అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి లేదా డ్రాగ్ అండ్ డ్రాప్ చేయండి",
		jpegPng: "ఒక్కొక్కటి 5MB వరకు JPEG, PNG, WebP",
		analyzeCrop: "పంట వ్యాధి విశ్లేషణ చేయండి",
		analyzingCrop: "మీ పంటను విశ్లేషిస్తోంది",
		pleaseWait: "దయచేసి వేచి ఉండండి మా AI మీ చిత్రాలను పరిశీలిస్తోంది...",
		uploadingImages: "క్లౌడ్‌కు చిత్రాలను అప్‌లోడ్ చేస్తోంది...",
		fetchingWeather: "వాతావరణ డేటాను పొందుతోంది...",
		runningDiagnosis: "దృశ్య రోగనిర్ధారణ నడుస్తోంది...",
		verifyingRef: "సూచన చిత్రాలతో ధృవీకరిస్తోంది...",
		generatingPlan: "చికిత్స ప్రణాళికను రూపొందిస్తోంది...",
		diagnosisResults: "రోగనిర్ధారణ ఫలితాలు",
		newAnalysis: "కొత్త విశ్లేషణ",
		diseaseDetected: "వ్యాధి గుర్తించబడింది",
		confidence: "విశ్వాసం",
		severity: "తీవ్రత",
		treatmentPlan: "చికిత్స ప్రణాళిక",
		immediateActions: "తక్షణ చర్యలు",
		preventive: "నివారణ చర్యలు",
		recommendedProducts: "సిఫార్సు చేయబడిన ఉత్పత్తులు",
		dosage: "మోతాదు",
		application: "అప్లికేషన్",
		weatherContext: "వాతావరణ సందర్భం",
		aiVerification: "AI ధృవీకరణ లాగ్",
		howAnalyzed: "మేము మీ పంటను ఎలా విశ్లేషించాము:",
		chatAssistant: "AI సహాయకుడితో చాట్ చేయండి",
		askQuestion: "రోగనిర్ధారణ గురించి అడగండి...",
		back: "వెనుకకు",
		loading: "లోడ్ అవుతోంది...",
		error: "లోపం",
		success: "విజయం",
	},

	kn: {
		// Kannada
		selectLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
		chooseLanguage: "ಮುಂದುವರಿಸಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
		home: "ಹೋಮ್",
		aboutUs: "ನಮ್ಮ ಬಗ್ಗೆ",
		tryForFree: "ಉಚಿತವಾಗಿ ಪ್ರಯತ್ನಿಸಿ",
		trustedBy: "ವಿಶ್ವಾಸಾರ್ಹ",
		farmers: "ಭಾರತದಾದ್ಯಂತ ರೈತರು",
		stopDisease: "ಬೆಳೆ ರೋಗವನ್ನು ನಿಲ್ಲಿಸಿ",
		beforeSpreads: "ಹರಡುವ ಮೊದಲು",
		heroDesc:
			"ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ತ್ವರಿತ, ನಿಖರವಾದ ರೋಗನಿರ್ಣಯ. ವೈಜ್ಞಾನಿಕ ಡೇಟಾ ಮತ್ತು ಸ್ಥಳೀಯ ಹವಾಮಾನದೊಂದಿಗೆ ಸುಧಾರಿತ AI.",
		diagnoseNow: "ಈಗ ಉಚಿತವಾಗಿ ಪರೀಕ್ಷಿಸಿ",
		noCreditCard: "ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ",
		accuracy: "95%+ ನಿಖರತೆ",
		howWorks: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
		step1: "ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
		step1Desc: "ಪೀಡಿತ ಎಲೆಗಳ 1-3 ಸ್ಪಷ್ಟ ಫೋಟೋಗಳನ್ನು ತೆಗೆಯಿರಿ",
		step2: "AI ವಿಶ್ಲೇಷಣೆ",
		step2Desc: "ಹವಾಮಾನ ಪರಸ್ಪರ ಸಂಬಂಧದೊಂದಿಗೆ Dual-agent AI",
		step3: "ಚಿಕಿತ್ಸೆ ಪಡೆಯಿರಿ",
		step3Desc: "ನಿರ್ದಿಷ್ಟ ಔಷಧ ಮತ್ತು ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು",
		newConsultation: "ಹೊಸ ಸಮಾಲೋಚನೆ",
		fillDetails: "ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಪೀಡಿತ ಬೆಳೆಯ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
		location: "ಸ್ಥಳ",
		useLocation: "ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
		latitude: "ಅಕ್ಷಾಂಶ",
		longitude: "ರೇಖಾಂಶ",
		farmerDetails: "ರೈತ ವಿವರಗಳು",
		yourName: "ನಿಮ್ಮ ಹೆಸರು",
		enterName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
		village: "ಗ್ರಾಮ/ಪಟ್ಟಣ",
		enterVillage: "ನಿಮ್ಮ ಗ್ರಾಮದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
		cropDetails: "ಬೆಳೆ ವಿವರಗಳು",
		selectCrop: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
		apple: "ಸೇಬು",
		rice: "ಅಕ್ಕಿ",
		tomato: "ಟೊಮೇಟೊ",
		sownDate: "ಬಿತ್ತನೆ ದಿನಾಂಕ (ಐಚ್ಛಿಕ)",
		observations: "ನಿಮ್ಮ ಅವಲೋಕನಗಳು (ಐಚ್ಛಿಕ)",
		observationsPlaceholder:
			"ನೀವು ಗಮನಿಸಿದ್ದನ್ನು ವಿವರಿಸಿ... (ಉದಾ., ಹಳದಿ ಚುಕ್ಕೆಗಳು, ಬಾಡುವಿಕೆ)",
		uploadImages: "ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (1-3 ಫೋಟೋಗಳು)",
		clickUpload: "ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಮಾಡಿ",
		jpegPng: "ಪ್ರತಿಯೊಂದೂ 5MB ವರೆಗೆ JPEG, PNG, WebP",
		analyzeCrop: "ಬೆಳೆ ರೋಗವನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
		analyzingCrop: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ",
		pleaseWait: "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ ನಮ್ಮ AI ನಿಮ್ಮ ಚಿತ್ರಗಳನ್ನು ಪರೀಕ್ಷಿಸುತ್ತಿದೆ...",
		uploadingImages: "ಕ್ಲೌಡ್‌ಗೆ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
		fetchingWeather: "ಹವಾಮಾನ ಡೇಟಾವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
		runningDiagnosis: "ದೃಶ್ಯ ರೋಗನಿರ್ಣಯ ನಡೆಯುತ್ತಿದೆ...",
		verifyingRef: "ಉಲ್ಲೇಖ ಚಿತ್ರಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
		generatingPlan: "ಚಿಕಿತ್ಸಾ ಯೋಜನೆಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...",
		diagnosisResults: "ರೋಗನಿರ್ಣಯ ಫಲಿತಾಂಶಗಳು",
		newAnalysis: "ಹೊಸ ವಿಶ್ಲೇಷಣೆ",
		diseaseDetected: "ರೋಗ ಪತ್ತೆಯಾಗಿದೆ",
		confidence: "ವಿಶ್ವಾಸ",
		severity: "ತೀವ್ರತೆ",
		treatmentPlan: "ಚಿಕಿತ್ಸಾ ಯೋಜನೆ",
		immediateActions: "ತಕ್ಷಣದ ಕ್ರಮಗಳು",
		preventive: "ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು",
		recommendedProducts: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಉತ್ಪನ್ನಗಳು",
		dosage: "ಡೋಸೇಜ್",
		application: "ಅಪ್ಲಿಕೇಶನ್",
		weatherContext: "ಹವಾಮಾನ ಸಂದರ್ಭ",
		aiVerification: "AI ಪರಿಶೀಲನೆ ಲಾಗ್",
		howAnalyzed: "ನಾವು ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಹೇಗೆ ವಿಶ್ಲೇಷಿಸಿದ್ದೇವೆ:",
		chatAssistant: "AI ಸಹಾಯಕರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ",
		askQuestion: "ರೋಗನಿರ್ಣಯದ ಬಗ್ಗೆ ಕೇಳಿ...",
		back: "ಹಿಂದೆ",
		loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
		error: "ದೋಷ",
		success: "ಯಶಸ್ಸು",
	},

	bn: {
		// Bengali
		selectLanguage: "আপনার ভাষা নির্বাচন করুন",
		chooseLanguage: "চালিয়ে যেতে আপনার পছন্দের ভাষা চয়ন করুন",
		home: "হোম",
		aboutUs: "আমাদের সম্পর্কে",
		tryForFree: "বিনামূল্যে চেষ্টা করুন",
		trustedBy: "বিশ্বস্ত",
		farmers: "ভারত জুড়ে কৃষক",
		stopDisease: "ফসলের রোগ বন্ধ করুন",
		beforeSpreads: "ছড়ানোর আগে",
		heroDesc:
			"আপনার ফোনে তাৎক্ষণিক, সঠিক রোগ নির্ণয়। বৈজ্ঞানিক তথ্য এবং স্থানীয় আবহাওয়া সহ উন্নত AI।",
		diagnoseNow: "এখনই বিনামূল্যে পরীক্ষা করুন",
		noCreditCard: "ক্রেডিট কার্ডের প্রয়োজন নেই",
		accuracy: "95%+ নির্ভুলতা",
		howWorks: "এটি কিভাবে কাজ করে",
		step1: "ফটো আপলোড করুন",
		step1Desc: "আক্রান্ত পাতার 1-3টি পরিষ্কার ফটো তুলুন",
		step2: "AI বিশ্লেষণ",
		step2Desc: "আবহাওয়া সহসম্বন্ধ সহ Dual-agent AI",
		step3: "চিকিৎসা পান",
		step3Desc: "নির্দিষ্ট ওষুধ এবং প্রতিরোধমূলক ব্যবস্থা",
		newConsultation: "নতুন পরামর্শ",
		fillDetails: "নীচের বিবরণ পূরণ করুন এবং আপনার আক্রান্ত ফসলের ছবি আপলোড করুন।",
		location: "অবস্থান",
		useLocation: "আমার বর্তমান অবস্থান ব্যবহার করুন",
		latitude: "অক্ষাংশ",
		longitude: "দ্রাঘিমাংশ",
		farmerDetails: "কৃষক বিবরণ",
		yourName: "আপনার নাম",
		enterName: "আপনার পুরো নাম লিখুন",
		village: "গ্রাম/শহর",
		enterVillage: "আপনার গ্রামের নাম লিখুন",
		cropDetails: "ফসল বিবরণ",
		selectCrop: "ফসল নির্বাচন করুন",
		apple: "আপেল",
		rice: "চাল",
		tomato: "টমেটো",
		sownDate: "বপনের তারিখ (ঐচ্ছিক)",
		observations: "আপনার পর্যবেক্ষণ (ঐচ্ছিক)",
		observationsPlaceholder:
			"আপনি কি লক্ষ্য করেছেন তা বর্ণনা করুন... (যেমন, হলুদ দাগ, শুকিয়ে যাওয়া)",
		uploadImages: "ছবি আপলোড করুন (1-3 ফটো)",
		clickUpload: "আপলোড করতে ক্লিক করুন বা ড্র্যাগ এবং ড্রপ করুন",
		jpegPng: "প্রতিটি 5MB পর্যন্ত JPEG, PNG, WebP",
		analyzeCrop: "ফসলের রোগ বিশ্লেষণ করুন",
		analyzingCrop: "আপনার ফসল বিশ্লেষণ করা হচ্ছে",
		pleaseWait: "অনুগ্রহ করে অপেক্ষা করুন আমাদের AI আপনার ছবি পরীক্ষা করছে...",
		uploadingImages: "ক্লাউডে ছবি আপলোড করা হচ্ছে...",
		fetchingWeather: "আবহাওয়া তথ্য আনা হচ্ছে...",
		runningDiagnosis: "ভিজ্যুয়াল রোগ নির্ণয় চলছে...",
		verifyingRef: "রেফারেন্স ছবির সাথে যাচাই করা হচ্ছে...",
		generatingPlan: "চিকিৎসা পরিকল্পনা তৈরি করা হচ্ছে...",
		diagnosisResults: "রোগ নির্ণয় ফলাফল",
		newAnalysis: "নতুন বিশ্লেষণ",
		diseaseDetected: "রোগ সনাক্ত করা হয়েছে",
		confidence: "আত্মবিশ্বাস",
		severity: "তীব্রতা",
		treatmentPlan: "চিকিৎসা পরিকল্পনা",
		immediateActions: "তাৎক্ষণিক পদক্ষেপ",
		preventive: "প্রতিরোধমূলক ব্যবস্থা",
		recommendedProducts: "প্রস্তাবিত পণ্য",
		dosage: "ডোজ",
		application: "আবেদন",
		weatherContext: "আবহাওয়া প্রসঙ্গ",
		aiVerification: "AI যাচাইকরণ লগ",
		howAnalyzed: "আমরা কিভাবে আপনার ফসল বিশ্লেষণ করেছি:",
		chatAssistant: "AI সহায়কের সাথে চ্যাট করুন",
		askQuestion: "রোগ নির্ণয় সম্পর্কে জিজ্ঞাসা করুন...",
		back: "ফিরে যান",
		loading: "লোড হচ্ছে...",
		error: "ত্রুটি",
		success: "সাফল্য",
	},

	ta: {
		// Tamil
		selectLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
		chooseLanguage: "தொடர உங்கள் விருப்ப மொழியைத் தேர்வு செய்யவும்",
		home: "முகப்பு",
		aboutUs: "எங்களை பற்றி",
		tryForFree: "இலவசமாக முயற்சிக்கவும்",
		trustedBy: "நம்பகமான",
		farmers: "இந்தியா முழுவதும் விவசாயிகள்",
		stopDisease: "பயிர் நோயை நிறுத்துங்கள்",
		beforeSpreads: "பரவும் முன்",
		heroDesc:
			"உங்கள் தொலைபேசியில் உடனடி, துல்லியமான நோயறிதல். அறிவியல் தரவு மற்றும் உள்ளூர் வானிலையுடன் மேம்பட்ட AI.",
		diagnoseNow: "இப்போதே இலவசமாக பரிசோதிக்கவும்",
		noCreditCard: "கடன் அட்டை தேவையில்லை",
		accuracy: "95%+ துல்லியம்",
		howWorks: "இது எப்படி வேலை செய்கிறது",
		step1: "புகைப்படங்களை பதிவேற்றவும்",
		step1Desc: "பாதிக்கப்பட்ட இலைகளின் 1-3 தெளிவான புகைப்படங்களை எடுக்கவும்",
		step2: "AI பகுப்பாய்வு",
		step2Desc: "வானிலை தொடர்புடன் Dual-agent AI",
		step3: "சிகிச்சை பெறவும்",
		step3Desc: "குறிப்பிட்ட மருந்து மற்றும் தடுப்பு நடவடிக்கைகள்",
		newConsultation: "புதிய ஆலோசனை",
		fillDetails:
			"கீழே விவரங்களை நிரப்பி, உங்கள் பாதிக்கப்பட்ட பயிரின் படங்களைப் பதிவேற்றவும்.",
		location: "இடம்",
		useLocation: "எனது தற்போதைய இடத்தைப் பயன்படுத்தவும்",
		latitude: "அட்சரேகை",
		longitude: "தீர்க்கரேகை",
		farmerDetails: "விவசாயி விவரங்கள்",
		yourName: "உங்கள் பெயர்",
		enterName: "உங்கள் முழு பெயரை உள்ளிடவும்",
		village: "கிராமம்/நகரம்",
		enterVillage: "உங்கள் கிராமத்தின் பெயரை உள்ளிடவும்",
		cropDetails: "பயிர் விவரங்கள்",
		selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
		apple: "ஆப்பிள்",
		rice: "அரிசி",
		tomato: "தக்காளி",
		sownDate: "விதைத்த தேதி (விருப்பத்தேர்வு)",
		observations: "உங்கள் கவனிப்புகள் (விருப்பத்தேர்வு)",
		observationsPlaceholder:
			"நீங்கள் கவனித்ததை விவரிக்கவும்... (எ.கா., மஞ்சள் புள்ளிகள், வாடுதல்)",
		uploadImages: "படங்களை பதிவேற்றவும் (1-3 புகைப்படங்கள்)",
		clickUpload: "பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்",
		jpegPng: "ஒவ்வொன்றும் 5MB வரை JPEG, PNG, WebP",
		analyzeCrop: "பயிர் நோயை பகுப்பாய்வு செய்யவும்",
		analyzingCrop: "உங்கள் பயிர் பகுப்பாய்வு செய்யப்படுகிறது",
		pleaseWait: "தயவுசெய்து காத்திருக்கவும் எங்கள் AI உங்கள் படங்களை பரிசோதிக்கிறது...",
		uploadingImages: "மேகத்திற்கு படங்களை பதிவேற்றுகிறது...",
		fetchingWeather: "வானிலை தரவை பெறுகிறது...",
		runningDiagnosis: "காட்சி நோயறிதல் இயங்குகிறது...",
		verifyingRef: "குறிப்பு படங்களுடன் சரிபார்க்கிறது...",
		generatingPlan: "சிகிச்சை திட்டத்தை உருவாக்குகிறது...",
		diagnosisResults: "நோயறிதல் முடிவுகள்",
		newAnalysis: "புதிய பகுப்பாய்வு",
		diseaseDetected: "நோய் கண்டறியப்பட்டது",
		confidence: "நம்பிக்கை",
		severity: "தீவிரம்",
		treatmentPlan: "சிகிச்சை திட்டம்",
		immediateActions: "உடனடி நடவடிக்கைகள்",
		preventive: "தடுப்பு நடவடிக்கைகள்",
		recommendedProducts: "பரிந்துரைக்கப்பட்ட தயாரிப்புகள்",
		dosage: "அளவு",
		application: "பயன்பாடு",
		weatherContext: "வானிலை சூழல்",
		aiVerification: "AI சரிபார்ப்பு பதிவு",
		howAnalyzed: "நாங்கள் உங்கள் பயிரை எப்படி பகுப்பாய்வு செய்தோம்:",
		chatAssistant: "AI உதவியாளருடன் அரட்டை",
		askQuestion: "நோயறிதல் பற்றி கேளுங்கள்...",
		back: "பின் செல்",
		loading: "ஏற்றுகிறது...",
		error: "பிழை",
		success: "வெற்றி",
	},
};

// Language selector popup component
const LanguageSelector = ({ onSelect, currentLang }) => {
	const languages = [
		{ code: "en", name: "English", flag: "🇬🇧", native: "English" },
		{ code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिंदी" },
		{ code: "mr", name: "Marathi", flag: "🇮🇳", native: "मराठी" },
		{ code: "te", name: "Telugu", flag: "🇮🇳", native: "తెలుగు" },
		{ code: "kn", name: "Kannada", flag: "🇮🇳", native: "ಕನ್ನಡ" },
		{ code: "bn", name: "Bengali", flag: "🇮🇳", native: "বাংলা" },
		{ code: "ta", name: "Tamil", flag: "🇮🇳", native: "தமிழ்" },
	];

	const t = translations[currentLang] || translations.en;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
			>
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<Globe className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-3xl font-bold text-gray-900 mb-2">
						{t.selectLanguage}
					</h2>
					<p className="text-gray-600">{t.chooseLanguage}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{languages.map((lang) => (
						<button
							key={lang.code}
							onClick={() => onSelect(lang.code)}
							className={`p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
								currentLang === lang.code
									? "border-primary-500 bg-primary-50"
									: "border-gray-200 hover:border-primary-300"
							}`}
						>
							<div className="flex items-center gap-3">
								<span className="text-4xl">{lang.flag}</span>
								<div className="text-left">
									<div className="font-bold text-gray-900">{lang.native}</div>
									<div className="text-sm text-gray-500">{lang.name}</div>
								</div>
							</div>
						</button>
					))}
				</div>
			</motion.div>
		</div>
	);
};

// ============================================
// CONFIGURATION
// ============================================
const API_URL = "http://localhost:8000";

const STATES = {
	LANDING: "LANDING",
	FORM: "FORM",
	ANALYZING: "ANALYZING",
	RESULT: "RESULT",
};

const FORM_STEPS = {
	IMAGES: 0,
	LOCATION: 1,
	FARMER_INFO: 2,
	CROP_INFO: 3,
};

const CROPS = [
	{ value: "Apple", icon: "🍎" },
	{ value: "Rice", icon: "🌾" },
	{ value: "Tomato", icon: "🍅" },
];

// ANALYSIS_STEPS will be created dynamically using translations
const getAnalysisSteps = (t) => [
	{ id: 1, label: t.uploadingImages, icon: Upload },
	{ id: 2, label: t.fetchingWeather, icon: CloudRain },
	{ id: 3, label: t.runningDiagnosis, icon: Microscope },
	{ id: 4, label: t.verifyingRef, icon: Shield },
	{ id: 5, label: t.generatingPlan, icon: FileText },
];

const IMAGE_SLOTS = [
	{ id: 0, label: "Leaf Photo 1", description: "Top view of affected leaf" },
	{ id: 1, label: "Leaf Photo 2", description: "Close-up of symptoms" },
	{ id: 2, label: "Leaf Photo 3", description: "Underside or stem area" },
];

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = ({
	onTryFree,
	showBack = false,
	onBack,
	title = null,
	children,
	t = translations.en,
	onLanguageClick,
	currentLang = "en",
}) => {
	const getLangFlag = (code) => {
		const flags = {
			en: "🇬🇧",
			hi: "🇮🇳",
			mr: "🇮🇳",
			te: "🇮🇳",
			kn: "🇮🇳",
			bn: "🇮🇳",
			ta: "🇮🇳",
		};
		return flags[code] || "🌐";
	};

	return (
		<nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
			<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
				{/* Left - Logo */}
				<div className="flex items-center gap-3">
					{showBack && (
						<button
							type="button"
							onClick={onBack}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
						>
							<ArrowLeft className="w-5 h-5 text-gray-600" />
						</button>
					)}
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
							<Leaf className="w-4 h-4 text-white" />
						</div>
						<span className="text-xl font-bold text-primary-900">
							{title || "AgroVision"}
						</span>
					</div>
				</div>

				{/* Center - Nav Links */}
				{!showBack && !children && (
					<div className="hidden md:flex items-center gap-6">
						<a
							href="#home"
							className="text-gray-700 hover:text-primary-900 font-semibold px-4 py-2 rounded-lg hover:bg-primary-50 transition-all relative group"
						>
							{t.home}
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
						</a>
						<a
							href="#about"
							className="text-gray-700 hover:text-primary-900 font-semibold px-4 py-2 rounded-lg hover:bg-primary-50 transition-all relative group"
						>
							{t.aboutUs}
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
						</a>
					</div>
				)}

				{/* Right - CTA, Language Selector, or Children */}
				<div className="flex items-center gap-3">
					{/* Language Switcher Button */}
					<button
						type="button"
						onClick={onLanguageClick}
						className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
						title="Change Language"
					>
						<Globe className="w-4 h-4 text-gray-600" />
						<span className="text-sm font-medium">
							{getLangFlag(currentLang)}
						</span>
					</button>

					{children}
					{!showBack && !children && (
						<button
							type="button"
							onClick={onTryFree}
							className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
						>
							{t.tryForFree}
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};

// ============================================
// REALISTIC PHONE MOCKUP COMPONENT
// ============================================
const PhoneMockup = () => (
	<div className="relative perspective-1000">
		{/* Phone Container with 3D effect */}
		<div className="relative transform hover:scale-105 transition-transform duration-500 ease-out">
			{/* Outer Phone Frame - iPhone Style */}
			<div className="relative w-[380px] h-[780px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[3.5rem] p-3 shadow-2xl">
				{/* Inner Shadow for depth */}
				<div className="absolute inset-3 rounded-[3rem] shadow-inner opacity-50"></div>

				{/* Volume Buttons */}
				<div className="absolute left-0 top-32 w-1 h-12 bg-gray-700 rounded-r-sm"></div>
				<div className="absolute left-0 top-48 w-1 h-8 bg-gray-700 rounded-r-sm"></div>
				<div className="absolute left-0 top-60 w-1 h-8 bg-gray-700 rounded-r-sm"></div>

				{/* Power Button */}
				<div className="absolute right-0 top-36 w-1 h-16 bg-gray-700 rounded-l-sm"></div>

				{/* Screen Container */}
				<div className="relative w-full h-full bg-black rounded-[3rem] overflow-hidden shadow-xl">
					{/* Screen Reflection Effect */}
					<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-30"></div>

					{/* Dynamic Island / Notch */}
					<div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-full z-40 shadow-lg">
						{/* Camera */}
						<div className="absolute top-2 left-4 w-2 h-2 bg-gray-800 rounded-full ring-1 ring-gray-700"></div>
						{/* Proximity Sensor */}
						<div className="absolute top-2.5 right-4 w-8 h-1 bg-gray-900 rounded-full"></div>
					</div>

					{/* Status Bar */}
					<div className="relative pt-4 pb-2 px-8 flex items-center justify-between z-20">
						<div className="flex items-center gap-1 text-white">
							<span className="text-xs font-semibold">9:41</span>
						</div>
						<div className="flex items-center gap-1">
							{/* Signal */}
							<div className="flex gap-0.5">
								<div className="w-0.5 h-2 bg-white rounded-full"></div>
								<div className="w-0.5 h-3 bg-white rounded-full"></div>
								<div className="w-0.5 h-4 bg-white rounded-full"></div>
								<div className="w-0.5 h-5 bg-white rounded-full"></div>
							</div>
							{/* WiFi */}
							<svg
								className="w-4 h-4 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 112 0 1 1 0 01-2 0z" />
							</svg>
							{/* Battery */}
							<div className="flex items-center gap-0.5">
								<div className="w-6 h-3 border border-white rounded-sm relative">
									<div className="absolute inset-0.5 bg-white rounded-sm"></div>
								</div>
								<div className="w-0.5 h-1.5 bg-white rounded-r-sm"></div>
							</div>
						</div>
					</div>

					{/* App Content */}
					<div className="relative h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-y-auto px-5 pb-20">
						{/* App Header */}
						<div className="pt-6 pb-4">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
										<Leaf className="w-7 h-7 text-white" />
									</div>
									<div>
										<h1 className="text-lg font-bold text-gray-900">
											AgriVision
										</h1>
										<p className="text-xs text-gray-500">AI Crop Doctor</p>
									</div>
								</div>
								<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
									<User className="w-5 h-5 text-gray-600" />
								</div>
							</div>

							{/* Stats Cards */}
							<div className="grid grid-cols-3 gap-2 mb-6">
								<div className="bg-white rounded-xl p-3 shadow-sm">
									<div className="text-2xl font-bold text-primary-600">94%</div>
									<div className="text-xs text-gray-500">Accuracy</div>
								</div>
								<div className="bg-white rounded-xl p-3 shadow-sm">
									<div className="text-2xl font-bold text-orange-500">50K+</div>
									<div className="text-xs text-gray-500">Farmers</div>
								</div>
								<div className="bg-white rounded-xl p-3 shadow-sm">
									<div className="text-2xl font-bold text-green-600">15+</div>
									<div className="text-xs text-gray-500">Diseases</div>
								</div>
							</div>
						</div>

						{/* Diagnosis Card */}
						<div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
							<div className="flex items-start gap-3 mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
									<CheckCircle className="w-7 h-7 text-white" />
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-gray-900 mb-1">
										Diagnosis Complete
									</h3>
									<p className="text-sm text-gray-600">
										Early Blight detected with high confidence
									</p>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="mb-4">
								<div className="flex justify-between text-xs text-gray-500 mb-1">
									<span>Confidence Level</span>
									<span className="font-semibold text-primary-600">94%</span>
								</div>
								<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
									<div className="h-full w-[94%] bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
								</div>
							</div>

							{/* Weather Info */}
							<div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl mb-4">
								<CloudRain className="w-4 h-4 text-blue-600" />
								<span className="text-xs text-gray-700">
									Weather data verified • High humidity
								</span>
							</div>

							{/* CTA Button */}
							<button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
								View Treatment Plan
								<ArrowRight className="w-4 h-4" />
							</button>
						</div>

						{/* Quick Actions */}
						<div className="grid grid-cols-2 gap-3 mt-5">
							<button className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center gap-3">
								<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
									<Microscope className="w-5 h-5 text-purple-600" />
								</div>
								<div className="text-left">
									<div className="font-semibold text-sm text-gray-900">
										History
									</div>
									<div className="text-xs text-gray-500">12 scans</div>
								</div>
							</button>
							<button className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center gap-3">
								<div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
									<MessageSquare className="w-5 h-5 text-amber-600" />
								</div>
								<div className="text-left">
									<div className="font-semibold text-sm text-gray-900">
										AI Chat
									</div>
									<div className="text-xs text-gray-500">Ask me</div>
								</div>
							</button>
						</div>
					</div>

					{/* Home Indicator */}
					<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-white/30 rounded-full"></div>
				</div>
			</div>

			{/* Shadow and Glow Effects */}
			<div className="absolute -inset-4 bg-gradient-to-br from-primary-500/20 via-transparent to-orange-500/20 rounded-[4rem] blur-3xl -z-10 opacity-60"></div>
		</div>
	</div>
);

// ============================================
// IMAGE UPLOAD SLOT COMPONENT
// ============================================
const ImageSlot = ({ slot, file, preview, onSelect, onRemove }) => {
	const inputRef = useRef(null);

	const handleClick = () => {
		inputRef.current?.click();
	};

	const handleChange = (e) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			onSelect(slot.id, selectedFile);
		}
		// Reset input so same file can be selected again
		e.target.value = "";
	};

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				capture="environment"
				onChange={handleChange}
				className="hidden"
			/>

			{preview ? (
				// Image Preview with Zoom Effect
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 200, damping: 20 }}
					className="relative group"
				>
					<div className="aspect-square rounded-xl overflow-hidden border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-lg hover:shadow-2xl transition-all">
						<img
							src={preview}
							alt={slot.label}
							className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
						/>
						{/* Quality Indicator */}
						<div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
							<CheckCircle className="w-3 h-3" />
							Perfect!
						</div>
						{/* Checkmark Badge */}
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring" }}
							className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg"
						>
							<CheckCircle className="w-5 h-5" />
						</motion.div>
					</div>
					{/* Remove Button */}
					<motion.button
						type="button"
						onClick={() => onRemove(slot.id)}
						whileHover={{ scale: 1.1, rotate: 90 }}
						whileTap={{ scale: 0.9 }}
						className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors z-10"
					>
						<Trash2 className="w-4 h-4" />
					</motion.button>
					{/* Label */}
					<p className="text-center text-sm font-bold text-primary-700 mt-2 flex items-center justify-center gap-1">
						<Star className="w-4 h-4 text-yellow-500" />
						{slot.label} ✓
					</p>
				</motion.div>
			) : (
				// Empty Slot with Animated Icon
				<button
					type="button"
					onClick={handleClick}
					className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group transform hover:scale-105 hover:-translate-y-1 shadow-sm hover:shadow-lg"
				>
					<div className="relative w-12 h-12">
						<div className="absolute inset-0 rounded-full bg-primary-200 opacity-0 group-hover:opacity-100 animate-pulse-slow" />
						<div className="relative w-12 h-12 rounded-full bg-gray-200 group-hover:bg-primary-100 flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110">
							<Camera className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
						</div>
					</div>
					<div className="text-center">
						<p className="font-medium text-gray-700 group-hover:text-primary-700">
							{slot.label}
						</p>
						<p className="text-xs text-gray-500 mt-0.5">{slot.description}</p>
					</div>
					<div className="flex items-center gap-1 text-xs text-gray-400">
						<ImagePlus className="w-3 h-3" />
						<span>Tap to capture</span>
					</div>
				</button>
			)}
		</div>
	);
};

// ============================================
// GAMIFICATION COMPONENTS
// ============================================

// Confetti Component
const Confetti = () => {
	const particles = Array.from({ length: 50 });
	const colors = [
		"#22c55e", // primary-500 green
		"#16a34a", // primary-600 green
		"#F97316", // secondary-500 orange
		"#ea580c", // secondary-600 orange
		"#fb923c", // secondary-400 orange
		"#fbbf24", // yellow-400
		"#86efac", // primary-300 light green
	];

	return (
		<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
			{particles.map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-2 h-2 rounded-full"
					style={{
						backgroundColor: colors[i % colors.length],
						left: `${Math.random() * 100}%`,
						top: -20,
					}}
					initial={{ y: -20, opacity: 1, rotate: 0 }}
					animate={{
						y: window.innerHeight + 20,
						opacity: 0,
						rotate: Math.random() * 360,
						x: (Math.random() - 0.5) * 200,
					}}
					transition={{
						duration: 2 + Math.random() * 2,
						ease: "easeOut",
						delay: Math.random() * 0.5,
					}}
				/>
			))}
		</div>
	);
};

// Achievement Notification
const AchievementNotification = ({ achievement }) => {
	const getIcon = () => {
		switch (achievement.type) {
			case "level":
				return <Trophy className="w-6 h-6 text-yellow-300" />;
			case "badge":
				return <Award className="w-6 h-6 text-yellow-300" />;
			case "points":
				return <Star className="w-6 h-6 text-yellow-300" />;
			default:
				return <Zap className="w-6 h-6 text-yellow-300" />;
		}
	};

	return (
		<motion.div
			initial={{ y: -100, opacity: 0, scale: 0.8 }}
			animate={{ y: 20, opacity: 1, scale: 1 }}
			exit={{ y: -100, opacity: 0, scale: 0.8 }}
			className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
		>
			<div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]">
				<motion.div
					animate={{ rotate: [0, 360] }}
					transition={{ duration: 0.6, ease: "easeInOut" }}
				>
					{getIcon()}
				</motion.div>
				<div>
					<p className="font-bold text-lg">{achievement.message}</p>
				</div>
			</div>
		</motion.div>
	);
};

// Points Earned Animation
const PointsEarned = ({ points }) => {
	if (!points) return null;

	return (
		<motion.div
			initial={{ y: 0, opacity: 1 }}
			animate={{ y: -50, opacity: 0 }}
			className="fixed top-24 right-8 z-40"
		>
			<div className="bg-gradient-to-r from-secondary-400 to-secondary-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg flex items-center gap-2">
				<Coins className="w-5 h-5" />+{points} XP
			</div>
		</motion.div>
	);
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<svg width={size} height={size} className="transform -rotate-90">
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				stroke="currentColor"
				strokeWidth={strokeWidth}
				fill="none"
				className="text-gray-200"
			/>
			<motion.circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				stroke="currentColor"
				strokeWidth={strokeWidth}
				fill="none"
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				className="text-primary-600"
				initial={{ strokeDashoffset: circumference }}
				animate={{ strokeDashoffset: offset }}
				transition={{ duration: 1, ease: "easeOut" }}
			/>
		</svg>
	);
};

// Gamification Header
const GamificationHeader = ({ points, level, streak, totalScans }) => {
	const progressToNextLevel = points % 100;

	return (
		<motion.div
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white p-4 rounded-2xl shadow-xl mb-6"
		>
			<div className="grid grid-cols-4 gap-4 text-center">
				<div>
					<div className="flex items-center justify-center gap-1 mb-1">
						<Trophy className="w-4 h-4 text-yellow-400" />
						<span className="text-xs opacity-90">Level</span>
					</div>
					<div className="text-2xl font-bold">{level}</div>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1 mb-1">
						<Star className="w-4 h-4 text-yellow-300" />
						<span className="text-xs opacity-90">XP</span>
					</div>
					<div className="text-2xl font-bold">{points}</div>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1 mb-1">
						<Flame className="w-4 h-4 text-orange-300" />
						<span className="text-xs opacity-90">Streak</span>
					</div>
					<div className="text-2xl font-bold">{streak}</div>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1 mb-1">
						<Camera className="w-4 h-4 text-green-300" />
						<span className="text-xs opacity-90">Scans</span>
					</div>
					<div className="text-2xl font-bold">{totalScans}</div>
				</div>
			</div>
			<div className="mt-3">
				<div className="flex justify-between text-xs mb-1">
					<span>Progress to Level {level + 1}</span>
					<span>{progressToNextLevel}/100 XP</span>
				</div>
				<div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
					<motion.div
						className="h-full bg-gradient-to-r from-yellow-400 to-secondary-400 rounded-full"
						initial={{ width: 0 }}
						animate={{ width: `${progressToNextLevel}%` }}
						transition={{ duration: 1, ease: "easeOut" }}
					/>
				</div>
			</div>
		</motion.div>
	);
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
	// Language State - Check if language was previously selected
	const [language, setLanguage] = useState(() => {
		return localStorage.getItem("preferredLanguage") || null;
	});
	const [showLanguageSelector, setShowLanguageSelector] = useState(!language);

	// Get translations for current language
	const t = translations[language] || translations.en;

	// Handle language selection
	const handleLanguageSelect = (langCode) => {
		setLanguage(langCode);
		localStorage.setItem("preferredLanguage", langCode);
		setShowLanguageSelector(false);
	};

	// App State
	const [appState, setAppState] = useState(STATES.LANDING);
	const [currentStep, setCurrentStep] = useState(0);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	// Multi-Step Form State
	const [formStep, setFormStep] = useState(FORM_STEPS.IMAGES);

	// Gamification State
	const [userPoints, setUserPoints] = useState(() => {
		return parseInt(localStorage.getItem("userPoints") || "0");
	});
	const [userLevel, setUserLevel] = useState(() => {
		return parseInt(localStorage.getItem("userLevel") || "1");
	});
	const [totalScans, setTotalScans] = useState(() => {
		return parseInt(localStorage.getItem("totalScans") || "0");
	});
	const [streak, setStreak] = useState(() => {
		return parseInt(localStorage.getItem("streak") || "0");
	});
	const [badges, setBadges] = useState(() => {
		const saved = localStorage.getItem("badges");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAchievement, setShowAchievement] = useState(null);
	const [showConfetti, setShowConfetti] = useState(false);
	const [earnedPoints, setEarnedPoints] = useState(0);

	// Form State
	const [formData, setFormData] = useState({
		lat: "",
		lon: "",
		farmer_name: "",
		village: "",
		crop_name: "Apple",
		sown_date: "",
		observations: "",
	});

	// Image Slots State - Array of 3 slots
	const [imageSlots, setImageSlots] = useState([null, null, null]);
	const [imagePreviews, setImagePreviews] = useState([null, null, null]);
	const [isGettingLocation, setIsGettingLocation] = useState(false);

	// Chat State
	const [chatMessages, setChatMessages] = useState([
		{
			role: "assistant",
			content:
				"I've analyzed your crop. Feel free to ask any questions about the diagnosis or treatment plan!",
		},
	]);
	const [chatInput, setChatInput] = useState("");

	// Refs
	const formRef = useRef(null);
	const chatEndRef = useRef(null);

	// Check if all 3 images are uploaded
	const allImagesUploaded = imageSlots.every((slot) => slot !== null);
	const uploadedCount = imageSlots.filter((slot) => slot !== null).length;

	// Scroll to chat end
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages]);

	// ============================================
	// HANDLERS
	// ============================================
	const getLocation = () => {
		setIsGettingLocation(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setFormData((prev) => ({
					...prev,
					lat: pos.coords.latitude.toFixed(6),
					lon: pos.coords.longitude.toFixed(6),
				}));
				setIsGettingLocation(false);
			},
			() => {
				setError("Could not get location. Please enter manually.");
				setIsGettingLocation(false);
			},
		);
	};

	const handleImageSelect = (slotId, file) => {
		const newSlots = [...imageSlots];
		const newPreviews = [...imagePreviews];

		// Revoke old preview URL if exists
		if (newPreviews[slotId]) {
			URL.revokeObjectURL(newPreviews[slotId]);
		}

		newSlots[slotId] = file;
		newPreviews[slotId] = URL.createObjectURL(file);

		setImageSlots(newSlots);
		setImagePreviews(newPreviews);
	};

	const handleImageRemove = (slotId) => {
		const newSlots = [...imageSlots];
		const newPreviews = [...imagePreviews];

		// Revoke preview URL
		if (newPreviews[slotId]) {
			URL.revokeObjectURL(newPreviews[slotId]);
		}

		newSlots[slotId] = null;
		newPreviews[slotId] = null;

		setImageSlots(newSlots);
		setImagePreviews(newPreviews);
	};

	// Gamification Functions
	const awardPoints = (points, message) => {
		const newPoints = userPoints + points;
		setUserPoints(newPoints);
		setEarnedPoints(points);
		localStorage.setItem("userPoints", newPoints.toString());

		// Check for level up (every 100 points)
		const newLevel = Math.floor(newPoints / 100) + 1;
		if (newLevel > userLevel) {
			setUserLevel(newLevel);
			localStorage.setItem("userLevel", newLevel.toString());
			showAchievementNotification(`🎉 Level ${newLevel} Unlocked!`, "level");
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 3000);
		} else if (message) {
			showAchievementNotification(message, "points");
		}

		// Clear earned points after animation
		setTimeout(() => setEarnedPoints(0), 2000);
	};

	const showAchievementNotification = (message, type) => {
		setShowAchievement({ message, type });
		setTimeout(() => setShowAchievement(null), 3000);
	};

	const checkAndAwardBadge = (badgeId, badgeName, condition) => {
		if (condition && !badges.includes(badgeId)) {
			const newBadges = [...badges, badgeId];
			setBadges(newBadges);
			localStorage.setItem("badges", JSON.stringify(newBadges));
			showAchievementNotification(`🏆 Badge Earned: ${badgeName}!`, "badge");
			awardPoints(50, "");
		}
	};

	const scrollToForm = () => {
		console.log("scrollToForm called, setting state to FORM");
		setAppState(STATES.FORM);
		setFormStep(FORM_STEPS.IMAGES); // Reset to first step
		awardPoints(5, "Started new scan!");
		console.log("State set, formStep:", FORM_STEPS.IMAGES);
		setTimeout(() => {
			console.log("Scrolling to form, formRef:", formRef.current);
			formRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	};

	// Form Step Navigation
	const nextFormStep = () => {
		// Validate current step before proceeding
		if (formStep === FORM_STEPS.IMAGES && !allImagesUploaded) {
			setError(t.uploadImages + " (3/3)");
			return;
		}
		if (formStep === FORM_STEPS.FARMER_INFO) {
			if (!formData.farmer_name || !formData.village) {
				setError("Please fill in all required fields.");
				return;
			}
		}
		if (formStep === FORM_STEPS.CROP_INFO) {
			if (!formData.crop_name) {
				setError("Please select a crop.");
				return;
			}
		}

		setError(null);
		// Award points for completing steps
		if (formStep === FORM_STEPS.IMAGES) {
			awardPoints(20, "📸 Photos uploaded!");
			checkAndAwardBadge("photographer", "Photographer", true);
		} else if (formStep === FORM_STEPS.LOCATION) {
			awardPoints(10, "📍 Location added!");
		} else if (formStep === FORM_STEPS.FARMER_INFO) {
			awardPoints(15, "👤 Profile completed!");
		}

		if (formStep < FORM_STEPS.CROP_INFO) {
			setFormStep(formStep + 1);
		}
	};

	const prevFormStep = () => {
		setError(null);
		if (formStep > FORM_STEPS.IMAGES) {
			setFormStep(formStep - 1);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (!formData.farmer_name || !formData.village || !formData.crop_name) {
			setError("Please fill in all required fields.");
			return;
		}
		if (!allImagesUploaded) {
			setError("Please upload all 3 leaf photos before analyzing.");
			return;
		}

		setAppState(STATES.ANALYZING);
		setCurrentStep(0);
		awardPoints(30, "🎯 Analysis started!");

		// Update total scans
		const newScans = totalScans + 1;
		setTotalScans(newScans);
		localStorage.setItem("totalScans", newScans.toString());

		// Check for milestone badges
		checkAndAwardBadge("first_scan", "First Scan", newScans === 1);
		checkAndAwardBadge("experienced", "Experienced Farmer", newScans === 5);
		checkAndAwardBadge("expert", "Expert Diagnostician", newScans === 10);

		// Simulate progress
		const analysisSteps = getAnalysisSteps(t);
		const stepInterval = setInterval(() => {
			setCurrentStep((prev) => {
				if (prev >= analysisSteps.length - 1) {
					clearInterval(stepInterval);
					return prev;
				}
				return prev + 1;
			});
		}, 1500);

		try {
			const submitData = new FormData();
			submitData.append("lat", parseFloat(formData.lat || "18.5204"));
			submitData.append("lon", parseFloat(formData.lon || "73.8567"));
			submitData.append("farmer_name", formData.farmer_name);
			submitData.append("village", formData.village);
			submitData.append("crop_name", formData.crop_name);
			submitData.append("sown_date", formData.sown_date || "");
			submitData.append("observations", formData.observations || "");

			// Append all 3 images with key "files"
			imageSlots.forEach((file) => {
				if (file) {
					submitData.append("files", file);
				}
			});

			const response = await axios.post(`${API_URL}/analyze`, submitData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			clearInterval(stepInterval);
			setCurrentStep(analysisSteps.length);
			setTimeout(() => {
				setResult(response.data);
				setAppState(STATES.RESULT);
			}, 500);
		} catch (err) {
			clearInterval(stepInterval);
			setError(
				err.response?.data?.detail || "Analysis failed. Please try again.",
			);
			setAppState(STATES.FORM);
		}
	};

	const handleChatSubmit = async (e) => {
		e.preventDefault();
		if (!chatInput.trim()) return;

		const userMessage = { role: "user", content: chatInput };
		setChatMessages((prev) => [...prev, userMessage]);
		setChatInput("");

		setTimeout(() => {
			setChatMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: `Based on my analysis of ${result?.final_result?.disease_name || "the disease"}, I recommend following the treatment plan provided. The ${result?.final_result?.severity || "detected"} severity level suggests timely action is important.`,
				},
			]);
		}, 1000);
	};

	const resetApp = () => {
		setAppState(STATES.LANDING);
		setResult(null);
		setImageSlots([null, null, null]);
		setImagePreviews([null, null, null]);
		setFormData({
			lat: "",
			lon: "",
			farmer_name: "",
			village: "",
			crop_name: "Apple",
			sown_date: "",
			observations: "",
		});
		setChatMessages([
			{
				role: "assistant",
				content: "I've analyzed your crop. Feel free to ask any questions!",
			},
		]);
	};

	// ============================================
	// RENDER: LANDING STATE
	// ============================================
	const renderLanding = () => (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="min-h-screen bg-white"
		>
			<Navbar
				onTryFree={scrollToForm}
				t={t}
				currentLang={language}
				onLanguageClick={() => setShowLanguageSelector(true)}
			/>

			{/* Hero Section with Indian Flag Gradient Background */}
			<main id="home" className="pt-16 relative overflow-hidden">
				{/* Animated Indian Flag Gradient Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50 animate-gradient" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#FF9933]/5 via-white/5 to-[#138808]/5" />

				{/* Floating Particles - Indian Flag Colors */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div
						className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-15 animate-float"
						style={{ animationDelay: "0s" }}
					/>
					<div
						className="absolute top-40 right-20 w-32 h-32 bg-green-200 rounded-full opacity-15 animate-float"
						style={{ animationDelay: "2s" }}
					/>
					<div
						className="absolute bottom-40 left-1/4 w-24 h-24 bg-orange-300 rounded-full opacity-15 animate-float"
						style={{ animationDelay: "1s" }}
					/>
					<div
						className="absolute top-1/2 left-1/2 w-28 h-28 bg-blue-200 rounded-full opacity-10 animate-float"
						style={{ animationDelay: "1.5s" }}
					/>
					<div
						className="absolute bottom-20 right-1/3 w-16 h-16 bg-green-300 rounded-full opacity-15 animate-float"
						style={{ animationDelay: "3s" }}
					/>
				</div>

				<div className="max-w-7xl mx-auto px-6 min-h-[calc(100vh-4rem)] flex items-center relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full py-12">
						{/* Left Content */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
						>
							<div className="flex items-center gap-2 text-primary-700 mb-6 glass px-4 py-2 rounded-full w-fit animate-bounce-subtle">
								<CheckCircle className="w-4 h-4 animate-scale-pulse" />
								<span className="text-sm font-medium">
									{t.trustedBy}{" "}
									<span className="font-bold text-primary-900">50,000+</span>{" "}
									{t.farmers}
								</span>
							</div>

							<h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
								{t.stopDisease}
								<br />
								<span className="text-secondary-500">{t.beforeSpreads}</span>
							</h1>

							<p className="text-lg text-gray-600 mb-8 max-w-lg">
								{t.heroDesc}
							</p>

							<motion.button
								type="button"
								onClick={scrollToForm}
								whileHover={{ scale: 1.05, y: -5 }}
								whileTap={{ scale: 0.95 }}
								className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-secondary-500 via-secondary-600 to-orange-600 hover:from-secondary-600 hover:via-orange-600 hover:to-pink-600 text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
							>
								{/* Animated Background */}
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100"
									style={{ backgroundSize: "200% 100%" }}
									animate={{
										backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
									}}
									transition={{ duration: 3, repeat: Infinity }}
								/>

								{/* Glow Effect */}
								<div className="absolute inset-0 bg-secondary-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />

								{/* Sparkle */}
								<motion.div
									animate={{ rotate: 360, scale: [1, 1.2, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
									className="relative z-10"
								>
									<Zap className="w-6 h-6" />
								</motion.div>

								<span className="relative z-10">{t.diagnoseNow}</span>

								<motion.div
									animate={{ x: [0, 5, 0] }}
									transition={{ duration: 1.5, repeat: Infinity }}
									className="relative z-10"
								>
									<ArrowRight className="w-5 h-5" />
								</motion.div>

								{/* Shimmer */}
								<motion.div
									className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
									animate={{ x: ["-100%", "200%"] }}
									transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
								/>
							</motion.button>

							<div className="flex items-center gap-6 mt-8">
								<div className="flex items-center gap-2 text-gray-500">
									<CheckCircle className="w-4 h-4 text-primary-600" />
									<span className="text-sm">{t.noCreditCard}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-500">
									<Shield className="w-4 h-4 text-primary-600" />
									<span className="text-sm">{t.accuracy}</span>
								</div>
							</div>
						</motion.div>

						{/* Right Content - Phone Mockup */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.6 }}
							className="hidden lg:flex justify-center"
						>
							<PhoneMockup />
						</motion.div>
					</div>
				</div>
			</main>

			{/* About Section */}
			<section id="about" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							How It Works
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Our AI-powered system provides accurate crop disease diagnosis in
							three simple steps.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: Camera,
								title: "Capture Photos",
								desc: "Take 3 clear photos of affected leaves from different angles",
							},
							{
								icon: Microscope,
								title: "AI Analysis",
								desc: "Our AI compares your images with scientific disease databases",
							},
							{
								icon: FileText,
								title: "Get Treatment",
								desc: "Receive instant diagnosis and actionable treatment plans",
							},
						].map((step, idx) => (
							<div
								key={idx}
								className="glass rounded-2xl p-6 shadow-lg hover:shadow-2xl text-center card-3d cursor-pointer transition-all duration-300 border border-primary-100 hover:border-primary-300"
							>
								<div className="relative w-14 h-14 mx-auto mb-4">
									<div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur opacity-30 animate-pulse-slow" />
									<div className="relative w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center transform transition-transform hover:scale-110 hover:rotate-6">
										<step.icon className="w-7 h-7 text-primary-700" />
									</div>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{step.title}
								</h3>
								<p className="text-gray-600 text-sm">{step.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</motion.div>
	);

	// ============================================
	// RENDER: FORM STATE - MULTI-STEP WITH PROGRESS BAR
	// ============================================
	const renderForm = () => {
		console.log("renderForm called, current formStep:", formStep);
		const formSteps = [
			{
				id: FORM_STEPS.IMAGES,
				label: t.uploadImages || "Upload Photos",
				icon: Camera,
			},
			{
				id: FORM_STEPS.LOCATION,
				label: t.location || "Location",
				icon: MapPin,
			},
			{
				id: FORM_STEPS.FARMER_INFO,
				label: t.farmerDetails || "Your Info",
				icon: User,
			},
			{
				id: FORM_STEPS.CROP_INFO,
				label: t.cropDetails || "Crop Info",
				icon: Leaf,
			},
		];

		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50"
				ref={formRef}
			>
				<Navbar
					showBack={true}
					onBack={() => {
						setAppState(STATES.LANDING);
						setFormStep(FORM_STEPS.IMAGES);
					}}
					title={t.newConsultation}
					t={t}
					currentLang={language}
					onLanguageClick={() => setShowLanguageSelector(true)}
				/>

				<main className="pt-24 pb-12">
					<div className="max-w-3xl mx-auto px-6">
						{/* Gamification Header */}
						<GamificationHeader
							points={userPoints}
							level={userLevel}
							streak={streak}
							totalScans={totalScans}
						/>

						{/* Progress Bar */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-4">
								{formSteps.map((step, idx) => {
									const StepIcon = step.icon;
									const isActive = formStep === step.id;
									const isCompleted = formStep > step.id;

									return (
										<React.Fragment key={step.id}>
											<div className="flex flex-col items-center">
												<div
													className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
														isActive
															? "bg-primary-600 text-white scale-110 shadow-lg"
															: isCompleted
																? "bg-primary-600 text-white"
																: "bg-gray-200 text-gray-400"
													}`}
												>
													{isCompleted ? (
														<CheckCircle className="w-6 h-6" />
													) : (
														<StepIcon className="w-6 h-6" />
													)}
												</div>
												<span
													className={`text-xs font-medium ${
														isActive
															? "text-primary-700"
															: isCompleted
																? "text-primary-600"
																: "text-gray-400"
													}`}
												>
													{step.label}
												</span>
											</div>
											{idx < formSteps.length - 1 && (
												<div
													className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
														isCompleted ? "bg-primary-600" : "bg-gray-200"
													}`}
												/>
											)}
										</React.Fragment>
									);
								})}
							</div>
						</div>

						{/* Step Content Card */}
						<motion.div
							key={formStep}
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -20 }}
							transition={{
								duration: 0.4,
								type: "spring",
								stiffness: 300,
								damping: 30,
							}}
							className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border-2 border-primary-100 relative overflow-hidden"
						>
							{/* Decorative gradient overlay */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-3xl -z-0" />
							<div className="relative z-10">
								<form onSubmit={handleSubmit} className="space-y-6">
									{/* Error Alert */}
									{error && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3"
										>
											<AlertTriangle className="w-5 h-5 flex-shrink-0" />
											<span className="flex-1">{error}</span>
											<button
												type="button"
												onClick={() => setError(null)}
												className="hover:bg-red-100 rounded p-1 transition-colors"
											>
												<X className="w-4 h-4" />
											</button>
										</motion.div>
									)}

									{/* ============================================ */}
									{/* STEP 1: IMAGE UPLOAD */}
									{/* ============================================ */}
									{formStep === FORM_STEPS.IMAGES && (
										<div className="space-y-6">
											<div>
												<h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
													<div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
														<Camera className="w-5 h-5 text-primary-700" />
													</div>
													{t.uploadImages}
												</h2>
												<p className="text-gray-600 text-sm mb-6">
													Take 3 clear photos of affected leaves from different
													angles for accurate diagnosis.
												</p>
											</div>

											<div className="flex items-center justify-between mb-4">
												<span className="text-sm font-medium text-gray-600">
													Upload Progress
												</span>
												{/* Circular Progress Ring */}
												<div className="relative w-12 h-12">
													<svg className="w-12 h-12 transform -rotate-90">
														<circle
															cx="24"
															cy="24"
															r="20"
															stroke="currentColor"
															strokeWidth="4"
															fill="none"
															className="text-gray-200"
														/>
														<circle
															cx="24"
															cy="24"
															r="20"
															stroke="currentColor"
															strokeWidth="4"
															fill="none"
															strokeDasharray={`${(uploadedCount / 3) * 125.6} 125.6`}
															className={
																allImagesUploaded
																	? "text-primary-600"
																	: "text-secondary-500"
															}
															style={{
																transition: "stroke-dasharray 0.5s ease",
															}}
														/>
													</svg>
													<div className="absolute inset-0 flex items-center justify-center">
														<span
															className={`text-sm font-bold ${allImagesUploaded ? "text-primary-700" : "text-gray-600"}`}
														>
															{uploadedCount}/3
														</span>
													</div>
												</div>
											</div>
											<p className="text-sm text-gray-500 mb-4">
												{t.fillDetails}
											</p>

											{/* 3 Image Slot Grid */}
											<div className="grid grid-cols-3 gap-4">
												{IMAGE_SLOTS.map((slot) => (
													<ImageSlot
														key={slot.id}
														slot={slot}
														file={imageSlots[slot.id]}
														preview={imagePreviews[slot.id]}
														onSelect={handleImageSelect}
														onRemove={handleImageRemove}
													/>
												))}
											</div>

											{!allImagesUploaded && (
												<p className="text-xs text-amber-600 mt-4 flex items-center gap-1">
													<AlertTriangle className="w-3 h-3" />
													All 3 photos are required to proceed
												</p>
											)}
										</div>
									)}

									{/* ============================================ */}
									{/* STEP 2: LOCATION */}
									{/* ============================================ */}
									{formStep === FORM_STEPS.LOCATION && (
										<div className="space-y-6">
											<div>
												<h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
													<div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
														<MapPin className="w-5 h-5 text-primary-700" />
													</div>
													{t.location}
												</h2>
												<p className="text-gray-600 text-sm mb-6">
													Provide your location for accurate weather-based
													analysis.
												</p>
											</div>
											<button
												type="button"
												onClick={getLocation}
												disabled={isGettingLocation}
												className="w-full border-2 border-primary-200 text-primary-700 py-3 rounded-lg flex items-center justify-center gap-2 mb-3 hover:bg-primary-50 transition-colors disabled:opacity-50"
											>
												{isGettingLocation ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<MapPin className="w-4 h-4" />
												)}
												{t.useLocation}
											</button>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm text-gray-600 mb-1">
														{t.latitude}
													</label>
													<input
														type="text"
														value={formData.lat}
														onChange={(e) =>
															setFormData({ ...formData, lat: e.target.value })
														}
														placeholder="e.g., 18.5204"
														className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm text-gray-600 mb-1">
														{t.longitude}
													</label>
													<input
														type="text"
														value={formData.lon}
														onChange={(e) =>
															setFormData({ ...formData, lon: e.target.value })
														}
														placeholder="e.g., 73.8567"
														className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
													/>
												</div>
											</div>
										</div>
									)}

									{/* ============================================ */}
									{/* STEP 3: FARMER DETAILS */}
									{/* ============================================ */}
									{formStep === FORM_STEPS.FARMER_INFO && (
										<div className="space-y-6">
											<div>
												<h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
													<div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
														<User className="w-5 h-5 text-primary-700" />
													</div>
													{t.farmerDetails}
												</h2>
												<p className="text-gray-600 text-sm mb-6">
													Tell us a bit about yourself.
												</p>
											</div>
											<div className="space-y-4">
												<div>
													<label className="block text-sm text-gray-600 mb-1">
														{t.yourName}
													</label>
													<input
														type="text"
														value={formData.farmer_name}
														onChange={(e) =>
															setFormData({
																...formData,
																farmer_name: e.target.value,
															})
														}
														placeholder={t.enterName}
														className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
														required
													/>
												</div>
												<div>
													<label className="block text-sm text-gray-600 mb-1">
														{t.village}
													</label>
													<input
														type="text"
														value={formData.village}
														onChange={(e) =>
															setFormData({
																...formData,
																village: e.target.value,
															})
														}
														placeholder={t.enterVillage}
														className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
														required
													/>
												</div>
											</div>
										</div>
									)}

									{/* ============================================ */}
									{/* STEP 4: CROP DETAILS */}
									{/* ============================================ */}
									{formStep === FORM_STEPS.CROP_INFO && (
										<div className="space-y-6">
											<div>
												<h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
													<div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
														<Leaf className="w-5 h-5 text-primary-700" />
													</div>
													{t.cropDetails}
												</h2>
												<p className="text-gray-600 text-sm mb-6">
													Tell us about your crop and observations.
												</p>
											</div>
											<div className="space-y-4">
												<div>
													<label className="block text-sm text-gray-600 mb-2">
														{t.selectCrop}
													</label>
													<div className="grid grid-cols-3 gap-3">
														{CROPS.map((crop) => (
															<button
																key={crop.value}
																type="button"
																onClick={() =>
																	setFormData({
																		...formData,
																		crop_name: crop.value,
																	})
																}
																className={`p-4 rounded-lg border-2 transition-all ${
																	formData.crop_name === crop.value
																		? "border-primary-600 bg-primary-50"
																		: "border-gray-200 hover:border-primary-300"
																}`}
															>
																<span className="text-3xl block mb-1">
																	{crop.icon}
																</span>
																<span className="text-sm font-medium text-gray-700">
																	{crop.value === "Apple"
																		? t.apple
																		: crop.value === "Rice"
																			? t.rice
																			: t.tomato}
																</span>
															</button>
														))}
													</div>
												</div>
												<div>
													<label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														{t.sownDate}
													</label>
													<input
														type="date"
														value={formData.sown_date}
														onChange={(e) =>
															setFormData({
																...formData,
																sown_date: e.target.value,
															})
														}
														className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm text-gray-600 mb-1">
														{t.observations}
													</label>
													<textarea
														value={formData.observations}
														onChange={(e) =>
															setFormData({
																...formData,
																observations: e.target.value,
															})
														}
														placeholder={t.observationsPlaceholder}
														rows={3}
														className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
													/>
												</div>
											</div>
										</div>
									)}

									{/* ============================================ */}
									{/* NAVIGATION BUTTONS */}
									{/* ============================================ */}
									<div className="flex gap-3 pt-4 border-t">
										{/* Back Button */}
										{formStep > FORM_STEPS.IMAGES && (
											<motion.button
												type="button"
												onClick={prevFormStep}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
											>
												<ArrowLeft className="w-5 h-5" />
												{t.back || "Back"}
											</motion.button>
										)}

										{/* Next/Submit Button */}
										{formStep < FORM_STEPS.CROP_INFO ? (
											<motion.button
												type="button"
												onClick={nextFormStep}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
											>
												Next
												<ArrowRight className="w-5 h-5" />
											</motion.button>
										) : (
											<motion.button
												type="submit"
												disabled={!allImagesUploaded}
												whileHover={allImagesUploaded ? { scale: 1.02 } : {}}
												whileTap={allImagesUploaded ? { scale: 0.98 } : {}}
												className={`flex-1 text-white font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all ${
													allImagesUploaded
														? "bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 cursor-pointer hover:shadow-xl"
														: "bg-gray-300 cursor-not-allowed"
												}`}
											>
												<Microscope className="w-5 h-5" />
												{t.analyzeCrop}
											</motion.button>
										)}
									</div>
								</form>
							</div>
						</motion.div>
					</div>
				</main>
			</motion.div>
		);
	};

	// ============================================
	// RENDER: ANALYZING STATE
	// ============================================
	const renderAnalyzing = () => (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center p-6 relative overflow-hidden"
		>
			{/* Animated Background Particles */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-2 h-2 bg-white/20 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, -30, 0],
							opacity: [0.2, 0.5, 0.2],
							scale: [1, 1.5, 1],
						}}
						transition={{
							duration: 2 + Math.random() * 2,
							repeat: Infinity,
							delay: Math.random() * 2,
						}}
					/>
				))}
			</div>

			<div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10">
				<div className="text-center mb-8">
					{/* Pulsing Icon with Rings */}
					<div className="relative inline-block mb-4">
						<motion.div
							className="absolute inset-0 bg-primary-400 rounded-full opacity-30"
							animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
							transition={{ duration: 2, repeat: Infinity }}
						/>
						<motion.div
							className="absolute inset-0 bg-primary-400 rounded-full opacity-30"
							animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
							transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
						/>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
							className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full shadow-xl"
						>
							<Microscope className="w-12 h-12 text-white" />
						</motion.div>
					</div>

					<motion.h2
						animate={{ scale: [1, 1.02, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent"
					>
						{t.analyzingCrop}
					</motion.h2>
					<p className="text-gray-600 mt-2 font-medium">{t.pleaseWait}</p>

					{/* Fun Messages */}
					<motion.div
						key={currentStep}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-4 text-sm text-primary-600 font-semibold"
					>
						{currentStep === 0 && "🔍 Scanning your images..."}
						{currentStep === 1 && "🧠 AI is thinking hard..."}
						{currentStep === 2 && "📚 Checking disease database..."}
						{currentStep === 3 && "🌡️ Analyzing weather patterns..."}
						{currentStep === 4 && "✨ Almost there!"}
					</motion.div>
				</div>

				<div className="space-y-3">
					{getAnalysisSteps(t).map((step, idx) => {
						const Icon = step.icon;
						const isActive = idx === currentStep;
						const isComplete = idx < currentStep;

						return (
							<motion.div
								key={step.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: idx * 0.1 }}
								className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
									isActive
										? "bg-gradient-to-r from-secondary-50 to-orange-50 border-2 border-secondary-500 shadow-lg scale-105"
										: isComplete
											? "bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400"
											: "bg-gray-50 border-2 border-gray-200 opacity-50"
								}`}
							>
								<motion.div
									animate={isActive ? { rotate: 360 } : {}}
									transition={
										isActive
											? { duration: 1, repeat: Infinity, ease: "linear" }
											: {}
									}
									className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
										isActive
											? "bg-gradient-to-br from-secondary-500 to-orange-600 text-white"
											: isComplete
												? "bg-gradient-to-br from-green-500 to-green-600 text-white"
												: "bg-gray-200 text-gray-400"
									}`}
								>
									{isComplete ? (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: "spring" }}
										>
											<CheckCircle className="w-6 h-6" />
										</motion.div>
									) : isActive ? (
										<Loader2 className="w-6 h-6 animate-spin" />
									) : (
										<Icon className="w-6 h-6" />
									)}
								</motion.div>
								<div className="flex-1">
									<span
										className={`font-semibold text-lg ${
											isActive
												? "text-secondary-800"
												: isComplete
													? "text-green-700"
													: "text-gray-400"
										}`}
									>
										{step.label}
									</span>
									{isComplete && (
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: "100%" }}
											className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-2"
										/>
									)}
								</div>
								{isComplete && (
									<motion.div
										initial={{ scale: 0, rotate: -180 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ type: "spring", delay: 0.2 }}
									>
										<Star className="w-5 h-5 text-yellow-500" />
									</motion.div>
								)}
							</motion.div>
						);
					})}
				</div>

				{/* Overall Progress Bar */}
				<div className="mt-6">
					<div className="flex justify-between text-sm text-gray-600 mb-2">
						<span className="font-semibold">Overall Progress</span>
						<span className="font-bold text-primary-600">
							{Math.round(
								(currentStep / (getAnalysisSteps(t).length - 1)) * 100,
							)}
							%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
						<motion.div
							className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 rounded-full"
							initial={{ width: 0 }}
							animate={{
								width: `${(currentStep / (getAnalysisSteps(t).length - 1)) * 100}%`,
							}}
							transition={{ duration: 0.5, ease: "easeOut" }}
						/>
					</div>
				</div>

				{/* Motivational Text */}
				<motion.p
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity }}
					className="text-center text-sm text-gray-500 mt-4 font-medium"
				>
					Earning rewards... +30 XP 🎯
				</motion.p>
			</div>
		</motion.div>
	);

	// ============================================
	// RENDER: RESULT STATE
	// ============================================
	const renderResult = () => {
		if (!result) return null;

		const { final_result, ai_diagnosis_log, weather_context, image_urls } =
			result;
		const confidence = (final_result?.confidence_score * 100).toFixed(0);
		const severityColors = {
			mild: "bg-green-100 text-green-700",
			moderate: "bg-yellow-100 text-yellow-700",
			severe: "bg-red-100 text-red-700",
		};

		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="min-h-screen bg-gray-50"
			>
				<Navbar
					title={t.diagnosisResults}
					t={t}
					currentLang={language}
					onLanguageClick={() => setShowLanguageSelector(true)}
				>
					<button
						type="button"
						onClick={resetApp}
						className="flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg transition-colors"
					>
						<RefreshCw className="w-4 h-4" />
						{t.newAnalysis}
					</button>
				</Navbar>

				<main className="pt-20 pb-12 max-w-6xl mx-auto px-6">
					{/* Rewards Summary Card */}
					<motion.div
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="mb-6 bg-gradient-to-r from-primary-500 via-secondary-500 to-secondary-600 rounded-2xl p-6 shadow-2xl"
					>
						<div className="flex items-center justify-between text-white">
							<div className="flex items-center gap-4">
								<motion.div
									animate={{ rotate: [0, 360] }}
									transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
									className="bg-white/20 p-4 rounded-full"
								>
									<Trophy className="w-8 h-8" />
								</motion.div>
								<div>
									<h3 className="text-2xl font-bold">Scan Complete!</h3>
									<p className="text-white/90">
										You earned rewards for this analysis
									</p>
								</div>
							</div>
							<div className="flex items-center gap-6">
								<div className="text-center">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", delay: 0.2 }}
										className="text-3xl font-bold"
									>
										+65
									</motion.div>
									<div className="text-sm text-white/80">XP Earned</div>
								</div>
								<div className="text-center">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", delay: 0.4 }}
										className="text-3xl font-bold"
									>
										{totalScans}
									</motion.div>
									<div className="text-sm text-white/80">Total Scans</div>
								</div>
								{badges.length > 0 && (
									<div className="text-center">
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: "spring", delay: 0.6 }}
											className="text-3xl font-bold"
										>
											{badges.length}
										</motion.div>
										<div className="text-sm text-white/80">Badges</div>
									</div>
								)}
							</div>
						</div>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Diagnosis Card */}
						<div className="lg:col-span-2 space-y-6">
							{/* Disease Card */}
							<div className="bg-white rounded-xl shadow-lg overflow-hidden">
								<div className="bg-primary-900 text-white p-6">
									<div className="flex items-start justify-between">
										<div>
											<p className="text-primary-200 text-sm mb-1">
												{t.identifiedDisease}
											</p>
											<h2 className="text-3xl font-bold">
												{final_result?.disease_name}
											</h2>
										</div>
										<div className="text-right">
											<div className="text-4xl font-bold text-secondary-400">
												{confidence}%
											</div>
											<p className="text-primary-200 text-sm">{t.confidence}</p>
										</div>
									</div>
									<div className="mt-4 flex items-center gap-3 flex-wrap">
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${severityColors[final_result?.severity] || severityColors.moderate}`}
										>
											{final_result?.severity === "mild"
												? t.mild
												: final_result?.severity === "severe"
													? t.severe
													: t.moderate}{" "}
											{t.severity}
										</span>
										<span className="text-primary-200 text-sm flex items-center gap-1">
											<CloudRain className="w-4 h-4" />
											{weather_context}
										</span>
									</div>
								</div>

								{/* Uploaded Images */}
								{image_urls && image_urls.length > 0 && (
									<div className="p-6 border-b">
										<h3 className="font-semibold text-gray-700 mb-3">
											{t.analyzedImages} ({image_urls.length})
										</h3>
										<div className="grid grid-cols-3 gap-3">
											{image_urls.map((url, idx) => (
												<img
													key={`img-${idx}`}
													src={url}
													alt={`Leaf ${idx + 1}`}
													className="w-full aspect-square object-cover rounded-lg"
												/>
											))}
										</div>
									</div>
								)}

								{/* Treatment Plan */}
								<div className="p-6">
									<h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
										<FileText className="w-5 h-5 text-primary-600" />
										{t.treatmentPlan}
									</h3>{" "}
									{final_result?.treatment_plan && (
										<div className="space-y-4">
											{final_result.treatment_plan.immediate?.length > 0 && (
												<div className="bg-red-50 p-4 rounded-lg">
													<h4 className="text-sm font-medium text-red-700 mb-2">
														🚨 {t.immediateActions}
													</h4>
													<ul className="space-y-1">
														{final_result.treatment_plan.immediate.map(
															(action, idx) => (
																<li
																	key={`imm-${idx}`}
																	className="flex items-start gap-2 text-sm text-red-600"
																>
																	<CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
																	<span>{action}</span>
																</li>
															),
														)}
													</ul>
												</div>
											)}

											{final_result.treatment_plan.preventive?.length > 0 && (
												<div className="bg-primary-50 p-4 rounded-lg">
													<h4 className="text-sm font-medium text-primary-700 mb-2">
														🛡️ {t.preventive}
													</h4>
													<ul className="space-y-1">
														{final_result.treatment_plan.preventive.map(
															(measure, idx) => (
																<li
																	key={`prev-${idx}`}
																	className="flex items-start gap-2 text-sm text-primary-600"
																>
																	<CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
																	<span>{measure}</span>
																</li>
															),
														)}
													</ul>
												</div>
											)}

											{final_result.treatment_plan.products?.length > 0 && (
												<div className="bg-secondary-50 p-4 rounded-lg">
													<h4 className="text-sm font-medium text-secondary-700 mb-2">
														💊 {t.recommendedProducts}
													</h4>
													<div className="flex flex-wrap gap-2">
														{final_result.treatment_plan.products.map(
															(product, idx) => (
																<span
																	key={`prod-${idx}`}
																	className="bg-white text-secondary-700 px-3 py-1 rounded-full text-sm border border-secondary-200"
																>
																	{product}
																</span>
															),
														)}
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							</div>

							{/* AI Verification Log */}
							<div className="bg-white rounded-xl shadow-lg p-6">
								<h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
									<Shield className="w-5 h-5 text-primary-600" />
									{t.aiVerification}
								</h3>{" "}
								{ai_diagnosis_log && (
									<div className="space-y-3 text-sm">
										<div className="grid grid-cols-2 gap-3">
											<div className="bg-gray-50 p-3 rounded-lg">
												<p className="text-gray-500 text-xs mb-1">
													{t.initialPrediction}
												</p>
												<p className="font-medium">
													{ai_diagnosis_log.initial_prediction}
												</p>
											</div>
											<div className="bg-gray-50 p-3 rounded-lg">
												<p className="text-gray-500 text-xs mb-1">
													{t.referenceAvailable}
												</p>
												<p className="font-medium">
													{ai_diagnosis_log.reference_available
														? "✅ Yes"
														: "❌ No"}
												</p>
											</div>
										</div>

										{ai_diagnosis_log.texture_analysis && (
											<div className="bg-blue-50 p-3 rounded-lg">
												<p className="text-blue-700 font-medium mb-1">
													🔬 {t.textureAnalysis}
												</p>
												<p className="text-blue-600">
													{ai_diagnosis_log.texture_analysis}
												</p>
											</div>
										)}

										{ai_diagnosis_log.comparison_notes && (
											<div className="bg-green-50 p-3 rounded-lg">
												<p className="text-green-700 font-medium mb-1">
													📝 {t.comparisonNotes}
												</p>
												<p className="text-green-600">
													{ai_diagnosis_log.comparison_notes}
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Chat Interface */}
						<div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
							<div className="bg-primary-800 text-white p-4">
								<h3 className="font-semibold flex items-center gap-2">
									<MessageSquare className="w-5 h-5" />
									{t.askQuestions}
								</h3>
								<p className="text-primary-200 text-sm">{t.chatWithAI}</p>
							</div>{" "}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{chatMessages.map((msg, idx) => (
									<div
										key={`chat-${idx}`}
										className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[85%] p-3 rounded-lg ${msg.role === "user" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-800"}`}
										>
											<p className="text-sm whitespace-pre-wrap">
												{msg.content}
											</p>
										</div>
									</div>
								))}
								<div ref={chatEndRef} />
							</div>
							<form onSubmit={handleChatSubmit} className="p-4 border-t">
								<div className="flex gap-2">
									<input
										type="text"
										value={chatInput}
										onChange={(e) => setChatInput(e.target.value)}
										placeholder={t.askAbout}
										className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
									/>
									<button
										type="submit"
										className="bg-secondary-500 hover:bg-secondary-600 text-white p-2 rounded-lg transition-colors"
									>
										<Send className="w-5 h-5" />
									</button>
								</div>
							</form>
						</div>
					</div>
				</main>
			</motion.div>
		);
	};

	// ============================================
	// MAIN RENDER
	// ============================================
	return (
		<>
			{/* Language Selector Popup - Shows on first visit */}
			{showLanguageSelector && (
				<LanguageSelector
					onSelect={handleLanguageSelect}
					currentLang={language || "en"}
				/>
			)}

			{/* Gamification Overlays */}
			{showConfetti && <Confetti />}
			<AnimatePresence>
				{showAchievement && (
					<AchievementNotification achievement={showAchievement} />
				)}
			</AnimatePresence>
			<PointsEarned points={earnedPoints} />

			<AnimatePresence mode="wait">
				{(() => {
					console.log(
						"Current appState:",
						appState,
						"STATES.FORM:",
						STATES.FORM,
					);
					return null;
				})()}
				{appState === STATES.LANDING && renderLanding()}
				{appState === STATES.FORM && renderForm()}
				{appState === STATES.ANALYZING && renderAnalyzing()}
				{appState === STATES.RESULT && renderResult()}
			</AnimatePresence>
		</>
	);
}
