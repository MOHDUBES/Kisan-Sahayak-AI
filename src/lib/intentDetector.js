/**
 * AWAAZ SAHAYAK - ON-DEVICE INTENT DETECTION ENGINE
 * Rule-based NLP for Hindi/Hinglish farmer queries. Zero cloud dependency.
 */

// Intent Categories
export const INTENTS = {
  WEATHER:       'weather',
  MANDI_PRICE:   'mandi_price',
  GOVT_SCHEME:   'govt_scheme',
  CROP_DISEASE:  'crop_disease',
  CROP_CARE:     'crop_care',
  FERTILIZER:    'fertilizer',
  IRRIGATION:    'irrigation',
  PEST_CONTROL:  'pest_control',
  SEED_INFO:     'seed_info',
  GREETING:      'greeting',
  HELPLINE:      'helpline',
  UNKNOWN:       'unknown',
};

// Keyword Rule Engine
const INTENT_RULES = [
  {
    intent: INTENTS.WEATHER,
    keywords: [
      'mausam','barish','baarish','barsaat','badal','garmi','sardi','thand',
      'tufaan','aandhee','aandhi','hawa','weather','temperature','tapman',
      'tapmaan','dhoop','fog','storm','rain','cloud',
      '\u092e\u094c\u0938\u092e','\u092c\u093e\u0930\u093f\u0936','\u0917\u0930\u094d\u092e\u0940','\u0938\u0930\u094d\u0926\u0940',
      '\u0924\u0942\u092b\u093e\u0928','\u0906\u0902\u0927\u0940','\u092c\u093e\u0926\u0932','\u0924\u093e\u092a\u092e\u093e\u0928',
      '\u0927\u0942\u092a','\u0920\u0902\u0921','\u0915\u094b\u0939\u0930\u093e',
    ],
    weight: 1.2,
  },
  {
    intent: INTENTS.MANDI_PRICE,
    keywords: [
      'mandi','manndi','bhav','bhaav','bhao','bhaao','baahub','baahu','baav','bav',
      'rate','ret','reyt','keemat','kimat','dam','daam','bazar','bazaar','market',
      'price','cost','msp','bikri','bechna','kharid','khareed','tol',
      'chawal','chaval','chaawal','dhan','dhaan','rice','paddy','basmati',
      'gehu','gehun','genhu','gehoon','wheat',
      'sarson','sarso','mustard','toriya',
      'makka','makai','maize','corn',
      'chana','gram','dal','daal','moong','urad','arhar','toor','tur','masoor',
      'aloo','aalu','potato',
      'pyaaz','pyaj','pyaz','onion','kanda',
      'tamatar','tomato','mirch','mirchi','chilli',
      'lahsun','lehsun','garlic',
      'kapas','cotton','rui',
      'soyabean','soybean','soya',
      'bajra','bajara','jowar','sorghum',
      'ganna','sugarcane',
      '\u092e\u0902\u0921\u0940','\u092d\u093e\u0935','\u0915\u0940\u092e\u0924','\u0926\u093e\u092e','\u0930\u0947\u091f',
      '\u090f\u092e\u090f\u0938\u092a\u0940','\u092c\u093e\u091c\u093e\u0930','\u092c\u093f\u0915\u094d\u0930\u0940','\u0916\u0930\u0940\u0926',
      '\u091a\u093e\u0935\u0932','\u0927\u093e\u0928','\u092c\u093e\u0938\u092e\u0924\u0940',
      '\u0917\u0947\u0939\u0942\u0902','\u0917\u0947\u0902\u0939\u0942','\u0938\u0930\u0938\u094b\u0902','\u092e\u0915\u094d\u0915\u093e',
      '\u091a\u0928\u093e','\u0906\u0932\u0942','\u092a\u094d\u092f\u093e\u091c','\u0915\u093e\u0902\u0926\u093e','\u091f\u092e\u093e\u091f\u0930',
      '\u0915\u092a\u093e\u0938','\u0938\u094b\u092f\u093e\u092c\u0940\u0928','\u092c\u093e\u091c\u0930\u093e','\u0917\u0928\u094d\u0928\u093e','\u0926\u093e\u0932',
    ],
    weight: 1.3,
  },
  {
    intent: INTENTS.GOVT_SCHEME,
    keywords: [
      'yojana','scheme','sarkar','sarkari','subsidy','loan','rin',
      'pm kisan','fasal bima','bima','insurance','anudan','sahayata',
      'kcc','kisan credit','pradhan mantri','pradhanmantri','pmfby',
      '\u092f\u094b\u091c\u0928\u093e','\u0938\u0930\u0915\u093e\u0930','\u0938\u092c\u094d\u0938\u093f\u0921\u0940',
      '\u0930\u093f\u0923','\u092b\u0938\u0932 \u092c\u0940\u092e\u093e','\u0905\u0928\u0941\u0926\u093e\u0928','\u0938\u0939\u093e\u092f\u0924\u093e',
    ],
    weight: 1.0,
  },
  {
    intent: INTENTS.CROP_DISEASE,
    keywords: [
      'bimari','rog','daag','pilaa','pila','jhulsna','jhulsa',
      'pattee','patta','kida','keeda','keede','insect','fungus',
      'rust','blight','mildew','disease','spotted',
      'fasal kharab','fasal bimar',
      '\u092c\u0940\u092e\u093e\u0930\u0940','\u0930\u094b\u0917','\u0926\u093e\u0917','\u092a\u0940\u0932\u093e',
      '\u091d\u0941\u0932\u0938\u093e','\u092a\u0924\u094d\u0924\u0940','\u0915\u0940\u0921\u093c\u093e','\u092b\u092b\u0942\u0902\u0926',
    ],
    weight: 1.2,
  },
  {
    intent: INTENTS.CROP_CARE,
    keywords: [
      'fasal','kheti','ugana','ugaana','bona','harvest','katai',
      'crop','plant','cultivation','farming',
      '\u092b\u0938\u0932','\u0916\u0947\u0924\u0940','\u0909\u0917\u093e\u0928\u093e','\u0915\u091f\u093e\u0908',
    ],
    weight: 0.8,
  },
  {
    intent: INTENTS.FERTILIZER,
    keywords: [
      'khad','khaad','urea','dap','npk','fertilizer','nutrients',
      'potash','nitrogen','phosphorus','organic','jaivik','compost','vermicompost',
      '\u0916\u093e\u0926','\u092f\u0942\u0930\u093f\u092f\u093e','\u091c\u0948\u0935\u093f\u0915',
    ],
    weight: 1.0,
  },
  {
    intent: INTENTS.IRRIGATION,
    keywords: [
      'sinchai','paani','pani','irrigation','drip','pump',
      'bore','nalkoop','well','sprinkler','nahar','canal',
      '\u0938\u093f\u0902\u091a\u093e\u0908','\u092a\u093e\u0928\u0940','\u0928\u0932\u0915\u0942\u092a',
    ],
    weight: 1.0,
  },
  {
    intent: INTENTS.PEST_CONTROL,
    keywords: [
      'keetnaashak','keetnashak','pesticide','spray','dawai','dawa',
      'chhidkav','neem','insecticide','fungicide','herbicide','weed','kharpatawar',
      '\u0915\u0940\u091f\u0928\u093e\u0936\u0915','\u0926\u0935\u093e\u0908','\u091b\u093f\u0921\u093c\u0915\u093e\u0935',
    ],
    weight: 1.0,
  },
  {
    intent: INTENTS.SEED_INFO,
    keywords: [
      'beej','seed','variety','kism','hybrid','certified','pramaanik','nursery','seedling',
      '\u0915\u093f\u0938\u094d\u092e','\u092c\u0940\u091c',
    ],
    weight: 0.9,
  },
  {
    intent: INTENTS.GREETING,
    keywords: [
      'namaste','namaskar','hello','hi','helo','jai hind','jai kisan',
      'kya haal','kaisa hai','theek hai',
      '\u0928\u092e\u0938\u094d\u0924\u0947','\u0928\u092e\u0938\u094d\u0915\u093e\u0930','\u0939\u0947\u0932\u094b',
    ],
    weight: 0.7,
  },
  {
    intent: INTENTS.HELPLINE,
    keywords: [
      'helpline','number','call','phone','contact','madad','help',
      'KVK','kisan call center','1800','toll free',
      '\u092e\u0926\u0926','\u0938\u0939\u093e\u092f\u0924\u093e',
    ],
    weight: 1.0,
  },
];

