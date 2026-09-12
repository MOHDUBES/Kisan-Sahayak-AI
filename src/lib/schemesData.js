// Government Agricultural Schemes Database (सरकारी कृषि योजनाएं डेटाबेस)

export const SCHEME_CATEGORIES = [
  { id: 'all', labelHI: 'सभी योजनाएं', labelEN: 'All Schemes', icon: '🏛️' },
  { id: 'income', labelHI: 'आय सहायता', labelEN: 'Income Support', icon: '💰' },
  { id: 'insurance', labelHI: 'फसल बीमा', labelEN: 'Crop Insurance', icon: '🛡️' },
  { id: 'solar_irrigation', labelHI: 'सोलर व सिंचाई', labelEN: 'Solar & Irrigation', icon: '☀️' },
  { id: 'credit_loan', labelHI: 'रियायती ऋण (KCC)', labelEN: 'Subsidized Credit', icon: '💳' },
  { id: 'machinery', labelHI: 'उपकरण व सब्सिडी', labelEN: 'Machinery Subsidy', icon: '🚜' },
  { id: 'pension', labelHI: 'किसान पेंशन', labelEN: 'Farmer Pension', icon: '👴' },
];

export const GOVT_SCHEMES = [
  {
    id: 'pm-kisan',
    category: 'income',
    titleHI: 'पीएम किसान सम्मान निधि योजना (PM-KISAN)',
    titleEN: 'PM Kisan Samman Nidhi Yojana (PM-KISAN)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की सीधी वित्तीय सहायता।',
    taglineEN: 'Direct income support of ₹6,000 per year in 3 equal installments to farmer families.',
    benefitBadgeHI: '₹6,000 / वर्ष (DBT)',
    benefitBadgeEN: '₹6,000 / Year (DBT)',
    benefitTypeHI: 'प्रत्यक्ष बैंक ट्रांसफर (3 समान किस्तों में ₹2,000 हर 4 महीने पर)',
    benefitTypeEN: 'Direct Bank Transfer (₹2,000 every 4 months directly to bank account)',
    officialUrl: 'https://pmkisan.gov.in/',
    applyUrl: 'https://pmkisan.gov.in/RegistrationFormNew.aspx',
    targetCrops: ['All'],
    maxLandAcres: null, // Open to all landholder farmers
    farmerTypeHI: 'सभी भूमिधारक किसान परिवार (छोटे, सीमांत व बड़े)',
    farmerTypeEN: 'All landholding farmer families (Small, Marginal & Large)',
    eligibilityHI: [
      'किसान के नाम पर वैध कृषि भूमि का मालिकाना हक होना चाहिए।',
      'बैंक खाता आधार कार्ड से लिंक और डीबीटी (DBT) सक्षम होना चाहिए।',
      'संस्थागत भूमिधारक, संवैधानिक पदधारक या आयकर दाता परिवार इसके पात्र नहीं हैं।',
    ],
    eligibilityEN: [
      'Must have cultivable landholding registered in farmer name.',
      'Bank account must be Aadhaar-seeded and DBT enabled.',
      'Institutional landholders and income tax payers are excluded.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का भूलेख / खसरा-खतौनी नकल (Land Ownership Record)',
      'बैंक पासबुक की कॉपी (Bank Account Details & IFSC)',
      'आधार से लिंक सक्रिय मोबाइल नंबर (Mobile Number)',
    ],
    documentsEN: [
      'Aadhaar Card of Applicant',
      'Land Records (Khasra/Khatauni / Jamabandi)',
      'Bank Account Passbook Copy (IFSC code)',
      'Aadhaar-Linked Active Mobile Number',
    ],
    stepsHI: [
      'पोर्टल पर "नया किसान पंजीकरण" चुनें या नीचे हमारे ऐप से सीधा आवेदन करें।',
      'आधार नंबर व राज्य चुनकर जमीन का खसरा नंबर भरें।',
      'बैंक विवरण दर्ज कर ई-केवाईसी (e-KYC) पूर्ण करें।',
    ],
    stepsEN: [
      'Select "New Farmer Registration" or apply directly via Kisan Sahayak.',
      'Enter Aadhaar number, state, district, and land survey number.',
      'Submit bank details and complete biometric / OTP e-KYC.',
    ]
  },
  {
    id: 'pmfby',
    category: 'insurance',
    titleHI: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    titleEN: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'सूखा, बाढ़, कीट हमले व बेमौसम बारिश से फसल नुकसान पर व्यापक बीमा सुरक्षा।',
    taglineEN: 'Comprehensive crop loss cover against natural calamities, drought, pest attacks and unseasonal rains.',
    benefitBadgeHI: '90% तक फसल मुआवजा',
    benefitBadgeEN: 'Up to 90% Loss Claim',
    benefitTypeHI: 'किसानों को मात्र 1.5% से 2% का न्यूनतम प्रीमियम, बाकी प्रीमियम सरकार देती है',
    benefitTypeEN: 'Farmers pay only 1.5% - 2% premium (Kharif/Rabi), remaining paid by Govt',
    officialUrl: 'https://pmfby.gov.in/',
    applyUrl: 'https://pmfby.gov.in/farmerRegistrationForm',
    targetCrops: ['Wheat', 'Paddy', 'Cotton', 'Mustard', 'Maize', 'Soybean', 'Chana', 'Sugarcane', 'Potato', 'Onion'],
    maxLandAcres: null,
    farmerTypeHI: 'अधिसूचित फसलों की बुवाई करने वाले सभी किसान (ऋणी व गैर-ऋणी दोनों)',
    farmerTypeEN: 'All farmers cultivating notified crops (Loanee & Non-Loanee)',
    eligibilityHI: [
      'किसान ने अधिसूचित क्षेत्र में अधिसूचित फसल की बुवाई की हो।',
      'बटाईदार (Sharecroppers) व पट्टेदार किसान भी संबंधित अनुबंध पत्र के साथ पात्र हैं।',
      'बुवाई के 15 दिनों के भीतर या बैंक कट-ऑफ तिथि से पहले बीमा अनिवार्य है।',
    ],
    eligibilityEN: [
      'Farmer must have sown notified crops in notified insurance areas.',
      'Tenant farmers and sharecroppers are also eligible with tenant certificate.',
      'Must enroll within 15 days of sowing or before bank cut-off date.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का नक्शा / खसरा-खतौनी (Land Records)',
      'पटवारी / लेखपाल द्वारा जारी बुवाई प्रमाण पत्र (Sowing Certificate)',
      'बैंक पासबुक (Bank Account with IFSC)',
      'बटाईदार अनुबंध पत्र (यदि किराये की जमीन हो)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Possession Certificate (LPC) / Khatauni',
      'Crop Sowing Certificate issued by Patwari / Panchayat',
      'Bank Account Passbook Copy',
      'Rent / Tenancy agreement (for tenant farmers)',
    ],
    stepsHI: [
      'फसल बुवाई विवरण और खसरा संख्या दर्ज करें।',
      'अपनी फसल का चयन करें और नाममात्र 1.5%-2% प्रीमियम जमा करें।',
      'दावा होने पर 72 घंटे के अंदर ऐप या टोल-फ्री नंबर पर नुकसान दर्ज करें।',
    ],
    stepsEN: [
      'Enter sowing details and land survey number.',
      'Select crop and pay nominal premium (1.5% Rabi / 2% Kharif).',
      'In case of loss, report within 72 hours via app or toll-free hotline.',
    ]
  },
  {
    id: 'pm-kusum',
    category: 'solar_irrigation',
    titleHI: 'पीएम कुसुम सोलर पंप योजना (PM-KUSUM)',
    titleEN: 'PM-KUSUM Solar Irrigation Pump Scheme',
    ministryHI: 'नवीन और नवीकरणीय ऊर्जा मंत्रालय (MNRE)',
    ministryEN: 'Ministry of New & Renewable Energy, Govt of India',
    taglineHI: 'खेतों में मुफ्त दिन की सिंचाई के लिए सोलर पंप लगाने पर 60% से 90% सरकारी सब्सिडी।',
    taglineEN: '60% to 90% Government subsidy to install standalone off-grid solar irrigation pumps.',
    benefitBadgeHI: '60% - 90% सोलर सब्सिडी',
    benefitBadgeEN: '60% - 90% Subsidy',
    benefitTypeHI: '3 HP, 5 HP और 7.5 HP सोलर पंप पर किसान को मात्र 10%-20% लागत देनी होती है',
    benefitTypeEN: 'For 3 HP, 5 HP & 7.5 HP solar pumps, farmer pays only 10%-20% of cost',
    officialUrl: 'https://pmkusum.mnre.gov.in/',
    applyUrl: 'https://pmkusum.mnre.gov.in/',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'वे सभी किसान जिनके पास सिंचाई के लिए जल स्रोत (बोरवेल/कुआं) उपलब्ध है',
    farmerTypeEN: 'Farmers with verified water source (borewell, open well, pond) needing power',
    eligibilityHI: [
      'किसान के खेत में बोरवेल, कुआं या तालाब जैसा जल स्रोत होना आवश्यक है।',
      'पहले से ग्रिड बिजली कनेक्शन वाले पंपों के स्थान पर भी सोलर लगाया जा सकता है।',
      'किसान, किसान समूह (FPO) व सहकारी समितियां आवेदन के पात्र हैं।',
    ],
    eligibilityEN: [
      'Farmer must have verified water source (borewell, open well, pond).',
      'Available for off-grid standalone pumps or solarizing existing electric pumps.',
      'Individual farmers, FPOs, and water-user cooperatives are eligible.',
    ],
    documentsHI: [
      'आधार कार्ड व राशन कार्ड (Aadhaar & Ration Card)',
      'जमीन के स्वामित्व का प्रमाण (भूलेख / 7/12 या खतौनी)',
      'जल स्रोत का प्रमाण (बोरवेल / कुआं प्रमाण पत्र)',
      'बैंक पासबुक कॉपी (Bank Account Details)',
      'पासपोर्ट साइज फोटो',
    ],
    documentsEN: [
      'Aadhaar Card and Ration Card',
      'Land Records (7/12 extract / Khatauni)',
      'Proof of Water Source (Borewell/Tubewell certificate)',
      'Bank Account Passbook',
      'Passport-sized photographs',
    ],
    stepsHI: [
      'राज्य ऊर्जा विकास एजेंसी (DISCOM) पोर्टल या हमारे ऐप से आवेदन करें।',
      'पंप की क्षमता (3HP/5HP/7.5HP) व जल गहराई का चयन करें।',
      'सत्यापन के बाद शेष 10-20% अंशदान जमा करें, सोलर पंप खेत पर स्थापित होगा।',
    ],
    stepsEN: [
      'Apply through State Renewable Energy portal or Kisan Sahayak.',
      'Select pump capacity (3HP/5HP/7.5HP) matching water table depth.',
      'After survey approval, pay 10-20% margin money for field installation.',
    ]
  },
  {
    id: 'kcc',
    category: 'credit_loan',
    titleHI: 'किसान क्रेडिट कार्ड योजना (Kisan Credit Card - KCC)',
    titleEN: 'Kisan Credit Card (KCC Loan Scheme)',
    ministryHI: 'वित्त मंत्रालय व नाबार्ड (NABARD)',
    ministryEN: 'Ministry of Finance & NABARD, Govt of India',
    taglineHI: 'खाद, बीज और खेती के खर्चों के लिए मात्र 4% की रियायती ब्याज दर पर ₹3 लाख तक का आसान ऋण।',
    taglineEN: 'Affordable crop loan up to ₹3 Lakh at a subsidized 4% interest rate with prompt repayment.',
    benefitBadgeHI: '₹3 लाख तक @ 4% ब्याज',
    benefitBadgeEN: 'Up to ₹3L @ 4% Interest',
    benefitTypeHI: '7% सामान्य ब्याज में 3% समय पर भुगतान करने पर सरकारी छूट (Effective 4%)',
    benefitTypeEN: '7% base rate with 3% prompt repayment incentive, effective 4% interest',
    officialUrl: 'https://myscheme.gov.in/schemes/kcc',
    applyUrl: 'https://www.jansamarth.in/kisan-credit-card',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'व्यक्तिगत किसान, संयुक्त कृषक, बटाईदार व पशुपालक/मत्स्यपालक',
    farmerTypeEN: 'Individual farmers, joint cultivators, sharecroppers & dairy/fishery farmers',
    eligibilityHI: [
      'आयु 18 से 75 वर्ष के बीच होनी चाहिए (60 से ऊपर सह-आवेदक आवश्यक)।',
      'खेती, पशुपालन या मछली पालन में सक्रिय रूप से संलग्न होना चाहिए।',
      '₹1.60 लाख तक के ऋण पर किसी प्रकार की जमानत (Collateral/Guarantee) की आवश्यकता नहीं।',
    ],
    eligibilityEN: [
      'Age between 18 to 75 years (co-borrower required if over 60).',
      'Actively involved in farming, animal husbandry, or aquaculture.',
      'No collateral/security required for loans up to ₹1.60 Lakh.',
    ],
    documentsHI: [
      'आधार कार्ड व पैन कार्ड (Aadhaar & PAN)',
      'जमीन का मालिकाना रिकॉर्ड (खसरा-खतौनी की ताज़ा नकल)',
      'फसल बुवाई का ब्यौरा (Crop details)',
      '2 पासपोर्ट साइज फोटो व बैंक बचत खाता',
    ],
    documentsEN: [
      'Aadhaar Card and PAN Card',
      'Land Title Deeds / Khatauni / Jamabandi',
      'Cropping pattern details for the agricultural season',
      'Passport size photos and bank declaration form',
    ],
    stepsHI: [
      'अपनी नज़दीकी बैंक शाखा या कॉमन सर्विस सेंटर (CSC) पर 1-पेज का KCC फॉर्म भरें।',
      'जमीन का रकबा और फसल दर्ज करें।',
      '14 दिनों के अंदर बैंक KCC कार्ड व क्रेडिट लिमिट जारी करता है।',
    ],
    stepsEN: [
      'Fill the simplified 1-page KCC application at any commercial/coop bank or CSC.',
      'Provide land acreage and sown crops.',
      'Bank issues KCC ATM card and credit limit within 14 working days.',
    ]
  },
  {
    id: 'smam-machinery',
    category: 'machinery',
    titleHI: 'कृषि यंत्रीकरण उप-मिशन (SMAM Machinery Subsidy)',
    titleEN: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'ट्रैक्टर, रोटावेटर, पावर टिलर, सीड ड्रिल व ड्रोन पर 40% से 50% तक सरकारी सब्सिडी।',
    taglineEN: '40% to 50% subsidy on modern agricultural implements, tractors, power tillers and drones.',
    benefitBadgeHI: '40% - 50% उपकरण सब्सिडी',
    benefitBadgeEN: '40% - 50% Machinery Subsidy',
    benefitTypeHI: 'छोटे किसानों व महिला कृषकों को 50% और सामान्य किसानों को 40% की वित्तीय सहायता',
    benefitTypeEN: '50% subsidy for small/marginal & women farmers, 40% for general farmers',
    officialUrl: 'https://agrimachinery.nic.in/',
    applyUrl: 'https://agrimachinery.nic.in/Index/FarmerRegistration',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'सभी किसान (छोटे/सीमांत किसान व महिला किसानों को विशेष वरीयता)',
    farmerTypeEN: 'All registered farmers (preference for small, marginal & women farmers)',
    eligibilityHI: [
      'किसान के नाम पर कृषि भूमि पंजीकृत होनी चाहिए।',
      'पिछले 3 वर्षों में इसी उपकरण पर कोई अन्य सरकारी सब्सिडी न ली गई हो।',
      'उपकरण अधिकृत और सरकार द्वारा प्रमाणित डीलर से ही खरीदा जाना चाहिए।',
    ],
    eligibilityEN: [
      'Agricultural land registered under farmer name.',
      'Must not have availed subsidy on same machinery in preceding 3 years.',
      'Must purchase equipment from govt-empaneled authorized dealers.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का भूलेख (Khatauni / Land Papers)',
      'बैंक पासबुक की कॉपी (PFMS/DBT Enabled)',
      'जाति प्रमाण पत्र (SC/ST/महिला कृषकों के लिए)',
      'उपकरण का अधिकृत कोटेशन / बिल (Dealer Quotation)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Records (Khatauni / Revenue Records)',
      'Bank Account Passbook (PFMS verified)',
      'Caste Certificate (for SC/ST/OBC or Women entitlement)',
      'Dealer Quotation of the selected implement',
    ],
    stepsHI: [
      'agrimachinery.nic.in पोर्टल पर उपकरण चुनें व ऑनलाइन टोकन जनरेट करें।',
      'स्वीकृति मिलने पर अधिकृत डीलर से मशीन खरीदें।',
      'भौतिक सत्यापन (Geo-tagging) के बाद सब्सिडी राशि सीधे बैंक खाते में आएगी।',
    ],
    stepsEN: [
      'Select machine and generate online subsidy token on the portal.',
      'Upon token approval, purchase the implement from approved dealer.',
      'Subsidy credited directly to bank account after departmental geo-tagging.',
    ]
  },
  {
    id: 'pmksy-irrigation',
    category: 'solar_irrigation',
    titleHI: 'प्रधानमंत्री कृषि सिंचाई योजना - प्रति बूंद अधिक फसल (PMKSY)',
    titleEN: 'PM Krishi Sinchayee Yojana - Per Drop More Crop (PDMC)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'ड्रिप सिंचाई (Drip) और स्प्रिंकलर (Sprinkler) लगाने पर 55% से 80% तक की भारी छूट।',
    taglineEN: '55% to 80% capital subsidy for installing drip & sprinkler micro-irrigation systems.',
    benefitBadgeHI: '55% - 80% ड्रिप सब्सिडी',
    benefitBadgeEN: '55% - 80% Drip Subsidy',
    benefitTypeHI: 'पानी की 50% बचत और 40% तक पैदावार में बढ़ोतरी, उपकरण पर भारी सरकारी छूट',
    benefitTypeEN: 'Saves up to 50% water and increases yields by 40% with massive equipment subsidy',
    officialUrl: 'https://pmksy.gov.in/',
    targetCrops: ['Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Mustard', 'Maize', 'Chilli'],
    maxLandAcres: null,
    farmerTypeHI: 'सब्जी, फल, गन्ना, कपास व अनाज उगाने वाले सभी किसान',
    farmerTypeEN: 'Farmers cultivating vegetables, fruit orchards, cotton, sugarcane and cereals',
    eligibilityHI: [
      'खेत में सुनिश्चित सिंचाई स्रोत (कुआं, नलकूप, नहर या तालाब) होना चाहिए।',
      'छोटे और सीमांत किसानों को 55% से 80% तक सब्सिडी प्राप्त होती है।',
      'कम से कम 0.5 एकड़ भूमि पर ड्रिप या स्प्रिंकलर स्थापित होना चाहिए।',
    ],
    eligibilityEN: [
      'Guaranteed irrigation water source in the land plot.',
      'Small and marginal farmers get up to 55%-80% subsidy based on state norm.',
      'Minimum 0.5 Acre micro-irrigation plot required.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का भूलेख व नक्शा (Khasra Khatauni & Map)',
      'सिंचाई स्रोत प्रमाण पत्र (Water source proof)',
      'बैंक पासबुक व पासपोर्ट फोटो (Bank Passbook)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Records and Plot Map',
      'Electricity Bill / Water Source Declaration',
      'Bank Passbook Copy and passport photo',
    ],
    stepsHI: [
      'राज्य उद्यानिकी / कृषि विभाग पोर्टल या हमारे ऐप से आवेदन करें।',
      'खेत का सर्वे कर कंपनी ड्रिप पाइपलाइन का एस्टीमेट तैयार करेगी।',
      'किसान अंशदान जमा करने पर 15 दिन में ड्रिप सिस्टम फिट हो जाता है।',
    ],
    stepsEN: [
      'Apply via state horticulture portal or Kisan Sahayak.',
      'Field survey team designs micro-irrigation layout.',
      'Pay beneficiary share; system is installed within 15 days.',
    ]
  },
  {
    id: 'soil-health-card',
    category: 'income',
    titleHI: 'मृदा स्वास्थ्य कार्ड योजना (Soil Health Card Scheme)',
    titleEN: 'National Soil Health Card Scheme',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'खेत की मिट्टी की मुफ्त प्रयोगशाला जांच व सही खाद (यूरिया/डीएपी) की सटीक वैज्ञानिक सिफारिश।',
    taglineEN: 'Free laboratory testing of field soil nutrients with crop-wise fertilizer dosage advisory.',
    benefitBadgeHI: '100% मुफ्त मिट्टी जांच',
    benefitBadgeEN: '100% Free Soil Testing',
    benefitTypeHI: 'मिट्टी में 12 पोषक तत्वों की जांच, खाद खर्च में 20-30% की सीधी बचत',
    benefitTypeEN: 'Analysis of 12 soil parameters; cuts fertilizer costs by 20-30% while raising yield',
    officialUrl: 'https://soilhealth.dac.gov.in/',
    applyUrl: 'https://soilhealth.dac.gov.in/',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'देश का कोई भी किसान अपने खेत की मिट्टी की मुफ्त जांच करवा सकता है',
    farmerTypeEN: 'Every farmer in India is entitled to free periodic soil testing',
    eligibilityHI: [
      'कृषि भूमि के स्वामी या सक्रिय खेती करने वाले किसान।',
      'हर 3 साल में एक बार नया सॉइल हेल्थ कार्ड प्राप्त किया जा सकता है।',
      'जांच पूरी तरह निःशुल्क है (कोई सरकारी शुल्क नहीं)।',
    ],
    eligibilityEN: [
      'Any agricultural landowner or active cultivator.',
      'Renewable every 3 years for continuous soil fertility tracking.',
      'Completely free of cost under National Soil Health Mission.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'खेत का खसरा नंबर व क्षेत्रफल (Land Survey Number)',
      'मोबाइल नंबर (SMS रिपोर्ट के लिए)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Survey / Khasra Number',
      'Mobile Number (for SMS report delivery)',
    ],
    stepsHI: [
      'मिट्टी का नमूना कृषि विज्ञान केंद्र (KVK) या ग्राम सेवक को दें।',
      'प्रयोगशाला में NPK, जिंक, बोरॉन आदि 12 तत्वों की जांच होगी।',
      'कार्ड पर फसल अनुसार यूरिया व डीएपी की सही मात्रा की सिफारिश मिलेगी।',
    ],
    stepsEN: [
      'Deposit soil sample at nearest KVK or Block Agriculture Office.',
      'Lab tests 12 parameters (Macro + Micronutrients + pH).',
      'Receive official Soil Health Card with precise fertilizer prescription.',
    ]
  },
  {
    id: 'pm-kmy-pension',
    category: 'pension',
    titleHI: 'पीएम किसान मानधन योजना (PM Kisan Maandhan Pension)',
    titleEN: 'Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय व LIC ऑफ इंडिया',
    ministryEN: 'Ministry of Agriculture & LIC of India',
    taglineHI: 'छोटे व सीमांत किसानों को 60 वर्ष की आयु के बाद ₹3,000 प्रति माह सुनिश्चित वृद्धावस्था पेंशन।',
    taglineEN: 'Old age protection and social security with ₹3,000/month assured pension after 60 years.',
    benefitBadgeHI: '₹3,000 / माह पेंशन',
    benefitBadgeEN: '₹3,000 / Month Pension',
    benefitTypeHI: '60 वर्ष की आयु पूरी होने पर जीवनपर्यंत ₹3,000 प्रति माह बैंक खाते में पेंशन',
    benefitTypeEN: 'Lifelong assured pension of ₹3,000 every month upon reaching 60 years of age',
    officialUrl: 'https://maandhan.in/',
    applyUrl: 'https://maandhan.in/',
    targetCrops: ['All'],
    maxLandAcres: 5, // Strictly for small and marginal farmers (< 2 hectares = ~5 acres)
    farmerTypeHI: '18 से 40 वर्ष के छोटे और सीमांत किसान (अधिकतम 5 एकड़ कृषि भूमि)',
    farmerTypeEN: 'Small & Marginal Farmers aged 18 to 40 years with up to 5 Acres land',
    eligibilityHI: [
      'प्रवेश आयु 18 से 40 वर्ष के बीच होनी चाहिए।',
      'किसान के पास अधिकतम 2 हेक्टेयर (लगभग 5 एकड़) कृषि भूमि होनी चाहिए।',
      'मासिक अंशदान ₹55 से ₹200 (उम्र के अनुसार), उतनी ही राशि सरकार मिलाती है।',
      'PM-KISAN लाभार्थी अपनी ₹6,000 किस्त से सीधे अंशदान कटवा सकते हैं।',
    ],
    eligibilityEN: [
      'Entry age between 18 and 40 years.',
      'Must be a small/marginal farmer with cultivable land up to 2 Hectares (~5 Acres).',
      'Monthly contribution ₹55 to ₹200 based on entry age; equal contribution by Govt.',
      'PM-KISAN beneficiaries can opt to deduct contribution automatically from PM-KISAN funds.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'बचत बैंक खाता पासबुक / कैंसिल चेक (Bank Details)',
      'जमीन का भूलेख (Khatauni showing land <= 5 Acres)',
      'मोबाइल नंबर (Mobile Number)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Savings Bank Account details / IFSC',
      'Land Ownership record proving land is 5 Acres or less',
      'Active Mobile Number',
    ],
    stepsHI: [
      'CSC केंद्र पर जाएं या हमारे ऐप से सीधा आवेदन दर्ज करें।',
      'उम्र के अनुसार मासिक अंशदान राशि तय होगी।',
      'किसान पेंशन कार्ड (KMY Card) तुरंत जारी होगा।',
    ],
    stepsEN: [
      'Apply online via CSC VLE or direct in-app submission.',
      'Monthly contribution rate auto-computed based on current age.',
      'Instant generation of official Kisan Pension Card.',
    ]
  },
  {
    id: 'namo-drone-didi',
    category: 'machinery',
    isNew2026: true,
    titleHI: 'नमो ड्रोन दीदी योजना 2026 (Namo Drone Didi Scheme)',
    titleEN: 'Namo Drone Didi Agriculture Scheme 2026',
    ministryHI: 'ग्रामीण विकास व कृषि मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Rural Development & Agriculture, Govt of India',
    taglineHI: 'खेतों में कीटनाशक व नैनो यूरिया छिड़काव के लिए कृषि ड्रोन पर 80% सब्सिडी (₹8 लाख तक)।',
    taglineEN: '80% subsidy up to ₹8 Lakh to deploy modern agricultural drones for precision spraying.',
    benefitBadgeHI: '80% ड्रोन सब्सिडी (₹8 लाख)',
    benefitBadgeEN: '80% Subsidy (Up to ₹8L)',
    benefitTypeHI: 'ड्रोन खरीद लागत पर ₹8 लाख तक की वित्तीय सहायता व 15 दिन का मुफ्त पायलट प्रशिक्षण',
    benefitTypeEN: 'Up to ₹8 Lakh grant for drone purchase with 15-day certified DGCA pilot training',
    officialUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1980313',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'महिला स्वयं सहायता समूह (SHG), महिला कृषक व प्रगतिशील किसान समूह',
    farmerTypeEN: 'Women Self Help Groups (SHGs), progressive farmers & FPOs',
    eligibilityHI: [
      'महिला स्वयं सहायता समूह (SHG) या किसान उत्पादक संगठन (FPO) का सदस्य होना चाहिए।',
      'कम से कम 10वीं पास और 18 वर्ष से अधिक आयु की महिला प्रतिभागी।',
      'प्रशिक्षण पूरा होने पर भारत सरकार द्वारा अधिकृत ड्रोन पायलट लाइसेंस मिलता है।',
    ],
    eligibilityEN: [
      'Member of registered Women Self Help Group (SHG) or FPO.',
      'Minimum 10th pass and aged 18 years or above.',
      'Entitled to DGCA certified Drone Remote Pilot Certificate upon course completion.',
    ],
    documentsHI: [
      'आधार कार्ड व 10वीं मार्कशीट (Aadhaar & Marksheet)',
      'स्वयं सहायता समूह (SHG) पंजीकरण प्रमाण पत्र',
      'बैंक खाता पासबुक (Bank Details)',
      'पासपोर्ट साइज फोटो',
    ],
    documentsEN: [
      'Aadhaar Card and 10th pass certificate',
      'SHG / FPO Registration Certificate',
      'Bank Account Passbook',
      'Passport size photographs',
    ],
    stepsHI: [
      'नज़दीकी ब्लॉक कृषि अधिकारी या हमारे ऐप से आवेदन करें।',
      '15-दिवसीय डीजीसीए मान्यता प्राप्त ड्रोन प्रशिक्षण प्राप्त करें।',
      '80% सब्सिडी पर ड्रोन प्राप्त कर खेतों में छिड़काव सेवा शुरू करें।',
    ],
    stepsEN: [
      'Apply via Block Agriculture officer or direct in-app submission.',
      'Complete 15-day DGCA approved drone pilot training.',
      'Receive drone with 80% subsidy and start custom spraying service.',
    ]
  },
  {
    id: 'pm-surya-ghar-krishi',
    category: 'solar_irrigation',
    isNew2026: true,
    titleHI: 'पीएम सूर्य घर मुफ्त बिजली योजना (कृषि फार्महाउस व ट्यूबवेल)',
    titleEN: 'PM Surya Ghar Muft Bijli Yojana (Farm Solarization)',
    ministryHI: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of New & Renewable Energy, Govt of India',
    taglineHI: 'कृषि फार्महाउस, ट्यूबवेल व आवासीय छतों पर सोलर प्लांट लगाने पर ₹78,000 तक की सीधी सब्सिडी।',
    taglineEN: 'Direct subsidy up to ₹78,000 for solar rooftop and farm electricity generation.',
    benefitBadgeHI: '₹78,000 सीधी सब्सिडी',
    benefitBadgeEN: 'Up to ₹78,000 Subsidy',
    benefitTypeHI: '3 किलोवाट तक के सोलर रूफटॉप प्लांट पर ₹78,000 तक का प्रत्यक्ष सरकारी अनुदान',
    benefitTypeEN: 'Direct bank subsidy up to ₹78,000 for 1-3 kW rooftop solar plants; free farm power',
    officialUrl: 'https://pmsuryaghar.gov.in/',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'वे सभी किसान जिनके पास बिजली का वैध कृषि या घरेलू कनेक्शन उपलब्ध है',
    farmerTypeEN: 'All farmers with active agricultural or residential power connection',
    eligibilityHI: [
      'आवेदक के पास वैध बिजली कनेक्शन व छत/फार्महाउस में धूप वाली जगह होनी चाहिए।',
      'ऑनलाइन आवेदन के 30 दिनों में डीबीटी द्वारा सीधे बैंक खाते में सब्सिडी।',
      'अतिरिक्त बिजली ग्रिड को बेचकर किसान हर महीने कमाई भी कर सकते हैं।',
    ],
    eligibilityEN: [
      'Must possess active electricity meter and shadow-free roof/farm ground.',
      'Direct bank subsidy credited within 30 days of installation.',
      'Surplus electricity fed to grid generating monthly income for farmer.',
    ],
    documentsHI: [
      'बिजली का ताज़ा बिल (Electricity Bill)',
      'आधार कार्ड (Aadhaar Card)',
      'बैंक पासबुक (Bank Passbook Copy)',
      'छत या फार्महाउस की फोटो',
    ],
    documentsEN: [
      'Latest Electricity Bill',
      'Aadhaar Card',
      'Bank Passbook Copy for DBT subsidy',
      'Site photograph of installation space',
    ],
    stepsHI: [
      'pmsuryaghar.gov.in या हमारे ऐप से डिस्कॉम का चयन कर आवेदन करें।',
      'अनुमोदित वेंडर से सोलर पैनल लगवाएं।',
      'नेट मीटर लगते ही 30 दिन में ₹78,000 सीधे बैंक खाते में क्रेडिट होंगे।',
    ],
    stepsEN: [
      'Apply via National Portal selecting your state DISCOM.',
      'Install system via empaneled vendors.',
      'Net-meter commissioned and ₹78,000 subsidy credited within 30 days.',
    ]
  },
  {
    id: 'national-pulses-oilseeds-2026',
    category: 'income',
    isNew2026: true,
    titleHI: 'राष्ट्रीय दलहन एवं तिलहन आत्मनिर्भरता मिशन 2026',
    titleEN: 'National Pulses & Oilseeds Self-Reliance Mission 2026',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय व NAFED',
    ministryEN: 'Ministry of Agriculture & NAFED, Govt of India',
    taglineHI: 'चना, अरहर, उड़द, मसूर, सरसों व सोयाबीन पर 100% सुनिश्चित MSP खरीद गारंटी व मुफ्त बीज किट।',
    taglineEN: '100% assured MSP procurement guarantee and free certified high-yield seed minikits.',
    benefitBadgeHI: '100% MSP खरीद गारंटी',
    benefitBadgeEN: '100% MSP Guarantee',
    benefitTypeHI: 'मुफ्त उन्नत बीज मिनीकिट व NAFED/NCCF द्वारा पूरे उत्पादन की न्यूनतम समर्थन मूल्य (MSP) पर शत-प्रतिशत खरीद',
    benefitTypeEN: 'Free certified seed minikits + 100% purchase of total harvest by NAFED/NCCF at MSP',
    officialUrl: 'https://esamyukti.dac.gov.in/',
    targetCrops: ['Chana', 'Arhar', 'Moong', 'Urad', 'Masoor', 'Mustard', 'Soybean', 'Groundnut'],
    maxLandAcres: null,
    farmerTypeHI: 'दालें और तिलहन की खेती करने वाले सभी किसान',
    farmerTypeEN: 'All farmers cultivating pulses and oilseeds across India',
    eligibilityHI: [
      'दलहन या तिलहन की अधिसूचित फसलों की खेती करने वाले किसान।',
      'ई-समृद्धि पोर्टल (e-Samridhi) पर फसल बुवाई से पहले निःशुल्क पंजीकरण अनिवार्य।',
      'फसल कटाई के बाद सीधे सरकारी खरीद केंद्र पर फसल की तौल व 48 घंटे में भुगतान।',
    ],
    eligibilityEN: [
      'Farmers cultivating pulses or oilseeds crops.',
      'Mandatory free pre-registration on e-Samridhi portal prior to harvest.',
      'Guaranteed purchase at mandi yards with payment credited in 48 hours.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का भूलेख (Khasra Khatauni)',
      'फसल बुवाई स्व-घोषणा पत्र (Crop Declaration)',
      'बैंक पासबुक (Bank Passbook)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Records (Khatauni)',
      'Crop Sowing Self-Declaration',
      'Bank Passbook Copy for Direct Payment',
    ],
    stepsHI: [
      'ई-समृद्धि पोर्टल पर अपनी दलहन/तिलहन फसल का पंजीकरण करें।',
      'कृषि विभाग से मुफ्त उन्नत बीज मिनीकिट प्राप्त करें।',
      'कटाई के बाद NAFED केंद्र पर 100% MSP पर फसल बेचें।',
    ],
    stepsEN: [
      'Register pulse/oilseed crop on e-Samridhi portal.',
      'Collect free certified seed minikit from local block office.',
      'Sell complete harvest at 100% MSP directly to NAFED purchase centres.',
    ]
  },
  {
    id: 'pkvy-organic',
    category: 'income',
    titleHI: 'परम्परागत कृषि विकास योजना - जैविक खेती (PKVY)',
    titleEN: 'Paramparagat Krishi Vikas Yojana (Organic Farming - PKVY)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'जैविक व प्राकृतिक खेती अपनाने पर ₹50,000 प्रति हेक्टेयर की सीधी वित्तीय व तकनीकी सहायता।',
    taglineEN: 'Financial support of ₹50,000 per hectare for 3 years to adopt organic and natural farming.',
    benefitBadgeHI: '₹50,000 / हेक्टेयर सहायता',
    benefitBadgeEN: '₹50,000 / Ha Support',
    benefitTypeHI: 'जैविक खाद, वर्मी कम्पोस्ट, बीज और PGS-India जैविक प्रमाणीकरण (Certification) पूर्णतः मुफ्त',
    benefitTypeEN: 'Financial aid for vermicompost, bio-fertilizers, botanical extracts, plus free PGS organic certification',
    officialUrl: 'https://pgsindia-ncof.gov.in/',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'जैविक या प्राकृतिक खेती करने के इच्छुक सभी किसान व क्लस्टर समूह',
    farmerTypeEN: 'Farmers willing to transition to organic/natural farming in cluster mode',
    eligibilityHI: [
      'किसान या 20-50 किसानों का क्लस्टर समूह (कम से कम 50 एकड़ क्षेत्र)।',
      'रासायनिक खाद व कीटनाशकों का प्रयोग न करने का संकल्प पत्र।',
      '3 वर्षों के सफल मूल्यांकन के बाद अंतरराष्ट्रीय मान्य जैविक प्रमाण पत्र मिलता है।',
    ],
    eligibilityEN: [
      'Individual farmers or 20-50 farmer clusters (minimum 50 acres cluster).',
      'Pledge to avoid synthetic fertilizers and toxic chemical pesticides.',
      'Eligible for government-backed PGS-India Organic Certification after 3 years.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का भूलेख (Khasra Khatauni)',
      'क्लस्टर समूह सदस्यता फार्म (Cluster Membership Form)',
      'बैंक पासबुक (Bank Details)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Records (Khatauni)',
      'Cluster Membership Form / Agreement',
      'Bank Account Passbook',
    ],
    stepsHI: [
      'ग्राम कृषि सहायक या हमारे ऐप से जैविक क्लस्टर पंजीकरण कराएं।',
      'जैविक खाद निर्माण व वर्मी-कम्पोस्ट यूनिट स्थापित करें।',
      'प्रमाणित जैविक उपज को बाजार में 30% अधिक दाम पर बेचें।',
    ],
    stepsEN: [
      'Register cluster at block agriculture office or in-app portal.',
      'Establish vermicompost and on-farm bio-input production unit.',
      'Market certified organic produce at 25-35% premium prices.',
    ]
  },
  {
    id: 'aif-infra-loan',
    category: 'credit_loan',
    titleHI: 'कृषि अवसंरचना कोष योजना (Agriculture Infrastructure Fund - AIF)',
    titleEN: 'Agriculture Infrastructure Fund (AIF 3% Subvention)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'गोदाम, कोल्ड स्टोरेज, ग्रेडिंग यूनिट व सोलर ड्रायर लगाने के लिए 3% ब्याज छूट पर ₹2 करोड़ तक का ऋण।',
    taglineEN: 'Medium-long term debt financing up to ₹2 Crore with 3% interest subvention for post-harvest infra.',
    benefitBadgeHI: '₹2 करोड़ तक @ 3% ब्याज छूट',
    benefitBadgeEN: 'Up to ₹2Cr @ 3% Relief',
    benefitTypeHI: '3% प्रति वर्ष ब्याज अनुदान 7 वर्षों के लिए तथा CGTMSE के तहत निःशुल्क सरकारी क्रेडिट गारंटी',
    benefitTypeEN: '3% interest subvention per annum for 7 years plus free government credit guarantee',
    officialUrl: 'https://agriinfra.dac.gov.in/',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'किसान, FPO, पैक्स (PACS), कृषि उद्यमी व स्वयं सहायता समूह',
    farmerTypeEN: 'Farmers, Agri-entrepreneurs, FPOs, PACS, and Self Help Groups',
    eligibilityHI: [
      'फसल कटाई उपरांत प्रबंधन (गोदाम, कोल्ड स्टोरेज, सॉर्टिंग-पैकिंग यूनिट) की योजना।',
      '₹2 करोड़ तक के ऋण पर बैंक द्वारा 3% ब्याज की छूट केंद्र सरकार सीधे देती है।',
      'परियोजना का डीपीआर (DPR) तैयार होना चाहिए।',
    ],
    eligibilityEN: [
      'Project for post-harvest post-processing, cold chain, warehouse, or packhouse.',
      'Loans up to ₹2 Crore get 3% interest relief credited by Central Govt.',
      'Detailed Project Report (DPR) submitted to empaneled commercial banks.',
    ],
    documentsHI: [
      'आधार कार्ड व पैन कार्ड (Aadhaar & PAN)',
      'जमीन की रजिस्ट्री / लीज डीड (Land Ownership/Lease)',
      'प्रोजेक्ट रिपोर्ट / डीपीआर (Detailed Project Report)',
      'बैंक स्टेटमेंट (पिछले 6 महीने का)',
    ],
    documentsEN: [
      'Aadhaar Card and PAN Card',
      'Land Title or long-term lease agreement',
      'Detailed Project Report (DPR) / Cost Estimation',
      'Bank Statement of past 6 months',
    ],
    stepsHI: [
      'agriinfra.dac.gov.in पोर्टल पर प्रोजेक्ट सबमिट करें।',
      'कृषि मंत्रालय से ऑनलाइन अनुमोदन प्राप्त होने पर बैंक ऋण स्वीकृत करेगा।',
      'ऋण शुरू होते ही ब्याज में 3% की सीधी छूट लागू होगी।',
    ],
    stepsEN: [
      'Submit DPR proposal on AIF portal.',
      'Receive ministry verification and bank sanction.',
      'Enjoy 3% subsidized interest rate from first installment.',
    ]
  },
  {
    id: 'crm-residue-machinery',
    category: 'machinery',
    titleHI: 'फसल अवशेष प्रबंधन योजना (Happy Seeder / Super Seeder Subsidy)',
    titleEN: 'Crop Residue Management (CRM Machinery Scheme)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'पराली प्रबंधन व बिना जुताई गेहूं बुवाई के लिए सुपर सीडर व बेलर पर 50% से 80% तक सब्सिडी।',
    taglineEN: '50% individual to 80% custom hiring center subsidy on Super Seeder, Happy Seeder and Balers.',
    benefitBadgeHI: '50% - 80% पराली उपकरण छूट',
    benefitBadgeEN: '50% - 80% CRM Subsidy',
    benefitTypeHI: 'सुपर सीडर, हैप्पी सीडर, जीरो टिल ड्रिल और स्ट्रॉ चॉपर पर ₹1.5 से ₹3 लाख तक की सीधी छूट',
    benefitTypeEN: 'Direct grant on advanced stubble management machinery eliminating stubble burning',
    officialUrl: 'https://agrimachinery.nic.in/',
    targetCrops: ['Paddy', 'Wheat', 'Sugarcane', 'Cotton'],
    maxLandAcres: null,
    farmerTypeHI: 'धान व गेहूं उगाने वाले किसान (पंजाब, हरियाणा, यूपी, राजस्थान, एमपी आदि)',
    farmerTypeEN: 'Farmers cultivating paddy and wheat seeking residue management',
    eligibilityHI: [
      'आवेदक के पास वैध ट्रैक्टर व कृषि भूमि होनी चाहिए।',
      'पराली न जलाने की लिखित शपथ पत्र।',
      'कस्टम हायरिंग सेंटर (CHC) स्थापित करने पर 80% तक सब्सिडी।',
    ],
    eligibilityEN: [
      'Farmer must own a registered tractor and farm land.',
      'Undertaking not to burn crop residue in field.',
      'Up to 80% subsidy for setting up Custom Hiring Centres (CHCs).',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'ट्रैक्टर की आरसी (Tractor Registration RC)',
      'जमीन की खतौनी (Land Records)',
      'बैंक पासबुक व कोटेशन बिल (Bank Passbook & Dealer Quotation)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Tractor RC Book',
      'Land Records (Khatauni)',
      'Bank Passbook & Dealer Quotation',
    ],
    stepsHI: [
      'कृषि विभाग पोर्टल पर सुपर सीडर या बेलर के लिए ऑनलाइन टोकन लें।',
      'टोकन जारी होने पर प्रमाणित डीलर से मशीन खरीदें।',
      'अधिकारी द्वारा भौतिक सत्यापन होते ही सब्सिडी खाते में आ जाएगी।',
    ],
    stepsEN: [
      'Book online subsidy token for Super Seeder/Baler.',
      'Purchase implement from authorized dealer upon token validation.',
      'Subsidy credited to bank account following physical inspection.',
    ]
  },
  {
    id: 'rwbcis-weather-insurance',
    category: 'insurance',
    titleHI: 'पुनर्गठित मौसम आधारित फसल बीमा योजना (RWBCIS)',
    titleEN: 'Restructured Weather Based Crop Insurance (RWBCIS)',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'अत्यधिक पाला, तेज हवा, अत्यधिक तापमान व बेमौसम पाला से होने वाले नुकसान पर मौसम-आधारित मुआवजा।',
    taglineEN: 'Weather-indexed automated crop compensation against adverse temperature, frost, and high winds.',
    benefitBadgeHI: 'स्वचालित मौसम मुआवजा',
    benefitBadgeEN: 'Automated Weather Claim',
    benefitTypeHI: 'मौसम केंद्र के डेटा के आधार पर बिना किसी जटिल सर्वे के सीधे बैंक खाते में क्षतिपूर्ति भुगतान',
    benefitTypeEN: 'Direct payout triggered automatically by automated weather station (AWS) parametric data',
    officialUrl: 'https://pmfby.gov.in/',
    targetCrops: ['Potato', 'Mustard', 'Chilli', 'Mango', 'Banana', 'Tomato', 'Apple', 'Citrus'],
    maxLandAcres: null,
    farmerTypeHI: 'बागवानी, सब्जी व नकदी फसलें उगाने वाले किसान',
    farmerTypeEN: 'Horticulture, vegetable, and high-value cash crop growers',
    eligibilityHI: [
      'अधिसूचित तहसील में मौसम संवेदनशील बागवानी फसलों की खेती करने वाले किसान।',
      'तापमान व पाले के मानक से विचलन होते ही क्लेम स्वतः स्वीकृत होता है।',
      'ऋणी व गैर-ऋणी सभी किसान नामांकन कर सकते हैं।',
    ],
    eligibilityEN: [
      'Growing notified horticulture crops in notified weather-station areas.',
      'Claims triggered automatically based on deviations recorded by IMD/private weather stations.',
      'Open to both loanee and non-loanee farmers.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का भूलेख / 7/12 (Land Records)',
      'फसल बुवाई प्रमाण पत्र (Patwari Certificate)',
      'बैंक पासबुक (Bank Account Copy)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Ownership Proof (Khatauni / 7-12)',
      'Crop Sowing Verification Certificate',
      'Bank Account Passbook Copy',
    ],
    stepsHI: [
      'बैंक या कॉमन सर्विस सेंटर पर फसल व रकबा दर्ज कर प्रीमियम जमा करें।',
      'मौसम स्टेशन द्वारा अत्यधिक ठंड/गर्मी दर्ज होते ही बीमा कंपनी क्लेम बनाएगी।',
      'बिना किसी व्यक्तिगत क्लेम फॉर्म के राशि सीधे बैंक खाते में आएगी।',
    ],
    stepsEN: [
      'Enroll at CSC or commercial bank before seasonal cut-off date.',
      'Weather station automatically logs extreme weather events.',
      'Claim amount deposited directly into bank without cumbersome paperwork.',
    ]
  }
];

