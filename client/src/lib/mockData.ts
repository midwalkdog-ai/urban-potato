export interface Job {
  id: string;
  title: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  property: string;
  assigned_to?: string;
  created_at: string;
  amount?: number;
}

export interface Invoice {
  id: string;
  job_id: string;
  amount: number;
  status: 'draft' | 'submitted' | 'payment_declared' | 'paid';
  created_at: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export const generateMockJobs = (count: number = 12): Job[] => {
  const statuses: Job['status'][] = ['pending', 'assigned', 'in_progress', 'completed'];
  const titles = [
    'Roof Inspection',
    'Plumbing Repair',
    'Electrical Wiring',
    'HVAC Maintenance',
    'Drywall Installation',
    'Flooring Replacement',
    'Window Repair',
    'Door Installation',
    'Painting',
    'Tile Work',
    'Concrete Repair',
    'Gutter Cleaning',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `job-${i + 1}`,
    title: titles[i % titles.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    property: `123 Main St, Unit ${i + 1}`,
    assigned_to: Math.random() > 0.3 ? `Contractor ${Math.floor(Math.random() * 5) + 1}` : undefined,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: Math.floor(Math.random() * 5000) + 500,
  }));
};

export const generateMockInvoices = (count: number = 8): Invoice[] => {
  const statuses: Invoice['status'][] = ['draft', 'submitted', 'payment_declared', 'paid'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `inv-${i + 1}`,
    job_id: `job-${i + 1}`,
    amount: Math.floor(Math.random() * 5000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockProperties = (count: number = 6): Property[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `prop-${i + 1}`,
    address: `${100 + i * 10} Main Street`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'][i],
    status: Math.random() > 0.2 ? 'active' : 'inactive',
  }));
};

export const generateMockUsers = (count: number = 10): UserProfile[] => {
  const roles = ['admin', 'property_manager', 'subcontractor', 'homeowner'];
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    full_name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `user${i + 1}@flashfix.local`,
    role: roles[Math.floor(Math.random() * roles.length)],
    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const getStats = (jobs: Job[], invoices: Invoice[]) => {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'assigned' || j.status === 'in_progress').length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const pendingPayments = invoices.filter(i => i.status === 'payment_declared').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return {
    totalJobs,
    activeJobs,
    completedJobs,
    totalInvoices,
    paidInvoices,
    pendingPayments,
    totalRevenue,
  };
};
