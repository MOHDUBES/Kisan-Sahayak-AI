import { useState, useEffect, useRef } from "react";

// Supported Indian Languages & Regional Dialects
export const SUPPORTED_LANGUAGES = [
  { code: "HI", name: "हिन्दी", scriptName: "Hindi", locale: "hi-IN", flag: "🇮🇳" },
  { code: "HINGLISH", name: "Hinglish", scriptName: "रोमन हिन्दी", locale: "hi-IN", flag: "🌾" },
  { code: "EN", name: "English", scriptName: "English", locale: "en-IN", flag: "🌐" },
  { code: "PA", name: "ਪੰਜਾਬੀ", scriptName: "Punjabi", locale: "pa-IN", flag: "🚜" },
  { code: "MR", name: "मराठी", scriptName: "Marathi", locale: "mr-IN", flag: "🚩" },
  { code: "BN", name: "বাংলা", scriptName: "Bengali", locale: "bn-IN", flag: "🌾" },
  { code: "GU", name: "ગુજરાતી", scriptName: "Gujarati", locale: "gu-IN", flag: "🌱" },
  { code: "TA", name: "தமிழ்", scriptName: "Tamil", locale: "ta-IN", flag: "🌾" },
  { code: "TE", name: "తెలుగు", scriptName: "Telugu", locale: "te-IN", flag: "🌿" },
  { code: "KN", name: "ಕನ್ನಡ", scriptName: "Kannada", locale: "kn-IN", flag: "🍃" },
];

// Smart Language Auto-Detector based on text script & vocabulary
export function detectLanguage(text, currentLang = "HI") {
  if (!text || typeof text !== "string") return currentLang;
  const t = text.trim();

  // Gurmukhi (Punjabi)
  if (/[\u0A00-\u0A7F]/.test(t)) return "PA";
  // Bengali
  if (/[\u0980-\u09FF]/.test(t)) return "BN";
  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(t)) return "GU";
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(t)) return "TA";
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(t)) return "TE";
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(t)) return "KN";

  // Devanagari (Hindi or Marathi)
  if (/[\u0900-\u097F]/.test(t)) {
    if (/आहे|कशासाठी|शेतकरी|करावे|कसे|माहिती|पिके|रोग|भाव|खात/.test(t)) return "MR";
    return "HI";
  }

  // Latin alphabet: check if Hinglish
  const hinglishWords = [
    "kis", "liye", "liya", "kya", "hai", "kare", "kaise", "batao", "fasal", "khet",
    "gehu", "dhan", "bhav", "khad", "urea", "yojna", "yojana", "bimari", "rog", "kisan",
    "kisko", "kiske", "fayda", "faida", "chalaye", "chalu", "peela", "patte", "bima", "keeda",
    "kab", "kitna", "hoga", "mera", "meri", "naam", "app", "nahi", "kuch", "bhi", "sakte",
    "dekh", "kaun", "kyu", "kyun", "bataiye", "bata", "karna", "krishi", "kheti", "pani"
  ];
  const words = t.toLowerCase().split(/[\s,?.!]+/);
  const isHinglish = words.some(w => hinglishWords.includes(w));
  if (isHinglish) return "HINGLISH";

  return currentLang === "HI" || currentLang === "HINGLISH" ? currentLang : "EN";
}

