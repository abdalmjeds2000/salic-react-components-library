import React, { createContext, useContext, ReactNode } from 'react';

// Configuration Types
interface AppConfig {
  apiUrl: string; // e.g. https://api.example.com/api
  uploaderUrl: string; // e.g. https://api.example.com/uploader
  filesUrl: string; // e.g. https://api.example.com/files
  tenantUrl: string; // e.g. https://contoso.sharepoint.com
}

const AppConfigContext = createContext<AppConfig | undefined>(undefined);

// Custom hook to access the configuration
export function useAppConfig(): AppConfig {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
}

// Provider component
interface AppConfigProviderProps {
  children: ReactNode;
  config: AppConfig;
}
export function AppConfigProvider({ children, config }: AppConfigProviderProps) {
  return (
    <AppConfigContext.Provider value={config}>{children}</AppConfigContext.Provider>
  );
}
