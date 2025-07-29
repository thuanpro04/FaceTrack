import {API_PATHS} from '../api/apiPaths';
import axiosInstance from '../api/axiosInstance';

const getManageInfo = async (id: string) => {
  const res = await axiosInstance.get(`${API_PATHS.STAFF.MANAGE_INFO}/${id}`);
  return res;
};
const getStaffInfo = async (limit: number) => {
  const res = await axiosInstance.get(`${API_PATHS.MANAGE.STAFF_INFO}/${limit}`);
  return res;
};
export const userServices = {
  getManageInfo,
  getStaffInfo,
};
