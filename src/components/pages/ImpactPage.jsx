import { useState } from 'react';
import { translations } from '../../lib/translations';

const STORIES = [
  {
    id: 'ramesh',
    name: 'Ramesh Singh, 52',
    location: 'Aligarh, Uttar Pradesh',
    crop: 'Wheat & Mustard',
    land: '4.2 Acres',
    avatar: '👨‍🌾',
    badge: 'North India · Rabi Wheat',
    quoteHi: 'मेरी फसल में पहले कोई भी नहीं बता पाता था कि क्या रोग लगा है। अब ये AI मेरे खेत में ही बता देता है — बिना इंटरनेट के, बिना किसी डॉक्टर के। मुझे लगता है ये सच में काम का है।',
    quoteEn: 'Earlier, yellow rust would destroy my wheat before the district agronomist could visit. With Kisan Sahayak on the panchayat HP OmniBook, I get the exact fungicide dosage in 2 seconds right in my field.',
    voiceQuery: 'गेहूं के पत्तों पर पीला पाउडर दिख रहा है, क्या छिड़काव करें?',
    stats: [
      {
        val: '₹35,000',
        label: 'Saved / Harvest Season',
        labelHi: 'प्रति सीजन बचत',
        desc: 'Prevented 3 rounds of costly broad-spectrum chemical sprays',
        descHi: 'महंगे रासायनिक स्प्रे के 3 अनावश्यक चक्र रोके'
      },
      {
        val: '< 2 Sec',
        label: 'Offline Camera Scan',
        labelHi: 'ऑफ़लाइन कैमरा स्कैन',
        desc: 'Instant foliar diagnosis in connectivity dead-zones',
        descHi: 'नेटवर्क-मुक्त क्षेत्र में 2 सेकंड में पत्ती रोग निदान'
      },
      {
        val: '0 KB',
        label: 'Mobile Data Used',
        labelHi: 'इंटरनेट डेटा उपयोग',
        desc: '100% on-device inference via Snapdragon Hexagon NPU',
        descHi: 'स्नैपड्रैगन NPU पर 100% ऑन-डिवाइस निष्पादन'
      },
    ],
    endorsement: 'Extension officers manage 1,500+ farmers each. Having Kisan Sahayak running 100% offline on portable Snapdragon laptops bridges the last-mile advisory gap completely.',
    endorsementHi: 'कृषि विस्तार अधिकारी प्रति व्यक्ति 1,500+ किसानों की देखरेख करते हैं। पोर्टेबल स्नैपड्रैगन लैपटॉप पर 100% ऑफ़लाइन किसान सहायक चलने से गाँव-गाँव तक कृषि सलाह तुरंत पहुँचती है।',
    officer: 'Dr. R. K. Verma · Agronomist, District KVK Extension',
    officerHi: 'डॉ. आर. के. वर्मा · कृषि विशेषज्ञ, जिला KVK प्रसार'
  },
  {
    id: 'sunita',
    name: 'Sunita Devi, 46',
    location: 'Yavatmal, Maharashtra',
    crop: 'Bt Cotton & Soybean',
    land: '3.5 Acres',
    avatar: '👩‍🌾',
    badge: 'Vidarbha · Kharif Cotton',
    quoteHi: 'गुलाबी सुंडी (Pink Bollworm) ने पिछले साल हमारी पूरी फसल खराब कर दी थी। इस बार आवाज़ सहायक से बोलकर पूछा, तो उसने सही समय पर जैविक नीम का तेल छिड़कने की सलाह दी और कीटनाशक का खर्च आधा रह गया।',
    quoteEn: 'Pink bollworm destroyed our entire cotton crop last season. This year, I simply spoke to Awaaz Sahayak in Hindi; it advised biological neem spray at the exact right egg-hatching stage, cutting our pesticide bill by 50%.',
    voiceQuery: 'कपास के पत्तों पर छोटे छेद दिख रहे हैं, कौन सी दवाई छिड़कें?',
    stats: [
      {
        val: '50%',
        label: 'Pesticide Reduction',
        labelHi: 'कीटनाशक खर्च में कमी',
        desc: 'Replaced expensive toxic chemicals with biological neem spray',
        descHi: 'महंगे रसायनों की जगह जैविक नीम का तेल इस्तेमाल किया'
      },
      {
        val: '₹42,000',
        label: 'Yield Protected',
        labelHi: 'उपज मूल्य सुरक्षित',
        desc: 'Saved 6 quintals of raw cotton bolls from pest infestation',
        descHi: '6 क्विंटल कपास की फसल को कीटों के नुकसान से बचाया'
      },
      {
        val: 'Spoken Hindi',
        label: 'Voice-Only Interface',
        labelHi: 'बोलकर पूछने की सुविधा',
        desc: 'No typing required — handles rural dialect effortlessly',
        descHi: 'टाइपिंग की कोई जरूरत नहीं — देहाती लहजे को भी आसानी से समझता है'
      },
    ],
    endorsement: 'Farmers who hesitate to fill complex forms easily talk to Awaaz Sahayak. The Snapdragon PC audio processing ensures zero latency in village cooperatives.',
    endorsementHi: 'जो किसान फॉर्म भरने में हिचकिचाते हैं, वे आवाज़ सहायक से बेझिझक बात करते हैं। स्नैपड्रैगन लैपटॉप पर ऑडियो प्रोसेसिंग से शून्य लेटेंसी पर सलाह मिलती है।',
    officer: 'S. Patil · Agriculture Extension Field Officer',
    officerHi: 'एस. पाटिल · कृषि विस्तार क्षेत्रीय अधिकारी'
  }
];

