import axios from 'axios';
import {BASE_URL} from './apiPaths';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
axiosInstance.interceptors.request.use(
  async config => {
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const accessToken = user?.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log('Unauthorized! Redirecting to login...');
      } else if (error.response.status === 500) {
        console.log('Server error, Please try again later');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.log('Request timeout. Please try again');
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
