import { useState, useEffect } from "react";
import WhatsAppBotModal from "./WhatsAppBotModal";
import { 
  getWhatsAppThreads, 
  sendAdminWhatsAppReply, 
  resetWhatsAppThreads,
  getMetaWhatsAppConfig,
  saveMetaWhatsAppConfig,
  testMetaWhatsAppConnection,
  DEFAULT_META_CONFIG
} from "../lib/whatsappStore";

const CUSTOM_PW_KEY    = "kisan_admin_custom_pw";
const DEFAULT_PASSWORD = "KisanGov2024";
const STORAGE_KEY      = "kisan_sahayak_history";
const USER_KEY         = "kisan_user";
const APPLICATIONS_KEY = "kisan_scheme_applications";
const ADMIN_LANG_KEY   = "kisan_admin_lang";

// ── BILINGUAL TRANSLATOR DICTIONARY ──
const ADMIN_I18N = {
  HI: {
    portalName: "किसान सहायता पोर्टल · Admin Access",
    adminBadge: "एडमिन",
    queriesLabel: "प्रश्न",
    appsLabel: "आवेदन",
    close: "✕ बंद करें",
    langSwitch: "हिन्दी / EN",
    langTooltip: "भाषा बदलें (Switch to English)",
    login: {
      title: "Kisan Sahayak Admin",
      sub: "Kisan Sahayak AI · कंट्रोल पोर्टल",
      placeholder: "एडमिन पासवर्ड दर्ज करें",
      btn: "🔐 Admin Login / लॉगिन करें",
      error: "गलत पासवर्ड! (Incorrect Admin Password)",
      notice: "अधिकृत एडमिन लॉगिन हेतु पासवर्ड दर्ज करें।",
    },
    tabs: {
      applications: "योजना आवेदन व किसान सर्च",
      applicationsSub: "योजना आवेदन डायरेक्टरी",
      dashboard: "डैशबोर्ड ओवरव्यू",
      dashboardSub: "सिस्टम आँकड़े व टेलीमेट्री",
      whatsapp: "व्हाट्सएप बॉट व ब्रॉडकास्ट",
      whatsappSub: "लाइव बॉट, किसान अलर्ट व मेटा API",
      queries: "सर्च व वॉयस लॉग",
      queriesSub: "किसान प्रश्नों का लॉग",
      intents: "एआई विषय एनालिटिक्स",
      intentsSub: "विषय वितरण",
      system: "सिस्टम व पासवर्ड",
      systemSub: "सुरक्षा व कॉन्फ़िगरेशन",
    },
    appsTab: {
      title: "योजना आवेदन व किसान डायरेक्टरी",
      sub: "किसानों द्वारा किए गए सरकारी योजना आवेदनों की संपूर्ण सूची एवं त्वरित किसान ID सर्च",
      resetDemo: "🔄 रीसेट डेमो डेटा",
      exportJson: "📥 Export JSON",
      totalApps: "कुल योजना आवेदन",
      approvedApps: "DBT स्वीकृत / अंतरित",
      inReviewApps: "सत्यापनाधीन आवेदन",
      uniqueFarmers: "पंजीकृत किसान",
      instantSearchLabel: "⚡ किसान ID तुरंत खोजें (Instant Kisan ID Search)",
      searchPlaceholder: "किसान ID (उदा: KS-UP-1042, KS-MH-2081), नाम, फोन या स्कीम लिखें...",
      quickKisan: "त्वरित किसान ID:",
      clearSearch: "✕ सर्च हटाएं",
      verifiedFarmer: "सत्यापित किसान ✓",
      totalAppsCount: "कुल आवेदन",
      landArea: "जमीन / रकबा",
      khasraNo: "खसरा संख्या",
      resultsTitle: "योजना आवेदन परिणाम",
      filterAll: "सभी",
      filterApproved: "स्वीकृत",
      filterReview: "प्रक्रियाधीन",
      noResults: "कोई आवेदन नहीं मिला",
      noResultsSub: "सर्च कीवर्ड बदलकर देखें या 'सर्च हटाएं' पर क्लिक करें",
      resetSearch: "सर्च रीसेट करें",
      viewDossier: "📋 विवरण (Dossier)",
      statusApproved: "DBT स्वीकृत",
      statusReview: "प्रक्रियाधीन",
    },
    dossier: {
      title: "योजना आवेदन संपूर्ण विवरण",
      govVerified: "GOV VERIFIED",
      farmerInfo: "किसान प्रोफ़ाइल (Farmer Info)",
      farmerName: "किसान का नाम:",
      kisanId: "किसान ID:",
      contact: "मोबाइल / संपर्क:",
      location: "पता / जिला:",
      schemeInfo: "योजना विवरण (Scheme Details)",
      schemeTitle: "योजना का नाम:",
      benefitBadge: "अनुमानित लाभ:",
      appliedAt: "आवेदन समय:",
      landInfo: "कृषि व भूमि विवरण (Land Records)",
      land: "जमीन का रकबा:",
      khasra: "खसरा / गाटा संख्या:",
      primaryCrop: "मुख्य फसल:",
      bhulekhStatus: "राज्य भूलेख रिकॉर्ड:",
      bhulekhVerified: "✅ डिजिटल खतौनी सत्यापित",
      bankInfo: "बैंक व DBT प्रत्यक्ष लाभ (Bank Info)",
      ifsc: "बैंक IFSC कोड:",
      accountNo: "खाता संख्या:",
      show: "दिखाएं",
      hide: "छिपाएं",
      aadhaarKyc: "आधार e-KYC:",
      aadhaarLinked: "✅ लिंक (बायोमेट्रिक सत्यापित)",
      pfmsStatus: "PFMS स्थिति:",
      pfmsActive: "✅ प्रत्यक्ष लाभ (DBT) सक्रिय",
      docsTitle: "संलग्न दस्तावेज सत्यापन (Uploaded Documents Verification)",
      docAadhaar: "आधार कार्ड",
      docBhulekh: "भूलेख खतौनी",
      docPassbook: "बैंक पासबुक",
      docDeclaration: "घोषणा पत्र",
      remarks: "नोट / Remarks:",
      copyDossier: "विवरण कॉपी करें",
      copied: "कॉपी हो गया!",
      printPdf: "प्रिंट / PDF",
      officialPortal: "सरकारी पोर्टल पर देखें ↗",
      holdBtn: "सत्यापन में डालें (Hold)",
      approveBtn: "स्वीकृत करें (Approve)",
    },
    dashboard: {
      title: "Overview Dashboard",
      sub: "लाइव टेलीमेट्री, आवेदन व एआई क्वेरी विवरण",
      schemeSectionTitle: "🏛️ सरकारी योजना आवेदन प्रबंधन (Govt Scheme Applications)",
      schemeSectionSub: "किसानों ने पीएम किसान, फसल बीमा और केसीसी हेतु आवेदन किया है।",
      openAppsBtn: "📋 आवेदन व किसान सर्च खोलें",
      recentAppsTitle: "📋 हाल के योजना आवेदन (Recent Scheme Applications)",
      viewAll: "सभी देखें →",
      recentQueriesTitle: "🕐 हाल के प्रश्न (Recent Queries)",
      noQueries: "अभी तक कोई प्रश्न दर्ज नहीं हुआ है।",
    },
    whatsappTab: {
      title: "व्हाट्सएप बॉट नियंत्रण व किसान संवाद कंसोल",
      sub: "किसानों के प्रश्न, AI बॉट उत्तर, नोडल अधिकारी रिप्लाई व एडवाइजरी ब्रॉडकास्ट",
      openMobileBot: "📱 किसान व्हाट्सएप व्यू खोलें",
      kpiSessions: "सक्रिय किसान चैट्स",
      kpiScans: "पत्ता रोग स्कैन पूर्ण",
      kpiBroadcast: "पंजीकृत किसान रीच",
      kpiLatency: "औसत NPU लेटेंसी",
      inboxTitle: "किसान व्हाट्सएप इनबॉक्स व अधिकारी उत्तर डेस्क (Farmer WhatsApp Inbox)",
      inboxSub: "किसानों द्वारा पूछे गए प्रश्न, AI उत्तर, एवं अधिकारी द्वारा सीधा समाधान",
      filterAll: "सभी चैट्स",
      filterPending: "🟡 उत्तर प्रतीक्षित",
      filterResolved: "🟢 हल / उत्तर दिया",
      searchFarmer: "किसान ID (उदा: KS-UP-1042), नाम, फोन या जिला खोजें...",
      pendingOfficerAlert: "⚠️ किसान का यह प्रश्न AI बॉट द्वारा हल नहीं हो सका! अधिकारी का उत्तर आवश्यक है।",
      replyBoxTitle: "किसान को उत्तर भेजें (Send Reply)",
      replyPlaceholder: "किसान की समस्या का समाधान यहां लिखें...",
      sendReplyBtn: "👨‍💼 उत्तर भेजें",
      sendingReply: "भेज रहे हैं...",
      officerDesignation: "कृषि सहायता टीम",
      resetThreads: "🔄 रीसेट चैट्स",
      broadcastCardTitle: "📢 किसान एडवाइजरी व्हाट्सएप ब्रॉडकास्ट (Broadcast Console)",
      broadcastCardSub: "मौसम अलर्ट, मंडी भाव या योजनाएं सीधे किसानों के व्हाट्सएप पर भेजें",
      audienceLabel: "लक्षित किसान समूह:",
      audienceAll: "सभी पंजीकृत किसान (18,450+)",
      audienceUP: "उत्तर प्रदेश किसान मंडल (5,200+)",
      audienceWheat: "गेहूं व सरसों उत्पादक (7,800+)",
      audiencePaddy: "धान उत्पादक (4,100+)",
      categoryLabel: "अलर्ट श्रेणी:",
      catWeather: "⛅ मौसम व ओलावृष्टि",
      catMandi: "💰 आज का मंडी भाव",
      catScheme: "🏛️ पीएम किसान DBT",
      catPest: "🐛 कीट प्रकोप अलर्ट",
      templatesLabel: "त्वरित संदेश टेम्पलेट:",
      msgPlaceholder: "किसानों को भेजा जाने वाला व्हाट्सएप संदेश लिखें...",
      sendBtn: "🚀 व्हाट्सएप ब्रॉडकास्ट भेजें",
      sending: "भेज रहे हैं...",
      sentSuccess: "✅ ब्रॉडकास्ट सफलतापूर्वक 18,450 किसानों को भेजा गया!",
      recentBroadcasts: "हाल ही में भेजे गए ब्रॉडकास्ट संदेश:",
      testerCardTitle: "🧪 लाइव व्हाट्सएप बॉट टेस्टर (Live Bot Simulator)",
      testerCardSub: "एडमिन के रूप में ऑन-डिवाइस Snapdragon NPU बॉट की त्वरित जांच करें",
      testerPlaceholder: "बॉट को संदेश भेजें (उदा: 1, गेहूं का भाव, पत्ती पीली है)...",
      quickPrompts: "त्वरित टेस्ट प्रश्न:",
      apiCardTitle: "⚙️ Meta WhatsApp Business Cloud API & Webhook स्थिति",
      apiCardSub: "प्रमाणित WABA एकाउंट व ऑन-डिवाइस Snapdragon NPU टेलीमेट्री",
      webhookUrlLabel: "Webhook Callback URL",
      tokenLabel: "Verify Token",
      phoneIdLabel: "Phone Number ID",
      wabaIdLabel: "Business Account ID (WABA)",
      pingBtn: "⚡ टेस्ट वेबहुक पिंग (Test Ping)",
      pingSuccess: "✅ HTTP 200 OK · Webhook Active (16ms)",
      copyBtn: "कॉपी",
      copied: "कॉपी हुआ!",
    },
    queriesTab: {
      title: "Full Query Log",
      sub: "ऑफलाइन संग्रहित प्रश्न व वॉयस ट्रांसक्रिप्ट",
      exportJson: "📤 Export JSON",
      clearAll: "🗑️ Clear All",
      empty: "कोई क्वेरी हिस्ट्री नहीं है।",
      colMode: "मोड",
      colQuery: "प्रश्न",
      colIntent: "विषय (Intent)",
      colConfLat: "सटीकता / लेटेंसी",
      colWhen: "समय",
    },
    intentsTab: {
      title: "Intent Analytics",
      sub: "किसान रुचि एवं समस्याओं के अनुसार प्रश्नों का विभाजन",
      empty: "अभी कोई डेटा उपलब्ध नहीं है।",
      share: "वॉयस शेयर",
    },
    systemTab: {
      title: "System, Security & Configuration",
      sub: "एडमिन पासवर्ड बदलाव, सुरक्षा, स्टोरेज व प्लेटफॉर्म टेलीमेट्री",
      changePwTitle: "एडमिन पासवर्ड बदलें (Change Admin Password)",
      changePwSub: "सुरक्षा हेतु सरकारी नोडल अधिकारी का लॉगिन पासवर्ड अपडेट करें",
      currentPw: "वर्तमान पासवर्ड (Current Password):",
      currentPlaceholder: "मौजूदा पासवर्ड दर्ज करें",
      newPw: "नया पासवर्ड (New Password):",
      newPlaceholder: "नया पासवर्ड (min 6 अक्षर)",
      confirmPw: "कन्फर्म पासवर्ड (Confirm Password):",
      confirmPlaceholder: "नया पासवर्ड दोबारा लिखें",
      showPw: "पासवर्ड दिखाएं (Show password)",
      savePw: "💾 पासवर्ड सुरक्षित करें",
      resetDefault: "डिफ़ॉल्ट रीसेट (KisanGov2024)",
      errCurrent: "❌ वर्तमान पासवर्ड गलत है! (Current password is wrong)",
      errMin: "❌ नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए! (Min 6 chars)",
      errMismatch: "❌ नया पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं! (Passwords do not match)",
      success: "✅ पासवर्ड सफलतापूर्वक बदल दिया गया! (Admin password successfully updated)",
      configTitle: "⚙️ App Configuration",
      sessionTitle: "👤 Active Farmer Session",
      actionsTitle: "⚡ Quick System Actions",
      clearLog: "Clear Query Log",
      exportApps: "Export Applications",
      clearSession: "Clear Farmer Session",
      reloadPage: "Reload Page",
    }
  },
  EN: {
    portalName: "Kisan Sahayak Portal · Admin Access",
    adminBadge: "ADMIN",
    queriesLabel: "queries",
    appsLabel: "applications",
    close: "✕ Close",
    langSwitch: "EN / हिन्दी",
    langTooltip: "Switch Language (हिन्दी में बदलें)",
    login: {
      title: "Kisan Sahayak Admin",
      sub: "Kisan Sahayak AI · Control Portal",
      placeholder: "Enter Admin Password",
      btn: "🔐 Admin Login",
      error: "Incorrect Admin Password!",
      notice: "Authorized admin access only.",
    },
    tabs: {
      applications: "Scheme Applications & Kisan Search",
      applicationsSub: "Scheme Applications Directory",
      dashboard: "Dashboard Overview",
      dashboardSub: "System Metrics & Live Telemetry",
      whatsapp: "WhatsApp Bot & Broadcast",
      whatsappSub: "Live Bot Tester, Alerts & Meta API",
      queries: "Search & Voice Query Logs",
      queriesSub: "Farmer Query Records",
      intents: "AI Intent Analytics",
      intentsSub: "Topic Distribution",
      system: "System & Security",
      systemSub: "Config & Credentials",
    },
    appsTab: {
      title: "Scheme Applications & Farmer Directory",
      sub: "Complete repository of farmer applications for central schemes with instant Kisan ID search",
      resetDemo: "🔄 Reset Demo Data",
      exportJson: "📥 Export JSON",
      totalApps: "Total Scheme Applications",
      approvedApps: "DBT Approved / Credited",
      inReviewApps: "Under Verification",
      uniqueFarmers: "Registered Farmers",
      instantSearchLabel: "⚡ Instant Kisan ID Search",
      searchPlaceholder: "Search by Kisan ID (e.g. KS-UP-1042, KS-MH-2081), Name, Phone, or Scheme...",
      quickKisan: "Quick Kisan ID:",
      clearSearch: "✕ Clear Search",
      verifiedFarmer: "Verified Farmer ✓",
      totalAppsCount: "Total Applications",
      landArea: "Land Area",
      khasraNo: "Khasra Number",
      resultsTitle: "Scheme Application Results",
      filterAll: "All",
      filterApproved: "Approved",
      filterReview: "In Review",
      noResults: "No applications found",
      noResultsSub: "Try different search terms or click 'Clear Search'",
      resetSearch: "Reset Search",
      viewDossier: "📋 View Dossier",
      statusApproved: "DBT Approved",
      statusReview: "In Verification",
    },
    dossier: {
      title: "Official Scheme Application Dossier",
      govVerified: "GOV VERIFIED",
      farmerInfo: "Farmer Information",
      farmerName: "Farmer Name:",
      kisanId: "Kisan ID:",
      contact: "Contact / Phone:",
      location: "Location / District:",
      schemeInfo: "Scheme Details",
      schemeTitle: "Scheme Title:",
      benefitBadge: "Sanctioned Benefit:",
      appliedAt: "Submission Date:",
      landInfo: "Land & Agricultural Records",
      land: "Land Acreage:",
      khasra: "Khasra / Gata No:",
      primaryCrop: "Primary Crop:",
      bhulekhStatus: "State Bhulekh Record:",
      bhulekhVerified: "✅ Digital Khatauni Verified",
      bankInfo: "Bank & Direct Benefit Transfer (DBT)",
      ifsc: "Bank IFSC Code:",
      accountNo: "Account Number:",
      show: "Show",
      hide: "Hide",
      aadhaarKyc: "Aadhaar e-KYC:",
      aadhaarLinked: "✅ Linked (Biometric Verified)",
      pfmsStatus: "PFMS DBT Status:",
      pfmsActive: "✅ Direct Benefit Transfer Active",
      docsTitle: "Document Verification Checklist",
      docAadhaar: "Aadhaar Card",
      docBhulekh: "Bhulekh Khatauni",
      docPassbook: "Bank Passbook",
      docDeclaration: "Self Declaration",
      remarks: "Official Remarks:",
      copyDossier: "Copy Dossier",
      copied: "Copied!",
      printPdf: "Print / PDF",
      officialPortal: "View on Govt Portal ↗",
      holdBtn: "Place on Hold",
      approveBtn: "Approve DBT",
    },
    dashboard: {
      title: "Overview Dashboard",
      sub: "Live telemetry, applications & AI query distribution",
      schemeSectionTitle: "🏛️ Govt Scheme Applications Management",
      schemeSectionSub: "Farmers applied for PM-Kisan, Crop Insurance (PMFBY), and Kisan Credit Card.",
      openAppsBtn: "📋 Open Applications & Kisan Search",
      recentAppsTitle: "📋 Recent Scheme Applications",
      viewAll: "View All →",
      recentQueriesTitle: "🕐 Recent Queries",
      noQueries: "No query history recorded yet.",
    },
    whatsappTab: {
      title: "WhatsApp Bot Control & Farmer Interaction Console",
      sub: "Farmer Queries, AI Responses, Nodal Officer Direct Reply & Advisory Broadcast",
      openMobileBot: "📱 Open Farmer WhatsApp View",
      kpiSessions: "Active Farmer Chats",
      kpiScans: "Crop Disease Scans Done",
      kpiBroadcast: "Registered Farmers Reached",
      kpiLatency: "Avg NPU Latency",
      inboxTitle: "Farmer WhatsApp Inbox & Officer Reply Desk",
      inboxSub: "Farmer questions, AI bot responses, and live resolution portal for unresolved queries",
      filterAll: "All Chats",
      filterPending: "🟡 Needs Reply",
      filterResolved: "🟢 Resolved / Replied",
      searchFarmer: "Search by Kisan ID (e.g. KS-UP-1042), Name, Phone or State...",
      pendingOfficerAlert: "⚠️ Farmer question unresolved by AI Bot! Direct Reply required.",
      replyBoxTitle: "Send Reply to Farmer",
      replyPlaceholder: "Type resolution for the farmer's problem here...",
      sendReplyBtn: "👨‍💼 Send Reply",
      sendingReply: "Sending...",
      officerDesignation: "Kisan Sahayak Support Team (Admin)",
      resetThreads: "🔄 Reset Threads",
      broadcastCardTitle: "📢 Farmer Advisory WhatsApp Broadcast Console",
      broadcastCardSub: "Broadcast weather alerts, mandi rates, or schemes directly to farmers' WhatsApp",
      audienceLabel: "Target Farmer Group:",
      audienceAll: "All Registered Farmers (18,450+)",
      audienceUP: "Uttar Pradesh Region (5,200+)",
      audienceWheat: "Wheat & Mustard Growers (7,800+)",
      audiencePaddy: "Paddy & Basmati Growers (4,100+)",
      categoryLabel: "Alert Category:",
      catWeather: "⛅ Weather & Rain Alert",
      catMandi: "💰 Daily Mandi Price Bulletin",
      catScheme: "🏛️ PM-Kisan DBT Installment",
      catPest: "🐛 Pest & Disease Outbreak",
      templatesLabel: "Quick Advisory Templates:",
      msgPlaceholder: "Type WhatsApp message to be broadcasted to farmers...",
      sendBtn: "🚀 Send WhatsApp Broadcast",
      sending: "Sending...",
      sentSuccess: "✅ Broadcast successfully dispatched to 18,450 farmers!",
      recentBroadcasts: "Recently Sent WhatsApp Broadcasts:",
      testerCardTitle: "🧪 Live WhatsApp Bot Tester (Interactive Simulator)",
      testerCardSub: "Test the on-device Snapdragon NPU bot with instant diagnosis and mandi responses",
      testerPlaceholder: "Send message to bot (e.g., 1, mandi rates, wheat yellow rust)...",
      quickPrompts: "Quick Test Prompts:",
      apiCardTitle: "⚙️ Meta WhatsApp Business Cloud API & Webhook Health",
      apiCardSub: "Verified WABA Account & On-Device Snapdragon NPU Telemetry",
      webhookUrlLabel: "Webhook Callback URL",
      tokenLabel: "Verify Token",
      phoneIdLabel: "Phone Number ID",
      wabaIdLabel: "Business Account ID (WABA)",
      pingBtn: "⚡ Test Webhook Ping",
      pingSuccess: "✅ HTTP 200 OK · Webhook Active (16ms)",
      copyBtn: "Copy",
      copied: "Copied!",
    },
    queriesTab: {
      title: "Full Query Log",
      sub: "Offline-stored queries & voice transcripts",
      exportJson: "📤 Export JSON",
      clearAll: "🗑️ Clear All",
      empty: "No query history recorded yet.",
      colMode: "Mode",
      colQuery: "Query",
      colIntent: "Intent Topic",
      colConfLat: "Confidence / Latency",
      colWhen: "When",
    },
    intentsTab: {
      title: "Intent Analytics",
      sub: "Distribution of questions by farmer interest topic",
      empty: "No query analytics available yet.",
      share: "Voice Share",
    },
    systemTab: {
      title: "System, Security & Configuration",
      sub: "Admin password management, security, storage, and platform telemetry",
      changePwTitle: "Change Admin Password",
      changePwSub: "Update authorized government nodal officer login password",
      currentPw: "Current Password:",
      currentPlaceholder: "Enter current password",
      newPw: "New Password:",
      newPlaceholder: "New password (min 6 characters)",
      confirmPw: "Confirm Password:",
      confirmPlaceholder: "Retype new password",
      showPw: "Show password",
      savePw: "💾 Save Password",
      resetDefault: "Reset Default (KisanGov2024)",
      errCurrent: "❌ Current password is wrong!",
      errMin: "❌ New password must be at least 6 characters!",
      errMismatch: "❌ Passwords do not match!",
      success: "✅ Admin password successfully updated!",
      configTitle: "⚙️ App Configuration",
      sessionTitle: "👤 Active Farmer Session",
      actionsTitle: "⚡ Quick System Actions",
      clearLog: "Clear Query Log",
      exportApps: "Export Applications",
      clearSession: "Clear Farmer Session",
      reloadPage: "Reload Page",
    }
  }
};

