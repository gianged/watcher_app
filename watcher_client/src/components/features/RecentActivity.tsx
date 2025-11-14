import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
  faUser,
  faBullhorn,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: number;
  type: 'ticket' | 'user' | 'announce' | 'department';
  title: string;
  description: string;
  timestamp: Date;
}

const iconMap = {
  ticket: faTicket,
  user: faUser,
  announce: faBullhorn,
  department: faBuilding,
};

const colorMap = {
  ticket: '#6a11cb',
  user: '#17a2b8',
  announce: '#ffc107',
  department: '#28a745',
};

export function RecentActivity({ activities }: { activities?: Activity[] }) {
  const mockActivities: Activity[] = activities || [
    {
      id: 1,
      type: 'ticket',
      title: 'New Ticket Created',
      description: 'TKT-2024-ABC: Server maintenance required',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 2,
      type: 'user',
      title: 'New User Registered',
      description: 'John Doe joined the IT department',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: 3,
      type: 'announce',
      title: 'New Announcement',
      description: 'System maintenance scheduled for this weekend',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      id: 4,
      type: 'ticket',
      title: 'Ticket Resolved',
      description: 'TKT-2024-XYZ: Email configuration issue resolved',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
    },
    {
      id: 5,
      type: 'department',
      title: 'Department Created',
      description: 'New Customer Support department added',
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
    },
  ];

  return (
    <div className="recent-activity">
      <h3 className="mb-4">Recent Activity</h3>
      <div className="activity-list">
        {mockActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="activity-item"
            style={{ borderLeftColor: colorMap[activity.type] }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="activity-header">
              <div className="d-flex align-items-center gap-sm">
                <FontAwesomeIcon
                  icon={iconMap[activity.type]}
                  style={{ color: colorMap[activity.type] }}
                />
                <span className="activity-title">{activity.title}</span>
              </div>
              <span className="activity-time">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </span>
            </div>
            <div className="activity-description">{activity.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
