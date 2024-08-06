import http from '@/api/index';

export const changeLangAPI = (language) =>
  new Promise((resolve, reject) => {
    http.post('/i18n/', {language}).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const HomeAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const listMetaConfigAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/meta/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });
