import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Authentication layout component
 * Used for login, registration, and other auth-related pages
 */
const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Tool Hawk</h1>
          <p className="text-sm text-muted-foreground">
            CNC Machine Shop Tool Library
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
