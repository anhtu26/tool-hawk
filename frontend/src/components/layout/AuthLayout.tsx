import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Authentication layout component
 * Used for login, registration, and other auth-related pages
 */
const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Tool Hawk</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            CNC Machine Shop Tool Library
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
