import {createI18n} from 'vue-i18n';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import mZhCN from '@/locale/zh-cn';
import mEnUS from '@/locale/en-us';
import {changeLangAPI} from '@/api/home';

// language option
export const langOption = [
  {
    name: '简体中文',
    value: 'zhCN',
    locale: zhCN,
    backend: 'zh-hans',
    tcaptcha: 'zh-cn',
  },
  {
    name: 'English',
    value: 'enUS',
    locale: enUS,
    backend: 'en',
    tcaptcha: 'en',
  },
];

// local storage key
const userLangKey = 'user-language';

// default language
let mLocal = 'zhCN';
export let locale = zhCN;
export let tCaptchaLocale = 'zh-cn';

// change language
export const changeLang = async (value) => {
  let curLang = null;
  langOption.forEach((item) => {
    if (item.value === value) {
      curLang = item;
    }
  });
  locale = curLang.locale;
  mLocal = curLang.value;
  tCaptchaLocale = curLang.tcaptcha;
  await changeLangAPI(curLang.backend).then(() => {
    localStorage.setItem(userLangKey, value);
  });
};
export const changeLangAndReload = (value) => {
  changeLang(value).finally(() => window.location.reload());
};

// load language
const userLang = localStorage.getItem(userLangKey);
if (userLang) changeLang(userLang);

// i18n
const i18n = createI18n({
  locale: mLocal,
  fallbackLocale: 'enUS',
  legacy: false,
  messages: {
    zhCN: mZhCN,
    enUS: mEnUS,
  },
});

export default i18n;
