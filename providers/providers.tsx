"use client";

import { I18nProvider } from "@heroui/react";

interface ProvidersProps {
  children: React.ReactNode;
  lang: string;
}

export const Providers: React.FC<ProvidersProps> = ({ children, lang }) => {
  return <I18nProvider locale={lang}>{children}</I18nProvider>;
};
