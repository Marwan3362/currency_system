import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en", 
    preload: ["en", "ar"],
    backend: { loadPath: "./locales/{{lng}}.json" }, 
    detection: { order: ["querystring", "cookie", "header"], caches: ["cookie"] }
  });

export default i18next;
