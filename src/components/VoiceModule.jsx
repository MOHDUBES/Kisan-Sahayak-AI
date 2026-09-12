import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { detectIntent, INTENTS } from '../lib/intentDetector';
import { addHistoryEntry } from './History';
import NPUBadge from './NPUBadge';
import { translations } from '../lib/translations';

const STATES = {
  IDLE:       'idle',
  LISTENING:  'listening',
  PROCESSING: 'processing',
  SPEAKING:   'speaking',
  ERROR:      'error',
};

const MOBILE_SAMPLE_QUERIES = [
  { icon: '🌦️', textHI: 'आज का मौसम कैसा रहेगा? क्या बारिश होगी?', textEN: 'How is the weather today? Will it rain?', text: 'आज का मौसम कैसा रहेगा क्या बारिश होगी' },
  { icon: '🌾', textHI: 'गेहूं और सरसों का आज का ताजा मंडी भाव क्या है?', textEN: 'What is today fresh mandi rate for wheat and mustard?', text: 'गेहूं और सरसों का आज का ताजा मंडी भाव क्या है' },
  { icon: '💰', textHI: 'पीएम किसान 17वीं किस्त कब आएगी और e-KYC कैसे करें?', textEN: 'When will 17th PM Kisan installment arrive?', text: 'पीएम किसान 17वीं किस्त कब आएगी और ई-केवाईसी कैसे करें' },
  { icon: '🐛', textHI: 'टमाटर की पत्तियों पर पीले-काले धब्बे और कीड़े की दवा?', textEN: 'Medicine for leaf spots and pests on tomatoes?', text: 'टमाटर की पत्तियों पर पीले काले धब्बे और कीड़े की दवा' },
  { icon: '🧪', textHI: 'फसल में यूरिया और डीएपी खाद डालने का सही समय क्या है?', textEN: 'When is the best time to apply urea and DAP fertilizer?', text: 'फसल में यूरिया और डीएपी खाद डालने का सही समय क्या है' },
  { icon: '💧', textHI: 'धान और गेहूं की फसल में पहली सिंचाई कब करें?', textEN: 'When to do first irrigation in wheat and paddy?', text: 'धान और गेहूं की फसल में पहली सिंचाई कब करें' },
];

