import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faTicket,
  faBullhorn,
  faBuilding,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  change?: number;
  loading?: boolean;
}

function StatCard({ title, value, icon, variant, change, loading }: StatCardProps) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`stat-icon ${variant}`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="stat-content">
        <div className="stat-label">{title}</div>
        {loading ? (
          <div className="stat-value">...</div>
        ) : (
          <>
            <div className="stat-value">{value}</div>
            {change !== undefined && (
              <div className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
                {change >= 0 ? '+' : ''}
                {change}% from last month
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

interface DashboardStatsProps {
  stats?: {
    totalUsers?: number;
    totalTickets?: number;
    totalDepartments?: number;
    totalAnnounces?: number;
    openTickets?: number;
    resolvedTickets?: number;
  };
  loading?: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  return (
    <div className="stats-grid">
      <StatCard
        title="Total Users"
        value={stats?.totalUsers || 0}
        icon={faUsers}
        variant="primary"
        change={12}
        loading={loading}
      />
      <StatCard
        title="Open Tickets"
        value={stats?.openTickets || 0}
        icon={faExclamationCircle}
        variant="warning"
        change={-5}
        loading={loading}
      />
      <StatCard
        title="Resolved Tickets"
        value={stats?.resolvedTickets || 0}
        icon={faCheckCircle}
        variant="success"
        change={18}
        loading={loading}
      />
      <StatCard
        title="Departments"
        value={stats?.totalDepartments || 0}
        icon={faBuilding}
        variant="info"
        loading={loading}
      />
      <StatCard
        title="Total Tickets"
        value={stats?.totalTickets || 0}
        icon={faTicket}
        variant="danger"
        change={8}
        loading={loading}
      />
      <StatCard
        title="Announcements"
        value={stats?.totalAnnounces || 0}
        icon={faBullhorn}
        variant="primary"
        loading={loading}
      />
    </div>
  );
}
