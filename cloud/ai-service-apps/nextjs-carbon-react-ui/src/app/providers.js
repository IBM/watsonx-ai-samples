"use client";

import AppHeader from "@/components/AppHeader/AppHeader";
import { Theme } from "@carbon/react";
import { DeploymentProvider } from "../contexts/deployment-context";
import { AppProvider } from "../contexts/app-context";

export function Providers({ children }) {
  return (
    <DeploymentProvider>
      <AppProvider>
        <Theme theme="g100">
          <AppHeader />
        </Theme>
        {children}
      </AppProvider>
    </DeploymentProvider>
  );
}
