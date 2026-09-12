import KisanLogo from './KisanLogo';
import { translations } from '../lib/translations';

export default function Footer({ onNavigate, onSelectPage, onOpenBenchmark, onOpenHistory, onOpenAdmin, lang = 'EN' }) {
  const t = translations[lang] || translations.EN;

  return (
    <footer id="footer" className="pt-16 pb-12 max-w-7xl mx-auto px-6 lg:px-12 border-t border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14 pb-12 border-b border-slate-200">

        {/* Col 1: Brand */}
        <div className="space-y-4">
          <KisanLogo size={42} theme="light" onClick={() => onSelectPage && onSelectPage('home')} />
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.footer.tagline}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <span>🇮🇳</span>
            <span>{t.footer.builtFor}</span>
          </div>
        </div>

        {/* Col 2: Pages Navigation */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
            {lang === 'HI' ? 'वेबसाइट पृष्ठ' : 'Explore Pages'}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => onSelectPage && onSelectPage('home')}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>🏠</span>
                <span>{lang === 'HI' ? 'मुख्य पृष्ठ (Home)' : 'Home Overview'}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectPage && onSelectPage('product')}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>🌿</span>
                <span>{t.nav.product}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectPage && onSelectPage('how-it-works')}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>⚡</span>
                <span>{t.nav.howItWorks}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectPage && onSelectPage('impact')}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>🌾</span>
                <span>{t.nav.impact}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectPage && onSelectPage('team')}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>🏆</span>
                <span>{t.nav.team}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Hardware & AI Stack */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
            {t.footer.hardwareStack}
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Snapdragon® X Elite / X Plus</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Qualcomm Hexagon™ NPU (45 TOPS)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>HP OmniBook Ultra &amp; HP OmniBook 3</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Qualcomm AI Hub Model Registry</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Qualcomm SPU Hardware Vault</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Challenge Submission Info */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
            {t.footer.challengeTrack}
          </h4>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
            <div className="font-bold text-slate-900">{t.footer.challengeName}</div>
            <p className="text-slate-600">{t.footer.challengeSubtitle}</p>
            <div className="pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-700 block">{t.footer.themeTrack}</span>
              <span className="text-emerald-700 font-medium">{t.footer.themeValue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-3 flex-wrap">
          <span>{t.footer.copyright}</span>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-emerald-700 transition-colors text-[11px] underline cursor-pointer"
              title="Admin Console / एडमिन कंसोल"
            >
              ⚙️ Admin Portal
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.footer.onDeviceTag}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {t.footer.batteryTag}
          </span>
        </div>
      </div>
    </footer>
  );
}
