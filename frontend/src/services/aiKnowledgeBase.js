/**
 * Kopargaon Municipal Council AI Assistant Knowledge Base & Intent Recognition Engine
 * Provides structured step-by-step municipal guidance, document checklists, SLAs, and action buttons.
 */

export const INTENTS = {
  BUILDING_PERMIT: 'BUILDING_PERMIT',
  PROPERTY_TAX: 'PROPERTY_TAX',
  WATER_TAX: 'WATER_TAX',
  REGISTER_COMPLAINT: 'REGISTER_COMPLAINT',
  TRACK_COMPLAINT: 'TRACK_COMPLAINT',
  WATER_SUPPLY: 'WATER_SUPPLY',
  ELECTRICITY: 'ELECTRICITY',
  WEATHER: 'WEATHER',
  TRAFFIC: 'TRAFFIC',
  HOSPITALS: 'HOSPITALS',
  POLICE: 'POLICE',
  FIRE_STATION: 'FIRE_STATION',
  SCHOOLS: 'SCHOOLS',
  BUS_STAND: 'BUS_STAND',
  RAILWAY_STATION: 'RAILWAY_STATION',
  GOVT_SCHEMES: 'GOVT_SCHEMES',
  MUNICIPAL_OFFICE: 'MUNICIPAL_OFFICE',
  EMERGENCY_SERVICES: 'EMERGENCY_SERVICES',
  UNKNOWN: 'UNKNOWN'
};