// Response Templates
export const INTENT_RESPONSES = {
  [INTENTS.WEATHER]: {
    text: "Today's Weather & Farmer Advisory: Max Temp 32C, Min Temp 23C. Partly cloudy with 40% chance of light afternoon rain. Wind: 14 km/h, Humidity: 72%. Advice: 1) No pesticide spray today. 2) Postpone irrigation 24-48 hrs. 3) Cover harvested crops. Weather clears from Wednesday.",
    textHindi: '\u0906\u091c \u0915\u093e \u092e\u094c\u0938\u092e \u0914\u0930 \u091c\u0930\u0942\u0930\u0940 \u0915\u093f\u0938\u093e\u0928 \u0938\u0932\u093e\u0939: \u0924\u093e\u092a\u092e\u093e\u0928: \u0905\u0927\u093f\u0915\u0924\u092e 32\u00b0C, \u0928\u094d\u092f\u0942\u0928\u0924\u092e 23\u00b0C | \u0906\u0902\u0936\u093f\u0915 \u092c\u093e\u0926\u0932, \u0926\u094b\u092a\u0939\u0930 \u092c\u093e\u0926 40% \u0939\u0932\u094d\u0915\u0940 \u092c\u093e\u0930\u093f\u0936 \u0915\u0940 \u0938\u0902\u092d\u093e\u0935\u0928\u093e | \u0939\u0935\u093e: 14 \u0915\u093f\u092e\u0940/\u0918\u0902\u091f\u093e, \u0928\u092e\u0940: 72%\u0964 \u091c\u0930\u0942\u0930\u0940 \u0938\u0932\u093e\u0939: (1) \u0906\u091c \u0915\u0940\u091f\u0928\u093e\u0936\u0915 \u091b\u093f\u0921\u093c\u0915\u093e\u0935 \u0928 \u0915\u0930\u0947\u0902 (2) \u0905\u0917\u0932\u0947 24-48 \u0918\u0902\u091f\u0947 \u0938\u093f\u0902\u091a\u093e\u0908 \u091f\u093e\u0932\u0947\u0902 (3) \u0915\u091f\u0940 \u092b\u0938\u0932 \u0924\u093f\u0930\u092a\u093e\u0932 \u0938\u0947 \u0922\u0915\u0947\u0902\u0964 \u092c\u0941\u0927\u0935\u093e\u0930 \u0938\u0947 \u092e\u094c\u0938\u092e \u0938\u093e\u092b \u0930\u0939\u0947\u0917\u093e\u0964',
    emoji: '\u26c5',
  },
  [INTENTS.MANDI_PRICE]: {
    text: "Today's Mandi & MSP Rates: Paddy Rs 2300/qtl (Basmati Rs 3450-4150). Wheat Rs 2420-2680/qtl (MSP Rs 2275). Mustard Rs 5400-5850/qtl (MSP Rs 5650). Soybean Rs 4400-4850/qtl (MSP Rs 4892). Cotton Rs 6950-7650/qtl (MSP Rs 7121). For live rates visit eNAM (enam.gov.in) or call 1800-270-0224 free.",
    textHindi: '\u0906\u091c \u0915\u0947 \u092a\u094d\u0930\u092e\u0941\u0916 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935 (MSP \u0938\u0939\u093f\u0924): \u0927\u093e\u0928/\u091a\u093e\u0935\u0932: \u20b92,300-2,520/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 | \u092c\u093e\u0938\u092e\u0924\u0940: \u20b93,450-4,150 | \u0917\u0947\u0939\u0942\u0902: \u20b92,420-2,680/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 (MSP: \u20b92,275) | \u0938\u0930\u0938\u094b\u0902: \u20b95,400-5,850 (MSP: \u20b95,650) | \u0938\u094b\u092f\u093e\u092c\u0940\u0928: \u20b94,400-4,850 (MSP: \u20b94,892) | \u0915\u092a\u093e\u0938: \u20b96,950-7,650 (MSP: \u20b97,121)\u0964 \u0932\u093e\u0907\u0935 \u092d\u093e\u0935 \u0915\u0947 \u0932\u093f\u090f eNAM (enam.gov.in) \u0926\u0947\u0916\u0947\u0902 \u092f\u093e \u091f\u094b\u0932-\u092b\u094d\u0930\u0940 1800-270-0224 \u092a\u0930 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0964',
    emoji: '\ud83d\udcb0',
  },
  [INTENTS.GOVT_SCHEME]: {
    text: "Key Government Schemes: 1) PM-KISAN Rs 6000/year in 3 installments (pmkisan.gov.in). 2) PM Fasal Bima (PMFBY): crop insurance at just 1.5-2% premium. 3) Kisan Credit Card (KCC): farm credit at 4% interest. 4) Free soil testing at KVK.",
    textHindi: '\u092a\u094d\u0930\u092e\u0941\u0916 \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902: (1) PM-KISAN: \u20b96,000/\u0938\u093e\u0932 \u2014 3 \u0915\u093f\u0938\u094d\u0924\u094b\u0902 \u092e\u0947\u0902 \u0938\u0940\u0927\u0947 \u092c\u0948\u0902\u0915 \u0916\u093e\u0924\u0947 \u092e\u0947\u0902 (pmkisan.gov.in)\u0964 (2) PMFBY: \u092e\u093e\u0924\u094d\u0930 1.5%-2% \u092a\u094d\u0930\u0940\u092e\u093f\u092f\u092e \u092a\u0930 \u092a\u0942\u0930\u0940 \u092b\u0938\u0932 \u0938\u0941\u0930\u0915\u094d\u0937\u093e\u0964 (3) \u0915\u093f\u0938\u093e\u0928 \u0915\u094d\u0930\u0947\u0921\u093f\u091f \u0915\u093e\u0930\u094d\u0921 (KCC): 4% \u092c\u094d\u092f\u093e\u091c \u092a\u0930 3 \u0932\u093e\u0916 \u0924\u0915 \u0915\u0943\u0937\u093f \u0930\u093f\u0923\u0964 (4) KVK \u092e\u0947\u0902 \u092e\u0941\u092b\u094d\u0924 \u092e\u093f\u091f\u094d\u091f\u0940 \u091c\u093e\u0902\u091a\u0964',
    emoji: '\ud83c\udfd9\ufe0f',
  },
  [INTENTS.CROP_DISEASE]: {
    text: "Crop Disease: Tap 'Photo Se Poochho' and take a photo of the affected leaf - AI will detect the disease instantly! First aid: Spray 5ml Neem oil per liter water. Expert helpline: 1800-180-1551 (toll-free).",
    textHindi: '\u092b\u0938\u0932 \u0930\u094b\u0917 \u0928\u093f\u0926\u093e\u0928: \u0909\u092a\u0930 "\u092b\u094b\u091f\u094b \u0938\u0947 \u092a\u0942\u091b\u094b" \u092c\u091f\u0928 \u0926\u092c\u093e\u090f\u0902 \u0914\u0930 \u092a\u094d\u0930\u092d\u093e\u0935\u093f\u0924 \u092a\u0924\u094d\u0924\u0940 \u0915\u0940 \u0924\u0938\u094d\u0935\u0940\u0930 \u0932\u0947\u0902 \u2014 AI \u0924\u0941\u0930\u0902\u0924 \u0930\u094b\u0917 \u0915\u093e \u0928\u093e\u092e \u0914\u0930 \u0907\u0932\u093e\u091c \u092c\u0924\u093e\u090f\u0917\u093e! \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915 \u0909\u092a\u091a\u093e\u0930: 5ml \u0928\u0940\u092e \u0924\u0947\u0932 \u092a\u094d\u0930\u0924\u093f \u0932\u0940\u091f\u0930 \u092a\u093e\u0928\u0940 \u092e\u0947\u0902 \u091b\u093f\u0921\u093c\u0915\u0947\u0902\u0964 \u0935\u093f\u0936\u0947\u0937\u091c\u094d\u091e \u0938\u0932\u093e\u0939: 1800-180-1551 (\u091f\u094b\u0932-\u092b\u094d\u0930\u0940)\u0964',
    emoji: '\ud83d\udd2c',
  },
  [INTENTS.CROP_CARE]: {
    text: "Crop Management: 1) Seed treatment with Trichoderma before sowing. 2) Balanced NPK as per Soil Health Card. 3) Ensure moisture during tillering and flowering. 4) Crop rotation with legumes.",
    textHindi: '\u092b\u0938\u0932 \u092a\u094d\u0930\u092c\u0902\u0927\u0928 \u0938\u0932\u093e\u0939: (1) \u092c\u0941\u0935\u093e\u0908 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0924\u094d\u0930\u093e\u0907\u0915\u094b\u0921\u0930\u094d\u092e\u093e \u0938\u0947 \u092c\u0940\u091c\u094b\u092a\u091a\u093e\u0930 \u091c\u0930\u0942\u0930 \u0915\u0930\u0947\u0902\u0964 (2) \u092e\u0943\u0926\u093e \u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u0915\u093e\u0930\u094d\u0921 \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u0938\u0902\u0924\u0941\u0932\u093f\u0924 NPK \u0921\u093e\u0932\u0947\u0902\u0964 (3) \u0915\u0932\u094d\u0932\u0947 \u092b\u0942\u091f\u0924\u0947 \u0914\u0930 \u0926\u093e\u0928\u093e \u092c\u0928\u0924\u0947 \u0938\u092e\u092f \u0928\u092e\u0940 \u0915\u0940 \u0915\u092e\u0940 \u0928 \u0939\u094b\u0928\u0947 \u0926\u0947\u0902\u0964 (4) \u0926\u0932\u0939\u0928\u0940 \u092b\u0938\u0932\u094b\u0902 \u0915\u0947 \u0938\u093e\u0925 \u092b\u0938\u0932 \u091a\u0915\u094d\u0930 \u0905\u092a\u0928\u093e\u090f\u0902\u0964',
    emoji: '\ud83c\udf3e',
  },
  [INTENTS.FERTILIZER]: {
    text: "Fertilizer Guide: Urea = Nitrogen (leaf growth). DAP = Phosphorus (root strength, apply at sowing). MOP = Potassium (grain weight). Always soil test first. Apply 25kg zinc sulphate per acre.",
    textHindi: '\u0916\u093e\u0926 \u0938\u0932\u093e\u0939: \u092f\u0942\u0930\u093f\u092f\u093e (\u0928\u093e\u0907\u091f\u094d\u0930\u094b\u091c\u0928): \u092a\u0924\u094d\u0924\u093f\u092f\u094b\u0902 \u0915\u0940 \u0939\u0930\u093f\u092f\u093e\u0932\u0940 \u0935 \u0935\u0943\u0926\u094d\u0927\u093f\u0964 DAP (\u092b\u0949\u0938\u094d\u092b\u094b\u0930\u0938): \u091c\u0921\u093c\u094b\u0902 \u0915\u093e \u0935\u093f\u0915\u093e\u0938, \u092c\u0941\u0935\u093e\u0908 \u0915\u0947 \u0938\u092e\u092f \u0921\u093e\u0932\u0947\u0902\u0964 MOP (\u092a\u094b\u091f\u093e\u0936): \u0926\u093e\u0928\u0947 \u0915\u093e \u0935\u091c\u0928 \u0935 \u0930\u094b\u0917-\u092a\u094d\u0930\u0924\u093f\u0930\u094b\u0927\u0964 \u0938\u0932\u093e\u0939: \u092c\u093f\u0928\u093e \u092e\u093f\u091f\u094d\u091f\u0940 \u092a\u0930\u0940\u0915\u094d\u0937\u0923 \u092f\u0942\u0930\u093f\u092f\u093e \u0905\u0927\u093f\u0915 \u0928 \u0921\u093e\u0932\u0947\u0902\u0964 25 \u0915\u093f\u0932\u094b \u091c\u093f\u0902\u0915 \u0938\u0932\u094d\u092b\u0947\u091f \u092a\u094d\u0930\u0924\u093f \u090f\u0915\u0921\u093c \u091c\u0930\u0942\u0930 \u0921\u093e\u0932\u0947\u0902\u0964',
    emoji: '\ud83e\uddea',
  },
  [INTENTS.IRRIGATION]: {
    text: "Smart Irrigation: Drip/sprinkler saves 30-50% water with 55-90% subsidy under PMKSY. Water crops 6-8 AM or after 5 PM to reduce evaporation. Avoid waterlogging during flowering.",
    textHindi: '\u0938\u093f\u0902\u091a\u093e\u0908 \u0938\u0932\u093e\u0939: \u091f\u092a\u0915 (Drip) \u0935 \u092b\u0935\u094d\u0935\u093e\u0930\u093e (Sprinkler) \u0938\u093f\u0902\u091a\u093e\u0908 \u0905\u092a\u0928\u093e\u090f\u0902 \u2014 40% \u092a\u093e\u0928\u0940 \u0915\u0940 \u092c\u091a\u0924\u0964 PMKSY \u092e\u0947\u0902 55%-90% \u0938\u092c\u094d\u0938\u093f\u0921\u0940\u0964 \u0938\u093f\u0902\u091a\u093e\u0908 \u0938\u0941\u092c\u0939 6-8 \u092c\u091c\u0947 \u092f\u093e \u0936\u093e\u092e 5 \u092c\u091c\u0947 \u0915\u0947 \u092c\u093e\u0926 \u0915\u0930\u0947\u0902\u0964 \u092b\u0942\u0932 \u0906\u0928\u0947 \u0915\u0947 \u0938\u092e\u092f \u091c\u0932\u092d\u0930\u093e\u0935 \u0938\u0947 \u092c\u091a\u0947\u0902\u0964',
    emoji: '\ud83d\udca7',
  },
  [INTENTS.PEST_CONTROL]: {
    text: "Pest Control (IPM): 1) Install yellow sticky traps and pheromone traps. 2) Organic spray: 5ml Neem oil (1500ppm) + 1ml liquid soap per liter. 3) For severe attacks consult KVK or call 1800-180-1551.",
    textHindi: '\u0915\u0940\u091f \u0928\u093f\u092f\u0902\u0924\u094d\u0930\u0923 (IPM): (1) \u092a\u0940\u0932\u0947 \u091a\u093f\u092a\u091a\u093f\u092a\u0947 \u0915\u093e\u0930\u094d\u0921 \u0935 \u092b\u0947\u0930\u094b\u092e\u094b\u0928 \u091f\u094d\u0930\u0948\u092a \u0932\u0917\u093e\u090f\u0902\u0964 (2) \u091c\u0948\u0935\u093f\u0915 \u091b\u093f\u0921\u093c\u0915\u093e\u0935: 5ml \u0928\u0940\u092e \u0924\u0947\u0932 (1500 PPM) + 1ml \u0938\u0930\u094d\u092b \u092a\u094d\u0930\u0924\u093f \u0932\u0940\u091f\u0930 \u092a\u093e\u0928\u0940, \u0938\u0941\u092c\u0939 7 \u092c\u091c\u0947\u0964 (3) \u0917\u0902\u092d\u0940\u0930 \u092a\u094d\u0930\u0915\u094b\u092a \u092a\u0930 KVK \u0938\u0947 \u0938\u0902\u0938\u094d\u0924\u0941\u0924 \u0915\u0940\u091f\u0928\u093e\u0936\u0915 \u091c\u093e\u0928\u0947\u0902 \u092f\u093e 1800-180-1551 \u092a\u0930 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0964',
    emoji: '\ud83d\udc1b',
  },
  [INTENTS.SEED_INFO]: {
    text: "Seed Selection: Buy only certified seeds from NSC or State Seeds Corporation. Check germination certificate (min 85%). Choose disease-resistant, high-yield varieties suited to your region. Consult KVK.",
    textHindi: '\u092c\u0940\u091c \u091a\u092f\u0928: NSC \u092f\u093e \u0930\u093e\u091c\u094d\u092f \u092c\u0940\u091c \u0928\u093f\u0917\u092e \u0938\u0947 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092c\u0940\u091c \u0939\u0940 \u0916\u0930\u0940\u0926\u0947\u0902\u0964 \u0905\u0902\u0915\u0941\u0930\u0923 \u0915\u094d\u0937\u092e\u0924\u093e \u0915\u092e \u0938\u0947 \u0915\u092e 85% \u091c\u093e\u0902\u091a\u0947\u0902\u0964 \u0905\u092a\u0928\u0947 \u091c\u093f\u0932\u0947 \u0915\u0940 \u091c\u0932\u0935\u093e\u092f\u0941-\u0905\u0928\u0941\u0915\u0942\u0932 \u0930\u094b\u0917-\u0930\u094b\u0927\u0940 \u0909\u091a\u094d\u091a \u092a\u0948\u0926\u093e\u0935\u093e\u0930 \u0915\u093f\u0938\u094d\u092e \u0915\u0947 \u0932\u093f\u090f KVK \u0938\u0947 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0932\u0947\u0902\u0964',
    emoji: '\ud83c\udf31',
  },
  [INTENTS.GREETING]: {
    text: "Namaste Kisan Bhai! I am your Kisan Sahayak. Ask me about: Mandi rates (paddy, wheat, mustard), Weather forecast, Government schemes (PM-KISAN, PMFBY), or Crop diseases!",
    textHindi: '\u0928\u092e\u0938\u094d\u0924\u0947 \u0915\u093f\u0938\u093e\u0928 \u092d\u093e\u0908! \u092e\u0948\u0902 \u0906\u092a\u0915\u093e \u0906\u0935\u093e\u091c\u093c \u0938\u0939\u093e\u092f\u0915 \u0939\u0942\u0902\u0964 \u0906\u092a \u092e\u0941\u091d\u0938\u0947 \u092a\u0942\u091b \u0938\u0915\u0924\u0947 \u0939\u0948\u0902: \u0927\u093e\u0928, \u0917\u0947\u0939\u0942\u0902, \u0938\u0930\u0938\u094b\u0902 \u0915\u0947 \u0906\u091c \u0915\u0947 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935 | \u092c\u093e\u0930\u093f\u0936 \u0914\u0930 \u092e\u094c\u0938\u092e \u0915\u093e \u092a\u0942\u0930\u094d\u0935\u093e\u0928\u0941\u092e\u093e\u0928 | PM-KISAN, \u092b\u0938\u0932 \u092c\u0940\u092e\u093e, KCC \u092f\u094b\u091c\u0928\u093e\u090f\u0902 | \u092b\u0938\u0932 \u0930\u094b\u0917 \u0914\u0930 \u0926\u0935\u093e\u0908 \u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940',
    emoji: '\ud83d\ude4f',
  },
  [INTENTS.HELPLINE]: {
    text: "Government Farmer Helplines (all toll-free): Kisan Call Centre (24x7): 1800-180-1551. PM-KISAN: 155261. PM Fasal Bima: 1800-200-7710. eNAM Mandi: 1800-270-0224.",
    textHindi: '\u0938\u0930\u0915\u093e\u0930\u0940 \u0915\u093f\u0938\u093e\u0928 \u0939\u0947\u0932\u094d\u092a\u0932\u093e\u0907\u0928 (\u0938\u092d\u0940 \u091f\u094b\u0932-\u092b\u094d\u0930\u0940): \u0915\u093f\u0938\u093e\u0928 \u0915\u0949\u0932 \u0938\u0947\u0902\u091f\u0930 (24x7): 1800-180-1551 | PM-KISAN: 155261 | \u092a\u094d\u0930\u0927\u093e\u0928\u092e\u0902\u0924\u094d\u0930\u0940 \u092b\u0938\u0932 \u092c\u0940\u092e\u093e: 1800-200-7710 | eNAM \u092e\u0902\u0921\u0940 \u0938\u0939\u093e\u092f\u0924\u093e: 1800-270-0224',
    emoji: '\ud83d\udcde',
  },
  [INTENTS.UNKNOWN]: {
    text: "I didn't understand. Please ask about: Mandi prices (paddy/wheat/mustard), Weather (rain forecast), Government schemes (PM-KISAN), or Crop diseases.",
    textHindi: '\u0915\u094d\u0937\u092e\u093e \u0915\u0930\u0947\u0902, \u092e\u0941\u091d\u0947 \u0938\u092e\u091d \u0928\u0939\u0940\u0902 \u0906\u092f\u093e\u0964 \u0906\u092a \u092a\u0942\u091b \u0938\u0915\u0924\u0947 \u0939\u0948\u0902: \u0906\u091c \u0927\u093e\u0928/\u0917\u0947\u0939\u0942\u0902/\u0938\u0930\u0938\u094b\u0902 \u0915\u093e \u0915\u094d\u092f\u093e \u092d\u093e\u0935 \u0939\u0948? | \u0906\u091c \u092c\u093e\u0930\u093f\u0936 \u0939\u094b\u0917\u0940 \u0915\u094d\u092f\u093e? | PM \u0915\u093f\u0938\u093e\u0928 \u092e\u0947\u0902 \u0915\u0948\u0938\u0947 \u0905\u092a\u094d\u0932\u093e\u0908 \u0915\u0930\u0947\u0902? | \u092b\u0938\u0932 \u092e\u0947\u0902 \u092c\u0940\u092e\u093e\u0930\u0940 \u0915\u093e \u0907\u0932\u093e\u091c \u0915\u094d\u092f\u093e \u0939\u0948?',
    emoji: '\ud83e\udd14',
  },
};

