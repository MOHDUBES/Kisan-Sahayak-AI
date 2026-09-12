import { useState, useEffect } from 'react';
import { translations } from '../lib/translations';
import { CROP_CATEGORIES, ALL_CROPS } from '../lib/cropsData';

const DEMO_FARMERS = [
  {
    name: 'रामेश्वर सिंह (Rameshwar Singh)',
    contact: '98765 43210',
    contactType: 'phone',
    location: 'अलीगढ़ (Aligarh), उत्तर प्रदेश',
    crop: '🌾 गेहूं और सरसों (Wheat & Mustard)',
    avatar: '👨‍🌾',
    kisanId: 'KS-UP-1042',
    land: '4.2 Acres',
    isVerified: true,
  },
  {
    name: 'सुनीता ताई पाटिल (Sunita Tai)',
    contact: 'sunita.patil.kisan@gmail.com',
    contactType: 'gmail',
    location: 'यवतमाल (Yavatmal), महाराष्ट्र',
    crop: '☁️ कपास और सोयाबीन (Cotton & Soy)',
    avatar: '👩‍🌾',
    kisanId: 'KS-MH-2081',
    land: '6.5 Acres',
    isVerified: true,
  },
  {
    name: 'हरप्रीत सिंह (Harpreet Singh)',
    contact: '98140 88231',
    contactType: 'phone',
    location: 'लुधियाना (Ludhiana), पंजाब',
    crop: '🌾 धान और गेहूं (Paddy & Wheat)',
    avatar: '🌾',
    kisanId: 'KS-PB-3019',
    land: '8.0 Acres',
    isVerified: true,
  },
];