// Multilingual Knowledge Base covering All Core Inquiries
const KNOWLEDGE_BASE = {
  HI: {
    greeting: "नमस्ते किसान भाई! 🙏 मैं आपका 24 घंटे सक्रिय किसान AI सहायक हूँ।\nआप मुझसे खेती, फसल रोग, मौसम, मंडी भाव, सरकारी योजनाओं या इस ऐप के बारे में अपनी भाषा में कुछ भी पूछ सकते हैं!",
    whyApp: {
      title: "यह ऐप किसलिए और क्यों बनाई गई है?",
      text: `🌾 **किसान सहायक AI किसलिए है और क्या करता है?**

यह ऐप भारत के अन्नदाताओं (किसानों) को सशक्त बनाने के लिए **Qualcomm Snapdragon AI Lab Challenge** के तहत तैयार किया गया है।

**🎯 यह ऐप किसलिए है (मुख्य कार्य):**
1. 📷 **फसल रोग डॉक्टर (Kisan Kavach):** खेत में फसल के बीमार पत्ते की फोटो खींचें। AI केवल 1 सेकंड में बीमारी, गंभीरता और पक्की दवा (जैविक + रासायनिक) बता देगा।
2. 🎙️ **आवाज़ सहायक (Awaaz Sahayak):** बिना टाइप किए बोलकर मौसम, बारिश, खाद की सही मात्रा और सिंचाई का समय पूछें।
3. 💰 **लाइव मंडी भाव:** गेहूं, धान, सरसों, कपास, मक्का आदि के दैनिक मंडी भाव सीधे अपनी हथेली पर देखें।
4. 🏛️ **सरकारी योजनाएं:** पीएम किसान सम्मान निधि (₹6,000/वर्ष), फसल बीमा (PMFBY) और केसीसी में 1-क्लिक में सीधा आवेदन करें।
5. 📶 **100% बिना इंटरनेट (Offline NPU):** खेत में नेटवर्क न होने पर भी यह ऐप सीधे फोन के प्रोसेसर (NPU) पर पूरी तरह काम करता है!`,
      actions: [
        { label: "📷 फसल रोग स्कैनर खोलें", view: "vision" },
        { label: "🏛️ सरकारी योजनाएं देखें", page: "schemes" },
        { label: "💰 आज का मंडी भाव", prompt: "आज का मंडी भाव बताओ" },
      ]
    },
    whoIsItFor: {
      title: "यह ऐप किसके लिए है?",
      text: `👥 **यह ऐप किसके लिए बनाई गई है?**

1. 👨‍🌾 **छोटे और सीमांत किसान (Small Farmers):** जिन्हें खेत में तुरंत वैज्ञानिक सलाह और सही कीटनाशक की पहचान चाहिए।
2. 🌾 **ग्रामीण कृषक परिवार:** जो अंग्रेजी टाइप करने के बजाय अपनी मातृभाषा में बोलकर जवाब चाहते हैं।
3. 🚜 **कृषि विज्ञान केंद्र (KVK) व फील्ड अधिकारी:** जो सुदूर गांवों में बिना इंटरनेट किसानों की समस्याओं का ऑन-स्पॉट समाधान करते हैं।
4. 🏢 **किसान उत्पादक संगठन (FPO):** सामूहिक रूप से मंडी भाव और सरकारी डीबीटी योजनाओं का लाभ लेने के लिए।`,
      actions: [
        { label: "🎙️ बोलकर पूछें (Voice Assistant)", view: "voice" },
        { label: "👤 किसान ID बनाएं / लॉगिन", action: "auth" },
      ]
    },
    whatCanDo: {
      title: "इस ऐप से क्या-क्या कर सकते हैं?",
      text: `🚀 **किसान सहायक AI से आप क्या-क्या कर सकते हैं:**

1. 📷 **फसल रोग स्कैन करें:** पत्ते की फोटो अपलोड करें, तुरंत रोग का नाम और सटीक उपचार पाएं।
2. 🎙️ **बोलकर सवाल पूछें:** मौसम, खाद, बीज, सिंचाई से जुड़े किसी भी सवाल का जवाब पाएं।
3. 💰 **दैनिक मंडी भाव जांचें:** अपनी फसल का सही मंडी दाम जानकर बिचौलियों से बचें।
4. 🏛️ **सरकारी योजनाओं में आवेदन:** पीएम-किसान, फसल बीमा, केसीसी के लिए डिजिटल फॉर्म भरें।
5. 🆔 **डिजिटल किसान ID:** अपनी व्यक्तिगत किसान ID प्राप्त करें जिससे सरकारी लाभ सीधे मिल सकें।`,
      actions: [
        { label: "📷 फसल स्कैनर खोलें", view: "vision" },
        { label: "🏛️ योजनाएं देखें", page: "schemes" },
      ]
    },
    howToUse: {
      title: "इस ऐप को कैसे इस्तेमाल करें?",
      text: `📱 **इस ऐप को इस्तेमाल करने का आसान तरीका:**

**चरण 1 (फसल बीमारी जांच):**
• होमपेज पर **'Launch Advisory Demo'** या **'Kisan Kavach'** पर क्लिक करें।
• पत्ते की फोटो खींचें या गैलरी से चुनें। AI तुरंत दवा का नाम बता देगा।

**चरण 2 (बोलकर सवाल पूछें):**
• **'Voice Query'** या **'Awaaz Sahayak'** बटन दबाएं।
• माइक दबाकर बोलें: जैसे *"गेहूं में खाद कब डालें?"* या *"आज बारिश होगी क्या?"*।

**चरण 3 (सरकारी योजना में आवेदन):**
• मेनू में **'Govt Schemes'** पर जाएं।
• योजना चुनकर **'1-Click Apply'** दबाएं।

**चरण 4 (अपनी किसान ID प्राप्त करें):**
• ऊपर **'Log In'** दबाकर अपनी किसान ID देखें या नया खाता बनाएं।`,
      actions: [
        { label: "🚀 अभी इस्तेमाल शुरू करें", view: "vision" },
        { label: "🏛️ योजनाएं देखें", page: "schemes" },
      ]
    },
  },

  HINGLISH: {
    greeting: "Namaste Kisan Bhai! 🙏 Main aapka 24-ghante active Kisan AI Assistant hoon.\nAap mujhse kheti, fasal bimari, mausam, mandi bhav, sarkari yojana ya is app ke baare me kuch bhi pooch sakte hain!",
    whyApp: {
      title: "Ye App kis liye hai aur kyu banaya gaya hai?",
      text: `🌾 **Kisan Sahayak AI kis liye hai aur kya karta hai?**

Ye app Bharat ke kisan bhaiyon ke liye **Qualcomm Snapdragon AI Lab Challenge** ke tehat banaya gaya hai.

**🎯 Ye app kis liye hai (Main Kaam):**
1. 📷 **Fasal Bimari Doctor (Kisan Kavach):** Khet me fasal ke bimar patte ki photo kheechein. AI sirf 1 second me bimari aur pakki dawai (organic + chemical) bata dega.
2. 🎙️ **Awaaz Sahayak (Voice Assistant):** Bolkar mausam, baarish, khad (urea/DAP) ki sahi matra aur sinchai ka time poochein.
3. 💰 **Live Mandi Bhav:** Gehu, dhan, sarson, kapas, makka ke taaza mandi daam direct dekhein.
4. 🏛️ **Sarkari Yojana:** PM Kisan Samman Nidhi (₹6,000/saal), Fasal Bima (PMFBY) aur KCC me 1-click me apply karein.
5. 📶 **100% Bina Internet (Offline NPU):** Khet me network na hone par bhi ye phone ke processor par bina net chalta hai!`,
      actions: [
        { label: "📷 Fasal Scanner Kholein", view: "vision" },
        { label: "🏛️ Sarkari Yojana Dekhein", page: "schemes" },
        { label: "💰 Aaj Ka Mandi Bhav", prompt: "aaj ka mandi bhav batao" },
      ]
    },
    whoIsItFor: {
      title: "Ye App kiske liye hai?",
      text: `👥 **Ye app kiske liye banaya gaya hai?**

1. 👨‍🌾 **Chhote aur Seemant Kisan:** Jinhe khet me turant sahi salah aur dawai ki pehchan chahiye.
2. 🌾 **Gramin Krishi Parivar:** Jo English type karne ki jagah apni boli me bolkar jawab chahte hain.
3. 🚜 **KVK & Krishi Adhikari:** Jo gavon me jakar bina internet kisan ki problems on-spot solve karte hain.
4. 🏢 **Kisan Sangathan (FPO):** Mandi bhav aur DBT schemes ki nigrani ke liye.`,
      actions: [
        { label: "🎙️ Bolkar Poochein (Voice)", view: "voice" },
        { label: "👤 Kisan ID Banayein", action: "auth" },
      ]
    },
    whatCanDo: {
      title: "Is app se kya-kya kar sakte hain?",
      text: `🚀 **Kisan Sahayak AI ke 5 bade fayde:**

1. 📷 **Fasal Bimari Scan:** Patte ki photo upload karein, turant bimari ka naam aur dawai payein.
2. 🎙️ **Bolkar Sawal Poochein:** Mausam, khad, beej, sinchai se jude sawal poochein.
3. 💰 **Taaza Mandi Bhav:** Apni fasal ka sahi mandi daam jaankar bicholiyon se bachein.
4. 🏛️ **Sarkari Yojana Me Apply:** PM-Kisan, Fasal Bima, KCC ke liye digital form bharein.
5. 🆔 **Digital Kisan ID:** Apni verified Kisan ID payein jisse sarkari labh direct mil sake.`,
      actions: [
        { label: "📷 Scanner Kholein", view: "vision" },
        { label: "🏛️ Yojana Dekhein", page: "schemes" },
      ]
    },
    howToUse: {
      title: "Is app ko kaise use karein?",
      text: `📱 **Is app ko use karne ka asaan tareeka:**

**Step 1 (Fasal bimari check karein):**
• Homepage par **'Launch Advisory Demo'** ya **'Kisan Kavach'** dabayein.
• Patte ki photo kheechein. AI dawai bata dega.

**Step 2 (Bolkar poochein):**
• **'Voice Query'** ya **'Awaaz Sahayak'** dabayein.
• Mic daba kar boleing: *"Gehu me khad kab dalein?"* ya *"Aaj baarish hogi kya?"*.

**Step 3 (Sarkari Yojana apply karein):**
• Menu me **'Govt Schemes'** par jayein aur **'1-Click Apply'** dabayein.

**Step 4 (Apni Kisan ID dekhein):**
• Upar **'Log In'** dabakar apni Kisan ID card dekhein.`,
      actions: [
        { label: "🚀 Abhi Use Karein", view: "vision" },
        { label: "🏛️ Yojana Dekhein", page: "schemes" },
      ]
    },
  },

  EN: {
    greeting: "Hello farmer friend! 🙏 I am your 24/7 Kisan AI Assistant.\nYou can ask me anything about crops, plant diseases, weather, mandi prices, government schemes, or how to use this app!",
    whyApp: {
      title: "What is this app for and why was it built?",
      text: `🌾 **What is Kisan Sahayak AI and why does it exist?**

Built for the **Qualcomm Snapdragon AI Lab Challenge**, this platform delivers on-device agricultural intelligence directly to Indian farmers.

**🎯 What this app does (Core Capabilities):**
1. 📷 **Crop Disease Doctor (Kisan Kavach):** Snap a photo of an infected leaf in your field. The AI identifies disease in 1 second and provides verified organic & chemical treatments.
2. 🎙️ **Voice Advisory (Awaaz Sahayak):** Ask questions in your native language about rainfall, temperature, fertilizer schedules, and irrigation without typing.
3. 💰 **Live Mandi Prices:** Real-time APMC commodity prices for wheat, paddy, mustard, cotton, and vegetables to prevent middleman exploitation.
4. 🏛️ **Govt Schemes (DBT):** 1-Click pre-filled application for PM-Kisan (₹6,000/yr), Crop Insurance (PMFBY), and Kisan Credit Card (KCC).
5. 📶 **100% Offline Edge AI:** Runs locally on Qualcomm Snapdragon NPU chips with zero internet requirement in rural fields!`,
      actions: [
        { label: "📷 Try Disease Scanner", view: "vision" },
        { label: "🏛️ Browse Govt Schemes", page: "schemes" },
        { label: "💰 Today's Mandi Prices", prompt: "What are today's mandi prices?" },
      ]
    },
    whoIsItFor: {
      title: "Who is this app for?",
      text: `👥 **Who is this app designed for?**

1. 👨‍🌾 **Smallholder & Marginal Farmers:** Who need fast, scientifically accurate crop diagnosis directly in their fields.
2. 🌾 **Rural Farming Families:** Who prefer voice queries in their mother tongue over typing in English.
3. 🚜 **KVK & Agronomy Extension Officers:** Who visit remote villages with zero network connectivity and need instant diagnostic tools.
4. 🏢 **Farmer Producer Organizations (FPOs):** For group marketing and monitoring member welfare scheme benefits.`,
      actions: [
        { label: "🎙️ Open Voice Assistant", view: "voice" },
        { label: "👤 View Kisan ID / Sign In", action: "auth" },
      ]
    },
    whatCanDo: {
      title: "What can you do with this app?",
      text: `🚀 **Key Superpowers of Kisan Sahayak AI:**

1. 📷 **Diagnose Crop Diseases:** Upload or snap a leaf photo for instant remedy recommendations.
2. 🎙️ **Voice Assistance:** Ask about fertilizer dosage, pest control, and weather advisories.
3. 💰 **Mandi Price Discovery:** Compare APMC prices across states to sell your harvest profitably.
4. 🏛️ **Govt Welfare Application:** Apply for PM-Kisan, PMFBY, and KCC with automatic dossier submission.
5. 🆔 **Digital Kisan ID:** Get a unique digital farmer identity card for instant verification.`,
      actions: [
        { label: "📷 Open Disease Scanner", view: "vision" },
        { label: "🏛️ View Schemes", page: "schemes" },
      ]
    },
    howToUse: {
      title: "How to use this app?",
      text: `📱 **Quick Guide to Using Kisan Sahayak AI:**

**Step 1 (Scan Leaf Disease):**
• Click **'Launch Advisory Demo'** or **'Kisan Kavach'**.
• Take a photo of the crop leaf. The AI suggests remedies immediately.

**Step 2 (Ask by Voice):**
• Click **'Voice Query'** or **'Awaaz Sahayak'**.
• Tap the microphone and speak your farming query.

**Step 3 (Apply for Central Schemes):**
• Go to the **'Govt Schemes'** tab and click **'1-Click Apply'**.

**Step 4 (Access Your Kisan ID):**
• Click **'Log In'** in the top navbar to view and copy your official Kisan ID.`,
      actions: [
        { label: "🚀 Start Using Now", view: "vision" },
        { label: "🏛️ Browse Schemes", page: "schemes" },
      ]
    },
  },

  PA: {
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏 ਮੈਂ ਤੁਹਾਡਾ 24 ਘੰਟੇ ਹਾਜ਼ਰ ਕਿਸਾਨ AI ਸਹਾਇਕ ਹਾਂ।\nਤੁਸੀਂ ਮੇਰੇ ਕੋਲੋਂ ਫ਼ਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਮੰਡੀ ਭਾਅ, ਮੌਸਮ, ਖਾਦਾਂ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛ ਸਕਦੇ ਹੋ!",
    whyApp: {
      title: "ਇਹ ਐਪ ਕਿਸ ਲਈ ਹੈ ਅਤੇ ਕੀ ਕੰਮ ਕਰਦੀ ਹੈ?",
      text: `🌾 **ਕਿਸਾਨ ਸਹਾਇਕ AI ਕਿਸ ਲਈ ਹੈ?**

ਇਹ ਐਪ ਭਾਰਤ ਦੇ ਕਿਸਾਨ ਵੀਰਾਂ ਲਈ **Qualcomm Snapdragon AI Lab** ਵੱਲੋਂ ਤਿਆਰ ਕੀਤੀ ਗਈ ਹੈ।

**🎯 ਮੁੱਖ ਕੰਮ (Key Features):**
1. 📷 **ਫ਼ਸਲ ਬਿਮਾਰੀ ਜਾਂਚ (Kisan Kavach):** ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚੋ, AI 1 ਸਕਿੰਟ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਜਾਂ ਉੱਲੀ ਦੀ ਪਛਾਣ ਕਰਕੇ ਪੱਕੀ ਦਵਾਈ ਦੱਸੇਗਾ।
2. 🎙️ **ਬੋਲ ਕੇ ਸਵਾਲ ਪੁੱਛੋ:** ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਮੌਸਮ, ਬਾਰਿਸ਼ ਅਤੇ ਯੂਰੀਆ/DAP ਖਾਦ ਬਾਰੇ ਪੁੱਛੋ।
3. 💰 **ਲਾਈਵ ਮੰਡੀ ਭਾਅ:** ਕਣਕ, ਝੋਨਾ, ਸਰ੍ਹੋਂ, ਨਰਮਾ ਦੇ ਤਾਜ਼ਾ ਰੇਟ ਸਿੱਧੇ ਦੇਖੋ।
4. 🏛️ **ਸਰਕਾਰੀ ਸਕੀਮਾਂ:** ਪੀਐਮ ਕਿਸਾਨ (₹6,000 ਸਾਲਾਨਾ) ਅਤੇ ਫ਼ਸਲ ਬੀਮੇ ਲਈ 1-ਕਲਿੱਕ ਵਿੱਚ ਅਪਲਾਈ ਕਰੋ।
5. 📶 **ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਕੰਮ ਕਰਦਾ ਹੈ:** ਖੇਤ ਵਿੱਚ ਨੈੱਟਵਰਕ ਨਾ ਹੋਣ 'ਤੇ ਵੀ ਆਫਲਾਈਨ ਚੱਲਦਾ ਹੈ।`,
      actions: [
        { label: "📷 ਫ਼ਸਲ ਸਕੈਨਰ ਖੋਲ੍ਹੋ", view: "vision" },
        { label: "🏛️ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੇਖੋ", page: "schemes" },
        { label: "💰 ਅੱਜ ਦਾ ਮੰਡੀ ਭਾਅ", prompt: "ਅੱਜ ਦਾ ਮੰਡੀ ਭਾਅ ਦੱਸੋ" }
      ]
    },
    whoIsItFor: {
      title: "ਇਹ ਐਪ ਕਿਸ ਲਈ ਬਣਾਈ ਗਈ ਹੈ?",
      text: `👥 **ਇਹ ਐਪ ਕਿਸਾਨ ਭਰਾਵਾਂ ਲਈ ਹੈ:**
1. ਖੇਤਾਂ ਵਿੱਚ ਤੁਰੰਤ ਸਹੀ ਕੀਟਨਾਸ਼ਕ ਅਤੇ ਬਿਮਾਰੀ ਦਾ ਇਲਾਜ ਲੱਭਣ ਵਾਲੇ ਕਿਸਾਨ।
2. ਬੋਲ ਕੇ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਾਣਕਾਰੀ ਲੈਣ ਵਾਲੇ ਪਰਿਵਾਰ।
3. ਖੇਤੀ ਅਧਿਕਾਰੀ ਅਤੇ ਕਿਸਾਨ ਗਰੁੱਪ (FPOs)।`,
      actions: [
        { label: "🎙️ ਬੋਲ ਕੇ ਪੁੱਛੋ", view: "voice" }
      ]
    },
    whatCanDo: {
      title: "ਇਸ ਐਪ ਨਾਲ ਕੀ-ਕੀ ਕਰ ਸਕਦੇ ਹੋ?",
      text: `🚀 **ਮੁੱਖ ਫਾਇਦੇ:**
• ਪੱਤਿਆਂ ਤੋਂ ਬਿਮਾਰੀ ਲੱਭਣਾ
• ਤਾਜ਼ਾ ਮੰਡੀ ਰੇਟ ਪਤਾ ਕਰਨਾ
• ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ ਜਾਣਨਾ
• ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਵਿੱਚ ਅਪਲਾਈ ਕਰਨਾ`,
      actions: [{ label: "📷 ਫ਼ਸਲ ਸਕੈਨਰ", view: "vision" }]
    },
    howToUse: {
      title: "ਇਸ ਐਪ ਨੂੰ ਕਿਵੇਂ ਵਰਤਣਾ ਹੈ?",
      text: `📱 **ਵਰਤਣ ਦਾ ਤਰੀਕਾ:**
1. ਹੋਮਪੇਜ 'ਤੇ **'Kisan Kavach'** ਦਬਾ ਕੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚੋ।
2. **'Voice Query'** ਦਬਾ ਕੇ ਮਾਈਕ ਵਿੱਚ ਬੋਲ ਕੇ ਸਵਾਲ ਪੁੱਛੋ।
3. **'Govt Schemes'** ਵਿੱਚ ਜਾ ਕੇ ਸਕੀਮ ਚੁਣੋ ਅਤੇ ਅਪਲਾਈ ਕਰੋ।`,
      actions: [{ label: "🚀 ਵਰਤਣਾ ਸ਼ੁਰੂ ਕਰੋ", view: "vision" }]
    }
  },

  MR: {
    greeting: "नमस्कार शेतकरी बांधवांनो! 🙏 मी आपला २४/७ सक्रिय किसान AI सहाय्यक आहे.\nतुम्ही मला पिकांचे रोग, बाजारभाव, हवामान आणि शासकीय योजनांबद्दल मराठीत विचारू शकता!",
    whyApp: {
      title: "हे ॲप कशासाठी आहे आणि काय करते?",
      text: `🌾 **किसान सहायक AI कशासाठी आहे?**

हे ॲप भारतीय शेतकर्‍यांसाठी **Qualcomm Snapdragon AI** तंत्रज्ञानावर आधारित तयार केले आहे.

**🎯 मुख्य वैशिष्ट्ये:**
1. 📷 **पीक रोग निदान (Kisan Kavach):** रोगाची लक्षणे असणाऱ्या पानाचा फोटो काढा. AI अवघ्या १ सेकंदात रोगाचे अचूक निदान आणि फवारणीची औषधे सुचवेल.
2. 🎙️ **व्हॉइस असिस्टंट (Awaaz Sahayak):** टाईप न करता बोलून हवामान, खत व्यवस्थापन (युरिया/DAP) आणि पावसाचा अंदाज विचारा.
3. 💰 **थेट बाजारभाव (Live Mandi Bhav):** कापूस, सोयाबीन, कांदा, गहू, हरभरा यांचे ताजे बाजारभाव थेट पहा.
4. 🏛️ **शासकीय योजना:** पीएम किसान सन्मान निधी (₹६,०००/वर्ष), पीक विमा (PMFBY) मध्ये १-क्लिक अर्ज करा.
5. 📶 **विना इंटरनेट (100% Offline AI):** शेतात रेंज नसतानाही फोनच्या चिपवर संपूर्ण ॲप चालते!`,
      actions: [
        { label: "📷 पीक रोग स्कॅनर उघडा", view: "vision" },
        { label: "🏛️ शासकीय योजना पहा", page: "schemes" },
        { label: "💰 आजचे बाजारभाव", prompt: "आजचे बाजारभाव काय आहेत?" }
      ]
    },
    whoIsItFor: {
      title: "हे ॲप कोणासाठी आहे?",
      text: `👥 **हे ॲप कोणासाठी आहे:**
1. लहान व मध्यम शेतकरी ज्यांना शेतात तात्काळ अचूक सल्ला हवा आहे.
2. मराठीत बोलून मार्गदर्शन हवे असलेले शेतकरी कुटुंब.
3. कृषी विज्ञान केंद्र (KVK) व कृषी सहाय्यक अधिकारी.`,
      actions: [{ label: "🎙️ बोलून विचारा", view: "voice" }]
    },
    whatCanDo: {
      title: "या ॲपवरून काय-काय करू शकता?",
      text: `🚀 **५ मोठे फायदे:**
• पानाचा फोटो काढून रोग ओळखणे
• बाजारभाव जाणून दलालांपासून संरक्षण
• हवामान अंदाज व खतांची योग्य मात्रा
• पीएम किसान व पीक विमा योजनांचा लाभ`,
      actions: [{ label: "📷 स्कॅनर उघडा", view: "vision" }]
    },
    howToUse: {
      title: "हे ॲप कसे वापरावे?",
      text: `📱 **वापरण्याची सोपी पद्धत:**
१. **'Kisan Kavach'** वर क्लिक करून पानाचा फोटो काढा.
२. **'Voice Query'** दाबून माईकमध्ये बोलून प्रश्न विचारा.
३. **'Govt Schemes'** पेजवर जाऊन १-क्लिकमध्ये योजनेसाठी अर्ज करा.`,
      actions: [{ label: "🚀 आत्ताच वापरा", view: "vision" }]
    }
  },

  BN: {
    greeting: "নমস্কার কৃষক ভাই! 🙏 আমি আপনার ২৪ ঘণ্টার কিষাণ এআই সহকারী।\nআপনি ফসল রোগ, আজকের বাজারদর, আবহাওয়া এবং সরকারি প্রকল্প সম্পর্কে বাংলায় প্রশ্ন করতে পারেন!",
    whyApp: {
      title: "এই অ্যাপটি কিসের জন্য তৈরি করা হয়েছে?",
      text: `🌾 **কিষাণ সহায়ক এআই কিসের জন্য?**

এটি ভারতের কৃষকদের জন্য **Qualcomm Snapdragon AI Lab** দ্বারা নির্মিত একটি অফলাইন এআই প্ল্যাটফর্ম।

**🎯 মূল বৈশিষ্ট্য:**
1. 📷 **ফসল রোগ নির্ণয়:** আক্রান্ত পাতার ছবি তুললেই ১ সেকেন্ডে রোগ ও সঠিক ওষুধের নাম জানা যাবে।
2. 🎙️ **ভয়েস সহকারী:** মুখে বাংলায় কথা বলে আবহাওয়া, সার ও সেচ সংক্রান্ত পরামর্শ নিন।
3. 💰 **লাইভ মান্ডি দর:** ধান, আলু, গম, সর্ষের আজকের তাজা বাজারদর সরাসরি জানুন।
4. 🏛️ **সরকারি স্কিম:** পিএম কিষাণ এবং শস্য বীমায় সহজে আবেদন করুন।
5. 📶 **ইন্টারনেট ছাড়াই সচল:** মাঠে নেটওয়ার্ক না থাকলেও সম্পূর্ণ অফলাইনে কাজ করে!`,
      actions: [
        { label: "📷 রোগ স্ক্যানার খুলুন", view: "vision" },
        { label: "🏛️ সরকারি স্কিম দেখুন", page: "schemes" },
        { label: "💰 আজকের বাজারদর", prompt: "আজকের বাজারদর কত?" }
      ]
    },
    whoIsItFor: {
      title: "এই অ্যাপটি কাদের জন্য?",
      text: `👥 প্রান্তিক ও ক্ষুদ্র চাষি, গ্রামীণ পরিবার এবং কৃষি সহায়কদের জন্য তৈরি।`,
      actions: [{ label: "🎙️ মুখে বলে জিজ্ঞাসা করুন", view: "voice" }]
    },
    whatCanDo: {
      title: "এই অ্যাপ থেকে কী কী করতে পারবেন?",
      text: `🚀 ফসলের রোগ নিরাময়, তাজা বাজারদর জানা, আবহাওয়া পূর্বাভাস এবং সরকারি ভাতার আবেদন।`,
      actions: [{ label: "📷 স্ক্যানার খুলুন", view: "vision" }]
    },
    howToUse: {
      title: "কীভাবে অ্যাপটি ব্যবহার করবেন?",
      text: `📱 **ব্যবহার পদ্ধতি:**
১. পাতার ছবি তুলুন ওষুধ জানতে।
২. মাইকে বাংলায় প্রশ্ন করুন।
৩. সরকারি স্কিমে ক্লিক করে আবেদন করুন।`,
      actions: [{ label: "🚀 শুরু করুন", view: "vision" }]
    }
  },

  GU: {
    greeting: "નમસ્તે ખેડૂત મિત્ર! 🙏 હું તમારો ૨૪ કલાક હાજર કિસાન AI સહાયક છું.\nતમે પાકના રોગ, મંડી ભાવ, હવામાન અને સરકારી યોજનાઓ વિશે ગુજરાતીમાં પૂછી શકો છો!",
    whyApp: {
      title: "આ એપ શેના માટે છે અને શું કરે છે?",
      text: `🌾 **કિસાન સહાયક AI શેના માટે છે?**

આ એપ ભારતના ખેડૂતો માટે **Qualcomm Snapdragon AI** ટેકનોલોજી દ્વારા બનાવવામાં આવી છે.

**🎯 મુખ્ય સુવિધાઓ:**
1. 📷 **પાક રોગ નિદાન:** પાંદડાનો ફોટો પાડો, AI ૧ સેકન્ડમાં રોગ અને દવા જણાવશે.
2. 🎙️ **બોલીને પૂછો:** હવામાન, ખાતર (યુરિયા/DAP) અને વરસાદ વિશે જાણો.
3. 💰 **લાઈવ મંડી ભાવ:** કપાસ, મગફળી, ઘઉં, રાયડાના આજના બજાર ભાવ જુઓ.
4. 🏛️ **સરકારી સહાય:** પીએમ કિસાન અને પાક વીમામાં ૧-ક્લિકથી અરજી કરો.
5. 📶 **૧૦૦% ઓફલાઇન:** ખેતરમાં નેટવર્ક ન હોય તો પણ સંપૂર્ણ કામ કરે છે!`,
      actions: [
        { label: "📷 રોગ સ્કેનર ખોલો", view: "vision" },
        { label: "🏛️ સરકારી યોજનાઓ", page: "schemes" },
        { label: "💰 આજના મંડી ભાવ", prompt: "આજના મંડી ભાવ જણાવો" }
      ]
    },
    whoIsItFor: {
      title: "આ એપ કોના માટે છે?",
      text: `👥 નાના-મોટા ખેડૂતો, ગ્રામીણ પરિવારો અને કિસાન મિત્રો માટે છે.`,
      actions: [{ label: "🎙️ બોલીને પૂછો", view: "voice" }]
    },
    whatCanDo: {
      title: "આ એપથી શું શું થઈ શકે?",
      text: `🚀 રોગ ઓળખ, બજાર ભાવ, હવામાન આગાહી અને સરકારી યોજનાઓની માહિતી.`,
      actions: [{ label: "📷 સ્કેનર ખોલો", view: "vision" }]
    },
    howToUse: {
      title: "આ એપનો ઉપયોગ કેવી રીતે કરવો?",
      text: `📱 ફોટો પાડીને રોગ ઓળખો અથવા માઇક દબાવીને બોલીને પ્રશ્ન પૂછો.`,
      actions: [{ label: "🚀 શરૂ કરો", view: "vision" }]
    }
  },

  TA: {
    greeting: "வணக்கம் விவசாய தோழரே! 🙏 நான் உங்கள் 24 மணி நேர கிசான் AI உதவியாளர்.\nபயிர் நோய், மண்டி விலை, வானிலை மற்றும் அரசு திட்டங்கள் பற்றி தமிழில் கேளுங்கள்!",
    whyApp: {
      title: "இந்த செயலி எதற்கு மற்றும் என்ன செய்கிறது?",
      text: `🌾 **கிசான் சகாயக் AI எதற்கு?**

குவால்காம் ஸ்னாப்டிராகன் AI ஆய்வக சவாலின் கீழ் விவசாயிகளுக்காக உருவாக்கப்பட்ட செயலி.

**🎯 முக்கிய அம்சங்கள்:**
1. 📷 **பயிர் நோய் கண்டறிதல்:** இலையை படம் பிடித்தால் 1 நொடியில் நோயைக் கண்டறிந்து தீர்வு தரும்.
2. 🎙️ **குரல் வழி கேள்வி:** தமிழில் பேசி வானிலை, உரம் மற்றும் நீர்ப்பாசன ஆலோசனை பெறலாம்.
3. 💰 **சந்தை விலை நிலவரம்:** நெல், பருத்தி, மக்காச்சோளம் போன்றவற்றின் தினசரி மண்டி விலைகள்.
4. 🏛️ **அரசு நலத்திட்டங்கள்:** பிஎம்-கிசான் மற்றும் பயிர் காப்பீட்டுக்கு நேரடி விண்ணப்பம்.
5. 📶 **ஆஃப்லைன் வசதி:** இணையம் இல்லாமலும் வயலில் நேரடியாக வேலை செய்யும்!`,
      actions: [
        { label: "📷 நோய் ஸ்கேனர் திறக்க", view: "vision" },
        { label: "🏛️ அரசு திட்டங்கள்", page: "schemes" },
        { label: "💰 இன்றைய சந்தை விலை", prompt: "இன்றைய சந்தை விலை என்ன?" }
      ]
    },
    whoIsItFor: {
      title: "இந்த செயலி யாருக்கானது?",
      text: `👥 சிறு மற்றும் குறு விவசாயிகள், கிராமப்புற குடும்பங்களுக்கானது.`,
      actions: [{ label: "🎙️ குரல் வழி கேட்க", view: "voice" }]
    },
    whatCanDo: {
      title: "இதில் என்னென்ன செய்யலாம்?",
      text: `🚀 பயிர் நோய் தீர்வு, நேரடி சந்தை விலை, உரம் கணக்கீடு, அரசு உதவித்தொகை.`,
      actions: [{ label: "📷 ஸ்கேனர்", view: "vision" }]
    },
    howToUse: {
      title: "இதை எப்படி பயன்படுத்துவது?",
      text: `📱 இலை படம் எடுங்கள் அல்லது மைக் அழுத்தி தமிழில் பேசுங்கள்.`,
      actions: [{ label: "🚀 பயன்பாட்டை தொடங்கு", view: "vision" }]
    }
  },

  TE: {
    greeting: "నమస్కారం రైతు సోదరా! 🙏 నేను మీ 24 గంటల కిసాన్ AI సహాయకుడిని.\nపంట తెగుళ్లు, మార్కెట్ ధరలు, వాతావరణం మరియు ప్రభుత్వ పథకాల గురించి అడగండి!",
    whyApp: {
      title: "ఈ యాప్ దేని కోసం మరియు ఏమి చేస్తుంది?",
      text: `🌾 **కిసాన్ సహాయక్ AI దేని కోసం?**

భారతీయ రైతుల కోసం క్వాల్కమ్ స్నాప్‌డ్రాగన్ AI సాంకేతికతతో రూపొందించబడింది.

**🎯 ముఖ్య ప్రయోజనాలు:**
1. 📷 **పంట తెగుళ్ల గుర్తింపు:** ఆకు ఫోటో తీస్తే 1 సెకనులో వ్యాధి మరియు సరైన మందుల వివరాలు తెలుస్తాయి.
2. 🎙️ **వాయిస్ అసిస్టెంట్:** తెలుగులో మాట్లాడి వాతావరణం, ఎరువుల మోతాదు తెలుసుకోండి.
3. 💰 **లైవ్ మార్కెట్ ధరలు:** వరి, పత్తి, మిర్చి, మొక్కజొన్న తాజా మార్కెట్ ధరలు.
4. 🏛️ **ప్రభుత్వ పథకాలు:** పీఎం కిసాన్, పంట బీమా పథకాలకు సులభంగా దరఖాస్తు చేసుకోండి.
5. 📶 **ఆఫ్‌లైన్ పనితీరు:** ఇంటర్నెట్ లేకపోయినా పొలంలో నేరుగా పనిచేస్తుంది!`,
      actions: [
        { label: "📷 తెగుళ్ల స్కానర్ తెరవండి", view: "vision" },
        { label: "🏛️ ప్రభుత్వ పథకాలు", page: "schemes" },
        { label: "💰 నేటి మార్కెట్ ధరలు", prompt: "నేటి మార్కెట్ ధరలు ఎంత?" }
      ]
    },
    whoIsItFor: {
      title: "ఈ యాప్ ఎవరి కోసం?",
      text: `👥 చిన్న, సన్నకారు రైతులు మరియు వ్యవసాయ కుటుంబాల కోసం.`,
      actions: [{ label: "🎙️ మాట్లాడి అడగండి", view: "voice" }]
    },
    whatCanDo: {
      title: "దీనితో ఏమి చేయవచ్చు?",
      text: `🚀 తెగుళ్ల నివారణ, మార్కెట్ ధరలు, ఎరువుల సలహా మరియు ప్రభుత్వ రాయితీలు.`,
      actions: [{ label: "📷 స్కానర్", view: "vision" }]
    },
    howToUse: {
      title: "ఎలా ఉపయోగించాలి?",
      text: `📱 ఆకు ఫోటో తీయండి లేదా మైక్ నొక్కి తెలుగులో ప్రశ్న అడగండి.`,
      actions: [{ label: "🚀 ప్రారంభించండి", view: "vision" }]
    }
  },

  KN: {
    greeting: "ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! 🙏 ನಾನು ನಿಮ್ಮ ೨೪ ಗಂಟೆಗಳ ಕಿಸಾನ್ AI ಸಹಾಯಕ.\nಬೆಳೆ ರೋಗಗಳು, ಮಾರುಕಟ್ಟೆ ದರ, ಹವಾಮಾನ ಮತ್ತು ಸರ್ಕಾರದ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ!",
    whyApp: {
      title: "ಈ ಆ್ಯಪ್ ಯಾವುದಕ್ಕಾಗಿ ಮತ್ತು ಏನು ಮಾಡುತ್ತದೆ?",
      text: `🌾 **ಕಿಸಾನ್ ಸಹಾಯಕ AI ಯಾವುದಕ್ಕಾಗಿ?**

ರೈತರಿಗಾಗಿ ಕ್ವಾಲ್ಕಾಮ್ ಸ್ನ್ಯಾಪ್‌ಡ್ರಾಗನ್ AI ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ.

**🎯 ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು:**
1. 📷 **ಬೆಳೆ ರೋಗ ಪತ್ತೆ:** ರೋಗಗ್ರಸ್ತ ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ, ತಕ್ಷಣವೇ ಪರಿಹಾರ ಔಷಧ ತಿಳಿಯುತ್ತದೆ.
2. 🎙️ **ಧ್ವನಿ ಸಹಾಯಕ:** ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಹವಾಮಾನ, ರಸಗೊಬ್ಬರ ಮತ್ತು ಮಳೆ ವಿವರ ತಿಳಿಯಿರಿ.
3. 💰 **ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ:** ರಾಗಿ, ಭತ್ತ, ಹತ್ತಿ, ಜೋಳದ ಇಂದಿನ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು.
4. 🏛️ **ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು:** ಪಿಎಂ ಕಿಸಾನ್ ಮತ್ತು ಬೆಳೆ ವಿಮೆಗೆ ೧-ಕ್ಲಿಕ್ ಅರ್ಜಿ.
5. 📶 **ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಕಾರ್ಯನಿರ್ವಹಣೆ:** ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಸಂಪೂರ್ಣವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ!`,
      actions: [
        { label: "📷 ರೋಗ ಸ್ಕ್ಯಾನರ್", view: "vision" },
        { label: "🏛️ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", page: "schemes" },
        { label: "💰 ಮಾರುಕಟ್ಟೆ ದರ", prompt: "ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರ ತಿಳಿಸಿ" }
      ]
    },
    whoIsItFor: {
      title: "ಈ ಆ್ಯಪ್ ಯಾರಿಗಾಗಿ?",
      text: `👥 ರೈತ ಬಾಂಧವರು, ಕೃಷಿ ಕುಟುಂಬಗಳು ಮತ್ತು ಅಧಿಕಾರಿಗಳಿಗಾಗಿ.`,
      actions: [{ label: "🎙️ ಧ್ವನಿ ಮೂಲಕ ಕೇಳಿ", view: "voice" }]
    },
    whatCanDo: {
      title: "ಇದರಿಂದ ಏನೆಲ್ಲಾ ಮಾಡಬಹುದು?",
      text: `🚀 ಬೆಳೆ ರೋಗ ನಿವಾರಣೆ, ನೇರ ಮಾರುಕಟ್ಟೆ ದರಗಳು, ರಸಗೊಬ್ಬರ ಸಲಹೆ ಮತ್ತು ಯೋಜನೆಗಳ ಮಾಹಿತಿ.`,
      actions: [{ label: "📷 ಸ್ಕ್ಯಾನರ್", view: "vision" }]
    },
    howToUse: {
      title: "ಹೇಗೆ ಬಳಸುವುದು?",
      text: `📱 ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ.`,
      actions: [{ label: "🚀 ಪ್ರಾರಂಭಿಸಿ", view: "vision" }]
    }
  }
};