export const KNOWLEDGE_BASE = {
  BUILDING_PERMIT: {
    title: {
      en: "Building Construction Permission Process",
      mr: "बांधकाम परवानगी प्रक्रिया",
      hi: "भवन निर्माण अनुमति प्रक्रिया"
    },
    intro: {
      en: "To construct a new residential or commercial building in Kopargaon, you must obtain an official Building Permit from the Kopargaon Municipal Council under Town Planning regulations.",
      mr: "कोपरगाव नगर परिषदेच्या नगर रचना विभागाकडून घर किंवा व्यावसायिक इमारतीच्या बांधकामासाठी अधिकृत बांधकाम परवानगी मिळवणे आवश्यक आहे.",
      hi: "कोपरगांव नगर परिषद के नगर नियोजन विभाग से भवन निर्माण की आधिकारिक अनुमति प्राप्त करना आवश्यक है।"
    },
    steps: {
      en: [
        "Log in to the Kopargaon Citizen Portal.",
        "Open 'Building & Permits' from the main dashboard sidebar.",
        "Click 'Apply for New Building Permit'.",
        "Fill in plot dimensions, ward number, and structural details.",
        "Upload required architect drawings and property documents.",
        "Pay the initial scrutinization fee online via UPI/Card.",
        "Track inspection status and receive digital Approval Certificate upon verification."
      ],
      mr: [
        "कोपरगाव नागरिक पोर्टलवर लॉगिन करा.",
        "मुख्य डॅशबोर्डवरील 'बांधकाम व परवाने' विभागात जा.",
        "नवी बांधकाम परवानगीसाठी अर्ज करा वर क्लिक करा.",
        "जागेचे क्षेत्रफळ, प्रभाग क्रमांक व बांधकाम तपशील भरा.",
        "परवानाधारक आर्किटेक्टचे प्लॅन व मालकी हक्काची कागदपत्रे अपलोड करा.",
        "ऑनलाइन छाननी शुल्क भरा व अर्ज सबमिट करा."
      ],
      hi: [
        "कोपरगांव नागरिक पोर्टल पर लॉग इन करें।",
        "मुख्य डैशबोर्ड पर 'भवन एवं अनुमति' सेक्शन खोलें।",
        "'नया भवन अनुमति पत्र' के लिए आवेदन करें पर क्लिक करें।",
        "प्लाट विवरण, वार्ड नंबर और दस्तावेज अपलोड करें।",
        "ऑनलाइन शुल्क का भुगतान करें और रसीद डाउनलोड करें।"
      ]
    },
    documents: {
      en: [
        "7/12 Extract or Property Card (PR Card)",
        "Approved CAD Building Plan from a Licensed Architect",
        "Structure Stability Certificate",
        "Aadhaar Card / PAN Card of Property Owner",
        "NOC from Water Supply & Fire Department (Commercial only)"
      ],
      mr: [
        "७/१२ उतारा किंवा मिळकत पत्रिका (पी.आर. कार्ड)",
        "परवानाधारक आर्किटेक्टने मंजूर केलेला बांधकाम आराखडा",
        "इमारत संरचना स्थिरता प्रमाणपत्र (Structure Stability)",
        "मालकाचे आधार कार्ड व पॅन कार्ड",
        "अग्निशामक व पाणी पुरवठा ना-हरकत दाखला (व्यावसायिक इमारतींसाठी)"
      ],
      hi: [
        "7/12 एक्सट्रैक्ट या प्रॉपर्टी कार्ड",
        "आर्किटेक्ट द्वारा अनुमोदित नक्शा",
        "संरचनात्मक स्थिरता प्रमाण पत्र",
        "मालिक का आधार कार्ड और पैन कार्ड"
      ]
    },
    sla: {
      en: "Processing Time: 14 to 21 Working Days | Scrutiny Fee: ₹500 - ₹2,500 depending on area",
      mr: "कालावधी: १४ ते २१ कार्यदिवस | छाननी शुल्क: ₹५०० ते ₹२,५०० (क्षेत्रफळानुसार)",
      hi: "समय: 14 से 21 कार्य दिवस | शुल्क: ₹500 से ₹2,500"
    },
    actions: [
      { label: "🏛 Apply for Building Permission", tab: "permissions" },
      { label: "📋 Track Building Application", tab: "permissions" }
    ]
  },

  PROPERTY_TAX: {
    title: {
      en: "Kopargaon Property Tax Assessment & Online Payment",
      mr: "कोपरगाव मालमत्ता कर आकारणी व ऑनलाइन भरणा",
      hi: "कोपरगांव संपत्ति कर मूल्यांकन एवं ऑनलाइन भुगतान"
    },
    intro: {
      en: "Property Tax can be calculated and paid online through the Kopargaon Municipal Corporation Revenue Gateway.",
      mr: "कोपरगाव नगर परिषदेचा मालमत्ता कर ऑनलाइन पद्धतीने भरता येतो व ५% सवलतीचा लाभ घेता येतो.",
      hi: "कोपरगांव नगर निगम का संपत्ति कर ऑनलाइन माध्यम से भरा जा सकता है।"
    },
    steps: {
      en: [
        "Go to Property & Water Tax section.",
        "Enter your Property Assessment ID or Aadhaar Number.",
        "Review tax dues, drainage cess, and prompt payment discount.",
        "Select payment method (UPI, Debit/Credit Card, NetBanking).",
        "Download your official digitally signed Municipal Tax Receipt."
      ],
      mr: [
        "मालमत्ता व पाणी कर विभागात जा.",
        "तुमचा मालमत्ता क्रमांक (Property Assessment ID) किंवा आधार क्रमांक टाका.",
        "थकबाकी व ५% सवलत तपासा.",
        "ऑनलाइन पेमेंट (UPI/कार्ड) द्वारे कर भरा व रसीद डाऊनलोड करा."
      ],
      hi: [
        "संपत्ति एवं जल कर अनुभाग में जाएँ।",
        "अपनी संपत्ति आईडी दर्ज करें।",
        "यूपीआई या कार्ड द्वारा ऑनलाइन भुगतान करें।"
      ]
    },
    documents: {
      en: [
        "Property Index II / City Survey Number",
        "Previous Year Tax Receipt (for reference)",
        "Assessment ID"
      ],
      mr: [
        "मालमत्ता निर्देशांक २ / सिटी सर्व्हे नंबर",
        "मागील वर्षाची कर रसीद",
        "असेसमेंट आयडी"
      ],
      hi: ["प्रॉपर्टी इंडेक्स नंबर", "पिछली टैक्स रसीद"]
    },
    sla: {
      en: "Instant Receipt Generation | Prompt Payment Discount: 5% Active until July 31st",
      mr: "तत्काळ संगणकीय रसीद | ३१ जुलैपर्यंत ५% सवलत लागू",
      hi: "तत्काल रसीद | 31 जुलाई तक 5% छूट"
    },
    actions: [
      { label: "💳 Pay Property Tax Now", tab: "tax" }
    ]
  },

  REGISTER_COMPLAINT: {
    title: {
      en: "Citizen Grievance Redressal (72-Hour SLA)",
      mr: "नागरिक तक्रार निवारण (३-दिवसीय SLA प्रणाली)",
      hi: "नागरिक शिकायत पंजीकरण (72-घंटे SLA)"
    },
    intro: {
      en: "File public grievances for potholes, garbage overflow, streetlight failures, or water pipeline leaks with guaranteed 3-day SLA resolution.",
      mr: "खड्डे, साचलेला कचरा, बंद पथदिवे किंवा पाणी गळती या संदर्भातील तक्रारी दाखल करा व ७२ तासांच्या आत निवारण मिळवा.",
      hi: "कचरा, गड्ढे, स्ट्रीटलाइट या पानी की पाइपलाइन लीकेज की शिकायत दर्ज करें।"
    },
    steps: {
      en: [
        "Open Grievances & Complaints tab.",
        "Select category (Garbage, Road Pothole, Water Leak, Streetlight, Drainage).",
        "Select your Municipal Ward Number (Wards 1 to 28).",
        "Enter exact landmark location and problem description.",
        "Upload a photo of the incident (AI will verify category).",
        "Submit ticket to trigger automatic assignment to Ward Sanitation Engineer."
      ],
      mr: [
        "तक्रार निवारण विभागात जा.",
        "तक्रारीचा प्रकार व प्रभाग क्रमांक निवडा.",
        "घटनास्थळ व समस्येचे वर्णन लिहा.",
        "फोटो अपलोड करा व तक्रार नोंदवा."
      ],
      hi: [
        "शिकायत अनुभाग खोलें।",
        "श्रेणी और वार्ड चुनें।",
        "फोटो अपलोड करें और सबमिट करें।"
      ]
    },
    documents: {
      en: ["Geo-tagged Incident Photograph", "Location Landmark"],
      mr: ["समस्येचा फोटो", "ठिकाणाचा खूण रस्ता"],
      hi: ["घटना का फोटो", "स्थान का लैंडमार्क"]
    },
    sla: {
      en: "Guaranteed SLA Resolution: 72 Hours | Auto-Escalation to Chief Officer after 3 days",
      mr: "SLA मुदत: ७२ तास | ३ दिवसांनंतर मुख्य अधिकाऱ्यांकडे ऑटो-एसकेलेशन",
      hi: "SLA समय सीमा: 72 घंटे"
    },
    actions: [
      { label: "🚨 Register Grievance Ticket", tab: "complaints" }
    ]
  },

  TRACK_COMPLAINT: {
    title: {
      en: "Track Active Ticket Status",
      mr: "तक्रार निवारण स्थिती तपासा",
      hi: "शिकायत स्थिति की जाँच करें"
    },
    intro: {
      en: "You can track the live SLA progress of your submitted grievance tickets and inspect officer resolution certificates.",
      mr: "तुमच्या नोंदवलेल्या तक्रारीची सद्यस्थिती व अधिकारी रिझोल्यूशन रिपोर्ट तपासा.",
      hi: "अपनी दर्ज शिकायतों की लाइव स्थिति देखें।"
    },
    steps: {
      en: [
        "Open Complaints Directory.",
        "Locate your Ticket ID (e.g. KPG-2026-1042).",
        "Check SLA countdown timer and assigned Field Officer details.",
        "Download official Resolution Certificate once status changes to Resolved."
      ],
      mr: [
        "तक्रारींच्या यादीत जा.",
        "तक्रार आयडी (उदा. KPG-2026-1042) शोधा.",
        "अधिकारी व SLA टाइमर तपासा."
      ],
      hi: ["शिकायत डायरेक्टरी खोलें।", "अपनी शिकायत आईडी खोजें।"]
    },
    documents: { en: ["Ticket ID"], mr: ["तक्रार आयडी"], hi: ["टिकट आईडी"] },
    sla: { en: "Live Real-Time Telemetry Tracking", mr: "रिअल-टाइम ट्रॅकिंग", hi: "रियल टाइम ट्रैकिंग" },
    actions: [
      { label: "📍 Open Grievance Directory", tab: "complaints" }
    ]
  },

  HOSPITALS: {
    title: {
      en: "Kopargaon Hospitals & Emergency Care",
      mr: "कोपरगाव रुग्णालये व आणीबाणी आरोग्य सेवा",
      hi: "कोपरगांव अस्पताल एवं आपातकालीन चिकित्सा"
    },
    intro: {
      en: "Kopargaon is equipped with government sub-district civil hospitals and 24x7 emergency medical centers.",
      mr: "कोपरगाव शहरात उपजिल्हा शासकीय रुग्णालय व चोवीस तास आपत्कालीन आरोग्य सुविधा उपलब्ध आहेत.",
      hi: "कोपरगांव में उप-जिला सिविल अस्पताल और 24x7 चिकित्सा केंद्र उपलब्ध हैं।"
    },
    steps: {
      en: [
        "Civil Sub-District Hospital: Station Road (📞 02423-222340)",
        "Sanjeevani Super Specialty Hospital: Yeola Naka (📞 02423-224100)",
        "Rural Health Center: Mahatma Phule Nagar (📞 02423-223120)",
        "Government Ambulance / Emergency Medical Response: Dial 108"
      ],
      mr: [
        "उपजिल्हा शासकीय रुग्णालय: स्टेशन रोड (📞 ०२४२३-२२२३४०)",
        "संजीवनी सुपर स्पेशालिटी हॉस्पिटल: येवला नाका (📞 ०२४२३-२२४१००)",
        "सरकारी रुग्णवाहिका: १०८ डायल करा"
      ],
      hi: [
        "उप-जिला नागरिक अस्पताल: स्टेशन रोड (02423-222340)",
        "संजीवनी अस्पताल: येवला नाका (02423-224100)",
        "सरकारी एम्बुलेंस: 108 पर कॉल करें"
      ]
    },
    documents: { en: ["Aadhaar / Health Insurance Card"], mr: ["आधार कार्ड / आरोग्य विमा कार्ड"], hi: ["आधार कार्ड"] },
    sla: { en: "24x7 Emergency Casualty Service Active", mr: "२४ तास आपत्कालीन कक्ष सुरू", hi: "24x7 आपातकालीन सेवा" },
    actions: [
      { label: "🗺 Locate Hospitals on GIS Map", tab: "dashboard" }
    ]
  },

  POLICE: {
    title: {
      en: "Kopargaon Police & Law Enforcement",
      mr: "कोपरगाव पोलीस ठाणे व सुरक्षा",
      hi: "कोपरगांव पुलिस स्टेशन एवं कानून व्यवस्था"
    },
    intro: {
      en: "Kopargaon Police Stations maintain round-the-clock patrol and emergency citizen response.",
      mr: "कोपरगाव शहर व ग्रामीण पोलीस ठाणे २४ तास नागरिकांच्या सुरक्षिततेसाठी तत्पर आहेत.",
      hi: "कोपरगांव पुलिस स्टेशन नागरिकों की सुरक्षा के लिए 24 घंटे सक्रिय है।"
    },
    steps: {
      en: [
        "Kopargaon City Police Station: Station Chowk, Ward 4 (📞 02423-222233)",
        "Kopargaon Taluka Rural Police Station: Shirdi Highway Naka (📞 02423-222455)",
        "National Emergency Hotline: Dial 112 / 100",
        "Women's Safety Helpline: Dial 1091"
      ],
      mr: [
        "कोपरगाव शहर पोलीस स्टेशन: स्टेशन चौक (📞 ०२४२३-२२२२३३)",
        "कोपरगाव तालुका ग्रामीण पोलीस स्टेशन: शिर्डी हायवे (📞 ०२४२३-२२२४५५)",
        "राष्ट्रीय आणीबाणी क्रमांक: ११२ डायल करा"
      ],
      hi: [
        "शहर पुलिस स्टेशन: स्टेशन चौक (02423-222233)",
        "ग्रामीण पुलिस स्टेशन: शिर्डी हाईवे (02423-222455)",
        "आपातकालीन नंबर: 112 पर कॉल करें"
      ]
    },
    documents: { en: ["ID Proof"], mr: ["ओळखपत्र"], hi: ["पहचान पत्र"] },
    sla: { en: "Immediate Emergency Dispatch Response", mr: "त्वरित प्रतिसाद", hi: "त्वरित रिस्पांस" },
    actions: [
      { label: "🚨 Emergency Directory", tab: "emergency_page" },
      { label: "🗺 Locate Police Stations on Map", tab: "dashboard" }
    ]
  },

  EMERGENCY_SERVICES: {
    title: {
      en: "24x7 Municipal & Disaster Helpline Directory",
      mr: "२४ तास आपत्कालीन व आपत्ती व्यवस्थापन हेल्पलाइन",
      hi: "24x7 आपातकालीन एवं आपदा प्रबंधन हेल्पलाइन"
    },
    intro: {
      en: "Access verified emergency contact numbers for Municipal Command Center, Fire Brigade, Police, Ambulance, and Disaster Control.",
      mr: "नगर परिषद कमांड सेंटर, अग्निशामक दल, पोलीस व रुग्णवाहिका यांचे त्वरित संपर्क क्रमांक.",
      hi: "नगर निगम कमांड सेंटर, फायर ब्रिगेड, पुलिस और एम्बुलेंस के नंबर।"
    },
    steps: {
      en: [
        "KMC Central Toll-Free Helpline: 1800-233-1042",
        "Municipal Fire Brigade: Dial 101 / 02423-222101",
        "Police Control Room: Dial 112 / 02423-222233",
        "Ambulance Service: Dial 108",
        "Disaster Management Helpline: 02423-223000"
      ],
      mr: [
        "नगर परिषद टोल-फ्री क्रमांक: १८००-२३३-१०४२",
        "अग्निशामक दल: १०१ / ०२४२३-२२२१०१",
        "पोलीस नियंत्रण कक्ष: ११२ / ०२४२३-२२२२३३",
        "रुग्णवाहिका: १०८"
      ],
      hi: [
        "नगर निगम टोल-फ्री नंबर: 1800-233-1042",
        "फायर ब्रिगेड: 101",
        "पुलिस नियंत्रण कक्ष: 112",
        "एम्बुलेंस: 108"
      ]
    },
    documents: { en: ["N/A"], mr: ["लागू नाही"], hi: ["लागू नहीं"] },
    sla: { en: "Instant 24x7 Telephone Support", mr: "२४ तास दूरध्वनी सेवा", hi: "24x7 टेलीफोन सपोर्ट" },
    actions: [
      { label: "📞 View Emergency Directory", tab: "emergency_page" }
    ]
  },

  MUNICIPAL_OFFICE: {
    title: {
      en: "Kopargaon Municipal Council Headquarters",
      mr: "कोपरगाव नगर परिषद मुख्यालय",
      hi: "कोपरगांव नगर परिषद मुख्यालय"
    },
    intro: {
      en: "Official address, working hours, and departmental contact information for Kopargaon Municipal Council.",
      mr: "कोपरगाव नगर परिषदेचा अधिकृत पत्ता, कामकाजाची वेळ व संपर्क तपशील.",
      hi: "कोपरगांव नगर परिषद का पता, समय और संपर्क जानकारी।"
    },
    steps: {
      en: [
        "Address: Municipal Chowk, Near Post Office, Kopargaon, Dist. Ahilyanagar - 423601",
        "Working Hours: 09:45 AM to 06:15 PM (Monday to Saturday, closed 2nd & 4th Saturday)",
        "Citizen Facilitation Center (CFC): Counter 1 to 6 (Open 10:00 AM - 05:00 PM)",
        "Email Contact: chief.officer@kopargaon.gov.in"
      ],
      mr: [
        "पत्ता: नगर परिषद चौक, पोस्ट ऑफिस जवळ, कोपरगाव, जि. अहिल्यानगर - ४२३६०१",
        "कामकाजाची वेळ: सकाळी ०९:४५ ते सायंकाळी ०६:१५ (सोमवार ते शनिवार)",
        "नागरी सुविधा केंद्र (CFC): काउंटर १ ते ६ (सकाळी १० ते सायं ५)",
        "ईमेल: chief.officer@kopargaon.gov.in"
      ],
      hi: [
        "पता: नगर परिषद चौक, कोपरगांव - 423601",
        "समय: सुबह 09:45 से शाम 06:15 तक"
      ]
    },
    documents: { en: ["N/A"], mr: ["लागू नाही"], hi: ["लागू नहीं"] },
    sla: { en: "Standard Municipal Office Hours Active", mr: "शासकीय कार्यालयीन वेळ", hi: "कार्यालयीन समय" },
    actions: [
      { label: "🗺 View Municipal Office on Map", tab: "dashboard" }
    ]
  }
};

