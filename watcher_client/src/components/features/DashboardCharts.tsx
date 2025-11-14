import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function TicketsByStatusChart({ data }: { data?: any }) {
  const chartData = {
    labels: ['Open', 'In Progress', 'Pending Review', 'Resolved', 'Closed', 'Rejected'],
    datasets: [
      {
        label: 'Tickets',
        data: data || [12, 19, 8, 25, 15, 3],
        backgroundColor: [
          '#17a2b8',
          '#ffc107',
          '#fd7e14',
          '#28a745',
          '#6c757d',
          '#dc3545',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Tickets by Status',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}

export function TicketsByPriorityChart({ data }: { data?: any }) {
  const chartData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Number of Tickets',
        data: data || [20, 35, 15, 8],
        backgroundColor: '#6a11cb',
        borderColor: '#6a11cb',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tickets by Priority',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export function TicketTrendsChart({ data }: { data?: any }) {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Created',
        data: data?.created || [30, 45, 28, 50, 38, 42, 55],
        borderColor: '#6a11cb',
        backgroundColor: 'rgba(106, 17, 203, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Resolved',
        data: data?.resolved || [25, 40, 25, 45, 35, 40, 50],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Ticket Trends (Last 7 Months)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export function DepartmentPerformanceChart({ data }: { data?: any }) {
  const chartData = {
    labels: data?.labels || ['IT', 'HR', 'Finance', 'Operations', 'Sales'],
    datasets: [
      {
        label: 'Tickets Resolved',
        data: data?.resolved || [45, 32, 28, 38, 25],
        backgroundColor: '#28a745',
      },
      {
        label: 'Tickets Open',
        data: data?.open || [12, 8, 5, 10, 7],
        backgroundColor: '#ffc107',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Department Performance',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
