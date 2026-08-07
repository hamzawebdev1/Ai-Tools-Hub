import { AITool } from "../../types";

export const QRTOOLS: AITool[] = [
  {
    id: "qr-generator",
    slug: "qr-generator",
    name: "Custom QR Code Generator",
    tagline: "Generate high-res vector & image QR codes with colors and custom sizing.",
    description: "Custom QR Code Generator - Generate high-res QR codes for URLs, text, or data. Fast, high-precision processing running 100% locally in your browser.",
    category: "qr",
    iconName: "QrCode",
    tags: ["qr", "qr generator", "url qr", "online tool", "free utility"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2500,
    usageCount: 95000,
    inputLabel: "URL or Content to Encode:",
    inputPlaceholder: "https://example.com",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Custom QR Code Generator - Free High-Res Vector QR Tool",
      metaDescription: "Generate custom high-resolution QR codes with background/foreground colors, custom sizing, and instant PNG downloads.",
      overview: "Custom QR Code Generator is built to deliver instant, high-precision QR encoding directly inside your browser without any server logging.",
      useCases: [
        "Create website link QR codes for print flyers, menus, and business cards",
        "Generate custom colored QR codes matching your brand design",
        "High-density data encoding with custom error correction settings",
        "Download print-ready high-resolution PNG image files"
      ],
      keyFeatures: [
        "Client-side instant generation",
        "Custom foreground & background color picker",
        "Adjustable canvas sizing (150px to 600px)",
        "Zero tracking or URL expiration"
      ],
      howToUseSteps: [
        "Enter your target URL or plain text in the input box.",
        "Adjust size, foreground color, and background color.",
        "Click Download Code to save your high-resolution QR image."
      ],
      faqs: [
        { question: "Do these QR codes ever expire?", answer: "No, these are static QR codes generated directly from your input string and will never expire." },
        { question: "Is my data stored on a server?", answer: "No, generation happens entirely in your local browser using client JavaScript." }
      ]
    }
  },
  {
    id: "qr-wifi",
    slug: "qr-wifi",
    name: "WiFi Network QR Code",
    tagline: "Generate instant scan QR code for automatic WiFi connection.",
    description: "WiFi Network QR Code - Generate instant scan QR code for WiFi network joining. Guests can scan to connect without typing passwords.",
    category: "qr",
    iconName: "Wifi",
    tags: ["qr", "wifi qr", "network qr", "connect wifi", "free utility"],
    isTrending: true,
    isPopular: true,
    rating: 4.8,
    ratingCount: 1890,
    usageCount: 68000,
    inputLabel: "WiFi Credentials:",
    inputPlaceholder: "Enter Network Name (SSID) and Password...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "WiFi Network QR Code Generator - Instant Connect QR Code",
      metaDescription: "Create WiFi QR codes for home or office networks. Scan to connect automatically on iOS and Android devices.",
      overview: "WiFi QR Code Generator formats network SSID and password using standard WIFI: protocol strings for seamless auto-join on mobile devices.",
      useCases: [
        "Provide quick guest WiFi access in coffee shops, hotels, and offices",
        "Print WiFi connection cards for visitors at home",
        "Avoid sharing written WiFi passwords verbally"
      ],
      keyFeatures: [
        "Supports WPA/WPA2, WEP, and Open unencrypted networks",
        "Option to mark network as Hidden SSID",
        "Instant smartphone camera scanning and auto-connect support",
        "100% private - passwords never leave your browser"
      ],
      howToUseSteps: [
        "Enter your WiFi Network Name (SSID).",
        "Type the WiFi password and select security type (WPA/WPA2/WEP/Open).",
        "Download or print the generated QR code for immediate guest use."
      ],
      faqs: [
        { question: "Does this store my WiFi password?", answer: "No, the QR string is created locally in your browser canvas. No server ever sees your password." },
        { question: "Does it work on iPhone and Android?", answer: "Yes, standard iOS and Android camera apps natively scan WiFi QR codes." }
      ]
    }
  },
  {
    id: "qr-vcard",
    slug: "qr-vcard",
    name: "vCard Contact QR Code",
    tagline: "Generate digital business card QR codes for phone address books.",
    description: "vCard Contact QR Code - Generate digital business card QR codes containing name, phone, email, organization, job title, and website.",
    category: "qr",
    iconName: "Contact",
    tags: ["qr", "vcard qr", "business card", "contact qr", "free utility"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 1980,
    usageCount: 72000,
    inputLabel: "Contact Information:",
    inputPlaceholder: "Name, Phone, Email, Company, Title...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "vCard Contact QR Code Generator - Digital Business Card",
      metaDescription: "Generate vCard 3.0 digital business card QR codes. Allow contacts to save your details to iOS or Android address books instantly.",
      overview: "vCard Contact QR Code encodes structured MECARD / vCard contact format for instant address book import when scanned.",
      useCases: [
        "Add digital contact QR codes to printed business cards",
        "Share professional contact info during networking conferences",
        "Include vCard QR code in resume or email signature"
      ],
      keyFeatures: [
        "Encodes Full Name, Phone, Email, Company, Title, and Website URL",
        "Native 'Add to Contacts' prompt on smartphone cameras",
        "High error-correction support for print durability"
      ],
      howToUseSteps: [
        "Fill out your contact fields (Name, Phone, Email, Company, Job Title).",
        "View the live rendered vCard QR code.",
        "Download PNG image to print on business cards or presentation slides."
      ],
      faqs: [
        { question: "What happens when someone scans the vCard QR code?", answer: "Their phone opens a prompt to save a new contact directly into their address book." }
      ]
    }
  },
  {
    id: "qr-email",
    slug: "qr-email",
    name: "Email Mailto QR Code",
    tagline: "Generate QR code that launches email client with prefilled subject & body.",
    description: "Email Mailto QR Code - Create QR code that automatically opens the user's email client addressed to your email with optional prefilled subject and message body.",
    category: "qr",
    iconName: "Mail",
    tags: ["qr", "email qr", "mailto qr", "contact qr"],
    rating: 4.7,
    ratingCount: 1240,
    usageCount: 41000,
    inputLabel: "Email Recipient & Message:",
    inputPlaceholder: "Enter recipient email, subject, and optional message...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Email QR Code Generator - Prefilled Mailto QR Code",
      metaDescription: "Generate email QR codes that open prefilled mailto messages when scanned on smartphones.",
      overview: "Email QR Code Generator creates mailto formatted QR codes for feedback collection, inquiries, and customer support.",
      useCases: [
        "Product feedback QR codes on packaging",
        "Event RSVP email submission",
        "Customer support inquiry link"
      ],
      keyFeatures: ["Prefills recipient, subject line, and body", "Works with Apple Mail, Gmail, Outlook"],
      howToUseSteps: ["Enter recipient email.", "Optionally enter prefilled subject line.", "Download QR image."],
      faqs: [{ question: "Does it work on desktop and mobile?", answer: "Yes, scanning on any camera opens the default email client." }]
    }
  },
  {
    id: "qr-sms",
    slug: "qr-sms",
    name: "SMS Message QR Code",
    tagline: "Generate QR code that opens text messaging app with prefilled SMS text.",
    description: "SMS Message QR Code - Scan to open text messaging app addressed to a specified phone number with pre-written text message.",
    category: "qr",
    iconName: "MessageSquare",
    tags: ["qr", "sms qr", "text message qr"],
    rating: 4.8,
    ratingCount: 1350,
    usageCount: 45000,
    inputLabel: "Phone Number & SMS Message:",
    inputPlaceholder: "+1234567890",
    optionsConfig: {},
    seoContent: {
      metaTitle: "SMS QR Code Generator - Prefilled Text Message QR Code",
      metaDescription: "Create SMS QR codes to allow customers or visitors to send prefilled text messages with a single scan.",
      overview: "SMS QR Code Generator uses SMSTO: standard format for seamless text message initiation.",
      useCases: ["Opt-in marketing SMS subscriptions", "Real estate property inquiry via text", "Emergency alert / check-in text"],
      keyFeatures: ["Prefills phone number and message body", "Works across all mobile OS platforms"],
      howToUseSteps: ["Enter destination phone number.", "Enter default SMS text message.", "Download QR code."],
      faqs: [{ question: "Is SMS sent automatically?", answer: "No, the user's messaging app opens with text prefilled so they can review and tap send." }]
    }
  },
  {
    id: "qr-phone",
    slug: "qr-phone",
    name: "Phone Call QR Code",
    tagline: "Generate QR code that dials a phone number automatically when scanned.",
    description: "Phone Call QR Code - Create a QR code encoding TEL protocol string for one-tap phone calls.",
    category: "qr",
    iconName: "Phone",
    tags: ["qr", "phone qr", "dialer qr"],
    rating: 4.7,
    ratingCount: 1100,
    usageCount: 38000,
    inputLabel: "Phone Number to Dial:",
    inputPlaceholder: "+1 (555) 019-2834",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Phone Call QR Code Generator - One-Tap Phone Dialer QR",
      metaDescription: "Generate phone dialer QR codes for business cards, banners, and storefront displays.",
      overview: "Phone Call QR Code encodes tel: scheme for immediate phone dialing.",
      useCases: ["Storefront phone call QR code", "Customer hotline banner link", "Print catalog contact number"],
      keyFeatures: ["Supports international format (+ country code)", "One-tap dialing on iOS and Android"],
      howToUseSteps: ["Type phone number.", "Download generated QR code."],
      faqs: [{ question: "Is international format supported?", answer: "Yes, include '+' and country code." }]
    }
  },
  {
    id: "qr-geo",
    slug: "qr-geo",
    name: "Geolocation QR Code",
    tagline: "Generate QR code with GPS coordinates or Google Maps location link.",
    description: "Geolocation QR Code - Encode latitude and longitude coordinates or Google Maps location link to open map navigation when scanned.",
    category: "qr",
    iconName: "MapPin",
    tags: ["qr", "geo qr", "map location qr", "gps qr"],
    rating: 4.8,
    ratingCount: 1420,
    usageCount: 49000,
    inputLabel: "GPS Coordinates or Location Link:",
    inputPlaceholder: "Latitude, Longitude or Google Maps URL...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Geolocation QR Code Generator - Map Location QR Code",
      metaDescription: "Create GPS location QR codes that open Apple Maps or Google Maps for navigation.",
      overview: "Geolocation QR Code uses geo: URI scheme or Google Maps links for location navigation.",
      useCases: ["Event venue directions", "Store location map on marketing flyers", "Tourist landmark info"],
      keyFeatures: ["Supports geo: latitude,longitude and Google Maps URLs", "Direct camera navigation open"],
      howToUseSteps: ["Enter latitude & longitude or Google Maps link.", "Download QR code."],
      faqs: [{ question: "Does it open Google Maps?", answer: "Yes, scanning opens Apple Maps or Google Maps based on device default." }]
    }
  },
  {
    id: "qr-crypto",
    slug: "qr-crypto",
    name: "Crypto Payment QR Code",
    tagline: "Generate Bitcoin, Ethereum, and USDT crypto payment QR codes.",
    description: "Crypto Payment QR Code - Create crypto payment QR codes for Bitcoin, Ethereum, Solana, and USDT wallet addresses.",
    category: "qr",
    iconName: "Wallet",
    tags: ["qr", "crypto qr", "bitcoin qr", "ethereum qr", "usdt qr"],
    rating: 4.9,
    ratingCount: 1650,
    usageCount: 59000,
    inputLabel: "Wallet Address & Amount:",
    inputPlaceholder: "0x... or 1BvBM...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Crypto Payment QR Code Generator - BTC ETH USDT QR",
      metaDescription: "Generate Bitcoin, Ethereum, and crypto payment QR codes with wallet addresses and optional payment amounts.",
      overview: "Crypto Payment QR Code creates standard crypto payment strings for instant wallet scanning.",
      useCases: ["Accept crypto payments in retail store", "Tip jar crypto wallet link", "Invoicing crypto payments"],
      keyFeatures: ["Supports BTC, ETH, USDT, SOL, and custom tokens", "Encodes wallet URI scheme"],
      howToUseSteps: ["Select cryptocurrency type.", "Enter wallet address and optional amount.", "Download payment QR code."],
      faqs: [{ question: "Is this compatible with Coinbase/MetaMask/Phantom?", answer: "Yes, standard crypto wallet apps natively scan these payment QR codes." }]
    }
  },
  {
    id: "qr-event",
    slug: "qr-event",
    name: "Event & Calendar QR Code",
    tagline: "Generate event QR codes that save appointments directly to calendar.",
    description: "Event & Calendar QR Code - Create iCal / vEvent QR code to allow users to add event title, start/end date, location, and details to Google/Apple Calendar.",
    category: "qr",
    iconName: "Calendar",
    tags: ["qr", "event qr", "calendar qr", "ical qr"],
    rating: 4.8,
    ratingCount: 1530,
    usageCount: 52000,
    inputLabel: "Event Details:",
    inputPlaceholder: "Title, Start Date, End Date, Location, Description...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Event Calendar QR Code Generator - Add to Calendar QR",
      metaDescription: "Create event QR codes that add titles, dates, locations, and reminders to phone calendars when scanned.",
      overview: "Event Calendar QR Code encodes standard VEVENT format for seamless calendar appointment creation.",
      useCases: ["Conference schedule QR cards", "Wedding invitation save-the-date", "Concert/workshop reminder"],
      keyFeatures: ["Encodes Event Title, Start/End Time, Location, and Description", "Native Add to Calendar action"],
      howToUseSteps: ["Fill in event details.", "Download event QR code."],
      faqs: [{ question: "Works on iPhone and Android?", answer: "Yes, both native cameras recognize vEvent calendar entries." }]
    }
  },
  {
    id: "qr-text",
    slug: "qr-text",
    name: "Plain Text & Secret Note QR Code",
    tagline: "Generate QR codes for text notes, Wi-Fi keys, or secret codes.",
    description: "Plain Text & Secret Note QR Code - Convert long paragraphs, serial keys, passcodes, or instructions into compact QR codes.",
    category: "qr",
    iconName: "FileText",
    tags: ["qr", "text qr", "secret note qr", "note qr"],
    rating: 4.7,
    ratingCount: 1180,
    usageCount: 39000,
    inputLabel: "Plain Text Content:",
    inputPlaceholder: "Type or paste text content...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Plain Text QR Code Generator - Text to QR Code",
      metaDescription: "Encode text messages, serial numbers, passwords, or instructions into plain text QR codes.",
      overview: "Plain Text QR Code generator stores up to 2,000+ characters of plain text directly in the QR matrix.",
      useCases: ["Serial number labeling on equipment", "Secret text messaging", "Printed instructions on product manual"],
      keyFeatures: ["High character limit support", "No internet required to view decoded text"],
      howToUseSteps: ["Paste or enter text.", "Download text QR code."],
      faqs: [{ question: "Do you need internet to scan plain text QR?", answer: "No, plain text QR codes decode offline locally on the scanner device." }]
    }
  },
  {
    id: "qr-whatsapp",
    slug: "qr-whatsapp",
    name: "WhatsApp Message QR Code",
    tagline: "Generate QR code that opens WhatsApp chat with prefilled message.",
    description: "WhatsApp Message QR Code - Create direct link QR codes to open a WhatsApp conversation with prefilled text.",
    category: "qr",
    iconName: "Share2",
    tags: ["qr", "whatsapp qr", "chat qr", "social qr"],
    rating: 4.9,
    ratingCount: 2100,
    usageCount: 84000,
    inputLabel: "WhatsApp Number & Message:",
    inputPlaceholder: "+1234567890",
    optionsConfig: {},
    seoContent: {
      metaTitle: "WhatsApp QR Code Generator - Direct Chat QR Code",
      metaDescription: "Generate WhatsApp QR codes to allow customers to message your WhatsApp Business or personal account with a single scan.",
      overview: "WhatsApp QR Code uses wa.me link formatting to launch WhatsApp chats instantly.",
      useCases: ["WhatsApp Business customer support QR code", "Order inquiry QR on menus and posters"],
      keyFeatures: ["Supports international phone format", "Prefilled message text support"],
      howToUseSteps: ["Enter phone number with country code.", "Enter optional starting message.", "Download QR code."],
      faqs: [{ question: "Works with WhatsApp Business?", answer: "Yes, works seamlessly with both WhatsApp and WhatsApp Business." }]
    }
  },
  {
    id: "barcode-generator",
    slug: "barcode-generator",
    name: "Universal Barcode Generator",
    tagline: "Generate CODE128, EAN-13, UPC-A, CODE39, and ITF barcodes.",
    description: "Universal Barcode Generator - Create high-precision 1D product and logistics barcodes in CODE128, EAN, UPC, and CODE39 standards.",
    category: "qr",
    iconName: "Barcode",
    tags: ["barcode", "barcode generator", "code128", "ean13", "upc", "free utility"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3100,
    usageCount: 110000,
    inputLabel: "Barcode Value / Serial Number:",
    inputPlaceholder: "123456789012",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Universal Barcode Generator - Free Online Barcode Creator",
      metaDescription: "Generate high-resolution CODE128, EAN-13, UPC-A, and CODE39 barcodes for product packaging and inventory management.",
      overview: "Universal Barcode Generator uses client JS rendering to produce sharp SVG and PNG barcode graphics for print.",
      useCases: [
        "Retail product GTIN/UPC barcode packaging",
        "Inventory tracking and warehouse bin labels",
        "Library card and asset barcode tags"
      ],
      keyFeatures: [
        "Supports CODE128, EAN-13, UPC-A, CODE39, and ITF-14 standards",
        "Instant SVG/PNG rendering with crisp lines",
        "Human readable text toggle",
        "100% free with unlimited generation"
      ],
      howToUseSteps: [
        "Select desired barcode standard format.",
        "Enter product code or serial digits.",
        "Download vector SVG or PNG barcode image."
      ],
      faqs: [
        { question: "Can I use these barcodes for commercial products?", answer: "Yes, as long as you own or hold valid registered GS1/UPC numbers." }
      ]
    }
  },
  {
    id: "barcode-code128",
    slug: "barcode-code128",
    name: "CODE128 Barcode Generator",
    tagline: "Generate high-density CODE128 shipping & logistics barcodes.",
    description: "CODE128 Barcode Generator - Create universal CODE128 barcodes supporting numbers, letters, and ASCII characters.",
    category: "qr",
    iconName: "Barcode",
    tags: ["barcode", "code128", "shipping barcode", "logistics barcode"],
    rating: 4.8,
    ratingCount: 1750,
    usageCount: 62000,
    inputLabel: "CODE128 Payload:",
    inputPlaceholder: "TRACK123456789",
    optionsConfig: {},
    seoContent: {
      metaTitle: "CODE128 Barcode Generator - Shipping & Logistics Barcode",
      metaDescription: "Generate high-density CODE128 barcodes for tracking numbers, shipping labels, and inventory tags.",
      overview: "CODE128 is the industry standard for logistics, shipping labels, and asset identification.",
      useCases: ["Shipping container tracking labels", "Employee ID badges", "Asset management tags"],
      keyFeatures: ["Supports full ASCII character set", "High encoding efficiency"],
      howToUseSteps: ["Enter alphanumeric payload.", "Download barcode."],
      faqs: [{ question: "Does CODE128 support letters and numbers?", answer: "Yes, CODE128 supports uppercase/lowercase letters, digits, and punctuation." }]
    }
  },
  {
    id: "barcode-ean13",
    slug: "barcode-ean13",
    name: "EAN-13 Retail Barcode Generator",
    tagline: "Generate 13-digit EAN retail product barcodes.",
    description: "EAN-13 Retail Barcode Generator - Create standard 13-digit European Article Number (EAN-13) barcodes for global retail products.",
    category: "qr",
    iconName: "Barcode",
    tags: ["barcode", "ean13", "retail barcode", "product barcode"],
    rating: 4.8,
    ratingCount: 1620,
    usageCount: 58000,
    inputLabel: "13-Digit EAN Number:",
    inputPlaceholder: "4006381333931",
    optionsConfig: {},
    seoContent: {
      metaTitle: "EAN-13 Barcode Generator - Global Retail Barcode",
      metaDescription: "Generate official 13-digit EAN barcodes for products sold worldwide outside North America.",
      overview: "EAN-13 barcodes are used on retail items globally.",
      useCases: ["Consumer product packaging", "Book ISBN conversion"],
      keyFeatures: ["Automatic 13th checksum digit verification", "Crisp barcode line rendering"],
      howToUseSteps: ["Enter 12 or 13 digit EAN code.", "Download barcode."],
      faqs: [{ question: "What if I enter 12 digits?", answer: "The tool automatically calculates and appends the 13th check digit." }]
    }
  },
  {
    id: "barcode-upca",
    slug: "barcode-upca",
    name: "UPC-A Product Barcode Generator",
    tagline: "Generate 12-digit UPC product barcodes for USA & Canada.",
    description: "UPC-A Product Barcode Generator - Create 12-digit Universal Product Code (UPC-A) barcodes for retail items in North America.",
    category: "qr",
    iconName: "Barcode",
    tags: ["barcode", "upca", "upc barcode", "retail barcode"],
    rating: 4.9,
    ratingCount: 1840,
    usageCount: 69000,
    inputLabel: "12-Digit UPC Number:",
    inputPlaceholder: "012345678905",
    optionsConfig: {},
    seoContent: {
      metaTitle: "UPC-A Barcode Generator - USA Retail Product Barcode",
      metaDescription: "Generate official 12-digit UPC-A barcodes for retail products sold in North America.",
      overview: "UPC-A is the standard retail barcode format used across stores in the US and Canada.",
      useCases: ["Retail store product packaging", "Amazon / Walmart inventory labeling"],
      keyFeatures: ["12-digit standard verification", "High-res PNG and SVG download"],
      howToUseSteps: ["Type 11 or 12 digit UPC code.", "Download barcode image."],
      faqs: [{ question: "Is UPC-A used in the US?", answer: "Yes, UPC-A is the primary retail barcode system in the United States and Canada." }]
    }
  },
  {
    id: "barcode-code39",
    slug: "barcode-code39",
    name: "CODE39 Industrial Barcode Generator",
    tagline: "Generate CODE39 barcodes for industrial & automotive labeling.",
    description: "CODE39 Industrial Barcode Generator - Create variable length alphanumeric barcodes widely used in automotive, defense, and healthcare.",
    category: "qr",
    iconName: "Barcode",
    tags: ["barcode", "code39", "industrial barcode"],
    rating: 4.7,
    ratingCount: 1290,
    usageCount: 44000,
    inputLabel: "CODE39 Payload:",
    inputPlaceholder: "PART-98234",
    optionsConfig: {},
    seoContent: {
      metaTitle: "CODE39 Barcode Generator - Industrial & Automotive Barcode",
      metaDescription: "Generate CODE39 barcodes for industrial parts tracking, badges, and inventory.",
      overview: "CODE39 is a discrete barcode symbology supporting uppercase letters, digits, and basic symbols.",
      useCases: ["Automotive part identification", "Department of Defense labeling", "Healthcare ID tags"],
      keyFeatures: ["Supports uppercase A-Z, 0-9, and space - . $ / + %", "Self-checking barcode standard"],
      howToUseSteps: ["Enter alphanumeric code.", "Download CODE39 barcode."],
      faqs: [{ question: "Does CODE39 support lowercase letters?", answer: "Standard CODE39 uses uppercase characters. Lowercase letters are automatically capitalized." }]
    }
  },
  {
    id: "qr-scanner",
    slug: "qr-scanner",
    name: "QR Code Reader & Scanner",
    tagline: "Scan and decode QR codes and barcodes from images or webcam.",
    description: "QR Code Reader & Scanner - Upload image files or use your camera to scan and decode QR codes and 1D barcodes instantly.",
    category: "qr",
    iconName: "Camera",
    tags: ["qr", "qr scanner", "barcode scanner", "decode qr", "free utility"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2800,
    usageCount: 89000,
    inputLabel: "Upload QR/Barcode Image:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "QR Code Reader & Scanner - Online QR & Barcode Decoder",
      metaDescription: "Scan and decode QR codes and barcodes from image files or device camera directly in your web browser.",
      overview: "QR Code Reader & Scanner decodes QR matrixes and 1D barcodes locally in client memory.",
      useCases: [
        "Inspect hidden URLs embedded in suspicious QR codes before opening",
        "Extract raw text or WiFi passwords from saved QR screenshots",
        "Decode product barcodes from photo upload"
      ],
      keyFeatures: [
        "100% client-side privacy - image files stay on your device",
        "Supports JPG, PNG, WEBP image formats",
        "One-click copy decoded URL or text"
      ],
      howToUseSteps: [
        "Upload a picture containing a QR code or barcode.",
        "View decoded content immediately in the output box.",
        "Click Copy to save the extracted text or URL."
      ],
      faqs: [
        { question: "Are my uploaded photos sent to a server?", answer: "No, image decoding is executed entirely inside your browser JavaScript engine." }
      ]
    }
  }
];