// Helper to get active admin password
function getAdminPassword() {
  try {
    return localStorage.getItem(CUSTOM_PW_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

// Initial realistic demo applications if none exist in localStorage
const DEFAULT_APPLICATIONS = [
  {
    applicationId: "KS-PMKI-2026-1042",
    schemeId: "pm-kisan",
    schemeTitle: "पीएम किसान सम्मान निधि योजना (PM-Kisan)",
    schemeTitleEN: "PM Kisan Samman Nidhi Yojana (PM-Kisan)",
    benefitBadge: "₹6,000 / वर्ष (3 समान किस्तें)",
    benefitBadgeEN: "₹6,000 / Year (3 equal installments)",
    farmerName: "रामेश्वर सिंह (Rameshwar Singh)",
    contact: "98765 43210",
    location: "अलीगढ़ (Aligarh), उत्तर प्रदेश",
    crop: "🌾 गेहूं और सरसों (Wheat & Mustard)",
    land: "4.2 Acres",
    kisanId: "KS-UP-1042",
    khasraNo: "142/8",
    bankIfsc: "SBIN0001234",
    bankAccountNo: "••••••••4892",
    bankAccountFull: "3082914892",
    aadhaarLast4: "5821",
    uploadedDocsCount: 4,
    officialUrl: "https://pmkisan.gov.in/",
    submittedAt: "11 Sep 2026, 10:45 AM",
    status: "approved",
    statusTextHI: "🟢 DBT किस्त स्वीकृत · बैंक खाते में अंतरित",
    statusTextEN: "🟢 DBT Approved · Credited to Bank Account",
    estimatedDays: "सक्रिय लाभार्थी · किस्त संख्या 18 स्वीकृत",
    remarks: "आधार e-KYC एवं भूलेख खतौनी सत्यापन पूर्ण। DBT सक्रिय।",
  },
  {
    applicationId: "KS-PMFB-2026-2081",
    schemeId: "pmfby",
    schemeTitle: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
    schemeTitleEN: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    benefitBadge: "कम प्रीमियम पर संपूर्ण फसल सुरक्षा",
    benefitBadgeEN: "Complete crop protection at low premium",
    farmerName: "सुनीता ताई पाटिल (Sunita Tai)",
    contact: "sunita.patil.kisan@gmail.com",
    location: "यवतमाल (Yavatmal), महाराष्ट्र",
    crop: "☁️ कपास और सोयाबीन (Cotton & Soy)",
    land: "6.5 Acres",
    kisanId: "KS-MH-2081",
    khasraNo: "88/3B",
    bankIfsc: "MAHB0000412",
    bankAccountNo: "••••••••7310",
    bankAccountFull: "6019347310",
    aadhaarLast4: "9140",
    uploadedDocsCount: 3,
    officialUrl: "https://pmfby.gov.in/",
    submittedAt: "10 Sep 2026, 04:20 PM",
    status: "in_review",
    statusTextHI: "🟡 बीमा कंपनी सर्वे सत्यापन प्रक्रियाधीन",
    statusTextEN: "🟡 Insurance Company Survey Verification in Progress",
    estimatedDays: "3-5 कार्यदिवस में अनुमोदन अपेक्षित",
    remarks: "कपास फसल बोवाई प्रमाण पत्र संलग्न। सैटेलाइट सत्यापन जारी।",
  },
  {
    applicationId: "KS-KCC-2026-3019",
    schemeId: "kcc",
    schemeTitle: "किसान क्रेडिट कार्ड योजना (Kisan Credit Card)",
    schemeTitleEN: "Kisan Credit Card Scheme (KCC)",
    benefitBadge: "₹3 लाख तक 4% सस्ती ब्याज दर पर ऋण",
    benefitBadgeEN: "Up to ₹3 Lakh at 4% subsidized interest",
    farmerName: "हरप्रीत सिंह (Harpreet Singh)",
    contact: "98140 88231",
    location: "लुधियाना (Ludhiana), पंजाब",
    crop: "🌾 धान और गेहूं (Paddy & Wheat)",
    land: "8.0 Acres",
    kisanId: "KS-PB-3019",
    khasraNo: "215/12",
    bankIfsc: "PUNB0123400",
    bankAccountNo: "••••••••6024",
    bankAccountFull: "049100010006024",
    aadhaarLast4: "3318",
    uploadedDocsCount: 4,
    officialUrl: "https://myscheme.gov.in/",
    submittedAt: "09 Sep 2026, 02:15 PM",
    status: "approved",
    statusTextHI: "🟢 बैंक ऋण सीमा स्वीकृत (₹2.80 लाख)",
    statusTextEN: "🟢 Bank Credit Limit Sanctioned (₹2.80 Lakh)",
    estimatedDays: "कार्ड शाखा से प्राप्त करें",
    remarks: "पंजाब नेशनल बैंक शाखा लुधियाना द्वारा CIBIL एवं भूलेख सत्यापित।",
  }
];

const INTENT_META = {
  weather:      { label: "Weather / Mausam",      emoji: "⛅", color: "#38bdf8" },
  mandi_price:  { label: "Mandi Price / Bhav",    emoji: "💰", color: "#fbbf24" },
  govt_scheme:  { label: "Govt Scheme / Yojana",  emoji: "🏛️", color: "#a78bfa" },
  crop_disease: { label: "Crop Disease / Rog",    emoji: "🔬", color: "#f87171" },
  crop_care:    { label: "Crop Care / Kheti",     emoji: "🌾", color: "#34d399" },
  fertilizer:   { label: "Fertilizer / Khaad",   emoji: "🧪", color: "#fb923c" },
  irrigation:   { label: "Irrigation / Sinchai",  emoji: "💧", color: "#60a5fa" },
  pest_control: { label: "Pest Control / Keeda",  emoji: "🐛", color: "#f472b6" },
  seed_info:    { label: "Seed Info / Beej",       emoji: "🌱", color: "#4ade80" },
  greeting:     { label: "Greeting / Namaste",     emoji: "🙏", color: "#94a3b8" },
  helpline:     { label: "Helpline",               emoji: "📞", color: "#e2e8f0" },
  unknown:      { label: "Unknown",                emoji: "🤔", color: "#64748b" },
};

function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function getUser() {
  try { const u = localStorage.getItem(USER_KEY); return u ? JSON.parse(u) : null; }
  catch { return null; }
}

function getApplications() {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Seed default demo applications so government official sees data immediately
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
    return DEFAULT_APPLICATIONS;
  } catch {
    return DEFAULT_APPLICATIONS;
  }
}

function relTime(ts) {
  if (!ts) return "";
  const d = Date.now() - new Date(ts).getTime();
  if (d < 60000)    return Math.floor(d/1000)  + "s ago";
  if (d < 3600000)  return Math.floor(d/60000) + "m ago";
  if (d < 86400000) return Math.floor(d/3600000) + "h ago";
  return Math.floor(d/86400000) + "d ago";
}

function StatCard({ emoji, value, label, sub, color = "#fbbf24", onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
      className={`rounded-2xl p-4 sm:p-5 transition-all ${onClick ? "cursor-pointer hover:bg-white/[0.08] hover:border-amber-400/40" : "hover:bg-white/[0.07]"}`}>
      <span className="text-2xl">{emoji}</span>
      <p className="text-2xl sm:text-3xl font-black mt-2" style={{ color }}>{value}</p>
      <p className="text-xs font-semibold text-white/70 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-white/35 mt-0.5">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: pct + "%", background: color }} />
    </div>
  );
}