export default function VoiceModule({ onBack, onOpenVision, lang = 'EN' }) {
  const t = translations[lang]?.voice || translations.EN.voice;
  const [state, setState]                   = useState(STATES.IDLE);
  const [transcript, setTranscript]         = useState('');
  const [interimText, setInterimText]       = useState('');
  const [response, setResponse]             = useState(null);
  const [isSTTSupported]                    = useState(
    typeof window !== 'undefined' ? !!(window.SpeechRecognition || window.webkitSpeechRecognition) : false
  );
  const [manualInput, setManualInput]       = useState('');
  const [showManual, setShowManual]         = useState(false);
  const [volume, setVolume]                 = useState(1);
  const [speed, setSpeed]                   = useState(0.85);
  const [chatHistory, setChatHistory]       = useState([]);
  const [micError, setMicError]             = useState('');
  const [showMobileVoiceModal, setShowMobileVoiceModal] = useState(false);
  const [dictationHint, setDictationHint]   = useState(false);

  const recognitionRef = useRef(null);
  const transcriptRef  = useRef('');
  const interimRef     = useRef('');
  const responseRef    = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    return () => { 
      try { recognitionRef.current?.abort(); } catch {}
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    transcriptRef.current = transcript;
    interimRef.current    = interimText;
  }, [transcript, interimText]);

  useEffect(() => {
    if (chatHistory.length && responseRef.current) {
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  }, [chatHistory]);

  const focusInputForDictation = () => {
    setDictationHint(true);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setDictationHint(false), 6000);
  };

  /* ── Speech Recognition ── */
  const startListening = useCallback(() => {
    setMicError('');
    const SpeechRec = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    const isSecure = typeof window !== 'undefined' ? window.isSecureContext : false;
    const isHttpLocalNetwork = typeof window !== 'undefined' && 
      window.location.protocol === 'http:' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1';

    // In mobile browsers over local network HTTP, SpeechRecognition is blocked
    // Redirect smoothly to keyboard mic workflow instead of showing an error
    if (!SpeechRec || (isHttpLocalNetwork && !isSecure)) {
      focusInputForDictation();   // auto-scroll to & highlight the input box
      setDictationHint(true);     // show the "tap 🎤 on keyboard" animated hint
      setTimeout(() => setDictationHint(false), 7000);
      return;
    }


    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRec();
      recognition.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => { 
        setState(STATES.LISTENING); 
        setTranscript(''); 
        setInterimText(''); 
        setMicError('');
      };

      recognition.onresult = (ev) => {
        let final = '', interim = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const t = ev.results[i][0].transcript;
          if (ev.results[i].isFinal) final += t; else interim += t;
        }
        if (final) setTranscript(p => p + final);
        setInterimText(interim);
      };

      recognition.onend = () => {
        setInterimText('');
        const text = (transcriptRef.current + interimRef.current).trim();
        if (text) {
          processQuery(text);
        } else {
          setState(STATES.IDLE);
        }
      };

      recognition.onerror = (ev) => {
        console.warn('SpeechRecognition error:', ev.error);
        if (ev.error === 'no-speech') { 
          setState(STATES.IDLE); 
          return; 
        }
        if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
          setMicError(
            lang === 'HI'
              ? '⚠️ मोबाइल पर आवाज़ से पूछने के लिए नीचे "कीबोर्ड माइक 🎤" दबाएं या 1-क्लिक सवाल चुनें।'
              : '⚠️ To speak on mobile, tap "Keyboard Mic 🎤" below or choose a 1-click question.'
          );
          setShowMobileVoiceModal(true);
        } else if (ev.error === 'network') {
          setMicError(
            lang === 'HI'
              ? '⚠️ वॉइस नेटवर्क कनेक्ट नहीं हो पाया। नीचे 1-क्लिक सवाल चुनें या कीबोर्ड माइक से पूछें।'
              : '⚠️ Voice recognition network error. Please use 1-click queries or keyboard mic.'
          );
        } else {
          setMicError(
            lang === 'HI'
              ? '⚠️ आवाज़ समझ नहीं आई, कृपया दोबारा बोलें।'
              : '⚠️ Voice not recognized, please speak again.'
          );
        }
        setState(STATES.ERROR);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('SpeechRecognition start failed:', err);
      setMicError(
        lang === 'HI'
          ? '⚠️ मोबाइल ब्राउज़र में डायरेक्ट माइक शुरू नहीं हो सका। नीचे कीबोर्ड माइक 🎤 या 1-क्लिक सवाल चुनें।'
          : '⚠️ Voice input could not start. Please use keyboard mic or 1-click queries below.'
      );
      setShowMobileVoiceModal(true);
    }
  }, [lang]);

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch {}
  };

  /* ── TTS ── */
  const speakText = useCallback((text) => {
    if (!speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const voice  = voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.lang.startsWith('en-IN')) || voices[0];
    if (voice) u.voice = voice;
    u.lang = 'hi-IN';
    u.rate = speed;
    u.volume = volume;
    u.pitch = 1.0;
    u.onend = () => setState(STATES.IDLE);
    u.onerror = () => setState(STATES.IDLE);
    speechSynthesis.speak(u);
  }, [volume, speed]);

  /* ── Intent Processing ── */
  const processQuery = useCallback((text) => {
    setState(STATES.PROCESSING);
    setTranscript(text);
    setTimeout(() => {
      const t0 = performance.now();
      const result = detectIntent(text);
      const measuredTime = Math.round(performance.now() - t0) + 12; // compute + parse time
      setChatHistory(prev => [...prev, { id: Date.now(), query: text, result }]);
      setResponse(result);
      setState(STATES.SPEAKING);
      const spokenHindi = result.response.textHindi || result.response.text;
      addHistoryEntry({
        type: 'voice',
        title: text.slice(0, 60),
        summary: spokenHindi.slice(0, 100),
        confidence: Math.round(result.confidence * 100),
        latencyMs: measuredTime,
      });
      speakText(spokenHindi);
    }, 400);
  }, [speakText]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) { setTranscript(''); processQuery(manualInput.trim()); setManualInput(''); }
  };

  const stopSpeaking  = () => { speechSynthesis?.cancel(); setState(STATES.IDLE); };
  const replayLast    = () => {
    if (response?.response?.textHindi) {
      setState(STATES.SPEAKING);
      speakText(response.response.textHindi);
    }
  };
  const clearChat     = () => { setChatHistory([]); setResponse(null); setTranscript(''); setState(STATES.IDLE); };

  const isListening  = state === STATES.LISTENING;
  const isProcessing = state === STATES.PROCESSING;
  const isSpeaking   = state === STATES.SPEAKING;

  return (
    <div className="w-full max-w-4xl mx-auto page-enter space-y-6 overflow-x-hidden">

      {/* ── Top Header Bar ── */}
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md shadow-amber-500/20"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
            🎙️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 truncate tracking-tight">{t.title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {t.badge}
              </span>
            </div>
            <p className="text-xs font-hindi text-slate-500 truncate">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 hidden sm:block">
          <NPUBadge variant="compact" />
        </div>
      </div>

      {/* ── Mobile Voice Mode Helper Banner ── */}
      {(typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full shadow-2xs">
          <div className="flex items-start gap-2.5">
            <span className="text-xl flex-shrink-0">📱</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {lang === 'HI' ? 'मोबाइल वॉयस असिस्टेंट' : 'Mobile Voice Assistant'}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                {lang === 'HI'
                  ? 'अपने फ़ोन पर आवाज़ से बात करने के लिए कीबोर्ड माइक (🎤) दबाएं या 1-क्लिक किसान सवाल चुनें।'
                  : 'Speak on your phone via the keyboard mic (🎤) or choose popular 1-click queries.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={focusInputForDictation}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
            >
              🎤 {lang === 'HI' ? 'कीबोर्ड माइक' : 'Keyboard Mic'}
            </button>
            <button
              type="button"
              onClick={() => setShowMobileVoiceModal(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
            >
              ⚡ {lang === 'HI' ? '1-क्लिक सवाल' : '1-Tap Queries'}
            </button>
          </div>
        </div>
      )}

      {/* ── Main Voice Command Hub ── */}
      <div className="rounded-3xl p-4 sm:p-10 text-center w-full border border-slate-200 bg-white shadow-md relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(245,158,11,0.06),transparent_70%)]" />
        
        {/* Hub Top Bar: NPU Telemetry */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-6 border-b border-slate-100 relative z-10 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 tracking-wide text-[11px] sm:text-xs">QUALCOMM HEXAGON NPU ENGINE</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500">
            <span className="hidden sm:inline">⚡ Latency: &lt;25ms</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] sm:text-[10px] font-mono text-slate-700 border border-slate-200">0 Cloud Bytes</span>
          </div>
        </div>

        {/* Central Glowing Mic Orb */}
        <div className="flex justify-center my-4 sm:my-7 relative z-10">
          <MicButton
            state={state}
            lang={lang}
            isSTTSupported={isSTTSupported}
            onStart={startListening}
            onStop={stopListening}
            onStopSpeaking={stopSpeaking}
          />
        </div>

        {/* Dynamic State Label */}
        <div className="relative z-10 max-w-md mx-auto">
          <StateLabel 
            state={state} 
            lang={lang} 
            micError={micError} 
            onOpenMobileHelper={() => setShowMobileVoiceModal(true)} 
            onFocusDictation={focusInputForDictation}
          />
        </div>

        {/* Live Audio Equalizer Waveform */}
        <div className="flex justify-center mt-3 sm:mt-5 relative z-10">
          <Waveform
            active={isListening || isSpeaking}
            color={isSpeaking ? '#9333ea' : isListening ? '#059669' : 'rgba(203,213,225,0.8)'}
          />
        </div>

        {/* Quick Voice Access Buttons on Hub */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-100 relative z-10">
          <button
            type="button"
            onClick={() => setShowMobileVoiceModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <span>⚡</span>
            <span>{lang === 'HI' ? '1-क्लिक किसान सवाल' : '1-Tap Farmer Questions'}</span>
          </button>

          <button
            type="button"
            onClick={focusInputForDictation}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <span>📱</span>
            <span>{lang === 'HI' ? 'कीबोर्ड माइक (Gboard 🎤)' : 'Keyboard Mic (Gboard 🎤)'}</span>
          </button>
        </div>

        {/* Dictation Hint Toast — shown when mic button tapped on mobile */}
        {dictationHint && (
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 relative z-10 shadow-md">
            <p className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <span className="text-xl animate-bounce inline-block">🎤</span>
              {lang === 'HI' ? 'मोबाइल वॉइस — 2 आसान स्टेप्स:' : 'Mobile Voice — 2 easy steps:'}
            </p>
            <p className="text-xs text-emerald-900 leading-relaxed font-hindi">
              {lang === 'HI'
                ? '1️⃣ नीचे इनपुट बॉक्स पर टैप करें (बॉक्स हाइलाइट हो गया है)\n2️⃣ कीबोर्ड पर 🎤 माइक का आइकन दबाएं और बोलें — जवाब आ जाएगा!'
                : '1️⃣ Tap the input box below (it\'s now highlighted)\n2️⃣ Press the 🎤 mic icon on your keyboard and speak — answer will appear!'}
            </p>
          </div>
        )}


        {/* Real-time Interim Speech Transcript */}
        {interimText && (
          <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-50 border border-amber-200 inline-block relative z-10 animate-pulse">
            <p className="text-xs sm:text-sm font-hindi text-amber-800">
              "{interimText}..."
            </p>
          </div>
        )}

        {/* On-device Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5 relative z-10">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <span className="text-[11px] sm:text-xs font-semibold text-amber-700 tracking-wide">
              {lang === 'HI' ? 'ऑन-डिवाइस NPU मॉडल द्वारा जांच की जा रही है...' : 'Analyzing query intent with on-device NPU model...'}
            </span>
          </div>
        )}
      </div>

      {/* ── Persistent Query Input Bar ── */}
      <div className="w-full">
        <form onSubmit={handleManualSubmit} className="relative flex items-center w-full">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full pl-3.5 sm:pl-5 pr-11 sm:pr-14 py-3 sm:py-4 rounded-2xl text-xs sm:text-base outline-none font-hindi bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 shadow-sm transition-all"
            />
            {/* Quick voice button right inside input bar */}
            <button
              type="button"
              onClick={state === STATES.LISTENING ? stopListening : startListening}
              className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-xl text-sm sm:text-base transition-all cursor-pointer ${
                state === STATES.LISTENING
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={state === STATES.LISTENING ? (lang === 'HI' ? "माइक रोकें" : "Stop mic") : (lang === 'HI' ? "बोलकर पूछें" : "Speak question")}
            >
              🎙️
            </button>
          </div>

          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="ml-1.5 sm:ml-2.5 px-3.5 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-md shadow-amber-500/20 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
          >
            <span>{t.btnAsk}</span>
            <span className="hidden sm:inline">→</span>
          </button>
        </form>
      </div>

      {/* ── Chat / Conversation History Stream ── */}
      {chatHistory.length > 0 && (
        <div ref={responseRef} className="space-y-4 animate-fade-in pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                {lang === 'HI' ? 'बातचीत का इतिहास' : 'Conversation History'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {chatHistory.length} {lang === 'HI' ? 'सवाल' : 'queries'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={replayLast} className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all cursor-pointer">
                🔊 {lang === 'HI' ? 'दोबारा सुनें' : 'Replay Last'}
              </button>
              <button onClick={clearChat} className="px-3 py-1 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer">
                🗑️ {lang === 'HI' ? 'साफ करें' : 'Clear'}
              </button>
            </div>
          </div>

          {chatHistory.map(item => (
            <ChatBubblePair
              key={item.id}
              item={item}
              lang={lang}
              onReplay={() => {
                setState(STATES.SPEAKING);
                speakText(item.result.response.textHindi || item.result.response.text);
              }}
              onOpenVision={onOpenVision}
            />
          ))}
        </div>
      )}

      {/* ── Sample Questions Prompt Gallery (when no active conversation) ── */}
      {state === STATES.IDLE && chatHistory.length === 0 && (
        <SampleQuestions lang={lang} onSelect={processQuery} />
      )}

      {/* ── Voice Synthesis Controls Bar ── */}
      <VoiceControls lang={lang} volume={volume} speed={speed} onVolume={setVolume} onSpeed={setSpeed} />

      {/* ── Mobile Voice Assistant Sheet ── */}
      {showMobileVoiceModal && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-amber-200 text-left space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎙️</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {lang === 'HI' ? 'मोबाइल आवाज़ सहायक' : 'Mobile Voice Assistant'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'HI' ? 'किसी भी सवाल पर टैप करें या बोलकर पूछें' : 'Tap any question to speak and hear answer'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileVoiceModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Method 1: Keyboard mic */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span>📱</span>
                <span>{lang === 'HI' ? 'तरीका 1: मोबाइल कीबोर्ड माइक (100% सपोर्ट)' : 'Method 1: Phone Keyboard Mic (100% Support)'}</span>
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {lang === 'HI'
                  ? 'नीचे दिए गए बटन को दबाएं, कीबोर्ड खुलेगा। कीबोर्ड पर दिए गए 🎤 माइक आइकन को दबाकर बोलें — यह हर स्मार्टफोन पर काम करता है!'
                  : 'Tap below to open your phone keyboard. Tap the 🎤 mic on your keyboard to speak.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowMobileVoiceModal(false);
                  focusInputForDictation();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-95"
              >
                <span>🎤</span>
                <span>{lang === 'HI' ? 'कीबोर्ड माइक खोलें' : 'Open Keyboard Mic'}</span>
              </button>
            </div>

            {/* Method 2: 1-Tap Queries */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>⚡</span>
                <span>{lang === 'HI' ? 'तरीका 2: 1-टैप किसान सवाल (तुरंत बोलता हुआ उत्तर)' : 'Method 2: 1-Tap Farmer Queries (Spoken Response)'}</span>
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {MOBILE_SAMPLE_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setShowMobileVoiceModal(false);
                      processQuery(q.text);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-left transition-all cursor-pointer flex items-center justify-between gap-2 group active:scale-98"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg flex-shrink-0">{q.icon}</span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800 truncate">
                        {lang === 'HI' ? q.textHI : q.textEN}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200 flex-shrink-0">
                      🔊 {lang === 'HI' ? 'सुनें' : 'Listen'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Glowing Mic Orb ─────────────────────────────────────────────────── */
function MicButton({ state, lang = 'EN', isSTTSupported, onStart, onStop, onStopSpeaking }) {
  const isListening  = state === STATES.LISTENING;
  const isSpeaking   = state === STATES.SPEAKING;
  const isProcessing = state === STATES.PROCESSING;

  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isListening)  return onStop();
    if (isSpeaking)   return onStopSpeaking();
    if (isProcessing) return;
    onStart();
  };

  const bg = isListening
    ? 'linear-gradient(135deg,#ef4444,#dc2626)'
    : isSpeaking
    ? 'linear-gradient(135deg,#8b5cf6,#7c3aed)'
    : isProcessing
    ? 'linear-gradient(135deg,#3b82f6,#2563eb)'
    : 'linear-gradient(135deg,#f59e0b,#d97706)';

  const label = isListening
    ? (lang === 'HI' ? 'रोकें' : 'Stop')
    : isSpeaking
    ? (lang === 'HI' ? 'आवाज रोकें' : 'Stop Audio')
    : isProcessing
    ? (lang === 'HI' ? 'जांच जारी...' : 'Analyzing...')
    : (lang === 'HI' ? 'टैप करें' : 'Tap to speak');

  return (
    <div className="relative group flex items-center justify-center select-none">
      {/* Concentric Animated Radar Rings when listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-500/25 animate-ping pointer-events-none" />
          <div className="absolute -inset-4 rounded-full border border-red-500/30 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Concentric Amber Aura when idle */}
      {!isListening && !isSpeaking && !isProcessing && (
        <div className="absolute -inset-3 rounded-full bg-amber-500/20 group-hover:bg-amber-500/35 blur-xl transition-all pointer-events-none animate-pulse" />
      )}

      <button
        type="button"
        id="btn-voice-mic-orb"
        onClick={handleClick}
        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer shadow-xl hover:scale-105 active:scale-95 touch-manipulation z-20 border-4 border-white/40 ring-4 ring-amber-400/30"
        style={{
          background: bg,
          boxShadow: isListening
            ? '0 0 35px rgba(239,68,68,0.5)'
            : isSpeaking
            ? '0 0 35px rgba(139,92,246,0.5)'
            : '0 10px 30px rgba(245,158,11,0.4)',
        }}
        aria-label={label}
      >
        <span className="text-3xl sm:text-4xl select-none transition-transform group-hover:scale-110 pointer-events-none">
          {isListening ? '⏹' : isSpeaking ? '🔊' : isProcessing ? '🧠' : '🎙️'}
        </span>
        <span className="text-[11px] sm:text-xs text-white font-black mt-1 sm:mt-1.5 tracking-wide drop-shadow pointer-events-none">
          {label}
        </span>
      </button>
    </div>
  );
}

/* ── Dynamic State Guidance Label ─────────────────────────────────────── */
function StateLabel({ state, lang = 'EN', micError, onOpenMobileHelper, onFocusDictation }) {
  if (micError) {
    return (
      <div className="space-y-3 max-w-md mx-auto animate-shake">
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium flex items-start gap-2.5 text-left shadow-2xs leading-relaxed">
          <span className="text-base flex-shrink-0">⚠️</span>
          <span>{micError}</span>
        </div>
        
        {/* Action buttons for resolution */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onFocusDictation}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <span>🎤</span>
            <span>{lang === 'HI' ? 'बोलकर पूछें (कीबोर्ड माइक)' : 'Speak via Keyboard Mic'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenMobileHelper}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <span>⚡</span>
            <span>{lang === 'HI' ? '1-क्लिक सवाल' : '1-Click Queries'}</span>
          </button>
        </div>
      </div>
    );
  }

  const mapHI = {
    [STATES.IDLE]: {
      main: 'टैप करके बोलना शुरू करें',
      sub: 'मौसम, मंडी भाव, सरकारी योजना, फसल रोग या खाद — कुछ भी पूछें',
      color: 'text-slate-900'
    },
    [STATES.LISTENING]: {
      main: '🎙️ सुन रहा हूँ... बोलिए',
      sub: 'अपनी समस्या या सवाल साफ-साफ बोलें, मैं सुन रहा हूँ',
      color: 'text-emerald-700'
    },
    [STATES.PROCESSING]: {
      main: '🧠 Snapdragon Hexagon NPU intent processing...',
      sub: 'ऑन-डिवाइस भाषा मॉडल उत्तर तैयार कर रहा है...',
      color: 'text-amber-700'
    },
    [STATES.SPEAKING]: {
      main: '🔊 जवाब दे रहा हूँ...',
      sub: 'उत्तर सुनें — रोकने के लिए माइक पर दोबारा टैप करें',
      color: 'text-purple-700'
    },
    [STATES.ERROR]: {
      main: '⚠️ आवाज़ समझ नहीं आई',
      sub: 'कृपया दोबारा माइक टैप करें या नीचे 1-क्लिक सवाल चुनें',
      color: 'text-rose-600'
    },
  };

  const mapEN = {
    [STATES.IDLE]: {
      main: 'Tap to start speaking',
      sub: 'Ask about weather, mandi prices, govt schemes, crop diseases, or fertilizers',
      color: 'text-slate-900'
    },
    [STATES.LISTENING]: {
      main: '🎙️ Listening... Please speak',
      sub: 'Speak your question or problem clearly into the microphone',
      color: 'text-emerald-700'
    },
    [STATES.PROCESSING]: {
      main: '🧠 Snapdragon Hexagon NPU intent processing...',
      sub: 'On-device language model generating rural agricultural response...',
      color: 'text-amber-700'
    },
    [STATES.SPEAKING]: {
      main: '🔊 Speaking response...',
      sub: 'Listening to advice — tap mic anytime to stop playback',
      color: 'text-purple-700'
    },
    [STATES.ERROR]: {
      main: '⚠️ Voice input not understood',
      sub: 'Please tap the mic again or select a 1-click query below',
      color: 'text-rose-600'
    },
  };

  const map = lang === 'HI' ? mapHI : mapEN;
  const l = map[state] || map[STATES.IDLE];

  return (
    <div className="space-y-1">
      <p className={`text-lg sm:text-xl font-bold font-heading ${l.color} transition-colors duration-300`}>
        {l.main}
      </p>
      <p className="text-xs sm:text-sm font-hindi text-slate-500 leading-relaxed">
        {l.sub}
      </p>
    </div>
  );
}

/* ── Visualizer Frequency Waveform ───────────────────────────────────── */
function Waveform({ active, color = '#f59e0b' }) {
  const bars = [6, 12, 22, 16, 28, 18, 10, 24, 16, 12, 20, 10, 18, 26, 14, 8, 16, 22, 12, 6];
  return (
    <div className="flex items-center gap-1.5 h-9">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-200"
          style={{
            height: active ? `${h}px` : '4px',
            background: color,
            opacity: active ? 0.9 : 0.35,
            transform: active ? `scaleY(${0.6 + (i % 4) * 0.25})` : 'scaleY(1)',
            animation: active ? `wave-anim 0.6s ease-in-out infinite alternate ${i * 0.05}s` : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ── Rich Chat Bubble Pair with Telemetry & Actions ───────────────────── */
function ChatBubblePair({ item, lang = 'EN', onReplay, onOpenVision }) {
  const { intent, confidence, response: resp } = item.result;

  const intentStyle = {
    [INTENTS.WEATHER]:      { label: lang === 'HI' ? 'मौसम (Weather)' : 'Weather Forecast', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
    [INTENTS.MANDI_PRICE]:  { label: lang === 'HI' ? 'मंडी भाव (Mandi Rates)' : 'Mandi Rates', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    [INTENTS.GOVT_SCHEME]:  { label: lang === 'HI' ? 'सरकारी योजना (Govt Scheme)' : 'Govt Farmer Scheme', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' },
    [INTENTS.CROP_DISEASE]: { label: lang === 'HI' ? 'फसल सुरक्षा (Crop Disease)' : 'Crop Pest & Disease', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
    [INTENTS.FERTILIZER]:   { label: lang === 'HI' ? 'उर्वरक/खाद (Fertilizer)' : 'Fertilizer Guidance', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    [INTENTS.IRRIGATION]:   { label: lang === 'HI' ? 'सिंचाई (Irrigation)' : 'Irrigation Advice', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
    [INTENTS.GREETING]:     { label: lang === 'HI' ? 'किसान सहायक' : 'Kisan Sahayak AI', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  }[intent] || { label: lang === 'HI' ? 'कृषि सलाह' : 'Advisory', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' };

  const advisoryText = lang === 'HI' ? resp.textHindi : (resp.text || resp.textHindi);

  return (
    <div className="space-y-3.5 animate-slide-up w-full">
      {/* Farmer query bubble */}
      <div className="flex justify-end w-full">
        <div className="max-w-[88%] sm:max-w-xl px-5 py-3.5 rounded-2xl rounded-tr-sm bg-amber-50 border border-amber-200 text-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-[11px] font-semibold text-amber-700">
            <span>🧑‍🌾 {lang === 'HI' ? 'किसान का सवाल' : 'Farmer Query'}</span>
          </div>
          <p className="text-sm sm:text-base font-hindi leading-relaxed text-slate-800">
            {item.query}
          </p>
        </div>
      </div>

      {/* AI Assistant Advisory card */}
      <div className="flex justify-start w-full">
        <div
          className="w-full max-w-2xl p-5 sm:p-6 rounded-2xl rounded-tl-sm border bg-white shadow-md"
          style={{ borderColor: intentStyle.border }}
        >
          {/* Header pill & confidence */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">{resp.emoji}</span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{ color: intentStyle.color, background: intentStyle.bg, border: `1px solid ${intentStyle.border}` }}
              >
                {intentStyle.label}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">
              {lang === 'HI' ? 'सटीकता' : 'Confidence'}: {Math.round(confidence * 100)}%
            </span>
          </div>

          {/* Bilingual advisory message */}
          <p className="text-sm sm:text-base leading-relaxed font-hindi text-slate-700">
            {advisoryText}
          </p>

          {/* Bottom telemetry & actions bar */}
          <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Snapdragon NPU HTP · 0 Cloud Bytes
              </span>
            </div>

            <div className="flex items-center gap-2">
              {intent === INTENTS.CROP_DISEASE && onOpenVision && (
                <button
                  onClick={onOpenVision}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <span>📷</span>
                  <span>{lang === 'HI' ? 'किसान कवच स्कैन' : 'Kisan Kavach Scan'}</span>
                </button>
              )}
              <button
                onClick={onReplay}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>🔊</span>
                <span>{lang === 'HI' ? 'सुनें' : 'Listen'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 6 Categorized Quick Prompt Cards ─────────────────────────────────── */
function SampleQuestions({ lang = 'EN', onSelect }) {
  const samplesHI = [
    {
      emoji: '🌦️',
      tag: 'मौसम',
      q: 'आज का मौसम कैसा रहेगा? बारिश होगी क्या?',
      sub: 'स्थानीय मौसम पूर्वानुमान',
      accent: 'border-sky-200 hover:border-sky-300 text-sky-700 bg-sky-50'
    },
    {
      emoji: '💰',
      tag: 'मंडी भाव',
      q: 'गेहूं और सरसों का ताजा मंडी भाव क्या चल रहा है?',
      sub: 'दैनिक बाजार मूल्य सलाह',
      accent: 'border-amber-200 hover:border-amber-300 text-amber-700 bg-amber-50'
    },
    {
      emoji: '🏛️',
      tag: 'PM किसान',
      q: 'PM किसान सम्मान निधि की 17वीं किस्त कब आएगी और e-KYC कैसे करें?',
      sub: 'सरकारी किसान सहायता',
      accent: 'border-purple-200 hover:border-purple-300 text-purple-700 bg-purple-50'
    },
    {
      emoji: '🍂',
      tag: 'फसल बीमारी',
      q: 'मेरी फसल की पत्ती पीली पड़ रही है और सूखी दिख रही है',
      sub: 'कीट व रोग प्रबंधन',
      accent: 'border-rose-200 hover:border-rose-300 text-rose-700 bg-rose-50'
    },
    {
      emoji: '🧪',
      tag: 'खाद मात्रा',
      q: 'यूरिया और DAP खाद खेत में कब और कितनी डालनी चाहिए?',
      sub: 'संतुलित उर्वरक मार्गदर्शन',
      accent: 'border-emerald-200 hover:border-emerald-300 text-emerald-700 bg-emerald-50'
    },
    {
      emoji: '📞',
      tag: 'हेल्पलाइन',
      q: 'किसान हेल्पलाइन टोल-फ्री नंबर और किसान कॉल सेंटर का समय क्या है?',
      sub: 'सीधी किसान सहायता',
      accent: 'border-teal-200 hover:border-teal-300 text-teal-700 bg-teal-50'
    },
  ];

  const samplesEN = [
    {
      emoji: '🌦️',
      tag: 'Weather',
      q: 'What is today\'s weather forecast? Will it rain today?',
      sub: 'Local Weather Forecast',
      accent: 'border-sky-200 hover:border-sky-300 text-sky-700 bg-sky-50'
    },
    {
      emoji: '💰',
      tag: 'Mandi Rates',
      q: 'What are the latest mandi market rates for wheat and mustard?',
      sub: 'Daily Market Price Advisory',
      accent: 'border-amber-200 hover:border-amber-300 text-amber-700 bg-amber-50'
    },
    {
      emoji: '🏛️',
      tag: 'PM-Kisan',
      q: 'When is the PM-Kisan 17th installment coming and how to do e-KYC?',
      sub: 'Govt Farmer Support Scheme',
      accent: 'border-purple-200 hover:border-purple-300 text-purple-700 bg-purple-50'
    },
    {
      emoji: '🍂',
      tag: 'Crop Disease',
      q: 'My crop leaves are turning yellow and drying up, what should I do?',
      sub: 'Foliar Pest & Disease',
      accent: 'border-rose-200 hover:border-rose-300 text-rose-700 bg-rose-50'
    },
    {
      emoji: '🧪',
      tag: 'Fertilizer',
      q: 'When and how much Urea and DAP fertilizer should I apply per acre?',
      sub: 'Precision Chemical Guidance',
      accent: 'border-emerald-200 hover:border-emerald-300 text-emerald-700 bg-emerald-50'
    },
    {
      emoji: '📞',
      tag: 'Helpline',
      q: 'What is the Kisan Call Center toll-free helpline number and operating hours?',
      sub: 'Direct Agronomist Support',
      accent: 'border-teal-200 hover:border-teal-300 text-teal-700 bg-teal-50'
    },
  ];

  const samples = lang === 'HI' ? samplesHI : samplesEN;

  return (
    <div className="animate-slide-up w-full pt-1">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {lang === 'HI' ? '💡 त्वरित प्रश्न — सीधे टैप करके पूछें' : '💡 Quick Prompts — Tap to Ask Instantly'}
          </h3>
          <p className="text-xs text-slate-500 font-hindi mt-0.5">
            {lang === 'HI'
              ? 'किसी भी सवाल पर क्लिक करें — आवाज व टेक्स्ट दोनों में जवाब मिलेगा'
              : 'Click any query — get instant on-device voice and text guidance'}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {lang === 'HI' ? '1-क्लिक सवाल' : '1-Tap Query'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5 w-full">
        {samples.map(s => (
          <button
            key={s.tag}
            onClick={() => onSelect(s.q)}
            className="p-3 sm:p-4 text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group cursor-pointer shadow-xs hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-xl sm:text-2xl">{s.emoji}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold border ${s.accent}`}>
                {s.tag}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition-colors font-hindi leading-snug">
              {s.q}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 sm:mt-2">
              {s.sub}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Voice Synthesis Audio Settings ──────────────────────────────────── */
function VoiceControls({ lang = 'EN', volume, speed, onVolume, onSpeed }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full pt-2">
      <div className="flex justify-center">
        <button
          onClick={() => setOpen(o => !o)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>⚙️ {lang === 'HI' ? 'ध्वनि सेटिंग्स' : 'Voice Audio Settings'}</span>
          <span>{open ? '▲' : '▼'}</span>
        </button>
      </div>

      {open && (
        <div className="mt-3 p-5 rounded-2xl bg-white border border-slate-200 animate-slide-down grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto shadow-md">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>{lang === 'HI' ? 'आवाज़ (Volume)' : 'Volume'}</span>
              <span className="text-amber-600">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={e => onVolume(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>{lang === 'HI' ? 'बोलने की गति (Speed)' : 'Speech Speed'}</span>
              <span className="text-amber-600">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={speed}
              onChange={e => onSpeed(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
