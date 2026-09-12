import KisanLogo from '../KisanLogo';
import { translations } from '../../lib/translations';

export default function TeamPage({ onNavigate, lang = 'EN' }) {
  const t = translations[lang] || translations.EN;

  const pillars = [
    { icon: '🌾', label: lang === 'HI' ? 'कृषि (Agriculture)' : 'Agriculture', desc: lang === 'HI' ? 'फसल रोग पहचान और उपज सुरक्षा' : 'Crop disease detection & foliar protection' },
    { icon: '🍱', label: lang === 'HI' ? 'फूडटेक (FoodTech)' : 'FoodTech', desc: lang === 'HI' ? 'खेत से मंडी तक की सलाह और फसल खराबी की रोकथाम' : 'Farm-to-market advisory & post-harvest loss prevention' },
    { icon: '🏡', label: lang === 'HI' ? 'ग्रामीण विकास (Rural Dev)' : 'Rural Dev', desc: lang === 'HI' ? 'बिना इंटरनेट, हिंदी प्रथम, समावेशी तकनीक' : 'Offline-first, Hindi voice-first low-literacy UX' },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3 sm:mb-4"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#D97706' }}>
          <span>🏆</span>
          <span>{t.footer.challengeName}</span>
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight mb-3 sm:mb-5">
          {lang === 'HI' ? 'टीम किसान सहायक' : 'Team Kisan Sahayak'}
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
          {t.footer.tagline}
        </p>
      </div>

      {/* Challenge Card Banner */}
      <div className="rounded-3xl p-8 sm:p-12 bg-white border border-slate-200 shadow-xl mb-16 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span>⚡</span>
              <span>Qualcomm Snapdragon® AI Lab Build &amp; Present Challenge 2026</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 font-heading">
              {lang === 'HI' ? 'ग्रामीण भारत के लिए पहला ऑन-डिवाइस AI कृषि सहायक' : 'The First 100% On-Device Agricultural AI for Rural India'}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {lang === 'HI'
                ? 'भारत में 14.6 करोड़ से अधिक किसान हैं, जिनमें से अधिकांश ग्रामीण और कमजोर कनेक्टिविटी वाले क्षेत्रों में रहते हैं। फसल रोगों से देश को हर साल 90,000 करोड़ रुपये से अधिक का नुकसान होता है। किसान सहायक AI क्वालकॉम स्नैपड्रैगन Hexagon NPU का उपयोग करके बिना किसी इंटरनेट के खेत में तुरंत समाधान देता है।'
                : 'Over 146 million farmers in India operate in rural connectivity dead zones where crop diseases cause ₹90,000+ crore annual losses. Kisan Sahayak AI eliminates cloud reliance by executing full multimodal inference on Qualcomm Hexagon NPU.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 w-full lg:w-80 flex-shrink-0">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.footer.challengeTrack}
            </div>
            <div className="text-lg font-black text-slate-900">{t.footer.challengeName}</div>
            <div className="text-xs text-slate-600">{t.footer.challengeSubtitle}</div>
            <div className="pt-3 border-t border-slate-200">
              <span className="font-semibold text-xs text-slate-700 block">{t.footer.themeTrack}</span>
              <span className="text-sm font-bold text-emerald-700">{t.footer.themeValue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="mb-16">
        <h3 className="text-xl font-black text-slate-900 mb-6 text-center font-heading">
          {lang === 'HI' ? 'थीम संरेखण (Theme Alignment)' : 'Hackathon Theme Pillars'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(p => (
            <div key={p.label} className="p-6 rounded-3xl bg-white border border-slate-200 text-center shadow-md hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">{p.icon}</div>
              <div className="text-lg font-bold text-slate-900 mb-2">{p.label}</div>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Collaboration Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <KisanLogo size={56} theme="dark" />
          <div>
            <h4 className="text-xl font-bold">{t.footer.builtFor}</h4>
            <p className="text-xs text-slate-300 mt-1">Qualcomm Snapdragon X Elite / X Plus · Qualcomm Hexagon NPU (45 TOPS) · HP OmniBook PC</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('vision')}
          className="px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer flex-shrink-0"
        >
          {lang === 'HI' ? 'लाइव डेमो चलाएं →' : 'Launch Prototype Demo →'}
        </button>
      </div>
    </div>
  );
}
