import axios from "axios";
import intl from "react-intl-universal";

interface Dictionary<T> {
  [Key: string]: T;
}

export const SUPPORTED_LOCALES: Dictionary<String> = {
  en: "en",
  fr: "fr",
};

export default () => {
  let currentLocale = intl.determineLocale({
    cookieLocaleKey: "lang",
  });
  if (!SUPPORTED_LOCALES[currentLocale]) {
    currentLocale = "fr";
  }

  return axios
    .get(`${process.env.PUBLIC_URL}/locales/${currentLocale}.json`)
    .then((res) => {
      return intl.init({
        currentLocale,
        locales: {
          [currentLocale]: res.data,
        },
      });
    });
};
