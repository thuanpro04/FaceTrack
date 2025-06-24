import {
  Udraw,
  Staff,
  History,
  Statistics,
  Secure,
  Profile,
  Analytics,
  Notification,
  Settings,
} from '../../assets/svg';
export interface MenuItem {
  id: number;
  title: string;
  description: string;
  icon: any; // Consider using a more specific type
  screen: string;
  category: string;
  priority: string;
  isNew?: boolean;
  color: string;
  gradient: string[];
  estimatedTime: string;
  features: string[];
  badge?: number; // Make badge optional and allow number
  isPopular?: boolean;
}
export const menu: MenuItem[] = [
  // === CORE FEATURES ===
  {
    id: 1,
    title: 'Chờ duyệt',
    description: 'Xem trạng thái kiểm duyệt',
    icon: Secure,
    screen: 'awaiting',
    category: 'core',
    priority: 'high',
    color: '#FF6B6B', // Red for attention
    gradient: ['#FF6B6B', '#FF8E8E'],
    estimatedTime: '< 1 phút',
    features: ['Theo dõi trạng thái', 'Thông báo real-time', 'Lịch sử duyệt'],
    isNew: true,
  },
  {
    id: 2,
    title: 'Lịch sử điểm danh',
    description: 'Xem lịch sử chấm công',
    icon: History,
    screen: 'attendance-history',
    isNew: true,
    category: 'management',
    priority: 'high',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#6EE7DF'],
    estimatedTime: '2-3 phút',
    features: ['Lọc theo ngày', 'Xuất báo cáo', 'Thống kê tháng'],
  },
  {
    id: 3,
    title: 'Thống kê hoạt động',
    description: 'Phân tích dữ liệu chi tiết',
    icon: Statistics,
    screen: 'statistics',
    category: 'reports',
    isNew: true,
    priority: 'medium',
    color: '#45B7D1',
    gradient: ['#45B7D1', '#96CEB4'],
    estimatedTime: '3-5 phút',
    features: ['Biểu đồ trực quan', 'So sánh theo thời gian', 'Xuất PDF'],
  },
  {
    id: 4,
    title: 'Danh sách',
    description: 'Các quản lý & dữ liệu',
    icon: Staff,
    screen: 'manage-list',
    category: 'management',
    isNew: true,
    priority: 'high',
    color: '#A8E6CF',
    gradient: ['#A8E6CF', '#C7EFCF'],
    estimatedTime: '5-10 phút',
    features: ['Thêm/sửa/xóa', 'Import Excel', 'Phân quyền'],
  },

  // === ADDITIONAL FEATURES ===
  {
    id: 5,
    title: 'Hồ sơ cá nhân',
    description: 'Cập nhật thông tin cá nhân',
    icon: Profile,
    screen: 'edit',
    category: 'settings',
    priority: 'medium',
    color: '#F7B2BD',
    gradient: ['#F7B2BD', '#F8D7DA'],
    estimatedTime: '2-3 phút',
    features: ['Đổi mật khẩu', 'Cập nhật ảnh', 'Thông tin liên hệ'],
  },
  {
    id: 6,
    title: 'Thông báo',
    description: 'Quản lý thông báo hệ thống',
    icon: Notification,
    screen: 'notifi',
    category: 'support',
    priority: 'low',
    color: '#FFD93D',
    gradient: ['#FFD93D', '#FFEB3B'],
    estimatedTime: '1-2 phút',
    features: ['Thông báo real-time', 'Lịch sử thông báo', 'Cài đặt nhắc nhở'],
    badge: 3, // Số thông báo chưa đọc
  },
  {
    id: 7,
    title: 'Cài đặt',
    description: 'Tùy chỉnh ứng dụng',
    icon: Settings,
    screen: 'settings',
    category: 'settings',
    priority: 'low',
    color: '#C7CEEA',
    gradient: ['#C7CEEA', '#E0E6FF'],
    estimatedTime: '3-5 phút',
    features: ['Giao diện', 'Ngôn ngữ', 'Bảo mật'],
  },
  // {
  //   id: 8,
  //   title: 'Báo cáo tổng hợp',
  //   description: 'Dashboard tổng quan',
  //   icon: Analytics,
  //   screen: 'dashboard',
  //   category: 'reports',
  //   isNew: true,
  //   priority: 'medium',
  //   isPopular: true,
  //   color: '#B8860B',
  //   gradient: ['#B8860B', '#DAA520'],
  //   estimatedTime: '2-4 phút',
  //   features: ['KPI Dashboard', 'Trend Analysis', 'Custom Reports'],
  // },
];
export interface CategoriesItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}
export const categories: CategoriesItem[] = [
  {
    id: 'all',
    name: 'Tất cả',
    icon: '🔥',
    color: '#667eea',
    count: menu.length,
  },
  {
    id: 'core',
    name: 'Cốt lỗi',
    icon: '⭐',
    color: '#f093fb',
    count: menu.filter(item => item.category === 'core').length,
  },
  {
    id: 'management',
    name: 'Quản lý',
    icon: '👥',
    color: '#4facfe',
    count: menu.filter(item => item.category === 'management').length,
  },
  {
    id: 'reports',
    name: 'Báo cáo',
    icon: '📊',
    color: '#43e97b',
    count: menu.filter(item => item.category === 'reports').length,
  },
  {
    id: 'settings',
    name: 'Cài đặt',
    icon: '⚙️',
    color: '#fa709a',
    count: menu.filter(item => item.category === 'settings').length,
  },
  {
    id: 'support',
    name: 'Hỗ trợ',
    icon: '🛠️',
    color: '#a8edea',
    count: menu.filter(item => item.category === 'Hỗ trợ').length,
  },
];