// ── LOGIN SCREEN WITH TRANSLATOR ──
function LoginScreen({ onLogin, lang, onToggleLang }) {
  const [pw, setPw]     = useState("");
  const [err, setErr]   = useState("");
  const [show, setShow] = useState(false);

  const t = ADMIN_I18N[lang]?.login || ADMIN_I18N.HI.login;

  const submit = (e) => {
    e.preventDefault();
    const activePassword = getAdminPassword();
    if (pw === activePassword) {
      onLogin();
    } else {
      setErr(t.error);
      setTimeout(() => setErr(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(250,180,0,0.12) 0%, transparent 60%), #0a0f1e" }}>
      
      {/* Top right language toggle on login screen */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={onToggleLang}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 bg-white/10 hover:bg-white/15 border border-amber-400/30 cursor-pointer transition-all shadow-md">
          <span>🌐</span>
          <span>{lang === 'HI' ? 'English' : 'हिन्दी'}</span>
        </button>
      </div>

      <div className="w-full max-w-sm">
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}
          className="rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>🌾</div>
          <h1 className="text-2xl font-black text-white mb-1">{t.title}</h1>
          <p className="text-xs text-amber-400 font-semibold mb-6">{t.sub}</p>
          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <input 
                type={show ? "text" : "password"} 
                value={pw} 
                onChange={e => setPw(e.target.value)}
                placeholder={t.placeholder} 
                autoFocus
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all pr-12 font-mono"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }} 
              />
              <button 
                type="button" 
                onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer text-sm">
                {show ? "🙈" : "👁️"}
              </button>
            </div>
            {err && <p className="text-xs text-red-400 animate-pulse font-medium">{err}</p>}
            <button 
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              {t.btn}
            </button>
          </form>
          <div className="mt-5 pt-4 border-t border-white/10 text-left">
            <p className="text-[10px] text-white/35 flex items-center gap-1.5">
              <span>🔒</span>
              <span>{t.notice}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APPLICATION DOSSIER MODAL WITH I18N ──
function ApplicationDetailModal({ app, lang, onClose, onUpdateStatus }) {
  const [copied, setCopied] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  if (!app) return null;

  const t = ADMIN_I18N[lang]?.dossier || ADMIN_I18N.HI.dossier;

  const handleCopy = () => {
    const text = `
========================================
📋 ${lang === 'HI' ? 'भारत सरकार - किसान सहायता आवेदन विवरण' : 'Govt of India - Farmer Scheme Application Dossier'}
========================================
${t.farmerInfo}
${t.kisanId} ${app.kisanId}
${t.farmerName} ${app.farmerName}
${t.contact} ${app.contact}
${t.location} ${app.location}
${t.schemeTitle} ${lang === 'EN' && app.schemeTitleEN ? app.schemeTitleEN : app.schemeTitle}
${t.benefitBadge} ${(lang === 'EN' && app.benefitBadgeEN ? app.benefitBadgeEN : app.benefitBadge) || "—"}
${t.land} ${app.land || "—"}
${t.khasra} ${app.khasraNo || "—"}
${t.ifsc} ${app.bankIfsc || "—"}
${t.accountNo} ${app.bankAccountFull || app.bankAccountNo || "—"}
${t.aadhaarKyc} ${app.aadhaarLast4 || "—"} (${t.aadhaarLinked})
${t.appliedAt} ${app.submittedAt || "—"}
========================================
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        style={{ background: "#0e1526", border: "1px solid rgba(255,255,255,0.12)" }}
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>📋</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{t.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t.govVerified}
                </span>
              </div>
              <p className="text-xs font-mono text-amber-400 mt-0.5">{app.applicationId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold text-white transition-all cursor-pointer">
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs">
          
          {/* Status Alert Banner */}
          <div className="p-3.5 rounded-2xl flex items-center justify-between"
            style={{ 
              background: app.status === "approved" ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)",
              border: `1px solid ${app.status === "approved" ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)"}`
            }}>
            <div>
              <p className="font-bold text-sm" style={{ color: app.status === "approved" ? "#34d399" : "#fbbf24" }}>
                {lang === 'EN' && app.statusTextEN ? app.statusTextEN : (app.statusTextHI || (app.status === "approved" ? "🟢 Approved" : "🟡 In Review"))}
              </p>
              <p className="text-[11px] text-white/60 mt-0.5">{app.estimatedDays || "Active Beneficiary"}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => onUpdateStatus(app.applicationId, app.status === "approved" ? "in_review" : "approved")}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all hover:opacity-90"
                style={{ 
                  background: app.status === "approved" ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)",
                  color: app.status === "approved" ? "#fbbf24" : "#34d399",
                  border: `1px solid ${app.status === "approved" ? "rgba(251,191,36,0.4)" : "rgba(52,211,153,0.4)"}`
                }}>
                {app.status === "approved" ? t.holdBtn : t.approveBtn}
              </button>
            </div>
          </div>

          {/* Grid of details */}
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Farmer Profile Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>👨‍🌾</span> {t.farmerInfo}
              </h4>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-white/40">{t.farmerName}</span>
                  <span className="font-bold text-white text-right">{app.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.kisanId}</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{app.kisanId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.contact}</span>
                  <span className="font-mono text-white/90">{app.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.location}</span>
                  <span className="text-white/90 text-right truncate max-w-[60%]">{app.location}</span>
                </div>
              </div>
            </div>

            {/* Scheme Details Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏛️</span> {t.schemeInfo}
              </h4>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-white/40 block">{t.schemeTitle}</span>
                  <span className="font-bold text-white leading-tight block mt-0.5">
                    {lang === 'EN' && app.schemeTitleEN ? app.schemeTitleEN : app.schemeTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.benefitBadge}</span>
                  <span className="font-bold text-emerald-400">
                    {(lang === 'EN' && app.benefitBadgeEN ? app.benefitBadgeEN : app.benefitBadge) || "Govt Mandated"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.appliedAt}</span>
                  <span className="text-white/80">{app.submittedAt}</span>
                </div>
              </div>
            </div>

            {/* Land & Agriculture Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌾</span> {t.landInfo}
              </h4>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-white/40">{t.land}</span>
                  <span className="font-bold text-white">{app.land || "4.0 Acres"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.khasra}</span>
                  <span className="font-mono font-bold text-amber-300">{app.khasraNo || "142/8"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.primaryCrop}</span>
                  <span className="text-white/90">{app.crop || "Wheat & Mustard"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.bhulekhStatus}</span>
                  <span className="text-emerald-400 font-bold">{t.bhulekhVerified}</span>
                </div>
              </div>
            </div>

            {/* Bank & DBT Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏦</span> {t.bankInfo}
              </h4>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-white/40">{t.ifsc}</span>
                  <span className="font-mono font-bold text-white">{app.bankIfsc || "SBIN0001234"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40">{t.accountNo}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-white">
                      {showAccount ? (app.bankAccountFull || app.bankAccountNo) : app.bankAccountNo}
                    </span>
                    <button 
                      onClick={() => setShowAccount(s => !s)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer">
                      {showAccount ? t.hide : t.show}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.aadhaarKyc}</span>
                  <span className="text-emerald-400 font-bold">
                    {t.aadhaarLinked} (••{app.aadhaarLast4 || "5821"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">{t.pfmsStatus}</span>
                  <span className="text-emerald-400 font-bold">{t.pfmsActive}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document verification checklist */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <span>📁</span> {t.docsTitle}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                <span>✓</span> {t.docAadhaar}
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                <span>✓</span> {t.docBhulekh}
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                <span>✓</span> {t.docPassbook}
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                <span>✓</span> {t.docDeclaration}
              </div>
            </div>
            {app.remarks && (
              <p className="text-[11px] text-white/50 mt-2.5 pt-2 border-t border-white/5">
                <span className="font-semibold text-white/70">{t.remarks} </span>{app.remarks}
              </p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer flex items-center gap-1.5">
              <span>{copied ? "✅" : "📋"}</span>
              <span>{copied ? t.copied : t.copyDossier}</span>
            </button>
            <button 
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer flex items-center gap-1.5">
              <span>🖨️</span>
              <span>{t.printPdf}</span>
            </button>
          </div>
          {app.officialUrl && (
            <a 
              href={app.officialUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              <span>{t.officialPortal}</span>
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

// ── PASSWORD CHANGE COMPONENT WITH I18N ──
function ChangePasswordSection({ lang }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [show, setShow]           = useState(false);
  const [msg, setMsg]             = useState({ text: "", type: "" });

  const t = ADMIN_I18N[lang]?.systemTab || ADMIN_I18N.HI.systemTab;

  const handleChangePw = (e) => {
    e.preventDefault();
    setMsg({ text: "", type: "" });

    const activePw = getAdminPassword();

    if (currentPw !== activePw) {
      setMsg({ text: t.errCurrent, type: "err" });
      return;
    }

    if (!newPw || newPw.length < 6) {
      setMsg({ text: t.errMin, type: "err" });
      return;
    }

    if (newPw !== confirmPw) {
      setMsg({ text: t.errMismatch, type: "err" });
      return;
    }

    try {
      localStorage.setItem(CUSTOM_PW_KEY, newPw);
      setMsg({ text: t.success, type: "ok" });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch {
      setMsg({ text: "Error saving password", type: "err" });
    }
  };

  const handleResetDefault = () => {
    if (window.confirm(lang === 'HI' ? "क्या आप वाकई पासवर्ड डिफ़ॉल्ट ('KisanGov2024') पर रीसेट करना चाहते हैं?" : "Reset password to default ('KisanGov2024')?")) {
      try {
        localStorage.removeItem(CUSTOM_PW_KEY);
        setMsg({ text: lang === 'HI' ? "✅ पासवर्ड डिफ़ॉल्ट ('KisanGov2024') पर रीसेट हो गया!" : "✅ Password reset to default ('KisanGov2024')!", type: "ok" });
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      } catch {}
    }
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      className="rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🔐</span>
          <div>
            <h3 className="text-sm font-bold text-white">{t.changePwTitle}</h3>
            <p className="text-[11px] text-white/40">{t.changePwSub}</p>
          </div>
        </div>
        <button 
          onClick={handleResetDefault}
          className="text-[11px] px-2.5 py-1 rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-white/5 border border-amber-400/20 cursor-pointer">
          {t.resetDefault}
        </button>
      </div>

      <form onSubmit={handleChangePw} className="space-y-3 max-w-md">
        <div>
          <label className="block text-[11px] font-semibold text-white/60 mb-1">
            {t.currentPw}
          </label>
          <input 
            type={show ? "text" : "password"}
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
            placeholder={t.currentPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none font-mono"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-white/60 mb-1">
              {t.newPw}
            </label>
            <input 
              type={show ? "text" : "password"}
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder={t.newPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none font-mono"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/60 mb-1">
              {t.confirmPw}
            </label>
            <input 
              type={show ? "text" : "password"}
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder={t.confirmPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none font-mono"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-[11px] text-white/50 cursor-pointer">
            <input 
              type="checkbox" 
              checked={show} 
              onChange={e => setShow(e.target.checked)}
              className="rounded"
            />
            <span>{t.showPw}</span>
          </label>

          <button 
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-md"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
            {t.savePw}
          </button>
        </div>

        {msg.text && (
          <div className={`p-3 rounded-xl text-xs font-semibold mt-2 ${msg.type === "ok" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-red-500/15 text-red-300 border border-red-500/30"}`}>
            {msg.text}
          </div>
        )}
      </form>
    </div>
  );
}

// ── META WHATSAPP CLOUD API CONFIGURATION MODAL ──
function MetaApiConfigModal({ isOpen, onClose, lang }) {
  const [config, setConfig] = useState(() => getMetaWhatsAppConfig());
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveToast, setSaveToast] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(getMetaWhatsAppConfig());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const updated = saveMetaWhatsAppConfig(config);
    setConfig(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testMetaWhatsAppConnection(config);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleResetDefaults = () => {
    if (window.confirm(lang === 'HI' ? "डिफ़ॉल्ट सेटिंग्स रीसेट करें?" : "Reset to default simulation settings?")) {
      const reset = saveMetaWhatsAppConfig(DEFAULT_META_CONFIG);
      setConfig(reset);
      setTestResult(null);
    }
  };

  const isHi = lang === 'HI';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#111b21] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#202c33] p-4 sm:p-5 border-b border-[#2a3942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-300">
              ⚙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {isHi ? "Meta WhatsApp Cloud API सेटअप" : "Meta WhatsApp Cloud API Setup"}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  config.mode === "live_meta_api"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                }`}>
                  {config.mode === "live_meta_api" 
                    ? (isHi ? "🟢 लाइव API मोड" : "🟢 Live API Mode") 
                    : (isHi ? "⚡ NPU सिमुलेशन (Offline)" : "⚡ NPU Simulation (Offline)")}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isHi 
                  ? "भविष्य में असली Meta WhatsApp API Key लगाने व टेस्ट करने हेतु क्रेडेंशियल्स केंद्र" 
                  : "Central configuration to connect real Meta WhatsApp Business credentials anytime"}
              </p>
            </div>
          </div>

          <button
            id="close-meta-api-config-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-200">

          {/* Section 1: Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-white mb-2">
              {isHi ? "1. ऑपरेशनल मोड चुनें (API Operational Mode):" : "1. Select Operational Mode:"}
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <div
                onClick={() => setConfig(prev => ({ ...prev, mode: "simulation" }))}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  config.mode === "simulation"
                    ? "bg-cyan-950/40 border-cyan-400 shadow-md"
                    : "bg-[#202c33]/60 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>{isHi ? "ऑन-डिवाइस AI (Offline)" : "On-Device AI (Offline)"}</span>
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                    {config.mode === "simulation" && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isHi 
                    ? "Snapdragon NPU आधारित शून्य इंटरनेट लागत। किसी API Key की आवश्यकता नहीं। तुरंत डेमो हेतु उपयुक्त।" 
                    : "Snapdragon NPU powered with 0 cloud calls. No API key needed. Instant demo & field use."}
                </p>
              </div>

              <div
                onClick={() => setConfig(prev => ({ ...prev, mode: "live_meta_api" }))}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  config.mode === "live_meta_api"
                    ? "bg-emerald-950/40 border-emerald-400 shadow-md"
                    : "bg-[#202c33]/60 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>🚀</span>
                    <span>{isHi ? "लाइव Meta Cloud API" : "Live Meta Cloud API"}</span>
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 flex items-center justify-center">
                    {config.mode === "live_meta_api" && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isHi 
                    ? "किसानों के वास्तविक WhatsApp नंबर पर आधिकारिक संदेश भेजने हेतु असली Meta Graph API v19.0 कॉल।" 
                    : "Dispatches real messages to actual farmer mobile numbers via official Meta Graph API v19.0."}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Meta Credentials Form */}
          <form onSubmit={handleSave} className="space-y-4 bg-[#182229] p-4 rounded-2xl border border-white/5">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <span>🔑</span>
              <span>{isHi ? "2. Meta Cloud API क्रेडेंशियल्स दर्ज करें:" : "2. Enter Meta Cloud API Credentials:"}</span>
            </h4>

            {/* Permanent / System User Access Token */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Meta Permanent Access Token (Bearer Token):
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(v => !v)}
                  className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                >
                  {showToken ? (isHi ? "छिपाएं" : "Hide") : (isHi ? "दिखाएं" : "Show")}
                </button>
              </div>
              <input
                type={showToken ? "text" : "password"}
                value={config.accessToken}
                onChange={e => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                placeholder="EAABw..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#202c33] text-white font-mono text-xs border border-white/10 outline-none focus:border-emerald-400 transition-all placeholder-slate-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {isHi ? "Meta Business Manager → System User Token (`whatsapp_business_messaging` अनुमति के साथ)" : "From Meta Business Manager → System User with whatsapp_business_messaging permissions"}
              </span>
            </div>

            {/* Phone Number ID & WABA ID Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Phone Number ID:
                </label>
                <input
                  type="text"
                  value={config.phoneNumberId}
                  onChange={e => setConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                  placeholder="उदा: 104829104829104"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#202c33] text-white font-mono text-xs border border-white/10 outline-none focus:border-emerald-400 transition-all placeholder-slate-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {isHi ? "WhatsApp → API Setup में उपलब्ध" : "From WhatsApp → API Setup in Meta Console"}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  WhatsApp Business Account ID (WABA ID):
                </label>
                <input
                  type="text"
                  value={config.wabaId}
                  onChange={e => setConfig(prev => ({ ...prev, wabaId: e.target.value }))}
                  placeholder="उदा: 102938475610293"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#202c33] text-white font-mono text-xs border border-white/10 outline-none focus:border-emerald-400 transition-all placeholder-slate-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {isHi ? "बिज़नेस एकाउंट ID" : "Business Account ID"}
                </span>
              </div>
            </div>

            {/* Webhook Callback URL & Verify Token */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <h5 className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <span>🌐</span>
                <span>{isHi ? "Webhook सेटिंग्स (Farmers के संदेश प्राप्त करने हेतु):" : "Webhook Settings (To receive farmer incoming messages):"}</span>
              </h5>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Webhook Callback URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.webhookUrl}
                    onChange={e => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#202c33] text-white font-mono text-[11px] border border-white/10 outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy("url", config.webhookUrl)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition-all shrink-0"
                  >
                    {copiedKey === "url" ? (isHi ? "कॉपी हुआ!" : "Copied!") : (isHi ? "कॉपी" : "Copy")}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Webhook Verify Token:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.verifyToken}
                    onChange={e => setConfig(prev => ({ ...prev, verifyToken: e.target.value }))}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#202c33] text-white font-mono text-[11px] border border-white/10 outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy("token", config.verifyToken)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition-all shrink-0"
                  >
                    {copiedKey === "token" ? (isHi ? "कॉपी हुआ!" : "Copied!") : (isHi ? "कॉपी" : "Copy")}
                  </button>
                </div>
              </div>
            </div>

            {/* Test Ping Result Banner */}
            {testResult && (
              <div className={`p-3 rounded-xl border text-xs font-semibold animate-fadeIn ${
                testResult.success
                  ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/40"
                  : "bg-red-500/15 text-red-200 border-red-500/40"
              }`}>
                <div className="flex items-center justify-between">
                  <span>{testResult.message}</span>
                  {testResult.latency && (
                    <span className="font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded">
                      {testResult.latency}ms
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions: Test Ping & Save */}
            <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isTesting}
                  className="px-4 py-2 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                >
                  {isTesting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                      <span>{isHi ? "जांच रहे हैं..." : "Testing..."}</span>
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      <span>{isHi ? "टेस्ट कनेक्शन (Test Ping)" : "Test Ping"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer hover:bg-white/5 transition-all"
                >
                  {isHi ? "रीसेट डिफ़ॉल्ट" : "Reset Default"}
                </button>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>💾</span>
                <span>{isHi ? "क्रेडेंशियल्स सुरक्षित करें (Save)" : "Save Credentials"}</span>
              </button>
            </div>

            {saveToast && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 animate-fadeIn text-center">
                {isHi ? "✅ Meta WhatsApp API क्रेडेंशियल्स सफलतापूर्वक सुरक्षित कर लिए गए!" : "✅ Meta WhatsApp API credentials saved successfully!"}
              </div>
            )}
          </form>

          {/* Section 3: Easy Step-by-Step Guide */}
          <div className="bg-[#182229] p-4 rounded-2xl border border-white/5">
            <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5 mb-2.5">
              <span>📖</span>
              <span>{isHi ? "4 आसान स्टेप्स में Meta WhatsApp API Key कैसे प्राप्त करें:" : "How to get your Meta WhatsApp API Keys in 4 steps:"}</span>
            </h4>

            <ol className="space-y-2 text-[11px] text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                <span className="text-white font-semibold">Meta for Developers</span> पर जाएँ: 
                <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-cyan-400 ml-1 hover:underline">
                  developers.facebook.com ↗
                </a>
              </li>
              <li>
                <strong>Create App</strong> पर क्लिक करें → App Type: <strong>Other → Business</strong> चुनें।
              </li>
              <li>
                App Dashboard में <strong>'WhatsApp'</strong> प्रोडक्ट जोड़ें और <strong>API Setup</strong> पेज से <em>Temporary Access Token</em> और <em>Phone Number ID</em> कॉपी करें।
              </li>
              <li>
                <strong>Configuration</strong> टैब में ऊपर दिया गया <em>Webhook Callback URL</em> व <em>Verify Token</em> पेस्ट करें और <strong>'messages'</strong> फ़ील्ड को सब्सक्राइब करें।
              </li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#182229] px-5 py-3 border-t border-[#2a3942] flex items-center justify-between text-[11px] text-slate-400">
          <span>🔒 क्रेडेंशियल्स केवल आपके लोकल ब्राउज़र (AES-256 Storage) में सुरक्षित रहते हैं।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer transition-all"
          >
            {isHi ? "बंद करें (Close)" : "Close"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── ADMIN WHATSAPP BOT & BROADCAST CONSOLE ──
function AdminWhatsAppConsole({ lang, onOpenMobileBot }) {
  const t = (ADMIN_I18N[lang] || ADMIN_I18N.HI).whatsappTab;

  // Real-time multi-farmer WhatsApp store state
  const [threads, setThreads] = useState(() => getWhatsAppThreads());
  const [selectedKisanId, setSelectedKisanId] = useState(() => {
    const list = getWhatsAppThreads();
    const pending = list.find(t => t.status === "needs_admin_reply");
    return pending ? pending.kisanId : (list[0]?.kisanId || "KS-UP-1042");
  });
  const [inboxFilter, setInboxFilter] = useState("all"); // "all" | "pending" | "resolved"
  const [inboxSearch, setInboxSearch] = useState("");
  
  // Officer Reply form states
  const [officerReplyText, setOfficerReplyText] = useState("");
  const [officerName, setOfficerName] = useState(
    lang === "HI"
      ? "कृषि सहायता टीम"
      : "Kisan Sahayak Support Team"
  );
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyToast, setReplyToast] = useState(null);

  // Meta WhatsApp Cloud API Configuration State
  const [showMetaConfigModal, setShowMetaConfigModal] = useState(false);
  const [metaConfig, setMetaConfig] = useState(() => getMetaWhatsAppConfig());

  useEffect(() => {
    const refreshMeta = (e) => {
      setMetaConfig(e.detail?.config || getMetaWhatsAppConfig());
    };
    window.addEventListener("kisan_meta_config_updated", refreshMeta);
    return () => window.removeEventListener("kisan_meta_config_updated", refreshMeta);
  }, []);

  // Broadcast states
  const [broadcastAudience, setBroadcastAudience] = useState("all");
  const [broadcastCategory, setBroadcastCategory] = useState("weather");
  const [broadcastMsg, setBroadcastMsg] = useState(
    lang === "HI"
      ? "⛅ कृषि मौसम चेतावनी: अगले 48 घंटों में हल्की से मध्यम बारिश व तेज हवाओं की संभावना है। तैयार सरसों व गेहूं की कटी फसल को तिरपाल से ढकें और सुरक्षित स्थान पर रखें।"
      : "⛅ Weather Advisory: Rain and gusty winds expected over the next 48 hours. Please shelter harvested mustard and wheat crops in covered storage immediately."
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcastLogs, setBroadcastLogs] = useState([
    {
      id: "bc-1",
      category: "weather",
      badge: "⛅ Weather Alert",
      text: lang === 'HI' ? "बारिश पूर्व चेतावनी: खेतों में जल निकासी की व्यवस्था सुनिश्चित करें। रासायनिक छिड़काव न करें।" : "Pre-rain Advisory: Ensure proper field drainage. Avoid chemical sprays during gusty winds.",
      audience: lang === 'HI' ? "सभी किसान (18,450)" : "All Farmers (18,450)",
      time: "08:30 AM",
      status: "Delivered ✓✓"
    },
    {
      id: "bc-2",
      category: "mandi",
      badge: "💰 Mandi Rates",
      text: lang === 'HI' ? "आज के ताजा भाव: गेहूं ₹2,580/क्विंटल, धान ₹4,200/क्विंटल। नजदीकी सरकारी e-NAM मंडी में बेचें।" : "Today's Mandi Bulletin: Wheat ₹2,580/qtl, Paddy ₹4,200/qtl. Trade at nearest e-NAM market.",
      audience: lang === 'HI' ? "गेहूं व धान उत्पादक (7,800)" : "Wheat & Paddy Farmers (7,800)",
      time: "कल 05:15 PM",
      status: "Delivered ✓✓"
    },
    {
      id: "bc-3",
      category: "scheme",
      badge: "🏛️ PM-Kisan DBT",
      text: lang === 'HI' ? "पीएम किसान सम्मान निधि 19वीं किस्त जारी! अपने बैंक खाते में ₹2,000 की राशि चेक करें।" : "PM-Kisan 19th Installment released! Check ₹2,000 DBT credit in your bank account.",
      audience: lang === 'HI' ? "उत्तर प्रदेश किसान मंडल (5,200)" : "UP Region Farmers (5,200)",
      time: "10 सितम्बर",
      status: "Delivered ✓✓"
    }
  ]);

  // Webhook Ping Test
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Synchronize threads on event and interval
  useEffect(() => {
    const refresh = () => {
      setThreads(getWhatsAppThreads());
    };
    window.addEventListener("kisan_whatsapp_updated", refresh);
    const interval = setInterval(refresh, 2500);
    return () => {
      window.removeEventListener("kisan_whatsapp_updated", refresh);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePing = () => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult(t.pingSuccess);
    }, 550);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      const newLog = {
        id: "bc-" + Date.now(),
        category: broadcastCategory,
        badge: broadcastCategory === "weather" ? "⛅ Weather Alert" : (broadcastCategory === "mandi" ? "💰 Mandi Alert" : (broadcastCategory === "scheme" ? "🏛️ PM-Kisan DBT" : "🐛 Pest Outbreak")),
        text: broadcastMsg.trim(),
        audience: broadcastAudience === "all" ? (lang === 'HI' ? "सभी किसान (18,450)" : "All Farmers (18,450)") : (lang === 'HI' ? "लक्षित किसान समूह" : "Targeted Farmers"),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "Delivered ✓✓"
      };
      setBroadcastLogs(prev => [newLog, ...prev]);
      setTimeout(() => setBroadcastSuccess(false), 4500);
    }, 1100);
  };

  // Filtered threads list
  const filteredThreads = threads.filter(th => {
    if (inboxFilter === "pending" && th.status !== "needs_admin_reply") return false;
    if (inboxFilter === "resolved" && th.status === "needs_admin_reply") return false;
    if (inboxSearch.trim()) {
      const q = inboxSearch.toLowerCase();
      const matchId = (th.kisanId || "").toLowerCase().includes(q);
      const matchName = (th.farmerName || "").toLowerCase().includes(q);
      const matchLoc = (th.location || "").toLowerCase().includes(q);
      const matchCrop = (th.crop || "").toLowerCase().includes(q);
      if (!matchId && !matchName && !matchLoc && !matchCrop) return false;
    }
    return true;
  });

  const activeThread = threads.find(t => t.kisanId === selectedKisanId) || filteredThreads[0] || threads[0] || null;

  const pendingCount = threads.filter(t => t.status === "needs_admin_reply").length;
  const resolvedCount = threads.length - pendingCount;

  // Fast 1-click solutions for officers
  const FAST_PRESETS = [
    {
      label: lang === 'HI' ? "✅ PFMS 104 बैंक समाधान" : "✅ PFMS 104 Bank Solved",
      text: lang === 'HI'
        ? "किसान भाई, कृषि पोर्टल पर आपके बैंक खाते का PFMS 104 आधार NPCI लिंक पुनः सत्यापित कर दिया गया है। आगामी 48 घंटे में रु 2,000 की किस्त खाते में जमा हो जाएगी।"
        : "Dear Farmer, your PFMS 104 Aadhaar-NPCI bank mapping has been re-verified on the portal. The ₹2,000 installment will be credited within 48 hours."
    },
    {
      label: lang === 'HI' ? "🚜 कांदा चाळ 50% सब्सिडी" : "🚜 Onion Storage Subsidy",
      text: lang === 'HI'
        ? "कांदा चाळ (Onion Storage) 50% अनुदान हेतु आपका टोकन स्वीकृत कर दिया गया है। किसान पोर्टल से टोकन पर्ची डाउनलोड कर 7 दिन में निर्माण शुरू करें।"
        : "Your 50% subsidy token for Onion Storage structure has been approved. Download your token slip from the portal to proceed."
    },
    {
      label: lang === 'HI' ? "🌾 पीला रतुआ दवा अनुदान" : "🌾 Yellow Rust Spray Advice",
      text: lang === 'HI'
        ? "आपके खेत के पत्ते की जांच में पीला रतुआ की पुष्टि हुई है। ब्लॉक कृषि रक्षा इकाई से 50% अनुदान पर प्रोपिकोनाजोल दवा प्राप्त करें।"
        : "Yellow Rust symptoms confirmed on your wheat crop. Please collect subsidized Propiconazole fungicide from your block agriculture office."
    },
    {
      label: lang === 'HI' ? "☀️ पीएम कुसुम सोलर पंप" : "☀️ PM-KUSUM Solar Pump",
      text: lang === 'HI'
        ? "पीएम कुसुम 3 HP सोलर पंप लॉटरी सूची में आपका नाम चयनित हुआ है। कृपया 3 दिन में भूलेख खतौनी और बैंक पासबुक कार्यालय में जमा करवाएं।"
        : "You have been selected in the PM-KUSUM 3 HP Solar Pump lottery. Please submit your land records at the district nodal office within 3 days."
    }
  ];

  // Send official reply to farmer
  const handleSendOfficerReply = (e) => {
    if (e) e.preventDefault();
    if (!officerReplyText.trim() || !activeThread) return;

    setIsSendingReply(true);
    setTimeout(() => {
      sendAdminWhatsAppReply({
        kisanId: activeThread.kisanId,
        replyText: officerReplyText.trim(),
        officerName
      });
      setThreads(getWhatsAppThreads());
      setOfficerReplyText("");
      setIsSendingReply(false);
      setReplyToast(
        lang === 'HI'
          ? `✅ आधिकारिक समाधान सफलतापूर्वक किसान [${activeThread.farmerName} · ${activeThread.kisanId}] को भेजा गया!`
          : `✅ Official reply successfully delivered to Farmer [${activeThread.farmerName} · ${activeThread.kisanId}] on WhatsApp!`
      );
      setTimeout(() => setReplyToast(null), 4500);
    }, 400);
  };

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  return (
    <div className="animate-fadeIn">
      {/* Reply Sent Notification Toast */}
      {replyToast && (
        <div className="mb-3 p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 shadow-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span>{replyToast}</span>
          </div>
          <button 
            onClick={() => setReplyToast(null)} 
            className="text-emerald-300/60 hover:text-emerald-300 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CLEAN, PURE WHATSAPP WEB MESSENGER (CONTACTS & CHAT)
          ═══════════════════════════════════════════════════════════ */}
      <div 
        className="rounded-3xl border border-[#222d34] overflow-hidden flex flex-col md:flex-row h-[740px] bg-[#111b21] shadow-2xl relative"
      >
        {/* ── LEFT COLUMN: WHATSAPP CONTACTS DIRECTORY ── */}
        <div className="w-full md:w-[380px] lg:w-[410px] shrink-0 border-r border-[#222d34] flex flex-col bg-[#111b21]">
          
          {/* Top WhatsApp Header */}
          <div className="bg-[#202c33] p-3 border-b border-[#222d34] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-lg text-white font-bold shadow">
                  👨‍💼
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#202c33] absolute bottom-0 right-0" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {lang === 'HI' ? "किसान सहायता एडमिन" : "Kisan Sahayak Admin"}
                </h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>{lang === 'HI' ? "ऑनलाइन" : "Online"}</span>
                </span>
              </div>
            </div>

            {/* Quick Actions in WhatsApp Top Bar */}
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <button 
                onClick={() => setShowBroadcastModal(true)}
                title="किसान एडवाइजरी ब्रॉडकास्ट (Broadcast Message)" 
                className="p-2 hover:bg-[#374248] rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 bg-white/5 font-semibold text-[11px]"
              >
                <span>📢</span>
                <span className="hidden sm:inline">ब्रॉडकास्ट</span>
              </button>
              <button 
                onClick={onOpenMobileBot}
                title="किसान मोबाइल दृश्य (Open Mobile View)" 
                className="p-2 hover:bg-[#374248] rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer bg-white/5 font-semibold text-[11px] flex items-center gap-1"
              >
                <span>📱</span>
                <span className="hidden sm:inline">मोबाइल</span>
              </button>
              <button 
                id="admin-whatsapp-meta-api-btn"
                onClick={() => setShowMetaConfigModal(true)}
                title={lang === 'HI' ? "Meta WhatsApp API सेटअप (API Credentials)" : "Meta WhatsApp API Setup"} 
                className="p-2 hover:bg-[#374248] rounded-xl text-emerald-400 hover:text-white transition-all cursor-pointer bg-emerald-500/10 border border-emerald-500/30 font-semibold text-[11px] flex items-center gap-1"
              >
                <span>⚙️</span>
                <span className="hidden sm:inline">Meta API</span>
                {metaConfig.mode === "live_meta_api" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
              <button 
                onClick={() => {
                  const resetList = resetWhatsAppThreads();
                  setThreads(resetList);
                  setSelectedKisanId("KS-UP-1042");
                }}
                title="डिफ़ॉल्ट संपर्क लोड करें (Reset Contacts)" 
                className="p-2 hover:bg-[#374248] rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                🔄
              </button>
            </div>
          </div>

          {/* WhatsApp Search Bar */}
          <div className="p-2.5 bg-[#111b21]">
            <div className="relative flex items-center bg-[#202c33] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00a884] transition-all">
              <span className="text-slate-400 text-xs mr-2">🔍</span>
              <input
                type="text"
                value={inboxSearch}
                onChange={(e) => setInboxSearch(e.target.value)}
                placeholder={lang === 'HI' ? "नाम, नंबर या किसान ID से खोजें..." : "Search or start new chat..."}
                className="w-full text-xs text-white placeholder-slate-400 bg-transparent outline-none"
              />
              {inboxSearch && (
                <button onClick={() => setInboxSearch("")} className="text-slate-400 hover:text-white text-xs cursor-pointer ml-1">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* WhatsApp Filter Tabs */}
          <div className="px-3 pb-2 flex items-center gap-1.5 bg-[#111b21] border-b border-[#222d34] overflow-x-auto text-[11px]">
            <button
              onClick={() => setInboxFilter("all")}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                inboxFilter === "all" ? "bg-[#00a884] text-slate-950 font-black" : "bg-[#202c33] text-slate-300 hover:bg-[#2a3942]"
              }`}
            >
              {lang === 'HI' ? "सभी चैट्स" : "All"} ({threads.length})
            </button>
            <button
              onClick={() => setInboxFilter("pending")}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 ${
                inboxFilter === "pending" ? "bg-amber-400 text-slate-950 font-black" : "bg-[#202c33] text-amber-300 hover:bg-[#2a3942]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>{lang === 'HI' ? "उत्तर आवश्यक" : "Needs Reply"} ({pendingCount})</span>
            </button>
            <button
              onClick={() => setInboxFilter("resolved")}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                inboxFilter === "resolved" ? "bg-emerald-400 text-slate-950 font-black" : "bg-[#202c33] text-emerald-300 hover:bg-[#2a3942]"
              }`}
            >
              {lang === 'HI' ? "हल किया" : "Replied"} ({resolvedCount})
            </button>
          </div>

          {/* All Contacts List (Just like WhatsApp contacts) */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/40">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <p className="text-3xl mb-1">📭</p>
                <p>{lang === 'HI' ? "कोई संपर्क / चैट नहीं मिली" : "No contacts found"}</p>
              </div>
            ) : (
              filteredThreads.map((th) => {
                const isSelected = activeThread && activeThread.kisanId === th.kisanId;
                const isPending = th.status === "needs_admin_reply";
                const lastMsg = th.messages && th.messages[th.messages.length - 1];

                return (
                  <div
                    key={th.kisanId}
                    data-kisan-id={th.kisanId}
                    id={`wa-farmer-contact-${th.kisanId}`}
                    onClick={() => {
                      setSelectedKisanId(th.kisanId);
                      setOfficerReplyText("");
                    }}
                    className={`p-3 cursor-pointer transition-all flex items-start gap-3 border-l-4 select-none ${
                      isSelected
                        ? "bg-[#2a3942] border-[#00a884]"
                        : isPending
                        ? "bg-[#182229]/60 hover:bg-[#202c33] border-amber-500"
                        : "hover:bg-[#202c33]/50 border-transparent"
                    }`}
                  >
                    {/* Farmer Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#1b3229] border border-emerald-500/30 flex items-center justify-center text-xl text-white shadow-inner">
                        👨‍🌾
                      </div>
                      {isPending ? (
                        <span className="w-3 h-3 rounded-full bg-amber-400 border-2 border-[#111b21] absolute bottom-0 right-0 animate-pulse" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111b21] absolute bottom-0 right-0" />
                      )}
                    </div>

                    {/* Contact Info & Message Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-white text-xs truncate">
                          {th.farmerName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                          {lastMsg?.time || "Active"}
                        </span>
                      </div>

                      {/* Contact details: Kisan ID & Phone/Location */}
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap text-[10px]">
                        <span className="font-mono font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                          {th.kisanId}
                        </span>
                        <span className="text-slate-400 truncate">
                          {th.contact} · {th.location}
                        </span>
                      </div>

                      {/* Last Message Snippet */}
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[11px] text-slate-300 truncate leading-tight">
                          {lastMsg?.sender === "officer" ? (
                            <span className="text-emerald-400 font-bold">✓✓ अधिकारी: </span>
                          ) : lastMsg?.sender === "user" ? (
                            <span className="text-slate-400">👤 किसान: </span>
                          ) : (
                            <span className="text-cyan-400">🤖 Bot: </span>
                          )}
                          <span>{lastMsg?.text || "—"}</span>
                        </p>

                        {/* Pending notification badge */}
                        {isPending ? (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center animate-bounce shadow">
                            1
                          </span>
                        ) : th.status === "admin_replied" ? (
                          <span className="shrink-0 text-emerald-400 font-bold text-[11px]">
                            ✓✓
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: ACTIVE WHATSAPP CHAT WINDOW ── */}
        <div className="flex-1 flex flex-col bg-[#0b141a] relative">
          {activeThread ? (<>
            {/* WhatsApp Top Contact Header */}
            <div className="bg-[#202c33] p-3 border-b border-[#222d34] flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800/80 border border-emerald-400/40 flex items-center justify-center text-xl text-white shadow">
                  🌾
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">
                      {activeThread.farmerName}
                    </h3>
                    <span className="font-mono text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                      {activeThread.kisanId}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>📞 {activeThread.contact}</span>
                    <span>·</span>
                    <span>📍 {activeThread.location}</span>
                    <span>·</span>
                    <span>🌾 {activeThread.crop}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">online</span>
                  </p>
                </div>
              </div>

              {/* Status Badge & Action Icons */}
              <div className="flex items-center gap-3">
                {activeThread.status === "needs_admin_reply" ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/25 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{lang === 'HI' ? "अधिकारी उत्तर आवश्यक" : "Reply Needed"}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span>✓✓</span>
                    <span>{lang === 'HI' ? "समाधान भेजा गया" : "Answered"}</span>
                  </span>
                )}

                <div className="hidden sm:flex items-center gap-1 text-slate-400 text-sm pl-2 border-l border-white/10">
                  <button title="Call Farmer" className="p-1.5 hover:bg-[#374248] rounded-full hover:text-white transition-all cursor-pointer">📞</button>
                  <button title="Video Consultation" className="p-1.5 hover:bg-[#374248] rounded-full hover:text-white transition-all cursor-pointer">🎥</button>
                  <button title="Search in Chat" className="p-1.5 hover:bg-[#374248] rounded-full hover:text-white transition-all cursor-pointer">🔍</button>
                </div>
              </div>
            </div>

            {/* WhatsApp Chat Messages Viewport (with Doodle Wallpaper) */}
            <div 
              className="flex-1 p-4 overflow-y-auto space-y-3"
              style={{
                backgroundImage: "radial-gradient(#1f2c34 1.2px, transparent 1.2px)",
                backgroundSize: "20px 20px",
                backgroundColor: "#0b141a"
              }}
            >
              {/* Date separator */}
              <div className="text-center my-1">
                <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#182229] text-slate-400 shadow-sm border border-white/5">
                  {lang === 'HI' ? "आज · Live Chat Session" : "Today · Live Chat"}
                </span>
              </div>

              {/* Notice if unhandled by bot */}
              {activeThread.status === "needs_admin_reply" && (
                <div className="max-w-md mx-auto my-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs flex items-center justify-between gap-2 shadow">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <span className="font-semibold text-[11px]">
                      {t.pendingOfficerAlert}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/25 px-2 py-0.5 rounded text-amber-200 shrink-0">
                    Action Needed
                  </span>
                </div>
              )}

              {/* Message bubbles */}
              {activeThread.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" 
                      ? "items-start" 
                      : msg.sender === "officer" 
                      ? "items-end" 
                      : "items-center"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed shadow-md relative ${
                      msg.sender === "user"
                        ? "bg-[#202c33] text-slate-100 rounded-tl-none border border-white/5"
                        : msg.sender === "officer"
                        ? "bg-[#005c4b] text-white rounded-tr-none border border-emerald-400/40 shadow-lg shadow-emerald-950/60"
                        : "bg-[#182229] text-slate-200 border border-white/5"
                    }`}
                  >
                    {/* Sender Header */}
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 gap-3">
                      <span className="font-black text-[10px] flex items-center gap-1">
                        {msg.sender === "user" ? (
                          <>
                            <span>👤</span>
                            <span>{activeThread.farmerName}</span>
                            <span className="text-amber-300 font-mono">({activeThread.kisanId})</span>
                          </>
                        ) : msg.sender === "officer" ? (
                          <>
                            <span>💬</span>
                            <span className="text-emerald-200 font-bold">{msg.officerName || officerName}</span>
                          </>
                        ) : (
                          <>
                            <span>🤖 Snapdragon AI Bot</span>
                          </>
                        )}
                      </span>
                      <span className="text-[9px] text-white/50">{msg.time}</span>
                    </div>

                    {/* Photo Attachment */}
                    {msg.attachment && msg.attachment.type === "image" && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/15 bg-black/40">
                        <img 
                          src={msg.attachment.url} 
                          alt="Crop preview" 
                          className="w-full max-h-48 object-cover rounded-t-xl" 
                        />
                        <div className="p-2 bg-black/70 text-[10px] font-bold text-amber-300 flex items-center justify-between">
                          <span>📷 {msg.attachment.disease || msg.attachment.name}</span>
                          <span className="text-emerald-400 font-mono">{msg.attachment.confidence || "Analyzed"}</span>
                        </div>
                      </div>
                    )}

                    {/* Video Attachment */}
                    {msg.attachment && msg.attachment.type === "video" && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/15 bg-black">
                        <video 
                          src={msg.attachment.url} 
                          controls 
                          className="w-full max-h-48 object-contain rounded-t-xl" 
                        />
                        <div className="p-2 bg-black/70 text-[10px] font-bold text-amber-300 flex items-center justify-between">
                          <span>🎥 {msg.attachment.name || "Crop Video"}</span>
                          <span className="text-emerald-400 font-mono">Processed</span>
                        </div>
                      </div>
                    )}

                    {/* Message Text */}
                    <div className="whitespace-pre-line text-slate-100 text-xs">
                      {msg.text}
                    </div>

                    {/* Verified Badge and Double Blue Checks for Officer */}
                    {msg.sender === "officer" && (
                      <div className="mt-2 pt-1 border-t border-emerald-400/30 flex items-center justify-between text-[9px] text-emerald-200">
                        <span className="flex items-center gap-1">
                          <span>✓</span>
                          <span>{lang === 'HI' ? "समाधान भेजा गया" : "Resolution Sent"}</span>
                        </span>
                        <span className="text-emerald-300 font-bold font-mono flex items-center gap-0.5">
                          <span>{lang === 'HI' ? "डिलीवर हुआ" : "Delivered"}</span>
                          <span className="text-cyan-300 text-xs">✓✓</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ⚡ 1-Click Fast Solutions Bar */}
            <div className="bg-[#182229] px-3 py-1.5 border-t border-[#222d34] flex items-center gap-2 overflow-x-auto text-[10px]">
              <span className="text-slate-400 font-bold shrink-0">⚡ 1-Click:</span>
              {FAST_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setOfficerReplyText(p.text)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-[#202c33] hover:bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer font-semibold"
                  title={p.text}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* ── REAL WHATSAPP INPUT BAR ── */}
            <form 
              onSubmit={handleSendOfficerReply} 
              className="bg-[#202c33] p-2.5 sm:p-3 border-t border-[#222d34] flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setOfficerReplyText(prev => prev + " 🌾 ")}
                className="p-2 text-slate-400 hover:text-white text-lg rounded-full hover:bg-[#374248] transition-all cursor-pointer"
                title="Emoji"
              >
                😊
              </button>

              <button
                type="button"
                onClick={() => {
                  setOfficerReplyText(prev => prev + " [📎 स्वीकृति पत्र / टोकन रसीद संलग्न]");
                }}
                className="p-2 text-slate-400 hover:text-white text-lg rounded-full hover:bg-[#374248] transition-all cursor-pointer"
                title="Attach Document"
              >
                📎
              </button>

              <div className="flex-1 relative">
                <input
                  id="admin-whatsapp-reply-input"
                  type="text"
                  value={officerReplyText}
                  onChange={(e) => setOfficerReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendOfficerReply();
                    }
                  }}
                  placeholder={
                    lang === 'HI' 
                      ? `${activeThread.farmerName} को संदेश लिखें... (Enter दबाकर भेजें)` 
                      : `Type reply to ${activeThread.farmerName}... (Press Enter to send)`
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#2a3942] text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-[#00a884] transition-all"
                />
              </div>

              <button
                id="admin-whatsapp-send-btn"
                type="submit"
                disabled={isSendingReply || !officerReplyText.trim()}
                className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#029070] disabled:opacity-40 text-slate-950 flex items-center justify-center font-bold text-base shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                title="भेजें (Enter दबाएं)"
              >
                {isSendingReply ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>➤</span>
                )}
              </button>
            </form>

          </>) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <span className="text-5xl mb-3">💬</span>
              <h4 className="text-base font-bold text-white mb-1">
                {lang === 'HI' ? "किसान संपर्क चुनें" : "Select a Farmer Contact"}
              </h4>
              <p className="text-xs max-w-sm">
                {lang === 'HI'
                  ? "बाईं सूची में से किसी भी किसान संपर्क पर क्लिक करें और सीधे WhatsApp की तरह बातचीत और समाधान दें।"
                  : "Click any farmer from the left contact directory to open their chat and reply directly."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── BROADCAST ADVISORY MODAL (POPUP ON CLICK OF 📢 ब्रॉडकास्ट) ── */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div 
            style={{ background: "#111b21", border: "1px solid rgba(255,255,255,0.1)" }}
            className="rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">📢</span>
                <h3 className="text-base font-bold text-white">{t.broadcastCardTitle}</h3>
              </div>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              handleSendBroadcast(e);
              setTimeout(() => setShowBroadcastModal(false), 1800);
            }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    {t.audienceLabel}
                  </label>
                  <select
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#202c33] text-white border border-white/10 outline-none focus:border-emerald-500"
                  >
                    <option value="all">{t.audienceAll}</option>
                    <option value="up">{t.audienceUP}</option>
                    <option value="wheat">{t.audienceWheat}</option>
                    <option value="paddy">{t.audiencePaddy}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    {t.categoryLabel}
                  </label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => {
                      setBroadcastCategory(e.target.value);
                      if (e.target.value === "weather") {
                        setBroadcastMsg(lang === 'HI' ? "⛅ कृषि मौसम चेतावनी: अगले 48 घंटों में बारिश व तेज हवाओं की संभावना है। तैयार सरसों व गेहूं की फसल को ढकें।" : "⛅ Weather Advisory: Rain and gusty winds expected. Please shelter crops.");
                      } else if (e.target.value === "mandi") {
                        setBroadcastMsg(lang === 'HI' ? "💰 आज का ताजा मंडी भाव: गेहूं ₹2,580/क्विंटल, धान ₹4,200/क्विंटल, सरसों ₹5,880/क्विंटल।" : "💰 Mandi Bulletin: Wheat ₹2,580/qtl, Paddy ₹4,200/qtl.");
                      } else {
                        setBroadcastMsg(lang === 'HI' ? "🏛️ पीएम किसान योजना 19वीं किस्त जारी! अपने खाते में ₹2,000 चेक करें।" : "🏛️ PM-Kisan 19th installment credited.");
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#202c33] text-white border border-white/10 outline-none focus:border-emerald-500"
                  >
                    <option value="weather">{t.catWeather}</option>
                    <option value="mandi">{t.catMandi}</option>
                    <option value="scheme">{t.catScheme}</option>
                    <option value="pest">{t.catPest}</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder={t.msgPlaceholder}
                  className="w-full p-3 rounded-xl text-xs sm:text-sm text-white bg-[#0b141a] border border-white/10 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-white/40">
                  📱 Broadcast via Meta WhatsApp Business API
                </span>

                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-950/60 cursor-pointer flex items-center gap-2"
                >
                  {isBroadcasting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.sending}</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>{t.sendBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {broadcastSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 animate-fadeIn flex items-center gap-2">
                  <span>✅</span>
                  <span>{t.sentSuccess}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Meta WhatsApp Cloud API Setup Modal */}
      <MetaApiConfigModal 
        isOpen={showMetaConfigModal} 
        onClose={() => setShowMetaConfigModal(false)} 
        lang={lang} 
      />

    </div>
  );
}


// ── MAIN ADMIN PANEL COMPONENT ──
export default function AdminPanel({ onClose }) {
  const [authed, setAuthed]             = useState(false);
  const [tab, setTab]                   = useState("applications");
  const [history, setHistory]           = useState([]);
  const [applications, setApplications] = useState([]);
  const [kisanSearch, setKisanSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp]   = useState(null);
  const [showWaModal, setShowWaModal]   = useState(false);
  const [showSystemMetaModal, setShowSystemMetaModal] = useState(false);
  
  // Translator State (HI or EN)
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_LANG_KEY) || "HI";
    } catch {
      return "HI";
    }
  });

  const toggleLang = () => {
    const next = lang === "HI" ? "EN" : "HI";
    setLang(next);
    try {
      localStorage.setItem(ADMIN_LANG_KEY, next);
    } catch {}
  };

  useEffect(() => {
    setHistory(getHistory());
    setApplications(getApplications());

    const refresh = () => {
      setHistory(getHistory());
      setApplications(getApplications());
    };

    const id = setInterval(refresh, 4000);
    window.addEventListener("kisan_scheme_applied", refresh);
    window.addEventListener("kisan_user_updated", refresh);

    return () => {
      clearInterval(id);
      window.removeEventListener("kisan_scheme_applied", refresh);
      window.removeEventListener("kisan_user_updated", refresh);
    };
  }, []);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} lang={lang} onToggleLang={toggleLang} />;

  const t = ADMIN_I18N[lang] || ADMIN_I18N.HI;

  // Overview metrics
  const totalQueries   = history.length;
  const voiceQ         = history.filter(h => h.type === "voice").length;
  const visionQ        = history.filter(h => h.type === "vision").length;
  const totalApps      = applications.length;
  const approvedApps   = applications.filter(a => a.status === "approved").length;
  const inReviewApps   = applications.filter(a => a.status === "in_review" || a.status === "registered_and_approved").length;
  const user           = getUser();
  const recentQueries  = [...history].reverse();

  // Instant Kisan ID & Application search filter
  const filteredApps = applications.filter(app => {
    const q = kisanSearch.trim().toLowerCase();
    const matchQuery = !q || (
      (app.kisanId && app.kisanId.toLowerCase().includes(q)) ||
      (app.farmerName && app.farmerName.toLowerCase().includes(q)) ||
      (app.contact && app.contact.toLowerCase().includes(q)) ||
      (app.applicationId && app.applicationId.toLowerCase().includes(q)) ||
      (app.schemeTitle && app.schemeTitle.toLowerCase().includes(q)) ||
      (app.schemeTitleEN && app.schemeTitleEN.toLowerCase().includes(q)) ||
      (app.location && app.location.toLowerCase().includes(q))
    );

    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Check if exactly 1 farmer's Kisan ID matched to show their profile spotlight
  const matchedFarmer = (() => {
    const q = kisanSearch.trim().toLowerCase();
    if (!q) return null;
    const match = applications.find(a => 
      (a.kisanId && a.kisanId.toLowerCase().includes(q)) ||
      (a.contact && a.contact.replace(/\s+/g,'').includes(q.replace(/\s+/g,'')))
    );
    if (!match) return null;
    return {
      kisanId: match.kisanId,
      name: match.farmerName,
      contact: match.contact,
      location: match.location,
      land: match.land,
      crop: match.crop,
      totalApps: applications.filter(a => a.kisanId === match.kisanId).length,
      khasraNo: match.khasraNo,
    };
  })();

  const updateAppStatus = (appId, newStatus) => {
    const updated = applications.map(a => {
      if (a.applicationId === appId) {
        const isAppr = newStatus === "approved";
        return {
          ...a,
          status: newStatus,
          statusTextHI: isAppr ? "🟢 DBT किस्त स्वीकृत · बैंक खाते में अंतरित" : "🟡 बीमा कंपनी/विभाग सत्यापन प्रक्रियाधीन",
          statusTextEN: isAppr ? "🟢 DBT Approved" : "🟡 Verification in Progress",
        };
      }
      return a;
    });
    setApplications(updated);
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
    } catch {}
    if (selectedApp && selectedApp.applicationId === appId) {
      setSelectedApp(updated.find(a => a.applicationId === appId));
    }
  };

  const deleteApp = (appId) => {
    if (window.confirm(lang === 'HI' ? "क्या आप वाकई यह आवेदन हटाना चाहते हैं?" : "Are you sure you want to delete this application?")) {
      const filtered = applications.filter(a => a.applicationId !== appId);
      setApplications(filtered);
      try {
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(filtered));
      } catch {}
      if (selectedApp && selectedApp.applicationId === appId) setSelectedApp(null);
    }
  };

  const resetApplicationsDemo = () => {
    if (window.confirm(lang === 'HI' ? "डिफ़ॉल्ट सरकारी योजना आवेदन लोड करें?" : "Load default government scheme applications?")) {
      setApplications(DEFAULT_APPLICATIONS);
      try {
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
      } catch {}
    }
  };

  const exportApplicationsJson = () => {
    const blob = new Blob([JSON.stringify(applications, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kisan_scheme_applications_" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
  };

  const clearLogs = () => { try { localStorage.removeItem(STORAGE_KEY); setHistory([]); } catch {} };
  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); 
    a.href = URL.createObjectURL(blob);
    a.download = "kisan_queries_" + new Date().toISOString().slice(0,10) + ".json"; 
    a.click();
  };

  const TABS = [
    { id: "applications", label: t.tabs.applications, sub: t.tabs.applicationsSub, emoji: "📋" },
    { id: "dashboard",    label: t.tabs.dashboard,    sub: t.tabs.dashboardSub,    emoji: "📊" },
    { id: "whatsapp",     label: t.tabs.whatsapp,     sub: t.tabs.whatsappSub,     emoji: "💬" },
    { id: "queries",      label: t.tabs.queries,      sub: t.tabs.queriesSub,      emoji: "🗂️" },
    { id: "intents",      label: t.tabs.intents,      sub: t.tabs.intentsSub,      emoji: "🧠" },
    { id: "system",       label: t.tabs.system,       sub: t.tabs.systemSub,       emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: "#0a0f1e", fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3"
        style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>🌾</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white leading-none">Kisan Sahayak AI</h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {t.adminBadge}
              </span>
            </div>
            <p className="text-[10px] text-amber-400 font-bold tracking-wider mt-0.5">
              {t.portalName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* 💬 WHATSAPP BOT LAUNCHER BUTTON */}
          <button 
            onClick={() => setShowWaModal(true)}
            title={lang === 'HI' ? "व्हाट्सएप बॉट खोलें" : "Open WhatsApp Bot"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 cursor-pointer transition-all shadow-xs">
            <span>💬</span>
            <span>WhatsApp Bot</span>
          </button>

          {/* 🌐 LIVE LANGUAGE TRANSLATOR BUTTON */}
          <button 
            onClick={toggleLang}
            title={t.langTooltip}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 cursor-pointer transition-all shadow-xs">
            <span>🌐</span>
            <span>{lang === 'HI' ? 'English (EN)' : 'हिन्दी (HI)'}</span>
          </button>

          <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400"
            style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {totalApps} {t.appsLabel} · {totalQueries} {t.queriesLabel}
          </span>

          <button 
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/10">
            {t.close}
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-61px)]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-1.5 py-4 px-2 sm:px-3 sm:w-60 flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          {TABS.map(tabItem => (
            <button key={tabItem.id} onClick={() => setTab(tabItem.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer w-full"
              style={tab === tabItem.id
                ? { background: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.35)", color: "#fff", fontWeight: 700 }
                : { color: "rgba(255,255,255,0.55)", border: "1px solid transparent" }}>
              <span className="text-xl flex-shrink-0">{tabItem.emoji}</span>
              <div className="hidden sm:block min-w-0">
                <p className="text-xs truncate">{tabItem.label}</p>
                <p className="text-[10px] text-white/35 font-normal truncate">{tabItem.sub}</p>
              </div>
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-white/10 hidden sm:block px-2">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40">
              <p className="text-amber-400 font-bold mb-1">
                {lang === 'HI' ? '💡 भाषा व सर्च टिप:' : '💡 Language & Search Tip:'}
              </p>
              <span>
                {lang === 'HI' ? 'ऊपर 🌐 बटन से भाषा कभी भी हिन्दी या English में बदलें।' : 'Use the top 🌐 button anytime to switch between English & Hindi.'}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto space-y-6">

          {/* ═══════════════════════════════════════════════════════════
              TAB 1: SCHEME APPLICATIONS & INSTANT KISAN ID SEARCH
              ═══════════════════════════════════════════════════════════ */}
          {tab === "applications" && (<>
            {/* Top Bar with Title & Export Actions */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>📋</span> {t.appsTab.title}
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  {t.appsTab.sub}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetApplicationsDemo}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-amber-400 cursor-pointer hover:bg-amber-500/10 transition-all border border-amber-500/25">
                  {t.appsTab.resetDemo}
                </button>
                <button 
                  onClick={exportApplicationsJson}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-blue-400 cursor-pointer hover:bg-blue-500/10 transition-all border border-blue-500/25">
                  {t.appsTab.exportJson}
                </button>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard 
                emoji="📑" 
                value={totalApps} 
                label={t.appsTab.totalApps} 
                sub={approvedApps + " " + t.appsTab.statusApproved} 
                color="#fbbf24" 
                onClick={() => { setStatusFilter("all"); setKisanSearch(""); }}
              />
              <StatCard 
                emoji="🟢" 
                value={approvedApps} 
                label={t.appsTab.approvedApps} 
                sub="Active & Credited" 
                color="#34d399" 
                onClick={() => setStatusFilter("approved")}
              />
              <StatCard 
                emoji="🟡" 
                value={inReviewApps} 
                label={t.appsTab.inReviewApps} 
                sub="In Verification" 
                color="#f59e0b" 
                onClick={() => setStatusFilter("in_review")}
              />
              <StatCard 
                emoji="🌾" 
                value={new Set(applications.map(a => a.kisanId)).size} 
                label={t.appsTab.uniqueFarmers} 
                sub="Unique Farmer IDs" 
                color="#a78bfa" 
              />
            </div>

            {/* ── FAST INSTANT KISAN ID SEARCH BOX ── */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
              className="rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span> {t.appsTab.instantSearchLabel}
                </label>
                {kisanSearch && (
                  <button 
                    onClick={() => setKisanSearch("")}
                    className="text-[11px] text-red-400 hover:text-red-300 font-bold cursor-pointer">
                    {t.appsTab.clearSearch}
                  </button>
                )}
              </div>

              <div className="relative">
                <input 
                  type="text"
                  value={kisanSearch}
                  onChange={e => setKisanSearch(e.target.value)}
                  placeholder={t.appsTab.searchPlaceholder}
                  className="w-full px-4 py-3.5 pl-11 rounded-xl text-sm text-white placeholder-white/35 outline-none font-medium transition-all"
                  style={{ 
                    background: "rgba(255,255,255,0.06)", 
                    border: kisanSearch ? "1px solid #f59e0b" : "1px solid rgba(255,255,255,0.14)" 
                  }}
                  autoFocus
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-amber-400">🔍</span>
              </div>

              {/* Quick One-Click Search Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                <span className="text-white/40 text-[11px]">{t.appsTab.quickKisan}</span>
                {[
                  { id: "KS-UP-1042", label: "KS-UP-1042 (Rameshwar Singh)" },
                  { id: "KS-MH-2081", label: "KS-MH-2081 (Sunita Tai)" },
                  { id: "KS-PB-3019", label: "KS-PB-3019 (Harpreet Singh)" },
                ].map(chip => (
                  <button 
                    key={chip.id}
                    onClick={() => setKisanSearch(chip.id)}
                    className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
                    style={{ 
                      background: kisanSearch.includes(chip.id) ? "#f59e0b" : "rgba(255,255,255,0.08)",
                      color: kisanSearch.includes(chip.id) ? "#000" : "#fbbf24",
                      border: "1px solid rgba(251,191,36,0.3)"
                    }}>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── MATCHED FARMER SPOTLIGHT CARD ── */}
            {matchedFarmer && (
              <div className="p-4 sm:p-5 rounded-2xl animate-fade-in"
                style={{ 
                  background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(16,185,129,0.1))",
                  border: "1px solid rgba(245,158,11,0.4)"
                }}>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                      👨‍🌾
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-white">{matchedFarmer.name}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {t.appsTab.verifiedFarmer}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                          {matchedFarmer.kisanId}
                        </span>
                        <span className="text-xs text-white/60">{matchedFarmer.contact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="text-white/40 text-[10px]">{t.appsTab.totalAppsCount}</p>
                      <p className="text-lg font-black text-amber-400">{matchedFarmer.totalApps}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-[10px]">{t.appsTab.landArea}</p>
                      <p className="text-sm font-bold text-white">{matchedFarmer.land || "4.2 Acres"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-[10px]">{t.appsTab.khasraNo}</p>
                      <p className="text-sm font-bold text-emerald-400 font-mono">{matchedFarmer.khasraNo || "142/8"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── APPLICATIONS LIST TABLE ── */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              className="rounded-2xl overflow-hidden shadow-xl">
              
              <div className="p-4 flex items-center justify-between border-b border-white/[0.08] flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    {t.appsTab.resultsTitle} ({filteredApps.length})
                  </h3>
                  {statusFilter !== "all" && (
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Filter: {statusFilter}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button 
                    onClick={() => setStatusFilter("all")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${statusFilter === "all" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}>
                    {t.appsTab.filterAll}
                  </button>
                  <button 
                    onClick={() => setStatusFilter("approved")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${statusFilter === "approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-white/40 hover:text-white"}`}>
                    {t.appsTab.filterApproved}
                  </button>
                  <button 
                    onClick={() => setStatusFilter("in_review")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${statusFilter === "in_review" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-white/40 hover:text-white"}`}>
                    {t.appsTab.filterReview}
                  </button>
                </div>
              </div>

              {filteredApps.length === 0 ? (
                <div className="p-12 text-center text-white/40 space-y-3">
                  <p className="text-4xl">🔍</p>
                  <p className="text-sm font-semibold text-white/60">{t.appsTab.noResults}</p>
                  <p className="text-xs text-white/40">{t.appsTab.noResultsSub}</p>
                  <button 
                    onClick={() => { setKisanSearch(""); setStatusFilter("all"); }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer">
                    {t.appsTab.resetSearch}
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06] overflow-x-auto">
                  {filteredApps.map((app, idx) => (
                    <div 
                      key={app.applicationId || idx}
                      className="p-4 hover:bg-white/[0.04] transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      
                      {/* Column 1: Farmer & ID */}
                      <div className="flex items-start gap-3 min-w-[240px]">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{app.farmerName}</span>
                            <span 
                              onClick={() => setKisanSearch(app.kisanId)}
                              title="Click to search this Kisan ID"
                              className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 transition-all">
                              {app.kisanId}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">{app.contact} · {app.location}</p>
                          <p className="text-[10px] font-mono text-white/35 mt-0.5">{app.applicationId}</p>
                        </div>
                      </div>

                      {/* Column 2: Scheme & Benefit */}
                      <div className="min-w-[200px] flex-1">
                        <p className="text-xs font-bold text-white/90 leading-tight">
                          {lang === 'EN' && app.schemeTitleEN ? app.schemeTitleEN : app.schemeTitle}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-400 mt-0.5">
                          {(lang === 'EN' && app.benefitBadgeEN ? app.benefitBadgeEN : app.benefitBadge) || "DBT Govt Benefit"}
                        </p>
                        <p className="text-[10px] text-white/40 mt-0.5">
                          {t.appsTab.landArea}: <span className="text-white/70 font-semibold">{app.land || "4.0 Acres"}</span> · {t.appsTab.khasraNo}: <span className="text-amber-300 font-mono">{app.khasraNo || "142/8"}</span>
                        </p>
                      </div>

                      {/* Column 3: Status Badge */}
                      <div className="min-w-[170px]">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${app.status === "approved" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"}`}>
                          <span>{app.status === "approved" ? "🟢" : "🟡"}</span>
                          <span>{app.status === "approved" ? t.appsTab.statusApproved : t.appsTab.statusReview}</span>
                        </span>
                        <p className="text-[10px] text-white/40 mt-1">{app.submittedAt}</p>
                      </div>

                      {/* Column 4: Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 cursor-pointer transition-all flex items-center gap-1.5">
                          <span>📋</span>
                          <span>{t.appsTab.viewDossier}</span>
                        </button>
                        
                        <button 
                          onClick={() => updateAppStatus(app.applicationId, app.status === "approved" ? "in_review" : "approved")}
                          title={app.status === "approved" ? "Revert to Hold" : "Approve application"}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all">
                          {app.status === "approved" ? "⏸️" : "✅"}
                        </button>

                        <button 
                          onClick={() => deleteApp(app.applicationId)}
                          title="Delete application"
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs bg-red-500/10 hover:bg-red-500/25 text-red-400 cursor-pointer transition-all">
                          🗑️
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </>)}

          {/* ═══════════════════════════════════════════════════════════
              TAB 2: DASHBOARD OVERVIEW
              ═══════════════════════════════════════════════════════════ */}
          {tab === "dashboard" && (<>
            <div>
              <h2 className="text-xl font-black text-white">{t.dashboard.title}</h2>
              <p className="text-xs text-white/40 mt-0.5">{t.dashboard.sub}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard emoji="📋" value={totalApps}       label={t.appsTab.totalApps}     sub={approvedApps + " " + t.appsTab.statusApproved} color="#fbbf24" onClick={() => setTab("applications")} />
              <StatCard emoji="💬" value={totalQueries}    label={lang === 'HI' ? "कुल प्रश्न" : "Total Queries"} sub="Voice & Vision"       color="#a78bfa" onClick={() => setTab("queries")} />
              <StatCard emoji="🎙️" value={voiceQ}         label={lang === 'HI' ? "वॉयस प्रश्न" : "Voice Queries"} sub={totalQueries?Math.round(voiceQ/totalQueries*100)+"%":"0%"} color="#38bdf8" />
              <StatCard emoji="👥" value={user?1:0}        label={lang === 'HI' ? "सक्रिय किसान सत्र" : "Active Sessions"} sub={user ? (user.name + " (" + (user.kisanId||"") + ")") : (lang === 'HI' ? "कोई सत्र नहीं" : "No active session")} color="#34d399" />
            </div>

            {/* Quick Link to Scheme Applications */}
            <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(255,255,255,0.03))", border: "1px solid rgba(245,158,11,0.3)" }}
              className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🏛️</span> {t.dashboard.schemeSectionTitle}
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  {totalApps} {t.dashboard.schemeSectionSub}
                </p>
              </div>
              <button 
                onClick={() => setTab("applications")}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer hover:opacity-90 transition-all flex items-center gap-1.5 flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                <span>{t.dashboard.openAppsBtn}</span>
              </button>
            </div>

            {/* Recent Scheme Applications on Dashboard */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              className="rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">{t.dashboard.recentAppsTitle}</h3>
                <button onClick={() => setTab("applications")} className="text-xs text-amber-400 font-bold hover:underline cursor-pointer">
                  {t.dashboard.viewAll} ({totalApps})
                </button>
              </div>

              <div className="space-y-2">
                {applications.slice(0, 3).map((app, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📄</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{app.farmerName}</span>
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{app.kisanId}</span>
                        </div>
                        <p className="text-[11px] text-white/50">
                          {lang === 'EN' && app.schemeTitleEN ? app.schemeTitleEN : app.schemeTitle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.status === "approved" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                        {app.status === "approved" ? t.appsTab.statusApproved : t.appsTab.statusReview}
                      </span>
                      <p className="text-[10px] text-white/30 mt-0.5">{app.submittedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Queries */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              className="rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-white mb-4">{t.dashboard.recentQueriesTitle}</h3>
              {recentQueries.length === 0
                ? <p className="text-xs text-white/30 text-center py-8">{t.dashboard.noQueries}</p>
                : <div className="space-y-2">
                    {recentQueries.slice(0, 5).map((q, i) => {
                      const m = INTENT_META[q.intent] || INTENT_META.unknown;
                      return (
                        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                          className="rounded-xl px-3 py-2.5 flex items-center gap-3">
                          <span className="text-lg flex-shrink-0">{q.type==="vision"?"📷":"🎙️"}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/80 font-medium truncate">{q.title||"—"}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: m.color }}>{m.emoji} {m.label}</p>
                          </div>
                          <span className="text-[10px] text-white/30 flex-shrink-0">{relTime(q.timestamp)}</span>
                        </div>
                      );
                    })}
                  </div>
              }
            </div>
          </>)}

          {/* ═══════════════════════════════════════════════════════════
              TAB: WHATSAPP BOT CONTROL & BROADCAST CONSOLE
              ═══════════════════════════════════════════════════════════ */}
          {tab === "whatsapp" && (
            <AdminWhatsAppConsole 
              lang={lang} 
              onOpenMobileBot={() => setShowWaModal(true)} 
            />
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 3: FULL QUERY LOG
              ═══════════════════════════════════════════════════════════ */}
          {tab === "queries" && (<>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-black text-white">{t.queriesTab.title}</h2>
                <p className="text-xs text-white/40 mt-0.5">{totalQueries} {t.queriesTab.sub}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={exportLogs}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-blue-400 cursor-pointer hover:bg-blue-500/10 transition-all border border-blue-500/25">
                  {t.queriesTab.exportJson}
                </button>
                <button onClick={clearLogs}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-400 cursor-pointer hover:bg-red-500/10 transition-all border border-red-500/25">
                  {t.queriesTab.clearAll}
                </button>
              </div>
            </div>

            {recentQueries.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                className="rounded-2xl p-12 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm text-white/40">{t.queriesTab.empty}</p>
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                className="rounded-2xl overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 text-[10px] font-bold text-white/40 uppercase tracking-wider"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="col-span-1">#</div>
                  <div className="col-span-1">{t.queriesTab.colMode}</div>
                  <div className="col-span-4">{t.queriesTab.colQuery}</div>
                  <div className="col-span-3">{t.queriesTab.colIntent}</div>
                  <div className="col-span-2">{t.queriesTab.colConfLat}</div>
                  <div className="col-span-1">{t.queriesTab.colWhen}</div>
                </div>
                <div className="divide-y divide-white/[0.04] max-h-[60vh] overflow-y-auto">
                  {recentQueries.map((q, i) => {
                    const m = INTENT_META[q.intent] || INTENT_META.unknown;
                    return (
                      <div key={i} className="sm:grid sm:grid-cols-12 gap-2 px-4 py-3 hover:bg-white/[0.03] transition-all text-xs flex items-center">
                        <div className="col-span-1 text-white/30 font-mono hidden sm:block">{i+1}</div>
                        <div className="col-span-1 flex-shrink-0">{q.type==="vision"?"📷":"🎙️"}</div>
                        <div className="col-span-4 text-white/75 truncate flex-1 sm:flex-none sm:mr-0 mr-2">{q.title||"—"}</div>
                        <div className="col-span-3 hidden sm:block">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: m.color+"22", color: m.color, border: "1px solid "+m.color+"44" }}>
                            {m.emoji} {q.intent||"unknown"}
                          </span>
                        </div>
                        <div className="col-span-2 text-white/40 font-mono text-[10px] hidden sm:block">
                          {q.confidence!=null?q.confidence+"%":"—"}{q.latencyMs?" / "+q.latencyMs+"ms":""}
                        </div>
                        <div className="col-span-1 text-white/30 text-[10px] flex-shrink-0">{relTime(q.timestamp)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>)}

          {/* ═══════════════════════════════════════════════════════════
              TAB 4: INTENT ANALYTICS
              ═══════════════════════════════════════════════════════════ */}
          {tab === "intents" && (<>
            <div>
              <h2 className="text-xl font-black text-white">{t.intentsTab.title}</h2>
              <p className="text-xs text-white/40 mt-0.5">{t.intentsTab.sub}</p>
            </div>

            {(() => {
              const intentCounts = {};
              history.forEach(h => { if (h.intent) intentCounts[h.intent] = (intentCounts[h.intent]||0)+1; });
              const sortedIntents = Object.entries(intentCounts).sort((a,b) => b[1]-a[1]);

              if (sortedIntents.length === 0) {
                return (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                    className="rounded-2xl p-12 text-center">
                    <p className="text-4xl mb-3">📊</p>
                    <p className="text-sm text-white/40">{t.intentsTab.empty}</p>
                  </div>
                );
              }

              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  className="rounded-2xl p-4 sm:p-6 space-y-5">
                  {sortedIntents.map(([intent, count]) => {
                    const m = INTENT_META[intent] || INTENT_META.unknown;
                    const pct = totalQueries > 0 ? Math.round((count/totalQueries)*100) : 0;
                    return (
                      <div key={intent} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{m.emoji}</span>
                            <span className="text-xs font-semibold text-white/80">{m.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-white/40">{count} {t.queriesLabel}</span>
                            <span className="text-sm font-black" style={{ color: m.color }}>{pct}%</span>
                          </div>
                        </div>
                        <ProgressBar value={count} max={sortedIntents[0][1]} color={m.color} />
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </>)}

          {/* ═══════════════════════════════════════════════════════════
              TAB 5: SYSTEM & PASSWORD MANAGEMENT
              ═══════════════════════════════════════════════════════════ */}
          {tab === "system" && (<>
            <div>
              <h2 className="text-xl font-black text-white">{t.systemTab.title}</h2>
              <p className="text-xs text-white/40 mt-0.5">{t.systemTab.sub}</p>
            </div>

            {/* 🔐 PASSWORD CHANGE CARD */}
            <ChangePasswordSection lang={lang} />

            {/* ⚙️ META WHATSAPP CLOUD API INTEGRATION CARD */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              className="rounded-2xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl text-emerald-300">
                  ⚙️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">
                      {lang === 'HI' ? "Meta WhatsApp Business Cloud API क्रेडेंशियल्स" : "Meta WhatsApp Business Cloud API Credentials"}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {getMetaWhatsAppConfig().mode === "live_meta_api" ? "Live API Active" : "On-Device Simulation"}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === 'HI' 
                      ? "भविष्य में असली Meta Access Token, Phone Number ID और Webhook URL कॉन्फ़िगर व टेस्ट करें" 
                      : "Configure & test real Meta Access Token, Phone Number ID and Webhook credentials"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="system-meta-api-btn"
                onClick={() => setShowSystemMetaModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
              >
                <span>🔑</span>
                <span>{lang === 'HI' ? "API सेटअप खोलें (Configure)" : "Configure API Keys"}</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                className="rounded-2xl p-4 sm:p-5">
                <h3 className="text-sm font-bold text-white mb-4">{t.systemTab.configTitle}</h3>
                {[
                  ["App Name",        "Kisan Sahayak AI"],
                  ["Version",         "v1.0.0"],
                  ["Language / भाषा",  lang === 'HI' ? "हिन्दी (Hindi Active)" : "English (Active)"],
                  ["Challenge",       "Qualcomm Snapdragon AI Lab"],
                  ["Admin Auth",      localStorage.getItem(CUSTOM_PW_KEY) ? "Custom Password Active" : "Default Password"],
                  ["NLP Engine",      "Rule-based Hindi/Hinglish (Offline)"],
                  ["Cloud Dependency","Zero (100% On-Device)"],
                  ["Scheme Apps",     totalApps + " stored"],
                  ["Query Logs",      totalQueries + " stored"],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                    <span className="text-xs text-white/50">{k}</span>
                    <span className="text-xs font-semibold text-white/85 font-mono truncate max-w-[55%] text-right">{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                className="rounded-2xl p-4 sm:p-5">
                <h3 className="text-sm font-bold text-white mb-4">{t.systemTab.sessionTitle}</h3>
                {(user ? [
                  ["Name",     user.name  || "—"],
                  ["Kisan ID", user.kisanId || "—"],
                  ["Contact",  user.contact || user.phone || "—"],
                  ["Location", user.location || "—"],
                  ["Status",   "✅ Active"],
                ] : [
                  ["Status",   "❌ No Active Farmer Session"],
                  ["Hint",     "Sign in as farmer on the main app"],
                ]).map(([k,v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                    <span className="text-xs text-white/50">{k}</span>
                    <span className="text-xs font-semibold text-white/85 truncate max-w-[55%] text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              className="rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-white mb-4">{t.systemTab.actionsTitle}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t.systemTab.clearLog,      emoji: "🗑️", color: "#ef4444", fn: clearLogs },
                  { label: t.systemTab.exportApps,     emoji: "📑", color: "#fbbf24", fn: exportApplicationsJson },
                  { label: t.systemTab.clearSession,  emoji: "👤", color: "#f59e0b", fn: () => {
                    localStorage.removeItem(USER_KEY);
                    window.dispatchEvent(new CustomEvent("kisan_user_updated"));
                  }},
                  { label: t.systemTab.reloadPage,    emoji: "🔄", color: "#34d399", fn: () => window.location.reload() },
                ].map(({ label, emoji, color, fn }) => (
                  <button key={label} onClick={fn}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all hover:scale-105 active:scale-95"
                    style={{ background: color+"15", border: "1px solid "+color+"35" }}>
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-[10px] font-bold text-center" style={{ color }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>)}

        </main>
      </div>

      {/* ── MODAL: FULL APPLICATION DOSSIER ── */}
      {selectedApp && (
        <ApplicationDetailModal 
          app={selectedApp} 
          lang={lang}
          onClose={() => setSelectedApp(null)} 
          onUpdateStatus={updateAppStatus} 
        />
      )}

      {/* ── MODAL: WHATSAPP BOT FULL MOBILE POPUP ── */}
      {showWaModal && (
        <WhatsAppBotModal
          isOpen={showWaModal}
          onClose={() => setShowWaModal(false)}
          lang={lang}
        />
      )}

      {/* ── MODAL: META WHATSAPP API CONFIGURATION ── */}
      <MetaApiConfigModal 
        isOpen={showSystemMetaModal} 
        onClose={() => setShowSystemMetaModal(false)} 
        lang={lang} 
      />

    </div>
  );
}
