// ── KISAN SAHAYAK - WHATSAPP BOT & ADMIN REAL-TIME COMMUNICATION STORE ──
// Shared store between Farmer WhatsApp Modal and Government Admin WhatsApp Console

const WA_THREADS_KEY = "kisan_whatsapp_all_threads";

// Pre-seeded realistic threads for government admin demonstration
const DEFAULT_THREADS = [
  {
    id: "th-KS-UP-1042",
    kisanId: "KS-UP-1042",
    farmerName: "रमेश कुमार (Ramesh Kumar)",
    contact: "+91 94520 18234",
    location: "वाराणसी, उत्तर प्रदेश",
    crop: "गेहूं, सरसों",
    status: "needs_admin_reply", // "needs_admin_reply" | "admin_replied" | "ai_answered"
    lastUpdated: Date.now() - 1000 * 60 * 18, // 18 mins ago
    messages: [
      {
        id: "m-up-1",
        sender: "user",
        time: "09:20 AM",
        text: "नमस्ते सर, मेरी पीएम किसान 18वीं किस्त PFMS रिजेक्शन कोड 104 के कारण बैंक खाते में नहीं आई। मैंने बैंक में आधार NPCI मैप करा लिया है, कृपया पोर्टल पर अप्रूव कर दीजिए।",
        attachment: null
      },
      {
        id: "m-up-2",
        sender: "bot",
        time: "09:20 AM",
        text: "⚠️ *यह विशेष बैंक खाता PFMS 104 सत्यापन मामला है।*\n\nआपका प्रश्न और किसान ID (*KS-UP-1042*) सहायता टीम (Admin Panel) को प्रेषित कर दी गई है।\n\n👨‍💼 एडमिन टीम रिकॉर्ड चेक करके इसी व्हाट्सएप चैट पर सीधा उत्तर भेजेगी।",
        isPendingOfficer: true
      }
    ]
  },
  {
    id: "th-KS-MH-2081",
    kisanId: "KS-MH-2081",
    farmerName: "आनंदी बाई (Anandi Bai)",
    contact: "+91 98220 54321",
    location: "नासिक, महाराष्ट्र",
    crop: "प्याज, अंगूर",
    status: "needs_admin_reply",
    lastUpdated: Date.now() - 1000 * 60 * 42, // 42 mins ago
    messages: [
      {
        id: "m-mh-1",
        sender: "user",
        time: "08:55 AM",
        text: "नासिक मंडी में प्याज के भाव गिरकर ₹1,100 हो गए हैं। क्या मुझे कांदा चाळ (Onion Storage) 50% सब्सिडी और भावांतर भरपाई का टोकन नंबर मिल सकता है?",
        attachment: null
      },
      {
        id: "m-mh-2",
        sender: "bot",
        time: "08:55 AM",
        text: "⚠️ *सब्सिडी कूपन व भावांतर योजना सत्यापन:*\n\nयह सब्सिडी स्वीकृति से संबंधित विषय है। आपका प्रश्न सहायता टीम को भेज दिया गया है।",
        isPendingOfficer: true
      }
    ]
  },
  {
    id: "th-KS-PB-3019",
    kisanId: "KS-PB-3019",
    farmerName: "सुखदेव सिंह (Sukhdev Singh)",
    contact: "+91 98140 76543",
    location: "लुधियाना, पंजाब",
    crop: "गेहूं, धान",
    status: "ai_answered",
    lastUpdated: Date.now() - 1000 * 60 * 120, // 2 hours ago
    messages: [
      {
        id: "m-pb-1",
        sender: "user",
        time: "07:30 AM",
        text: "📷 गेहूं की पत्ती पर पीली धारियां और पाउडर दिख रहा है।",
        attachment: {
          type: "image",
          url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&auto=format&fit=crop&q=80",
          name: "wheat_yellow_rust.jpg",
          disease: "Wheat Yellow Rust (पीला रतुआ)",
          confidence: "95%"
        }
      },
      {
        id: "m-pb-2",
        sender: "bot",
        time: "07:31 AM",
        text: "🔬 *फसल रोग AI विश्लेषण पूर्ण!* ✅ (Snapdragon NPU 0.43ms)\n\n🌿 *रोग पहचान:* Wheat Yellow Rust (पीला रतुआ)\n🎯 *सटीकता:* 95%\n💊 *पक्का उपचार:* प्रोपिकोनाजोल 25% EC (टिल्ट) 1 मिली प्रति लीटर पानी में मिलाकर तुरंत छिड़काव करें। 15 दिन बाद दोबारा दोहराएं।"
      }
    ]
  },
  {
    id: "th-KS-MP-4190",
    kisanId: "KS-MP-4190",
    farmerName: "शिवराज मीणा (Shivraj Meena)",
    contact: "+91 97550 99881",
    location: "इंदौर, मध्य प्रदेश",
    crop: "सोयाबीन, चना",
    status: "needs_admin_reply",
    lastUpdated: Date.now() - 1000 * 60 * 180, // 3 hours ago
    messages: [
      {
        id: "m-mp-1",
        sender: "user",
        time: "06:40 AM",
        text: "सर, पीएम कुसुम योजना के तहत 3 HP सोलर पंप 60% सब्सिडी टोकन की लॉटरी कब निकलेगी? मेरा आवेदन क्रमांक MP-KUSUM-8812 है।",
        attachment: null
      },
      {
        id: "m-mp-2",
        sender: "bot",
        time: "06:40 AM",
        text: "⚠️ *सोलर पंप टोकन स्टेटस:*\n\nआपका आवेदन क्रमांक MP-KUSUM-8812 कृषि ऊर्जा नोडल डेस्क को फॉरवर्ड कर दिया गया है। अधिकारी शीघ्र समाधान देंगे।",
        isPendingOfficer: true
      }
    ]
  },
  {
    id: "th-KS-BR-5201",
    kisanId: "KS-BR-5201",
    farmerName: "दिनेश यादव (Dinesh Yadav)",
    contact: "+91 99340 11223",
    location: "समस्तीपुर, बिहार",
    crop: "मक्का, सब्जी",
    status: "admin_replied",
    lastUpdated: Date.now() - 1000 * 60 * 240, // 4 hours ago
    messages: [
      {
        id: "m-br-1",
        sender: "user",
        time: "05:10 AM",
        text: "मक्का की फसल में फॉल आर्मीवर्म सुंडी पत्तों को छलनी कर रही है। क्या कृषि विभाग से मुफ्त कीटनाशक मिलेगा?",
        attachment: null
      },
      {
        id: "m-br-2",
        sender: "bot",
        time: "05:10 AM",
        text: "🐛 *कीट पहचान: फॉल आर्मीवर्म*\n\nएमामेक्टिन बेंजोएट 5% SG (0.4 ग्राम/लीटर) शाम को पत्तियों की गोभ में स्प्रे करें। सहायता हेतु प्रश्न कृषि विशेषज्ञ टीम को भेजा गया है।"
      },
      {
        id: "m-br-3",
        sender: "officer",
        officerName: "कृषि सहायता टीम (समस्तीपुर)",
        time: "06:15 AM",
        text: "किसान भाई दिनेश जी, समस्तीपुर कृषि रक्षा इकाई द्वारा आपके पंचायत भवन पर कल सुबह 10:00 बजे 'फॉल आर्मीवर्म नियंत्रण शिविर' लगाया जा रहा है। आप अपना किसान कार्ड दिखाकर 50% अनुदान पर अनुशंसित दवा ले सकते हैं।"
      }
    ]
  },
  {
    id: "th-KS-RJ-6312",
    kisanId: "KS-RJ-6312",
    farmerName: "कमला देवी (Kamla Devi)",
    contact: "+91 94140 33445",
    location: "जोधपुर, राजस्थान",
    crop: "बाजरा, जीरा",
    status: "needs_admin_reply",
    lastUpdated: Date.now() - 1000 * 60 * 300,
    messages: [
      {
        id: "m-rj-1",
        sender: "user",
        time: "04:30 AM",
        text: "नमस्ते साहब, जीरे की फसल के लिए ड्रिप सिंचाई (Drip Irrigation) 70% सरकारी सब्सिडी पर लगवानी है। क्या आवेदन ऑनलाइन अप्रूव हो गया है?",
        attachment: null
      },
      {
        id: "m-rj-2",
        sender: "bot",
        time: "04:30 AM",
        text: "💧 *ड्रिप सिंचाई सब्सिडी पूछताछ:*\n\nआपका आवेदन सत्यापन हेतु कृषि उद्यानिकी विभाग (Horticulture Officer) को प्रेषित किया गया है।",
        isPendingOfficer: true
      }
    ]
  },
  {
    id: "th-KS-HR-7423",
    kisanId: "KS-HR-7423",
    farmerName: "हरप्रीत सिंह (Harpreet Singh)",
    contact: "+91 98960 77889",
    location: "करनाल, हरियाणा",
    crop: "धान, बासमती",
    status: "ai_answered",
    lastUpdated: Date.now() - 1000 * 60 * 360,
    messages: [
      {
        id: "m-hr-1",
        sender: "user",
        time: "03:15 AM",
        text: "धान की पराली प्रबंधन हेतु सुपर सीडर / हैप्पी सीडर मशीन पर ₹1.5 लाख की सरकारी सब्सिडी का टोकन कब जारी होगा?",
        attachment: null
      },
      {
        id: "m-hr-2",
        sender: "bot",
        time: "03:16 AM",
        text: "🚜 *कृषि यंत्रीकरण योजना (SMAM):*\n\nहरियाणा कृषि विभाग द्वारा पराली प्रबंधन मशीनों की पहली लॉटरी सूची कृषि दर्शन पोर्टल पर जारी कर दी गई है। सुपर सीडर हेतु 50% सब्सिडी (अधिकतम ₹1.05 लाख) मान्य है।"
      }
    ]
  },
  {
    id: "th-KS-AP-8534",
    kisanId: "KS-AP-8534",
    farmerName: "बालाजी राव (Balaji Rao)",
    contact: "+91 98480 22334",
    location: "गुंटूर, आंध्र प्रदेश",
    crop: "लाल मिर्च, कपास",
    status: "needs_admin_reply",
    lastUpdated: Date.now() - 1000 * 60 * 420,
    messages: [
      {
        id: "m-ap-1",
        sender: "user",
        time: "02:40 AM",
        text: "मिर्च की फसल में ब्लैक थ्रिप्स (Black Thrips) का भारी प्रकोप है। पत्ते ऊपर की ओर मुड़ रहे हैं। क्या कोई नई अनुशंसित दवा है?",
        attachment: null
      },
      {
        id: "m-ap-2",
        sender: "bot",
        time: "02:41 AM",
        text: "🌶️ *मिर्च थ्रिप्स अलर्ट:*\n\nयह गंभीर कीट समस्या है। स्पिनेटोरम 11.7% SC (0.9 मिली/लीटर) छिड़कें। विस्तृत रिपोर्ट जिला कृषि अनुसंधान केंद्र को भेजी गई है।",
        isPendingOfficer: true
      }
    ]
  }
];

