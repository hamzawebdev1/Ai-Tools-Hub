import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigateHome?: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigateHome }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="py-2 px-3 mb-6 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 backdrop-blur-sm transition-all"
    >
      <ol
        className="flex items-center flex-wrap gap-1.5"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center"
        >
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
            itemProp="item"
          >
            <Home className="w-3.5 h-3.5 text-indigo-500" />
            <span itemProp="name">Home</span>
          </button>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 2;

          return (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              {isLast ? (
                <span
                  className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[220px] sm:max-w-[400px]"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <button
                  onClick={item.onClick}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 truncate max-w-[180px]"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </button>
              )}
              <meta itemProp="position" content={position.toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
