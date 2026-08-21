import { AITool } from '../../types';

const rawPdfTools = [
  { id: 'pdf-merge', name: 'Merge PDF Documents', slug: 'pdf-merge', tagline: 'Combine multiple PDF files into one seamless document.' },
  { id: 'pdf-split', name: 'Split PDF Pages', slug: 'pdf-split', tagline: 'Extract single pages or ranges from any PDF document.' },
  { id: 'pdf-extract-pages', name: 'Extract PDF Pages', slug: 'pdf-extract-pages', tagline: 'Save specific pages from a PDF as a new standalone file.' },
  { id: 'pdf-delete-pages', name: 'Delete PDF Pages', slug: 'pdf-delete-pages', tagline: 'Remove unwanted pages from your PDF file in seconds.' },
  { id: 'pdf-reorder-pages', name: 'Reorder PDF Pages', slug: 'pdf-reorder-pages', tagline: 'Drag and re-arrange PDF page sequences effortlessly.' },
  { id: 'pdf-rotate', name: 'Rotate PDF Pages', slug: 'pdf-rotate', tagline: 'Rotate specific or all PDF pages 90, 180, or 270 degrees.' },
  { id: 'pdf-compress', name: 'Compress PDF Size', slug: 'pdf-compress', tagline: 'Reduce PDF file size while maintaining crystal clear quality.' },
  { id: 'pdf-protect', name: 'Protect & Encrypt PDF', slug: 'pdf-protect', tagline: 'Add password encryption and permissions lock to PDF files.' },
  { id: 'pdf-unlock', name: 'Unlock Password PDF', slug: 'pdf-unlock', tagline: 'Remove password restriction and unlock editing for PDFs.' },
  { id: 'pdf-watermark', name: 'Watermark PDF Document', slug: 'pdf-watermark', tagline: 'Add custom text or image watermarks over PDF pages.' },
  { id: 'pdf-watermark-text', name: 'Add Text Watermark to PDF', slug: 'pdf-watermark-text', tagline: 'Overlay customizable text, opacity, and rotation angles.' },
  { id: 'pdf-watermark-image', name: 'Add Image Watermark to PDF', slug: 'pdf-watermark-image', tagline: 'Overlay company logo or visual stamp on PDF pages.' },
  { id: 'pdf-page-numbers', name: 'Add Page Numbers to PDF', slug: 'pdf-page-numbers', tagline: 'Insert customizable header or footer page numbers.' },
  { id: 'pdf-header', name: 'Add Header to PDF', slug: 'pdf-header', tagline: 'Add custom top running header titles to all PDF pages.' },
  { id: 'pdf-footer', name: 'Add Footer to PDF', slug: 'pdf-footer', tagline: 'Add bottom disclaimers, copyright tags, or notes.' },
  { id: 'pdf-to-jpg', name: 'Convert PDF to JPG', slug: 'pdf-to-jpg', tagline: 'Turn every PDF page into high quality JPG image files.' },
  { id: 'pdf-to-png', name: 'Convert PDF to PNG', slug: 'pdf-to-png', tagline: 'Convert PDF pages to high-resolution transparent PNGs.' },
  { id: 'jpg-to-pdf', name: 'Convert JPG to PDF', slug: 'jpg-to-pdf', tagline: 'Combine JPG photos into a single formatted PDF document.' },
  { id: 'png-to-pdf', name: 'Convert PNG to PDF', slug: 'png-to-pdf', tagline: 'Convert transparent or solid PNG graphics into PDF.' },
  { id: 'images-to-pdf', name: 'Convert Images to PDF', slug: 'images-to-pdf', tagline: 'Combine JPG, PNG, WEBP, and BMP images into one PDF.' },
  { id: 'pdf-page-counter', name: 'PDF Page Counter & Metrics', slug: 'pdf-page-counter', tagline: 'Instantly count pages, words, and structural metrics in PDF.' },
  { id: 'pdf-metadata-viewer', name: 'PDF Metadata Viewer', slug: 'pdf-metadata-viewer', tagline: 'Inspect author, title, creation date, and producer tags.' },
  { id: 'pdf-metadata-editor', name: 'PDF Metadata Editor', slug: 'pdf-metadata-editor', tagline: 'Edit title, author, subject, and keyword metadata tags.' },
  { id: 'pdf-metadata-remover', name: 'PDF Metadata Remover', slug: 'pdf-metadata-remover', tagline: 'Sanitize hidden author data and metadata from PDF files.' },
  { id: 'pdf-extract-images', name: 'Extract Images from PDF', slug: 'pdf-extract-images', tagline: 'Export all high-resolution embedded images from PDF.' },
  { id: 'pdf-extract-text', name: 'Extract Text from PDF', slug: 'pdf-extract-text', tagline: 'Convert PDF content into raw searchable plain text.' },
  { id: 'pdf-preview', name: 'PDF Online Viewer & Preview', slug: 'pdf-preview', tagline: 'Render and read PDF documents securely in browser.' },
  { id: 'pdf-thumbnail-generator', name: 'PDF Thumbnail Generator', slug: 'pdf-thumbnail-generator', tagline: 'Generate cover page thumbnails and grid previews from PDF.' },
  { id: 'pdf-page-size-detector', name: 'PDF Page Size Detector', slug: 'pdf-page-size-detector', tagline: 'Detect page sizes in mm, pt, inches, A4, Letter, and Legal.' },
  { id: 'pdf-orientation-detector', name: 'PDF Orientation Detector', slug: 'pdf-orientation-detector', tagline: 'Check Portrait vs Landscape orientation per PDF page.' },
  { id: 'pdf-crop', name: 'Crop PDF Margins', slug: 'pdf-crop', tagline: 'Trim white margins and custom boundary boxes on PDF pages.' },
  { id: 'pdf-resize', name: 'Resize PDF Page Size', slug: 'pdf-resize', tagline: 'Change PDF layout size to A4, Letter, Legal, or Executive.' },
  { id: 'pdf-organizer', name: 'PDF Visual Page Organizer', slug: 'pdf-organizer', tagline: 'Drag, reorder, rotate, and delete pages visually.' },
  { id: 'pdf-booklet-creator', name: 'PDF Booklet Creator', slug: 'pdf-booklet-creator', tagline: 'Create 2-up double-sided printable booklet pages.' },
  { id: 'pdf-contact-sheet', name: 'PDF Contact Sheet Generator', slug: 'pdf-contact-sheet', tagline: 'Generate page thumbnail grid sheets (2x2, 3x3, 4x4).' },
  { id: 'pdf-print-layout', name: 'PDF Print Layout (N-Up)', slug: 'pdf-print-layout', tagline: 'Print 2-up, 4-up, or 9-up grid pages per sheet on PDF.' },
  { id: 'pdf-ocr-extractor', name: 'PDF OCR Text Extractor', slug: 'pdf-ocr-extractor', tagline: 'Extract text from scanned PDF images client-side.' },
  { id: 'pdf-grayscale', name: 'PDF Grayscale Converter', slug: 'pdf-grayscale', tagline: 'Convert colored PDF pages into black and white print style.' },
  { id: 'pdf-text-search', name: 'PDF Text Search & Inspector', slug: 'pdf-text-search', tagline: 'Search terms inside PDF with line numbers and snippets.' },
  { id: 'pdf-page-rotation-manager', name: 'PDF Page Rotation Manager', slug: 'pdf-page-rotation-manager', tagline: 'Rotate individual pages independently in your PDF.' },
  { id: 'pdf-duplicate-pages', name: 'Duplicate PDF Pages', slug: 'pdf-duplicate-pages', tagline: 'Duplicate specific or all pages inside a PDF document.' },
  { id: 'pdf-reverse-pages', name: 'Reverse PDF Page Order', slug: 'pdf-reverse-pages', tagline: 'Invert page sequence from last to first instantly.' },
  { id: 'pdf-to-webp', name: 'Convert PDF to WEBP', slug: 'pdf-to-webp', tagline: 'Convert PDF pages into modern high-efficiency WEBP image files.' },
  { id: 'webp-to-pdf', name: 'Convert WEBP to PDF', slug: 'webp-to-pdf', tagline: 'Convert WEBP photos into a clean formatted PDF document.' },
  { id: 'bmp-to-pdf', name: 'Convert BMP to PDF', slug: 'bmp-to-pdf', tagline: 'Convert Windows BMP bitmap files into standard PDF.' },
  { id: 'pdf-to-html', name: 'Convert PDF to HTML', slug: 'pdf-to-html', tagline: 'Convert PDF text and page layouts into structured HTML.' },
  { id: 'pdf-to-docx', name: 'Convert PDF to Word DOCX', slug: 'pdf-to-docx', tagline: 'Convert PDF files into editable Microsoft Word DOCX documents.' },
  { id: 'docx-to-pdf', name: 'Convert Word DOCX to PDF', slug: 'docx-to-pdf', tagline: 'Convert Microsoft Word (.docx) documents into styled PDF files.' },
  { id: 'csv-to-pdf', name: 'Convert CSV to PDF Table', slug: 'csv-to-pdf', tagline: 'Convert CSV spreadsheet tables into formatted PDF reports.' },
  { id: 'pdf-editor', name: 'PDF Editor & Annotator', slug: 'pdf-editor', tagline: 'Annotate PDF with custom text, highlighter, shapes, redaction, and stamps.' }
];

