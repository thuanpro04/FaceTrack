import {Udraw, Staff, History, Statistics, Secure} from '../../assets/svg';

export const menu = [
  {
    id: 1,
    title: 'Đợi',
    description: 'Kiểm duyệt',
    Icon: Secure, // hoặc undefined
  },

  {
    id: 2,
    title: 'Lịch sử',
    description: 'Quét mã',
    Icon: History,
  },
  {
    id: 3,
    title: 'Thống kê',
    description: 'Hoạt động',
    Icon: Statistics,
  },
  {
    id: 4,
    title: 'Danh sách',
    description: 'Quản lý',
    Icon: Staff, // <-- chỉ tham chiếu, không render
  },
];