// Normalize Hinglish text for better matching
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/baahub|baahu|bhaav|bhao|bhaao|baav\b|bav\b|bhavv/g, 'bhav')
    .replace(/chaval|chaawal|chawall|chawl/g, 'chawal')
    .replace(/gehun|genhu|gehoon|gahu/g, 'gehu')
    .replace(/sarso\b|sarsonn/g, 'sarson')
    .replace(/pyaj\b|pyaz\b/g, 'pyaaz')
    .replace(/khet\b|kheti\b|khetee/g, 'fasal')
    .replace(/paani|pani|jal\b/g, 'paani')
    .replace(/dawaai|dawai|dawa\b/g, 'dawai')
    .replace(/baarishh|barsaat/g, 'barish')
    .trim();
}

// Core Intent Detection
export function detectIntent(text) {
  if (!text || text.trim().length === 0) {
    return { intent: INTENTS.UNKNOWN, confidence: 0, response: INTENT_RESPONSES[INTENTS.UNKNOWN], allScores: {} };
  }

  const rawLower   = text.toLowerCase().trim();
  const normalized = normalizeText(text);
  const combined   = normalized + ' ' + rawLower;

  const scores = {};
  for (const rule of INTENT_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (combined.includes(keyword.toLowerCase())) {
        score += rule.weight;
      }
    }
    if (score > 0) {
      scores[rule.intent] = (scores[rule.intent] || 0) + score;
    }
  }

  const entries = Object.entries(scores);
  if (entries.length === 0) {
    return { intent: INTENTS.UNKNOWN, confidence: 0.3, response: INTENT_RESPONSES[INTENTS.UNKNOWN], allScores: {} };
  }

  entries.sort((a, b) => b[1] - a[1]);
  const [bestIntent, bestScore] = entries[0];
  const totalKeywords = INTENT_RULES.find(r => r.intent === bestIntent)?.keywords.length || 10;
  const confidence = Math.min(0.95, Math.max(0.55, bestScore / (totalKeywords * 0.15)));

  let finalResponse = INTENT_RESPONSES[bestIntent] || INTENT_RESPONSES[INTENTS.UNKNOWN];

  // Mandi - crop-specific responses
  if (bestIntent === INTENTS.MANDI_PRICE) {
    const r = combined;
    const isRice    = r.includes('chawal') || r.includes('dhan') || r.includes('rice') || r.includes('paddy') || r.includes('basmati');
    const isWheat   = r.includes('gehu') || r.includes('wheat');
    const isMustard = r.includes('sarson') || r.includes('mustard') || r.includes('toriya');
    const isCotton  = r.includes('kapas') || r.includes('cotton');
    const isSoybean = r.includes('soyabean') || r.includes('soybean');
    const isVeg     = r.includes('pyaaz') || r.includes('aloo') || r.includes('tamatar');

    if (isRice) {
      finalResponse = {
        text: "Paddy & Rice Rates Today: Common Paddy MSP Rs 2300/qtl (Spot: Rs 2280-2520). Grade A MSP Rs 2320. Basmati (1509/1121): Rs 3450-4150/qtl. Keep moisture below 17% to avoid mandi deductions. Register on eNAM for guaranteed MSP.",
        textHindi: '\u0906\u091c \u0915\u093e \u0927\u093e\u0928 / \u091a\u093e\u0935\u0932 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935: \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u0927\u093e\u0928 MSP: \u20b92,300/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 | \u0939\u093e\u091c\u093f\u0930 \u092d\u093e\u0935: \u20b92,280-2,520 | \u0917\u094d\u0930\u0947\u0921 A \u0927\u093e\u0928 MSP: \u20b92,320 | \u092c\u093e\u0938\u092e\u0924\u0940 (1509/1121): \u20b93,450-4,150/\u0915\u094d\u0935\u093f\u0902\u091f\u0932\u0964 \u091c\u0930\u0942\u0930\u0940 \u0938\u0932\u093e\u0939: \u092e\u0902\u0921\u0940 \u0932\u0947 \u091c\u093e\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0927\u093e\u0928 \u0915\u0940 \u0928\u092e\u0940 17% \u0938\u0947 \u0915\u092e \u0930\u0916\u0947\u0902 \u2014 \u0928\u0939\u0940\u0902 \u0924\u094b \u092d\u093e\u0935 \u092e\u0947\u0902 \u0915\u091f\u094c\u0924\u0940 \u0939\u094b\u0917\u0940\u0964 MSP \u092a\u0930 \u092c\u093f\u0915\u094d\u0930\u0940 \u0915\u0947 \u0932\u093f\u090f eNAM (enam.gov.in) \u092a\u0930 \u0930\u091c\u093f\u0938\u094d\u091f\u094d\u0930\u0947\u0936\u0928 \u0915\u0930\u0947\u0902\u0964',
        emoji: '\ud83c\udf3e',
      };
    } else if (isWheat) {
      finalResponse = {
        text: "Wheat Rates Today: MSP Rs 2275/qtl. Spot mandi: Rs 2420-2680/qtl (strong flour mill demand, above MSP). If you have safe storage, do not rush to sell.",
        textHindi: '\u0906\u091c \u0915\u093e \u0917\u0947\u0939\u0942\u0902 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935: MSP: \u20b92,275/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 | \u0939\u093e\u091c\u093f\u0930 \u092e\u0902\u0921\u0940: \u20b92,420-2,680/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 (\u0906\u091f\u093e \u092e\u093f\u0932\u094b\u0902 \u0915\u0940 \u092d\u093e\u0930\u0940 \u092e\u093e\u0902\u0917, MSP \u0938\u0947 \u0913\u092a\u0930)\u0964 \u0938\u0932\u093e\u0939: \u092f\u0926\u093f \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092d\u0902\u0921\u093e\u0930 \u0939\u0948 \u0924\u094b \u091c\u0932\u094d\u0926\u092c\u093e\u091c\u0940 \u092e\u0947\u0902 \u0915\u092e \u0926\u093e\u092e \u092a\u0930 \u0928 \u092c\u0947\u091a\u0947\u0902\u0964',
        emoji: '\ud83c\udf3e',
      };
    } else if (isMustard) {
      finalResponse = {
        text: "Mustard Rates Today: MSP Rs 5650/qtl. Spot mandi: Rs 5400-5850/qtl (standard 42% oil condition). Get oil content tested before finalizing auction rate.",
        textHindi: '\u0906\u091c \u0915\u093e \u0938\u0930\u0938\u094b\u0902 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935: MSP: \u20b95,650/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 | \u0939\u093e\u091c\u093f\u0930 \u092e\u0902\u0921\u0940: \u20b95,400-5,850/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 (\u092e\u093e\u0928\u0915 42% \u0924\u0947\u0932 \u0915\u0902\u0921\u0940\u0936\u0928)\u0964 \u0938\u0932\u093e\u0939: \u0924\u094c\u0932 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0924\u0947\u0932 \u092a\u094d\u0930\u0924\u093f\u0936\u0924 \u0915\u0940 \u091c\u093e\u0902\u091a \u0915\u0930\u0935\u093e\u090f\u0902 \u2014 \u0938\u0939\u0940 \u0917\u094d\u0930\u0947\u0921 \u0914\u0930 \u092d\u093e\u0935 \u092e\u093f\u0932\u0947\u0917\u093e\u0964',
        emoji: '\ud83d\udfe1',
      };
    } else if (isCotton) {
      finalResponse = {
        text: "Cotton Rates Today: Medium Staple MSP Rs 7121/qtl, Long Staple MSP Rs 7521/qtl. Spot: Rs 6950-7650/qtl. Ensure dry, trash-free cotton for top grade price.",
        textHindi: '\u0906\u091c \u0915\u093e \u0915\u092a\u093e\u0938 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935: \u092e\u0927\u094d\u092f\u092e \u0930\u0947\u0936\u093e MSP: \u20b97,121/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 | \u0932\u0902\u092c\u093e \u0930\u0947\u0936\u093e MSP: \u20b97,521 | \u0939\u093e\u091c\u093f\u0930 \u092d\u093e\u0935: \u20b96,950-7,650/\u0915\u094d\u0935\u093f\u0902\u091f\u0932\u0964 \u0938\u0932\u093e\u0939: \u0915\u092a\u093e\u0938 \u092e\u0947\u0902 \u0915\u091a\u0930\u093e \u0914\u0930 \u0928\u092e\u0940 \u0928 \u0939\u094b, \u0924\u092d\u0940 \u0917\u094d\u0930\u0947\u0921-1 \u0915\u093e \u092a\u0942\u0930\u093e \u092d\u093e\u0935 \u092e\u093f\u0932\u0947\u0917\u093e\u0964',
        emoji: '\u26aa',
      };
    } else if (isSoybean) {
      finalResponse = {
        text: "Soybean Rates Today: MSP Rs 4892/qtl. Spot: Rs 4400-4850/qtl. Register with NAFED/eNAM to get full MSP benefit.",
        textHindi: '\u0906\u091c \u0915\u093e \u0938\u094b\u092f\u093e\u092c\u0940\u0928 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935: MSP: \u20b94,892/\u0915\u094d\u0935\u093f\u0902\u091f\u0932 | \u0939\u093e\u091c\u093f\u0930 \u092d\u093e\u0935: \u20b94,400-4,850/\u0915\u094d\u0935\u093f\u0902\u091f\u0932\u0964 \u0938\u0932\u093e\u0939: NAFED \u0938\u0930\u0915\u093e\u0930\u0940 \u0916\u0930\u0940\u0926 \u0915\u0947\u0902\u0926\u094d\u0930 \u092a\u0930 \u092a\u0902\u091c\u0940\u0915\u0930\u0923 \u0915\u0930\u093e\u090f\u0902 \u0924\u093e\u0915\u093f MSP \u0915\u093e \u092a\u0942\u0930\u093e \u0932\u093e\u092d \u092e\u093f\u0932\u0947\u0964',
        emoji: '\ud83c\udf31',
      };
    } else if (isVeg) {
      finalResponse = {
        text: "Vegetable Mandi Rates Today: Onion Rs 26-38/kg. Potato Rs 18-25/kg. Tomato Rs 22-36/kg. Deliver to mandi early morning for 5-10% better prices.",
        textHindi: '\u0906\u091c \u0915\u093e \u0938\u092c\u094d\u091c\u0940 \u0925\u094b\u0915 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935: \u092a\u094d\u092f\u093e\u091c: \u20b926-38/\u0915\u093f\u0932\u094b | \u0906\u0932\u0942: \u20b918-25/\u0915\u093f\u0932\u094b | \u091f\u092e\u093e\u091f\u0930: \u20b922-36/\u0915\u093f\u0932\u094b\u0964 \u0938\u0932\u093e\u0939: \u092e\u0902\u0921\u0940 \u092e\u0947\u0902 \u0938\u0941\u092c\u0939 \u091c\u0932\u094d\u0926\u0940 \u092e\u093e\u0932 \u092a\u0939\u0941\u0902\u091a\u093e\u0928\u0947 \u092a\u0930 5%-10% \u0905\u0927\u093f\u0915 \u092d\u093e\u0935 \u092e\u093f\u0932\u0924\u093e \u0939\u0948\u0964',
        emoji: '\ud83c\udf45',
      };
    }
  }

  // Weather sub-queries
  else if (bestIntent === INTENTS.WEATHER) {
    const r = combined;
    const isRain = r.includes('barish') || r.includes('rain') || r.includes('barsaat');
    const isTemp = r.includes('tapman') || r.includes('temperature') || r.includes('garmi') || r.includes('dhoop');

    if (isRain) {
      finalResponse = {
        text: "Rainfall Alert: 45% chance of light to moderate showers with thunderstorms this afternoon. Wind 16 km/h. Essential: Clear field drainage, halt chemical spraying, cover all harvested crops.",
        textHindi: '\u092c\u093e\u0930\u093f\u0936 \u092a\u0942\u0930\u094d\u0935\u093e\u0928\u0941\u092e\u093e\u0928: \u0906\u091c \u0926\u094b\u092a\u0939\u0930 \u092c\u093e\u0926 \u0917\u0930\u091c-\u091a\u092e\u0915 \u0915\u0947 \u0938\u093e\u0925 45% \u0939\u0932\u094d\u0915\u0940 \u0938\u0947 \u092e\u0927\u094d\u092f\u092e \u092c\u093e\u0930\u093f\u0936 \u0915\u0940 \u0938\u0902\u092d\u093e\u0935\u0928\u093e \u0939\u0948\u0964 \u0939\u0935\u093e 16 \u0915\u093f\u092e\u0940/\u0918\u0902\u091f\u093e\u0964 \u091c\u0930\u0942\u0930\u0940 \u0938\u0932\u093e\u0939: \u0916\u0947\u0924\u094b\u0902 \u092e\u0947\u0902 \u091c\u0932 \u0928\u093f\u0915\u093e\u0938\u0940 \u0915\u0947 \u0930\u093e\u0938\u094d\u0924\u0947 \u0938\u093e\u092b \u0930\u0916\u0947\u0902, \u0915\u0940\u091f\u0928\u093e\u0936\u0915 \u0914\u0930 \u092f\u0942\u0930\u093f\u092f\u093e \u091b\u093f\u0921\u093c\u0915\u093e\u0935 \u0924\u0941\u0930\u0902\u0924 \u0930\u094b\u0915\u0947\u0902, \u0915\u091f\u0940 \u092b\u0938\u0932 \u0924\u093f\u0930\u092a\u093e\u0932 \u0938\u0947 \u0922\u0915\u0947\u0902\u0964',
        emoji: '\ud83c\udf27\ufe0f',
      };
    } else if (isTemp) {
      finalResponse = {
        text: "Temperature Outlook: Max 33C, Min 22C. Moderate afternoon heat with clouds. Advice: Avoid irrigation 11 AM-4 PM. Best time: 6-9 AM or after 5 PM.",
        textHindi: '\u0924\u093e\u092a\u092e\u093e\u0928 \u0930\u093f\u092a\u094b\u0930\u094d\u091f: \u0905\u0927\u093f\u0915\u0924\u092e 33\u00b0C, \u0928\u094d\u092f\u0942\u0928\u0924\u092e 22\u00b0C\u0964 \u0926\u094b\u092a\u0939\u0930 \u092e\u0947\u0902 \u0924\u0947\u091c \u0927\u0942\u092a\u0964 \u0938\u0932\u093e\u0939: \u0926\u094b\u092a\u0939\u0930 11 \u0938\u0947 4 \u092c\u091c\u0947 \u0915\u0947 \u092c\u0940\u091a \u0938\u093f\u0902\u091a\u093e\u0908 \u0928 \u0915\u0930\u0947\u0902\u0964 \u0938\u0939\u0940 \u0938\u092e\u092f: \u0938\u0941\u092c\u0939 6-9 \u092c\u091c\u0947 \u092f\u093e \u0936\u093e\u092e 5 \u092c\u091c\u0947 \u0915\u0947 \u092c\u093e\u0926\u0964',
        emoji: '\ud83c\udf21\ufe0f',
      };
    }
  }

  return {
    intent: bestIntent,
    confidence,
    response: finalResponse,
    allScores: Object.fromEntries(entries),
  };
}