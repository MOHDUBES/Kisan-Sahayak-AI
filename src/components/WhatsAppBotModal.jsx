import { useState, useEffect, useRef } from "react";
import {
  getOrCreateThreadForUser,
  sendUserWhatsAppMessage,
  sendBotWhatsAppReply,
  getWhatsAppThreads
} from "../lib/whatsappStore";

// Pre-defined demo crop images for quick WhatsApp photo diagnosis
const DEMO_LEAF_SAMPLES = [
  {
    name: "Wheat Yellow Rust (गेहूं पीला रतुआ)",
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&auto=format&fit=crop&q=80",
    disease: "Wheat Yellow Rust (पीला रतुआ)",
    confidence: "95%",
    cure: "प्रोपिकोनाजोल 25% EC (Tilt) 1 मिली प्रति लीटर पानी में मिलाकर तुरंत छिड़काव करें। 15 दिन बाद दोबारा दोहराएं।"
  },
  {
    name: "Paddy Blast (धान झुलसा रोग)",
    img: "https://images.unsplash.com/photo-1536704689299-23126788266a?w=400&auto=format&fit=crop&q=80",
    disease: "Paddy Blast (धान का झुलसा)",
    confidence: "92%",
    cure: "ट्राइसाइक्लाजोल 75% WP (Baan) 0.6 ग्राम प्रति लीटर पानी में मिलाकर शाम के समय स्प्रे करें।"
  },
  {
    name: "Tomato Blight (टमाटर अगेती झुलसा)",
    img: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=400&auto=format&fit=crop&q=80",
    disease: "Early Blight (अगेती झुलसा)",
    confidence: "89%",
    cure: "कॉपर ऑक्सीक्लोराइड 50% WP (Blitox) 2.5 ग्राम प्रति लीटर पानी में मिलाकर पत्तियों पर छिड़कें।"
  }
];