export default function AuthModal({ lang = 'EN', onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [contact, setContact] = useState(''); // phone number or gmail
  const [location, setLocation] = useState('');
  const [crop, setCrop] = useState('🌾 गेहूं (Wheat)');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loggedInFarmer, setLoggedInFarmer] = useState(null);
  const [idCopied, setIdCopied] = useState(false);

  const t = translations[lang]?.auth || translations.EN.auth;

  // Countdown timer for OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const isEmail = (val) => val.includes('@');

  const finishLogin = (farmer) => {
    const target = farmer || loggedInFarmer;
    if (onLoginSuccess && target) onLoginSuccess(target);
    onClose();
  };

  const handleQuickLogin = (farmer) => {
    try {
      localStorage.setItem('kisan_user', JSON.stringify(farmer));
    } catch {}
    window.dispatchEvent(new Event('kisan_user_updated'));
    setLoggedInFarmer(farmer);
  };

  const handleSendOtp = () => {
    setError('');
    const cleanContact = contact.trim();

    if (!cleanContact) {
      setError(
        lang === 'HI'
          ? 'कृपया पहले अपना 10-अंकीय मोबाइल नंबर या Gmail दर्ज करें'
          : 'Please enter your 10-digit mobile number or Gmail first'
      );
      return;
    }

    if (isEmail(cleanContact)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanContact)) {
        setError(
          lang === 'HI'
            ? 'कृपया मान्य Gmail दर्ज करें (उदा. kisan@gmail.com)'
            : 'Please enter a valid Gmail address'
        );
        return;
      }
    } else {
      const digitsOnly = cleanContact.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setError(
          lang === 'HI'
            ? 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें'
            : 'Please enter a valid 10-digit mobile number'
        );
        return;
      }
    }

    setOtpSent(true);
    setCountdown(30);
    setError('');
    setSuccessMsg(
      lang === 'HI'
        ? `OTP भेज दिया गया है! (डेमो कोड: 1234)`
        : `OTP sent! (Demo Code: 1234)`
    );
  };

  const handleAutoFillOtp = () => {
    setOtp('1234');
    setIsVerified(true);
    setError('');
    setSuccessMsg(
      lang === 'HI' ? '✓ OTP 1234 सत्यापित हो गया!' : '✓ OTP 1234 Verified!'
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanContact = contact.trim();
    if (!cleanContact) {
      setError(
        lang === 'HI'
          ? 'कृपया अपना मोबाइल नंबर या Gmail पता दर्ज करें'
          : 'Please enter your mobile number or Gmail address'
      );
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError(lang === 'HI' ? 'कृपया किसान का नाम दर्ज करें' : 'Please enter farmer full name');
      return;
    }

    // If OTP was sent but not filled
    if (otpSent && otp.trim() !== '1234' && !isVerified) {
      setError(
        lang === 'HI'
          ? 'कृपया सही 4-अंकीय OTP (1234) दर्ज करें या ऑटो-फिल दबाएं'
          : 'Please enter valid 4-digit OTP (1234) or click Auto-Fill'
      );
      return;
    }

    const type = isEmail(cleanContact) ? 'gmail' : 'phone';
    const farmerProfile = {
      name: name.trim() || (lang === 'HI' ? `किसान (${cleanContact.slice(-4)})` : `Farmer (${cleanContact.slice(-4)})`),
      contact: cleanContact,
      phone: !isEmail(cleanContact) ? cleanContact : '',
      contactType: type,
      location: location.trim() || (lang === 'HI' ? 'ग्रामीण भारत (Rural India)' : 'Rural India'),
      crop: crop,
      avatar: '👨‍🌾',
      kisanId: 'KS-' + Math.floor(1000 + Math.random() * 9000),
      land: mode === 'signup' ? '3.5 Acres' : '4.0 Acres',
      isVerified: isVerified || otp.trim() === '1234',
      verifiedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('kisan_user', JSON.stringify(farmerProfile));
    } catch {}
    window.dispatchEvent(new Event('kisan_user_updated'));
    setLoggedInFarmer(farmerProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Modal Top Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white relative">
          <button
            onClick={() => {
              if (loggedInFarmer) finishLogin(loggedInFarmer);
              else onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="Close"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">👨‍🌾</span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Kisan Sahayak Portal · Qualcomm AI
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
            {loggedInFarmer ? (lang === 'HI' ? 'लॉगिन सफल! किसान ID जारी' : 'Login Successful! Kisan ID Issued') : (mode === 'signin' ? t.signInTitle : t.signUpTitle)}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
            {loggedInFarmer ? (lang === 'HI' ? 'आपकी किसान पहचान (Kisan ID) सुरक्षित रूप से तैयार है' : 'Your Official Farmer Identity has been registered') : (mode === 'signin' ? t.welcomeBack : t.createAccount)}
          </p>
        </div>

        {/* If Logged In: Show Kisan ID Issuance Card */}
        {loggedInFarmer ? (
          <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
              {loggedInFarmer.avatar || '👨‍🌾'}
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">
                {lang === 'HI' ? `नमस्ते, ${loggedInFarmer.name}!` : `Welcome, ${loggedInFarmer.name}!`}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {loggedInFarmer.location} · {loggedInFarmer.crop}
              </p>
            </div>

            {/* Official Kisan ID Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-2 border-emerald-400 text-left shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md">
                  🇮🇳 Official Kisan ID (किसान पहचान संख्या)
                </span>
                <span className="text-[10px] font-bold text-emerald-700">
                  सत्यापित ✓
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 mt-1">
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-black text-emerald-900 tracking-wider">
                    {loggedInFarmer.kisanId}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    {loggedInFarmer.contact}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(loggedInFarmer.kisanId);
                    setIdCopied(true);
                    setTimeout(() => setIdCopied(false), 2500);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer shadow-md flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>{idCopied ? '✅' : '📋'}</span>
                  <span>{idCopied ? 'कॉपी हुआ!' : 'Copy ID'}</span>
                </button>
              </div>

              <div className="mt-3 pt-2.5 border-t border-emerald-200/80 text-[11px] text-emerald-800/80">
                <span>💡 <strong>नोट:</strong> इस Kisan ID को याद रखें या कॉपी कर लें। सरकारी योजना आवेदन व एडमिन पोर्टल पर इसी ID से तुरंत खोज होगी।</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => finishLogin(loggedInFarmer)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>पोर्टल पर जारी रखें (Continue to Portal)</span>
              <span>→</span>
            </button>
          </div>
        ) : (
        /* Modal Scrollable Content */
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">

          {/* 1-Click Fast Demo Login for Judges & Testing */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span>⚡</span> {t.quickLoginPrompt}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                1-Tap
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_FARMERS.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => handleQuickLogin(f)}
                  className="p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-100/50 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-lg">{f.avatar}</span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                      {f.name.split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{f.location.split(',')[0]}</div>
                  <div className="text-[9px] text-emerald-700 font-medium truncate mt-0.5">{f.crop.split('(')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                mode === 'signin' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'HI' ? 'लॉग इन (Sign In)' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                mode === 'signup' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'HI' ? 'नया पंजीकरण (Sign Up)' : 'Sign Up'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2 animate-fade-in">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success / Notification Banner */}
          {successMsg && !error && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Single Unified Form: Inputs + Inline OTP Verification + Crops */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Farmer Name (in Sign Up) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.nameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'HI' ? 'उदा. राम कुमार सिंह' : 'e.g. Ramesh Kumar'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
            )}

            {/* Mobile Number or Gmail Input with Inline "Send OTP" Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {t.phoneLabel} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-500">
                  {isEmail(contact) ? '📧 Gmail' : '📱 Mobile'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    {isEmail(contact) ? '✉️' : '📞'}
                  </span>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      setIsVerified(false);
                    }}
                    placeholder={lang === 'HI' ? '9876543210 या kisan@gmail.com' : '9876543210 or farmer@gmail.com'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>

                {/* Inline OTP Trigger Button */}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={countdown > 0}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    countdown > 0
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : otpSent
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs'
                  }`}
                >
                  {countdown > 0
                    ? `${countdown}s`
                    : otpSent
                    ? (lang === 'HI' ? 'पुनः भेजें' : 'Resend')
                    : (lang === 'HI' ? 'OTP भेजें' : 'Send OTP')}
                </button>
              </div>

              {/* Inline OTP Verification Field (Appears right below Phone/Gmail) */}
              {otpSent && (
                <div className="mt-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <span>🔐</span> {lang === 'HI' ? '4-अंकीय OTP सत्यापन:' : 'Enter 4-Digit OTP:'}
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300 cursor-pointer transition-colors"
                    >
                      ⚡ {lang === 'HI' ? 'डेमो OTP भरें (1234)' : 'Auto-Fill (1234)'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setOtp(val);
                        if (val === '1234') setIsVerified(true);
                      }}
                      placeholder="1 2 3 4"
                      className="w-32 text-center text-lg font-black font-mono tracking-widest px-3 py-1.5 rounded-xl border-2 border-emerald-500 bg-white focus:ring-2 focus:ring-emerald-200 outline-none"
                    />

                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                      {isVerified || otp === '1234' ? (
                        <span className="text-emerald-700 font-bold bg-white px-2 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                          <span>✓</span> {lang === 'HI' ? 'सत्यापित' : 'Verified'}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          {lang === 'HI' ? 'कोड 1234 दर्ज करें' : 'Enter code 1234'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Location & Crop Fields (for Sign Up) */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.locationLabel}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={lang === 'HI' ? 'उदा. अलीगढ़, उत्तर प्रदेश' : 'e.g. Aligarh, Uttar Pradesh'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>

                {/* Primary Crop Selection: Clean Categorized Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.cropLabel}
                  </label>

                  {/* Categorized Dropdown with all Indian crops */}
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all cursor-pointer font-medium"
                  >
                    {CROP_CATEGORIES.map((cat) => (
                      <optgroup key={cat.id} label={lang === 'HI' ? cat.titleHI : cat.titleEN}>
                        {cat.crops.map((c) => (
                          <option key={c.id} value={`${c.icon} ${lang === 'HI' ? c.nameHI : c.nameEN}`}>
                            {c.icon} {lang === 'HI' ? c.nameHI : c.nameEN}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Single Form Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'signin' ? '🚀' : '✓'}</span>
              <span>{mode === 'signin' ? t.btnSignIn : t.btnSignUp}</span>
            </button>
          </form>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <span className="text-base">🔒</span>
            <span>{t.guestNotice}</span>
          </div>

        </div>
        )}

        {/* Modal Bottom Switcher (Only if not logged in) */}
        {!loggedInFarmer && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              {mode === 'signin' ? t.switchSignUp : t.switchSignIn}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
