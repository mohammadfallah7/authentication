"use client";

import { I18nProvider, Toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
  lang: string;
}

const client = new QueryClient();

export const Providers: React.FC<ProvidersProps> = ({ children, lang }) => {
  return (
    <I18nProvider locale={lang}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={client}>
          {children}
          <Toast.Provider placement="bottom end" />
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};
