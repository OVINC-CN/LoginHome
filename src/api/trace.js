import http from './index';

export const getRUMConfigAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/trace/rum/config/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });
