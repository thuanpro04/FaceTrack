import {API_PATHS} from '../api/apiPaths';
import axiosInstance from '../api/axiosInstance';
import {info} from '../screens/Staff/profile/EditProfileScreen';
import {showNotificating} from '../utils/ShowNotification';
const loginUser = async (data: any) => {
  const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, data);
  return res;
};
const signupUser = async (data: any) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, data);
    return res;
  } catch (error) {
    console.log('sign up error: ', error);
    throw error; // Ném lỗi để client xử lý
  }
};
const sendVerification = async (email: string, key?: string) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.VERIFI, {email, key});
    return res;
  } catch (error: any) {
    console.log(
      'Send verification error:',
      error.response?.data?.message || error.message,
    );
    showNotificating.activity(
      'success',
      'Gửi mã thất bại!',
      'Vui lòng thử lại.',
    );
    throw error; // Ném lỗi để client xử lý
  }
};
const resetPassword = async (data: any) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.RESET, data);
    return res;
  } catch (error: any) {
    console.log('Reset password fail: ', error.response.data.message);
  }
};
const upload_Profile = async (data: info) => {
  const res = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_PROFILE, data);
  return res;
};
export const authServices = {
  signupUser,
  sendVerification,
  loginUser,
  resetPassword,
  upload_Profile
};
