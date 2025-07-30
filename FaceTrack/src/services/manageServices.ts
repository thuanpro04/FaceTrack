import {API_PATHS} from '../api/apiPaths';
import axiosInstance from '../api/axiosInstance';

const getStaffInfo = async (limit: number) => {
  const res = await axiosInstance.get(
    `${API_PATHS.MANAGE.STAFF_INFO}/${limit}`,
  );
  return res;
};
const handleInviteUserToGroup = async (data: any) => {
  const res = await axiosInstance.post(API_PATHS.MANAGE.INVITE_GROUP, data);
  return res;
};
export const manageServices = {
  getStaffInfo,
  handleInviteUserToGroup
};
