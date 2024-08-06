import http from '@/api/index';

export const getUserInfoAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/account/user_info/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const signInAPI = (data) =>
  new Promise((resolve, reject) => {
    http.post('/account/sign_in/', data).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const signUpAPI = (data) =>
  new Promise((resolve, reject) => {
    http.post('/account/sign_up/', data).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const sendVerifyCodeAPI = (data) =>
  new Promise((resolve, reject) => {
    http.post('/account/phone_verify_code/', data).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const signOutAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/account/sign_out/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const savePropertyAPI = (properties) =>
  new Promise((resolve, reject) => {
    http.post('/account/user_property/', properties).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const oauthCodeAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/account/oauth_code/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const getWeChatConfigAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/account/wechat_config/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const weChatLoginAPI = (data) =>
  new Promise((resolve, reject) => {
    http.post('/account/wechat_login/', data).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const resetPasswordAPI = (data) =>
  new Promise((resolve, reject) => {
    http.post('/account/reset_password/', data).then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });

export const getPhoneAreasAPI = () =>
  new Promise((resolve, reject) => {
    http.get('/account/phone_areas/').then(
        (res) => resolve(res),
        (err) => reject(err),
    );
  });
