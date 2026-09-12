import { translations } from '../lib/translations';

export default function LandingPage({
  onNavigate,
  onOpenHistory,
  onOpenAbout,
  onOpenBenchmark,
  onSelectPage,
  lang = 'EN'
}) {
  const t = translations[lang] || translations.EN;
  const G = '#16A34A';
  const N = '#0F172A';
  const GR = '#6B7280';

  return (
    <div className="landing-root animate-fade-in">
      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section id="hero" className="py-8 sm:py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wide mb-6 sm:mb-8"
              style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', color: G }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              {t.hero.badge}
            </div>

            <h1 className="font-heading font-black leading-tight mb-4 sm:mb-5"
              style={{ fontSize: 'clamp(2.1rem,5.5vw,4rem)', color: N, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {t.hero.headline1}<br />
              <span style={{ color: G }}>{t.hero.headlineHighlight}</span>
            </h1>

            <p className="text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl leading-relaxed" style={{ color: GR }}>
              {t.hero.subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <button
                onClick={() => onNavigate('vision')}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-200 cursor-pointer shadow-md text-center flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', boxShadow: '0 4px 18px rgba(22,163,74,0.35)' }}
              >
                {t.hero.btnAdvisory}
              </button>
              <button
                onClick={() => onNavigate('voice')}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer bg-white border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-center flex items-center justify-center"
                style={{ color: '#374151' }}
              >
                {t.hero.btnVoice}
              </button>
            </div>

            {/* Direct Page Link */}
            {onSelectPage && (
              <button
                onClick={() => onSelectPage('how-it-works')}
                className="text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t.hero.btnFacilitator}</span>
              </button>
            )}
          </div>

          {/* Right — Hero image + overlay card */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: '440px' }}>
              <img src="/farmer-hero.jpg" alt="Indian farmer using Kisan Sahayak AI app in a wheat field"
                className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 55%)' }} />

              {/* Floating detection card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl px-4 py-3.5 flex items-start gap-3"
                style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>🔬</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{t.hero.cardDetectionTitle}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">{t.hero.cardLive}</span>
                  </div>
                  <div className="text-sm font-semibold mb-1 text-rose-600">
                    {t.hero.cardDiseaseDetected}
                  </div>
                  <div className="text-xs font-medium text-emerald-700">{t.hero.cardOfflineComplete}</div>
                </div>
              </div>

              {/* Top-right NPU badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-md">
                {t.hero.cardNpuBadge}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TICKER STRIP
      ══════════════════════════════════════════ */}
      <div className="ticker-wrapper" style={{ width: '100%', overflow: 'hidden', background: '#F3F4F6', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '16px 0' }}>
        <div className="ticker-inner">
          <div className="ticker-group">
            {t.ticker.map((item, i) => (
              <span key={`a-${i}`} className="ticker-item">
                <span className="ticker-text">{item}</span>
                <span className="ticker-sep">◆</span>
              </span>
            ))}
          </div>
          <div className="ticker-group" aria-hidden="true">
            {t.ticker.map((item, i) => (
              <span key={`b-${i}`} className="ticker-item">
                <span className="ticker-text">{item}</span>
                <span className="ticker-sep">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PAGE EXPLORER GRID (Clean, non-bloated navigation)
      ══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
          PAGE EXPLORER GRID (Clean, non-bloated navigation)
      ══════════════════════════════════════════ */}
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3 inline-block">
            {lang === 'HI' ? 'अन्वेषण करें' : 'EXPLORE SYSTEM'}
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-3 sm:mb-4">
            {lang === 'HI' ? 'चार प्रमुख स्तंभों में समझें' : 'Everything Designed for Zero Connectivity'}
          </h2>
          <p className="text-sm sm:text-lg max-w-2xl mx-auto text-slate-600">
            {lang === 'HI' 
              ? 'उत्पाद, तकनीक, किसान प्रभाव और प्रतियोगिता मिशन को अलग-अलग पेजों में विस्तार से देखें।'
              : 'Explore our product suite, Qualcomm hardware pipeline, real field validation, and challenge mission in dedicated sections.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Product */}
          <div
            onClick={() => onSelectPage && onSelectPage('product')}
            className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                🌿
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider">{t.nav.product}</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-1.5 sm:mb-2">
                {lang === 'HI' ? 'AI उत्पाद व सुविधाएं' : 'AI Product Suite'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'HI' 
                  ? 'फोटो फसल रोग विश्लेषण, हिंदी व हिंग्लिश आवाज़ सहायक और शून्य-क्लाउड स्थानीय सुरक्षा।'
                  : 'Photo crop diagnosis, natural Hindi voice advisory, and on-device data confidentiality.'}
              </p>
            </div>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{lang === 'HI' ? 'उत्पाद देखें' : 'View Product'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: How It Works */}
          <div
            onClick={() => onSelectPage && onSelectPage('how-it-works')}
            className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider">{t.nav.howItWorks}</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-1.5 sm:mb-2">
                {lang === 'HI' ? 'हार्डवेयर व NPU पाइपलाइन' : 'Qualcomm NPU Stack'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'HI'
                  ? 'Snapdragon X Series, 45 TOPS हेक्सागोन NPU, 5-चरणीय संकलन और 38ms लेटेंसी।'
                  : 'Snapdragon X Elite, 45 TOPS Hexagon Tensor Processor, INT8 quantization & 38ms latency.'}
              </p>
            </div>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>{lang === 'HI' ? 'तकनीक समझें' : 'See How It Works'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Impact */}
          <div
            onClick={() => onSelectPage && onSelectPage('impact')}
            className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                👨‍🌾
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider">{t.nav.impact}</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-1.5 sm:mb-2">
                {lang === 'HI' ? 'किसान अनुभव व प्रमाण' : 'Farmer Validation'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'HI'
                  ? 'वास्तविक किसानों (रमेश, सुनीता) के ऑडियो केस स्टडीज़ और 4 ग्रामीण किसान प्रोफाइल।'
                  : 'Interactive field audio test cases from Aligarh & Yavatmal with KVK trial telemetry.'}
              </p>
            </div>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{lang === 'HI' ? 'प्रभाव देखें' : 'View Impact'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Team */}
          <div
            onClick={() => onSelectPage && onSelectPage('team')}
            className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                🏆
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 uppercase tracking-wider">{t.nav.team}</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-1.5 sm:mb-2">
                {lang === 'HI' ? 'टीम व प्रतियोगिता' : 'Challenge Track'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'HI'
                  ? 'Qualcomm Snapdragon® AI Lab हैकाथॉन, HP PC साझेदारी और परियोजना मिशन।'
                  : 'Qualcomm Snapdragon AI Lab Hackathon 2026 track & HP OmniBook deployment vision.'}
              </p>
            </div>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>{lang === 'HI' ? 'टीम विवरण' : 'Meet Team'}</span>
              <span>→</span>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA BAR
      ══════════════════════════════════════════ */}
      <section className="pb-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="rounded-3xl p-6 sm:p-12 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-center sm:text-left">
          <div>
            <span className="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-emerald-100 uppercase mb-2 inline-block">
              ⚡ Live On-Device Prototype
            </span>
            <h3 className="text-xl sm:text-3xl font-black font-heading mt-1">
              {lang === 'HI' ? 'किसान सहायक AI को लाइव चलाकर देखें' : 'Test Kisan Sahayak Right in Your Browser'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-xl">
              {lang === 'HI'
                ? 'कैमरा पत्ती रोग निदान और हिंदी आवाज़ सलाह को सीधे आजमाएं — शून्य क्लाउड निर्भरता।'
                : 'Experience instant foliar image analysis and Hindi voice assistance with zero cloud dependency.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={() => onNavigate('vision')}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer shadow-md text-center flex items-center justify-center"
            >
              📷 {lang === 'HI' ? 'फसल डॉक्टर चलाएं' : 'Launch Crop Doctor'}
            </button>
            <button
              onClick={() => onNavigate('voice')}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-900/40 text-white hover:bg-emerald-900/60 border border-emerald-400/30 transition-all cursor-pointer text-center flex items-center justify-center"
            >
              🎙️ {lang === 'HI' ? 'आवाज़ सहायक' : 'Voice Assistant'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
