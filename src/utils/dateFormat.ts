import { LanguageType } from "AppContext";

export const formatDate = (date: Date, lang: LanguageType) => {
  const locale = {
    en: "en-US",
    pt: "pt-BR",
    es: "es-ES",
  }[lang];

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
