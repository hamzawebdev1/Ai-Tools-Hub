import React, { useState } from "react";
import { generateSeoAltText } from "../../services/seoService";

interface SeoImageProps {
  src: string;
  alt?: string;
  title?: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "2/1" | "auto";
  priority?: boolean;
  itemData?: { name?: string; title?: string; category?: string; tagline?: string };
  width?: number;
  height?: number;
}

export const SeoImage: React.FC<SeoImageProps> = ({
  src,
  alt,
  title,
  className = "",
  aspectRatio = "16/9",
  priority = false,
  itemData,
  width,
  height,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const calculatedAlt = alt || (itemData ? generateSeoAltText(itemData) : title || "Utility Tools Hub Visual Content");

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "16/9": return "aspect-video";
      case "4/3": return "aspect-[4/3]";
      case "1/1": return "aspect-square";
      case "2/1": return "aspect-[2/1]";
      case "auto": return "";
      default: return "aspect-video";
    }
  };

  const fallbackSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";

  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-xl ${getAspectClass()} ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
      )}

      <img
        src={hasError ? fallbackSrc : src}
        alt={calculatedAlt}
        title={title || calculatedAlt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};
