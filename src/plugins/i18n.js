import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import kz from "@/locales/kz.json";

const i18n = createI18n({
  locale: "ru",
  messages: {
    en,
    ru,
    kz,
  },
});

export default i18n;
