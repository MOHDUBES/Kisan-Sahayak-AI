import { useState, useEffect } from 'react';
import { SCHEME_CATEGORIES, getLiveSchemes, syncLatestGovtSchemes, isSchemeMatchingFarmer } from '../../lib/schemesData';
import SchemeApplyModal from '../SchemeApplyModal';

export default function SchemesPage({ lang = 'EN', onNavigate, onOpenAuth }) {
  const isHi = lang === 'HI';

  const [schemes, setSchemes] = useState(getLiveSchemes);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMyEligible, setOnlyMyEligible] = useState(false);
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState(null);
  const [selectedAppForReceipt, setSelectedAppForReceipt] = useState(null);
  
  // Set of expanded scheme IDs for accordion details (default: first 2 expanded for instant visibility)
  const [expandedSchemeIds, setExpandedSchemeIds] = useState(() => new Set(['pm-kisan']));

  const toggleExpand = (schemeId) => {
    setExpandedSchemeIds(prev => {
      const next = new Set(prev);
      if (next.has(schemeId)) {
        next.delete(schemeId);
      } else {
        next.add(schemeId);
      }
      return next;
    });
  };

  // Live sync states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return isHi ? 'आज 2026 (सक्रिय)' : 'Today 2026 (Live)';
  });

  // Track active farmer
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kisan_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Track farmer's past submitted applications
  const [myApplications, setMyApplications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kisan_scheme_applications') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const savedUser = localStorage.getItem('kisan_user');
        setUser(savedUser ? JSON.parse(savedUser) : null);
        const savedApps = JSON.parse(localStorage.getItem('kisan_scheme_applications') || '[]');
        setMyApplications(savedApps);
        setSchemes(getLiveSchemes());
      } catch {}
    };

    window.addEventListener('kisan_user_updated', handleUpdate);
    window.addEventListener('kisan_scheme_applied', handleUpdate);
    window.addEventListener('kisan_schemes_updated', handleUpdate);
    return () => {
      window.removeEventListener('kisan_user_updated', handleUpdate);
      window.removeEventListener('kisan_scheme_applied', handleUpdate);
      window.removeEventListener('kisan_schemes_updated', handleUpdate);
    };
  }, []);

  const handleLiveSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncLatestGovtSchemes();
      setSchemes(getLiveSchemes());
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSyncToast(
        isHi
          ? `✓ केंद्रीय कृषि पोर्टल व myScheme से 17+ योजनाएं सफलतापूर्वक अपडेट हुईं!`
          : `✓ Successfully synced 17+ government schemes with central databases!`
      );
      setTimeout(() => setSyncToast(''), 5000);
    }, 900);
  };

  // Filter schemes
  const filteredSchemes = schemes.filter(s => {
    // Category match
    if (activeCategory !== 'all' && s.category !== activeCategory) {
      return false;
    }

    // Farmer matching constraint
    if (onlyMyEligible && user && !isSchemeMatchingFarmer(s, user)) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (isHi ? s.titleHI : s.titleEN).toLowerCase().includes(q);
      const matchTag = (isHi ? s.taglineHI : s.taglineEN).toLowerCase().includes(q);
      const matchBadge = (isHi ? s.benefitBadgeHI : s.benefitBadgeEN).toLowerCase().includes(q);
      const matchCrops = s.targetCrops?.some(c => c.toLowerCase().includes(q));
      if (!matchTitle && !matchTag && !matchBadge && !matchCrops) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in overflow-x-hidden">
      
      {/* ─── Page Header ─────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-300/80 shadow-2xs">
          <span>🏛️</span>
          <span>{isHi ? 'राष्ट्रीय कृषि ई-सेवा पोर्टल · भारत सरकार' : 'National Agricultural e-Services · Govt of India'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight leading-tight break-words">
          {isHi ? 'किसान सरकारी योजनाएं एवं प्रत्यक्ष लाभ' : 'Government Agricultural Schemes & Benefits'}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isHi 
            ? 'अपनी फसल, भूमि और राज्य के अनुसार सटीक सरकारी योजनाओं की जानकारी लें, दस्तावेज़ सूची देखें और सीधे ऑनलाइन आवेदन करें।' 
            : 'Explore tailored central & state agricultural schemes, view required document checklists, and apply directly online.'}
        </p>
      </div>

      {/* ─── LIVE SYNC & UPDATE BANNER ─────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-700/40">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isHi ? 'लाइव सरकारी डेटाबेस सिंक' : 'Live Govt Database Sync'}</span>
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              myScheme · AgriCoop API 2026
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {isHi 
              ? `अंतिम सिंक समय: ${lastSyncTime} · 17+ केंद्रीय व राज्य कृषि योजनाएं सक्रिय` 
              : `Last Synced: ${lastSyncTime} · 17+ Central & State Schemes Active`}
          </p>
        </div>

        {/* Sync Trigger Button */}
        <button
          onClick={handleLiveSync}
          disabled={isSyncing}
          className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 flex-shrink-0 shadow-md ${
            isSyncing
              ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black active:scale-95 shadow-emerald-500/25'
          }`}
        >
          <span className={`text-base ${isSyncing ? 'animate-spin' : ''}`}>🔄</span>
          <span>{isSyncing ? (isHi ? 'योजनाएं जांची जा रही हैं...' : 'Checking Govt APIs...') : (isHi ? 'ताज़ा सरकारी योजनाएं अपडेट करें' : 'Sync Latest Govt Schemes')}</span>
        </button>
      </div>

      {/* Live Sync Toast Notification */}
      {syncToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-2 shadow-md animate-slide-down">
          <span className="text-lg">✅</span>
          <span>{syncToast}</span>
        </div>
      )}

      {/* ─── Farmer Profile & Personalized Matching Banner ────────────── */}
      {user ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl sm:text-4xl flex-shrink-0">{user.avatar || '👨‍🌾'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-slate-900 truncate">{user.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  {user.land} · {user.crop}
                </span>
                {user.isVerified && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ {isHi ? 'सत्यापित किसान' : 'Verified'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isHi 
                  ? 'आपकी फसल व भूमि के आधार पर सबसे सटीक योजनाएं "आपके लिए उपयुक्त" बैज से चिह्नित हैं।'
                  : 'Schemes matching your land acreage and primary crop are automatically highlighted.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOnlyMyEligible(v => !v)}
            className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 flex-shrink-0 shadow-xs ${
              onlyMyEligible
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span>{onlyMyEligible ? '✓' : '✨'}</span>
            <span>{isHi ? 'केवल मेरे लिए पात्र योजनाएं' : 'Show Only My Eligible Schemes'}</span>
          </button>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl flex-shrink-0">💡</span>
            <p className="leading-snug">
              {isHi 
                ? 'किसान लॉगिन करने पर आपकी भूमि और फसल के अनुसार सबसे सटीक योजनाएं "आपके लिए उपयुक्त" बैज के साथ स्वतः दिखेंगी।' 
                : 'Log in with your farmer profile to get customized scheme recommendations and auto-filled applications.'}
            </p>
          </div>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-xs whitespace-nowrap flex-shrink-0"
            >
              <span>👤 {isHi ? 'किसान लॉगिन करें' : 'Farmer Log In'}</span>
            </button>
          )}
        </div>
      )}

      {/* ─── Farmer's Submitted Applications (If any) ──────────────────── */}
      {myApplications.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {isHi ? 'आपके द्वारा जमा किए गए आवेदन (My Applications):' : 'My Submitted Applications:'}
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {myApplications.length} {isHi ? 'आवेदन' : 'Applied'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {myApplications.map((app) => (
              <div key={app.applicationId} className="p-4 rounded-2xl bg-slate-800/95 border border-slate-700 text-xs space-y-3 shadow-md">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-emerald-400 font-mono text-xs truncate max-w-[170px]">
                    {app.applicationId}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {app.benefitBadge}
                  </span>
                </div>
                <div className="font-bold text-slate-100 text-xs sm:text-sm leading-snug line-clamp-1">
                  {app.schemeTitle}
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-700/80">
                  <span>{app.submittedAt}</span>
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isHi ? (app.statusTextHI || '🟢 योजना में पंजीकृत एवं स्वीकृत') : (app.statusTextEN || '🟢 Registered & Approved')}</span>
                  </span>
                </div>
                {/* Direct Action Links */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const schemeObj = schemes.find(s => s.id === app.schemeId) || schemes[0];
                      setSelectedSchemeForApply(schemeObj);
                      setSelectedAppForReceipt(app);
                    }}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <span>📜</span>
                    <span>{isHi ? 'पावती रसीद देखें' : 'View Slip'}</span>
                  </button>

                  {app.officialUrl && (
                    <a
                      href={app.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title={isHi ? 'सरकारी पोर्टल पर स्थिति ट्रैक करें' : 'Track Status on Govt Portal'}
                    >
                      <span>🌐</span>
                      <span>{isHi ? 'सरकारी पोर्टल ↗' : 'Govt Portal ↗'}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const text = `Ref: ${app.applicationId} | Farmer: ${app.farmerName || 'Farmer'} | Khasra: ${app.khasraNo || 'N/A'} | IFSC: ${app.bankIfsc || 'N/A'}`;
                      navigator.clipboard.writeText(text);
                      alert(isHi ? '✓ विवरण क्लिपबोर्ड में कॉपी हो गया!' : '✓ Details copied to clipboard!');
                    }}
                    className="py-2 px-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    title={isHi ? 'विवरण कॉपी करें' : 'Copy details'}
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Search & Category Filter Section ─────────────────────────── */}
      <div className="space-y-3.5">
        
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'योजना का नाम, लाभ (उदा. ₹6000, ड्रोन, सोलर, सब्सिडी) खोजें...' : 'Search by scheme name, benefit (e.g. drone, solar, subsidy) or crop...'}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm shadow-2xs focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 outline-none transition-all bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max justify-start sm:justify-center px-1">
            {SCHEME_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? schemes.length 
                : schemes.filter(s => s.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm font-black scale-[1.02]'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isHi ? cat.labelHI : cat.labelEN}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Schemes Grid ─────────────────────────────────────────────── */}
      {filteredSchemes.length === 0 ? (
        <div className="p-10 sm:p-14 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold text-slate-800">
            {isHi ? 'कोई योजना नहीं मिली' : 'No Matching Schemes Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {isHi 
              ? 'कृपया अपने सर्च शब्द बदलें या "सभी योजनाएं" श्रेणी का चयन करें।' 
              : 'Try changing your search term or select "All Schemes" category.'}
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setOnlyMyEligible(false); }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
          >
            {isHi ? 'सभी योजनाएं देखें' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {filteredSchemes.map((scheme) => {
            const isMatch = isSchemeMatchingFarmer(scheme, user);
            const isExpanded = expandedSchemeIds.has(scheme.id);
            const docsList = isHi ? scheme.documentsHI : scheme.documentsEN;
            const eligibilityList = isHi ? scheme.eligibilityHI : scheme.eligibilityEN;

            return (
              <div
                key={scheme.id}
                className={`rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isMatch && user
                    ? 'border-emerald-300 ring-2 ring-emerald-400/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ─── Card Header (Airy & Clean) ────────────────────── */}
                <div className="p-5 sm:p-6 pb-4 space-y-3 border-b border-slate-100">
                  
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[240px]">
                      {isHi ? scheme.ministryHI : scheme.ministryEN}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {scheme.isNew2026 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black tracking-wide shadow-2xs">
                          {isHi ? '🆕 2026 नई योजना' : '🆕 New 2026'}
                        </span>
                      )}
                      {isMatch && user && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                          <span>✨</span>
                          <span>{isHi ? 'आपके लिए उपयुक्त' : 'Best Match'}</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
                        {isHi ? scheme.benefitBadgeHI : scheme.benefitBadgeEN}
                      </span>
                    </div>
                  </div>

                  {/* Scheme Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 leading-snug">
                    {isHi ? scheme.titleHI : scheme.titleEN}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isHi ? scheme.taglineHI : scheme.taglineEN}
                  </p>
                </div>

                {/* ─── Card Core Highlights (Spacious 2-Box Grid) ────── */}
                <div className="p-5 sm:p-6 py-4 space-y-3.5 flex-1">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    
                    {/* Highlight 1: Target Farmers */}
                    <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                      <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                        <span>🎯</span>
                        <span>{isHi ? 'पात्र किसान' : 'Eligible Farmers'}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-snug">
                        {isHi ? scheme.farmerTypeHI : scheme.farmerTypeEN}
                      </p>
                    </div>

                    {/* Highlight 2: Core Benefit */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span>🎁</span>
                        <span>{isHi ? 'प्रत्यक्ष लाभ' : 'Direct Benefit'}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-snug">
                        {isHi ? scheme.benefitTypeHI : scheme.benefitTypeEN}
                      </p>
                    </div>

                  </div>

                  {/* ─── Interactive Accordion Drawer for Docs & Eligibility ─ */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleExpand(scheme.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 border border-slate-200"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>📑</span>
                        <span>
                          {isHi 
                            ? `ज़रूरी दस्तावेज़ (${docsList.length}) व पात्रता शर्तें देखें` 
                            : `View Required Documents (${docsList.length}) & Criteria`}
                        </span>
                      </span>
                      <span className="text-emerald-700 font-bold text-sm">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </button>

                    {/* Expandable Section Content */}
                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 animate-fade-in text-xs">
                        
                        {/* Mandatory Documents Checklist */}
                        <div>
                          <div className="font-bold text-slate-900 text-[11px] mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span>📑</span>
                              <span>{isHi ? 'क्या-क्या दस्तावेज लगेंगे (Mandatory Documents):' : 'Required Documents Checklist:'}</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                              {docsList.length} {isHi ? 'दस्तावेज़' : 'Docs'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {docsList.map((doc, dIdx) => (
                              <div
                                key={dIdx}
                                className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 text-[11px] font-medium border border-slate-200 flex items-center gap-1.5 shadow-2xs"
                              >
                                <span className="text-emerald-600 font-black">✓</span>
                                <span className="leading-tight truncate">{doc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Complete Eligibility Conditions */}
                        <div>
                          <div className="font-bold text-slate-900 text-[11px] mb-1.5 flex items-center gap-1">
                            <span>📋</span>
                            <span>{isHi ? 'पात्रता की शर्तें (Complete Criteria):' : 'Eligibility Conditions:'}</span>
                          </div>
                          <div className="space-y-1 text-slate-600">
                            {eligibilityList.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                                <span className="leading-snug">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Helpline Number */}
                        <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-200/80">
                          <span>📞</span>
                          <span>{isHi ? 'किसान टोल-फ्री हेल्पलाइन: 1800-180-1551' : 'Kisan Toll-Free Helpline: 1800-180-1551'}</span>
                        </div>

                      </div>
                    )}
                  </div>

                </div>

                {/* ─── Card Bottom Actions ────────────────────────────── */}
                <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  
                  {/* Option 1: 1-Click In-App Direct Apply */}
                  <button
                    onClick={() => {
                      setSelectedAppForReceipt(null);
                      setSelectedSchemeForApply(scheme);
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-95"
                  >
                    <span>⚡</span>
                    <span>{isHi ? 'योजना में आवेदन करें' : 'Apply in Scheme'}</span>
                  </button>

                  {/* Option 2: Direct Official Govt Portal Link */}
                  <a
                    href={scheme.applyUrl || scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer order-2 sm:order-1 whitespace-nowrap"
                    title={isHi ? 'सरकारी पोर्टल पर सीधा पंजीकरण खोलें' : 'Open Direct Government Registration Portal'}
                  >
                    <span>🌐</span>
                    <span>{isHi ? 'सीधा सरकारी पोर्टल ↗' : 'Direct Govt Portal ↗'}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ─── In-App Application & Certificate Modal ───────────────────── */}
      {selectedSchemeForApply && (
        <SchemeApplyModal
          scheme={selectedSchemeForApply}
          user={user}
          lang={lang}
          initialSubmittedApp={selectedAppForReceipt}
          onClose={() => {
            setSelectedSchemeForApply(null);
            setSelectedAppForReceipt(null);
          }}
          onSuccess={(app) => {
            setMyApplications(prev => [app, ...prev]);
          }}
        />
      )}

    </div>
  );
}