// Latest 2026 Newly Announced Government Schemes for Live Sync
export const LATEST_2026_ADDITIONS = [
  {
    id: 'digital-agri-mission-2026',
    category: 'credit_loan',
    isNew2026: true,
    titleHI: 'डिजिटल कृषि मिशन 2026 (Digital Agriculture Mission & AgriStack)',
    titleEN: 'Digital Agriculture Mission & AgriStack 2026',
    ministryHI: 'इलेक्ट्रॉनिक्स व कृषि मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Electronics & Agriculture, Govt of India',
    taglineHI: 'डिजिटल किसान पहचान पत्र (Kisan ID) से 5 मिनट में बिना बैंक चक्कर लगाए तत्काल डिजिटल लोन व खाद सब्सिडी।',
    taglineEN: 'Instant paperless credit and fertilizer delivery via unified Farmer Registry (AgriStack ID).',
    benefitBadgeHI: '5 मिनट में डिजिटल KCC',
    benefitBadgeEN: '5-Min Digital KCC',
    benefitTypeHI: 'डिजिटल किसान रजिस्ट्री से बिना किसी कागजी दस्तावेज के ₹1.60 लाख तक का त्वरित डिजिटल ऋण',
    benefitTypeEN: 'Instant paperless agricultural credit and digital crop survey verification in minutes',
    officialUrl: 'https://agristack.gov.in/',
    targetCrops: ['All'],
    maxLandAcres: null,
    farmerTypeHI: 'देश के सभी पंजीकृत किसान (डिजिटल आधार लिंक्ड)',
    farmerTypeEN: 'All registered farmers across India through digital AgriStack registry',
    eligibilityHI: [
      'आधार व जमीन का भूलेख डिजिटल रूप से सत्यापित होना चाहिए।',
      'डिजिटल किसान आईडी (Kisan ID) का निर्माण आवश्यक है।',
      'बिना बैंक जाए मोबाइल ऐप के माध्यम से 100% पेपरलेस स्वीकृति।',
    ],
    eligibilityEN: [
      'Aadhaar and land registry digitally linked in state bhulekh database.',
      'Creation of 12-digit Digital Farmer ID.',
      '100% paperless approval and loan disbursal via mobile banking.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'मोबाइल ओटीपी (Mobile OTP for eKYC)',
      'जमीन का भूलेख (Auto-fetched)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Mobile OTP for instant e-KYC',
      'Digital Land Record (Auto-fetched)',
    ],
    stepsHI: [
      'हमारे ऐप पर आधार नंबर दर्ज कर डिजिटल ई-केवाईसी पूर्ण करें।',
      'डिजिटल किसान आईडी से पात्रता स्वतः जांची जाएगी।',
      '5 मिनट में स्वीकृत लोन राशि बैंक खाते में प्राप्त करें।',
    ],
    stepsEN: [
      'Complete instant Aadhaar e-KYC in-app.',
      'Auto-fetch verified land parcel from state bhulekh.',
      'Receive instant loan sanction credited to account within minutes.',
    ]
  },
  {
    id: 'pm-dhan-dhaanya-2026',
    category: 'income',
    isNew2026: true,
    titleHI: 'पीएम धन-धान्य समृद्धि योजना 2026 (श्रीअन्न / मिलेट्स संवर्धन)',
    titleEN: 'PM Dhan-Dhaanya Millets Mission 2026',
    ministryHI: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    ministryEN: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    taglineHI: 'बाजरा, ज्वार, रागी व कोदो-कुटकी उगाने पर ₹12,000 प्रति हेक्टेयर प्रोत्साहन व 100% सरकारी खरीद।',
    taglineEN: '₹12,000 per hectare incentive + 100% MSP procurement for Shree Anna (millets) growers.',
    benefitBadgeHI: '₹12,000 / हेक्टेयर प्रोत्साहन',
    benefitBadgeEN: '₹12,000 / Ha Incentive',
    benefitTypeHI: 'मुफ्त हाइब्रिड बीज किट, ड्रिप सिंचाई में अतिरिक्त 10% सब्सिडी और मिलेट्स पर विशेष बोनस',
    benefitTypeEN: 'Free hybrid millet minikits, extra 10% subsidy on micro-irrigation, and direct financial grant',
    officialUrl: 'https://nutricereals.dac.gov.in/',
    targetCrops: ['Bajra', 'Jowar', 'Ragi', 'Maize', 'Millets', 'Kodo'],
    maxLandAcres: null,
    farmerTypeHI: 'कम पानी वाले क्षेत्रों में मोटे अनाज (मिलेट्स) उगाने वाले किसान',
    farmerTypeEN: 'Farmers cultivating coarse grains and climate-resilient millets',
    eligibilityHI: [
      'बाजरा, ज्वार, रागी या अन्य मोटे अनाजों की बुवाई करने वाले किसान।',
      'कम पानी व बिना रासायनिक खाद के खेती करने पर विशेष बोनस।',
      'सरकारी राशन प्रणाली (PDS) हेतु न्यूनतम समर्थन मूल्य पर शत-प्रतिशत खरीद।',
    ],
    eligibilityEN: [
      'Cultivation of Bajra, Jowar, Ragi, or other recognized nutritious millets.',
      'Special environmental bonus for water-saving non-chemical cultivation.',
      '100% procurement at MSP for central pool distribution.',
    ],
    documentsHI: [
      'आधार कार्ड (Aadhaar Card)',
      'जमीन का भूलेख (Khatauni)',
      'मिलेट्स बुवाई प्रमाण पत्र (Crop Proof)',
      'बैंक पासबुक (Bank Passbook)',
    ],
    documentsEN: [
      'Aadhaar Card',
      'Land Records (Khatauni)',
      'Millet Sowing Declaration',
      'Bank Account Passbook',
    ],
    stepsHI: [
      'श्रीअन्न पोर्टल या हमारे ऐप से मिलेट्स प्रोत्साहन हेतु पंजीकरण करें।',
      'कृषि विभाग से मुफ्त मिलेट्स बीज किट प्राप्त करें।',
      'कटाई उपरांत ₹12,000/हेक्टेयर अनुदान व MSP भुगतान प्राप्त करें।',
    ],
    stepsEN: [
      'Register for Shree Anna incentive program in-app.',
      'Collect free certified hybrid millet seed kit.',
      'Receive direct financial grant and sell produce at 100% MSP.',
    ]
  }
];

