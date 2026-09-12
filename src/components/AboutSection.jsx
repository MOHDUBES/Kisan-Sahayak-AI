import KisanLogo from './KisanLogo';
import { translations } from '../lib/translations';

export default function AboutSection({ lang = 'EN', onClose }) {
  const t = translations[lang]?.about || translations.EN.about;

  const modules = [
    {
      icon: '📷',
      name: lang === 'HI' ? 'किसान कवच' : 'Kisan Kavach',
      nameHindi: 'किसान कवच',
      desc: lang === 'HI' ? 'फसल पत्ती रोग निदान' : 'Crop Disease Detector',
      demoTech: 'TensorFlow.js MobileNet v2',
      prodTech: 'QNN PlantVillage · Hexagon NPU',
      accentColor: '#059669',
      border: '#a7f3d0',
      bg: '#ecfdf5',
    },
    {
      icon: '🎙️',
      name: lang === 'HI' ? 'आवाज़ सहायक' : 'Awaaz Sahayak',
      nameHindi: 'आवाज़ सहायक',
      desc: lang === 'HI' ? 'प्रांतीय वॉइस AI सहायक' : 'Voice AI Assistant',
      demoTech: 'Web Speech API + Rule-based NLP',
      prodTech: 'QNN MobileBERT · Hexagon NPU',
      accentColor: '#d97706',
      border: '#fde68a',
      bg: '#fffbeb',
    },
  ];

  const pillarsHI = [
    { icon: '🌾', label: 'कृषि (Agriculture)', desc: 'फसल रोग निदान एवं उपज सुरक्षा' },
    { icon: '🍱', label: 'फूडटेक (FoodTech)', desc: 'खेत से मंडी सलाह और फसल खराबी की रोकथाम' },
    { icon: '🏡', label: 'ग्रामीण विकास (Rural Dev)', desc: '100% ऑफ़लाइन, हिंदी-प्रथम सरल अनुभव' },
  ];

  const pillarsEN = [
    { icon: '🌾', label: 'Agriculture', desc: 'Crop disease detection & yield protection' },
    { icon: '🍱', label: 'FoodTech', desc: 'Farm-to-market advisory & spoilage loss prevention' },
    { icon: '🏡', label: 'Rural Dev', desc: 'Offline-first, Hindi-first low-literacy UX' },
  ];

  const pillars = lang === 'HI' ? pillarsHI : pillarsEN;

  const npuHI = [
    { label: 'मॉडल एक्सपोर्ट', val: 'PlantVillage EfficientNet → ONNX → QNN .dlc (क्वालकॉम AI हब द्वारा)' },
    { label: 'क्वांटाइजेशन', val: 'INT8 वेट क्वांटाइजेशन — 4× छोटा बाइनरी, हेक्सागोन NPU पर 10× तेज़' },
    { label: 'रनटाइम', val: 'स्नैपड्रैगन X Elite और मोबाइल SoCs हेतु QNN SDK HTP बैकएंड' },
    { label: 'बिजली की बचत', val: '~0.5W बनाम 15W डिस्क्रीट GPU — 30× बचत, पूरे दिन खेत में बैटरी लाइफ' },
    { label: 'लेटेंसी', val: 'हेक्सागोन NPU पर <50ms प्रति पत्ती — खेत में तुरंत सटीक परिणाम' },
    { label: 'गोपनीयता', val: 'शून्य डेटा डिवाइस से बाहर जाता है — क्वालकॉम SPU हार्डवेयर सुरक्षा' },
  ];

  const npuEN = [
    { label: 'Model Export', val: 'PlantVillage EfficientNet → ONNX → QNN .dlc via Qualcomm AI Hub' },
    { label: 'Quantization', val: 'INT8 weight quant — 4× smaller binary, 10× faster on Hexagon NPU' },
    { label: 'Runtime', val: 'QNN SDK HTP backend targeting Snapdragon X Elite & mobile SoCs' },
    { label: 'Power Draw', val: '~0.5W vs 15W discrete GPU — 30× reduction, ideal for farm battery life' },
    { label: 'Latency', val: '<50ms per leaf image on Hexagon NPU — instant on-field diagnosis' },
    { label: 'Privacy', val: 'Zero data leaves device — Qualcomm SPU hardware-backed storage' },
  ];

  const npu = lang === 'HI' ? npuHI : npuEN;

  return (
    <div className="animate-slide-up w-full max-w-4xl mx-auto space-y-8 pt-2 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden sm:block">
            <KisanLogo size={56} showText={false} layout="icon-only" theme="light" />
          </div>
          <div className="sm:hidden">
            <KisanLogo size={40} showText={false} layout="icon-only" theme="light" />
          </div>
          <div>
            <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] sm:text-xs font-semibold tracking-wide mb-1">
              {t.badge}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">{t.title}</h2>
            <p className="text-xs sm:text-sm font-hindi mt-0.5 sm:mt-1 text-slate-500">
              {t.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all cursor-pointer flex-shrink-0"
        >
          ✕ {t.close}
        </button>
      </div>

      {/* Theme Alignment */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3.5 text-slate-500">
          {lang === 'HI' ? 'थीम संरेखण — कृषि, फूडटेक और ग्रामीण विकास' : 'Theme Alignment — Agriculture, FoodTech & Rural Development'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pillars.map(p => (
            <div key={p.label} className="card p-5 text-center border border-slate-200 bg-white hover:border-emerald-300 shadow-sm transition-all">
              <div className="text-4xl mb-3">{p.icon}</div>
              <div className="text-base font-bold text-slate-900">{p.label}</div>
              <div className="text-xs mt-1.5 leading-relaxed text-slate-600">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Statement */}
      <div className="p-6 sm:p-7 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎯</span>
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'HI' ? 'भारतीय कृषि की जमीनी हकीकत' : 'The Ground Reality in Indian Agriculture'}
          </h3>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700">
          {lang === 'HI' ? (
            <>
              भारत में <strong className="text-emerald-700 font-bold">14.6 करोड़ से अधिक किसान</strong> हैं, जिनमें से अधिकांश कमजोर इंटरनेट या नेटवर्क-विहीन क्षेत्रों में काम करते हैं। फसल रोगों से देश को हर वर्ष अनुमानित <strong className="text-amber-700 font-bold">₹90,000+ करोड़ का नुकसान</strong> होता है। मौजूदा क्लाउड आधारित ऐप्स नेटवर्क कटते ही बंद हो जाते हैं। किसान सहायक AI क्वालकॉम स्नैपड्रैगन हेक्सागोन NPU द्वारा सभी इंटेलिजेंस डिवाइस पर रखकर इस समस्या का स्थायी समाधान करता है।
            </>
          ) : (
            <>
              India has <strong className="text-emerald-700 font-bold">146 million+ farmers</strong>, most operating in rural areas with intermittent 2G/3G connectivity or complete dead zones. Crop diseases inflict an estimated <strong className="text-amber-700 font-bold">₹90,000+ crore annual loss</strong>. Existing cloud-reliant solutions fail when connectivity drops. Kisan Sahayak AI solves this by keeping all intelligence on-device via Qualcomm Snapdragon Hexagon NPU.
            </>
          )}
        </p>
      </div>

      {/* AI Modules — Demo vs Production */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3.5 text-slate-500">
          {lang === 'HI' ? 'AI मॉड्यूल — डेमो प्रोटोटाइप बनाम स्नैपड्रैगन प्रोडक्शन आर्किटेक्चर' : 'AI Modules — Demo Prototype vs Snapdragon Production Architecture'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map(m => (
            <div key={m.name} className="card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                    {m.icon}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900">{m.name}</div>
                    <div className="text-xs font-hindi font-semibold" style={{ color: m.accentColor }}>{m.nameHindi} · {m.desc}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                <div className="rounded-xl p-3 bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                    {lang === 'HI' ? 'डेमो (वर्तमान)' : 'DEMO (Current)'}
                  </div>
                  <div className="text-xs font-medium text-slate-700">{m.demoTech}</div>
                </div>
                <div className="rounded-xl p-3" style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: m.accentColor }}>
                    {lang === 'HI' ? 'स्नैपड्रैगन प्रोडक्शन' : 'SNAPDRAGON PROD'}
                  </div>
                  <div className="text-xs font-semibold text-slate-900">{m.prodTech}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snapdragon NPU Details */}
      <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚡</span>
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'HI' ? 'स्नैपड्रैगन NPU अनुकूलन एवं परिनियोजन योजना' : 'Snapdragon NPU Optimization & Deployment Plan'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {npu.map(item => (
            <div key={item.label} className="p-3.5 rounded-xl bg-white border border-amber-100 shadow-xs">
              <span className="text-xs font-bold block mb-1 text-amber-700">{item.label}</span>
              <span className="text-xs leading-relaxed text-slate-600">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Credentials */}
      <div className="text-center pt-4 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-600">
          🏆 Qualcomm Snapdragon AI Lab Build &amp; Present Challenge
        </p>
        <p className="text-xs mt-1 text-slate-400">
          {lang === 'HI'
            ? 'थीम: कृषि, फूडटेक और ग्रामीण विकास · 100% ऑफ़लाइन मल्टी-मोडल आर्किटेक्चर'
            : 'Theme: Agriculture, FoodTech & Rural Development · Offline-First Multi-Modal Architecture'}
        </p>
      </div>
    </div>
  );
}
