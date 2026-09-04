export interface Author {
  id: string;
  slug: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  expertise: string[];
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
  };
  articlesCount: number;
}

export const AUTHORS_DATA: Author[] = [
  {
    id: "0",
    slug: "hamza",
    name: "Hamza",
    role: "Founder, Web Developer & Digital Marketing Expert",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Hamza is the Founder of Mehzan Digital and a Web Developer and Digital Marketing Expert with 5+ years of experience in web development and digital marketing. He currently operates his own agency focused on web development and digital marketing, leading technical architecture, client-side web utility engineering, and search optimization.",
    expertise: [
      "Web Development (5+ Years)",
      "Digital Marketing & SEO",
      "Agency Operations & Strategy",
      "Full-Stack Web Utilities",
      "Client-Side Engineering"
    ],
    socials: {
      twitter: "",
      github: "",
      linkedin: "",
    },
    articlesCount: 18,
  },
  {
    id: "1",
    slug: "alex-rivera",
    name: "Alex Rivera",
    role: "Lead Systems Engineer & Security Researcher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    bio: "Alex has over 10 years of software engineering experience specializing in high-performance browser utility engines, OWASP security architectures, and edge runtime optimization. At Mehzan Tools Hub, Alex oversees performance and sub-100ms execution latency.",
    expertise: ["Browser Utility Engines", "OWASP Top 10 Security", "Cloud Run Container Optimization", "TypeScript"],
    socials: {
      twitter: "",
      github: "",
      linkedin: "",
    },
    articlesCount: 12,
  },
  {
    id: "2",
    slug: "sophia-chen",
    name: "Sophia Chen",
    role: "Creative Director & UX Architect",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    bio: "Sophia is an expert in visual media compression, image optimization formats, and UI/UX design. She tests and benchmarks modern WebP and AVIF encoders to publish comprehensive web performance guides.",
    expertise: ["Image Compression", "WebP & AVIF Formats", "UX Architecture", "Design Systems"],
    socials: {
      twitter: "",
      linkedin: "",
    },
    articlesCount: 8,
  },
  {
    id: "3",
    slug: "marcus-vance",
    name: "Marcus Vance",
    role: "SEO Growth Lead & Webmaster",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bio: "Marcus specializes in technical SEO, structured JSON-LD schema engineering, Core Web Vitals optimization, and Google AdSense compliance. He works to ensure all utility tools meet strict Webmaster quality standards.",
    expertise: ["Technical SEO", "JSON-LD Schema", "Core Web Vitals", "AdSense Compliance"],
    socials: {
      twitter: "",
      github: "",
    },
    articlesCount: 15,
  },
  {
    id: "4",
    slug: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
    role: "Senior Quantitative Researcher & Financial Analyst",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    bio: "Dr. Priya Sharma holds a Ph.D. in Applied Mathematics and financial modeling. She leads algorithmic testing and accuracy auditing for financial calculators, loan formulas, and mathematical converters on Mehzan Tools Hub.",
    expertise: ["Applied Mathematics", "Financial Algorithms", "Calculator Precision", "Data Science"],
    socials: {
      linkedin: "",
    },
    articlesCount: 10,
  },
];
