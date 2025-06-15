import {Udraw, Staff, History, Statistics, Secure} from '../../assets/svg';

export const menu = [
  {
    id: 1,
    title: 'Đợi',
    description: 'Kiểm duyệt',
    icon: Secure, // hoặc undefined
    screen: 'awaiting',
  },
  {
    id: 2,
    title: 'Lịch sử',
    description: 'Điểm danh',
    icon: History,
    screen: 'attendance-history',
  },
  {
    id: 3,
    title: 'Thống kê',
    description: 'Hoạt động',
    icon: Statistics,
    screen: 'statitics',
  },
  {
    id: 4,
    title: 'Danh sách',
    description: 'Quản lý',
    icon: Staff, // <-- chỉ tham chiếu, không render
    screen: 'manage-list',
  },
];
