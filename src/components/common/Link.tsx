import React from "react";
import { navigateTo } from "../../services/routerService";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  onClick,
  replace = false,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Allow standard browser modifier keys (Ctrl+Click, Cmd+Click, Shift+Click, right click)
    if (
      !e.defaultPrevented &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.altKey &&
      e.button === 0 &&
      !props.target
    ) {
      e.preventDefault();
      navigateTo(href, replace);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
