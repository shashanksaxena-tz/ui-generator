/**
 * Dashboard Mock Data
 * 
 * Mock data for the sales analytics dashboard example.
 */

export interface KPIData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  description: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing' | 'cancelled';
  date: string;
  items: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// KPI Cards Data
export const kpiData: KPIData[] = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '$45,231.89',
    change: 20.1,
    changeType: 'positive',
    icon: 'DollarSign',
    description: '+20.1% from last month',
  },
  {
    id: 'orders',
    title: 'Orders',
    value: '+2,350',
    change: 15.3,
    changeType: 'positive',
    icon: 'ShoppingCart',
    description: '+15.3% from last month',
  },
  {
    id: 'customers',
    title: 'Active Customers',
    value: '+12,234',
    change: 8.2,
    changeType: 'positive',
    icon: 'Users',
    description: '+8.2% from last month',
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: '3.24%',
    change: -2.1,
    changeType: 'negative',
    icon: 'TrendingUp',
    description: '-2.1% from last month',
  },
];

// Sales Chart Data (Last 30 days)
export const salesChartData: SalesData[] = [
  { date: '2024-01-01', revenue: 2400, orders: 45, customers: 120 },
  { date: '2024-01-02', revenue: 1398, orders: 32, customers: 98 },
  { date: '2024-01-03', revenue: 9800, orders: 89, customers: 234 },
  { date: '2024-01-04', revenue: 3908, orders: 56, customers: 156 },
  { date: '2024-01-05', revenue: 4800, orders: 67, customers: 178 },
  { date: '2024-01-06', revenue: 3800, orders: 54, customers: 145 },
  { date: '2024-01-07', revenue: 4300, orders: 61, customers: 167 },
  { date: '2024-01-08', revenue: 5300, orders: 72, customers: 189 },
  { date: '2024-01-09', revenue: 4890, orders: 68, customers: 176 },
  { date: '2024-01-10', revenue: 6200, orders: 85, customers: 210 },
  { date: '2024-01-11', revenue: 7100, orders: 92, customers: 234 },
  { date: '2024-01-12', revenue: 5400, orders: 74, customers: 198 },
  { date: '2024-01-13', revenue: 4800, orders: 65, customers: 176 },
  { date: '2024-01-14', revenue: 6200, orders: 82, customers: 201 },
  { date: '2024-01-15', revenue: 7500, orders: 98, customers: 245 },
  { date: '2024-01-16', revenue: 6800, orders: 89, customers: 223 },
  { date: '2024-01-17', revenue: 5900, orders: 78, customers: 198 },
  { date: '2024-01-18', revenue: 8200, orders: 112, customers: 267 },
  { date: '2024-01-19', revenue: 7800, orders: 105, customers: 254 },
  { date: '2024-01-20', revenue: 6500, orders: 88, customers: 212 },
  { date: '2024-01-21', revenue: 7200, orders: 95, customers: 231 },
  { date: '2024-01-22', revenue: 8100, orders: 108, customers: 256 },
  { date: '2024-01-23', revenue: 9300, orders: 124, customers: 289 },
  { date: '2024-01-24', revenue: 8500, orders: 115, customers: 267 },
  { date: '2024-01-25', revenue: 7600, orders: 102, customers: 243 },
  { date: '2024-01-26', revenue: 8900, orders: 118, customers: 278 },
  { date: '2024-01-27', revenue: 9800, orders: 132, customers: 301 },
  { date: '2024-01-28', revenue: 9200, orders: 125, customers: 287 },
  { date: '2024-01-29', revenue: 10500, orders: 141, customers: 324 },
  { date: '2024-01-30', revenue: 11200, orders: 152, customers: 345 },
];

// Category Distribution Data
export const categoryData: CategoryData[] = [
  { name: 'Electronics', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Clothing', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Home & Garden', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Sports', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Books', value: 8, color: 'hsl(var(--chart-5))' },
];

// Recent Orders Data
export const recentOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    amount: 125.99,
    status: 'completed',
    date: '2024-01-30T10:30:00Z',
    items: 3,
  },
  {
    id: 'ORD-002',
    customer: 'Michael Chen',
    email: 'mchen@example.com',
    amount: 79.50,
    status: 'processing',
    date: '2024-01-30T09:15:00Z',
    items: 2,
  },
  {
    id: 'ORD-003',
    customer: 'Emily Davis',
    email: 'emily.d@example.com',
    amount: 249.00,
    status: 'pending',
    date: '2024-01-30T08:45:00Z',
    items: 5,
  },
  {
    id: 'ORD-004',
    customer: 'James Wilson',
    email: 'jwilson@example.com',
    amount: 189.99,
    status: 'completed',
    date: '2024-01-29T16:20:00Z',
    items: 4,
  },
  {
    id: 'ORD-005',
    customer: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    amount: 45.99,
    status: 'cancelled',
    date: '2024-01-29T14:10:00Z',
    items: 1,
  },
  {
    id: 'ORD-006',
    customer: 'Robert Taylor',
    email: 'rtaylor@example.com',
    amount: 399.00,
    status: 'completed',
    date: '2024-01-29T11:30:00Z',
    items: 6,
  },
  {
    id: 'ORD-007',
    customer: 'Amanda Martinez',
    email: 'amanda.m@example.com',
    amount: 156.75,
    status: 'processing',
    date: '2024-01-29T09:45:00Z',
    items: 3,
  },
  {
    id: 'ORD-008',
    customer: 'David Brown',
    email: 'dbrown@example.com',
    amount: 89.99,
    status: 'completed',
    date: '2024-01-28T15:20:00Z',
    items: 2,
  },
];

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// Format date
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

// Simulate real-time data updates
export function simulateDataUpdate(
  callback: (data: { revenue: number; orders: number; customers: number }) => void,
  interval: number = 5000
): () => void {
  const intervalId = setInterval(() => {
    const variation = () => Math.random() * 0.1 - 0.05; // ±5% variation
    callback({
      revenue: Math.round(45000 * (1 + variation())),
      orders: Math.round(2350 * (1 + variation())),
      customers: Math.round(12234 * (1 + variation())),
    });
  }, interval);

  return () => clearInterval(intervalId);
}