export const PDFTOOLS: AITool[] = rawPdfTools.map((item, idx) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  tagline: item.tagline,
  description: `${item.name} - ${item.tagline} Fast, high-precision processing running 100% locally in your browser.`,
  category: 'pdf',
  iconName: 'FileText',
  tags: ['pdf', 'document', 'online tool', 'free utility'],
  isTrending: idx < 5,
  isPopular: idx % 2 === 0,
  rating: Number((4.7 + (idx % 3) * 0.1).toFixed(1)),
  ratingCount: 1500 + idx * 85,
  usageCount: 50000 + idx * 3100,
  inputLabel: `Input File for ${item.name}:`,
  inputPlaceholder: `Select or upload PDF file for ${item.name}...`,
  optionsConfig: {},
  seoContent: {
    metaTitle: `${item.name} - Free Online PDF Tool`,
    metaDescription: `${item.name}. ${item.tagline} 100% free tool with instant client-side execution.`,
    overview: `${item.name} is designed to deliver instant, high-precision PDF document processing directly inside your browser.`,
    useCases: [
      `Automate workflow steps with ${item.name}`,
      'End-to-end data privacy without server uploads',
      'Cross-platform support for mobile, tablet, and desktop browsers',
      'One-click instant copy and download results'
    ],
    keyFeatures: [
      '100% Client-side fast execution',
      'No registration or API limits required',
      'High quality vector and pixel processing',
      'Dark and light theme support'
    ],
    howToUseSteps: [
      'Select or drag & drop your PDF file into the upload zone.',
      'Configure options such as page numbers, margins, or password.',
      'Click execute and download your processed PDF file.'
    ],
    faqs: [
      { question: 'Is this PDF tool completely free to use?', answer: 'Yes, access is 100% free with unlimited executions.' },
      { question: 'Is my uploaded PDF file secure and private?', answer: 'Yes, processing is local inside your browser. No files are retained.' }
    ]
  }
}));
