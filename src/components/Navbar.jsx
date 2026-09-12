import { useState, useEffect } from 'react';
import KisanLogo from './KisanLogo';
import { translations } from '../lib/translations';

export default function Navbar({
  onNavigate,
  onOpenHistory,
  onOpenBenchmark,
  historyCount = 0,
  lang = 'EN',
  onToggleLang,
  page = 'home',
  onSelectPage,
  user = null,
  onOpenAuth,
  onLogout,
  onOpenWhatsAppBot
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const t = translations[lang]?.nav || translations.EN.nav;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (pageId) => {
    setMobileOpen(false);
    if (onSelectPage) {
      onSelectPage(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: t.product, id: 'product' },
    { label: t.howItWorks, id: 'how-it-works' },
    { label: t.impact, id: 'impact' },
    { label: t.schemes, id: 'schemes' },
    { label: t.team, id: 'team' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
          : 'bg-white/85 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-18 flex items-center justify-between">

        {/* Logo — click goes to Home */}
        <div className="cursor-pointer flex-shrink-0" onClick={() => handleNavClick('home')}>
          <KisanLogo size={34} theme="light" />
        </div>

        {/* Nav Links — Clean, borderless, airy desktop navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(l => {
            const isActive = page === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleNavClick(l.id)}
                className={`text-sm font-semibold transition-all cursor-pointer py-1 relative whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-emerald-600 rounded-full animate-fade-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* 1. Language toggle — Visible on Mobile & Desktop, compact & clean */}
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              className="inline-flex items-center gap-1 h-8 sm:h-9 px-2.5 sm:px-3 rounded-full text-xs font-bold transition-all cursor-pointer bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 shadow-2xs text-slate-700 whitespace-nowrap"
              title="Switch Language / भाषा बदलें"
            >
              <span>🌐</span>
              <span className="font-bold">{lang === 'EN' ? 'हिन्दी' : 'EN'}</span>
            </button>
          )}

          {/* 2. Farmer Login / Profile Dropdown — Desktop (sm+) */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileDropdownOpen(o => !o)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <span className="text-sm">{user.avatar || '👨‍🌾'}</span>
                <span className="max-w-[70px] sm:max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-emerald-600">▼</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-scale-in text-left">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="text-3xl">{user.avatar || '👨‍🌾'}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                        <span>{user.name}</span>
                        {user.isVerified && (
                          <span className="text-emerald-600 text-xs" title="Verified Farmer">✓</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{user.location}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block font-bold">
                          {user.kisanId}
                        </span>
                        <button
                          onClick={() => {
                            if (user.kisanId) {
                              navigator.clipboard.writeText(user.kisanId);
                              alert(`किसान ID (${user.kisanId}) कॉपी हो गई!`);
                            }
                          }}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 cursor-pointer font-semibold transition-all"
                          title="Copy Kisan ID"
                        >
                          📋 कॉपी
                        </button>
                        {user.isVerified && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {lang === 'HI' ? 'सत्यापित' : 'Verified'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="py-2.5 text-xs text-slate-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{lang === 'HI' ? 'मुख्य फसल:' : 'Primary Crop:'}</span>
                      <span className="font-semibold text-slate-800 truncate ml-2 max-w-[130px]">{user.crop}</span>
                    </div>
                    {(user.contact || user.phone) && (
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-400">
                          {(user.contact || user.phone).includes('@') ? 'Gmail:' : (lang === 'HI' ? 'फोन:' : 'Phone:')}
                        </span>
                        <span className="text-slate-700 truncate ml-2 max-w-[140px]">{user.contact || user.phone}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => { setProfileDropdownOpen(false); if (onLogout) onLogout(); }}
                    className="w-full mt-1 py-2 px-3 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🚪</span>
                    <span>{t.logout || 'Log Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <span>👤</span>
              <span>{t.login || 'Log In'}</span>
            </button>
          )}

          {/* 3. Primary Standout CTA Button — hidden on small mobile to give full room to hamburger */}
          <button
            onClick={() => onNavigate('vision')}
            className="hidden sm:inline-flex items-center justify-center h-9 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold text-white transition-all duration-200 cursor-pointer shadow-sm shadow-emerald-700/25 whitespace-nowrap active:scale-95 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600"
          >
            <span>{t.tryDemo}</span>
          </button>

          {/* 4. Mobile hamburger toggle — always clearly visible on mobile */}
          <button
            className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center cursor-pointer text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 transition-colors shadow-2xs"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen
                ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-4 pb-6 pt-3 flex flex-col gap-2.5 bg-white/98 backdrop-blur-xl border-slate-200 shadow-2xl animate-slide-down max-h-[85vh] overflow-y-auto">
          
          {/* Farmer Profile Card in Mobile Drawer */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between gap-3 mb-1 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-3xl">{user.avatar || '👨‍🌾'}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                    <span>{user.name}</span>
                    {user.isVerified && <span className="text-emerald-600 text-xs">✓</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">{user.kisanId}</span>
                    <button
                      onClick={() => {
                        if (user.kisanId) {
                          navigator.clipboard.writeText(user.kisanId);
                          alert(`किसान ID (${user.kisanId}) कॉपी हो गई!`);
                        }
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-300 font-semibold cursor-pointer"
                    >
                      📋 कॉपी
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setMobileOpen(false); if (onLogout) onLogout(); }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex-shrink-0"
              >
                {t.logout || 'Log Out'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMobileOpen(false); if (onOpenAuth) onOpenAuth(); }}
              className="w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between mb-1 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-bold">{lang === 'HI' ? 'किसान लॉगिन / नया खाता' : 'Farmer Sign In / Sign Up'}</div>
                  <div className="text-[10px] text-emerald-700 font-normal">{lang === 'HI' ? 'सरकारी योजना लाभ व ऑटो-फिल हेतु' : 'For tailored schemes & auto-fill'}</div>
                </div>
              </div>
              <span className="text-emerald-600 font-bold">→</span>
            </button>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 ${
                page === 'home' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>🏠</span>
              <span>{lang === 'HI' ? 'होम पेज (Home)' : 'Home Overview'}</span>
            </button>

            {navLinks.map(l => {
              const isActive = page === l.id;
              const isSchemes = l.id === 'schemes';
              return (
                <button
                  key={l.id}
                  onClick={() => handleNavClick(l.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                    isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>{l.id === 'product' ? '🌿' : l.id === 'how-it-works' ? '⚙️' : l.id === 'schemes' ? '🏛️' : l.id === 'impact' ? '📈' : '👥'}</span>
                    <span>{l.label}</span>
                  </span>
                  {isSchemes && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {lang === 'HI' ? '17+ योजनाएं' : '17+ Live'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Tools & Features */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {onOpenBenchmark && (
              <button
                onClick={() => { setMobileOpen(false); onOpenBenchmark(); }}
                className="text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50/70 border border-emerald-200 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>{t.npuLab}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">Snapdragon NPU</span>
              </button>
            )}

            {onOpenHistory && (
              <button
                onClick={() => { setMobileOpen(false); onOpenHistory(); }}
                className="text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span>📜</span>
                  <span>{t.history}</span>
                </span>
                {historyCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {historyCount}
                  </span>
                )}
              </button>
            )}

            {/* Prominent Demo CTA inside drawer */}
            <button
              onClick={() => { setMobileOpen(false); onNavigate('vision'); }}
              className="w-full mt-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🚀</span>
              <span>{lang === 'HI' ? 'AI फसल रोग जांच शुरू करें' : 'Launch AI Crop Diagnosis'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
