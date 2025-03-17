export interface Project {
  id: string;
  clientName: string;
  email: string;
  phone?: string;
  type: string;
  status: 'pending' | 'active' | 'completed';
  date: Date;
  budget?: string;
  description?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  pendingProjects: number;
  completedProjects: number;
  totalRevenue: number;
}
