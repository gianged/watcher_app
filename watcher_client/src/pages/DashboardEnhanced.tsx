import { motion } from 'framer-motion';
import { DashboardStats } from '../components/features/DashboardStats';
import {
  TicketsByStatusChart,
  TicketsByPriorityChart,
  TicketTrendsChart,
  DepartmentPerformanceChart,
} from '../components/features/DashboardCharts';
import { RecentActivity } from '../components/features/RecentActivity';
import { useTickets } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { useDepartments } from '../hooks/useDepartments';
import { useAnnounces } from '../hooks/useAnnounces';

export function DashboardEnhanced() {
  const { tickets } = useTickets();
  const { users } = useUsers();
  const { departments } = useDepartments();
  const { announces } = useAnnounces();

  const isLoading =
    tickets.isLoading || users.isLoading || departments.isLoading || announces.isLoading;

  // Calculate stats from actual data
  const stats = {
    totalUsers: users.data?.data?.length || 0,
    totalTickets: tickets.data?.data?.length || 0,
    totalDepartments: departments.data?.data?.length || 0,
    totalAnnounces: announces.data?.data?.length || 0,
    openTickets:
      tickets.data?.data?.filter((t: any) => t.status === 'OPEN').length || 0,
    resolvedTickets:
      tickets.data?.data?.filter((t: any) => t.status === 'RESOLVED').length || 0,
  };

  return (
    <div className="dashboard-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Section */}
        <DashboardStats stats={stats} loading={isLoading} />

        {/* Charts Section */}
        <div className="row mt-5">
          <div className="col-6">
            <div className="card">
              <div className="card-body" style={{ height: '350px' }}>
                <TicketsByStatusChart />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <div className="card-body" style={{ height: '350px' }}>
                <TicketsByPriorityChart />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body" style={{ height: '350px' }}>
                <TicketTrendsChart />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-6">
            <div className="card">
              <div className="card-body" style={{ height: '350px' }}>
                <DepartmentPerformanceChart />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardEnhanced;