/**
 * Intent Classifier Engine
 * Inspects query string + previous context to determine user intent.
 */
export const detectUserIntent = (queryText, previousContext = null) => {
  const q = queryText.toLowerCase().trim();

  // Handle follow-up context keywords (e.g. "What documents are required?", "How long does it take?", "What is the fee?")
  const isFollowUp = 
    q.includes('document') || 
    q.includes('paper') || 
    q.includes('fee') || 
    q.includes('charge') || 
    q.includes('cost') || 
    q.includes('time') || 
    q.includes('duration') || 
    q.includes('how long') || 
    q.includes('step') || 
    q.includes('process');

  if (isFollowUp && previousContext && KNOWLEDGE_BASE[previousContext]) {
    return { intent: previousContext, isFollowUp: true };
  }

  // Primary Intent Mapping Rules
  if (q.includes('building') || q.includes('permit') || q.includes('construct') || q.includes('house permission') || q.includes('permission')) {
    return { intent: INTENTS.BUILDING_PERMIT, isFollowUp: false };
  }
  if (q.includes('property tax') || q.includes('house tax') || q.includes('tax due') || q.includes('tax discount')) {
    return { intent: INTENTS.PROPERTY_TAX, isFollowUp: false };
  }
  if (q.includes('complaint') || q.includes('pothole') || q.includes('garbage') || q.includes('drain') || q.includes('grievance') || q.includes('register')) {
    if (q.includes('track') || q.includes('status') || q.includes('ticket')) {
      return { intent: INTENTS.TRACK_COMPLAINT, isFollowUp: false };
    }
    return { intent: INTENTS.REGISTER_COMPLAINT, isFollowUp: false };
  }
  if (q.includes('track') || q.includes('ticket status')) {
    return { intent: INTENTS.TRACK_COMPLAINT, isFollowUp: false };
  }
  if (q.includes('hospital') || q.includes('clinic') || q.includes('doctor') || q.includes('medical')) {
    return { intent: INTENTS.HOSPITALS, isFollowUp: false };
  }
  if (q.includes('police') || q.includes('safety') || q.includes('cop')) {
    return { intent: INTENTS.POLICE, isFollowUp: false };
  }
  if (q.includes('emergency') || q.includes('sos') || q.includes('helpline') || q.includes('phone')) {
    return { intent: INTENTS.EMERGENCY_SERVICES, isFollowUp: false };
  }
  if (q.includes('office') || q.includes('timing') || q.includes('address') || q.includes('headquarter')) {
    return { intent: INTENTS.MUNICIPAL_OFFICE, isFollowUp: false };
  }

  return { intent: INTENTS.UNKNOWN, isFollowUp: false };
};

