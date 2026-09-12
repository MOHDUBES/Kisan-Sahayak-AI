import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ProductPage from './components/pages/ProductPage';
import HowItWorksPage from './components/pages/HowItWorksPage';
import ImpactPage from './components/pages/ImpactPage';
import TeamPage from './components/pages/TeamPage';
import SchemesPage from './components/pages/SchemesPage';
import Footer from './components/Footer';
import VisionModule from './components/VisionModule';
import VoiceModule from './components/VoiceModule';
import History from './components/History';
import AboutSection from './components/AboutSection';
import BenchmarkStudio from './components/BenchmarkStudio';
import KisanLogo from './components/KisanLogo';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import KisanAiAssistant from './components/KisanAiAssistant';
import WhatsAppBotModal from './components/WhatsAppBotModal';
import { translations } from './lib/translations';

const VIEWS = { dashboard: 'dashboard', vision: 'vision', voice: 'voice' };
const STORAGE_KEY = 'kisan_sahayak_history';

function getHistoryCount() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').length; }
  catch { return 0; }
}

export default function App() {
  const [view, setView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hash = (window.location.hash || '').replace('#', '');
      if (params.get('view') === 'voice' || hash === 'voice') return VIEWS.voice;
      if (params.get('view') === 'vision' || hash === 'vision') return VIEWS.vision;
      if (params.get('view') === 'history' || params.get('view') === 'about' || params.get('view') === 'benchmark') return VIEWS.vision;
    } catch (e) {}
    return VIEWS.dashboard;
  });
  const [showHistory, setShowHistory]   = useState(() => {
    try { return new URLSearchParams(window.location.search).get('view') === 'history'; }
    catch { return false; }
  });
  const [showAbout, setShowAbout]       = useState(() => {
    try { return new URLSearchParams(window.location.search).get('view') === 'about'; }
    catch { return false; }
  });
  const [showBenchmark, setShowBenchmark] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('view') === 'benchmark'; }
    catch { return false; }
  });
  const [historyCount, setHistoryCount] = useState(getHistoryCount);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kisan_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWhatsAppBot, setShowWhatsAppBot] = useState(false);
  // Admin Panel — only opens via secret govt URL param: ?gov=kisanadmin2024
  const [showAdmin, setShowAdmin] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('gov') === 'kisanadmin2024';
    } catch { return false; }
  });
  const [page, setPage] = useState(() => {
    try {
      const urlPage = new URLSearchParams(window.location.search).get('page');
      if (['home', 'product', 'how-it-works', 'impact', 'team', 'schemes'].includes(urlPage)) {
        return urlPage;
      }
      return 'home';
    } catch {
      return 'home';
    }
  });
  const [lang, setLang] = useState(() => {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && (urlLang.toUpperCase() === 'HI' || urlLang.toUpperCase() === 'EN')) {
        return urlLang.toUpperCase();
      }
      return localStorage.getItem('kisan_sahayak_lang') || 'EN';
    }
    catch { return 'EN'; }
  });

  const setLanguage = (newLang) => {
    setLang(newLang);
    try { localStorage.setItem('kisan_sahayak_lang', newLang); } catch {}
  };

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'EN' ? 'HI' : 'EN';
      try { localStorage.setItem('kisan_sahayak_lang', next); } catch {}
      return next;
    });
  };

  const selectPage = (newPage) => {
    setPage(newPage);
    setView(VIEWS.dashboard);
    setShowHistory(false);
    setShowAbout(false);
    setShowBenchmark(false);
    try {
      const url = new URL(window.location.href);
      if (newPage === 'home') {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', newPage);
      }
      url.searchParams.delete('view');
      window.history.replaceState(null, '', url.toString());
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const update = () => setHistoryCount(getHistoryCount());
    window.addEventListener('kisan_history_updated', update);
    return () => window.removeEventListener('kisan_history_updated', update);
  }, []);

  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const saved = localStorage.getItem('kisan_user');
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('kisan_user_updated', handleUserUpdate);
    return () => window.removeEventListener('kisan_user_updated', handleUserUpdate);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('kisan_user');
    } catch {}
    setUser(null);
    window.dispatchEvent(new CustomEvent('kisan_user_updated'));
  };

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, showHistory, showAbout, showBenchmark, page]);

  const navigate = (target) => {
    setShowHistory(false);
    setShowAbout(false);
    setShowBenchmark(false);
    setView(target);
    try {
      window.history.replaceState(null, '', `?view=${target}`);
    } catch (e) {}
  };

  const goBack = () => {
    setView(VIEWS.dashboard);
    setShowHistory(false);
    setShowAbout(false);
    setShowBenchmark(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}
  };

  const isLanding = view === VIEWS.dashboard && !showHistory && !showAbout && !showBenchmark;

  // ── GOVT ADMIN PANEL: Exclusive render — replaces entire app ──
  // Access: http://localhost:5173?gov=kisanadmin2024
  const govParam = (() => { try { return new URLSearchParams(window.location.search).get('gov'); } catch { return null; } })();
  if (govParam === 'kisanadmin2024' || showAdmin) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <AdminPanel onClose={() => {
          setShowAdmin(false);
          try { window.history.replaceState(null, '', window.location.pathname); } catch {}
        }} />
      </div>
    );
  }

  // Multi-Page Public Website (Light theme)
  if (isLanding) {
    return (
      <div className="landing-root min-h-screen flex flex-col justify-between w-full max-w-full overflow-x-hidden">
        <Navbar 
          onNavigate={navigate}
          onOpenHistory={() => setShowHistory(true)}
          onOpenBenchmark={() => setShowBenchmark(true)}
          historyCount={historyCount}
          lang={lang}
          onToggleLang={toggleLang}
          page={page}
          onSelectPage={selectPage}
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenWhatsAppBot={() => setShowWhatsAppBot(true)}
        />
        <main className="flex-1 pt-20 sm:pt-24 pb-12 w-full max-w-full overflow-x-hidden">
          {page === 'product' ? (
            <ProductPage onNavigate={navigate} lang={lang} />
          ) : page === 'how-it-works' ? (
            <HowItWorksPage onOpenBenchmark={() => setShowBenchmark(true)} onNavigate={navigate} lang={lang} />
          ) : page === 'impact' ? (
            <ImpactPage lang={lang} />
          ) : page === 'team' ? (
            <TeamPage onNavigate={navigate} lang={lang} />
          ) : page === 'schemes' ? (
            <SchemesPage onNavigate={navigate} lang={lang} onOpenAuth={() => setShowAuthModal(true)} />
          ) : (
            <LandingPage 
              onNavigate={navigate}
              onOpenHistory={() => setShowHistory(true)}
              onOpenAbout={() => setShowAbout(true)}
              onOpenBenchmark={() => setShowBenchmark(true)}
              onSelectPage={selectPage}
              lang={lang}
            />
          )}
        </main>
        <Footer 
          onNavigate={navigate}
          onSelectPage={selectPage}
          onOpenBenchmark={() => setShowBenchmark(true)}
          onOpenHistory={() => setShowHistory(true)}
          lang={lang}
        />
        {showAuthModal && (
          <AuthModal 
            lang={lang} 
            onClose={() => setShowAuthModal(false)} 
            onLoginSuccess={(u) => {
              setUser(u);
              setShowAuthModal(false);
            }} 
          />
        )}
        <KisanAiAssistant 
          lang={lang}
          onNavigate={navigate}
          onSelectPage={selectPage}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenWhatsAppBot={() => setShowWhatsAppBot(true)}
        />
        <WhatsAppBotModal 
          isOpen={showWhatsAppBot}
          onClose={() => setShowWhatsAppBot(false)}
          lang={lang}
          onNavigate={navigate}
          onSelectPage={selectPage}
        />
      </div>
    );
  }

  // Interactive Live Workbench (Vision, Voice, History, About)
  const wbNav = translations[lang]?.workbenchNav || translations.EN.workbenchNav;

  return (
    <div className="module-shell min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Workbench Header — Clean Light Theme */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm h-16 sm:h-20 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-8 h-full flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Back button & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <KisanLogo
              size={36}
              layout="icon-only"
              theme="light"
              onClick={goBack}
            />
            <button
              onClick={goBack}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              title={wbNav.backToOverview}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              <span className="hidden sm:inline">{wbNav.backToOverview}</span>
              <span className="sm:hidden">{lang === 'HI' ? 'होम' : 'Home'}</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Desktop Mode Switcher Tabs */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => { setShowHistory(false); setShowAbout(false); setShowBenchmark(false); navigate(VIEWS.vision); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  view === VIEWS.vision && !showHistory && !showAbout && !showBenchmark
                    ? 'bg-white text-emerald-700 border border-emerald-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>📷</span>
                <span>{wbNav.kisanKavach}</span>
              </button>
              <button
                onClick={() => { setShowHistory(false); setShowAbout(false); setShowBenchmark(false); navigate(VIEWS.voice); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  view === VIEWS.voice && !showHistory && !showAbout && !showBenchmark
                    ? 'bg-white text-amber-700 border border-amber-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>🎙️</span>
                <span>{wbNav.awaazSahayak}</span>
              </button>
            </div>
          </div>

          {/* Right actions: Desktop all / Mobile compact */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">

            {/* NPU Lab Quick Launcher */}
            <button
              onClick={() => { setShowBenchmark(b => !b); setShowHistory(false); setShowAbout(false); }}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                showBenchmark
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span>⚡</span>
              <span className="hidden sm:inline">{wbNav.npuLab}</span>
              <span className="sm:hidden">NPU</span>
            </button>

            {/* History (Desktop) */}
            <button
              onClick={() => { setShowHistory(h => !h); setShowAbout(false); setShowBenchmark(false); }}
              className={`hidden sm:flex px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold relative items-center gap-1.5 transition-all cursor-pointer ${
                showHistory 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              <span>{wbNav.history}</span>
              {historyCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </button>

            {/* About (Desktop) */}
            <button
              onClick={() => { setShowAbout(a => !a); setShowHistory(false); setShowBenchmark(false); }}
              className={`hidden sm:block px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                showAbout 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              {wbNav.about}
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLang}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all cursor-pointer flex items-center gap-1"
              title="Switch Language / भाषा बदलें"
            >
              <span>🌐</span>
              <span className="font-bold">{lang === 'EN' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Farmer Auth / Profile in Workbench */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-2 sm:px-3 py-1">
                <span className="text-base sm:text-lg">👨‍🌾</span>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-950 leading-tight truncate max-w-[80px] sm:max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-700 leading-none">
                    {user.crop || (lang === 'HI' ? 'किसान' : 'Farmer')}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                  title={translations[lang]?.nav?.logout || 'Logout'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>👤</span>
                <span>{translations[lang]?.nav?.login || (lang === 'HI' ? 'लॉग इन' : 'Login')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workbench Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-8 py-5 sm:py-10 pb-24 sm:pb-10 overflow-x-hidden">
        {showBenchmark ? (
          <BenchmarkStudio lang={lang} onClose={() => setShowBenchmark(false)} />
        ) : showHistory ? (
          <History
            lang={lang}
            onClose={() => setShowHistory(false)}
            onNavigate={(target) => { setShowHistory(false); setShowAbout(false); setShowBenchmark(false); navigate(target); }}
          />
        ) : showAbout ? (
          <AboutSection lang={lang} onClose={() => setShowAbout(false)} />
        ) : view === VIEWS.vision ? (
          <VisionModule
            lang={lang}
            onBack={goBack}
            onOpenVoice={(queryText) => {
              setShowHistory(false);
              setShowAbout(false);
              setShowBenchmark(false);
              navigate(VIEWS.voice);
            }}
            onOpenBenchmark={() => {
              setShowBenchmark(true);
              setShowHistory(false);
              setShowAbout(false);
            }}
          />
        ) : view === VIEWS.voice ? (
          <VoiceModule
            lang={lang}
            onBack={goBack}
            onOpenVision={() => { setShowHistory(false); setShowAbout(false); setShowBenchmark(false); navigate(VIEWS.vision); }}
          />
        ) : null}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar for Workbench */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1.5 grid grid-cols-5 gap-1">
        {/* Tab 1: Kisan Kavach */}
        <button
          onClick={() => { setShowHistory(false); setShowAbout(false); setShowBenchmark(false); navigate(VIEWS.vision); }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            view === VIEWS.vision && !showHistory && !showAbout && !showBenchmark
              ? 'bg-emerald-50 text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-xl">📷</span>
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {lang === 'HI' ? 'कवच' : 'Kavach'}
          </span>
        </button>

        {/* Tab 2: Awaaz Sahayak */}
        <button
          onClick={() => { setShowHistory(false); setShowAbout(false); setShowBenchmark(false); navigate(VIEWS.voice); }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            view === VIEWS.voice && !showHistory && !showAbout && !showBenchmark
              ? 'bg-amber-50 text-amber-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-xl">🎙️</span>
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {lang === 'HI' ? 'आवाज़' : 'Awaaz'}
          </span>
        </button>

        {/* Tab 3: NPU Lab */}
        <button
          onClick={() => { setShowBenchmark(b => !b); setShowHistory(false); setShowAbout(false); }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            showBenchmark
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-xl">⚡</span>
          <span className="text-[10px] mt-0.5 leading-tight truncate">NPU</span>
        </button>

        {/* Tab 4: History */}
        <button
          onClick={() => { setShowHistory(h => !h); setShowAbout(false); setShowBenchmark(false); }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            showHistory
              ? 'bg-emerald-50 text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-xl">📜</span>
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {lang === 'HI' ? 'इतिहास' : 'History'}
          </span>
          {historyCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        {/* Tab 5: About */}
        <button
          onClick={() => { setShowAbout(a => !a); setShowHistory(false); setShowBenchmark(false); }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            showAbout
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-xl">ℹ️</span>
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {lang === 'HI' ? 'परिचय' : 'About'}
          </span>
        </button>
        {/* Admin Panel: hidden from regular users — accessible only via secret govt URL */}
      </nav>

      {showAuthModal && (
        <AuthModal 
          lang={lang} 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={(u) => {
            setUser(u);
            setShowAuthModal(false);
          }} 
        />
      )}

      {showAdmin && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <AdminPanel onClose={() => setShowAdmin(false)} />
        </div>
      )}

      <KisanAiAssistant 
        lang={lang}
        onNavigate={navigate}
        onSelectPage={selectPage}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenWhatsAppBot={() => setShowWhatsAppBot(true)}
      />

      <WhatsAppBotModal 
        isOpen={showWhatsAppBot}
        onClose={() => setShowWhatsAppBot(false)}
        lang={lang}
        onNavigate={navigate}
        onSelectPage={selectPage}
      />
    </div>
  );
}
