export const BASE_URL = 'http://192.168.1.3:2403';
export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    GET_USER_INFO: '/api/v1/auth/getUser',
    UPLOAD_PROFILE: '/api/v1/auth/update',
    VERIFI:'/api/v1/auth/verify',
    RESET:'/api/v1/auth/reset'
  },
  IMAGE: {
    UPLOAD_AVATAR: '/api/v1/auth/upload-avatar',
    UPLOAD_FACE:'/api/v1/face/upload-face',

  },
};
