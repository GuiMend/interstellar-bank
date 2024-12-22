import "@mantine/core/styles.css";

import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  AppContext,
  ColorScheme,
  LanguageType,
  LANGUAGE,
  Alert,
} from "AppContext";
import en from "languages/en.json";
import pt from "languages/pt.json";
import es from "languages/es.json";
import { useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import GlobalAlert from "components/GlobalAlert";

const queryClient = new QueryClient();
const theme = createTheme({});

const App = () => {
  const [lang, setLang] = useState<LanguageType>(LANGUAGE.EN);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const [exchangeRate, setExchangeRate] = useState<number>();
  const [showProVersion, setShowProVersion] = useState(true);
  const [showGlobalAlert, setShowGlobalAlert] = useState(false);
  const [globalAlertContent, setGlobalAlertContent] = useState<Alert>();

  const toggleColorScheme = () => {
    setColorScheme((current) => (current === "light" ? "dark" : "light"));
  };

  const updateGlobalAlert = (content?: Alert) => {
    setShowGlobalAlert(!!content);
    setGlobalAlertContent(content);
  };

  const languageConfig = useMemo(() => {
    switch (lang) {
      case LANGUAGE.PT:
        return { t: pt, language: LANGUAGE.PT };
      case LANGUAGE.ES:
        return { t: es, language: LANGUAGE.ES };
      default:
        return { t: en, language: LANGUAGE.EN };
    }
  }, [lang]);

  return (
    <AppContext.Provider
      value={{
        colorScheme,
        toggleColorScheme,
        ...languageConfig,
        updateLanguage: setLang,
        exchangeRate,
        setExchangeRate,
        showProVersion,
        setShowProVersion,
        showGlobalAlert,
        globalAlertContent,
        updateGlobalAlert,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ColorSchemeScript forceColorScheme={colorScheme} />
        <MantineProvider theme={theme} forceColorScheme={colorScheme}>
          <RouterProvider router={router} />
          {showGlobalAlert && <GlobalAlert />}
          <ReactQueryDevtools initialIsOpen={false} />
        </MantineProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default App;
