"use client";

import { I18nProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
  lang: string;
}

export const Providers: React.FC<ProvidersProps> = ({ children, lang }) => {
  return (
    <I18nProvider locale={lang}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </I18nProvider>
  );
};
