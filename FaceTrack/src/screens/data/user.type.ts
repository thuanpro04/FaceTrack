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
 type AttendanceStatus = 'present' | 'weekend' | 'absent' | 'late' | 'overtime';

interface UserInfo {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
}

export interface WeeklyData {
  labels: string[];
  attendance: number[]; // 1: có mặt, 0: vắng
  workHours: number[];
  checkInTimes: string[];
  checkOutTimes: string[];
}

export interface ChartDataset {
  data: number[];
  color: (opacity: number) => string;
  strokeWidth?: number;
}

interface MonthlyAttendance {
  labels: string[];
  datasets: ChartDataset[];
}

interface WorkHoursDistribution {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface MonthlyData {
  totalWorkDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  overtimeHours: number;
  totalWorkHours: number;
  attendanceRate: number;
  weeklyAttendance: MonthlyAttendance;
  workHoursDistribution: WorkHoursDistribution[];
}

export interface YearlyData {
  totalWorkDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  overtimeHours: number;
  attendanceRate: number;
  monthlyAttendance: MonthlyAttendance;
}

export interface AttendanceRecord {
  id: number;
  date: string; // ISO string
  dayOfWeek: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workHours: number;
  note: string;
}

export interface MockUserData {
  user: UserInfo;
  weeklyData: WeeklyData;
  monthlyData: MonthlyData;
  yearlyData: YearlyData;
  recentAttendance: AttendanceRecord[];
}
