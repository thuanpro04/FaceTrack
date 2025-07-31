import {API_PATHS} from '../api/apiPaths';
import axiosInstance from '../api/axiosInstance';

const getManageInfo = async (id: string) => {
  const res = await axiosInstance.get(`${API_PATHS.STAFF.MANAGE_INFO}/${id}`);
  return res;
};
const getNotiForUser = async (id: string) => {
  const res = await axiosInstance.get(`${API_PATHS.STAFF.NOTIFICATION}/${id}`);
  return res;
};
const handleRejectInvite = async (id: string) => {
  const res = await axiosInstance.get(
    `${API_PATHS.STAFF.NOTIFICATION_REJECT}/${id}`,
  );
  return res;
};
const handleAgreeToTeam = async (data: any) => {
  const res = await axiosInstance.post(
    API_PATHS.STAFF.NOTIFICATION_AGREE,
    data,
  );
  return res;
};
export const staffServices = {
  getManageInfo,
  getNotiForUser,
  handleRejectInvite,
  handleAgreeToTeam,
};
