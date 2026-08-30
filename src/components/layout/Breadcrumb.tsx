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

  const handleItemClick = (item: BreadcrumbItem, href: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    if (item.onClick) {
      item.onClick(e);
    }
    if (href && href !== "#") {
      e.preventDefault();
      navigateTo(href);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="py-2 px-1 my-2">
      <ol
        className="flex items-center flex-wrap gap-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="inline-flex items-center"
        >
          <a
            href="/"
            onClick={handleHomeClick}
            itemProp="item"
            className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-indigo-500" />
            <span itemProp="name">Home</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>
        {items.map((item, index) => {
          const position = index + 2;
          const isLast = item.active || index === items.length - 1;
          const targetHref = item.href || (isLast ? undefined : "/tools");

          return (
            <React.Fragment key={index}>
              <li className="text-slate-400 dark:text-slate-600" aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="inline-flex items-center"
              >
                {isLast ? (
                  <span
                    className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px] md:max-w-[320px] inline-block align-bottom"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={targetHref || "/tools"}
                    onClick={(e) => handleItemClick(item, targetHref || "/tools", e)}
                    itemProp="item"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[150px] md:max-w-[250px] inline-block align-bottom cursor-pointer"
                  >
                    <span itemProp="name">{item.label}</span>
                  </a>
                )}
                <meta itemProp="position" content={position.toString()} />
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