// Natural language query processor supporting Hindi, Hinglish, English and regional scripts
function answerCustomQuery(query, lang = "HI") {
  const q = query.toLowerCase().trim();
  const activeLang = detectLanguage(query, lang);
  const isHi = activeLang === "HI";
  const isHinglish = activeLang === "HINGLISH";
  const isEn = activeLang === "EN";
  const isPa = activeLang === "PA";
  const isMr = activeLang === "MR";
  const isBn = activeLang === "BN";
  const isGu = activeLang === "GU";
  const isTa = activeLang === "TA";
  const isTe = activeLang === "TE";
  const isKn = activeLang === "KN";

  const kb = KNOWLEDGE_BASE[activeLang] || KNOWLEDGE_BASE.HI;

  // 1. WHAT IS THIS APP / PURPOSE / WHY WAS IT BUILT / KIS LIYE HAI / KYA CHEEZ HAI
  const isWhyOrWhat = 
    // Hindi Devanagari
    q.includes("क्यों") || q.includes("क्यो") || q.includes("किसलिए") || q.includes("किस लिए") || q.includes("उद्देश्य") || q.includes("मकसद") || q.includes("काम क्या") || q.includes("क्या काम") || q.includes("क्या है") || q.includes("ऐप क्या") ||
    // Hinglish
    q.includes("kis liye") || q.includes("kis liya") || q.includes("kisliye") || q.includes("kisliya") || q.includes("kis kaam") || q.includes("kya kaam") || q.includes("kya kam") || q.includes("kya h") || q.includes("kya hai") || q.includes("kyu") || q.includes("kyun") || q.includes("karan") || q.includes("about app") || q.includes("app ke baare") || q.includes("kisan sahayak kya") || q.includes("app kya") || q.includes("kya cheez") ||
    // English
    q.includes("why") || q.includes("purpose") || q.includes("what is this app") || q.includes("why this app") || q.includes("aim") || q.includes("motive") || q.includes("about this app") ||
    // Regional languages
    q.includes("ਕਿਸ ਲਈ") || q.includes("ਕਿਉਂ") ||
    q.includes("कशासाठी") || q.includes("काय करते") ||
    q.includes("কিসের জন্য") || q.includes("কেন") ||
    q.includes("શેના માટે") || q.includes("શું કરે") ||
    q.includes("எதற்கு") || q.includes("என்ன செய்கிறது") ||
    q.includes("దేని కోసం") || q.includes("ఏమి చేస్తుంది") ||
    q.includes("ಯಾವುದಕ್ಕಾಗಿ") || q.includes("ಏನು ಮಾಡುತ್ತದೆ");

  if (isWhyOrWhat) {
    return kb.whyApp;
  }

  // 2. WHO IS IT FOR / KISKE LIYE HAI / KISKO FAYDA HOGA
  const isWho = 
    q.includes("किसके") || q.includes("किसका") || q.includes("किसके लिए") || q.includes("किसको") || q.includes("कौन इस्तेमाल") ||
    q.includes("kiske liye") || q.includes("kiska") || q.includes("kisko") || q.includes("kiske kaam") || q.includes("target") ||
    q.includes("who is it for") || q.includes("who can use") || q.includes("target audience") ||
    q.includes("ਕਿਸ ਲਈ ਬਣਾਈ") || q.includes("कोणासाठी") || q.includes("কাদের জন্য") || q.includes("કોના માટે") || q.includes("யாருக்கானது") || q.includes("ఎవరి కోసం") || q.includes("ಯಾರಿಗಾಗಿ");

  if (isWho) {
    return kb.whoIsItFor;
  }

  // 3. WHAT CAN BE DONE / KYA KYA KAR SAKTE HAIN / FEATURES / CAPABILITIES
  const isWhatCanDo = 
    q.includes("क्या क्या") || q.includes("क्या-क्या") || q.includes("कर सकते") || q.includes("फायदे") || q.includes("सुविधाएं") ||
    q.includes("kya kya") || q.includes("kya kar sakte") || q.includes("features") || q.includes("fayde") || q.includes("benefit") || q.includes("capabilities") ||
    q.includes("what can it do") || q.includes("what can we do") || q.includes("benefits") ||
    q.includes("ਕੀ ਕੀ ਕਰ") || q.includes("काय करू शकता") || q.includes("কী কী করতে") || q.includes("શું શું થઈ") || q.includes("என்னென்ன செய்யலாம்") || q.includes("ఏమి చేయవచ్చు") || q.includes("ಏನೆಲ್ಲಾ ಮಾಡಬಹುದು");

  if (isWhatCanDo) {
    return kb.whatCanDo;
  }

  // 4. HOW TO USE / KAISE USE KAREIN / GUIDE / CHALAYE
  const isHowToUse = 
    q.includes("कैसे") || q.includes("इस्तेमाल") || q.includes("उपयोग") || q.includes("चलाएं") || q.includes("तरीका") ||
    q.includes("kaise") || q.includes("use") || q.includes("chalaye") || q.includes("istemal") || q.includes("chalu") || q.includes("guide") ||
    q.includes("how to use") || q.includes("how to run") || q.includes("how it works") ||
    q.includes("ਕਿਵੇਂ ਵਰਤਣਾ") || q.includes("कसे वापरावे") || q.includes("কীভাবে ব্যবহার") || q.includes("કેવી રીતે") || q.includes("எப்படி பயன்படுத்துவது") || q.includes("ఎలా ఉపయోగించాలి") || q.includes("ಹೇಗೆ ಬಳಸುವುದು");

  if (isHowToUse) {
    return kb.howToUse;
  }

  // 5. CROP DISEASE / ROG / BIMARI / PATTE / BLIGHT / RUST / PEST
  if (
    q.includes("रोग") || q.includes("बीमारी") || q.includes("कीट") || q.includes("कीड़ा") || q.includes("पत्ते") || q.includes("रतुआ") || q.includes("धब्बा") || q.includes("धब्बे") || q.includes("दवा") || q.includes("इलाज") ||
    q.includes("bimari") || q.includes("rog") || q.includes("keeda") || q.includes("patte") || q.includes("dawa") || q.includes("dawai") || q.includes("peela") || q.includes("rust") || q.includes("blight") || q.includes("pest") || q.includes("fungus") || q.includes("disease") ||
    q.includes("ਕੁੰਗੀ") || q.includes("ਕੀੜੇ") || q.includes("रोग") || q.includes("रोगनिदान") || q.includes("পোকা") || q.includes("રોગ") || q.includes("நோய்") || q.includes("తెగులు") || q.includes("ರೋಗ")
  ) {
    return {
      title: isHi || isHinglish ? "फसल रोग व पक्का उपचार" : (isPa ? "ਫ਼ਸਲ ਰੋਗ ਇਲਾਜ" : (isMr ? "पीक रोग व उपाय" : "Crop Disease & Remedy")),
      text: isHinglish
        ? `🔬 **Fasal Rog & Pakka Upchar:**\n\n• **Patte Peele Hona:** Nitrogen ki kami ya fungas se hota hai. NPK 19:19:19 (5 gram/litre) ka spray karein.\n• **Kaale/Bhoore Dhabbe (Leaf Blight):** Mancozeb 75% WP 2 gram/litre pani me milakar turant spray karein.\n• **Peela Ratua (Yellow Rust):** Propiconazole 25% EC (Tilt) 1 ml/litre spray karein 15 din ke antar par.\n• **Keeda / Sundi Attack:** Neem Oil 10,000 PPM (3ml/litre) ya Imidacloprid (0.5ml/litre) ka chhidkaw karein.\n\n💡 *Sateek janch ke liye 'Kisan Kavach' me patte ki photo dalein!*`
        : (isHi
          ? `🔬 **फसल रोग व पक्का उपचार समाधान:**\n\n• **पत्ते पीले होना:** अक्सर नाइट्रोजन की कमी या फफूंद से होता है। 19:19:19 NPK (5 ग्राम/लीटर) का छिड़काव करें।\n• **काले/भूरे धब्बे (Leaf Blight):** मैंकोजेब (Mancozeb 75% WP) 2 ग्राम प्रति लीटर पानी में मिलाकर तुरंत छिड़कें।\n• **पीला रतुआ (Yellow Rust):** प्रोपिकोनाजोल 25% EC (टिल्ट) 1 मिली प्रति लीटर पानी में मिलाकर छिड़कें।\n• **कीड़ा/इल्ली (Pest Attack):** नीम तेल 10,000 PPM (3 मिली/लीटर) का छिड़काव करें।\n\n💡 *सटीक पहचान के लिए 'Kisan Kavach' में पत्ते की फोटो अपलोड करें!*`
          : `🔬 **Crop Disease & Treatment Guide:**\n\n• **Yellowing Leaves:** Often nitrogen deficiency or early fungus. Spray NPK 19:19:19 @ 5g/L.\n• **Leaf Spots/Blight:** Spray Mancozeb 75% WP @ 2g/L.\n• **Yellow Rust:** Apply Propiconazole 25% EC (Tilt) @ 1ml/L.\n• **Pest Attack:** Apply Neem Oil 10,000 PPM @ 3ml/L.\n\n💡 *Snap a photo in 'Kisan Kavach' for instant offline AI diagnosis!*`),
      actions: [
        { label: isHinglish ? "📷 Disease Scanner Kholein" : (isHi ? "📷 रोग स्कैनर खोलें" : "📷 Open Disease Scanner"), view: "vision" }
      ]
    };
  }

  // 6. MANDI BHAV / APMC RATES / PRICES
  if (
    q.includes("मंडी") || q.includes("भाव") || q.includes("दाम") || q.includes("कीमत") || q.includes("रेट") ||
    q.includes("mandi") || q.includes("bhav") || q.includes("rate") || q.includes("price") || q.includes("daam") || q.includes("keemat") ||
    q.includes("ਮੰਡੀ") || q.includes("ਭਾਅ") || q.includes("बाजारभाव") || q.includes("দর") || q.includes("ભાવ") || q.includes("விலை") || q.includes("ధరలు") || q.includes("ದರ")
  ) {
    return {
      title: isHi || isHinglish ? "आज के ताज़ा मंडी भाव" : (isPa ? "ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ" : (isMr ? "आजचे थेट बाजारभाव" : "Today's Mandi Prices")),
      text: isHinglish
        ? `💰 **Aaj Ke Taaza Mandi Bhav (Prati Quintal):**\n\n🌾 **Gehu (Wheat):** ₹2,420 - ₹2,550 / Qtl (Sthir)\n🌾 **Dhan Basmati (Paddy):** ₹3,850 - ₹4,400 / Qtl (Tez)\n🟡 **Sarson (Mustard):** ₹5,400 - ₹5,850 / Qtl\n☁️ **Kapas (Cotton):** ₹7,100 - ₹7,650 / Qtl\n🌽 **Makka (Maize):** ₹2,100 - ₹2,280 / Qtl\n🥔 **Aaloo (Potato):** ₹1,400 - ₹1,850 / Qtl\n\n💡 *Apni mandi ka daam janne ke liye fasal aur jile ka naam likh kar poochein!*`
        : (isHi
          ? `💰 **आज के प्रमुख मंडी भाव (प्रति क्विंटल):**\n\n🌾 **गेहूं (Wheat):** ₹2,420 - ₹2,550 / क्विंटल (स्थिर)\n🌾 **धान बासमती (Paddy Basmati):** ₹3,850 - ₹4,400 / क्विंटल (तेज़)\n🟡 **सरसों (Mustard):** ₹5,400 - ₹5,850 / क्विंटल\n☁️ **कपास (Cotton):** ₹7,100 - ₹7,650 / क्विंटल\n🌽 **मक्का (Maize):** ₹2,100 - ₹2,280 / क्विंटल\n🥔 **आलू (Potato):** ₹1,400 - ₹1,850 / क्विंटल\n\n💡 *अपनी स्थानीय मंडी का भाव जानने के लिए अपनी फसल और जिले का नाम लिखकर पूछें!*`
          : `💰 **Live Mandi Prices (per Quintal):**\n\n🌾 **Wheat:** ₹2,420 - ₹2,550 / Qtl\n🌾 **Basmati Paddy:** ₹3,850 - ₹4,400 / Qtl\n🟡 **Mustard:** ₹5,400 - ₹5,850 / Qtl\n☁️ **Cotton:** ₹7,100 - ₹7,650 / Qtl\n🌽 **Maize:** ₹2,100 - ₹2,280 / Qtl\n\n💡 *Ask with your crop and district name for localized rates!*`),
      actions: [
        { label: isHinglish ? "🎙️ Bolkar Rate Poochein" : (isHi ? "🎙️ बोलकर भाव पूछें" : "🎙️ Ask by Voice"), view: "voice" }
      ]
    };
  }

  // 7. WEATHER / MAUSAM / BARISH / RAIN
  if (
    q.includes("मौसम") || q.includes("बारिश") || q.includes("बरसात") || q.includes("तापमान") ||
    q.includes("mausam") || q.includes("barish") || q.includes("weather") || q.includes("rain") || q.includes("temperature") ||
    q.includes("ਮੌਸਮ") || q.includes("ਬਾਰਿਸ਼") || q.includes("हवामान") || q.includes("আবহাওয়া") || q.includes("વરસાદ") || q.includes("வானிலை") || q.includes("వాతావరణం") || q.includes("ಹವಾಮಾನ")
  ) {
    return {
      title: isHi || isHinglish ? "मौसम व कृषि पूर्वानुमान" : "Weather & Agronomy Forecast",
      text: isHinglish
        ? `⛅ **Krishi Mausam & Baarish Forecast:**\n\n• **Taapman:** 28°C - 33°C (Anukool)\n• **Aardrata (Humidity):** 62%\n• **Baarish:** Agle 48 ghanto me halki boondabaandi ki sambhawna.\n\n🚜 **Kisan Salah:**\n1. Tez hawa ya baarish ke samay dawaon ka chhidkaw na karein.\n2. Halki sinchai karein taaki mitti me nami bani rahe.`
        : (isHi
          ? `⛅ **कृषि मौसम पूर्वानुमान व सलाह:**\n\n• **तापमान:** 28°C - 33°C (अनुकूल)\n• **आर्द्रता (Humidity):** 62%\n• **बारिश का अनुमान:** अगले 48 घंटों में हल्की से मध्यम बूंदाबांदी की संभावना।\n\n🚜 **किसान सलाह:**\n1. तेज हवा या बारिश की संभावना हो तो रासायनिक दवाओं का छिड़काव रोक दें।\n2. हल्की सिंचाई करें ताकि मिट्टी में आवश्यक नमी बनी रहे।`
          : `⛅ **Agricultural Weather Forecast:**\n\n• **Temperature:** 28°C - 33°C (Optimal)\n• **Humidity:** 62%\n• **Rain:** Light scattered showers over next 48 hours.\n\n🚜 **Advisory:** Avoid heavy pesticide spraying during rain. Maintain light irrigation.`),
      actions: [
        { label: isHinglish ? "🎙️ Mausam Salah Poochein" : (isHi ? "🎙️ विस्तृत मौसम सलाह" : "🎙️ Detailed Advisory"), view: "voice" }
      ]
    };
  }

  // 8. FERTILIZER / KHAAD / UREA / DAP
  if (
    q.includes("खाद") || q.includes("यूरिया") || q.includes("उर्वरक") || q.includes("पोषण") ||
    q.includes("khad") || q.includes("khaad") || q.includes("urea") || q.includes("fertilizer") || q.includes("dap") ||
    q.includes("ਖਾਦ") || q.includes("खत") || q.includes("সার") || q.includes("ખાતર") || q.includes("உரம்") || q.includes("ఎరువులు") || q.includes("ಗೊಬ್ಬರ")
  ) {
    return {
      title: isHi || isHinglish ? "संतुलित खाद व उर्वरक सलाह" : "Balanced Fertilizer Advisory",
      text: isHinglish
        ? `🧪 **Santulit Khaad & Urvarak Matra:**\n\n• **Buwai ke samay:** DAP (50 kg/acre) + Potash MOP (20 kg/acre) ka basal dose dein.\n• **Pehli sinchai (21 din):** 1 bori Urea (45 kg) + Zinc Sulphate (5 kg) prati acre dalein.\n• **Nano Urea Spray:** 4ml Nano Urea prati litre paani me milakar pattiyon par spray karein.\n• **Jaivik Khad:** Saalan 2-3 trolley sadi gobar khad zaroor milayein.`
        : `🧪 **संतुलित उर्वरक प्रयोग सलाह:**\n\n• **बुवाई के समय:** DAP (50 किग्रा/एकड़) + पोटाश MOP (20 किग्रा/एकड़) डालें।\n• **पहली सिंचाई (21 दिन):** 1 बोरी यूरिया (45 किग्रा) + जिंक सल्फेट (5 किग्रा) प्रति एकड़ दें।\n• **नैनो यूरिया:** 4 मिली नैनो यूरिया प्रति लीटर पानी में मिलाकर पत्तियों पर छिड़कें।\n• **जैविक खाद:** प्रति वर्ष 2-3 ट्रॉली सड़ी गोबर खाद या वर्मीकम्पोस्ट अवश्य मिलाएं।`,
      actions: [
        { label: isHinglish ? "🎙️ Bolkar Aur Poochein" : "🎙️ वॉयस में पूछें", view: "voice" }
      ]
    };
  }

  // 9. SCHEMES / PM KISAN / YOJANA / BIMA / KCC
  if (
    q.includes("योजना") || q.includes("पीएम किसान") || q.includes("बीमा") || q.includes("सब्सिडी") ||
    q.includes("yojna") || q.includes("yojana") || q.includes("pm kisan") || q.includes("scheme") || q.includes("subsidy") || q.includes("kcc") || q.includes("bima") ||
    q.includes("ਸਕੀਮ") || q.includes("योजना") || q.includes("প্রকল্প") || q.includes("திட்டம்") || q.includes("పథకం") || q.includes("ಯೋಜನೆ")
  ) {
    return {
      title: isHi || isHinglish ? "सरकारी कृषि योजनाएं व ₹6,000 सम्मान निधि" : "Government Schemes & DBT Welfare",
      text: isHinglish
        ? `🏛️ **Sarkari Krishi Yojana & Apply Karne Ka Tareeka:**\n\n1. **PM Kisan Samman Nidhi:** Desh ke har kisan ko saalan ₹6,000 (₹2,000 ki 3 kist) milti hai.\n2. **Pradhan Mantri Fasal Bima (PMFBY):** Sukha, baadh ya ola-vrishti se fasal nuksan par 100% bima claim milta hai.\n3. **Kisan Credit Card (KCC):** Kheti ke liye sasti 4% byaj dar par karz milta hai.\n\n👉 *App ke 'Govt Schemes' tab me ja kar '1-Click Apply' dabayein!*`
        : `🏛️ **सरकारी कृषि योजनाएं व आवेदन प्रक्रिया:**\n\n1. **पीएम किसान सम्मान निधि:** प्रत्येक पंजीकृत किसान को प्रति वर्ष ₹6,000 की वित्तीय सहायता (3 किश्तों में) सीधे बैंक खाते में।\n2. **प्रधानमंत्री फसल बीमा योजना (PMFBY):** ओलावृष्टि, सूखा या बाढ़ से नुकसान होने पर फसल बीमा सुरक्षा।\n3. **किसान क्रेडिट कार्ड (KCC):** खेती व खाद-बीज के लिए 4% रियायती ब्याज दर पर ऋण।\n\n👉 *ऐप में 'Govt Schemes' पेज पर जाकर तुरंत '1-Click Apply' करें!*`,
      actions: [
        { label: isHinglish ? "🏛️ Yojana Portal Kholein" : "🏛️ योजना पोर्टल पर जाएं", page: "schemes" }
      ]
    };
  }

  // 10. KISAN ID / PEHCHAN PATRA
  if (
    q.includes("किसान id") || q.includes("किसान आईडी") || q.includes("आईडी") ||
    q.includes("kisan id") || q.includes("farmer id") || q.includes("id card") || q.includes("login id")
  ) {
    return {
      title: isHi || isHinglish ? "आपकी डिजिटल किसान ID" : "Your Digital Kisan ID",
      text: isHinglish
        ? `🆔 **Official Digital Kisan ID:**\n\n• Ye aapki verified krishi pehchan sankhya hai (jaise: \`KS-UP-1042\`).\n• Jab aap portal par login karte hain, aapko screen par Kisan ID Card milta hai jise aap Copy kar sakte hain.\n• Sarkari nodal officer is ID ko Admin panel me search karke aapka poora record 1 second me nikal sakte hain.`
        : `🆔 **डिजिटल किसान पहचान संख्या (Kisan ID):**\n\n• यह आपकी प्रमाणित सरकारी कृषक पहचान संख्या है (उदा: \`KS-UP-1042\`)।\n• ऐप में लॉगिन करते ही स्क्रीन पर किसान ID कार्ड दिखाई देता है जिसे आप कॉपी कर सकते हैं।\n• सरकारी अधिकारी व एडमिन पैनल इस ID से किसान का पूरा रिकॉर्ड 1 सेकंड में खोज सकते हैं।`,
      actions: [
        { label: isHinglish ? "👤 Login Karke ID Dekhein" : "👤 लॉगिन करें / ID देखें", action: "auth" }
      ]
    };
  }

  // 11. WHATSAPP BOT / WHATSAPP ADVISORY
  if (
    q.includes("whatsapp") || q.includes("whats app") || q.includes("व्हाट्सएप") || q.includes("व्हाट्सऐप") || q.includes("वाट्साप") || q.includes("वाट्सएप") || q.includes("chat bot") || q.includes("बॉट")
  ) {
    return {
      title: isHi || isHinglish ? "24/7 किसान व्हाट्सएप कृषि बॉट" : "24/7 Kisan WhatsApp Krishi Bot",
      text: isHinglish
        ? `📱 **Kisan WhatsApp Krishi Bot (24/7):**\n\nAap seedhe apne phone ke WhatsApp par bhi kheti ke sawal pooch sakte hain, bimar patte ki photo bhej sakte hain aur mandi bhav jaan sakte hain!\n\n• **Instant AI Reply:** Qualcomm NPU powered fast answers.\n• **Adhikari Sahayata:** Bank PFMS ya yojana samasya par admin team seedha WhatsApp par uttar deti hai.`
        : `📱 **किसान व्हाट्सएप कृषि बॉट (24/7):**\n\nआप सीधे अपने फोन के व्हाट्सएप चैट पर भी खेती से जुड़े सवाल पूछ सकते हैं, बीमार पत्ते की फोटो भेजकर जांच करा सकते हैं और रोज़ाना के मंडी भाव जान सकते हैं!\n\n• **तुरंत AI उत्तर:** ऑन-डिवाइस NPU आधारित त्वरित सलाह।\n• **अधिकारी सहायता:** बैंक रिजेक्शन (PFMS 104) या योजना रुकावट पर एडमिन टीम सीधे चैट पर समाधान भेजती है।`,
      actions: [
        { label: isHinglish ? "💬 WhatsApp Bot Kholein" : "💬 व्हाट्सएप बॉट अभी खोलें", action: "whatsapp" }
      ]
    };
  }

  // Fallback: Clear, helpful, educational response (NEVER VAGUE!)
  return {
    title: isHi || isHinglish ? "किसान AI सहायक जानकारी" : "Kisan AI Assistant Guide",
    text: isHinglish
      ? `🌾 **Namaste Kisan Bhai!** Aapne poochha: *"${query}"*\n\nMain aapka 24/7 Krishi Assistant hoon. Aap mujhse kheti se judi koi bhi jaankari le sakte hain:\n\n• 📷 **Fasal Rog:** Patte ki bimari aur uski dawai janne ke liye.\n• 💰 **Mandi Bhav:** Aaj ke taaza gehu, dhan, sarson ke daam ke liye.\n• ⛅ **Mausam:** Baarish aur sinchai ki salah ke liye.\n• 🏛️ **Yojana:** PM Kisan ₹6,000 aur Fasal Bima ke liye.\n\n👇 *Neeche diye gaye kisi bhi button par click karein:*`
      : (isHi
        ? `🌾 **नमस्ते किसान भाई!** आपके सवाल: *"${query}"* के संदर्भ में:\n\nमैं आपका 24 घंटे सक्रिय कृषि सहायक हूँ। आप मुझसे खेती-बाड़ी से जुड़ी कोई भी जानकारी सीधे पूछ सकते हैं:\n\n• 📷 **फसल रोग:** पत्ते में लगी बीमारी और उसकी पक्की दवा जानने के लिए।\n• 💰 **मंडी भाव:** गेहूं, धान, सरसों, कपास के आज के ताज़ा भाव जानने के लिए।\n• ⛅ **मौसम व बारिश:** तापमान और सिंचाई की सही सलाह के लिए।\n• 🏛️ **सरकारी योजनाएं:** पीएम किसान (₹6,000) व फसल बीमा के लिए।\n\n👇 *नीचे दिए गए बटनों से तुरंत जानकारी प्राप्त करें:*`
        : `🌾 **Hello farmer friend!** Regarding your query: *"${query}"*:\n\nI am your 24/7 on-device AI agricultural advisor. You can ask me:\n• 📷 **Crop Diseases:** Leaf diagnosis & pesticide dosages.\n• 💰 **Mandi Prices:** Daily rates for wheat, paddy, cotton, etc.\n• ⛅ **Weather Forecast:** Rainfall & irrigation timing.\n• 🏛️ **Govt Schemes:** PM-Kisan and Crop Insurance benefits.\n\n👇 *Click any quick action below:*`),
    actions: [
      { label: isHinglish ? "❓ Ye App Kis Liye Hai?" : (isHi ? "❓ यह ऐप क्यों व किसलिए है?" : "❓ What is this app for?"), prompt: isHinglish ? "ye app kis liye hai" : (isHi ? "यह ऐप क्यों और किसलिए है?" : "What is this app for?") },
      { label: isHinglish ? "🚀 Kya Kya Kar Sakte Hain?" : (isHi ? "🚀 क्या-क्या कर सकते हैं?" : "🚀 What can it do?"), prompt: isHinglish ? "is app se kya kya kar sakte hain" : (isHi ? "इस ऐप से क्या क्या कर सकते हैं?" : "What can this app do?") },
      { label: isHinglish ? "💰 Aaj Ka Mandi Bhav" : (isHi ? "💰 आज का मंडी भाव" : "💰 Today's Mandi Prices"), prompt: isHinglish ? "aaj ka mandi bhav kya hai" : (isHi ? "आज का मंडी भाव क्या है?" : "What are today's mandi prices?") },
    ]
  };
}