/**
 * Formats a Knowledge Base Entry into a structured response object.
 */
export const formatIntentResponse = (intentKey, lang = 'en', isFollowUp = false) => {
  const data = KNOWLEDGE_BASE[intentKey];
  if (!data) return null;

  const title = data.title[lang] || data.title.en;
  const intro = data.intro[lang] || data.intro.en;
  const steps = data.steps[lang] || data.steps.en;
  const documents = data.documents[lang] || data.documents.en;
  const sla = data.sla[lang] || data.sla.en;

  let text = '';

  if (isFollowUp) {
    text = `📋 **Required Documents & Service Details for ${title}**:\n\n`;
    text += `**Mandatory Documents Checklist**:\n`;
    documents.forEach(doc => {
      text += `• ${doc}\n`;
    });
    text += `\n**Processing SLA & Fees**:\n${sla}\n\n`;
    text += `**Next Steps**:\n`;
    steps.slice(0, 4).forEach((step, idx) => {
      text += `${idx + 1}. ${step}\n`;
    });
  } else {
    text = `🏛 **${title}**\n\n${intro}\n\n`;
    text += `**General Procedure**:\n`;
    steps.forEach((step, idx) => {
      text += `${idx + 1}. ${step}\n`;
    });

    if (documents && documents.length > 0) {
      text += `\n**Required Documents**:\n`;
      documents.forEach(doc => {
        text += `• ${doc}\n`;
      });
    }

    if (sla) {
      text += `\n**Processing Time & Fees**:\n${sla}\n`;
    }
  }

  return {
    text,
    actions: data.actions || []
  };
};
