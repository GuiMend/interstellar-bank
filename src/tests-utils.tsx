import "@mantine/core/styles.css";
import "@testing-library/jest-dom/extend-expect";

import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContext, LANGUAGE } from "AppContext";
import en from "languages/en.json";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();
const theme = createTheme({});

const TestProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppContext.Provider
      value={{
        colorScheme: "light",
        language: LANGUAGE.EN,
        t: en,
        exchangeRate: 1.5,
        showProVersion: true,
        showGlobalAlert: false,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ColorSchemeScript forceColorScheme="light" />
        <MantineProvider theme={theme} forceColorScheme="light">
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default TestProvider;
