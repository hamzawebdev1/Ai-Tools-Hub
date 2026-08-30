import React, { useState, useEffect, useRef } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  placeholderHeight?: string;
  rootMargin?: string;
  className?: string;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  placeholderHeight = "200px",
  rootMargin = "300px 0px",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? (
        children
      ) : (
        <div
          style={{ minHeight: placeholderHeight }}
          className="w-full rounded-2xl bg-slate-100/50 dark:bg-slate-900/30 animate-pulse border border-slate-200/40 dark:border-slate-800/40"
        />
      )}
    </div>
  );
};
