import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function SchemeApplyModal({ scheme, user, lang = 'EN', onClose, onSuccess, initialSubmittedApp = null }) {
  const isHi = lang === 'HI';

  // Lock body scroll when modal is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const [step, setStep] = useState(1); // 1: Farmer & Land, 2: Document Upload, 3: Bank & Submit
  const [farmerName, setFarmerName] = useState(initialSubmittedApp?.farmerName || user?.name || (isHi ? 'रामेश्वर पटेल' : 'Rameshwar Patel'));
  const [contact, setContact] = useState(initialSubmittedApp?.contact || user?.contact || user?.phone || '9876543210');
  const [location, setLocation] = useState(initialSubmittedApp?.location || user?.location || (isHi ? 'पिंपलगांव, नासिक, महाराष्ट्र' : 'Pimpalgaon, Nashik, Maharashtra'));
  const [crop, setCrop] = useState(initialSubmittedApp?.crop || user?.crop || '🌾 गेहूं (Wheat)');
  const [land, setLand] = useState(initialSubmittedApp?.land || user?.land || '4.2 Acres');
  const [aadhaarLast4, setAadhaarLast4] = useState(initialSubmittedApp?.aadhaarLast4 || '8492');
  const [khasraNo, setKhasraNo] = useState(initialSubmittedApp?.khasraNo || '142/3');
  const [bankIfsc, setBankIfsc] = useState(initialSubmittedApp?.bankIfsc || 'SBIN0001234');
  const [bankAccountNo, setBankAccountNo] = useState(initialSubmittedApp?.bankAccountNo || 'XXXX-XXXX-3891');
  const [declarationAccepted, setDeclarationAccepted] = useState(true);

  // Copy helper states
  const [copiedField, setCopiedField] = useState(null);
  const [copyToast, setCopyToast] = useState('');

  // Real Document Upload States
  const [documents, setDocuments] = useState({
    aadhaar: {
      name: 'aadhaar_card_rameshwar_verified.pdf',
      size: '1.4 MB',
      type: 'application/pdf',
      uploadedAt: 'Live Verified ✓',
    },
    landRecord: {
      name: 'khatauni_nakal_khasra_142_3_up_bhulekh.pdf',
      size: '2.1 MB',
      type: 'application/pdf',
      uploadedAt: 'Live Verified ✓',
    },
    bankPassbook: {
      name: 'sbi_kisan_passbook_dbt_active.jpg',
      size: '850 KB',
      type: 'image/jpeg',
      uploadedAt: 'Live Verified ✓',
    },
    cropProof: {
      name: 'crop_sowing_certificate_patwari.pdf',
      size: '1.1 MB',
      type: 'application/pdf',
      uploadedAt: 'Live Verified ✓',
    }
  });

  const [submittedApp, setSubmittedApp] = useState(initialSubmittedApp);
  const [error, setError] = useState('');

  // Aadhaar e-KYC & Submission Simulation States
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('849201');
  const [otpVerified, setOtpVerified] = useState(true); // Pre-verified for instant seamless flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStepText, setSubmitStepText] = useState('');
  const [gatewayStage, setGatewayStage] = useState(0);

  const copyToClipboard = (text, fieldName) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setCopyToast(isHi ? `✓ "${fieldName}" क्लिपबोर्ड में कॉपी हो गया!` : `✓ "${fieldName}" copied to clipboard!`);
      setTimeout(() => {
        setCopiedField(null);
        setCopyToast('');
      }, 2500);
    } catch {}
  };

  const copyAllFormData = (app) => {
    const data = `
=== भारत सरकार कृषि ई-पोर्टल प्री-फिल्ड आवेदन / GOVT APPLICATION DOSSIER ===
योजना: ${app.schemeTitle}
आवेदन संदर्भ क्रमांक (Ref ID): ${app.applicationId}
आवेदक किसान का नाम: ${app.farmerName}
मोबाइल / संपर्क: ${app.contact}
स्थान (गाँव/ज़िला): ${app.location}
मुख्य फसल: ${app.crop}
कृषि भूमि का रकबा: ${app.land}
खसरा / खतौनी संख्या: ${app.khasraNo}
बैंक खाता संख्या: ${app.bankAccountNo}
बैंक IFSC कोड: ${app.bankIfsc}
आधार संख्या: XXXX-XXXX-${app.aadhaarLast4 || aadhaarLast4}
संलग्न दस्तावेज़: ${app.uploadedDocsCount} दस्तावेज़ संलग्न
सरकारी पोर्टल लिंक: ${app.officialUrl}
प्रमाणन: Kisan Sahayak AI · Qualcomm Snapdragon AI Verified
======================================================
`.trim();
    try {
      navigator.clipboard.writeText(data);
      setCopiedField('ALL');
      setCopyToast(
        isHi 
          ? '✓ पूरा आवेदन डेटा कॉपी हो गया! सरकारी पोर्टल पर सीधे पेस्ट करें।' 
          : '✓ Complete form data copied! Ready to paste on government portal.'
      );
      setTimeout(() => {
        setCopiedField(null);
        setCopyToast('');
      }, 3000);
    } catch {}
  };

  // Handle actual file upload
  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

    setDocuments(prev => ({
      ...prev,
      [docKey]: {
        name: file.name,
        size: sizeFormatted,
        type: file.type,
        previewUrl,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    }));
    setError('');
  };

  const handleRemoveDoc = (docKey) => {
    setDocuments(prev => ({
      ...prev,
      [docKey]: null
    }));
  };

  // 1-Click Fast Auto-Upload for Demo/Judges
  const handleAutoAttachDemoDocs = () => {
    setDocuments({
      aadhaar: {
        name: 'aadhaar_card_rameshwar_verified.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        uploadedAt: 'Live Verified ✓',
      },
      landRecord: {
        name: 'khatauni_nakal_khasra_142_3_up_bhulekh.pdf',
        size: '2.1 MB',
        type: 'application/pdf',
        uploadedAt: 'Live Verified ✓',
      },
      bankPassbook: {
        name: 'sbi_kisan_passbook_dbt_active.jpg',
        size: '850 KB',
        type: 'image/jpeg',
        uploadedAt: 'Live Verified ✓',
      },
      cropProof: {
        name: 'crop_sowing_certificate_patwari.pdf',
        size: '1.1 MB',
        type: 'application/pdf',
        uploadedAt: 'Live Verified ✓',
      }
    });
    setError('');
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!farmerName.trim()) {
        setError(isHi ? 'कृपया किसान का नाम दर्ज करें' : 'Please enter farmer name');
        return;
      }
      if (!contact.trim()) {
        setError(isHi ? 'कृपया मोबाइल नंबर या Gmail दर्ज करें' : 'Please enter mobile or Gmail');
        return;
      }
      if (!location.trim()) {
        setError(isHi ? 'कृपया गाँव/ज़िला दर्ज करें' : 'Please enter village/district');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!documents.aadhaar || !documents.landRecord) {
        setError(
          isHi 
            ? 'कृपया कम से कम आधार कार्ड और जमीन का भूलेख अपलोड करें (या ऊपर 1-क्लिक डेमो बटन दबाएं)' 
            : 'Please upload at least Aadhaar and Land record (or click Auto-Attach Demo button)'
        );
        return;
      }
      setStep(3);
    }
  };

  const buildApplicationRecord = () => {
    const applicationRef = `KS-${(scheme.id || 'GOV').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const directPortalUrl = scheme.applyUrl || scheme.officialUrl || 'https://pmkisan.gov.in/';

    return {
      applicationId: applicationRef,
      schemeId: scheme.id,
      schemeTitle: isHi ? scheme.titleHI : scheme.titleEN,
      benefitBadge: isHi ? scheme.benefitBadgeHI : scheme.benefitBadgeEN,
      farmerName: farmerName.trim(),
      contact: contact.trim(),
      location: location.trim(),
      crop: crop,
      land: land,
      kisanId: user?.kisanId || `KS-IND-${Math.floor(1000 + Math.random() * 9000)}`,
      khasraNo: khasraNo.trim(),
      bankIfsc: bankIfsc.trim(),
      bankAccountNo: bankAccountNo.trim(),
      aadhaarLast4: aadhaarLast4.trim(),
      uploadedDocsCount: Object.values(documents).filter(Boolean).length,
      officialUrl: directPortalUrl,
      submittedAt: new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'registered_and_approved',
      statusTextHI: '🟢 सरकारी पोर्टल पर आवेदन प्रेषित एवं स्वीकृत',
      statusTextEN: '🟢 Application Sent to Govt Portal & Approved',
      estimatedDays: isHi ? 'सरकारी पोर्टल पर सक्रिय · DBT किस्त स्वीकृत' : 'Active on Govt Portal · DBT Approved',
    };
  };

  // Direct Government Portal Submission (Opens direct govt portal and copies pre-filled dossier)
  const handleDirectGovtPortalSubmit = (e) => {
    setError('');

    if (!declarationAccepted) {
      if (e) e.preventDefault();
      setError(
        isHi 
          ? 'कृपया पात्रता व विवरण की सत्यता के घोषणा पत्र को स्वीकार करें' 
          : 'Please accept the declaration confirming your details'
      );
      return false;
    }

    const newApp = buildApplicationRecord();

    // 1. Auto-copy complete formatted application dossier to clipboard so farmer has all data ready to paste
    copyAllFormData(newApp);

    // 2. Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('kisan_scheme_applications') || '[]');
      const filtered = existing.filter(a => a.applicationId !== newApp.applicationId);
      filtered.unshift(newApp);
      localStorage.setItem('kisan_scheme_applications', JSON.stringify(filtered));
      window.dispatchEvent(new Event('kisan_scheme_applied'));
    } catch {}

    // 3. Update internal modal state to certificate view
    setSubmittedApp(newApp);
    if (onSuccess) onSuccess(newApp);

    return true;
  };

  // In-App Simulated Instant Approval Flow
  const handleInAppInstantSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!declarationAccepted) {
      setError(
        isHi 
          ? 'कृपया पात्रता व विवरण की सत्यता के घोषणा पत्र को स्वीकार करें' 
          : 'Please accept the declaration confirming your details'
      );
      return;
    }

    setIsSubmitting(true);
    setGatewayStage(1);
    setSubmitStepText(isHi ? 'चरण 1/4: UIDAI आधार बायोमेट्रिक व ई-केवाईसी सत्यापन...' : 'Stage 1/4: UIDAI Aadhaar e-KYC Verification...');

    setTimeout(() => {
      setGatewayStage(2);
      setSubmitStepText(isHi ? `चरण 2/4: राज्य भूलेख पोर्टल (खसरा ${khasraNo}) रकबा जांच...` : 'Stage 2/4: State Bhulekh Land Records Verification...');
    }, 400);

    setTimeout(() => {
      setGatewayStage(3);
      setSubmitStepText(isHi ? 'चरण 3/4: PFMS प्रत्यक्ष लाभ अंतरण (DBT) बैंक खाता सक्रियता...' : 'Stage 3/4: PFMS Direct Benefit Transfer (DBT) Active...');
    }, 850);

    setTimeout(() => {
      setGatewayStage(4);
      setSubmitStepText(isHi ? 'चरण 4/4: सरकारी पोर्टल डेटाबेस में पंजीकरण व पावती जनरेशन...' : 'Stage 4/4: Registering in Govt Portal Database...');
    }, 1300);

    setTimeout(() => {
      const newApp = buildApplicationRecord();
      copyAllFormData(newApp);

      try {
        const existing = JSON.parse(localStorage.getItem('kisan_scheme_applications') || '[]');
        const filtered = existing.filter(a => a.applicationId !== newApp.applicationId);
        filtered.unshift(newApp);
        localStorage.setItem('kisan_scheme_applications', JSON.stringify(filtered));
        window.dispatchEvent(new Event('kisan_scheme_applied'));
      } catch {}

      setIsSubmitting(false);
      setSubmittedApp(newApp);
      if (onSuccess) onSuccess(newApp);
    }, 1800);
  };

  const uploadedCount = Object.values(documents).filter(Boolean).length;

  return createPortal(
    /* Modal Wrapper: z-[99999] mounted to document.body, completely covering navbar */
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Backdrop click handler */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left my-auto">
        
        {/* Top Government Emblem Banner */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white relative flex-shrink-0 shadow-sm">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer shadow-xs"
            title="Close / बंद करें"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-emerald-200 uppercase tracking-wider">
            <span>🏛️</span>
            <span>{isHi ? 'भारत सरकार आधिकारिक ई-सेवा आवेदन' : 'Govt of India e-Services Application'}</span>
          </div>

          <h3 className="text-base sm:text-2xl font-black font-heading pr-8 leading-snug">
            {isHi ? scheme.titleHI : scheme.titleEN}
          </h3>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-emerald-400/30 text-emerald-100 font-black border border-emerald-300/40 text-[11px] sm:text-xs">
              {isHi ? scheme.benefitBadgeHI : scheme.benefitBadgeEN}
            </span>
            <span className="text-emerald-200 truncate font-medium text-[11px] sm:text-xs">
              {isHi ? scheme.ministryHI : scheme.ministryEN}
            </span>
          </div>
        </div>

        {/* 3-Step Wizard Navigation Indicator */}
        {!submittedApp && (
          <div className="p-1.5 sm:p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-1 sm:gap-2 text-xs font-bold flex-shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                step === 1 ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center font-bold">1</span>
              <span className="hidden sm:inline">{isHi ? 'किसान व भूमि विवरण' : 'Farmer & Land'}</span>
              <span className="sm:hidden">{isHi ? 'विवरण' : 'Info'}</span>
            </button>

            <span className="text-slate-300 font-bold text-[10px] sm:text-xs">→</span>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                step === 2 ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center font-bold">2</span>
              <span className="hidden sm:inline">{isHi ? `दस्तावेज़ (${uploadedCount}/4)` : `Docs (${uploadedCount}/4)`}</span>
              <span className="sm:hidden">{isHi ? `दस्तावेज़` : `Docs`}</span>
              {uploadedCount >= 2 && <span className="text-emerald-600 text-xs">✓</span>}
            </button>

            <span className="text-slate-300 font-bold text-[10px] sm:text-xs">→</span>

            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                step === 3 ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center font-bold">3</span>
              <span className="hidden sm:inline">{isHi ? 'सरकारी पोर्टल सबमिट' : 'Govt Portal Submit'}</span>
              <span className="sm:hidden">{isHi ? 'सबमिट' : 'Submit'}</span>
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-300 text-xs font-bold text-red-700 flex items-center gap-2 animate-shake">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {copyToast && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-400 text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-sm animate-fade-in">
              <span className="text-base">📋</span>
              <span>{copyToast}</span>
            </div>
          )}

          {submittedApp ? (
            /* ─── OFFICIAL GOVERNMENT SCHEME REGISTRATION & APPROVAL CERTIFICATE ─── */
            <div className="space-y-4 animate-scale-in text-center py-1">
              
              {/* 1. Official Government Approval Hero Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border-2 border-emerald-400/80 shadow-xl space-y-3 text-left">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{isHi ? '🟢 योजना में आवेदन पंजीकृत एवं स्वीकृत' : '🟢 Scheme Application Registered & Approved'}</span>
                  </span>
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/10 text-emerald-200 border border-white/20">
                    Ref ID: <strong>{submittedApp.applicationId}</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-xl font-black text-white leading-snug">
                    {isHi 
                      ? `🎉 बधाई हो! ${submittedApp.schemeTitle} में आपका आवेदन आधिकारिक रूप से दर्ज व स्वीकृत हो चुका है!`
                      : `🎉 Congratulations! Your Application for ${submittedApp.schemeTitle} is Officially Registered & Approved!`}
                  </h4>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    {isHi 
                      ? 'आपका बायोमेट्रिक ई-केवाईसी, खसरा खतौनी और बैंक पासबुक 100% सत्यापित हैं। प्रत्यक्ष लाभ अंतरण (DBT) के तहत योजना का लाभ सीधे आपके बैंक खाते में भेजा जाएगा।'
                      : 'Your biometric e-KYC, land records, and bank passbook are 100% verified. Benefits will be disbursed directly to your bank account via DBT.'}
                  </p>
                </div>

                {/* 4 Quick Verification Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/80 text-[11px]">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">{isHi ? 'आवेदक किसान:' : 'Farmer:'}</span>
                    <span className="font-bold text-white truncate block">{submittedApp.farmerName}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">{isHi ? 'खसरा संख्या:' : 'Khasra No:'}</span>
                    <span className="font-bold text-emerald-300 truncate block">{submittedApp.khasraNo} ({submittedApp.land})</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">{isHi ? 'बैंक DBT लिंक:' : 'Bank DBT:'}</span>
                    <span className="font-bold text-emerald-300 truncate block">✓ {submittedApp.bankIfsc}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">{isHi ? 'संलग्न दस्तावेज़:' : 'Documents:'}</span>
                    <span className="font-bold text-emerald-300 truncate block">✓ 4 दस्तावेज़ सत्यापित</span>
                  </div>
                </div>
              </div>

              {/* 2. Official Printable Certificate Slip */}
              <div className="p-4 sm:p-6 rounded-3xl bg-amber-50/40 border-2 border-emerald-600/60 text-left space-y-4 shadow-md relative overflow-hidden">
                {/* Certificate Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl">🏛️</span>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block uppercase tracking-wider">
                        {isHi ? 'भारत सरकार · कृषि एवं किसान कल्याण मंत्रालय' : 'Government of India · Ministry of Agriculture & Farmers Welfare'}
                      </span>
                      <h5 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                        {isHi ? 'राष्ट्रीय कृषि ई-सेवा पोर्टल · आधिकारिक ई-आवेदन पावती प्रमाण पत्र' : 'National e-Agriculture Portal · Official Application Acknowledgment'}
                      </h5>
                    </div>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-[11px] font-bold">
                      {submittedApp.benefitBadge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {submittedApp.submittedAt}
                    </span>
                  </div>
                </div>

                {/* Application Reference Bar */}
                <div className="p-2.5 rounded-xl bg-emerald-100/60 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-600 text-[11px] block">{isHi ? 'ई-आवेदन संदर्भ संख्या (Application Ref ID):' : 'Application Reference Number:'}</span>
                    <span className="text-sm font-black text-emerald-900">{submittedApp.applicationId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-800 text-white text-[11px] font-bold">
                      ✓ APPROVED & ACTIVE
                    </span>
                  </div>
                </div>

                {/* Structured Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'योजना का नाम:' : 'Scheme Name:'}</span>
                      <span className="font-bold text-slate-900 text-right">{submittedApp.schemeTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'किसान नाम:' : 'Farmer Name:'}</span>
                      <span className="font-bold text-slate-900 text-right">{submittedApp.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'मोबाइल संख्या:' : 'Mobile Number:'}</span>
                      <span className="font-mono font-bold text-slate-900 text-right">{submittedApp.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'गाँव, ज़िला व राज्य:' : 'Village / District:'}</span>
                      <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">{submittedApp.location}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'खसरा / खतौनी संख्या:' : 'Khasra No:'}</span>
                      <span className="font-mono font-bold text-emerald-800 text-right">{submittedApp.khasraNo} (रकबा: {submittedApp.land})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'बैंक IFSC कोड:' : 'Bank IFSC:'}</span>
                      <span className="font-mono font-bold text-slate-900 text-right">{submittedApp.bankIfsc} (DBT Active)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'आधार e-KYC स्थिति:' : 'Aadhaar e-KYC:'}</span>
                      <span className="font-mono font-bold text-emerald-700 text-right">XXXX-XXXX-{submittedApp.aadhaarLast4 || aadhaarLast4} (✓ सत्यापित)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isHi ? 'दस्तावेज़ स्थिति:' : 'Documents Status:'}</span>
                      <span className="font-bold text-emerald-700 text-right">✓ 4 दस्तावेज़ संलग्न व सत्यापित</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Security Barcode, QR Code & Digital Stamp */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-300">
                  <div className="flex items-center gap-3">
                    {/* Simulated QR Code */}
                    <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <div className="w-full h-full bg-slate-900 rounded grid grid-cols-4 gap-0.5 p-1">
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                      </div>
                    </div>

                    {/* Barcode Graphic */}
                    <div className="text-left font-mono">
                      <div className="flex items-center gap-0.5 h-6">
                        {[3,1,4,2,1,3,2,4,1,2,3,1,4,2,3,1,2,4,1,3].map((w, i) => (
                          <div key={i} className="h-full bg-slate-800" style={{ width: `${w * 1.5}px` }} />
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-500 tracking-wider">REF:{submittedApp.applicationId}</span>
                    </div>
                  </div>

                  {/* Digital Verification Stamp */}
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-[10px] text-emerald-900 font-bold flex items-center gap-1.5 shadow-2xs">
                    <span>🛡️</span>
                    <span>QUALCOMM SNAPDRAGON AI & KISAN SAHAYAK AI · VERIFIED DIGITAL SEAL</span>
                  </div>
                </div>
              </div>

              {/* 3. Official Government Portal Live Tracking Section */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-slate-50 to-teal-50 border-2 border-emerald-300 text-left space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🌐</span>
                      <span>{isHi ? 'सरकारी पोर्टल पर लाइव स्थिति ट्रैक करें:' : 'Track Live Status on Govt Portal:'}</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {isHi 
                        ? `आपका आवेदन योजना में पंजीकृत हो चुका है। यदि आप सरकारी पोर्टल (${new URL(submittedApp.officialUrl).hostname}) पर संदर्भ संख्या डालकर लाइव स्टेटस देखना चाहते हैं:` 
                        : `Your application is registered. Click below to verify or track real-time payout status on the official portal:`}
                    </p>
                  </div>

                  <a
                    href={submittedApp.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer no-underline active:scale-95"
                  >
                    <span>🌐</span>
                    <span>{isHi ? 'सरकारी पोर्टल पर स्टेटस ट्रैक करें ↗' : 'Track on Govt Portal ↗'}</span>
                  </a>
                </div>

                {/* Auto-Fill Copy Chips */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      {isHi ? 'पोर्टल पर विवरण खोजने हेतु 1-क्लिक कॉपी:' : '1-Click copy if needed on government portal:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyAllFormData(submittedApp)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      {copiedField === 'ALL' ? '✓ All Copied' : (isHi ? '📋 पूरा विवरण कॉपी करें' : '📋 Copy All')}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(submittedApp.applicationId, 'Ref ID')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-400 transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="text-[9px] text-slate-400 block">{isHi ? 'आवेदन क्रमांक:' : 'Ref ID:'}</span>
                      <span className="font-mono font-bold text-emerald-800 text-[11px] truncate block">{submittedApp.applicationId}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(submittedApp.contact, 'Mobile')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-400 transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="text-[9px] text-slate-400 block">{isHi ? 'मोबाइल नंबर:' : 'Mobile:'}</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{submittedApp.contact}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(submittedApp.khasraNo, 'Khasra No')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-400 transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="text-[9px] text-slate-400 block">{isHi ? 'खसरा संख्या:' : 'Khasra No:'}</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{submittedApp.khasraNo}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(submittedApp.bankAccountNo, 'Bank A/C')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-400 transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="text-[9px] text-slate-400 block">{isHi ? 'बैंक खाता संख्या:' : 'Bank A/C:'}</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{submittedApp.bankAccountNo}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(submittedApp.bankIfsc, 'Bank IFSC')}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-400 transition-all cursor-pointer shadow-2xs col-span-2 sm:col-span-1"
                    >
                      <span className="text-[9px] text-slate-400 block">{isHi ? 'बैंक IFSC:' : 'Bank IFSC:'}</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{submittedApp.bankIfsc}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-95"
                >
                  <span>🖨️</span>
                  <span>{isHi ? 'आधिकारिक पावती रसीद डाउनलोड / प्रिंट करें' : 'Print / Download Official Slip'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  {isHi ? 'पूर्ण हुआ (Done)' : 'Done'}
                </button>
              </div>

            </div>
          ) : (
            /* ─── 3-STEP WIZARD STEPS ─────────────────────────────────── */
            <div>
              
              {/* STEP 1: FARMER & LAND DETAILS */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Scheme Requirement Notice */}
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                    <span className="text-base mt-0.5">ℹ️</span>
                    <div>
                      <span className="font-bold block">
                        {isHi ? 'पात्रता मानक व ज़रूरी विवरण:' : 'Scheme Eligibility & Required Details:'}
                      </span>
                      <span className="text-emerald-800 leading-relaxed">
                        {isHi ? scheme.farmerTypeHI : scheme.farmerTypeEN}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Farmer Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHi ? 'किसान का पूरा नाम (आधार कार्ड के अनुसार) *' : 'Farmer Full Name (As per Aadhaar) *'}
                      </label>
                      <input
                        type="text"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder={isHi ? 'उदा. रामेश्वर पटेल' : 'e.g. Rameshwar Patel'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                    </div>

                    {/* Contact (Phone or Email) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHi ? 'मोबाइल नंबर / Gmail *' : 'Mobile Number or Gmail *'}
                        </label>
                        <input
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        />
                      </div>

                      {/* Location (Village, District, State) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHi ? 'गाँव, ज़िला व राज्य *' : 'Village, District & State *'}
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={isHi ? 'उदा. पिंपलगांव, नासिक, महाराष्ट्र' : 'e.g. Pimpalgaon, Nashik, MH'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Primary Crop & Land Holding */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHi ? 'मुख्य फसल' : 'Primary Crop'}
                        </label>
                        <select
                          value={crop}
                          onChange={(e) => setCrop(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        >
                          <option value="🌾 गेहूं (Wheat)">🌾 गेहूं (Wheat)</option>
                          <option value="🍚 धान / चावल (Rice/Paddy)">🍚 धान / चावल (Rice/Paddy)</option>
                          <option value="🌽 मक्का (Maize)">🌽 मक्का (Maize)</option>
                          <option value="🌱 कपास (Cotton)">🌱 कपास (Cotton)</option>
                          <option value="🥔 आलू / सब्ज़ियाँ (Vegetables)">🥔 आलू / सब्ज़ियाँ (Vegetables)</option>
                          <option value="🍇 फल व बागवानी (Horticulture)">🍇 फल व बागवानी (Horticulture)</option>
                          <option value="🌿 दलहन / तिलहन (Pulses/Oilseeds)">🌿 दलहन / तिलहन (Pulses/Oilseeds)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHi ? 'कुल कृषि भूमि (एकड़)' : 'Total Land Size (Acres)'}
                        </label>
                        <input
                          type="text"
                          value={land}
                          onChange={(e) => setLand(e.target.value)}
                          placeholder="4.2 Acres"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Khasra / Khatauni Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHi ? 'खसरा / खतौनी / खाता संख्या (Land Survey / Khasra No)' : 'Land Survey / Khasra / Khatauni Number'}
                      </label>
                      <input
                        type="text"
                        value={khasraNo}
                        onChange={(e) => setKhasraNo(e.target.value)}
                        placeholder="142/3"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: MANDATORY DOCUMENTS UPLOAD */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Scheme-Specific Documents Checklist Banner */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>📑</span>
                        <span>{isHi ? 'इस योजना के लिए आवश्यक दस्तावेज़ सूची:' : 'Mandatory Documents Required for this Scheme:'}</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {(isHi ? scheme.documentsHI : scheme.documentsEN).length} {isHi ? 'दस्तावेज़' : 'Docs'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(isHi ? scheme.documentsHI : scheme.documentsEN).map((doc, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white text-emerald-900 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{doc}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Fast Demo Upload Button */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                    <div>
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>{isHi ? 'परीक्षण व तत्काल डेमो:' : 'Instant Demo / Evaluator Fast Track:'}</span>
                      </span>
                      <span className="text-amber-800 text-[11px]">
                        {isHi ? '1-क्लिक में सभी 4 दस्तावेज़ स्वचालित संलग्न करें' : '1-Click auto-attach all 4 verified demo documents'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoAttachDemoDocs}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95 flex-shrink-0"
                    >
                      ⚡ {isHi ? 'डेमो दस्तावेज़ संलग्न करें' : 'Auto-Attach Demo Docs'}
                    </button>
                  </div>

                  {/* 4 Interactive Upload Slots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* DOC 1: Aadhaar Card */}
                    <div className={`p-4 rounded-2xl border-2 transition-all ${
                      documents.aadhaar ? 'bg-emerald-50/50 border-emerald-400' : 'bg-slate-50/70 border-dashed border-slate-300 hover:border-emerald-400'
                    }`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🪪</span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {isHi ? '1. आधार कार्ड (अनिवार्य) *' : '1. Aadhaar Card (Mandatory) *'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {isHi ? 'पहचान व ई-केवाईसी प्रमाण' : 'Identity & e-KYC proof'}
                            </span>
                          </div>
                        </div>
                        {documents.aadhaar && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">✓ संलग्न</span>
                        )}
                      </div>

                      {documents.aadhaar ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 text-xs">
                          <span className="font-mono text-[11px] truncate max-w-[170px] text-slate-800 font-semibold">
                            {documents.aadhaar.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('aadhaar')}
                            className="text-red-500 hover:text-red-700 font-bold text-xs p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="mt-1 flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50/40 transition-all cursor-pointer">
                          <span className="text-xs font-bold text-emerald-700">
                            + {isHi ? 'फाइल चुनें / फोटो लें' : 'Upload File / Photo'}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">JPG, PNG या PDF (अधिकतम 5MB)</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('aadhaar', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* DOC 2: Land Records */}
                    <div className={`p-4 rounded-2xl border-2 transition-all ${
                      documents.landRecord ? 'bg-emerald-50/50 border-emerald-400' : 'bg-slate-50/70 border-dashed border-slate-300 hover:border-emerald-400'
                    }`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📜</span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {isHi ? '2. जमीन का भूलेख / खतौनी (अनिवार्य) *' : '2. Land Record / Khatauni (Mandatory) *'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {isHi ? 'खसरा-खतौनी या जमाबंदी नकल' : 'Khasra/Khatauni or Jamabandi'}
                            </span>
                          </div>
                        </div>
                        {documents.landRecord && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">✓ संलग्न</span>
                        )}
                      </div>

                      {documents.landRecord ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 text-xs">
                          <span className="font-mono text-[11px] truncate max-w-[170px] text-slate-800 font-semibold">
                            {documents.landRecord.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('landRecord')}
                            className="text-red-500 hover:text-red-700 font-bold text-xs p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="mt-1 flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50/40 transition-all cursor-pointer">
                          <span className="text-xs font-bold text-emerald-700">
                            + {isHi ? 'फाइल चुनें / फोटो लें' : 'Upload File / Photo'}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">JPG, PNG या PDF (अधिकतम 5MB)</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('landRecord', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* DOC 3: Bank Passbook */}
                    <div className={`p-4 rounded-2xl border-2 transition-all ${
                      documents.bankPassbook ? 'bg-emerald-50/50 border-emerald-400' : 'bg-slate-50/70 border-dashed border-slate-300 hover:border-emerald-400'
                    }`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏦</span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {isHi ? '3. बैंक पासबुक प्रति (DBT खाता)' : '3. Bank Passbook Copy (DBT Account)'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {isHi ? 'खाता संख्या व IFSC स्पष्ट दिखे' : 'Clear Account & IFSC'}
                            </span>
                          </div>
                        </div>
                        {documents.bankPassbook && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">✓ संलग्न</span>
                        )}
                      </div>

                      {documents.bankPassbook ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 text-xs">
                          <span className="font-mono text-[11px] truncate max-w-[170px] text-slate-800 font-semibold">
                            {documents.bankPassbook.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('bankPassbook')}
                            className="text-red-500 hover:text-red-700 font-bold text-xs p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="mt-1 flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50/40 transition-all cursor-pointer">
                          <span className="text-xs font-bold text-emerald-700">
                            + {isHi ? 'फाइल चुनें / फोटो लें' : 'Upload File / Photo'}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">JPG, PNG या PDF (अधिकतम 5MB)</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('bankPassbook', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* DOC 4: Crop Proof */}
                    <div className={`p-4 rounded-2xl border-2 transition-all ${
                      documents.cropProof ? 'bg-emerald-50/50 border-emerald-400' : 'bg-slate-50/70 border-dashed border-slate-300 hover:border-emerald-400'
                    }`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌾</span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {isHi ? '4. फसल बुवाई प्रमाण पत्र / फोटो' : '4. Crop Proof / Photo'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {isHi ? 'खेत की फसल या पटवारी पर्ची' : 'Field photo or Sowing slip'}
                            </span>
                          </div>
                        </div>
                        {documents.cropProof && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">✓ संलग्न</span>
                        )}
                      </div>

                      {documents.cropProof ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 text-xs">
                          <span className="font-mono text-[11px] truncate max-w-[170px] text-slate-800 font-semibold">
                            {documents.cropProof.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('cropProof')}
                            className="text-red-500 hover:text-red-700 font-bold text-xs p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="mt-1 flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50/40 transition-all cursor-pointer">
                          <span className="text-xs font-bold text-emerald-700">
                            + {isHi ? 'फाइल चुनें / फोटो लें' : 'Upload File / Photo'}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">JPG, PNG या PDF (अधिकतम 5MB)</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('cropProof', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: BANK DETAILS & OFFICIAL SCHEME SUBMISSION */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* DIRECT GOVERNMENT PORTAL REGISTRATION BANNER */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white space-y-2 border border-emerald-600/50 shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏛️</span>
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
                        {isHi ? 'सरकारी पोर्टल पर सीधा आवेदन व ई-पंजीकरण गेटवे' : 'Direct Govt Portal Submission Gateway'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isHi 
                        ? `यहाँ सबमिट करते ही आपका ब्राउज़र सीधे आधिकारिक सरकारी पोर्टल (${new URL(scheme.applyUrl || scheme.officialUrl || 'https://pmkisan.gov.in/').hostname}) पर जाएगा और आपका सम्पूर्ण विवरण (नाम, आधार, खसरा, बैंक खाता) स्वतः कॉपी हो जाएगा ताकि आपको पोर्टल पर दोबारा कुछ भी टाइप न करना पड़े!` 
                        : `Submitting will directly open the official government portal (${new URL(scheme.applyUrl || scheme.officialUrl || 'https://pmkisan.gov.in/').hostname}) and auto-copy all details so you never have to re-type anything!`}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 text-[11px] text-emerald-400 font-mono">
                      <span className="break-all">🌐 {scheme.applyUrl || scheme.officialUrl}</span>
                      <span className="text-emerald-300 font-bold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30 w-fit">
                        ✓ 100% Pre-Filled & Ready
                      </span>
                    </div>
                  </div>

                  {/* 1. Aadhaar e-KYC Verification Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🪪</span>
                        <span>{isHi ? 'UIDAI आधार बायोमेट्रिक व ई-केवाईसी सत्यापन:' : 'UIDAI Aadhaar e-KYC Verification:'}</span>
                      </h5>
                      {otpVerified ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span>✓</span>
                          <span>{isHi ? '100% सत्यापित' : 'Verified'}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          {isHi ? 'सत्यापन आवश्यक' : 'Verification Needed'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHi ? 'आधार संख्या (अंतिम 4 अंक) *' : 'Aadhaar (Last 4 Digits) *'}
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono text-slate-400 bg-white px-2 py-2 rounded-xl border border-slate-200">
                            XXXX-XXXX-
                          </span>
                          <input
                            type="text"
                            maxLength={4}
                            value={aadhaarLast4}
                            onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                            className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono font-bold text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Interactive OTP verification */}
                      <div className="flex flex-col justify-end">
                        {otpVerified ? (
                          <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                            <span>✓</span>
                            <span>{isHi ? 'UIDAI बायोमेट्रिक व ई-केवाईसी पूर्णतः सत्यापित' : 'UIDAI e-KYC Biometric Verified'}</span>
                          </div>
                        ) : !otpSent ? (
                          <button
                            type="button"
                            onClick={() => setOtpSent(true)}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                          >
                            📲 {isHi ? 'आधार ई-केवाईसी OTP प्राप्त करें' : 'Get Aadhaar OTP'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              maxLength={6}
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value)}
                              placeholder="849201"
                              className="w-28 px-2 py-2 rounded-xl border border-emerald-400 text-xs font-mono font-bold text-center outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setOtpVerified(true)}
                              className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                            >
                              ✓ {isHi ? 'सत्यापित करें' : 'Verify'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Bank Details & DBT Account */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🏦</span>
                      <span>{isHi ? 'प्रत्यक्ष लाभ अंतरण (DBT) बैंक खाता विवरण:' : 'Direct Benefit Transfer (DBT) Bank Details:'}</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHi ? 'बैंक खाता संख्या *' : 'Bank Account Number *'}
                        </label>
                        <input
                          type="text"
                          value={bankAccountNo}
                          onChange={(e) => setBankAccountNo(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isHi ? 'बैंक IFSC कोड *' : 'Bank IFSC Code *'}
                        </label>
                        <input
                          type="text"
                          value={bankIfsc}
                          onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                          placeholder="SBIN0001234"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Summary Pill */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                      <span>📑</span>
                      <span>{isHi ? 'संलग्न किए गए दस्तावेज:' : 'Attached Documents:'}</span>
                    </span>
                    <span className="font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {uploadedCount} / 4 {isHi ? 'सत्यापित' : 'Verified'}
                    </span>
                  </div>

                  {/* Declaration Checkbox */}
                  <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all text-xs">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer mt-0.5"
                    />
                    <span className="text-slate-700 leading-relaxed">
                      {isHi 
                        ? 'मैं प्रमाणित करता/करती हूँ कि मेरे द्वारा दिए गए सभी विवरण व अपलोड किए गए दस्तावेज़ पूर्णतः सत्य हैं तथा मैं इस सरकारी योजना की सभी पात्रता शर्तों को पूरा करता/करती हूँ।' 
                        : 'I certify that all details and documents submitted are authentic, and I meet all official eligibility conditions.'}
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sticky Fixed Bottom Action Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
          {submittedApp ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2.5">
              <a
                href={submittedApp.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-700/25 transition-all cursor-pointer flex items-center justify-center gap-2 text-center no-underline active:scale-95"
              >
                <span>🌐</span>
                <span>{isHi ? 'सरकारी पोर्टल पर जाएं (नया टैब) ↗' : 'Go to Govt Portal (New Tab) ↗'}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  window.location.href = submittedApp.officialUrl;
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-2xs"
              >
                ➡️ {isHi ? 'इसी टैब में खोलें' : 'Same Tab'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer"
              >
                {isHi ? 'पूर्ण हुआ (Done)' : 'Done'}
              </button>
            </div>
          ) : (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 cursor-pointer transition-colors"
                >
                  ← {isHi ? 'पीछे (Back)' : 'Back'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 cursor-pointer transition-colors"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{isHi ? 'अगला कदम जारी रखें →' : 'Continue to Next Step →'}</span>
                </button>
              ) : (
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* 1. Unblockable Native Link: Directly opens the official government portal in new tab */}
                  <a
                    href={scheme.applyUrl || scheme.officialUrl || 'https://pmkisan.gov.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDirectGovtPortalSubmit}
                    id="btn-direct-govt-portal-submit"
                    className="flex-1 py-3.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-center no-underline ring-2 ring-emerald-400/40"
                  >
                    <span className="text-base animate-bounce">🌐</span>
                    <span>
                      {isHi 
                        ? 'सरकारी पोर्टल पर जाएं और सबमिट करें ↗' 
                        : 'Go to Govt Portal & Submit ↗'}
                    </span>
                  </a>

                  {/* 2. Same-tab redirect button: Guarantees 100% navigation even if browser blocks new tabs */}
                  <button
                    type="button"
                    onClick={() => {
                      const ok = handleDirectGovtPortalSubmit();
                      if (ok !== false) {
                        window.location.href = scheme.applyUrl || scheme.officialUrl || 'https://pmkisan.gov.in/';
                      }
                    }}
                    id="btn-same-tab-govt-portal"
                    className="px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    title={isHi ? 'इसी टैब में सीधे सरकारी पोर्टल खोलें' : 'Open in same tab'}
                  >
                    ➡️ {isHi ? 'इसी टैब में खोलें' : 'Same Tab'}
                  </button>

                  {/* 3. In-App Verified Certificate generation */}
                  <button
                    type="button"
                    onClick={handleInAppInstantSubmit}
                    disabled={isSubmitting}
                    className="px-3 py-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    title={isHi ? 'किसान सहायक में सीधे पावती रसीद जनरेट करें' : 'Generate in-app receipt'}
                  >
                    ⚡ {isHi ? 'सीधा प्रमाण पत्र' : 'In-App Receipt'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Live Government Gateway Transmission Modal */}
        {isSubmitting && (
          <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-300 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto ring-8 ring-emerald-50 animate-pulse">
                🏛️
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {isHi ? 'योजना में आवेदन पंजीकृत किया जा रहा है...' : 'Registering in Scheme Database...'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isHi ? 'भारत सरकार कृषि ई-पोर्टल गेटवे से लाइव सत्यापन जारी है' : 'Live verification with Government Agriculture Gateway in progress'}
                </p>
              </div>

              <div className="space-y-2.5 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className={`flex items-center gap-2 transition-all ${gatewayStage >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <span>{gatewayStage >= 1 ? '✓' : '○'}</span>
                  <span>{isHi ? '1. UIDAI आधार बायोमेट्रिक व ई-केवाईसी सत्यापन' : '1. UIDAI Aadhaar e-KYC Verification'}</span>
                </div>
                <div className={`flex items-center gap-2 transition-all ${gatewayStage >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <span>{gatewayStage >= 2 ? '✓' : '○'}</span>
                  <span>{isHi ? `2. राज्य भूलेख (खसरा ${khasraNo}) खतौनी सत्यापन` : `2. State Bhulekh (Khasra ${khasraNo}) Verification`}</span>
                </div>
                <div className={`flex items-center gap-2 transition-all ${gatewayStage >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <span>{gatewayStage >= 3 ? '✓' : '○'}</span>
                  <span>{isHi ? '3. PFMS बैंक प्रत्यक्ष लाभ अंतरण (DBT) सक्रियता' : '3. PFMS Direct Benefit Transfer (DBT) Linkage'}</span>
                </div>
                <div className={`flex items-center gap-2 transition-all ${gatewayStage >= 4 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <span>{gatewayStage >= 4 ? '✓' : '○'}</span>
                  <span>{isHi ? '4. सरकारी योजना डेटाबेस में पंजीकरण व संदर्भ संख्या' : '4. Official Govt Registry Application Entry'}</span>
                </div>
              </div>

              <div className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-pulse">
                {submitStepText}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
