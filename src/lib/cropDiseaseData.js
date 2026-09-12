/**
 * Crop Disease Data — Hindi + English bilingual disease database
 * Maps disease categories to treatment advice for Indian farmers.
 *
 * NOTE FOR PRODUCTION (Qualcomm AI Hub deployment):
 *   These labels correspond to PlantVillage dataset classes (38 classes).
 *   When swapping in the QNN-optimized plant disease model, update the
 *   'className' keys to match the model's output label indices exactly.
 */

export const DISEASE_DB = {
  // ── HEALTHY ───────────────────────────────────────────────────────────
  healthy: {
    label: 'Swasth Fasal',
    labelHindi: 'स्वस्थ फसल ✅',
    severity: 'none',
    severityColor: '#22c55e',
    description: 'Your crop appears healthy. No disease detected.',
    descriptionHindi: 'आपकी फसल स्वस्थ दिखती है। कोई रोग नहीं मिला।',
    treatment: [
      'Continue regular watering schedule',
      'Apply balanced NPK fertilizer every 3 weeks',
      'Keep monitoring for early signs of pests',
    ],
    treatmentHindi: [
      'नियमित सिंचाई जारी रखें',
      'हर 3 हफ्ते में NPK खाद डालें',
      'कीड़ों के शुरुआती लक्षणों पर नज़र रखें',
    ],
    emoji: '🌿',
    icon: '✅',
  },

  // ── LEAF BLIGHT ───────────────────────────────────────────────────────
  leaf_blight: {
    label: 'Patti Jhulsa Rog',
    labelHindi: 'पत्ती झुलसा रोग 🍂',
    severity: 'high',
    severityColor: '#ef4444',
    description: 'Leaf Blight detected. Caused by Alternaria or Phytophthora fungus.',
    descriptionHindi: 'पत्ती झुलसा रोग मिला। यह Alternaria या Phytophthora फफूंद से होता है।',
    treatment: [
      'Spray Mancozeb (0.25%) or Copper Oxychloride every 7 days',
      'Remove and burn infected leaves immediately',
      'Avoid overhead irrigation — use drip irrigation',
      'Apply neem oil spray (3ml/litre) as organic alternative',
    ],
    treatmentHindi: [
      'Mancozeb (0.25%) या Copper Oxychloride हर 7 दिन में छिड़कें',
      'संक्रमित पत्तियां तुरंत हटाएं और जला दें',
      'ऊपर से सिंचाई बंद करें — टपक सिंचाई अपनाएं',
      'जैविक विकल्प: नीम तेल (3ml/लीटर) का छिड़काव',
    ],
    emoji: '🍂',
    icon: '⚠️',
  },

  // ── RUST ──────────────────────────────────────────────────────────────
  rust: {
    label: 'Kiran Rog (Rust)',
    labelHindi: 'किरण रोग (Rust) 🟫',
    severity: 'medium',
    severityColor: '#f59e0b',
    description: 'Rust disease detected. Orange-brown pustules on leaves caused by Puccinia fungus.',
    descriptionHindi: 'किरण रोग मिला। Puccinia फफूंद से पत्तियों पर नारंगी-भूरे धब्बे होते हैं।',
    treatment: [
      'Spray Propiconazole (0.1%) or Tebuconazole fungicide',
      'Use rust-resistant seed varieties next season',
      'Maintain proper plant spacing for air circulation',
      'Apply sulphur dust (20 kg/hectare) as preventive measure',
    ],
    treatmentHindi: [
      'Propiconazole (0.1%) या Tebuconazole फफूंदनाशक का छिड़काव करें',
      'अगले सीजन में किरण-प्रतिरोधी बीज उपयोग करें',
      'हवा के लिए पौधों के बीच उचित दूरी रखें',
      'सल्फर धूल (20 kg/हेक्टेयर) बचाव के रूप में लगाएं',
    ],
    emoji: '🟫',
    icon: '⚠️',
  },

  // ── POWDERY MILDEW ────────────────────────────────────────────────────
  powdery_mildew: {
    label: 'Churni Rog (Powdery Mildew)',
    labelHindi: 'चूर्णिल आसिता 🤍',
    severity: 'medium',
    severityColor: '#f59e0b',
    description: 'Powdery Mildew detected. White powdery coating on leaves caused by Erysiphe fungus.',
    descriptionHindi: 'चूर्णिल आसिता मिली। Erysiphe फफूंद से पत्तियों पर सफेद पाउडर जम जाता है।',
    treatment: [
      'Spray Wettable Sulphur (3g/litre) or Triadimefon',
      'Improve air circulation by pruning dense foliage',
      'Avoid excessive nitrogen fertilization',
      'Apply baking soda solution (5g/litre) as home remedy',
    ],
    treatmentHindi: [
      'Wettable Sulphur (3g/लीटर) या Triadimefon का छिड़काव करें',
      'घने पत्तों की छंटाई करके हवा का प्रवाह बढ़ाएं',
      'अत्यधिक नाइट्रोजन खाद से बचें',
      'घरेलू उपाय: बेकिंग सोडा घोल (5g/लीटर)',
    ],
    emoji: '🤍',
    icon: '⚠️',
  },

  // ── LEAF SPOT ─────────────────────────────────────────────────────────
  leaf_spot: {
    label: 'Patti Dhabb Rog',
    labelHindi: 'पत्ती धब्बा रोग 🔴',
    severity: 'medium',
    severityColor: '#f59e0b',
    description: 'Leaf Spot disease detected. Brown/black spots with yellow halos caused by Cercospora or Septoria.',
    descriptionHindi: 'पत्ती धब्बा रोग मिला। Cercospora या Septoria फफूंद से भूरे/काले धब्बे होते हैं।',
    treatment: [
      'Apply Chlorothalonil or Iprodione fungicide spray',
      'Collect and destroy fallen infected leaves',
      'Water at the base of plants, not overhead',
      'Ensure soil is well-drained to reduce humidity',
    ],
    treatmentHindi: [
      'Chlorothalonil या Iprodione फफूंदनाशक का छिड़काव करें',
      'गिरी हुई संक्रमित पत्तियां इकट्ठा कर नष्ट करें',
      'पौधे की जड़ में पानी दें, ऊपर से नहीं',
      'नमी कम करने के लिए मिट्टी अच्छी तरह से निकासी वाली हो',
    ],
    emoji: '🔴',
    icon: '⚠️',
  },

  // ── MOSAIC VIRUS ──────────────────────────────────────────────────────
  mosaic_virus: {
    label: 'Mozaik Vayras',
    labelHindi: 'मोज़ेक वायरस 🟡',
    severity: 'high',
    severityColor: '#ef4444',
    description: 'Mosaic Virus detected. Caused by aphid-transmitted viruses. No chemical cure available.',
    descriptionHindi: 'मोज़ेक वायरस मिला। माहू कीट से फैलता है। कोई रासायनिक इलाज नहीं।',
    treatment: [
      'Remove and destroy infected plants immediately to prevent spread',
      'Control aphid vectors with Imidacloprid (0.3ml/litre)',
      'Use virus-free certified seeds next season',
      'Spray mineral oil to prevent aphid transmission',
    ],
    treatmentHindi: [
      'संक्रमित पौधे तुरंत हटाएं और नष्ट करें',
      'माहू कीट नियंत्रण: Imidacloprid (0.3ml/लीटर)',
      'अगले सीजन में प्रमाणित वायरस-मुक्त बीज उपयोग करें',
      'माहू को रोकने के लिए खनिज तेल का छिड़काव करें',
    ],
    emoji: '🟡',
    icon: '🔴',
  },

  // ── WILT ──────────────────────────────────────────────────────────────
  wilt: {
    label: 'Murjhana Rog (Wilt)',
    labelHindi: 'मुरझाना रोग 🥀',
    severity: 'high',
    severityColor: '#ef4444',
    description: 'Wilt disease detected. Fusarium or Verticillium fungus blocks water transport in plants.',
    descriptionHindi: 'मुरझाना रोग मिला। Fusarium या Verticillium फफूंद पौधे में पानी के प्रवाह को रोकता है।',
    treatment: [
      'Drench soil with Carbendazim (0.1%) solution',
      'Use wilt-resistant crop varieties in future',
      'Practice crop rotation — avoid same crop family',
      'Improve soil drainage and reduce waterlogging',
    ],
    treatmentHindi: [
      'Carbendazim (0.1%) घोल से मिट्टी भिगोएं',
      'भविष्य में मुरझान-प्रतिरोधी किस्मों का उपयोग करें',
      'फसल चक्र अपनाएं — एक ही परिवार की फसल न लगाएं',
      'मिट्टी की जल निकासी सुधारें, जलभराव कम करें',
    ],
    emoji: '🥀',
    icon: '🔴',
  },

  // ── UNKNOWN ───────────────────────────────────────────────────────────
  unknown: {
    label: 'Pehchaan Mushkil',
    labelHindi: 'पहचान मुश्किल 🔍',
    severity: 'unknown',
    severityColor: '#94a3b8',
    description: 'Could not confidently identify a crop disease. Please try with a clearer image of the affected leaf.',
    descriptionHindi: 'फसल रोग की पहचान नहीं हो सकी। कृपया प्रभावित पत्ती की स्पष्ट तस्वीर से पुनः प्रयास करें।',
    treatment: [
      'Take a closer photo of the affected leaf in good lighting',
      'Consult your local Krishi Vigyan Kendra (KVK)',
      'Contact Kisan Call Centre: 1800-180-1551 (toll-free)',
    ],
    treatmentHindi: [
      'अच्छी रोशनी में प्रभावित पत्ती की करीबी तस्वीर लें',
      'अपने नजदीकी कृषि विज्ञान केंद्र (KVK) से सलाह लें',
      'किसान कॉल सेंटर: 1800-180-1551 (टोल-फ्री)',
    ],
    emoji: '🔍',
    icon: '❓',
  },
};

/**
 * Severity badge colors and labels
 */
export const SEVERITY_LABELS = {
  none:    { label: 'Swasth',   labelHindi: 'स्वस्थ',   color: '#22c55e', bg: 'rgba(34,197,94,0.15)'   },
  low:     { label: 'Halka',    labelHindi: 'हल्का',    color: '#86efac', bg: 'rgba(134,239,172,0.15)' },
  medium:  { label: 'Madhyam',  labelHindi: 'मध्यम',   color: '#fbbf24', bg: 'rgba(251,191,36,0.15)'  },
  high:    { label: 'Gambhir',  labelHindi: 'गंभीर',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)'   },
  unknown: { label: 'Agyat',    labelHindi: 'अज्ञात',  color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
};

/**
 * Common crops for context display
 */
export const CROP_NAMES_HINDI = {
  tomato: 'टमाटर', wheat: 'गेहूं', rice: 'धान', corn: 'मक्का',
  potato: 'आलू', cotton: 'कपास', sugarcane: 'गन्ना', soybean: 'सोयाबीन',
};
