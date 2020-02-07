import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
// 创建请求实例
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 2000
});

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  const data = {
    status: response.data.status,
    data: response.data.body
  }
  if (response.data.description) data.description = response.data.description;
  return data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export { BASE_URL }
export default instance