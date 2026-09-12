import { useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const STORAGE_KEY = 'kisan_sahayak_history';

export function addHistoryEntry(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [{ id: Date.now(), timestamp: new Date().toISOString(), ...entry }, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('kisan_history_updated'));
  } catch (e) { console.error('[History] Failed to save:', e); }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('kisan_history_updated'));
}

export default function History({ lang = 'EN', onClose, onNavigate }) {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');

  const t = translations[lang]?.history || translations.EN.history;

  const loadEntries = () => {
    try { setEntries(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
    catch { setEntries([]); }
  };

  useEffect(() => {
    loadEntries();
    window.addEventListener('kisan_history_updated', loadEntries);
    return () => window.removeEventListener('kisan_history_updated', loadEntries);
  }, []);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.type === filter);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(lang === 'HI' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' }) +
           ' · ' + d.toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="animate-slide-up w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t.title}</h2>
          <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 text-slate-500">
            {t.subtitle} — {entries.length} {lang === 'HI' ? 'रिकॉर्ड डिवाइस पर सुरक्षित' : 'records stored locally'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {entries.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(lang === 'HI' ? 'क्या आप सभी इतिहास मिटाना चाहते हैं?' : 'Are you sure you want to clear all history?')) {
                  clearHistory();
                }
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
            >
              {t.btnClear}
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer shadow-xs">
            {t.btnClose}
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {[
          { key: 'all',    label: `🗂️ ${t.filterAll}`,      count: entries.length },
          { key: 'vision', label: `📷 ${t.filterVision}`,   count: entries.filter(e => e.type === 'vision').length },
          { key: 'voice',  label: `🎙️ ${t.filterVoice}`,    count: entries.filter(e => e.type === 'voice').length },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs"
            style={{
              background: filter === f.key ? '#059669' : '#FFFFFF',
              color: filter === f.key ? '#fff' : '#475569',
              border: filter === f.key ? 'none' : '1px solid #E2E8F0',
            }}>
            <span>{f.label}</span>
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full"
              style={{ background: filter === f.key ? 'rgba(255,255,255,0.25)' : '#F1F5F9' }}>
              {f.count}
            </span>
          </button>
        ))}
        <span className="ml-auto text-[10px] sm:text-xs flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
          <span className="hidden sm:inline">{t.encryptedNote}</span>
          <span className="sm:hidden">{lang === 'HI' ? 'सुरक्षित' : 'Secured'}</span>
        </span>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16 px-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center text-4xl bg-slate-50 border border-slate-200">
            {filter === 'vision' ? '📷' : filter === 'voice' ? '🎙️' : '📭'}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t.emptyTitle}</h3>
          <p className="text-base max-w-md mx-auto text-slate-600">
            {t.emptyDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <button
              onClick={() => onNavigate ? onNavigate('vision') : onClose()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>📷</span>
              <span>{t.btnScan}</span>
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('voice') : onClose()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-600/20"
            >
              <span>🎙️</span>
              <span>{t.btnVoice}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[36rem] overflow-y-auto pr-1">
          {filtered.map(entry => <HistoryCard key={entry.id} entry={entry} lang={lang} formatTime={formatTime} />)}
        </div>
      )}

      {/* Production note */}
      <div className="p-4 rounded-2xl flex items-start gap-3 bg-amber-50 border border-amber-200">
        <span className="text-xl flex-shrink-0">🔒</span>
        <p className="text-xs leading-relaxed text-slate-700">
          <strong className="text-amber-800">
            {lang === 'HI' ? 'उत्पादन सुरक्षा टिप्पणी:' : 'Production Architecture Note:'}
          </strong>{' '}
          {lang === 'HI'
            ? 'यह ब्राउज़र प्रोटोटाइप स्थानीय लोकल स्टोरेज का उपयोग करता है। प्रोडक्शन में यह डेटा लेयर क्वालकॉम स्नैपड्रैगन सिक्योर प्रोसेसिंग यूनिट (SPU) द्वारा सुरक्षित AES-256 एन्क्रिप्टेड हार्डवेयर डेटाबेस में रहता है — शून्य क्लाउड सिंक और 100% डेटा संप्रभुता।'
            : 'This browser prototype utilizes browser-isolated local storage. In production, this data layer deploys an AES-256 hardware-encrypted SQLite database secured by the Qualcomm Snapdragon Secure Processing Unit (SPU) — guaranteed zero cloud synchronization and 100% data sovereignty.'}
        </p>
      </div>
    </div>
  );
}

function HistoryCard({ entry, lang = 'EN', formatTime }) {
  const isVision = entry.type === 'vision';
  const sevColor = entry.severity === 'none' ? '#059669' : entry.severity === 'high' ? '#dc2626' : '#d97706';

  const sevLabel = entry.severity === 'none'
    ? (lang === 'HI' ? '✅ स्वस्थ फसल' : '✅ Healthy')
    : entry.severity === 'high'
    ? (lang === 'HI' ? '🔴 गंभीर संक्रमण' : '🔴 Severe')
    : (lang === 'HI' ? '⚠️ मध्यम लक्षण' : '⚠️ Moderate');

  return (
    <div className="card p-4 hover:scale-[1.005] transition-all duration-200 cursor-default bg-white border border-slate-200 shadow-sm"
      style={{ borderLeft: `3px solid ${isVision ? '#059669' : '#d97706'}` }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: isVision ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)' }}>
          {isVision ? '📷' : '🎙️'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="badge" style={isVision
              ? { background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', color: '#059669' }
              : { background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)', color: '#d97706' }}>
              {isVision ? (lang === 'HI' ? 'किसान कवच' : 'Kisan Kavach') : (lang === 'HI' ? 'आवाज़ सहायक' : 'Awaaz Sahayak')}
            </span>
            <span className="text-xs text-slate-400">{formatTime(entry.timestamp)}</span>
          </div>
          <p className="font-semibold text-sm mt-2 text-slate-900 truncate">{entry.title}</p>
          <p className="text-xs mt-1 truncate-2 text-slate-600">{entry.summary}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {entry.confidence && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {entry.confidence}% {lang === 'HI' ? 'सटीकता' : 'confidence'}
              </span>
            )}
            {entry.severity && entry.severity !== 'unknown' && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${sevColor}15`, color: sevColor, border: `1px solid ${sevColor}40` }}>
                {sevLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
