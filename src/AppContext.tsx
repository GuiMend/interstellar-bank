import en from "languages/en.json";
import { Translation } from "languages/translation";
import { createContext, useContext } from "react";

type ColorScheme = "light" | "dark";

type LanguageType = "en" | "pt" | "es";

type Alert = {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
};

type AppContextType = {
  colorScheme: ColorScheme;
  toggleColorScheme?: () => void;
  t: Translation;
  language: LanguageType;
  updateLanguage?: (lang: LanguageType) => void;
  exchangeRate?: number;
  setExchangeRate?: (rate: number) => void;
  showProVersion?: boolean;
  setShowProVersion?: (show: boolean) => void;
  showGlobalAlert: boolean;
  globalAlertContent?: Alert;
  updateGlobalAlert?: (content?: Alert) => void;
};

const LANGUAGE: Record<string, LanguageType> = {
  EN: "en",
  PT: "pt",
  ES: "es",
};

const AppContext = createContext<AppContextType>({
  colorScheme: "dark",
  t: en,
  language: LANGUAGE.EN,
  showProVersion: true,
  showGlobalAlert: false,
});

const useAppContext = () => useContext(AppContext);

export { AppContext, LANGUAGE, useAppContext };
export type { AppContextType, ColorScheme, LanguageType, Alert };
