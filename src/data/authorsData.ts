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
  };
  articlesCount: number;
}

export const AUTHORS_DATA: Author[] = [
  {
    id: "1",
    slug: "alex-rivera",
    name: "Alex Rivera",
    role: "Lead AI Engineer & Security Researcher",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Alex has over 10 years of software engineering experience specializing in large language model pipelines, OWASP security architectures, and edge runtime optimization. At AI Tools Hub, Alex oversees model fine-tuning and sub-300ms execution latency.",
    expertise: ["Large Language Models", "OWASP Top 10 Security", "Cloud Run Container Optimization", "TypeScript"],
    socials: {
      twitter: "https://twitter.com/example",
      github: "https://github.com/example",
      linkedin: "https://linkedin.com/example",
    },
    articlesCount: 12,
  },
  {
    id: "2",
    slug: "sophia-chen",
    name: "Sophia Chen",
    role: "Creative Director & Prompt Systems Engineer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    bio: "Sophia is an expert in visual prompt engineering, generative artwork synthesis, and UI/UX design. She tests and benchmarks modern diffusion models to publish comprehensive prompt structure guides.",
    expertise: ["Midjourney v6 & Flux", "Prompt Engineering", "UX Architecture", "Design Systems"],
    socials: {
      twitter: "https://twitter.com/example",
      linkedin: "https://linkedin.com/example",
    },
    articlesCount: 8,
  },
  {
    id: "3",
    slug: "marcus-vance",
    name: "Marcus Vance",
    role: "SEO Growth Lead & Webmaster",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    bio: "Marcus specializes in technical SEO, structured JSON-LD schema engineering, Core Web Vitals optimization, and Google AdSense compliance. He works to ensure all AI tools meet strict Webmaster quality standards.",
    expertise: ["Technical SEO", "JSON-LD Schema", "Core Web Vitals", "AdSense Compliance"],
    socials: {
      twitter: "https://twitter.com/example",
      github: "https://github.com/example",
    },
    articlesCount: 15,
  },
];