// Return all schemes merged with locally stored sync additions
export function getLiveSchemes() {
  try {
    const synced = JSON.parse(localStorage.getItem('kisan_synced_schemes') || 'null');
    if (synced && Array.isArray(synced) && synced.length > 0) {
      const existingIds = new Set(GOVT_SCHEMES.map(s => s.id));
      const newItems = synced.filter(s => !existingIds.has(s.id));
      return [...newItems, ...GOVT_SCHEMES];
    }
  } catch {}
  return GOVT_SCHEMES;
}

// Simulate syncing new live govt schemes from central APIs
export function syncLatestGovtSchemes() {
  try {
    localStorage.setItem('kisan_synced_schemes', JSON.stringify(LATEST_2026_ADDITIONS));
    localStorage.setItem('kisan_schemes_last_synced', new Date().toISOString());
    window.dispatchEvent(new Event('kisan_schemes_updated'));
    return {
      success: true,
      addedCount: LATEST_2026_ADDITIONS.length,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch {
    return { success: false, addedCount: 0 };
  }
}

// Helper: Check if a scheme matches a farmer's profile
export function isSchemeMatchingFarmer(scheme, farmer) {
  if (!farmer) return false;

  // Check land acreage constraint if scheme has one
  if (scheme.maxLandAcres) {
    const farmerLand = parseFloat(farmer.land) || 3.5;
    if (farmerLand > scheme.maxLandAcres) return false;
  }

  // Check crop match
  if (scheme.targetCrops && !scheme.targetCrops.includes('All')) {
    const farmerCrop = (farmer.crop || '').toLowerCase();
    const matchesCrop = scheme.targetCrops.some(c => farmerCrop.includes(c.toLowerCase()));
    if (!matchesCrop) return false;
  }

  return true;
}