export default function ImpactPage({ lang = 'EN' }) {
  const [activeStory, setActiveStory] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const t = translations[lang] || translations.EN;

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3 sm:mb-4"
          style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', color: '#16A34A' }}>
          <span>🌾</span>
          <span>{t.stories.badge}</span>
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight mb-3 sm:mb-5">
          {t.stories.title}
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
          {t.stories.subtext}
        </p>
      </div>

      {/* Interactive Case Study Simulator Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden mb-20">
        
        {/* Top Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">{t.stories.caseStudy}</span>
            {STORIES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStory(idx);
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsPlayingVoice(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeStory === idx
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{s.avatar}</span>
                <span>{s.name.split(',')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeStory === idx ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                  {s.crop.split('&')[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {t.stories.verifiedBadge}
            </span>
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-stretch">
          
          {/* Left Column: Quote & Audio Player */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <svg className="w-10 h-10 text-emerald-600/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  📍 {STORIES[activeStory].location} · {STORIES[activeStory].badge}
                </span>
              </div>

              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-hindi mb-4">
                "{lang === 'HI' ? STORIES[activeStory].quoteHi : STORIES[activeStory].quoteEn}"
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                "{lang === 'HI' ? STORIES[activeStory].quoteEn : STORIES[activeStory].quoteHi}"
              </p>
            </div>

            {/* Voice Player Simulator */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-slate-50 border border-emerald-500/25">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isPlayingVoice) {
                        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                        setIsPlayingVoice(false);
                      } else {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utt = new SpeechSynthesisUtterance(STORIES[activeStory].voiceQuery);
                          utt.lang = 'hi-IN';
                          utt.rate = 0.92;
                          utt.onend = () => setIsPlayingVoice(false);
                          utt.onerror = () => setIsPlayingVoice(false);
                          setIsPlayingVoice(true);
                          window.speechSynthesis.speak(utt);
                        } else {
                          setIsPlayingVoice(true);
                          setTimeout(() => setIsPlayingVoice(false), 3000);
                        }
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                    title={isPlayingVoice ? t.stories.stopAudio : t.stories.listenAudio}
                  >
                    {isPlayingVoice ? '⏹' : '▶'}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{t.stories.farmerVoiceQuery}</span>
                      {isPlayingVoice && (
                        <span className="flex gap-0.5 items-end h-3">
                          <span className="w-1 bg-emerald-600 rounded animate-bounce h-2" />
                          <span className="w-1 bg-emerald-600 rounded animate-bounce h-3 delay-75" />
                          <span className="w-1 bg-emerald-600 rounded animate-bounce h-1.5 delay-150" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-hindi font-medium">
                      "{STORIES[activeStory].voiceQuery}"
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/15 text-emerald-800">
                  {isPlayingVoice ? t.stories.playing : t.stories.audioPreview}
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>{t.stories.onDeviceSpeech}</span>
                <span className="font-semibold text-emerald-700">{t.stories.zeroCloudData}</span>
              </div>
            </div>

            {/* Farmer Profile Footer */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-2xl shadow-sm">
                {STORIES[activeStory].avatar}
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">{STORIES[activeStory].name}</div>
                <div className="text-xs text-slate-500">{STORIES[activeStory].crop} · {STORIES[activeStory].land} Holding</div>
              </div>
            </div>
          </div>

          {/* Right Column: Quantified Telemetry */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-50 p-6 sm:p-7 border border-slate-200 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {t.stories.telemetryTitle}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  {t.stories.deviceBadge}
                </span>
              </div>

              <div className="space-y-3">
                {STORIES[activeStory].stats.map((st, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono leading-none mb-1">
                      {st.val}
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {lang === 'HI' ? (st.labelHi || st.label) : st.label}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {lang === 'HI' ? (st.descHi || st.desc) : st.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-600 italic leading-relaxed mb-2">
                "{lang === 'HI' ? (STORIES[activeStory].endorsementHi || STORIES[activeStory].endorsement) : STORIES[activeStory].endorsement}"
              </p>
              <div className="text-[11px] font-bold text-slate-800">
                {lang === 'HI' ? (STORIES[activeStory].officerHi || STORIES[activeStory].officer) : STORIES[activeStory].officer}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Rural Indian Personas */}
      <div>
        <div className="text-center mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-600/10 text-emerald-700 border border-emerald-500/20 mb-3 inline-block">
            {t.personas.badge}
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mb-3">
            {t.personas.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {t.personas.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              roleBadge: 'Smallholder · < 2.5 Acres',
              roleBadgeHi: 'अल्पभूधारक · < 2.5 एकड़',
              badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
              superpower: '⚡ 0.8s Leaf Scan',
              superpowerHi: '⚡ 0.8s पत्ती स्कैन',
              superpowerBg: 'bg-amber-500/10 text-amber-700',
              accentColor: '#D97706',
              icon: '🌾',
              title: 'Marginal Grain Farmer',
              titleHi: 'अल्पभूधारक अनाज किसान',
              impact: '₹35,000 / Acre Yield Saved',
              impactHi: '₹35,000 / एकड़ फसल बचत',
              problem: 'Doctor gaon nahi aate; Yellow Rust se fasal jal jati thi.',
              problemHi: 'कृषि डॉक्टर गाँव नहीं आते; पीला रतुआ रोग से पूरी गेहूँ की फ़सल जल जाती थी।',
              solution: 'Offline camera scan detects blight at first spot with exact spray dosage.',
              solutionHi: 'ऑफ़लाइन कैमरा स्कैन पहले धब्बे पर ही रोग पकड़कर सही छिड़काव मात्रा बताता है।',
              highlight: 'Zero-internet foliar diagnosis',
              highlightHi: 'बिना इंटरनेट पत्ती रोग निदान'
            },
            {
              roleBadge: 'Cash Crops · 3–8 Acres',
              roleBadgeHi: 'नकदी फ़सलें · 3–8 एकड़',
              badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
              superpower: '🧪 Precision Bio-Dosage',
              superpowerHi: '🧪 सटीक जैविक खुराक',
              superpowerBg: 'bg-emerald-500/10 text-emerald-700',
              accentColor: '#059669',
              icon: '🌱',
              title: 'Cotton & Cash Crop Grower',
              titleHi: 'कपास व नकदी फसल किसान',
              impact: '50% Spray Cost Reduction',
              impactHi: '50% कीटनाशक खर्च में कमी',
              problem: 'Dukan wale mehengi dawa thopte the, mitti kharab hoti thi.',
              problemHi: 'दुकानदार महँगी रासायनिक दवा थोपते थे, जिससे मिट्टी की उपजाऊ क्षमता घटती थी।',
              solution: 'Calculates exact biological neem oil ml/L formulation by insect stage.',
              solutionHi: 'कीट की अवस्था के अनुसार जैविक नीम तेल का सटीक मिली/लीटर अनुपात तय करता है।',
              highlight: 'Exact chemical ml/acre dosage',
              highlightHi: 'सटीक रासायनिक मिली/एकड़ मात्रा'
            },
            {
              roleBadge: 'Daily Producer · FPO Member',
              roleBadgeHi: 'दैनिक उत्पादक · FPO सदस्य',
              badgeColor: 'bg-blue-50 text-blue-800 border-blue-200/80',
              superpower: '📈 Daily Mandi Arbitrage',
              superpowerHi: '📈 दैनिक मंडी भाव तुलना',
              superpowerBg: 'bg-blue-500/10 text-blue-700',
              accentColor: '#2563EB',
              icon: '🥦',
              title: 'Vegetable & Horticulture',
              titleHi: 'सब्जी व बागवानी उत्पादक',
              impact: '+₹350/Qtl Higher Mandi Price',
              impactHi: '+₹350/क्विंटल अधिक मंडी भाव',
              problem: 'Bhav ka pata nahi hota tha; dalal saste mein maal utha lete the.',
              problemHi: 'मंडी भाव की सही जानकारी न होने से बिचौलिए औने-पौने दाम पर माल खरीद लेते थे।',
              solution: 'Spoken Hindi audio inquiry checks daily rate across top 3 regional mandis.',
              solutionHi: 'हिंदी में बोलकर पूछने पर निकटवर्ती 3 प्रमुख मंडियों का ताज़ा भाव तुरंत मिलता है।',
              highlight: 'Voice-guided price discovery',
              highlightHi: 'आवाज़ से सही मंडी भाव की खोज'
            },
            {
              roleBadge: 'Community Hub · SHG Kiosk',
              roleBadgeHi: 'सामुदायिक केंद्र · SHG कियोस्क',
              badgeColor: 'bg-purple-50 text-purple-800 border-purple-200/80',
              superpower: '🗣️ Zero-Typing Voice DBT',
              superpowerHi: '🗣️ बिना टाइपिंग आवाज़ DBT',
              superpowerBg: 'bg-purple-500/10 text-purple-700',
              accentColor: '#7C3AED',
              icon: '🐄',
              title: 'Dairy & Village Kiosk',
              titleHi: 'पशुपालन व ग्राम कियोस्क',
              impact: '100% Scheme Inclusivity',
              impactHi: '100% सरकारी योजना समावेशिता',
              problem: 'Kam padhe-likhe bujurg online portal aur form se vanchit rehte the.',
              problemHi: 'कम पढ़े-लिखे बुज़ुर्ग किसान ऑनलाइन पोर्टल और कठिन फ़ॉर्म भरने से वंचित रह जाते थे।',
              solution: 'HP OmniBook runs as village kiosk for PM-Kisan 17th kist spoken query.',
              solutionHi: 'ग्राम पंचायत में लैपटॉप कियोस्क की तरह काम कर बोलकर PM-किसान की जानकारी देता है।',
              highlight: 'Spoken Hindi rural accessibility',
              highlightHi: 'हिंदी आवाज़ द्वारा आसान ग्रामीण पहुंच'
            },
          ].map(persona => (
            <div
              key={persona.title}
              className="rounded-3xl p-6 bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100" style={{ background: `${persona.accentColor}12` }}>
                    {persona.icon}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${persona.badgeColor}`}>
                    {lang === 'HI' ? persona.roleBadgeHi : persona.roleBadge}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 font-heading leading-tight">
                  {lang === 'HI' ? persona.titleHi : persona.title}
                </h3>
                <div className="text-xs text-slate-500 font-hindi font-medium mt-0.5">
                  {lang === 'HI' ? persona.title : persona.titleHi}
                </div>

                <div className="mt-2.5 inline-block">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${persona.superpowerBg}`}>
                    {lang === 'HI' ? persona.superpowerHi : persona.superpower}
                  </span>
                </div>

                <div className="my-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-black" style={{ color: persona.accentColor }}>
                    🎯 {lang === 'HI' ? persona.impactHi : persona.impact}
                  </div>
                </div>

                <div className="space-y-2 py-2 border-t border-slate-100 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-500">
                    <span className="font-black text-rose-500 text-[10px] uppercase tracking-wider flex-shrink-0 mt-0.5">{t.personas.before}</span>
                    <span className="leading-snug text-slate-600">
                      {lang === 'HI' ? persona.problemHi : persona.problem}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-800">
                    <span className="font-black text-emerald-600 text-[10px] uppercase tracking-wider flex-shrink-0 mt-0.5">{t.personas.solution}</span>
                    <span className="leading-snug text-slate-700 font-medium">
                      {lang === 'HI' ? persona.solutionHi : persona.solution}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{lang === 'HI' ? persona.highlightHi : persona.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
