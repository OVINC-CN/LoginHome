import http from './index';

export const listAllAppAPI = (params) =>
  new Promise((resolve, reject) => {
    http.get('/application/all/', {params}).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });
