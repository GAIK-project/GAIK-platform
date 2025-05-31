import React from "react";

export interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  sidebar,
  footer,
  className = "",
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {header && <header className="flex-shrink-0">{header}</header>}

      <div className="flex-1 flex">
        {sidebar && (
          <aside className="flex-shrink-0 w-64 bg-gray-50 border-r border-gray-200">
            {sidebar}
          </aside>
        )}

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  );
};
