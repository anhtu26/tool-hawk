import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Main layout component for the application
 * Includes header, sidebar, and main content area
 */
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Tool Hawk</span>
            </a>
          </div>
          <nav className="flex-1">
            {/* Navigation links will go here */}
          </nav>
          <div className="flex items-center space-x-4">
            {/* User menu will go here */}
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6">
            {/* Sidebar navigation will go here */}
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
