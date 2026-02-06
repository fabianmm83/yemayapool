// ===================== USUARIOS =====================
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  phoneNumber?: string;
  photoURL?: string;
}

export type UserRole = 'superadmin' | 'admin' | 'worker';

// ===================== MESAS =====================
export interface PoolTable {
  id: string;
  number: number;
  name: string;
  type: TableType;
  status: TableStatus;
  currentSession?: TableSession | null;
  hourlyRate: number;
  maxPlayers: number;
  location: TableLocation;
  size: TableSize;
  isActive: boolean;
  lastMaintenance?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TableType = 'pool' | 'snooker' | 'carom';
export type TableStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type TableSize = 'standard' | 'large' | 'small';

export interface TableLocation {
  section: string;
  position: {
    x: number;
    y: number;
  };
}

// ===================== SESIONES =====================
export interface TableSession {
  id: string;
  tableId: string;
  customerId?: string;
  workerId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // en minutos
  totalAmount?: number;
  isPaid: boolean;
  notes?: string;
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

// ===================== CLIENTES =====================
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  totalSessions: number;
  totalSpent: number;
  lastVisit?: Date;
  notes?: string;
  favoriteTables?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ===================== PAGOS =====================
export interface Payment {
  id: string;
  sessionId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt: Date;
  workerId: string;
  customerId?: string;
  tableId?: string;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'cryptocurrency';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// ===================== REPORTES =====================
export interface DailyReport {
  date: Date;
  totalSessions: number;
  totalRevenue: number;
  averageSessionDuration: number;
  mostActiveTable: string;
  peakHours: number[];
  paymentsByMethod: Record<PaymentMethod, number>;
}

export interface WorkerStats {
  workerId: string;
  workerName: string;
  sessionsManaged: number;
  totalRevenue: number;
  averageRating?: number;
  activeHours: number;
  period: {
    start: Date;
    end: Date;
  };
}

// ===================== CONFIGURACIÓN =====================
export interface SystemSettings {
  businessHours: {
    open: string; // HH:MM
    close: string; // HH:MM
    daysOpen: number[]; // 0=Domingo, 1=Lunes, etc.
  };
  hourlyRates: {
    standard: number;
    large: number;
    small: number;
  };
  taxRate: number;
  currency: string;
  timezone: string;
  maxPlayersPerTable: number;
  reservationFee?: number;
  lateCancellationFee?: number;
}

// ===================== COMPONENTES =====================
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  description?: string;
  className?: string;
  onClick?: () => void;
}

// ===================== ERRORES =====================
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  stack?: string;
}

// ===================== ESTADOS =====================
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

// ===================== FILTROS =====================
export interface TableFilter {
  status?: TableStatus[];
  size?: TableSize[];
  minRate?: number;
  maxRate?: number;
  section?: string;
  isActive?: boolean;
}

export interface SessionFilter {
  startDate?: Date;
  endDate?: Date;
  workerId?: string;
  customerId?: string;
  tableId?: string;
  isPaid?: boolean;
  minDuration?: number;
  maxDuration?: number;
}

export interface CustomerFilter {
  name?: string;
  phone?: string;
  email?: string;
  minVisits?: number;
  minSpent?: number;
  lastVisitFrom?: Date;
  lastVisitTo?: Date;
}

// ===================== FORMULARIOS =====================
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  acceptTerms: boolean;
}

export interface CustomerFormData {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface TableFormData {
  number: number;
  name: string;
  type: TableType;
  hourlyRate: number;
  maxPlayers: number;
  size: TableSize;
  location: TableLocation;
  isActive: boolean;
}

// ===================== EVENTOS =====================
export type SystemEvent = 
  | 'table_started'
  | 'table_ended'
  | 'payment_received'
  | 'customer_created'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'maintenance_scheduled'
  | 'table_maintenance'
  | 'reservation_created'
  | 'reservation_cancelled'
  | 'worker_shift_started'
  | 'worker_shift_ended';

export interface EventLog {
  id: string;
  type: SystemEvent;
  userId?: string;
  tableId?: string;
  customerId?: string;
  data?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// ===================== PWA =====================
export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui';
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: 'any' | 'maskable' | 'monochrome';
  }>;
}

// ===================== UTILIDADES =====================
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type WithId<T> = T & { id: string };
export type WithoutId<T> = Omit<T, 'id'>;
export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

// ===================== API =====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ===================== DASHBOARD =====================
export interface DashboardStats {
  totalRevenue: number;
  activeSessions: number;
  availableTables: number;
  totalCustomers: number;
  todayRevenue: number;
  todaySessions: number;
  popularTables: Array<{
    tableId: string;
    tableName: string;
    sessionsCount: number;
    totalRevenue: number;
  }>;
  recentActivity: Array<{
    type: SystemEvent;
    description: string;
    timestamp: Date;
    userId?: string;
  }>;
}

// ===================== RESERVACIONES =====================
export interface Reservation {
  id: string;
  tableId: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // en minutos
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// ===================== MANTENIMIENTO =====================
export interface MaintenanceLog {
  id: string;
  tableId: string;
  tableName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date;
  assignedTo?: string;
  status: 'reported' | 'in_progress' | 'completed' | 'cancelled';
  completedAt?: Date;
  notes?: string;
  cost?: number;
}