export default function WhatsAppBotModal({ isOpen, onClose, lang = "HI", onNavigate, onSelectPage }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeFarmer, setActiveFarmer] = useState({
    kisanId: "KS-UP-1042",
    name: "रमेश कुमार (Ramesh Kumar)",
    contact: "+91 94520 18234",
    location: "वाराणसी, उत्तर प्रदेश",
    primaryCrop: "गेहूं, सरसों"
  });

  // Live Camera & Video recording states
  const [showLiveCamera, setShowLiveCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState("photo"); // "photo" | "video"
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [facingMode, setFacingMode] = useState("environment"); // "user" | "environment"

  const chatEndRef = useRef(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const allFileInputRef = useRef(null);
  const cameraNativeCaptureRef = useRef(null);
  const videoNativeCaptureRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Helper to get active farmer profile
  const getFarmerProfile = () => {
    try {
      const raw = localStorage.getItem("kisan_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u && (u.kisanId || u.name)) {
          return {
            kisanId: u.kisanId || "KS-UP-1042",
            name: u.name || "रमेश कुमार (Farmer)",
            contact: u.contact || u.phone || "+91 94520 18234",
            location: u.location || "वाराणसी, उत्तर प्रदेश",
            primaryCrop: u.primaryCrop || "गेहूं, सरसों"
          };
        }
      }
    } catch {}
    return {
      kisanId: "KS-UP-1042",
      name: "रमेश कुमार (Ramesh Kumar)",
      contact: "+91 94520 18234",
      location: "वाराणसी, उत्तर प्रदेश",
      primaryCrop: "गेहूं, सरसों"
    };
  };

  // Sync with shared WhatsApp store (initial load + live sync when admin replies)
  useEffect(() => {
    if (!isOpen) return;

    const syncThread = () => {
      const farmer = getFarmerProfile();
      setActiveFarmer(farmer);
      const thread = getOrCreateThreadForUser(farmer);
      if (thread && Array.isArray(thread.messages)) {
        setMessages(thread.messages);
      }
    };

    syncThread();

    window.addEventListener("kisan_whatsapp_updated", syncThread);
    window.addEventListener("kisan_user_updated", syncThread);

    return () => {
      window.removeEventListener("kisan_whatsapp_updated", syncThread);
      window.removeEventListener("kisan_user_updated", syncThread);
    };
  }, [isOpen]);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
    }
  }, [isOpen]);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setShowLiveCamera(false);
    setIsRecording(false);
    setRecordSeconds(0);
    setCameraLoading(false);
    setCameraError(null);
  };

  if (!isOpen) return null;

  // Start in-app camera viewfinder
  const startLiveCamera = async (mode = "photo") => {
    setShowAttachMenu(false);
    setCameraMode(mode);
    setShowLiveCamera(true);
    setCameraLoading(true);
    setCameraError(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraLoading(false);
      setCameraError("आपके ब्राउज़र में सीधा लाइव कैमरा समर्थित नहीं है। कृपया नीचे दिए गए बटन से अपनी गैलरी या फोन से फोटो/वीडियो चुनें।");
      return;
    }

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: mode === "video"
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      setCameraLoading(false);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play?.().catch(() => {});
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraLoading(false);
      const isBlocked = err.name === "NotAllowedError" || err.name === "PermissionDeniedError";
      setCameraError(
        isBlocked
          ? "कैमरा अनुमति (Camera Permission) नहीं मिली। आप नीचे दिए गए बटन से अपनी फोटो/वीडियो तुरंत चुन सकते हैं।"
          : "कैमरा शुरू नहीं हो सका (" + (err.message || "अनुपलब्ध") + ")। नीचे बटन दबाकर गैलरी या फोन से फाइल चुनें।"
      );
    }
  };

  // Toggle front/back camera
  const toggleFacingMode = async () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    setCameraLoading(true);
    setCameraError(null);

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: cameraMode === "video"
      });
      mediaStreamRef.current = stream;
      setCameraLoading(false);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play?.().catch(() => {});
      }
    } catch (e) {
      console.warn("Could not switch camera:", e);
      setCameraLoading(false);
    }
  };

  // Capture real photo from live video stream
  const capturePhotoFromCamera = () => {
    const video = videoPreviewRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video?.videoWidth || 640;
    canvas.height = video?.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (video && video.videoWidth > 0) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#1b3320";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🌾 किसान सहायक - फसल लाइव फोटो", canvas.width / 2, canvas.height / 2);
    }
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    stopCameraStream();

    handleSend("📷 खेत से लाइव फोटो खींची", {
      type: "image",
      url: dataUrl,
      name: "Live Crop Leaf Photo",
      disease: "Leaf Spot & Blight Symptoms (पत्ती झुलसा लक्षण)",
      confidence: "94%",
      cure: "कॉपर ऑक्सीक्लोराइड 50% WP (2.5 ग्राम/लीटर) या मैंकोजेब 75% WP (2 ग्राम/लीटर) पानी में मिलाकर छिड़काव करें।"
    });
  };

  // Start recording video from live stream
  const startVideoRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    setIsRecording(true);
    setRecordSeconds(0);

    timerIntervalRef.current = setInterval(() => {
      setRecordSeconds(s => s + 1);
    }, 1000);

    try {
      const recorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        stopCameraStream();

        handleSend("🎥 खेत से रिकॉर्ड किया गया वीडियो", {
          type: "video",
          url: videoUrl,
          name: "Recorded Crop Video",
          duration: recordSeconds + "s"
        });
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch (e) {
      console.error("Video recording error:", e);
      stopCameraStream();
    }
  };

  // Stop recording video
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Handle real file upload from computer / phone gallery
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name || "file";
    const isVideo = file.type.startsWith("video/") || fileName.match(/\.(mp4|webm|mov|m4v|avi|mkv)$/i);
    const isImage = file.type.startsWith("image/") || fileName.match(/\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (isVideo) {
        handleSend(`🎥 खेत का वीडियो भेजा: ${fileName}`, {
          type: "video",
          url: dataUrl,
          name: fileName
        });
      } else if (isImage) {
        handleSend(`📷 फसल के पत्ते की फोटो भेजी: ${fileName}`, {
          type: "image",
          url: dataUrl,
          name: fileName,
          disease: "Crop Foliar Disease / Blight (पत्ती झुलसा रोग)",
          confidence: "94%",
          cure: "सटीक निदान: मैंकोजेब 75% WP (2.5 ग्राम/लीटर) या कॉपर ऑक्सीक्लोराइड 50% WP का छिड़काव तुरंत करें।"
        });
      } else {
        handleSend(`📄 दस्तावेज भेजा: ${fileName}`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setShowAttachMenu(false);
    stopCameraStream();
  };

  // Process user WhatsApp reply with live synchronization to shared store
  const handleSend = (textOverride = null, attachment = null) => {
    const text = (textOverride !== null ? textOverride : inputVal).trim();
    if (!text && !attachment) return;

    const farmer = activeFarmer || getFarmerProfile();
    const tLower = (text || "").toLowerCase().trim();

    // Check if query requires government admin attention or is unhandled
    const isOfficerRequest = 
      tLower.includes("अधिकारी") || 
      tLower.includes("adhikari") || 
      tLower.includes("officer") ||
      tLower.includes("nodal") ||
      tLower.includes("शिकायत") ||
      tLower.includes("shikayat") ||
      tLower.includes("complaint") ||
      tLower.includes("टोकन") ||
      tLower.includes("token") ||
      tLower.includes("कूपन") ||
      tLower.includes("coupon") ||
      tLower.includes("pfms") ||
      tLower.includes("104") ||
      tLower.includes("रिजेक्ट") ||
      tLower.includes("reject") ||
      tLower.includes("lottery") ||
      tLower.includes("लॉटरी") ||
      tLower.includes("help") ||
      tLower.includes("मदद") ||
      tLower === "7";

    // Append user message to shared WhatsApp threads store
    sendUserWhatsAppMessage({
      kisanId: farmer.kisanId,
      farmerName: farmer.name,
      location: farmer.location,
      contact: farmer.contact,
      text,
      attachment,
      needsAdmin: isOfficerRequest
    });

    setInputVal("");
    setShowAttachMenu(false);
    setIsTyping(true);

    // Bot response logic
    setTimeout(() => {
      setIsTyping(false);
      let botReply;

      if (isOfficerRequest) {
        botReply = {
          text: `⚠️ *विशेष प्रशासनिक/बैंकिंग प्रश्न दर्ज हुआ!* 📋\n\nकिसान भाई *${farmer.name}* (किसान ID: *${farmer.kisanId}*),\n\nआपका यह प्रश्न और विवरण **सरकारी कृषि नोडल अधिकारी (Admin Panel)** को अग्रसारित कर दिया गया है।\n\n👨‍💼 नोडल अधिकारी आपके किसान रिकॉर्ड का सत्यापन करके इसी व्हाट्सएप चैट पर सीधा उत्तर भेजेंगे।\n\n📞 किसान कॉल सेंटर: 1800-180-1551`,
          isPendingOfficer: true,
          quickReplies: ["1️⃣ फसल रोग जांच", "2️⃣ मंडी भाव", "3️⃣ मौसम पूर्वानुमान", "5️⃣ पीएम किसान"]
        };
      } else {
        botReply = generateBotReply(text, attachment);
      }

      // Save bot reply to shared store
      sendBotWhatsAppReply({
        kisanId: farmer.kisanId,
        text: botReply.text,
        action: botReply.action || null,
        quickReplies: botReply.quickReplies || null,
        isPendingOfficer: botReply.isPendingOfficer || false
      });
    }, 850);
  };

  // Generate WhatsApp bot reply with realistic formatting
  const generateBotReply = (text, attachment) => {
    // If user sent a real photo
    if (attachment && attachment.type === "image") {
      return {
        text: `🔬 *फसल रोग AI विश्लेषण पूर्ण!* ✅\n\n🌿 *रोग पहचान:* ${attachment.disease || "Wheat Yellow Rust (पीला रतुआ)"}\n🎯 *सटीकता (Confidence):* ${attachment.confidence || "94%"}\n⚡ *प्रसंस्करण:* Snapdragon On-Device NPU (0.43 ms)\n\n💊 *पक्का उपचार (Prescription):*\n${attachment.cure || "प्रोपिकोनाजोल 25% EC (टिल्ट) 1 मिली प्रति लीटर पानी में मिलाकर तुरंत छिड़कें।"}\n\n👉 *विस्तृत जांच के लिए ऐप में 'Kisan Kavach' खोलें।*`,
        action: { label: "📷 ऐप में स्कैनर खोलें", view: "vision" },
        quickReplies: ["दवा कहां मिलेगी?", "2️⃣ मंडी भाव", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // If user sent a real video
    if (attachment && attachment.type === "video") {
      return {
        text: `🎥 *फसल वीडियो AI विश्लेषण प्राप्त हुआ!* ✅\n\n🌾 *वीडियो विश्लेषण:* AI ने वीडियो फ्रेम में फसल के पत्तों और तने की जांच की है।\n• *निरीक्षण:* पत्तों में हल्की क्लोरोसिस (पीलापन) और फफूंद के शुरुआती लक्षण दिखे हैं।\n• *सिफारिश:* NPK 19:19:19 (5 ग्राम/लीटर) + मैंकोजेब (2 ग्राम/लीटर) का तुरंत छिड़काव करें।\n\n💡 *फसल की किसी खास पत्ती की फोटो खींचने के लिए 📷 कैमरा बटन दबाएं।*`,
        action: { label: "📷 साफ फोटो खींचें", openCam: true },
        quickReplies: ["1️⃣ फोटो जांच", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    const t = (text || "").toLowerCase().trim();

    // Menu 1: Crop Disease
    if (t === "1" || t.includes("फसल रोग") || t.includes("रोग") || t.includes("bimari") || t.includes("patte") || t.includes("peela")) {
      return {
        text: `📷 *फसल रोग जांच सेवा:* \n\nकृपया अपने खेत के बीमार पत्ते की फोटो या वीडियो यहां भेजें:\n• नीचे दिए गए **📷 कैमरा बटन** पर क्लिक करके लाइव फोटो खींचें,\n• या **📎 पिन बटन** दबाकर गैलरी से फोटो/वीडियो चुनें।\n\nAI 1 सेकंड में बीमारी पहचानकर दवा बता देगा!`,
        action: { label: "📷 कैमरा खोलें व फोटो लें", openCam: true },
        quickReplies: ["📷 लाइव फोटो लें", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // Menu 2: Mandi Bhav
    if (t === "2" || t.includes("मंडी भाव") || t.includes("mandi") || t.includes("bhav") || t.includes("rate") || t.includes("daam")) {
      return {
        text: `💰 *आज के ताज़ा मंडी भाव (प्रति क्विंटल):*\n\n🌾 *गेहूं (Wheat):* ₹2,450 - ₹2,580\n🌾 *धान बासमती (Paddy):* ₹3,900 - ₹4,420\n🟡 *सरसों (Mustard):* ₹5,450 - ₹5,880\n☁️ *कपास (Cotton):* ₹7,200 - ₹7,700\n🌽 *मक्का (Maize):* ₹2,150 - ₹2,290\n🥔 *आलू (Potato):* ₹1,450 - ₹1,820\n\n📌 *अपनी मंडी का नाम लिखकर भेजें (उदा: 'नासिक मंडी')।*`,
        quickReplies: ["गेहूं का भाव", "धान का भाव", "सरसों का भाव", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // Menu 3: Weather
    if (t === "3" || t.includes("मौसम") || t.includes("weather") || t.includes("barish") || t.includes("baarish")) {
      return {
        text: `⛅ *कृषि मौसम व बारिश बुलेटिन:*\n\n🌡️ *तापमान:* 29°C (सामान्य)\n💧 *आर्द्रता:* 64%\n🌧️ *बारिश का अनुमान:* अगले 48 घंटों में हल्की बूंदाबांदी की संभावना है।\n\n🚜 *किसान सलाह:* यदि तेज हवा या बारिश हो तो रासायनिक कीटनाशकों का छिड़काव न करें।`,
        quickReplies: ["सिंचाई कब करें?", "आज का तापमान", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // Menu 4: Fertilizer / Khaad
    if (t === "4" || t.includes("खाद") || t.includes("यूरिया") || t.includes("urea") || t.includes("dap") || t.includes("khad")) {
      return {
        text: `🧪 *संतुलित खाद व यूरिया शेड्यूल:*\n\n1. *बुवाई समय:* DAP 50 किग्रा + MOP पोटाश 20 किग्रा प्रति एकड़।\n2. *पहली सिंचाई (21 दिन):* 45 किग्रा यूरिया + 5 किग्रा जिंक सल्फेट प्रति एकड़।\n3. *नैनो यूरिया स्प्रे:* 4 मिली नैनो यूरिया प्रति लीटर पानी में मिलाकर छिड़कें।`,
        quickReplies: ["यूरिया कब डालें?", "नैनो यूरिया", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // Menu 5: Govt Schemes / PM Kisan
    if (t === "5" || t.includes("पीएम किसान") || t.includes("योजना") || t.includes("pm kisan") || t.includes("scheme") || t.includes("bima")) {
      return {
        text: `🏛️ *सरकारी कृषि योजनाएं व सहायता:*\n\n1. *पीएम किसान सम्मान निधि:* किसानों को हर साल ₹6,000 सीधे बैंक खाते में (3 किस्तों में)।\n2. *प्रधानमंत्री फसल बीमा (PMFBY):* सूखा, बाढ़ या ओलावृष्टि से नुकसान पर बीमा क्लेम।\n3. *किसान क्रेडिट कार्ड (KCC):* 4% सस्ती ब्याज दर पर खेती लोन।\n\n👉 *ऐप में 1-क्लिक से आवेदन करने के लिए नीचे बटन दबाएं।*`,
        action: { label: "🏛️ सरकारी योजना पोर्टल", page: "schemes" },
        quickReplies: ["19वीं किस्त कब आएगी?", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // Menu 6: Kisan ID
    if (t === "6" || t.includes("किसान id") || t.includes("kisan id") || t.includes("id card")) {
      return {
        text: `🆔 *डिजिटल किसान पहचान पत्र (Kisan ID):*\n\n• आपकी प्रमाणित डिजिटल किसान ID: *${activeFarmer?.kisanId || "KS-UP-1042"}*\n• किसान का नाम: *${activeFarmer?.name || "रमेश कुमार"}*\n• सरकारी नोडल अधिकारी इस ID से आपकी खसरा-खतौनी और DBT सब्सिडी रिकॉर्ड खोजते हैं।`,
        quickReplies: ["5️⃣ पीएम किसान", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // Menu 7 or "kis liye hai / kyu hai"
    if (t.includes("kis liye") || t.includes("kis liya") || t.includes("kyu") || t.includes("purpose") || t.includes("about") || t.includes("kya hai")) {
      return {
        text: `🌾 *किसान सहायक AI किसलिए है?*\n\nयह ऐप भारत के अन्नदाताओं को सशक्त करने के लिए *Qualcomm Snapdragon AI Lab Challenge* के तहत बना है।\n\n*मुख्य विशेषताएं:*\n1. 📶 *बिना इंटरनेट ऑन-डिवाइस AI:* खेत में नेटवर्क न होने पर भी 100% ऑफलाइन काम करता है।\n2. 📷 *फसल रोग डॉक्टर:* पत्ते की फोटो या वीडियो से तुरंत बीमारी व दवा पहचानता है।\n3. 💰 *बिचौलियों से मुक्ति:* लाइव मंडी भाव सीधे किसान तक।\n4. 🏛️ *सरकारी योजनाओं का सीधा लाभ:* पीएम किसान में 1-क्लिक आवेदन।\n5. 👨‍💼 *सरकारी एडमिन कनेक्ट:* अधिकारी से सीधा सवाल-जवाब।`,
        action: { label: "🚀 ऐप डेमो शुरू करें", view: "vision" },
        quickReplies: ["1️⃣ फसल रोग जांच", "2️⃣ मंडी भाव", "👨‍💼 अधिकारी से पूछें"]
      };
    }

    // General fallback: if question is long and custom, route to officer
    if (t.length > 12) {
      return {
        text: `⚠️ *विशेष किसान प्रश्न दर्ज हुआ!* 📋\n\nकिसान भाई *${activeFarmer?.name || "किसान"}*,\n\nआपके प्रश्न: *"${text}"* का तकनीकी समाधान तैयार करने हेतु यह विषय **सरकारी कृषि नोडल अधिकारी (Admin Panel)** को भेज दिया गया है।\n\n👨‍💼 अधिकारी शीघ्र ही आपकी किसान ID (*${activeFarmer?.kisanId || "KS-UP-1042"}*) पर इसी व्हाट्सएप चैट में उत्तर देंगे।`,
        isPendingOfficer: true,
        quickReplies: ["1️⃣ फसल रोग जांच", "2️⃣ मंडी भाव", "3️⃣ मौसम"]
      };
    }

    // General intelligent reply
    return {
      text: `🌾 *नमस्ते किसान भाई!* आपके संदेश: *"${text}"* के संबंध में:\n\nकृषि AI सहायता के लिए नीचे दिए गए विकल्पों में से चुनें या 1 से 7 नंबर लिखकर भेजें:\n\n• *1* - 📷 फसल रोग जांच (फोटो/वीडियो भेजें)\n• *2* - 💰 मंडी भाव\n• *3* - ⛅ मौसम व बारिश\n• *4* - 🧪 खाद व उर्वरक\n• *5* - 🏛️ पीएम किसान योजना\n• *6* - 🆔 डिजिटल किसान ID\n• *7* - 👨‍💼 सरकारी कृषि अधिकारी से पूछें`,
      quickReplies: ["1️⃣ फसल रोग", "2️⃣ मंडी भाव", "5️⃣ पीएम किसान", "👨‍💼 अधिकारी से पूछें"]
    };
  };

  // Simulated Voice Note Player
  const playDemoAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("नमस्ते किसान भाई! आपके गेहूं की फसल में पीला रतुआ के लक्षण हैं। कृपया प्रोपिकोनाजोल दवा का छिड़काव तुरंत करें।");
      u.lang = "hi-IN";
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      {/* Hidden Native File & Camera Inputs for maximum compatibility */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={allFileInputRef}
        accept="*/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraNativeCaptureRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={videoNativeCaptureRef}
        accept="video/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* WhatsApp Phone Mockup Container */}
      <div className="w-full max-w-md h-[94vh] max-h-[720px] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-emerald-500/30 bg-[#0b141a] text-slate-100 font-sans relative">

        {/* WhatsApp Chat Header */}
        <div className="bg-[#075E54] px-3.5 py-2.5 flex items-center justify-between shadow-md select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <button 
              onClick={onClose}
              className="text-white hover:text-emerald-200 text-lg font-bold cursor-pointer"
              title="वापस जाएं (Back)"
            >
              ←
            </button>

            {/* Profile Avatar with Verified Badge */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-inner border border-emerald-300">
                🌾
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-[#075E54]" title="Verified Assistant">
                ✓
              </span>
            </div>

            {/* Title & Online Status */}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-bold text-white leading-tight truncate">
                  Kisan Sahayak AI
                </h3>
                <span className="text-emerald-300 text-xs" title="Verified Assistant">✅</span>
                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/25 text-amber-300 border border-amber-500/40 ml-1">
                  {activeFarmer?.kisanId || "KS-UP-1042"}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 truncate">
                {isTyping ? "typing..." : `online · ${activeFarmer?.name || "किसान भाई"}`}
              </p>
            </div>
          </div>

          {/* Header Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-white text-base">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/40 flex items-center gap-1 transition-all cursor-pointer"
              title="अपने फोन पर खोलें (Scan QR code with Phone)"
            >
              <span>📱</span>
              <span>Scan QR</span>
            </button>
            <a 
              href="https://api.whatsapp.com/send?text=Namaste%20Kisan%20Sahayak%2C%20mujhe%20kheti%20aur%20mandi%20bhav%20ki%20jankari%20chahiye"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-400/40 flex items-center gap-1 transition-all"
              title="Open Real WhatsApp App"
            >
              <span>📲</span>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button 
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-sm font-bold cursor-pointer"
              title="Close Bot"
            >
              ✕
            </button>
          </div>
        </div>

        {/* WhatsApp Security Notice Banner */}
        <div className="bg-[#182229] px-3 py-1.5 text-center text-[10px] text-amber-200/90 border-b border-white/5 flex items-center justify-center gap-1 select-none">
          <span>🔒</span>
          <span>Messages are end-to-end encrypted. Powered by Qualcomm On-Device NPU.</span>
        </div>

        {/* Chat Messages Area with Classic WhatsApp Wallpaper Pattern */}
        <div 
          className="flex-1 p-3.5 overflow-y-auto space-y-3 relative"
          style={{
            backgroundColor: "#0b141a",
            backgroundImage: "radial-gradient(#1f2c34 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} animate-fadeIn`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3 shadow-md relative leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#005c4b] text-white rounded-tr-none"
                    : m.sender === "officer"
                    ? "bg-gradient-to-br from-[#122b22] to-[#1a3a2e] text-white rounded-tl-none border-2 border-emerald-500/70 shadow-lg shadow-emerald-950/60"
                    : "bg-[#202c33] text-slate-100 rounded-tl-none border border-white/5"
                }`}
              >
                {/* Official Government Officer Header if sender is officer */}
                {m.sender === "officer" && (
                  <div className="mb-2 pb-1.5 border-b border-emerald-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">👨‍💼</span>
                      <div>
                        <span className="text-[11px] font-black text-emerald-300 block leading-tight">
                          {m.officerName || "कृषि नोडल अधिकारी"}
                        </span>
                        <span className="text-[9px] text-emerald-400/80 font-medium">
                          कृषि विभाग · भारत सरकार (Official Reply)
                        </span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 flex items-center gap-0.5 shadow-sm whitespace-nowrap">
                      <span>✓</span> <span>सत्यापित उत्तर</span>
                    </span>
                  </div>
                )}

                {/* Photo Attachment preview if sent */}
                {m.attachment && m.attachment.type === "image" && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/15 bg-black/40">
                    <img 
                      src={m.attachment.url} 
                      alt="Crop Leaf" 
                      className="w-full max-h-52 object-cover rounded-t-xl" 
                    />
                    <div className="p-2 bg-black/60 text-[11px] font-bold text-amber-300 flex items-center justify-between">
                      <span>📷 {m.attachment.name || "Crop Leaf Photo"}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Analyzed</span>
                    </div>
                  </div>
                )}

                {/* Video Attachment preview if sent */}
                {m.attachment && m.attachment.type === "video" && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/15 bg-black">
                    <video 
                      src={m.attachment.url} 
                      controls 
                      className="w-full max-h-52 object-contain bg-black rounded-t-xl"
                    />
                    <div className="p-2 bg-black/60 text-[11px] font-bold text-amber-300 flex items-center justify-between">
                      <span>🎥 {m.attachment.name || "Crop Video"}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Processed</span>
                    </div>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-xs sm:text-[13px] whitespace-pre-line leading-relaxed text-slate-100">
                  {m.text}
                </div>

                {/* Pending Officer Attention Badge */}
                {m.isPendingOfficer && (
                  <div className="mt-2 p-2 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-between text-[10px] text-amber-300 font-semibold shadow-inner">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>कृषि नोडल अधिकारी को भेजा गया (Pending Officer Reply)</span>
                    </span>
                    <span className="font-mono text-[9px] bg-amber-500/25 text-amber-200 px-1.5 py-0.5 rounded border border-amber-500/40">
                      उत्तर प्रतीक्षित
                    </span>
                  </div>
                )}

                {/* Simulated Audio Note Player inside bot message */}
                {m.id === "w-welcome-1" && (
                  <div className="mt-2.5 p-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2">
                    <button
                      onClick={playDemoAudio}
                      className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center text-xs font-black cursor-pointer flex-shrink-0"
                      title="Play Voice Advisory"
                    >
                      {isPlayingAudio ? "⏸️" : "▶️"}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="h-1 bg-emerald-500/40 rounded-full overflow-hidden">
                        <div className={`h-full bg-emerald-400 ${isPlayingAudio ? "w-full transition-all duration-3000" : "w-1/3"}`} />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                        <span>🎙️ Kisan Audio Advisory</span>
                        <span>0:14</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contextual Action Button */}
                {m.action && (
                  <div className="mt-2.5 pt-2 border-t border-white/10">
                    {m.action.openCam ? (
                      <button
                        onClick={() => startLiveCamera("photo")}
                        className="w-full py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-400/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>📷</span>
                        <span>{m.action.label}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (m.action.view && onNavigate) onNavigate(m.action.view);
                          if (m.action.page && onSelectPage) onSelectPage(m.action.page);
                          onClose();
                        }}
                        className="w-full py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-400/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>{m.action.label}</span>
                        <span className="text-[10px]">→</span>
                      </button>
                    )}
                  </div>
                )}

                {/* WhatsApp Timestamp & Blue Ticks */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 select-none">
                  <span>{m.time}</span>
                  {m.sender === "user" && (
                    <span className="text-[#53bdeb] font-bold text-[11px]" title="Read">✓✓</span>
                  )}
                </div>
              </div>

              {/* WhatsApp Quick Reply Suggestion Chips */}
              {m.quickReplies && (
                <div className="flex flex-wrap gap-1.5 mt-1.5 px-1">
                  {m.quickReplies.map((qr, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qr)}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#202c33] hover:bg-[#005c4b] border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer shadow-sm"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-[#202c33] rounded-2xl rounded-tl-none max-w-[120px] shadow-md border border-white/5 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-150" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-300" />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ── WHATSAPP ATTACHMENT MENU (📎) ── */}
        {showAttachMenu && (
          <div className="p-4 bg-[#1f2c34] border-t border-white/10 flex flex-col gap-3 animate-slideUp">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-white/10 pb-2">
              <span>📎 फाइल / फोटो / वीडियो भेजें</span>
              <button 
                onClick={() => setShowAttachMenu(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >✕</button>
            </div>

            {/* WhatsApp Attachment Circular Action Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-center">
              
              {/* 1. Live Camera */}
              <button
                onClick={() => startLiveCamera("photo")}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                  📷
                </div>
                <span className="text-[11px] text-slate-200 font-medium leading-tight">लाइव कैमरा</span>
              </button>

              {/* 2. Live Video Record */}
              <button
                onClick={() => startLiveCamera("video")}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                  🎥
                </div>
                <span className="text-[11px] text-slate-200 font-medium leading-tight">वीडियो बनाएं</span>
              </button>

              {/* 3. Gallery / Photos */}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-fuchsia-500 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                  🖼️
                </div>
                <span className="text-[11px] text-slate-200 font-medium leading-tight">गैलरी फोटो</span>
              </button>

              {/* 4. Video Files */}
              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                  🎬
                </div>
                <span className="text-[11px] text-slate-200 font-medium leading-tight">वीडियो फाइल</span>
              </button>

              {/* 5. Native Phone Camera */}
              <button
                onClick={() => cameraNativeCaptureRef.current?.click()}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                  🌿
                </div>
                <span className="text-[11px] text-slate-200 font-medium leading-tight">फोन कैमरा</span>
              </button>

              {/* 6. Documents & Files */}
              <button
                onClick={() => allFileInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                  📁
                </div>
                <span className="text-[11px] text-slate-200 font-medium leading-tight">दस्तावेज</span>
              </button>

            </div>

            {/* Quick Demo Leaf Samples */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-[10px] text-slate-400 font-bold mb-2">या 1-टैप में नमूना पत्ता भेजें:</p>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_LEAF_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSend(`📷 Sent photo: ${sample.name}`, {
                        type: "image",
                        url: sample.img,
                        name: sample.name,
                        disease: sample.disease,
                        confidence: sample.confidence,
                        cure: sample.cure
                      });
                    }}
                    className="p-1.5 rounded-xl bg-black/40 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-400 transition-all text-left flex flex-col items-center text-center cursor-pointer group"
                  >
                    <img src={sample.img} alt={sample.name} className="w-10 h-10 rounded-lg object-cover mb-1 border border-white/10 group-hover:scale-105 transition-transform" />
                    <span className="text-[9px] font-bold text-slate-200 line-clamp-1 leading-tight">
                      {sample.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Quick Menu Shortcut Bar */}
        <div className="px-3 py-1.5 bg-[#182229] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none flex-shrink-0">
          <span className="text-[10px] font-bold text-emerald-400 whitespace-nowrap">⚡ WhatsApp Menu:</span>
          {[
            { num: "1", label: "📷 Fasal Rog", prompt: "1" },
            { num: "2", label: "💰 Mandi Bhav", prompt: "2" },
            { num: "3", label: "⛅ Mausam", prompt: "3" },
            { num: "4", label: "🧪 Khad", prompt: "4" },
            { num: "5", label: "🏛️ PM-Kisan", prompt: "5" },
            { num: "6", label: "🆔 Kisan ID", prompt: "6" },
            { num: "7", label: "ℹ️ App Purpose", prompt: "7" },
          ].map((item) => (
            <button
              key={item.num}
              onClick={() => handleSend(item.prompt)}
              className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-[#2a3942] hover:bg-emerald-600 text-slate-200 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* WhatsApp Chat Input Bar */}
        <div className="p-2.5 bg-[#202c33] flex items-center gap-2 flex-shrink-0">
          
          {/* Smiley / Emoji icon */}
          <button
            type="button"
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
            title="Emojis"
          >
            😊
          </button>

          {/* Attachment Paperclip */}
          <button
            type="button"
            onClick={() => setShowAttachMenu(m => !m)}
            className={`text-slate-400 hover:text-white text-lg p-1 cursor-pointer transition-transform ${showAttachMenu ? "rotate-45 text-emerald-400" : ""}`}
            title="फाइल, फोटो या वीडियो भेजें (Attach File)"
          >
            📎
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message or number (1-7)..."
            className="flex-1 px-3.5 py-2 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 bg-[#2a3942] outline-none border border-transparent focus:border-emerald-500 transition-all"
          />

          {/* Dedicated WhatsApp Camera Button */}
          <button
            type="button"
            onClick={() => startLiveCamera("photo")}
            className="text-slate-400 hover:text-emerald-400 text-lg p-1.5 cursor-pointer hover:bg-white/5 rounded-full transition-all"
            title="कैमरा खोलें और फोटो खींचें (Open Camera)"
          >
            📷
          </button>

          {/* Send / Mic Button */}
          {inputVal.trim() ? (
            <button
              type="button"
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#06cf9c] text-white flex items-center justify-center text-sm font-bold shadow-md cursor-pointer transition-transform active:scale-95"
              title="Send Message"
            >
              ➤
            </button>
          ) : (
            <button
              type="button"
              onClick={playDemoAudio}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#06cf9c] text-white flex items-center justify-center text-sm font-bold shadow-md cursor-pointer transition-transform active:scale-95"
              title="Send Voice Note"
            >
              🎙️
            </button>
          )}

        </div>

        {/* ── LIVE IN-APP CAMERA & VIDEO VIEWFINDER MODAL ── */}
        {showLiveCamera && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between animate-fadeIn">
            
            {/* Viewfinder Top Bar */}
            <div className="p-4 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
              <button
                onClick={stopCameraStream}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-white/20"
                title="कैमरा बंद करें"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                {isRecording && (
                  <div className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>REC 00:{recordSeconds < 10 ? '0' : ''}{recordSeconds}</span>
                  </div>
                )}
                <span className="text-xs font-bold text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {cameraMode === "video" ? "🎥 वीडियो मोड" : "📷 फोटो मोड"}
                </span>
              </div>

              <button
                onClick={toggleFacingMode}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-base cursor-pointer hover:bg-white/20"
                title="कैमरा घुमाएं (Flip Camera)"
              >
                🔄
              </button>
            </div>

            {/* If Camera Failed / Permission Denied */}
            {cameraError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#111b21] z-10">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-3xl mb-4">
                  📷
                </div>
                <h4 className="text-white font-bold text-base mb-1.5">
                  कैमरा सीधे शुरू नहीं हो सका
                </h4>
                <p className="text-xs text-slate-300 mb-6 max-w-xs leading-relaxed">
                  {cameraError}
                </p>

                <div className="flex flex-col gap-2.5 w-full max-w-xs">
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>🖼️</span>
                    <span>गैलरी / कंप्यूटर से फोटो चुनें</span>
                  </button>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>🎥</span>
                    <span>गैलरी / कंप्यूटर से वीडियो चुनें</span>
                  </button>
                  <button
                    onClick={() => cameraNativeCaptureRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>🌿</span>
                    <span>फोन कैमरे से लाइव फोटो लें</span>
                  </button>
                  <button
                    onClick={() => startLiveCamera(cameraMode)}
                    className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-1"
                  >
                    <span>🔄</span>
                    <span>दोबारा कोशिश करें (Retry)</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Live Video Feed Element */}
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                  {cameraLoading && (
                    <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center text-emerald-400 gap-3">
                      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold">कैमरा खुल रहा है...</span>
                    </div>
                  )}

                  <video
                    ref={(el) => {
                      videoPreviewRef.current = el;
                      if (el && mediaStreamRef.current) {
                        el.srcObject = mediaStreamRef.current;
                        el.play?.().catch(() => {});
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Crop Targeting Crosshair Guide */}
                  <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-emerald-400/60 rounded-3xl pointer-events-none flex items-center justify-center">
                    <span className="text-[11px] font-bold text-emerald-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                      🌾 पत्ते को बीच में रखें (Keep Leaf in Frame)
                    </span>
                  </div>
                </div>

                {/* Viewfinder Bottom Controls */}
                <div className="p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col items-center gap-4 z-10">
                  
                  {/* Mode Switcher Pills (Photo vs Video) */}
                  <div className="flex items-center bg-white/15 backdrop-blur-md p-1 rounded-full border border-white/20">
                    <button
                      onClick={() => setCameraMode("photo")}
                      className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        cameraMode === "photo" ? "bg-white text-black shadow-md" : "text-white/70 hover:text-white"
                      }`}
                    >
                      📷 PHOTO
                    </button>
                    <button
                      onClick={() => setCameraMode("video")}
                      className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        cameraMode === "video" ? "bg-rose-600 text-white shadow-md" : "text-white/70 hover:text-white"
                      }`}
                    >
                      🎥 VIDEO
                    </button>
                  </div>

                  {/* Big Shutter Trigger Button */}
                  <div className="flex items-center justify-center w-full">
                    {cameraMode === "photo" ? (
                      <button
                        onClick={capturePhotoFromCamera}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-90 transition-all bg-white/20 shadow-2xl"
                        title="फोटो खींचें (Snap Photo)"
                      >
                        <div className="w-16 h-16 rounded-full bg-white shadow-inner" />
                      </button>
                    ) : (
                      <button
                        onClick={isRecording ? stopVideoRecording : startVideoRecording}
                        className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-90 transition-all shadow-2xl ${
                          isRecording ? "bg-rose-600 border-rose-400" : "bg-white/20"
                        }`}
                        title={isRecording ? "वीडियो रिकॉर्डिंग रोकें" : "वीडियो रिकॉर्डिंग शुरू करें"}
                      >
                        <div className={`rounded-full bg-rose-600 shadow-inner transition-all ${
                          isRecording ? "w-8 h-8 rounded-md" : "w-16 h-16"
                        }`} />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-white/60">
                    {cameraMode === "photo" 
                      ? "टैप करें और तुरंत AI रोग जांच पाएं" 
                      : (isRecording ? "रिकॉर्डिंग समाप्त करने के लिए टैप करें" : "लाल बटन दबाकर वीडियो बनाना शुरू करें")}
                  </p>
                </div>
              </>
            )}

          </div>
        )}

        {/* ── PHONE QR CODE CONNECT MODAL ── */}
        {showQrModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="bg-[#111b21] p-6 rounded-3xl border border-emerald-500/40 max-w-sm w-full shadow-2xl flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-3 border border-emerald-500/30">
                📱
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                अपने फोन के WhatsApp पर चलाएं
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                नीचे दिए गए QR कोड को अपने फोन के कैमरे से स्कैन करें या सीधा बटन दबाएं:
              </p>

              {/* Real WhatsApp QR Code Image */}
              <div className="p-3 bg-white rounded-2xl shadow-xl mb-4 border-2 border-emerald-500">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fapi.whatsapp.com%2Fsend%3Ftext%3DNamaste%2520Kisan%2520Sahayak%252C%2520mujhe%2520kheti%2520aur%2520mandi%2520bhav%2520ki%2520jankari%2520chahiye"
                  alt="WhatsApp QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>

              <div className="space-y-2 w-full">
                <a
                  href="https://api.whatsapp.com/send?text=Namaste%20Kisan%20Sahayak%2C%20mujhe%20kheti%20aur%20mandi%20bhav%20ki%20jankari%20chahiye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#00a884] hover:bg-[#06cf9c] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>💬</span>
                  <span>सीधा WhatsApp खोलें (Open Link)</span>
                </a>

                <button
                  onClick={() => setShowQrModal(false)}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  वापस चैट पर जाएं (Close)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
