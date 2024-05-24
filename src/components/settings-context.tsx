'use client';

import {
  createContext,
  useState,
  useContext,
} from "react";


interface Settings {
  user: string,
  password: string,
  host: string,
  port: number,
  database: string,
  connectionString?: string | undefined
}

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode}) => {
  const [settings, setSettings] = useState<Settings>({
    user: 'postgres',
    password: 'postgres',
    host: '0.0.0.0',
    port: 5432,
    database: 'sql_demo',
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);

  if (context ===  undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};