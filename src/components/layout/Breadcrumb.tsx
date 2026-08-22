import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { navigateTo } from "../../services/routerService";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const handleHomeClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    navigateTo("/");
  };

  const handleItemClick = (item: BreadcrumbItem, e: React.MouseEvent) => {
    if (item.onClick) {
      item.onClick(e);
    } else if (item.href) {
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      navigateTo(item.href);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="py-2 px-1 my-2">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
        <li className="inline-flex items-center">
          <a
            href="/"
            onClick={handleHomeClick}
            className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="text-slate-400 dark:text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              {item.active ? (
                <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px] md:max-w-[320px] inline-block align-bottom" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || "#"}
                  onClick={(e) => handleItemClick(item, e)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[150px] inline-block align-bottom cursor-pointer"
                >
                  {item.label}
                </a>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
