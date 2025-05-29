import {Udraw, Staff, History, Statistics, Secure} from '../../assets/svg/index';

export const menu = [
  {
    id: 1,
    title: 'Danh sách',
    description: 'Quản lý',
    Icon: Staff, // <-- chỉ tham chiếu, không render
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
    title: 'Nhập mã',
    description: 'Giới thiệu',
    Icon: Secure, // hoặc undefined
  },
];