export default function KisanAiAssistant({ lang = "HI", onNavigate, onSelectPage, onOpenAuth, onOpenWhatsAppBot }) {
  const [isOpen, setIsOpen]           = useState(false);
  const [inputVal, setInputVal]       = useState("");
  const [messages, setMessages]       = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [ttsEnabled, setTtsEnabled]   = useState(true);
  const [currentLang, setCurrentLang] = useState(lang);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync external lang changes
  useEffect(() => {
    if (lang && lang !== currentLang) {
      setCurrentLang(lang);
    }
  }, [lang]);

  // Initial welcome message based on language
  useEffect(() => {
    const kb = KNOWLEDGE_BASE[currentLang] || KNOWLEDGE_BASE.HI;
    setMessages([
      {
        id: "welcome-" + currentLang,
        sender: "bot",
        text: kb.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isWelcome: true,
      }
    ]);
  }, [currentLang]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Speech-to-Text (STT) setup with dynamic locale
  const getLocaleForLang = (langCode) => {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    return found ? found.locale : "hi-IN";
  };

  // Text-to-Speech (TTS)
  const speakMessage = (text) => {
    if (!('speechSynthesis' in window) || !ttsEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown bold/stars for clean audio
      const cleanText = text.replace(/[*_#`]/g, "").slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = getLocaleForLang(currentLang);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  };

  // Voice recognition (Speech to Text)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = getLocaleForLang(currentLang);

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputVal(transcript);
      handleSend(transcript);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // Send message
  const handleSend = (textToSend) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    // Detect language if user typed in a specific language/script or Hinglish
    const detected = detectLanguage(query, currentLang);
    if (detected !== currentLang && detected !== "EN") {
      setCurrentLang(detected);
    }

    const userMsg = {
      id: "u-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");

    // Generate intelligent AI response
    setTimeout(() => {
      const answerObj = answerCustomQuery(query, detected);
      const botMsg = {
        id: "b-" + Date.now(),
        sender: "bot",
        title: answerObj.title,
        text: answerObj.text,
        actions: answerObj.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);

      // Speak answer if audio is enabled
      if (ttsEnabled) {
        speakMessage(answerObj.text);
      }
    }, 400);
  };

  // Action button click handler
  const handleActionClick = (action) => {
    if (action.action === "whatsapp" || action.openWhatsApp) {
      if (onOpenWhatsAppBot) onOpenWhatsAppBot();
      setIsOpen(false);
    } else if (action.prompt) {
      handleSend(action.prompt);
    } else if (action.view && onNavigate) {
      onNavigate(action.view);
      setIsOpen(false);
    } else if (action.page && onSelectPage) {
      onSelectPage(action.page);
      setIsOpen(false);
    } else if (action.action === "auth" && onOpenAuth) {
      onOpenAuth();
      setIsOpen(false);
    }
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Quick prompt chips tailored to current language
  const getQuickChips = () => {
    switch (currentLang) {
      case "HINGLISH":
        return [
          { label: "💬 WhatsApp Bot Kholein", action: "whatsapp" },
          { label: "❓ Ye app kis liye hai?", prompt: "ye app kis liye hai" },
          { label: "👥 Kiske liye hai?", prompt: "ye app kiske liye hai" },
          { label: "🚀 Kya kya kar sakte hain?", prompt: "is app se kya kya kar sakte hain" },
          { label: "📱 Kaise use karein?", prompt: "is app ko kaise use karein" },
          { label: "💰 Aaj ka Mandi Bhav", prompt: "aaj ka mandi bhav batao" },
          { label: "⛅ Mausam & Baarish", prompt: "aaj baarish hogi kya" },
          { label: "🧪 Khad & Urea Matra", prompt: "gehu me kitna khad dalein" },
          { label: "🏛️ PM Kisan Samman Nidhi", prompt: "pm kisan yojana me apply kaise kare" },
        ];
      case "PA":
        return [
          { label: "💬 WhatsApp ਬੋਟ ਖੋਲ੍ਹੋ", action: "whatsapp" },
          { label: "❓ ਇਹ ਐਪ ਕਿਸ ਲਈ ਹੈ?", prompt: "ਇਹ ਐਪ ਕਿਸ ਲਈ ਹੈ" },
          { label: "👥 ਕਿਸ ਲਈ ਹੈ?", prompt: "ਇਹ ਐਪ ਕਿਸ ਲਈ ਹੈ" },
          { label: "🚀 ਕੀ ਕੀ ਕਰ ਸਕਦੇ ਹੋ?", prompt: "ਇਸ ਐਪ ਨਾਲ ਕੀ ਕੀ ਕਰ ਸਕਦੇ ਹੋ" },
          { label: "💰 ਅੱਜ ਦਾ ਮੰਡੀ ਭਾਅ", prompt: "ਅੱਜ ਦਾ ਮੰਡੀ ਭਾਅ" },
          { label: "⛅ ਮੌਸਮ ਦਾ ਹਾਲ", prompt: "ਅੱਜ ਮੌਸਮ ਕਿਵੇਂ ਰਹੇਗਾ" },
          { label: "🏛️ ਸਰਕਾਰੀ ਸਕੀਮਾਂ", prompt: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ" },
        ];
      case "MR":
        return [
          { label: "❓ हे ॲप कशासाठी आहे?", prompt: "हे ॲप कशासाठी आहे" },
          { label: "👥 हे कोणासाठी आहे?", prompt: "हे ॲप कोणासाठी आहे" },
          { label: "🚀 काय करू शकता?", prompt: "या ॲपवरून काय काय करू शकता" },
          { label: "💰 आजचे बाजारभाव", prompt: "आजचे थेट बाजारभाव" },
          { label: "⛅ हवामान अंदाज", prompt: "आज हवामान कसे राहील" },
          { label: "🏛️ शासकीय योजना", prompt: "शासकीय योजना" },
        ];
      case "BN":
        return [
          { label: "❓ এই অ্যাপটি কিসের জন্য?", prompt: "এই অ্যাপটি কিসের জন্য" },
          { label: "🚀 কী কী করা যায়?", prompt: "এই অ্যাপ থেকে কী কী করতে পারবেন" },
          { label: "💰 আজকের বাজারদর", prompt: "আজকের বাজারদর কত" },
          { label: "🏛️ সরকারি প্রকল্প", prompt: "সরকারি প্রকল্প" },
        ];
      case "GU":
        return [
          { label: "❓ આ એપ શેના માટે છે?", prompt: "આ એપ શેના માટે છે" },
          { label: "🚀 શું શું થઈ શકે?", prompt: "આ એપથી શું શું થઈ શકે" },
          { label: "💰 આજના મંડી ભાવ", prompt: "આજના મંડી ભાવ જણાવો" },
        ];
      case "TA":
        return [
          { label: "❓ இந்த செயலி எதற்கு?", prompt: "இந்த செயலி எதற்கு" },
          { label: "💰 இன்றைய சந்தை விலை", prompt: "இன்றைய சந்தை விலை என்ன" },
          { label: "🏛️ அரசு திட்டங்கள்", prompt: "அரசு திட்டங்கள்" },
        ];
      case "TE":
        return [
          { label: "❓ ఈ యాప్ దేని కోసం?", prompt: "ఈ యాప్ దేని కోసం" },
          { label: "💰 నేటి మార్కెట్ ధరలు", prompt: "నేటి మార్కెట్ ధరలు ఎంత" },
          { label: "🏛️ ప్రభుత్వ పథకాలు", prompt: "ప్రభుత్వ పథకాలు" },
        ];
      case "KN":
        return [
          { label: "❓ ಈ ಆ್ಯಪ್ ಯಾವುದಕ್ಕಾಗಿ?", prompt: "ಈ ಆ್ಯಪ್ ಯಾವುದಕ್ಕಾಗಿ" },
          { label: "💰 ಮಾರುಕಟ್ಟೆ ದರಗಳು", prompt: "ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರ" },
          { label: "🏛️ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", prompt: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" },
        ];
      case "EN":
        return [
          { label: "💬 Open WhatsApp Bot", action: "whatsapp" },
          { label: "❓ What is this app for?", prompt: "what is this app for" },
          { label: "👥 Who is it for?", prompt: "who is this app for" },
          { label: "🚀 What can it do?", prompt: "what can you do with this app" },
          { label: "📱 How to use it?", prompt: "how to use this app" },
          { label: "💰 Mandi Prices", prompt: "what are today's mandi prices" },
          { label: "⛅ Weather Advisory", prompt: "what is the weather today" },
          { label: "🏛️ PM-Kisan Schemes", prompt: "how to apply for pm kisan scheme" },
          { label: "🆔 Digital Kisan ID", prompt: "what is kisan id" },
        ];
      case "HI":
      default:
        return [
          { label: "💬 WhatsApp कृषि बॉट", action: "whatsapp" },
          { label: "❓ यह ऐप क्यों व किसलिए है?", prompt: "यह ऐप क्यों और किसलिए है?" },
          { label: "👥 किसके लिए है?", prompt: "यह ऐप किसके लिए बनाई गई है?" },
          { label: "🚀 क्या-क्या कर सकते हैं?", prompt: "इस ऐप से क्या क्या कर सकते हैं?" },
          { label: "📱 कैसे इस्तेमाल करें?", prompt: "इस ऐप को कैसे इस्तेमाल करें?" },
          { label: "💰 आज का मंडी भाव", prompt: "आज का मंडी भाव बताओ" },
          { label: "⛅ मौसम का हाल", prompt: "आज बारिश होगी क्या?" },
          { label: "🧪 खाद व यूरिया की मात्रा", prompt: "गेहूं में कितना खाद और यूरिया डालें?" },
          { label: "🏛️ सरकारी योजनाएं (₹6000)", prompt: "पीएम किसान योजना में आवेदन कैसे करें?" },
          { label: "🆔 मेरी किसान ID", prompt: "मेरी किसान ID कैसे मिलेगी?" },
        ];
    }
  };

  return (
    <>
      {/* ── FLOATING WIDGET BUTTON (BOTTOM-RIGHT) ── */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 select-none">
        
        {/* Floating Greeting Tooltip (Auto disappears or closes) */}
        {showTooltip && !isOpen && (
          <div 
            onClick={() => { setIsOpen(true); setShowTooltip(false); }}
            className="animate-bounce max-w-[260px] bg-slate-900/95 text-white text-xs p-3 rounded-2xl shadow-2xl border border-emerald-500/40 cursor-pointer flex items-center gap-2.5 backdrop-blur-md">
            <span className="text-2xl">🤖</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-black text-emerald-300">24/7 किसान AI सहायक</p>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                {currentLang === "HINGLISH" 
                  ? "Kheti, mandi bhav, bimari ya app jankari poochein →" 
                  : (currentLang === "HI" 
                    ? "खेती, मंडी भाव, बीमारी या ऐप जानकारी पूछें →" 
                    : "Ask about crops, mandi rates, schemes or app →")}
              </p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              className="text-white/40 hover:text-white text-xs font-bold pl-1 cursor-pointer">✕</button>
          </div>
        )}

        {/* Circular Floating Trigger Button */}
        <button
          id="kisan-floating-ai-assistant-btn"
          onClick={() => {
            setIsOpen(o => !o);
            setShowTooltip(false);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl sm:text-3xl text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
          style={{
            background: "linear-gradient(135deg, #059669, #10b981, #d97706)",
            boxShadow: "0 10px 25px -3px rgba(16, 185, 129, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
          }}
          title="24/7 Kisan AI Assistant"
        >
          {/* Animated pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
          
          {isOpen ? (
            <span className="text-2xl font-bold">✕</span>
          ) : (
            <div className="flex flex-col items-center">
              <span>🤖</span>
              <span className="text-[8px] font-black uppercase tracking-tight bg-amber-400 text-black px-1.5 py-0.2 rounded-full mt-0.5">
                24/7 AI
              </span>
            </div>
          )}
        </button>
      </div>

      {/* ── EXPANDED 24/7 AI ASSISTANT CHAT DRAWER / POPUP ── */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[425px] h-[600px] max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-emerald-500/30 bg-slate-950 text-white">
          
          {/* Header */}
          <div 
            className="p-3.5 sm:p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #064e3b, #065f46, #047857)" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/20 flex-shrink-0">
                🌾
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white leading-tight truncate">
                    {currentLang === "HINGLISH" 
                      ? "Kisan AI Assistant" 
                      : (currentLang === "HI" ? "किसान AI सहायक" : "Kisan AI Assistant")}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse flex-shrink-0" />
                </div>
                <p className="text-[10px] text-emerald-200 font-semibold mt-0.5 truncate">
                  🟢 24/7 Live · 100% On-Device AI
                </p>
              </div>
            </div>

            {/* Header controls: Audio speech toggle, Indian Language Selector, Close */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setTtsEnabled(t => !t)}
                className={`p-1.5 rounded-xl text-xs transition-all cursor-pointer ${ttsEnabled ? "bg-white/20 text-white" : "bg-white/5 text-white/40"}`}
                title={ttsEnabled ? "Voice Audio On (बोलकर सुनाए)" : "Voice Audio Muted"}
              >
                {ttsEnabled ? "🔊" : "🔇"}
              </button>

              {/* WhatsApp Bot Switch Button */}
              {onOpenWhatsAppBot && (
                <button
                  id="assistant-open-whatsapp-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenWhatsAppBot();
                  }}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border border-emerald-400/40 active:scale-95 flex-shrink-0"
                  title="व्हाट्सएप बॉट खोलें (Open WhatsApp Krishi Bot)"
                >
                  <span className="text-xs">💬</span>
                  <span className="font-bold">WhatsApp Bot</span>
                </button>
              )}

              {/* Multi-Language Selector Trigger */}
              <div className="relative">
                <button
                  id="assistant-lang-selector-btn"
                  onClick={() => setShowLangMenu(m => !m)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/15 hover:bg-white/25 text-amber-300 border border-white/20 transition-all cursor-pointer flex items-center gap-1"
                  title="अपनी भाषा चुनें (Choose Indian Language)"
                >
                  <span>🌐</span>
                  <span>{currentLangObj.name}</span>
                  <span className="text-[9px]">▼</span>
                </button>

                {/* Dropdown Menu of All Major Indian Languages */}
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900/98 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl p-1.5 z-50 animate-fadeIn">
                    <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-white/10 mb-1">
                      🇮🇳 अपनी भाषा चुनें:
                    </p>
                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                      {SUPPORTED_LANGUAGES.map(l => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setCurrentLang(l.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            currentLang === l.code 
                              ? "bg-emerald-600 text-white font-bold" 
                              : "text-slate-200 hover:bg-white/10"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{l.flag}</span>
                            <span>{l.name}</span>
                          </span>
                          <span className="text-[10px] opacity-70">({l.scriptName})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                }}
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer ml-0.5"
                title="बंद करें (Close)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 1-Tap Quick FAQ Horizontal Chips */}
          <div className="px-3 py-2 bg-slate-900/80 border-b border-white/5 overflow-x-auto flex items-center gap-1.5 scrollbar-none flex-shrink-0">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              ⚡ सवाल:
            </span>
            {getQuickChips().map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.action === "whatsapp") {
                    setIsOpen(false);
                    if (onOpenWhatsAppBot) onOpenWhatsAppBot();
                  } else {
                    handleSend(chip.prompt);
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
                  chip.action === "whatsapp"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white font-bold border border-emerald-400/50 shadow-sm"
                    : "bg-white/10 hover:bg-emerald-600/50 hover:border-emerald-400 border border-white/15 text-slate-200"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-950/90 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} animate-fadeIn`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-400">
                    {m.sender === "user" ? "👤 किसान भाई" : "🤖 किसान AI सहायक"}
                  </span>
                  <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                  {m.sender === "bot" && ttsEnabled && (
                    <button
                      onClick={() => speakMessage(m.text)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 ml-1 cursor-pointer"
                      title="बोलकर सुनें (Listen)"
                    >
                      🔊 सुनें
                    </button>
                  )}
                </div>

                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-md leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-tr-none"
                      : "bg-slate-900/95 border border-white/10 text-slate-100 rounded-tl-none"
                  }`}
                >
                  {m.title && (
                    <h4 className="font-bold text-xs text-amber-300 mb-2 pb-1 border-b border-white/10 flex items-center gap-1">
                      <span>🌾</span>
                      <span>{m.title}</span>
                    </h4>
                  )}
                  <div className="whitespace-pre-line text-xs sm:text-[13px] text-slate-200 space-y-1">
                    {m.text}
                  </div>

                  {/* Contextual Action Buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-300 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                        >
                          <span>{act.label}</span>
                          <span className="text-[10px]">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Voice Mic Status Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-600/90 text-white text-xs font-bold flex items-center justify-between animate-pulse flex-shrink-0">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>🎙️ माइक चालू है... बोलकर पूछें ({currentLangObj.name})</span>
              </span>
              <button 
                onClick={toggleVoiceInput}
                className="underline text-[11px] font-black cursor-pointer">समाप्त करें</button>
            </div>
          )}

          {/* Input Bar & Actions */}
          <div className="p-3 bg-slate-900 border-t border-white/10 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all flex-shrink-0 cursor-pointer ${
                  isListening
                    ? "bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-600/40"
                    : "bg-white/10 hover:bg-white/15 text-white"
                }`}
                title="माइक दबाकर बोलें (Voice Mic)"
              >
                {isListening ? "🔴" : "🎙️"}
              </button>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  currentLang === "HINGLISH"
                    ? "Fasal, mandi bhav, mausam ya app ke baare me poochein..."
                    : (currentLang === "HI"
                      ? "फसल, मंडी भाव, मौसम या ऐप के बारे में पूछें..."
                      : "Ask about crops, mandi rates, weather, schemes...")
                }
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-white/35 outline-none bg-white/[0.06] border border-white/15 focus:border-emerald-500 transition-all"
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all flex-shrink-0 ${
                  inputVal.trim()
                    ? "bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-md shadow-emerald-700/20"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                }`}
              >
                🚀
              </button>
            </form>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-[9px] text-white/35">
                ⚡ 100% On-Device Edge AI · 24/7 Active
              </p>
              <span className="text-[9px] text-emerald-400/70 font-semibold">
                🌐 {currentLangObj.name} ({currentLangObj.scriptName})
              </span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