// === MENU UTILITIES ===
export const menuUtils = {
  // Lấy menu theo category
  getMenuByCategory: (category: string) => {
    if (category === 'Tất cả') return menu;
    return menu.filter(item => item.category === category);
  },

  // Lấy menu theo priority
  getMenuByPriority: (priority: 'high' | 'medium' | 'low') => {
    return menu.filter(item => item.priority === priority);
  },

  // Lấy menu phổ biến
  getPopularMenu: () => {
    return menu.filter(item => item.isPopular || item.priority === 'high');
  },

  // Lấy menu mới
  getNewMenu: () => {
    return menu.filter(item => item.isNew);
  },

  // Search menu
  searchMenu: (searchText: string) => {
    const lowercaseSearch = searchText.toLowerCase();
    return menu.filter(
      item =>
        item.title.toLowerCase().includes(lowercaseSearch) ||
        item.description.toLowerCase().includes(lowercaseSearch) ||
        item.features?.some(feature =>
          feature.toLowerCase().includes(lowercaseSearch),
        ),
    );
  },

  // Sắp xếp menu theo priority
  sortByPriority: () => {
    const priorityOrder: any = {high: 3, medium: 2, low: 1};
    return [...menu].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority],
    );
  },
};

// === QUICK ACTIONS ===
export const quickActions = [
  {
    id: 'quick-checkin',
    title: 'Điểm danh nhanh',
    icon: '⚡',
    action: 'quick-checkin',
    color: '#FF6B6B',
  },
  {
    id: 'view-schedule',
    title: 'Xem lịch',
    icon: '📅',
    action: 'view-schedule',
    color: '#4ECDC4',
  },
  {
    id: 'emergency-contact',
    title: 'Liên hệ khẩn cấp',
    icon: '🚨',
    action: 'emergency-contact',
    color: '#45B7D1',
  },
];

// === MENU SECTIONS FOR BETTER ORGANIZATION ===
export const menuSections = [
  {
    title: 'Chức năng chính',
    items: menu.filter(item => item.priority === 'high'),
  },
  {
    title: 'Tiện ích',
    items: menu.filter(item => item.priority === 'medium'),
  },
  {
    title: 'Khác',
    items: menu.filter(item => item.priority === 'low'),
  },
];
