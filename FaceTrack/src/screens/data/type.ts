export interface Manager {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
  status: 'online' | 'offline' | 'busy'; // giới hạn lựa chọn
  projects: number;
  rating: number;
}
