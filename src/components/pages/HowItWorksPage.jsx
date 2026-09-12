import { translations } from '../../lib/translations';

export default function HowItWorksPage({ onOpenBenchmark, onNavigate, lang = 'EN' }) {
  const t = translations[lang] || translations.EN;
  const G = '#16A34A';
  const A = '#F59E0B';
  const N = '#0F172A';
  const GR = '#6B7280';

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3 sm:mb-4"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', color: '#2563EB' }}>
          <span>⚡</span>
          <span>{t.architecture.badge}</span>
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight mb-3 sm:mb-5">
          {t.architecture.title}
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
          {t.architecture.subtext}
        </p>
      </div>

      {/* 3 Foundation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: '⚡', color: G, bg: '#F0FDF4', border: 'rgba(22,163,74,0.25)',
            title: t.architecture.card1Title,
            tags: ['TF.js MobileNet (Demo)', 'QNN PlantVillage DLC (Prod)', 'Hexagon NPU · INT8 · <50ms'],
            desc: t.architecture.card1Desc,
          },
          {
            icon: '🗣️', color: A, bg: '#FFFBEB', border: 'rgba(245,158,11,0.25)',
            title: t.architecture.card2Title,
            tags: ['Hindi STT via Web Speech API', 'Rule-based intent detection (12 intents)', 'Hindi TTS · hi-IN synthesis'],
            desc: t.architecture.card2Desc,
          },
          {
            icon: '🔬', color: '#3B82F6', bg: '#EFF6FF', border: 'rgba(59,130,246,0.25)',
            title: t.architecture.card3Title,
            tags: ['Disease → Severity classification', 'Hindi treatment steps database', 'Source-cited, transparent logic'],
            desc: t.architecture.card3Desc,
          },
        ].map(item => (
          <div key={item.title} className="l-card p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 font-heading text-slate-900">{item.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: item.bg, color: item.color, border: `1px solid ${item.border}` }}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Qualcomm Snapdragon Hexagon NPU Production Pipeline */}
      <div className="rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-white to-slate-50 shadow-xl mb-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/10 text-emerald-700 border border-emerald-500/25">
                {t.architecture.pipeBadge1}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/25">
                {t.architecture.pipeBadge2}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {t.architecture.pipeHeading}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              {t.architecture.pipeSubtext}
            </p>
          </div>

          {onOpenBenchmark && (
            <button
              onClick={onOpenBenchmark}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-700/20 transition-all duration-200 cursor-pointer flex items-center gap-2 flex-shrink-0"
            >
              <span>{t.architecture.btnBenchmark}</span>
            </button>
          )}
        </div>

        {/* 5-Step Hardware Flow */}
        <div className="pt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
            {[
              { step: '01', title: 'PyTorch / TF Model', desc: 'PlantVillage Botanical foliar dataset & Hindi NLU corpus' },
              { step: '02', title: 'ONNX Quantizer', desc: 'W8A8 INT8 quantization for 4× memory footprint reduction' },
              { step: '03', title: 'Qualcomm AI Hub', desc: 'Compilation to hardware-native .dlc container via AI Hub CLI' },
              { step: '04', title: 'QNN HTP Runtime', desc: 'Hexagon Tensor Processor execution provider on Windows ARM' },
              { step: '05', title: 'Hexagon 45 TOPS', desc: 'Sub-40ms zero-cloud edge inference with ~0.45W power draw' }
            ].map((s, idx) => (
              <div key={s.step} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      STEP {s.step}
                    </span>
                    {idx < 4 && (
                      <span className="hidden lg:inline text-emerald-500 font-black text-sm">→</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{s.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {[
              { val: '38 ms', label: t.architecture.metric1Label, sub: t.architecture.metric1Sub },
              { val: '~0.45 W', label: t.architecture.metric2Label, sub: t.architecture.metric2Sub },
              { val: '26+ Hours', label: t.architecture.metric3Label, sub: t.architecture.metric3Sub },
              { val: '0 Bytes', label: t.architecture.metric4Label, sub: t.architecture.metric4Sub },
            ].map(m => (
              <div key={m.label} className="p-4 rounded-2xl bg-white/90 border border-emerald-100 text-center shadow-sm">
                <div className="text-2xl font-black text-emerald-700 font-mono">{m.val}</div>
                <div className="text-xs font-bold text-slate-800 mt-1">{m.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HP OmniBook PC Integration Banner */}
      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-300/40 uppercase mb-2 inline-block">
            💻 HP OmniBook AI PC
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            {lang === 'HI' ? 'HP OmniBook पर 100% ऑफ़लाइन ग्राम फील्ड ट्रायल' : 'Engineered for HP OmniBook Snapdragon Field Deployment'}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {lang === 'HI' 
              ? 'ग्राम पंचायतों और कृषि विस्तार अधिकारियों के लिए विशेष रूप से अनुकूलित। पूरे दिन की बैटरी लाइफ के साथ बिना इंटरनेट खेतों में त्वरित परामर्श।'
              : 'Empowering Panchayat field officers and district KVK scientists with 26+ hour battery endurance and zero-cloud on-device foliar scanning.'}
          </p>
        </div>
        <button
          onClick={() => onNavigate('vision')}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer flex-shrink-0"
        >
          {lang === 'HI' ? 'लाइव कैमरा टेस्ट करें →' : 'Test Vision Inference →'}
        </button>
      </div>
    </div>
  );
}