// Read all threads from localStorage with fallback to default demo data
export function getWhatsAppThreads() {
  try {
    const raw = localStorage.getItem(WA_THREADS_KEY);
    if (!raw) {
      localStorage.setItem(WA_THREADS_KEY, JSON.stringify(DEFAULT_THREADS));
      return DEFAULT_THREADS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_THREADS;

    // Merge any missing default threads so the contact list always has all contacts
    const existingIds = new Set(parsed.map(t => t.kisanId));
    let hasNew = false;
    for (const def of DEFAULT_THREADS) {
      if (!existingIds.has(def.kisanId)) {
        parsed.push(def);
        hasNew = true;
      }
    }
    if (hasNew) {
      localStorage.setItem(WA_THREADS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Error reading WhatsApp threads:", err);
    return DEFAULT_THREADS;
  }
}

// Save threads to localStorage & emit synchronization event
export function saveWhatsAppThreads(threads) {
  try {
    localStorage.setItem(WA_THREADS_KEY, JSON.stringify(threads));
    window.dispatchEvent(new CustomEvent("kisan_whatsapp_updated", { detail: { threads } }));
  } catch (err) {
    console.error("Error saving WhatsApp threads:", err);
  }
}

// Reset threads to initial factory state
export function resetWhatsAppThreads() {
  saveWhatsAppThreads(DEFAULT_THREADS);
  return DEFAULT_THREADS;
}

// Get or initialize thread for a specific farmer profile
export function getOrCreateThreadForUser(farmer) {
  const threads = getWhatsAppThreads();
  const kisanId = farmer?.kisanId || "KS-UP-1042";

  let thread = threads.find(t => t.kisanId === kisanId);
  if (!thread) {
    thread = {
      id: "th-" + kisanId,
      kisanId,
      farmerName: farmer?.name || "रामेश्वर शर्मा (Farmer)",
      contact: farmer?.contact || farmer?.phone || "+91 98765 43210",
      location: farmer?.location || "वाराणसी, उत्तर प्रदेश",
      crop: farmer?.primaryCrop || "गेहूं, सरसों",
      status: "ai_answered",
      lastUpdated: Date.now(),
      messages: [
        {
          id: "w-welcome-user",
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `🌾 *नमस्ते किसान भाई!* 🙏\n\nकृषि एवं किसान कल्याण मंत्रालय तथा *Qualcomm Snapdragon AI* द्वारा संचालित *किसान सहायक 24/7 व्हाट्सएप बॉट* में आपका स्वागत है।\n\nआपकी प्रमाणित किसान ID: *${kisanId}*\n\nआप सीधे अपने खेत के *बीमार पत्ते की फोटो (📷) या वीडियो (🎥) भेज सकते हैं* या नीचे दिए गए नंबर लिखकर भेजें:\n\n*1️⃣* 📷 फसल रोग जांच\n*2️⃣* 💰 आज का मंडी भाव\n*3️⃣* ⛅ मौसम व बारिश\n*4️⃣* 🧪 खाद व यूरिया\n*5️⃣* 🏛️ पीएम-किसान ₹6,000\n*6️⃣* 🆔 किसान ID कार्ड\n*7️⃣* 👨‍💼 सरकारी कृषि अधिकारी से पूछें`
        }
      ]
    };
    threads.unshift(thread);
    saveWhatsAppThreads(threads);
  }
  return thread;
}

// Append a message sent by the user / farmer
export function sendUserWhatsAppMessage({
  kisanId,
  farmerName,
  location,
  contact,
  text,
  attachment = null,
  needsAdmin = false
}) {
  const threads = getWhatsAppThreads();
  const targetId = kisanId || "KS-UP-1042";

  let threadIdx = threads.findIndex(t => t.kisanId === targetId);
  let thread;

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const userMsg = {
    id: "u-" + Date.now(),
    sender: "user",
    time: now,
    text,
    attachment
  };

  if (threadIdx >= 0) {
    thread = { ...threads[threadIdx] };
    thread.messages = [...thread.messages, userMsg];
    thread.lastUpdated = Date.now();
    if (farmerName) thread.farmerName = farmerName;
    if (location) thread.location = location;
    if (contact) thread.contact = contact;
    if (needsAdmin) thread.status = "needs_admin_reply";
    threads[threadIdx] = thread;
  } else {
    thread = {
      id: "th-" + targetId,
      kisanId: targetId,
      farmerName: farmerName || "किसान भाई",
      contact: contact || "+91 98765 43210",
      location: location || "उत्तर प्रदेश",
      crop: "गेहूं",
      status: needsAdmin ? "needs_admin_reply" : "ai_answered",
      lastUpdated: Date.now(),
      messages: [userMsg]
    };
    threads.unshift(thread);
  }

  saveWhatsAppThreads(threads);
  return thread;
}

// Append a message sent by AI Bot to a farmer thread
export function sendBotWhatsAppReply({
  kisanId,
  text,
  action = null,
  quickReplies = null,
  isPendingOfficer = false
}) {
  const threads = getWhatsAppThreads();
  const targetId = kisanId || "KS-UP-1042";

  const threadIdx = threads.findIndex(t => t.kisanId === targetId);
  if (threadIdx < 0) return null;

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const botMsg = {
    id: "b-" + Date.now(),
    sender: "bot",
    time: now,
    text,
    action,
    quickReplies,
    isPendingOfficer
  };

  const thread = { ...threads[threadIdx] };
  thread.messages = [...thread.messages, botMsg];
  thread.lastUpdated = Date.now();
  if (isPendingOfficer) {
    thread.status = "needs_admin_reply";
  }
  threads[threadIdx] = thread;

  saveWhatsAppThreads(threads);
  return thread;
}

// Send an official response by Government Admin / Officer to a farmer
export function sendAdminWhatsAppReply({
  kisanId,
  replyText,
  officerName = "श्री ए. के. शर्मा (कृषि नोडल अधिकारी)"
}) {
  if (!replyText || !replyText.trim()) return null;

  const threads = getWhatsAppThreads();
  const targetId = kisanId || "KS-UP-1042";

  const threadIdx = threads.findIndex(t => t.kisanId === targetId);
  if (threadIdx < 0) return null;

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const officerMsg = {
    id: "off-" + Date.now(),
    sender: "officer",
    officerName,
    time: now,
    text: replyText.trim(),
    verified: true
  };

  const thread = { ...threads[threadIdx] };
  thread.messages = [...thread.messages, officerMsg];
  thread.status = "admin_replied"; // Mark as answered by Officer!
  thread.lastUpdated = Date.now();
  threads[threadIdx] = thread;

  saveWhatsAppThreads(threads);

  // If live Meta WhatsApp API mode is configured, dispatch via Meta Graph API
  const metaCfg = getMetaWhatsAppConfig();
  if (metaCfg.mode === "live_meta_api" && metaCfg.accessToken && metaCfg.phoneNumberId) {
    const rawPhone = (thread.contact || "").replace(/[^0-9]/g, "");
    if (rawPhone) {
      sendRealMetaWhatsAppMessage({
        to: rawPhone,
        text: `*${officerName}*\n\n${replyText.trim()}`,
        config: metaCfg
      }).catch(err => console.warn("Meta WhatsApp API dispatch error:", err));
    }
  }

  return thread;
}

// ── META WHATSAPP CLOUD API CONFIGURATION & LIVE INTEGRATION ──
const META_CONFIG_KEY = "kisan_meta_whatsapp_config";

export const DEFAULT_META_CONFIG = {
  mode: "simulation", // "simulation" | "live_meta_api"
  accessToken: "",
  phoneNumberId: "",
  wabaId: "",
  verifyToken: "kisan_sahayak_meta_verify_2026",
  webhookUrl: "https://kisan-sahayak-ai.org/api/webhook/whatsapp",
  apiVersion: "v19.0",
  lastTested: null,
  status: "configured"
};

export function getMetaWhatsAppConfig() {
  try {
    const raw = localStorage.getItem(META_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_META_CONFIG };
    return { ...DEFAULT_META_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Error loading Meta WhatsApp config:", err);
    return { ...DEFAULT_META_CONFIG };
  }
}

export function saveMetaWhatsAppConfig(cfg) {
  try {
    const merged = { ...getMetaWhatsAppConfig(), ...cfg };
    localStorage.setItem(META_CONFIG_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("kisan_meta_config_updated", { detail: { config: merged } }));
    return merged;
  } catch (err) {
    console.error("Error saving Meta WhatsApp config:", err);
    return cfg;
  }
}

// Live test / verification ping for Meta WhatsApp Cloud API
export async function testMetaWhatsAppConnection(cfg) {
  const config = cfg || getMetaWhatsAppConfig();
  const startTime = Date.now();

  // If credentials are provided, attempt real Graph API call to Phone Number ID
  if (config.accessToken && config.phoneNumberId) {
    try {
      const endpoint = `https://graph.facebook.com/${config.apiVersion || "v19.0"}/${config.phoneNumberId}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${config.accessToken.trim()}`
        }
      });
      const latency = Date.now() - startTime;
      const data = await res.json();

      if (res.ok) {
        const updated = saveMetaWhatsAppConfig({
          lastTested: new Date().toLocaleTimeString(),
          status: "connected",
          verifiedPhone: data.display_phone_number || data.id
        });
        return {
          success: true,
          status: 200,
          latency,
          message: `HTTP 200 OK · Meta Cloud API Connected (${data.display_phone_number || "Phone Verified"})`,
          data,
          config: updated
        };
      } else {
        return {
          success: false,
          status: res.status,
          latency,
          message: `Meta API Error (${res.status}): ${data.error?.message || "Invalid Token or Phone ID"}`,
          error: data.error
        };
      }
    } catch (err) {
      return {
        success: false,
        latency: Date.now() - startTime,
        message: `Network Connection Error: ${err.message}. Ensure internet access or CORS proxy.`
      };
    }
  }

  // Simulation test if offline / local mock
  await new Promise(r => setTimeout(r, 450));
  const latency = Date.now() - startTime;
  saveMetaWhatsAppConfig({
    lastTested: new Date().toLocaleTimeString(),
    status: "simulation_active"
  });
  return {
    success: true,
    status: 200,
    latency,
    message: "HTTP 200 OK · Snapdragon NPU & Webhook Ready (Simulation Mode Active)"
  };
}

// Send real message through Meta WhatsApp Cloud API
export async function sendRealMetaWhatsAppMessage({ to, text, config }) {
  const cfg = config || getMetaWhatsAppConfig();
  if (!cfg.accessToken || !cfg.phoneNumberId) {
    console.warn("Meta WhatsApp API keys not configured. Simulating dispatch locally.");
    return { simulated: true };
  }

  const endpoint = `https://graph.facebook.com/${cfg.apiVersion || "v19.0"}/${cfg.phoneNumberId}/messages`;
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to.replace(/[^0-9]/g, ""),
    type: "text",
    text: { body: text }
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${cfg.accessToken.trim()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  return { ok: res.ok, status: res.status, data: json };
}
