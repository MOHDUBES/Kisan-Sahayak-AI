// Comprehensive Database of Indian Crops (भारतीय फसलों की संपूर्ण सूची)

export const CROP_CATEGORIES = [
  {
    id: 'cereals',
    titleHI: '🌾 अनाज व मोटा अनाज (Cereals & Millets)',
    titleEN: '🌾 Cereals & Millets',
    crops: [
      { id: 'wheat', nameHI: 'गेहूं (Wheat)', nameEN: 'Wheat (गेहूं)', icon: '🌾' },
      { id: 'paddy', nameHI: 'धान / चावल (Paddy / Rice)', nameEN: 'Paddy / Rice (धान)', icon: '🌾' },
      { id: 'maize', nameHI: 'मक्का (Maize / Corn)', nameEN: 'Maize / Corn (मक्का)', icon: '🌽' },
      { id: 'bajra', nameHI: 'बाजरा (Pearl Millet)', nameEN: 'Pearl Millet / Bajra (बाजरा)', icon: '🌾' },
      { id: 'jowar', nameHI: 'ज्वार (Sorghum)', nameEN: 'Sorghum / Jowar (ज्वार)', icon: '🌾' },
      { id: 'barley', nameHI: 'जौ (Barley)', nameEN: 'Barley / Jau (जौ)', icon: '🌾' },
      { id: 'ragi', nameHI: 'रागी / मड़ुआ (Finger Millet)', nameEN: 'Finger Millet / Ragi (रागी)', icon: '🌾' },
    ]
  },
  {
    id: 'pulses',
    titleHI: '🫘 दलहन / दालें (Pulses & Lentils)',
    titleEN: '🫘 Pulses & Lentils',
    crops: [
      { id: 'chana', nameHI: 'चना (Gram / Chickpea)', nameEN: 'Gram / Chickpea (चना)', icon: '🫘' },
      { id: 'arhar', nameHI: 'अरहर / तुअर (Pigeon Pea)', nameEN: 'Pigeon Pea / Arhar (अरहर)', icon: '🫘' },
      { id: 'moong', nameHI: 'मूंग (Green Gram)', nameEN: 'Green Gram / Moong (मूंग)', icon: '🫘' },
      { id: 'urad', nameHI: 'उड़द (Black Gram)', nameEN: 'Black Gram / Urad (उड़द)', icon: '🫘' },
      { id: 'masoor', nameHI: 'मसूर (Red Lentil)', nameEN: 'Red Lentil / Masoor (मसूर)', icon: '🫘' },
      { id: 'matar', nameHI: 'मटर (Green Peas)', nameEN: 'Green Peas / Matar (मटर)', icon: '🟢' },
      { id: 'soybean', nameHI: 'सोयाबीन (Soybean)', nameEN: 'Soybean (सोयाबीन)', icon: '🫘' },
    ]
  },
  {
    id: 'oilseeds',
    titleHI: '🌻 तिलहन (Oilseeds)',
    titleEN: '🌻 Oilseeds',
    crops: [
      { id: 'mustard', nameHI: 'सरसों / राई (Mustard)', nameEN: 'Mustard / Sarson (सरसों)', icon: '🌼' },
      { id: 'groundnut', nameHI: 'मूंगफली (Groundnut / Peanut)', nameEN: 'Groundnut / Peanut (मूंगफली)', icon: '🥜' },
      { id: 'sunflower', nameHI: 'सूरजमुखी (Sunflower)', nameEN: 'Sunflower (सूरजमुखी)', icon: '🌻' },
      { id: 'sesame', nameHI: 'तिल (Sesame)', nameEN: 'Sesame / Til (तिल)', icon: '🌱' },
      { id: 'flaxseed', nameHI: 'अलसी (Flaxseed / Linseed)', nameEN: 'Flaxseed / Alsi (अलसी)', icon: '🌱' },
    ]
  },
  {
    id: 'cash_crops',
    titleHI: '🌿 नकदी व व्यापारिक फसलें (Cash Crops)',
    titleEN: '🌿 Cash & Commercial Crops',
    crops: [
      { id: 'cotton', nameHI: 'कपास (Cotton)', nameEN: 'Cotton / Kapas (कपास)', icon: '☁️' },
      { id: 'sugarcane', nameHI: 'गन्ना (Sugarcane)', nameEN: 'Sugarcane (गन्ना)', icon: '🎋' },
      { id: 'jute', nameHI: 'जूट / पटसन (Jute)', nameEN: 'Jute / Patsan (जूट)', icon: '🌾' },
      { id: 'tea', nameHI: 'चाय (Tea)', nameEN: 'Tea Leaves (चाय)', icon: '🍵' },
      { id: 'coffee', nameHI: 'कॉफी (Coffee)', nameEN: 'Coffee (कॉफी)', icon: '☕' },
      { id: 'tobacco', nameHI: 'तंबाकू (Tobacco)', nameEN: 'Tobacco (तंबाकू)', icon: '🍂' },
    ]
  },
  {
    id: 'vegetables',
    titleHI: '🥔 मौसमी सब्जियां (Vegetables)',
    titleEN: '🥔 Seasonal Vegetables',
    crops: [
      { id: 'potato', nameHI: 'आलू (Potato)', nameEN: 'Potato / Aloo (आलू)', icon: '🥔' },
      { id: 'onion', nameHI: 'प्याज (Onion)', nameEN: 'Onion / Pyaz (प्याज)', icon: '🧅' },
      { id: 'tomato', nameHI: 'टमाटर (Tomato)', nameEN: 'Tomato (टमाटर)', icon: '🍅' },
      { id: 'chilli', nameHI: 'हरी व लाल मिर्च (Chilli)', nameEN: 'Chilli / Mirch (मिर्च)', icon: '🌶️' },
      { id: 'garlic_ginger', nameHI: 'लहसुन और अदरक (Garlic & Ginger)', nameEN: 'Garlic & Ginger (लहसुन-अदरक)', icon: '🧄' },
      { id: 'brinjal', nameHI: 'बैंगन (Brinjal / Eggplant)', nameEN: 'Brinjal / Eggplant (बैंगन)', icon: '🍆' },
      { id: 'okra', nameHI: 'भिंडी (Ladyfinger / Okra)', nameEN: 'Ladyfinger / Bhindi (भिंडी)', icon: '🥬' },
      { id: 'cauliflower', nameHI: 'गोभी व पत्तागोभी (Cauliflower & Cabbage)', nameEN: 'Cauliflower & Cabbage (गोभी)', icon: '🥦' },
      { id: 'gourds', nameHI: 'लौकी, तोरी व कद्दू (Gourds / Cucurbits)', nameEN: 'Gourds & Cucurbits (लौकी-तोरी)', icon: '🥒' },
    ]
  },
  {
    id: 'fruits',
    titleHI: '🥭 बागवानी व फल (Horticulture & Fruits)',
    titleEN: '🥭 Horticulture & Fruits',
    crops: [
      { id: 'mango', nameHI: 'आम (Mango)', nameEN: 'Mango / Aam (आम)', icon: '🥭' },
      { id: 'banana', nameHI: 'केला (Banana)', nameEN: 'Banana / Kela (केला)', icon: '🍌' },
      { id: 'apple', nameHI: 'सेब (Apple)', nameEN: 'Apple / Seb (सेब)', icon: '🍎' },
      { id: 'citrus', nameHI: 'संतरा, मौसमी व नींबू (Citrus & Lemon)', nameEN: 'Citrus & Lemon (संतरा-नींबू)', icon: '🍊' },
      { id: 'guava', nameHI: 'अमरूद (Guava)', nameEN: 'Guava / Amrood (अमरूद)', icon: '🍈' },
      { id: 'pomegranate', nameHI: 'अनार (Pomegranate)', nameEN: 'Pomegranate / Anaar (अनार)', icon: '🍎' },
      { id: 'grapes', nameHI: 'अंगूर (Grapes)', nameEN: 'Grapes / Angoor (अंगूर)', icon: '🍇' },
      { id: 'papaya', nameHI: 'पपीता (Papaya)', nameEN: 'Papaya / Papeeta (पपीता)', icon: '🍈' },
    ]
  },
  {
    id: 'spices',
    titleHI: '🌿 मसाले (Spices)',
    titleEN: '🌿 Spices',
    crops: [
      { id: 'turmeric', nameHI: 'हल्दी (Turmeric)', nameEN: 'Turmeric / Haldi (हल्दी)', icon: '🟡' },
      { id: 'cumin', nameHI: 'जीरा (Cumin)', nameEN: 'Cumin / Jeera (जीरा)', icon: '🌱' },
      { id: 'coriander', nameHI: 'धनिया (Coriander)', nameEN: 'Coriander / Dhaniya (धनिया)', icon: '🌿' },
      { id: 'fennel', nameHI: 'सौंफ (Fennel)', nameEN: 'Fennel / Saunf (सौंफ)', icon: '🌱' },
      { id: 'fenugreek', nameHI: 'मेथी दाना (Fenugreek)', nameEN: 'Fenugreek / Methi (मेथी)', icon: '🌱' },
    ]
  },
  {
    id: 'mixed',
    titleHI: '🚜 बहु-फसली व मिश्रित (Mixed Farming)',
    titleEN: '🚜 Multi-Crop & Mixed Farming',
    crops: [
      { id: 'wheat_mustard', nameHI: 'गेहूं और सरसों (Wheat + Mustard)', nameEN: 'Wheat + Mustard (गेहूं व सरसों)', icon: '🌾' },
      { id: 'cotton_soy', nameHI: 'कपास और सोयाबीन (Cotton + Soybean)', nameEN: 'Cotton + Soybean (कपास व सोयाबीन)', icon: '🌿' },
      { id: 'multi_crop', nameHI: 'मौसमी बहु-फसल (Multi-Crop Mixed)', nameEN: 'Seasonal Multi-Crop (मौसमी बहु-फसल)', icon: '🚜' },
    ]
  }
];

// Flat list for quick search or default selection
export const ALL_CROPS = CROP_CATEGORIES.flatMap(cat => cat.crops);
