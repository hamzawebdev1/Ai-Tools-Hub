import { AITool } from '../../types';

export const IMAGETOOLS: AITool[] = [
  // 1. Image Compressor
  {
    id: "image-compress",
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Shrink image file size in megabytes while keeping crisp visual quality.",
    description: "Compress JPG, PNG, WEBP, and AVIF image files with customizable quality level, real-time preview, and size savings calculator.",
    category: "image",
    iconName: "Image",
    tags: ["image", "compress", "shrink", "optimize", "photo"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2450,
    usageCount: 128000,
    inputLabel: "Upload Image for Compression:",
    inputPlaceholder: "Select or drop image files to compress...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Compressor - Compress JPG, PNG, WEBP Free Online",
      metaDescription: "Compress image file sizes online for free. Shrink PNG, JPG, WEBP, and AVIF files without losing visual clarity. Instant browser processing.",
      overview: "Image Compressor uses client-side canvas re-encoding and quality optimization to dramatically shrink image file sizes without uploading your files to remote servers.",
      useCases: ["Reduce photo size for website performance", "Optimize images for email attachments", "Compress photos for mobile apps", "Save cloud storage space"],
      keyFeatures: ["Custom quality control slider", "Supports PNG, JPG, WEBP, AVIF", "Shows original vs compressed file sizes", "100% private local execution"],
      howToUseSteps: ["Drop or upload your image file.", "Adjust compression quality level.", "Compare preview and download compressed image."],
      faqs: [
        { question: "Is my image uploaded to any server?", answer: "No, processing happens 100% locally in your browser." },
        { question: "Which formats are supported?", answer: "JPG, PNG, WEBP, AVIF, BMP, and GIF." }
      ]
    }
  },

  // 2. Image Resizer
  {
    id: "image-resize",
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Change pixel dimensions of PNG, JPG, and WEBP photos instantly.",
    description: "Resize photo pixel dimensions with lock aspect ratio, resolution presets (4K, 1080p, 720p), and percentage scale slider.",
    category: "image",
    iconName: "Image",
    tags: ["image", "resize", "dimensions", "width", "height"],
    isTrending: true,
    isPopular: true,
    rating: 4.8,
    ratingCount: 3100,
    usageCount: 145000,
    inputLabel: "Upload Image for Resizing:",
    inputPlaceholder: "Select or drop image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Resizer - Change Image Dimensions Free Online",
      metaDescription: "Resize image dimensions online for free. Adjust pixel width and height for JPG, PNG, WEBP, and GIF images instantly.",
      overview: "Resize pixel dimensions accurately with aspect ratio lock or custom dimensions.",
      useCases: ["Resize photos for social media headers", "Fit images to exact pixel specs", "Scale down high-resolution camera photos"],
      keyFeatures: ["Lock aspect ratio toggle", "Preset resolution shortcuts", "Percentage scaler", "High-quality bicubic interpolation"],
      howToUseSteps: ["Upload image.", "Set target width and height.", "Click Process & Download."],
      faqs: [{ question: "Does resizing distort my image?", answer: "Enable 'Maintain Aspect Ratio' to prevent distortion." }]
    }
  },

  // 3. Image Cropper
  {
    id: "image-crop",
    slug: "image-cropper",
    name: "Image Cropper",
    tagline: "Cut out unwanted outer sections and crop fixed aspect ratios.",
    description: "Crop image rectangular boundaries with interactive frame selection, aspect ratio lock (1:1, 16:9, 4:3, 9:16), and angle rotation.",
    category: "image",
    iconName: "Scissors",
    tags: ["image", "crop", "cut", "aspect ratio", "frame"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2890,
    usageCount: 112000,
    inputLabel: "Upload Image to Crop:",
    inputPlaceholder: "Drop image to select crop region...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Cropper - Crop Photos Free Online",
      metaDescription: "Crop images online with custom framing or fixed aspect ratios (1:1, 16:9, 4:3, 9:16). Free client-side photo cropping tool.",
      overview: "Select exact crop coordinates or pick popular aspect ratios to crop photos cleanly.",
      useCases: ["Crop profile avatars", "Frame photos for Instagram & YouTube", "Remove border padding"],
      keyFeatures: ["Interactive crop frame", "Aspect ratio presets", "Rotation prior to cropping", "Clean edge export"],
      howToUseSteps: ["Upload photo.", "Adjust crop frame or select ratio.", "Download cropped photo."],
      faqs: [{ question: "Can I crop to a square 1:1 ratio?", answer: "Yes, select the 1:1 Square aspect ratio preset." }]
    }
  },

  // 4. Image Rotator
  {
    id: "image-rotate",
    slug: "image-rotator",
    name: "Image Rotator",
    tagline: "Spin images 90, 180, or 270 degrees in high quality.",
    description: "Rotate images clockwise, counter-clockwise, 180 degrees, or custom angles with smooth canvas rotation.",
    category: "image",
    iconName: "RefreshCw",
    tags: ["image", "rotate", "spin", "angle", "orientation"],
    isTrending: false,
    isPopular: true,
    rating: 4.7,
    ratingCount: 1980,
    usageCount: 89000,
    inputLabel: "Upload Image to Rotate:",
    inputPlaceholder: "Select image to rotate...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Rotator - Rotate Photos 90, 180, 270 Degrees",
      metaDescription: "Rotate images online for free. Fix sideways photos or adjust orientation instantly.",
      overview: "Correct photo orientation or rotate images by custom angles easily.",
      useCases: ["Fix sideways smartphone photos", "Rotate scanned documents", "Adjust artwork angle"],
      keyFeatures: ["1-click 90° CW and CCW rotation", "180° flip option", "Custom angle slider", "Zero loss rendering"],
      howToUseSteps: ["Upload image.", "Click rotate buttons or set angle slider.", "Download rotated image."],
      faqs: [{ question: "Does rotation degrade quality?", answer: "No, rotation preserves original resolution and clarity." }]
    }
  },

  // 5. Image Flipper
  {
    id: "image-flip",
    slug: "image-flip",
    name: "Image Flipper",
    tagline: "Mirror photos horizontally or vertically in one click.",
    description: "Flip photo orientation horizontally (left-right) or vertically (top-bottom) with 1-click preview.",
    category: "image",
    iconName: "Sliders",
    tags: ["image", "flip", "mirror", "reverse", "invert"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1650,
    usageCount: 67000,
    inputLabel: "Upload Image to Flip:",
    inputPlaceholder: "Select image to flip...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Flipper - Flip Photos Horizontally or Vertically",
      metaDescription: "Flip images horizontally or vertically online for free. Mirror image orientation in 1 click.",
      overview: "Reverse photos left-to-right or upside-down instantly.",
      useCases: ["Unmirror front camera selfies", "Flip graphics for printing", "Create symmetrical layouts"],
      keyFeatures: ["Horizontal flip", "Vertical flip", "Combined double flip", "Instant download"],
      howToUseSteps: ["Upload photo.", "Choose Horizontal or Vertical Flip.", "Export flipped image."],
      faqs: [{ question: "How do I fix mirrored selfie photos?", answer: "Use Horizontal Flip to unmirror selfie photos." }]
    }
  },

  // 6. Image Mirror
  {
    id: "image-mirror",
    slug: "image-mirror",
    name: "Image Mirror Effect",
    tagline: "Create symmetrical horizontal and vertical reflection photos.",
    description: "Apply mirror reflection effects horizontally, vertically, or quad kaleidoscope reflection styles.",
    category: "image",
    iconName: "Layers",
    tags: ["image", "mirror", "reflection", "symmetry", "effect"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1420,
    usageCount: 54000,
    inputLabel: "Upload Image for Mirror Effect:",
    inputPlaceholder: "Select image to create mirror reflection...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Mirror - Create Symmetrical Reflection Photos",
      metaDescription: "Create symmetrical mirror reflection effects on photos online. Free mirror effect tool.",
      overview: "Generate symmetrical mirror reflections horizontally and vertically.",
      useCases: ["Artistic photography reflection", "Symmetrical avatar creation", "Pattern design"],
      keyFeatures: ["Left-Right mirror", "Top-Bottom mirror", "Kaleidoscope quad mirror", "HD output"],
      howToUseSteps: ["Upload image.", "Select mirror mode.", "Download mirrored image."],
      faqs: [{ question: "What is quad mirror?", answer: "Quad mirror reflects all 4 quadrants symmetrically." }]
    }
  },

  // 7. Image Converter
  {
    id: "image-converter",
    slug: "image-converter",
    name: "Universal Image Converter",
    tagline: "Convert between JPG, PNG, WEBP, AVIF, BMP, TIFF, and ICO.",
    description: "Batch convert any image file format to PNG, JPG, WEBP, AVIF, or BMP with quality control and ZIP download.",
    category: "image",
    iconName: "RefreshCw",
    tags: ["image", "convert", "format", "jpg", "png", "webp"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 4200,
    usageCount: 210000,
    inputLabel: "Upload Images to Convert:",
    inputPlaceholder: "Select one or multiple images...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Universal Image Converter - Convert PNG, JPG, WEBP, AVIF, BMP",
      metaDescription: "Convert images to PNG, JPG, WEBP, AVIF, BMP, or ICO format online for free. Batch conversion support.",
      overview: "Convert single or multiple image files across all major web image formats.",
      useCases: ["Convert web graphics to JPG", "Change PNG transparent files to WEBP", "Batch convert photo folders"],
      keyFeatures: ["Batch processing", "Quality slider", "Background color fill", "ZIP archive download"],
      howToUseSteps: ["Upload image files.", "Select target export format.", "Download converted images or ZIP."],
      faqs: [{ question: "Can I convert multiple images at once?", answer: "Yes, batch conversion is fully supported." }]
    }
  },

  // 8. JPG to PNG
  {
    id: "jpg-to-png",
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    tagline: "Convert compressed JPG images into lossless PNG format.",
    description: "Convert JPG/JPEG images into high quality PNG format with batch processing.",
    category: "image",
    iconName: "Image",
    tags: ["jpg", "png", "convert", "image"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3800,
    usageCount: 195000,
    inputLabel: "Upload JPG Images:",
    inputPlaceholder: "Select JPG files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "JPG to PNG Converter - Convert JPG to PNG Free Online",
      metaDescription: "Convert JPG images to lossless PNG format online for free. Fast batch processing in your browser.",
      overview: "Convert JPG photos to PNG format without loss of clarity.",
      useCases: ["Convert compressed JPGs to PNG", "Prepare images for graphics editing"],
      keyFeatures: ["Lossless PNG export", "Batch conversion", "ZIP download"],
      howToUseSteps: ["Upload JPG file(s).", "Click Process & Download."],
      faqs: [{ question: "Is PNG higher quality than JPG?", answer: "PNG uses lossless compression, preserving exact image pixels." }]
    }
  },

  // 9. PNG to JPG
  {
    id: "png-to-jpg",
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    tagline: "Convert transparent PNG files into solid JPG images.",
    description: "Convert PNG images into lightweight JPG format with background color selection.",
    category: "image",
    iconName: "Image",
    tags: ["png", "jpg", "convert", "image"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 4100,
    usageCount: 220000,
    inputLabel: "Upload PNG Images:",
    inputPlaceholder: "Select PNG files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "PNG to JPG Converter - Convert PNG to JPG Free Online",
      metaDescription: "Convert PNG graphics to solid JPG files online for free. Choose background fill color for transparent PNGs.",
      overview: "Convert PNG graphics to smaller JPG files easily.",
      useCases: ["Shrink large PNG file size", "Convert screenshots to JPG"],
      keyFeatures: ["Custom background color for transparency", "Quality adjustment slider", "ZIP export"],
      howToUseSteps: ["Upload PNG file(s).", "Set background color if transparent.", "Download JPG file."],
      faqs: [{ question: "What happens to PNG transparency in JPG?", answer: "Transparency is filled with your chosen solid background color." }]
    }
  },

  // 10. JPG to WEBP
  {
    id: "jpg-to-webp",
    slug: "jpg-to-webp",
    name: "JPG to WEBP Converter",
    tagline: "Convert JPG images into web-optimized WEBP files.",
    description: "Convert JPG photos into modern Google WEBP format for 30%+ smaller file sizes and faster website loading.",
    category: "image",
    iconName: "Image",
    tags: ["jpg", "webp", "convert", "web optimization"],
    isTrending: true,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1950,
    usageCount: 92000,
    inputLabel: "Upload JPG Images:",
    inputPlaceholder: "Select JPG files to convert to WEBP...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "JPG to WEBP Converter - Optimize Photos for Web",
      metaDescription: "Convert JPG images to WEBP format online for free. Boost page load speed with WEBP image compression.",
      overview: "Convert JPG images to WEBP format for maximum web performance.",
      useCases: ["Speed up website loading speed", "Optimize images for PageSpeed Insights"],
      keyFeatures: ["Smaller file size", "Full quality preservation", "Batch export"],
      howToUseSteps: ["Upload JPG.", "Click Convert to WEBP.", "Download WEBP image."],
      faqs: [{ question: "Why convert to WEBP?", answer: "WEBP offers significantly better compression than JPG at equal quality." }]
    }
  },

  // 11. PNG to WEBP
  {
    id: "png-to-webp",
    slug: "png-to-webp",
    name: "PNG to WEBP Converter",
    tagline: "Convert PNG graphics into web-optimized WEBP files with alpha transparency.",
    description: "Convert PNG graphics to WEBP format while preserving full alpha channel transparency.",
    category: "image",
    iconName: "Image",
    tags: ["png", "webp", "transparency", "convert"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2300,
    usageCount: 105000,
    inputLabel: "Upload PNG Images:",
    inputPlaceholder: "Select PNG files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "PNG to WEBP Converter - Keep Transparency & Reduce Size",
      metaDescription: "Convert PNG to WEBP format online while preserving alpha transparency. Free browser utility.",
      overview: "Convert PNG graphics to transparent WEBP files with small file sizes.",
      useCases: ["Web icons and logos", "Transparent website graphics"],
      keyFeatures: ["Preserves transparency", "Compact file size", "Instant download"],
      howToUseSteps: ["Upload PNG.", "Process file.", "Download WEBP with transparency."],
      faqs: [{ question: "Does WEBP support transparent backgrounds?", answer: "Yes, WEBP fully supports alpha channel transparency." }]
    }
  },

  // 12. WEBP to JPG
  {
    id: "webp-to-jpg",
    slug: "webp-to-jpg",
    name: "WEBP to JPG Converter",
    tagline: "Convert WEBP web images into standard JPG photos.",
    description: "Convert WEBP files back into universal JPG format compatible with all desktop software and photo viewers.",
    category: "image",
    iconName: "Image",
    tags: ["webp", "jpg", "convert", "universal"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2100,
    usageCount: 98000,
    inputLabel: "Upload WEBP Images:",
    inputPlaceholder: "Select WEBP files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "WEBP to JPG Converter - Free Online Tool",
      metaDescription: "Convert WEBP images to JPG format online for free. Make WEBP photos compatible with all devices.",
      overview: "Turn WEBP image downloads back into standard JPG photos.",
      useCases: ["Open WEBP files in legacy software", "Share WEBP images via email"],
      keyFeatures: ["Universal compatibility", "High quality output", "Batch support"],
      howToUseSteps: ["Upload WEBP.", "Convert.", "Download JPG."],
      faqs: [{ question: "Why convert WEBP to JPG?", answer: "Some older photo viewers and desktop software cannot open WEBP files." }]
    }
  },

  // 13. WEBP to PNG
  {
    id: "webp-to-png",
    slug: "webp-to-png",
    name: "WEBP to PNG Converter",
    tagline: "Convert WEBP web images back to transparent PNG graphics.",
    description: "Convert WEBP files into transparent PNG images without quality loss.",
    category: "image",
    iconName: "Image",
    tags: ["webp", "png", "convert", "transparency"],
    isTrending: false,
    isPopular: true,
    rating: 4.9,
    ratingCount: 1980,
    usageCount: 89000,
    inputLabel: "Upload WEBP Images:",
    inputPlaceholder: "Select WEBP files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "WEBP to PNG Converter - Convert WEBP to Transparent PNG",
      metaDescription: "Convert WEBP images to PNG format online for free. Retain full transparency and crisp quality.",
      overview: "Convert WEBP files to PNG graphics effortlessly.",
      useCases: ["Edit WEBP graphics in Photoshop or Illustrator", "Extract transparent PNG icons"],
      keyFeatures: ["Full transparency preservation", "Lossless PNG output", "Instant browser conversion"],
      howToUseSteps: ["Upload WEBP.", "Process image.", "Download PNG."],
      faqs: [{ question: "Will transparency be kept?", answer: "Yes, transparent WEBP pixels become transparent PNG pixels." }]
    }
  },

  // 14. JPG to AVIF
  {
    id: "jpg-to-avif",
    slug: "jpg-to-avif",
    name: "JPG to AVIF Converter",
    tagline: "Convert JPG photos into next-gen AVIF format.",
    description: "Convert JPG files to modern AVIF format for maximum compression performance in modern browsers.",
    category: "image",
    iconName: "Image",
    tags: ["jpg", "avif", "next-gen", "compression"],
    isTrending: true,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1100,
    usageCount: 45000,
    inputLabel: "Upload JPG Images:",
    inputPlaceholder: "Select JPG files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "JPG to AVIF Converter - Next-Gen Image Compression",
      metaDescription: "Convert JPG images to AVIF format online for free. Achieve ultra-low file sizes with AV1 image technology.",
      overview: "Leverage AVIF codec for state-of-the-art web image compression.",
      useCases: ["Next-gen web publishing", "Ultra-low bandwidth optimization"],
      keyFeatures: ["AVIF codec export", "Maximum file size reduction"],
      howToUseSteps: ["Upload JPG.", "Convert.", "Download AVIF."],
      faqs: [{ question: "What is AVIF?", answer: "AVIF is a next-generation image format based on the AV1 video codec." }]
    }
  },

  // 15. PNG to AVIF
  {
    id: "png-to-avif",
    slug: "png-to-avif",
    name: "PNG to AVIF Converter",
    tagline: "Convert PNG graphics into ultra-compact AVIF files.",
    description: "Convert PNG images to AVIF format for extreme file size savings.",
    category: "image",
    iconName: "Image",
    tags: ["png", "avif", "next-gen", "convert"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 950,
    usageCount: 38000,
    inputLabel: "Upload PNG Images:",
    inputPlaceholder: "Select PNG files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "PNG to AVIF Converter - Ultra Compact Graphics",
      metaDescription: "Convert PNG graphics to AVIF online for free. Reduce file size up to 50% compared to WEBP.",
      overview: "Convert PNG images to compact AVIF format.",
      useCases: ["Web graphics compression"],
      keyFeatures: ["Compact size", "Modern browser support"],
      howToUseSteps: ["Upload PNG.", "Process file.", "Download AVIF."],
      faqs: [{ question: "Do all browsers support AVIF?", answer: "All modern browsers including Chrome, Safari, Firefox, and Edge support AVIF." }]
    }
  },

  // 16. AVIF to JPG
  {
    id: "avif-to-jpg",
    slug: "avif-to-jpg",
    name: "AVIF to JPG Converter",
    tagline: "Convert AVIF next-gen images into standard JPG photos.",
    description: "Convert AVIF images into standard JPG files compatible with all devices and software.",
    category: "image",
    iconName: "Image",
    tags: ["avif", "jpg", "convert"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1200,
    usageCount: 48000,
    inputLabel: "Upload AVIF Images:",
    inputPlaceholder: "Select AVIF files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "AVIF to JPG Converter - Universal Photo Format",
      metaDescription: "Convert AVIF images to JPG format online for free. Universal device compatibility.",
      overview: "Convert AVIF downloads into universal JPG photos.",
      useCases: ["Make AVIF files viewable everywhere"],
      keyFeatures: ["Instant conversion", "HD JPG rendering"],
      howToUseSteps: ["Upload AVIF.", "Convert.", "Download JPG."],
      faqs: [{ question: "Why convert AVIF to JPG?", answer: "To view or edit AVIF photos on legacy platforms." }]
    }
  },

  // 17. AVIF to PNG
  {
    id: "avif-to-png",
    slug: "avif-to-png",
    name: "AVIF to PNG Converter",
    tagline: "Convert AVIF images into lossless PNG format.",
    description: "Convert AVIF files to crisp PNG graphics with full transparency support.",
    category: "image",
    iconName: "Image",
    tags: ["avif", "png", "convert"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1050,
    usageCount: 41000,
    inputLabel: "Upload AVIF Images:",
    inputPlaceholder: "Select AVIF files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "AVIF to PNG Converter - Transparent PNG Export",
      metaDescription: "Convert AVIF to PNG format online for free. Lossless quality and transparency.",
      overview: "Convert AVIF graphics to PNG files.",
      useCases: ["Edit AVIF graphics in design apps"],
      keyFeatures: ["Lossless PNG export", "Transparency preservation"],
      howToUseSteps: ["Upload AVIF.", "Process.", "Download PNG."],
      faqs: [{ question: "Is PNG export lossless?", answer: "Yes, the converted PNG maintains exact visual detail." }]
    }
  },

  // 18. BMP to PNG
  {
    id: "bmp-to-png",
    slug: "bmp-to-png",
    name: "BMP to PNG Converter",
    tagline: "Convert uncompressed BMP bitmaps into compressed PNG files.",
    description: "Convert large Windows bitmap (BMP) images into compact PNG files.",
    category: "image",
    iconName: "Image",
    tags: ["bmp", "png", "bitmap", "convert"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1300,
    usageCount: 52000,
    inputLabel: "Upload BMP Bitmap Files:",
    inputPlaceholder: "Select BMP files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "BMP to PNG Converter - Compress Bitmap Graphics",
      metaDescription: "Convert BMP bitmap images to PNG format online for free. Compress raw bitmap files effortlessly.",
      overview: "Compress heavy BMP bitmaps into web-friendly PNG images.",
      useCases: ["Reduce Windows BMP file size", "Web publishing"],
      keyFeatures: ["Dramatically smaller size", "Lossless quality"],
      howToUseSteps: ["Upload BMP.", "Convert.", "Download PNG."],
      faqs: [{ question: "How much size is saved?", answer: "PNG compression typically reduces BMP file size by 60% - 80%." }]
    }
  },

  // 19. BMP to JPG
  {
    id: "bmp-to-jpg",
    slug: "bmp-to-jpg",
    name: "BMP to JPG Converter",
    tagline: "Convert heavy BMP bitmap photos into compact JPG files.",
    description: "Convert BMP files to standard JPG photos for easy sharing and email attachments.",
    category: "image",
    iconName: "Image",
    tags: ["bmp", "jpg", "bitmap", "convert"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1250,
    usageCount: 49000,
    inputLabel: "Upload BMP Files:",
    inputPlaceholder: "Select BMP files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "BMP to JPG Converter - Fast Bitmap Conversion",
      metaDescription: "Convert BMP files to JPG online for free. Lightweight output for sharing.",
      overview: "Turn large BMP files into lightweight JPG photos.",
      useCases: ["Emailing bitmap scans"],
      keyFeatures: ["Fast processing", "Compact output"],
      howToUseSteps: ["Upload BMP.", "Convert.", "Download JPG."],
      faqs: [{ question: "Is BMP converting fast?", answer: "Yes, conversion takes less than 1 second." }]
    }
  },

  // 20. TIFF to PNG
  {
    id: "tiff-to-png",
    slug: "tiff-to-png",
    name: "TIFF to PNG Converter",
    tagline: "Convert raw TIFF/TIF document scans into web-friendly PNG images.",
    description: "Convert heavy TIFF images and document scans into PNG format.",
    category: "image",
    iconName: "Image",
    tags: ["tiff", "tif", "png", "scans", "convert"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 1800,
    usageCount: 76000,
    inputLabel: "Upload TIFF/TIF Files:",
    inputPlaceholder: "Select TIFF files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "TIFF to PNG Converter - Convert Document Scans Online",
      metaDescription: "Convert TIFF/TIF images to PNG format online for free. Easily view document scans in web browsers.",
      overview: "Convert uncompressed TIFF scans into web-friendly PNG images.",
      useCases: ["View TIFF medical or document scans", "Publish high-res scans on web"],
      keyFeatures: ["High fidelity rendering", "Browser preview"],
      howToUseSteps: ["Upload TIFF file.", "Process.", "Download PNG."],
      faqs: [{ question: "Can web browsers view TIFF files directly?", answer: "Most browsers cannot display TIFF natively, so converting to PNG enables instant viewing." }]
    }
  },

  // 21. TIFF to JPG
  {
    id: "tiff-to-jpg",
    slug: "tiff-to-jpg",
    name: "TIFF to JPG Converter",
    tagline: "Convert heavy TIFF document scans into lightweight JPG photos.",
    description: "Convert TIFF/TIF image files into lightweight JPG photos.",
    category: "image",
    iconName: "Image",
    tags: ["tiff", "jpg", "scans", "convert"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1600,
    usageCount: 68000,
    inputLabel: "Upload TIFF Files:",
    inputPlaceholder: "Select TIFF files...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "TIFF to JPG Converter - Lightweight Photo Export",
      metaDescription: "Convert TIFF images to JPG online for free. Compress high-res TIFF scans.",
      overview: "Convert heavy TIFF files into standard JPG photos.",
      useCases: ["Shrink TIFF file sizes for email"],
      keyFeatures: ["Compact JPG output", "Adjustable quality"],
      howToUseSteps: ["Upload TIFF.", "Convert.", "Download JPG."],
      faqs: [{ question: "Does it support multi-page TIFF?", answer: "Yes, it extracts and converts the primary scan page." }]
    }
  },

  // 22. GIF Frame Extractor
  {
    id: "gif-frame-extractor",
    slug: "gif-frame-extractor",
    name: "GIF Frame Extractor",
    tagline: "Extract individual image frames from animated GIF files.",
    description: "Deconstruct animated GIFs into distinct PNG image frames with individual thumbnail view and ZIP download.",
    category: "image",
    iconName: "Scissors",
    tags: ["gif", "animation", "frames", "extract", "splitter"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2600,
    usageCount: 115000,
    inputLabel: "Upload Animated GIF File:",
    inputPlaceholder: "Select GIF animation...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "GIF Frame Extractor - Extract Animation Frames to PNG",
      metaDescription: "Extract frames from animated GIFs online for free. Download individual PNG frames or ZIP archive.",
      overview: "Split animated GIFs into separate image frames cleanly.",
      useCases: ["Extract specific stills from GIF animations", "Analyze frame-by-frame animation"],
      keyFeatures: ["Frame thumbnail grid", "Single frame download", "Full frame pack ZIP download"],
      howToUseSteps: ["Upload GIF file.", "View extracted frames.", "Download individual frame or ZIP pack."],
      faqs: [{ question: "Are frames saved as PNG?", answer: "Yes, all frames are extracted in crisp PNG format." }]
    }
  },

  // 23. GIF to PNG
  {
    id: "gif-to-png",
    slug: "gif-to-png",
    name: "GIF to PNG Converter",
    tagline: "Convert static or animated GIFs into transparent PNG graphics.",
    description: "Convert GIF graphics or animation keyframes into transparent PNG images.",
    category: "image",
    iconName: "Image",
    tags: ["gif", "png", "convert", "transparency"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1750,
    usageCount: 72000,
    inputLabel: "Upload GIF File:",
    inputPlaceholder: "Select GIF file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "GIF to PNG Converter - Free Online Utility",
      metaDescription: "Convert GIF graphics to transparent PNG format online for free.",
      overview: "Convert GIF files to clean PNG graphics.",
      useCases: ["Convert legacy GIF logos to PNG"],
      keyFeatures: ["Preserves transparency", "Lossless output"],
      howToUseSteps: ["Upload GIF.", "Convert.", "Download PNG."],
      faqs: [{ question: "Is GIF transparency supported?", answer: "Yes, transparent GIF pixels convert directly to PNG alpha transparency." }]
    }
  },

  // 24. PNG to ICO
  {
    id: "png-to-ico",
    slug: "png-to-ico",
    name: "PNG to ICO Converter",
    tagline: "Convert PNG graphics into Windows ICO icon files.",
    description: "Convert PNG logos and graphics into valid ICO format for website favicons and Windows app icons.",
    category: "image",
    iconName: "Image",
    tags: ["png", "ico", "icon", "favicon"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2900,
    usageCount: 130000,
    inputLabel: "Upload PNG Graphic:",
    inputPlaceholder: "Select PNG logo or icon...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "PNG to ICO Converter - Create Windows & Favicon ICO Files",
      metaDescription: "Convert PNG images to ICO icon format online for free. Select icon sizes (16x16, 32x32, 48x48, 64x64, 256x256).",
      overview: "Convert PNG graphics into multi-resolution ICO icon files.",
      useCases: ["Create website favicon.ico", "Generate Windows desktop software icons"],
      keyFeatures: ["Selectable pixel dimensions", "Preserves transparency", "Instant download"],
      howToUseSteps: ["Upload PNG graphic.", "Select target size.", "Download favicon.ico."],
      faqs: [{ question: "What is the standard favicon size?", answer: "32x32 or 16x16 pixels is standard for favicon.ico." }]
    }
  },

  // 25. Image to ICO
  {
    id: "image-to-ico",
    slug: "image-to-ico",
    name: "Image to ICO Converter",
    tagline: "Convert any JPG, PNG, WEBP, or SVG photo into an ICO icon.",
    description: "Convert any image format into a clean ICO file.",
    category: "image",
    iconName: "Image",
    tags: ["image", "ico", "icon", "convert"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2400,
    usageCount: 102000,
    inputLabel: "Upload Any Image:",
    inputPlaceholder: "Select JPG, PNG, or WEBP file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image to ICO Converter - Any Image to Icon",
      metaDescription: "Convert any photo or graphic into ICO format online for free.",
      overview: "Convert JPG, PNG, WEBP photos into ICO icons.",
      useCases: ["Favicon creation", "App icon design"],
      keyFeatures: ["Universal format input", "Clean square scaling"],
      howToUseSteps: ["Upload image.", "Process.", "Download ICO."],
      faqs: [{ question: "Can I use JPG files?", answer: "Yes, JPG photos are automatically cropped and converted to ICO." }]
    }
  },

  // 26. Favicon Generator
  {
    id: "favicon-generator",
    slug: "favicon-generator",
    name: "Favicon Generator",
    tagline: "Generate standard web favicons from any logo or image.",
    description: "Create standard web favicons (16x16, 32x32, 48x48) for browser tabs.",
    category: "image",
    iconName: "Sparkles",
    tags: ["favicon", "icon", "website", "generator"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3500,
    usageCount: 160000,
    inputLabel: "Upload Logo Image:",
    inputPlaceholder: "Select logo graphic...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Favicon Generator - Create Website Favicons Free Online",
      metaDescription: "Generate website favicons from logo graphics online for free. Download crisp favicon.ico and PNG favicons.",
      overview: "Generate clean website favicons instantly.",
      useCases: ["Website browser tab icons", "PWA app icons"],
      keyFeatures: ["Crisp downscaling", "Square auto-center", "PNG & ICO export"],
      howToUseSteps: ["Upload logo.", "Preview favicon.", "Download icon."],
      faqs: [{ question: "Where do I put the favicon.ico file?", answer: "Place it in your website's root directory." }]
    }
  },

  // 27. Favicon Pack Generator
  {
    id: "favicon-pack-generator",
    slug: "favicon-pack-generator",
    name: "Favicon Pack Generator",
    tagline: "Generate complete favicon package (iOS, Android, PWA, ICO, Manifest).",
    description: "Generate complete website favicon package including apple-touch-icon, android-chrome, favicon.ico, site.webmanifest, and HTML head code snippet in a single ZIP download.",
    category: "image",
    iconName: "Sparkles",
    tags: ["favicon", "pack", "zip", "ios", "android", "manifest"],
    isTrending: true,
    isPopular: true,
    rating: 5.0,
    ratingCount: 4200,
    usageCount: 185000,
    inputLabel: "Upload Brand Logo Graphic:",
    inputPlaceholder: "Select high-res brand logo (e.g. 512x512 PNG)...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Favicon Pack Generator - Complete iOS, Android & Web Pack ZIP",
      metaDescription: "Generate complete website favicon pack with site.webmanifest and HTML snippet in a single ZIP file download.",
      overview: "One-click generation of all web, iOS, Android, and PWA icon sizes.",
      useCases: ["Production web development launch", "Mobile PWA icon set"],
      keyFeatures: ["Apple touch icon (180x180)", "Android Chrome (192x192 & 512x512)", "site.webmanifest file", "HTML snippet", "ZIP download"],
      howToUseSteps: ["Upload logo image.", "Preview generated sizes.", "Download complete ZIP package."],
      faqs: [{ question: "What files are inside the ZIP?", answer: "favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest, and html-head-snippet.html." }]
    }
  },

  // 28. Image Metadata Viewer
  {
    id: "image-metadata-viewer",
    slug: "image-metadata-viewer",
    name: "EXIF Metadata Inspector",
    tagline: "Inspect camera model, shutter speed, ISO, lens, and GPS location tags.",
    description: "Inspect EXIF metadata embedded in photos including camera make, model, exposure settings, focal length, creation date, and GPS coordinates.",
    category: "image",
    iconName: "Eye",
    tags: ["exif", "metadata", "gps", "camera", "inspector"],
    isTrending: true,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2700,
    usageCount: 120000,
    inputLabel: "Upload Photo to Inspect EXIF:",
    inputPlaceholder: "Select photo with EXIF tags...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "EXIF Metadata Inspector - View Camera & GPS Photo Data",
      metaDescription: "View hidden EXIF metadata, camera settings, and GPS location tags in photos online for free.",
      overview: "Inspect photo EXIF data safely without uploading files to remote servers.",
      useCases: ["Inspect photo shooting parameters", "Verify photo origin and camera specs", "Check GPS geotagging"],
      keyFeatures: ["Camera make & model", "ISO, Shutter speed & Aperture", "GPS latitude/longitude", "File details"],
      howToUseSteps: ["Upload photo.", "View EXIF details table.", "Copy metadata specs."],
      faqs: [{ question: "Are my photos kept private?", answer: "Yes, metadata extraction is performed locally in your browser." }]
    }
  },

  // 29. Image Metadata Remover
  {
    id: "image-remove-metadata",
    slug: "image-remove-metadata",
    name: "EXIF Metadata Remover",
    tagline: "Strip GPS location, camera model, and private EXIF tags from photos.",
    description: "Strip all private EXIF metadata, GPS geotags, camera details, and timestamps from photos to protect privacy before posting online.",
    category: "image",
    iconName: "Scissors",
    tags: ["exif", "privacy", "remove", "clean", "metadata"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3100,
    usageCount: 140000,
    inputLabel: "Upload Photo to Clean EXIF:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "EXIF Metadata Remover - Strip GPS & Camera Data Online",
      metaDescription: "Remove EXIF metadata and GPS location tags from photos online for free. Protect photo privacy before sharing.",
      overview: "Clean EXIF tags and GPS coordinates from photos safely.",
      useCases: ["Sanitize photos before posting on social media", "Protect home location privacy"],
      keyFeatures: ["Strips 100% of EXIF APP1 tags", "Removes GPS geotags", "Preserves photo resolution", "Instant download"],
      howToUseSteps: ["Upload photo.", "Click Strip EXIF.", "Download sanitized photo."],
      faqs: [{ question: "Does stripping EXIF reduce photo visual quality?", answer: "No, stripping metadata retains exact pixel detail." }]
    }
  },

  // 30. Image Dimensions Checker
  {
    id: "image-dimensions-checker",
    slug: "image-dimensions-checker",
    name: "Image Dimensions Checker",
    tagline: "Check exact pixel width, height, megapixels, and aspect ratio.",
    description: "Inspect exact image width, height, megapixels, aspect ratio, orientation, and color bit depth instantly.",
    category: "image",
    iconName: "Eye",
    tags: ["dimensions", "width", "height", "megapixels", "aspect ratio"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1500,
    usageCount: 61000,
    inputLabel: "Upload Image File:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Dimensions Checker - Inspect Pixel Width & Height",
      metaDescription: "Check image width, height, megapixels, and aspect ratio online for free.",
      overview: "Quickly inspect exact pixel dimensions and megapixels.",
      useCases: ["Verify image specs before design upload", "Check mobile screenshot dimensions"],
      keyFeatures: ["Width & Height px", "Total Megapixels", "Aspect Ratio", "Orientation"],
      howToUseSteps: ["Upload image.", "View dimensions summary."],
      faqs: [{ question: "How are megapixels calculated?", answer: "(Width × Height) ÷ 1,000,000 = Megapixels." }]
    }
  },

  // 31. Image File Size Checker
  {
    id: "image-size-checker",
    slug: "image-size-checker",
    name: "Image File Size Checker",
    tagline: "Check exact file weight in Bytes, KB, and MB with optimization rating.",
    description: "Check precise file size in bytes, kilobytes, and megabytes with web optimization recommendations.",
    category: "image",
    iconName: "Eye",
    tags: ["file size", "bytes", "kb", "mb", "checker"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1400,
    usageCount: 58000,
    inputLabel: "Upload Image File:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image File Size Checker - Bytes, KB, MB Analyzer",
      metaDescription: "Inspect exact image file size in KB and MB with website optimization tips.",
      overview: "Analyze image weight and web speed impact.",
      useCases: ["Check if photo exceeds attachment limits"],
      keyFeatures: ["Exact byte count", "Formatted KB/MB", "Optimization tips"],
      howToUseSteps: ["Upload file.", "View size metrics."],
      faqs: [{ question: "What is an ideal web image file size?", answer: "Under 200 KB is recommended for fast page loading." }]
    }
  },

  // 32. Aspect Ratio Calculator
  {
    id: "aspect-ratio-calculator",
    slug: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    tagline: "Calculate missing width/height and simplify aspect ratios (16:9, 4:3, 1:1).",
    description: "Calculate missing dimensions for any target aspect ratio or simplify raw pixel ratios.",
    category: "image",
    iconName: "Sliders",
    tags: ["aspect ratio", "calculator", "16:9", "4:3", "dimensions"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3200,
    usageCount: 135000,
    inputLabel: "Input Width / Height or Upload Image:",
    inputPlaceholder: "Enter dimensions or upload image...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Aspect Ratio Calculator - Calculate 16:9, 4:3, 1:1 Dimensions",
      metaDescription: "Calculate aspect ratios and missing pixel dimensions online for free. Supports 16:9, 4:3, 1:1, 9:16, 21:9.",
      overview: "Compute proportional dimensions easily for video and graphic design.",
      useCases: ["Video resolution scaling", "Responsive banner sizing"],
      keyFeatures: ["16:9, 4:3, 1:1, 9:16 presets", "Auto compute missing side", "Simplified ratio formula"],
      howToUseSteps: ["Enter width or height.", "Select target aspect ratio.", "View calculated dimension."],
      faqs: [{ question: "What is 1080p aspect ratio?", answer: "1920x1080 is a standard 16:9 widescreen aspect ratio." }]
    }
  },

  // 33. Image Quality Adjuster
  {
    id: "image-quality-adjuster",
    slug: "image-quality-adjuster",
    name: "Image Quality Adjuster",
    tagline: "Fine-tune compression level and pixel detail balance.",
    description: "Adjust image compression quality slider with live visual fidelity preview.",
    category: "image",
    iconName: "Sliders",
    tags: ["quality", "adjuster", "compression", "fidelity"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1600,
    usageCount: 65000,
    inputLabel: "Upload Image:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Quality Adjuster - Balance Size & Detail",
      metaDescription: "Adjust image encoding quality percentage online for free. Live side-by-side preview.",
      overview: "Fine-tune image quality percentage precisely.",
      useCases: ["Find sweet spot between image file size and visual clarity"],
      keyFeatures: ["Live preview canvas", "Quality slider 1%-100%", "File size tracker"],
      howToUseSteps: ["Upload photo.", "Slide quality percentage.", "Download result."],
      faqs: [{ question: "What quality level is recommended for web?", answer: "80% - 85% provides near-perfect visuals at low file size." }]
    }
  },

  // 34. Brightness Adjuster
  {
    id: "image-brightness",
    slug: "image-brightness",
    name: "Adjust Image Brightness",
    tagline: "Brighten dark photos or darken overexposed images.",
    description: "Adjust photo brightness slider from -100% to +100% with real-time canvas preview.",
    category: "image",
    iconName: "Sliders",
    tags: ["brightness", "adjust", "photo", "light"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2200,
    usageCount: 94000,
    inputLabel: "Upload Photo to Adjust Brightness:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Adjust Image Brightness - Brighten Dark Photos Online",
      metaDescription: "Brighten dark photos or adjust brightness online for free.",
      overview: "Enhance photo exposure and lighting easily.",
      useCases: ["Fix dark underexposed smartphone photos", "Tone down overexposed whites"],
      keyFeatures: ["Brightness slider (-100 to +100)", "Live preview", "HD export"],
      howToUseSteps: ["Upload photo.", "Move brightness slider.", "Download photo."],
      faqs: [{ question: "Can I brighten dark photos?", answer: "Yes, slide to the right to increase brightness." }]
    }
  },

  // 35. Contrast Adjuster
  {
    id: "image-contrast",
    slug: "image-contrast",
    name: "Adjust Image Contrast",
    tagline: "Enhance vibrant contrast between light highlights and deep shadows.",
    description: "Adjust photo contrast slider to make shadows punchier and highlights crisp.",
    category: "image",
    iconName: "Sliders",
    tags: ["contrast", "adjust", "shadows", "highlights"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1950,
    usageCount: 81000,
    inputLabel: "Upload Photo to Adjust Contrast:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Adjust Image Contrast - Free Online Photo Contrast Tool",
      metaDescription: "Increase or decrease photo contrast online for free.",
      overview: "Boost dynamic range and contrast in photos.",
      useCases: ["Make flat photos look punchy and vibrant"],
      keyFeatures: ["Contrast slider", "Real-time canvas rendering"],
      howToUseSteps: ["Upload photo.", "Adjust contrast.", "Download image."],
      faqs: [{ question: "What does contrast do?", answer: "Contrast widens the difference between dark and light areas." }]
    }
  },

  // 36. Saturation Adjuster
  {
    id: "image-saturation",
    slug: "image-saturation",
    name: "Adjust Image Saturation",
    tagline: "Boost vivid color intensity or mute photo color tones.",
    description: "Adjust color saturation slider from 0% (grayscale) to 200% (vivid colors).",
    category: "image",
    iconName: "Sliders",
    tags: ["saturation", "vivid", "color", "adjust"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2100,
    usageCount: 88000,
    inputLabel: "Upload Photo to Adjust Saturation:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Adjust Image Saturation - Enhance Photo Colors Online",
      metaDescription: "Boost vivid photo colors or mute saturation online for free.",
      overview: "Control color richness and intensity easily.",
      useCases: ["Enhance sunset or landscape photo colors"],
      keyFeatures: ["Saturation slider (0%-200%)", "Live preview"],
      howToUseSteps: ["Upload photo.", "Set saturation slider.", "Export image."],
      faqs: [{ question: "Setting saturation to 0% creates grayscale?", answer: "Yes, 0% saturation completely removes color." }]
    }
  },

  // 37. Grayscale Converter
  {
    id: "image-grayscale",
    slug: "image-grayscale",
    name: "Grayscale Filter",
    tagline: "Convert vibrant color photos into classic black & white artwork.",
    description: "Convert color images into black and white grayscale photos with contrast adjustment.",
    category: "image",
    iconName: "Sliders",
    tags: ["grayscale", "black and white", "monochrome", "filter"],
    isTrending: false,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2400,
    usageCount: 99000,
    inputLabel: "Upload Photo to Convert to Grayscale:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Grayscale Image Filter - Convert Photo to Black & White",
      metaDescription: "Convert color photos into black and white monochrome images online for free.",
      overview: "Transform color photos into timeless monochrome artwork.",
      useCases: ["Artistic portrait photography", "Document scanning prep"],
      keyFeatures: ["1-click black & white filter", "Adjustable contrast", "Instant export"],
      howToUseSteps: ["Upload photo.", "Apply Grayscale.", "Download black & white photo."],
      faqs: [{ question: "Is this tool free?", answer: "Yes, 100% free with no watermark." }]
    }
  },

  // 38. Sepia Filter
  {
    id: "image-sepia",
    slug: "image-sepia",
    name: "Sepia Vintage Filter",
    tagline: "Apply warm vintage sepia tone to images.",
    description: "Apply classic warm sepia tone to photos for an antique vintage aesthetic.",
    category: "image",
    iconName: "Sparkles",
    tags: ["sepia", "vintage", "retro", "filter", "warm"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2250,
    usageCount: 91000,
    inputLabel: "Upload Photo for Sepia Filter:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Sepia Vintage Filter - Give Photos a Retro Sepia Look",
      metaDescription: "Apply vintage sepia photo filter online for free.",
      overview: "Add warm antique sepia tones to photos.",
      useCases: ["Retro photo styling", "Vintage aesthetic creation"],
      keyFeatures: ["Custom sepia intensity slider", "Instant preview"],
      howToUseSteps: ["Upload photo.", "Adjust sepia intensity.", "Download image."],
      faqs: [{ question: "Can I adjust sepia warmth?", answer: "Yes, use the intensity slider." }]
    }
  },

  // 39. Negative Filter
  {
    id: "image-negative",
    slug: "image-negative",
    name: "Negative Color Inverter",
    tagline: "Invert image colors into film negative photo style.",
    description: "Invert photo RGB colors to create film negative photo effects.",
    category: "image",
    iconName: "Sliders",
    tags: ["negative", "invert", "color", "film"],
    isTrending: false,
    isPopular: false,
    rating: 4.8,
    ratingCount: 1800,
    usageCount: 75000,
    inputLabel: "Upload Photo to Invert Colors:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Negative Color Inverter - Invert Photo Colors Online",
      metaDescription: "Invert image colors into film negative style online for free.",
      overview: "Invert color channels for film negative look.",
      useCases: ["X-ray or film negative photo inversion", "Stylized graphics"],
      keyFeatures: ["1-click color inversion", "Crisp output"],
      howToUseSteps: ["Upload photo.", "Invert colors.", "Download result."],
      faqs: [{ question: "Can I invert dark text on white background?", answer: "Yes, it turns white background to dark and dark text to white." }]
    }
  },

  // 40. Blur Image
  {
    id: "image-blur",
    slug: "image-blur",
    name: "Blur Image Filter",
    tagline: "Apply gaussian blur radius to hide sensitive information.",
    description: "Apply gaussian blur effect with customizable blur radius slider to obfuscate background or hide text.",
    category: "image",
    iconName: "Sliders",
    tags: ["blur", "gaussian", "privacy", "censor", "filter"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2900,
    usageCount: 125000,
    inputLabel: "Upload Photo to Blur:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Blur Image Filter - Apply Gaussian Blur Online",
      metaDescription: "Blur images online for free. Adjust Gaussian blur radius slider easily.",
      overview: "Apply smooth Gaussian blur to photos.",
      useCases: ["Blur background for bokeh effect", "Censor private information"],
      keyFeatures: ["Blur radius slider (1px - 50px)", "Real-time preview"],
      howToUseSteps: ["Upload photo.", "Adjust blur radius.", "Download blurred image."],
      faqs: [{ question: "Is Gaussian blur smooth?", answer: "Yes, canvas filter renders hardware-accelerated Gaussian blur." }]
    }
  },

  // 41. Sharpen Image
  {
    id: "image-sharpen",
    slug: "image-sharpen",
    name: "Sharpen Image Clarity",
    tagline: "Enhance edge details and crisp photo focus.",
    description: "Enhance image sharpness and crisp edge detail using convolution matrix sharpening.",
    category: "image",
    iconName: "Sparkles",
    tags: ["sharpen", "clarity", "edges", "enhance", "focus"],
    isTrending: true,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2600,
    usageCount: 110000,
    inputLabel: "Upload Photo to Sharpen:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Sharpen Image Clarity - Unsharp Mask Online Tool",
      metaDescription: "Sharpen blurry photos online for free. Enhance edge detail and focus.",
      overview: "Enhance photo focus and edge clarity.",
      useCases: ["Improve soft focus photos", "Make text in scans legible"],
      keyFeatures: ["Convolution kernel sharpening", "Instant preview"],
      howToUseSteps: ["Upload photo.", "Click Sharpen.", "Download crisp photo."],
      faqs: [{ question: "Does sharpening fix blurry photos?", answer: "It significantly enhances edge definition and details." }]
    }
  },

  // 42. Pixelate Image
  {
    id: "image-pixelator",
    slug: "image-pixelator",
    name: "Pixelate Image Filter",
    tagline: "Pixelate photos or create 8-bit retro pixel art.",
    description: "Pixelate image content with adjustable block size slider for censors or 8-bit retro art.",
    category: "image",
    iconName: "Sliders",
    tags: ["pixelate", "8-bit", "censor", "pixel art", "retro"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2100,
    usageCount: 86000,
    inputLabel: "Upload Image to Pixelate:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Pixelate Image Filter - Create 8-Bit Pixel Art Online",
      metaDescription: "Pixelate photos online for free. Create retro pixel art or censor image regions.",
      overview: "Turn photos into pixelated 8-bit retro graphics.",
      useCases: ["Retro game asset design", "Privacy censoring"],
      keyFeatures: ["Adjustable pixel block size", "Instant render"],
      howToUseSteps: ["Upload image.", "Set pixelate block size.", "Download pixel art."],
      faqs: [{ question: "Can I adjust the pixel size?", answer: "Yes, slide from 2px up to 50px." }]
    }
  },

  // 43. Round Image Corners
  {
    id: "round-image-corners",
    slug: "round-image-corners",
    name: "Round Image Corners",
    tagline: "Add rounded corners or circular avatar masks to photos.",
    description: "Add smooth rounded corners or circular cropping to photos with custom background fill or transparent PNG export.",
    category: "image",
    iconName: "Scissors",
    tags: ["rounded corners", "border radius", "circle avatar", "mask"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2800,
    usageCount: 118000,
    inputLabel: "Upload Image to Round Corners:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Round Image Corners - Create Circle Avatars & Radius Corners",
      metaDescription: "Add rounded corners or circular crop to photos online for free. Export transparent PNG.",
      overview: "Apply smooth corner radius or circular avatar mask to images.",
      useCases: ["Profile picture avatar creation", "Rounded UI card graphics"],
      keyFeatures: ["Corner radius slider", "Circle avatar mode", "Transparent PNG output"],
      howToUseSteps: ["Upload photo.", "Adjust corner radius.", "Download rounded image."],
      faqs: [{ question: "Can I export transparent background?", answer: "Yes, transparent PNG export is standard." }]
    }
  },

  // 44. Image Border Generator
  {
    id: "image-border-maker",
    slug: "image-border-maker",
    name: "Image Border Generator",
    tagline: "Add custom color borders and photo frames.",
    description: "Add outer border framing to photos with custom border thickness, color, and background padding.",
    category: "image",
    iconName: "Sliders",
    tags: ["border", "frame", "padding", "photo frame"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 1900,
    usageCount: 78000,
    inputLabel: "Upload Image for Border:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Border Generator - Add Photo Borders Online",
      metaDescription: "Add custom color borders and frames to photos online for free.",
      overview: "Frame photos with custom color borders easily.",
      useCases: ["Instagram white border framing", "Polaroid style photo borders"],
      keyFeatures: ["Border width slider", "Color picker", "Background padding"],
      howToUseSteps: ["Upload photo.", "Choose border width and color.", "Download framed photo."],
      faqs: [{ question: "Can I add a white border for Instagram?", answer: "Yes, set border color to white." }]
    }
  },

  // 45. Image Watermark
  {
    id: "image-watermark",
    slug: "image-watermark",
    name: "Image Watermark Tool",
    tagline: "Add text copyright or logo overlays to photos.",
    description: "Add text copyright watermarks or logo overlays to photos with opacity, positioning, and tile pattern options.",
    category: "image",
    iconName: "Sparkles",
    tags: ["watermark", "copyright", "text watermark", "logo watermark"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3400,
    usageCount: 150000,
    inputLabel: "Upload Photo to Watermark:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Watermark Tool - Add Text & Logo Watermarks Free",
      metaDescription: "Watermark photos online with text or logo overlays for free. Protect photo copyright.",
      overview: "Protect your photos with customizable text or logo watermarks.",
      useCases: ["Protect photography copyright", "Brand social media images"],
      keyFeatures: ["Text or logo watermark", "Opacity slider", "Positioning grid", "Tile pattern option"],
      howToUseSteps: ["Upload photo.", "Set watermark text or upload logo.", "Adjust opacity & position.", "Download watermarked photo."],
      faqs: [{ question: "Can I repeat watermark across entire image?", answer: "Yes, choose the 'Tile Pattern' position." }]
    }
  },

  // 46. Text Watermark
  {
    id: "text-watermark",
    slug: "text-watermark",
    name: "Text Watermark Generator",
    tagline: "Add custom text copyright stamps to photos.",
    description: "Add text stamps with custom font size, color, opacity, and positioning.",
    category: "image",
    iconName: "Sparkles",
    tags: ["watermark", "text", "copyright", "stamp"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2100,
    usageCount: 89000,
    inputLabel: "Upload Photo:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Text Watermark Generator - Add Text Stamps to Images",
      metaDescription: "Add text watermarks to photos online for free. Custom font size and color.",
      overview: "Add custom text stamps to protect photo copyright.",
      useCases: ["Add © Copyright notice to photos"],
      keyFeatures: ["Custom text", "Font size & color", "Opacity control"],
      howToUseSteps: ["Upload image.", "Enter text.", "Download."],
      faqs: [{ question: "Is text anti-aliased?", answer: "Yes, canvas text renders with clean anti-aliasing." }]
    }
  },

  // 47. Logo Watermark
  {
    id: "logo-watermark",
    slug: "logo-watermark",
    name: "Logo Watermark Overlay",
    tagline: "Overlay company logo onto photos with transparency.",
    description: "Overlay transparent PNG company logos onto photos with scale and opacity controls.",
    category: "image",
    iconName: "Sparkles",
    tags: ["logo", "watermark", "overlay", "branding"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2300,
    usageCount: 95000,
    inputLabel: "Upload Main Photo:",
    inputPlaceholder: "Select main photo...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Logo Watermark Overlay - Brand Photos with Company Logo",
      metaDescription: "Overlay company logos onto photos online for free. Adjust scale and opacity.",
      overview: "Brand photos with your company logo graphic.",
      useCases: ["E-commerce product photo branding"],
      keyFeatures: ["Upload PNG logo", "Scale & opacity sliders", "Corner anchoring"],
      howToUseSteps: ["Upload main photo.", "Upload PNG logo.", "Position and download."],
      faqs: [{ question: "Should I use transparent PNG logos?", answer: "Yes, transparent PNG logos blend best onto photos." }]
    }
  },

  // 48. Image Overlay
  {
    id: "image-overlay",
    slug: "image-overlay",
    name: "Image Overlay Tool",
    tagline: "Superimpose one image or graphic on top of another.",
    description: "Superimpose graphics, QR codes, or badge overlays on top of background photos.",
    category: "image",
    iconName: "Layers",
    tags: ["overlay", "superimpose", "combine", "blend"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1600,
    usageCount: 68000,
    inputLabel: "Upload Base Photo:",
    inputPlaceholder: "Select base image...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Overlay Tool - Superimpose Graphics Online",
      metaDescription: "Overlay one image on top of another online for free.",
      overview: "Layer graphics or images on top of background photos.",
      useCases: ["Add QR codes to promo graphics", "Layer badge graphics onto photos"],
      keyFeatures: ["Layer blending", "Opacity & positioning", "HD output"],
      howToUseSteps: ["Upload base photo.", "Upload overlay image.", "Download."],
      faqs: [{ question: "Can I adjust overlay opacity?", answer: "Yes, adjust the opacity slider." }]
    }
  },

  // 49. Image Background Color Changer
  {
    id: "image-bg-color-changer",
    slug: "image-bg-color-changer",
    name: "Image Background Color Changer",
    tagline: "Replace transparent or solid background with custom colors.",
    description: "Replace transparent background with solid colors, white studio backdrop, or solid color fills.",
    category: "image",
    iconName: "Sliders",
    tags: ["background", "color", "transparent", "replace"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3100,
    usageCount: 132000,
    inputLabel: "Upload Image with Transparent Background:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Background Color Changer - Replace Background Free",
      metaDescription: "Change transparent photo background to solid white or custom color online for free.",
      overview: "Fill transparent background pixels with custom solid colors.",
      useCases: ["Convert transparent PNG logo to white backdrop for Amazon"],
      keyFeatures: ["Color picker", "White studio backdrop", "Instant fill"],
      howToUseSteps: ["Upload image.", "Pick background color.", "Download image."],
      faqs: [{ question: "Can I set a white background for Amazon product photos?", answer: "Yes, pick #FFFFFF white." }]
    }
  },

  // 50. Image Color Extractor (Eyedropper)
  {
    id: "color-picker",
    slug: "color-picker",
    name: "Image Color Extractor",
    tagline: "Pick exact pixel colors from photos with HEX, RGB, HSL, and CMYK codes.",
    description: "Interactive eyedropper tool to extract exact color codes from any pixel in uploaded images.",
    category: "image",
    iconName: "Eye",
    tags: ["color picker", "eyedropper", "hex", "rgb", "hsl", "cmyk"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3900,
    usageCount: 175000,
    inputLabel: "Upload Image for Color Picker:",
    inputPlaceholder: "Select image file to pick colors...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Color Extractor - Pick HEX & RGB Colors from Photos",
      metaDescription: "Click any pixel on photos to extract exact HEX, RGB, HSL, and CMYK color codes online for free.",
      overview: "Interactive pixel color eyedropper tool.",
      useCases: ["Match web design colors from screenshots", "Extract UI theme colors"],
      keyFeatures: ["1-click eyedropper", "HEX, RGB, HSL, CMYK codes", "Copy code button"],
      howToUseSteps: ["Upload photo.", "Hover and click any pixel.", "Copy HEX code."],
      faqs: [{ question: "How accurate is the color code?", answer: "It reads exact raw pixel RGBA values." }]
    }
  },

  // 51. Dominant Color Extractor
  {
    id: "dominant-color-extractor",
    slug: "dominant-color-extractor",
    name: "Dominant Color Extractor",
    tagline: "Extract top dominant colors and percentage coverage from photos.",
    description: "Analyze photos to extract top dominant colors with area percentage coverage and color chips.",
    category: "image",
    iconName: "Eye",
    tags: ["dominant color", "histogram", "color analysis", "palette"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2200,
    usageCount: 92000,
    inputLabel: "Upload Photo for Color Analysis:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Dominant Color Extractor - Analyze Photo Color Distribution",
      metaDescription: "Extract top dominant colors and coverage percentages from photos online for free.",
      overview: "Analyze primary color distribution in images.",
      useCases: ["UI design color matching", "Artwork color breakdown"],
      keyFeatures: ["Dominant color ranking", "Percentage coverage", "HEX & RGB copy"],
      howToUseSteps: ["Upload photo.", "View dominant color chips.", "Copy color codes."],
      faqs: [{ question: "How many dominant colors are extracted?", answer: "Top 8 dominant colors are displayed." }]
    }
  },

  // 52. Color Palette Generator
  {
    id: "palette-generator",
    slug: "palette-generator",
    name: "Color Palette Generator",
    tagline: "Generate beautiful color palettes from uploaded images.",
    description: "Generate 6-10 color palettes from photos with PNG swatch download and CSS variable export.",
    category: "image",
    iconName: "Sparkles",
    tags: ["palette", "color palette", "css variables", "generator"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3600,
    usageCount: 165000,
    inputLabel: "Upload Photo for Palette Generation:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Color Palette Generator - Generate Palettes from Images",
      metaDescription: "Generate color palettes from photos online for free. Export PNG palette swatch card or CSS variables.",
      overview: "Extract harmonious color palettes from inspiration photos.",
      useCases: ["Brand identity design", "Web color scheme creation"],
      keyFeatures: ["6-10 color palette", "PNG swatch download", "CSS variables snippet"],
      howToUseSteps: ["Upload photo.", "View generated palette.", "Download swatch PNG or copy CSS."],
      faqs: [{ question: "Can I copy CSS variables?", answer: "Yes, 1-click CSS variable export is provided." }]
    }
  },

  // 53. Image to Base64
  {
    id: "image-to-base64",
    slug: "image-to-base64",
    name: "Image to Base64 Converter",
    tagline: "Convert images into Base64 Data URI strings and HTML img tags.",
    description: "Convert image files into Base64 encoded Data URIs (`data:image/png;base64,...`), HTML `<img>` tags, and CSS background code.",
    category: "image",
    iconName: "RefreshCw",
    tags: ["base64", "data uri", "encode", "html img"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3300,
    usageCount: 145000,
    inputLabel: "Upload Image to Encode:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image to Base64 Converter - Encode Photos to Data URI",
      metaDescription: "Convert images to Base64 Data URI strings online for free. Copy HTML <img> tag or CSS snippet.",
      overview: "Encode image files into inline Base64 data URIs.",
      useCases: ["Embed inline images in HTML/CSS", "Email template image inline embedding"],
      keyFeatures: ["Base64 Data URI string", "HTML <img> snippet", "CSS background snippet", "TXT file download"],
      howToUseSteps: ["Upload image.", "Copy Base64 string or HTML tag."],
      faqs: [{ question: "What is a Data URI?", answer: "A Data URI embeds file binary data directly into text strings." }]
    }
  },

  // 54. Base64 to Image
  {
    id: "base64-to-image",
    slug: "base64-to-image",
    name: "Base64 to Image Decoder",
    tagline: "Decode Base64 Data URIs back into viewable and downloadable images.",
    description: "Decode Base64 strings or Data URIs back into PNG, JPG, or WEBP image files.",
    category: "image",
    iconName: "RefreshCw",
    tags: ["base64", "decode", "data uri", "image"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2500,
    usageCount: 108000,
    inputLabel: "Paste Base64 Data URI String:",
    inputPlaceholder: "Paste data:image/png;base64,... string here...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Base64 to Image Decoder - Decode Data URI to Photo",
      metaDescription: "Decode Base64 string back into downloadable image files online for free.",
      overview: "Decode Base64 text strings back into photo files.",
      useCases: ["Preview Base64 encoded images from API responses"],
      keyFeatures: ["Instant decoder", "Browser image preview", "PNG/JPG download"],
      howToUseSteps: ["Paste Base64 string.", "Preview image.", "Download file."],
      faqs: [{ question: "Does it validate Base64 string?", answer: "Yes, it validates format and MIME type." }]
    }
  },

  // 55. Data URI Generator
  {
    id: "data-uri-generator",
    slug: "data-uri-generator",
    name: "Data URI Generator",
    tagline: "Generate optimized CSS and JS inline Data URIs.",
    description: "Generate clean inline Data URIs for CSS stylesheets and web applications.",
    category: "image",
    iconName: "RefreshCw",
    tags: ["data uri", "inline", "css", "generator"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1400,
    usageCount: 56000,
    inputLabel: "Upload Image File:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Data URI Generator - Generate Inline CSS Image Code",
      metaDescription: "Generate optimized Data URIs for CSS and HTML online for free.",
      overview: "Convert images to clean inline CSS Data URIs.",
      useCases: ["Inline background images in CSS"],
      keyFeatures: ["Data URI string", "CSS class code", "1-click copy"],
      howToUseSteps: ["Upload image.", "Copy Data URI."],
      faqs: [{ question: "Is Data URI good for small icons?", answer: "Yes, it eliminates HTTP request overhead for small icons." }]
    }
  },

  // 56. Thumbnail Generator
  {
    id: "thumbnail-creator",
    slug: "thumbnail-creator",
    name: "Thumbnail Generator",
    tagline: "Generate custom thumbnails in standard web & YouTube dimensions.",
    description: "Generate crisp image thumbnails with cropping, background padding, and resolution presets.",
    category: "image",
    iconName: "Image",
    tags: ["thumbnail", "generator", "preview", "youtube"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2900,
    usageCount: 122000,
    inputLabel: "Upload Photo for Thumbnail:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Thumbnail Generator - Create Web & Video Thumbnails",
      metaDescription: "Generate custom thumbnails online for free. YouTube 1280x720, Web 300x300, Small 150x150 presets.",
      overview: "Create clean video and web article thumbnails.",
      useCases: ["YouTube video thumbnails", "Blog article thumbnail creation"],
      keyFeatures: ["Standard thumbnail presets", "Contain or cover fit modes", "Instant download"],
      howToUseSteps: ["Upload photo.", "Select thumbnail preset.", "Download thumbnail."],
      faqs: [{ question: "What is YouTube thumbnail size?", answer: "1280 x 720 pixels (16:9 ratio)." }]
    }
  },

  // 57. Image Collage Maker
  {
    id: "collage-maker",
    slug: "collage-maker",
    name: "Image Collage Maker",
    tagline: "Combine multiple photos into custom grid collages.",
    description: "Combine multiple photos into grid collages with customizable columns, gap spacing, and background color.",
    category: "image",
    iconName: "Layers",
    tags: ["collage", "combine", "grid", "photos", "maker"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3700,
    usageCount: 160000,
    inputLabel: "Upload Multiple Photos for Collage:",
    inputPlaceholder: "Select 2 or more photos...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Collage Maker - Combine Photos into Grid Free",
      metaDescription: "Combine multiple photos into beautiful grid collages online for free.",
      overview: "Arrange photos in multi-column grid collages.",
      useCases: ["Social media photo collages", "Product showcase grids"],
      keyFeatures: ["Custom column count", "Gap spacing slider", "Background color picker", "HD collage export"],
      howToUseSteps: ["Upload multiple photos.", "Set columns and gap.", "Download collage image."],
      faqs: [{ question: "How many photos can I add?", answer: "Upload up to 16 photos at once." }]
    }
  },

  // 58. Image Grid Maker
  {
    id: "image-grid-maker",
    slug: "image-grid-maker",
    name: "Image Grid Maker",
    tagline: "Split single photo into NxM grid blocks for Instagram.",
    description: "Split photos into 3x3 or custom grid slices for Instagram grid posts.",
    category: "image",
    iconName: "Layers",
    tags: ["grid", "instagram grid", "split", "tiles"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2200,
    usageCount: 94000,
    inputLabel: "Upload Photo to Grid Split:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Grid Maker - Split Photo into Instagram 3x3 Grid",
      metaDescription: "Split photos into 3x3 or 3x1 grid slices online for Instagram grid layouts. Download ZIP.",
      overview: "Split photos into equal grid tiles for Instagram feed layouts.",
      useCases: ["Instagram 9-grid profile banners"],
      keyFeatures: ["3x3, 3x2, 3x1 grid presets", "Individual tile export", "ZIP download"],
      howToUseSteps: ["Upload photo.", "Choose grid layout.", "Download tile ZIP."],
      faqs: [{ question: "Are tiles numbered in order?", answer: "Yes, exported files are named in posting order." }]
    }
  },

  // 59. Image Contact Sheet
  {
    id: "image-contact-sheet",
    slug: "image-contact-sheet",
    name: "Image Contact Sheet Generator",
    tagline: "Generate photographer contact sheets with metadata labels.",
    description: "Generate photographer contact sheets listing thumbnails of multiple images with filenames and dimension labels.",
    category: "image",
    iconName: "Layers",
    tags: ["contact sheet", "photographer", "thumbnails", "proofs"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1300,
    usageCount: 52000,
    inputLabel: "Upload Multiple Photos:",
    inputPlaceholder: "Select photos for contact sheet...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Contact Sheet Generator - Photography Proof Sheet",
      metaDescription: "Generate photographer contact sheets with filenames and dimensions online for free.",
      overview: "Create clean contact proof sheets for clients.",
      useCases: ["Photographer client proofing"],
      keyFeatures: ["Thumbnail grid", "Filename labels", "Dimension badges"],
      howToUseSteps: ["Upload photos.", "Generate contact sheet.", "Download."],
      faqs: [{ question: "Is contact sheet printable?", answer: "Yes, it exports as a high resolution image." }]
    }
  },

  // 60. Meme Generator
  {
    id: "meme-generator",
    slug: "meme-generator",
    name: "Meme Generator",
    tagline: "Add Top and Bottom Impact text to photos.",
    description: "Create classic memes with Top Text and Bottom Text in Impact font with thick outline.",
    category: "image",
    iconName: "Sparkles",
    tags: ["meme", "generator", "impact font", "humor"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 4500,
    usageCount: 230000,
    inputLabel: "Upload Photo or Meme Template:",
    inputPlaceholder: "Select photo to meme-ify...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Meme Generator - Create Memes Free Online",
      metaDescription: "Create memes online for free. Add top and bottom text in classic Impact font.",
      overview: "Create viral memes easily with top and bottom text overlay.",
      useCases: ["Social media humor", "Viral marketing content"],
      keyFeatures: ["Classic Impact font", "Thick black text outline", "Custom text color & size", "Instant download"],
      howToUseSteps: ["Upload photo.", "Enter Top and Bottom text.", "Download meme image."],
      faqs: [{ question: "Is there any watermark on memes?", answer: "No, 100% watermark free." }]
    }
  },

  // 61. Social Media Image Resizer
  {
    id: "social-media-resizer",
    slug: "social-media-resizer",
    name: "Social Media Image Resizer",
    tagline: "Resize images to exact dimensions for all social media platforms.",
    description: "One-click resizer with preset dimensions for YouTube, Instagram, Facebook, Twitter/X, and LinkedIn.",
    category: "image",
    iconName: "Sliders",
    tags: ["social media", "resizer", "instagram", "youtube", "facebook", "twitter"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3800,
    usageCount: 170000,
    inputLabel: "Upload Photo for Social Media Resizing:",
    inputPlaceholder: "Select photo file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Social Media Image Resizer - All Platform Presets",
      metaDescription: "Resize images for Instagram, YouTube, Facebook, Twitter, and LinkedIn online for free.",
      overview: "Resize photos to current social media dimension specs instantly.",
      useCases: ["Social media campaign graphics publishing"],
      keyFeatures: ["Instagram, YouTube, Facebook, Twitter, LinkedIn presets", "Fit or fill background blur"],
      howToUseSteps: ["Upload photo.", "Select platform preset.", "Download resized graphic."],
      faqs: [{ question: "Are dimensions up to date?", answer: "Yes, all platform specs are updated." }]
    }
  },

  // 62. YouTube Thumbnail Resizer
  {
    id: "youtube-thumbnail-resizer",
    slug: "youtube-thumbnail-resizer",
    name: "YouTube Thumbnail Resizer",
    tagline: "Resize photos to exact 1280x720 16:9 YouTube thumbnail spec.",
    description: "Resize and frame photos to exact 1280x720 pixels (16:9) with blurred background padding option.",
    category: "image",
    iconName: "Image",
    tags: ["youtube", "thumbnail", "resizer", "1280x720"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3100,
    usageCount: 138000,
    inputLabel: "Upload Image for YouTube Thumbnail:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "YouTube Thumbnail Resizer - 1280x720 16:9 Preset",
      metaDescription: "Resize photos to exact 1280x720 YouTube thumbnail dimensions online for free.",
      overview: "Resize photos to 1280x720 16:9 YouTube thumbnail standard.",
      useCases: ["YouTube video cover image creation"],
      keyFeatures: ["1280x720 16:9 canvas", "Safe zone guide", "HD output"],
      howToUseSteps: ["Upload image.", "Process.", "Download YouTube thumbnail."],
      faqs: [{ question: "Does it prevent black side bars?", answer: "Yes, select 'Fill Canvas' or 'Blurred Backdrop'." }]
    }
  },

  // 63. Instagram Image Resizer
  {
    id: "instagram-resizer",
    slug: "instagram-resizer",
    name: "Instagram Image Resizer",
    tagline: "Resize photos to Instagram Square (1:1), Portrait (4:5), and Story (9:16).",
    description: "Resize photos to Instagram Square (1080x1080), Portrait (1080x1350), and Story/Reels (1080x1920).",
    category: "image",
    iconName: "Image",
    tags: ["instagram", "resizer", "square", "portrait", "story"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3600,
    usageCount: 160000,
    inputLabel: "Upload Image for Instagram:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Instagram Image Resizer - Square, Portrait & Story Presets",
      metaDescription: "Resize images to Instagram Square (1080x1080), Portrait (1080x1350), and Story (1080x1920) online for free.",
      overview: "Resize photos for Instagram feeds and stories cleanly.",
      useCases: ["Instagram feed and reels post formatting"],
      keyFeatures: ["Square 1080x1080", "Portrait 1080x1350", "Story 1080x1920", "Backdrop fill"],
      howToUseSteps: ["Upload photo.", "Pick Instagram format.", "Download."],
      faqs: [{ question: "What is Instagram portrait ratio?", answer: "4:5 ratio (1080x1350 pixels)." }]
    }
  },

  // 64. Facebook Image Resizer
  {
    id: "facebook-resizer",
    slug: "facebook-resizer",
    name: "Facebook Image Resizer",
    tagline: "Resize images for Facebook Cover, Post, and Event banners.",
    description: "Resize photos for Facebook Cover (820x312), Post (1200x630), and Event cover banners.",
    category: "image",
    iconName: "Image",
    tags: ["facebook", "resizer", "cover", "post"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2400,
    usageCount: 102000,
    inputLabel: "Upload Photo for Facebook:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Facebook Image Resizer - Cover Photo & Post Presets",
      metaDescription: "Resize photos for Facebook Cover and Post dimensions online for free.",
      overview: "Resize graphics for Facebook pages and covers.",
      useCases: ["Facebook page cover and post formatting"],
      keyFeatures: ["Cover 820x312", "Post 1200x630", "Event 1920x1005"],
      howToUseSteps: ["Upload photo.", "Select Facebook preset.", "Download."],
      faqs: [{ question: "Will Facebook crop my cover image?", answer: "Using 820x312 prevents unwanted cropping." }]
    }
  },

  // 65. Twitter/X Image Resizer
  {
    id: "twitter-resizer",
    slug: "twitter-resizer",
    name: "Twitter/X Image Resizer",
    tagline: "Resize images for Twitter Post (1200x675) and Header (1500x500).",
    description: "Resize photos for Twitter/X Posts (1200x675) and Header Banners (1500x500).",
    category: "image",
    iconName: "Image",
    tags: ["twitter", "x", "resizer", "header", "post"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2200,
    usageCount: 96000,
    inputLabel: "Upload Photo for Twitter/X:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Twitter/X Image Resizer - Post & Header Presets",
      metaDescription: "Resize images for Twitter/X posts and headers online for free.",
      overview: "Resize photos to Twitter/X banner and post specifications.",
      useCases: ["Twitter header and post image prep"],
      keyFeatures: ["Header 1500x500", "Post 1200x675"],
      howToUseSteps: ["Upload image.", "Select Twitter preset.", "Download."],
      faqs: [{ question: "What is Twitter header dimension?", answer: "1500 x 500 pixels (3:1 aspect ratio)." }]
    }
  },

  // 66. LinkedIn Image Resizer
  {
    id: "linkedin-resizer",
    slug: "linkedin-resizer",
    name: "LinkedIn Image Resizer",
    tagline: "Resize images for LinkedIn Cover (1584x396) and Post (1200x627).",
    description: "Resize graphics for LinkedIn Cover banners (1584x396) and feed posts (1200x627).",
    category: "image",
    iconName: "Image",
    tags: ["linkedin", "resizer", "banner", "post"],
    isTrending: false,
    isPopular: true,
    rating: 4.8,
    ratingCount: 2100,
    usageCount: 91000,
    inputLabel: "Upload Photo for LinkedIn:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "LinkedIn Image Resizer - Banner & Post Presets",
      metaDescription: "Resize photos for LinkedIn banner covers and posts online for free.",
      overview: "Resize professional graphics for LinkedIn profiles and pages.",
      useCases: ["LinkedIn profile background banner formatting"],
      keyFeatures: ["Banner 1584x396", "Post 1200x627"],
      howToUseSteps: ["Upload graphic.", "Select LinkedIn preset.", "Download."],
      faqs: [{ question: "What is LinkedIn background cover size?", answer: "1584 x 396 pixels." }]
    }
  },

  // 67. Image Comparison Tool
  {
    id: "image-comparison-tool",
    slug: "image-comparison-tool",
    name: "Image Comparison Tool",
    tagline: "Interactive split-screen slider to compare before and after photos.",
    description: "Upload two images (Before vs After) and compare them with an interactive drag split-screen slider.",
    category: "image",
    iconName: "Eye",
    tags: ["comparison", "before after", "split screen", "slider"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 3100,
    usageCount: 130000,
    inputLabel: "Upload Image 1 (Before) and Image 2 (After):",
    inputPlaceholder: "Select 2 images to compare...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Comparison Tool - Split Screen Before & After Slider",
      metaDescription: "Compare two images with an interactive split-screen slider online for free.",
      overview: "Interactive side-by-side and split-screen photo comparison tool.",
      useCases: ["Photo editing before/after showcase", "AI image restoration comparison"],
      keyFeatures: ["Interactive split slider", "Side-by-side mode", "HD side sync"],
      howToUseSteps: ["Upload Before and After images.", "Drag comparison slider."],
      faqs: [{ question: "Can I embed comparison slider?", answer: "Yes, view live split-screen slider in browser." }]
    }
  },

  // 68. Image Difference Checker
  {
    id: "image-difference-checker",
    slug: "image-difference-checker",
    name: "Image Difference Checker",
    tagline: "Pixel-by-pixel difference highlighter and similarity score.",
    description: "Compare two images pixel-by-pixel, highlighting changed pixels in red and calculating exact percentage similarity score.",
    category: "image",
    iconName: "Eye",
    tags: ["diff", "difference", "pixel compare", "similarity"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 2800,
    usageCount: 115000,
    inputLabel: "Upload Image 1 and Image 2:",
    inputPlaceholder: "Select 2 images...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Difference Checker - Pixel Delta & Similarity Score",
      metaDescription: "Check pixel-by-pixel differences between two images online for free. Highlights changes in red.",
      overview: "Pixel-by-pixel diff engine highlighting modified pixels.",
      useCases: ["Detect subtle image edits or compression artifacts", "Quality assurance testing"],
      keyFeatures: ["Pixel delta highlighting", "Similarity % score", "Diff overlay view"],
      howToUseSteps: ["Upload two photos.", "View highlighted pixel diff map.", "Inspect similarity score."],
      faqs: [{ question: "What does red highlighting mean?", answer: "Red pixels indicate where the two images differ." }]
    }
  },

  // 69. Image Preview Generator
  {
    id: "image-preview-generator",
    slug: "image-preview-generator",
    name: "Image Preview Generator",
    tagline: "Generate low-res placeholder previews and LQIP Data URIs.",
    description: "Generate low-quality image placeholder (LQIP) blurred previews for progressive web loading.",
    category: "image",
    iconName: "Image",
    tags: ["preview", "lqip", "placeholder", "blur preview"],
    isTrending: false,
    isPopular: false,
    rating: 4.7,
    ratingCount: 1200,
    usageCount: 49000,
    inputLabel: "Upload Image:",
    inputPlaceholder: "Select image file...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Image Preview Generator - LQIP Blur Placeholder Generator",
      metaDescription: "Generate LQIP blurred image placeholders online for free.",
      overview: "Generate tiny blurred previews for website lazy loading.",
      useCases: ["Next.js & React image placeholder blur-up effect"],
      keyFeatures: ["Tiny Data URI (< 1 KB)", "Blurred preview SVG/PNG"],
      howToUseSteps: ["Upload image.", "Copy LQIP Data URI."],
      faqs: [{ question: "What is LQIP?", answer: "Low Quality Image Placeholder used for smooth lazy-loading." }]
    }
  },

  // 70. Screenshot Cropper
  {
    id: "screenshot-cropper",
    slug: "screenshot-cropper",
    name: "Screenshot Cropper & Frame",
    tagline: "Crop screenshots and wrap with macOS browser frame mockups.",
    description: "Crop screenshots and wrap them in elegant macOS browser window frames with drop shadow and gradient backdrops.",
    category: "image",
    iconName: "Scissors",
    tags: ["screenshot", "cropper", "browser frame", "mockup"],
    isTrending: true,
    isPopular: true,
    rating: 5.0,
    ratingCount: 3900,
    usageCount: 170000,
    inputLabel: "Upload Screenshot:",
    inputPlaceholder: "Select screenshot image...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "Screenshot Cropper & Browser Frame Mockup Generator",
      metaDescription: "Crop screenshots and wrap them in elegant macOS browser frames with drop shadows online for free.",
      overview: "Turn raw screenshots into polished product mockups.",
      useCases: ["App store marketing graphics", "SaaS product feature screenshots"],
      keyFeatures: ["macOS window frame header", "Soft drop shadow", "Gradient backdrop", "HD PNG download"],
      howToUseSteps: ["Upload screenshot.", "Crop bounds & select backdrop.", "Download mockup image."],
      faqs: [{ question: "Can I customize the backdrop color?", answer: "Yes, pick gradient or solid backdrop fill." }]
    }
  },

  // 71. SVG Code Optimizer
  {
    id: "svg-optimizer",
    slug: "svg-optimizer",
    name: "SVG Code Optimizer",
    tagline: "Clean, compress, and minify SVG vector graphics markup online.",
    description: "Optimize SVG file size by stripping unnecessary XML metadata, comments, editor tags, and redundant whitespace in real time.",
    category: "image",
    iconName: "Zap",
    tags: ["svg", "optimizer", "vector", "minify", "cleaner", "compressor"],
    isTrending: true,
    isPopular: true,
    rating: 4.9,
    ratingCount: 1450,
    usageCount: 56000,
    inputLabel: "Paste SVG Code or Upload File:",
    inputPlaceholder: "Paste <svg> XML markup here...",
    optionsConfig: {},
    seoContent: {
      metaTitle: "SVG Code Optimizer - Minify & Clean SVG Vector Graphics",
      metaDescription: "Optimize SVG code online for free. Strip XML metadata, editor tags, and comments to reduce vector file sizes for fast website load times.",
      overview: "SVG Code Optimizer cleans up bloated SVG markup produced by graphics editors like Figma, Illustrator, and Inkscape.",
      useCases: ["Compress vector icons for web apps", "Clean up Illustrator & Inkscape SVG exports", "Reduce web page payload size"],
      keyFeatures: ["Strips XML declarations & DOCTYPE", "Removes editor metadata & comments", "Reduces decimal precision in paths", "Calculates percentage size savings"],
      howToUseSteps: ["Paste SVG markup or select SVG file.", "View cleaned SVG code and preview.", "Copy or download optimized SVG."],
      faqs: [{ question: "Does it alter vector image quality?", answer: "No, visual geometry is strictly preserved while removing hidden bloat." }]
    }
  }
];
