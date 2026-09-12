import { translations } from '../../lib/translations';

export default function ProductPage({ onNavigate, lang = 'EN' }) {
  const t = translations[lang] || translations.EN;
  const G = '#16A34A';
  const A = '#F59E0B';
  const N = '#0F172A';
  const GR = '#6B7280';

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 animate-fade-in">
      {/* Page Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3 sm:mb-4"
          style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', color: G }}>
          <span>🌿</span>
          <span>{t.product.badge}</span>
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight mb-3 sm:mb-5">
          {t.product.title}
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
          {t.product.subtext}
        </p>
      </div>

      {/* 3 Core Product Pillars — Expanded Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        
        {/* Module 1: Photo Crop Diagnosis */}
        <div className="l-card p-8 flex flex-col justify-between border border-slate-200/90 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all">
          <div>
            <div className="rounded-2xl overflow-hidden mb-6 relative flex items-center justify-center p-8"
              style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
              <span className="text-7xl animate-bounce">🌿</span>
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(22,163,74,0.15)', color: G, border: '1px solid rgba(22,163,74,0.3)' }}>
                {t.product.card1Badge}
              </div>
            </div>

            <h2 className="text-2xl font-black mb-3 font-heading text-slate-900">
              {t.product.card1Title}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6 text-slate-600">
              {t.product.card1Desc}
            </p>

            <div className="rounded-2xl p-4 text-sm font-medium mb-6 border border-emerald-200" style={{ background: '#F0FDF4', color: '#166534' }}>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                {lang === 'HI' ? 'लाइव AI आउटपुट नमूना' : 'Live On-Device Extraction'}
              </div>
              {t.product.card1Result}
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{lang === 'HI' ? 'अत्यंत तेज़: 2 सेकंड से कम में निदान' : 'Sub-2 second neural inference latency'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{lang === 'HI' ? '146+ फसल रोग लक्षण पहचानने में सक्षम' : 'PlantVillage botanical disease classification'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{lang === 'HI' ? 'ICAR प्रमाणित रासायनिक व जैविक उपचार' : 'ICAR-verified step-by-step treatment dosages'}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('vision')}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
          >
            <span>{t.product.card1Cta}</span>
          </button>
        </div>

        {/* Module 2: Hindi Voice Intelligence */}
        <div className="l-card p-8 flex flex-col justify-between border border-slate-200/90 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all">
          <div>
            <div className="rounded-2xl overflow-hidden mb-6 flex flex-col items-center justify-center gap-3 p-8 relative"
              style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)' }}>
              <div className="flex items-center gap-1.5 h-12">
                {[8, 14, 26, 18, 30, 20, 12, 24, 16, 10].map((h, i) => (
                  <div key={i} className="rounded-full"
                    style={{ width: '4px', height: `${h}px`, background: A, animation: `waveBar ${0.5 + i * 0.08}s ease-in-out infinite alternate`, animationDelay: `${i * 0.07}s` }} />
                ))}
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full absolute top-3 right-3"
                style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                ⚡ 0.9s Voice Response
              </span>
            </div>

            <h2 className="text-2xl font-black mb-3 font-heading text-slate-900">
              {t.product.card2Title}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6 text-slate-600">
              {t.product.card2Desc}
            </p>

            <div className="rounded-2xl p-4 mb-6 border border-amber-200" style={{ background: '#FFFBEB' }}>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                {lang === 'HI' ? 'किसान का सवाल व AI जवाब' : 'Spoken Dialogue Example'}
              </div>
              <p className="text-sm font-hindi font-bold mb-1 text-amber-900">
                {t.product.card2SampleQ}
              </p>
              <p className="text-xs font-medium text-amber-800 font-hindi">
                {t.product.card2SampleA}
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span>{lang === 'HI' ? 'शुद्ध ग्रामीण हिंदी व बोलियों की समझ' : 'Understands rural accents & Indian crop dialects'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span>{lang === 'HI' ? '12+ कृषि श्रेणियां: मौसम, खाद, मंडी, योजनाएं' : '12 agricultural intent categories'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span>{lang === 'HI' ? 'अक्षमता-मुक्त: बिना टाइप किए बोलकर उत्तर' : 'Zero-typing voice UI for low-literacy farmers'}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('voice')}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
          >
            <span>{t.product.card2Cta}</span>
          </button>
        </div>

        {/* Module 3: Zero-Cloud Privacy & Security */}
        <div className="l-card p-8 flex flex-col justify-between border border-slate-200/90 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all">
          <div>
            <div className="rounded-2xl overflow-hidden mb-6 flex flex-col items-center justify-center gap-2 p-8 relative"
              style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
              <div className="text-6xl">🔒</div>
              <span className="text-xs font-bold px-3 py-1 rounded-full absolute top-3 right-3"
                style={{ background: 'rgba(59,130,246,0.12)', color: '#1D4ED8', border: '1px solid rgba(59,130,246,0.3)' }}>
                Hexagon NPU Ready
              </span>
            </div>

            <h2 className="text-2xl font-black mb-3 font-heading text-slate-900">
              {t.product.card3Title}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6 text-slate-600">
              {t.product.card3Desc}
            </p>

            <div className="rounded-2xl p-4 flex flex-col gap-2 mb-6 border border-blue-200" style={{ background: '#EFF6FF' }}>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                {t.product.card3Pill1}
              </div>
              <div className="text-xs text-blue-700">
                {t.product.card3Pill2}
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>{lang === 'HI' ? 'खेत में शून्य इंटरनेट: 0 KB क्लाउड डेटा' : 'Zero internet connection needed in fields'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>{lang === 'HI' ? 'Snapdragon SPU द्वारा एन्क्रिप्टेड स्टोरेज' : 'Snapdragon Secure Processing Unit (SPU)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>{lang === 'HI' ? 'किसान के आधार व भूमि डेटा की पूर्ण सुरक्षा' : 'Aadhaar & soil record hardware encryption'}</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-semibold text-slate-700">
            🛡️ {lang === 'HI' ? '100% ऑन-डिवाइस आर्किटेक्चर' : '100% On-Device Neural Architecture'}
          </div>
        </div>

      </div>

      {/* Product Roadmap / Future Scope Section */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase mb-3 inline-block">
            {t.roadmap.badge}
          </span>
          <h3 className="text-3xl sm:text-4xl font-black font-heading mb-3">
            {t.roadmap.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-300">
            {t.roadmap.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all">
            <div className="text-3xl mb-3">🗣️</div>
            <h4 className="text-lg font-bold mb-2 text-white">{t.roadmap.card1Title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{t.roadmap.card1Desc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all">
            <div className="text-3xl mb-3">🌾</div>
            <h4 className="text-lg font-bold mb-2 text-white">{t.roadmap.card2Title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{t.roadmap.card2Desc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all">
            <div className="text-3xl mb-3">📡</div>
            <h4 className="text-lg font-bold mb-2 text-white">{t.roadmap.card3Title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{t.roadmap.card3Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
