import axios from 'axios';
import globalContext from '../context';
import router from '../router';

const http = axios;

http.defaults.timeout = 10000;
http.defaults.baseURL = globalContext.backendUrl;
http.defaults.withCredentials = true;

http.interceptors.response.use(
    (res) => res.data,
    (err) => {
    // 401 redirect to log in
      if (err.response.status === 401) {
        const next = window.location.href;
        if (window.location.href.indexOf('/login/') !== -1) return;
        if (next.indexOf('next=') !== -1) {
          window.location.href = next;
          return;
        }
        router.push({name: 'Login', query: {next: window.location.href}});
      }
      return Promise.reject(err);
    },
);

export default http;
