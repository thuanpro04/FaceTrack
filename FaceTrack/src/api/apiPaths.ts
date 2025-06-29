export const BASE_URL = 'http://192.168.1.7:2403'; // Replace with your backend URL
export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    GET_USER_INFO: '/api/v1/auth/getUser',
    UPLOAD_PROFILE: '/api/v1/auth/me',
    VERIFI: '/api/v1/auth/verify',
    RESET: '/api/v1/auth/reset',
    SUBMIT_CODE:'/api/v1/auth/code'
  },
  IMAGE: {
    UPLOAD_FACE: '/api/v1/face/face',
    TIMEKEEPING: '/api/v1/face/timkeeping',
  },
};
