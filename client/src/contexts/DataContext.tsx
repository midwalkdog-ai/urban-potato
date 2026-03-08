import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateMockJobs, generateMockInvoices, generateMockProperties, Job, Invoice, Property } from '@/lib/mockData';

interface DataContextType {
  jobs: Job[];
  invoices: Invoice[];
  properties: Property[];
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  addJob: (job: Job) => void;
  addInvoice: (invoice: Invoice) => void;
  deleteJob: (jobId: string) => void;
  deleteInvoice: (invoiceId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const stored = localStorage.getItem('flashfix_jobs');
    return stored ? JSON.parse(stored) : generateMockJobs(50);
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = localStorage.getItem('flashfix_invoices');
    return stored ? JSON.parse(stored) : generateMockInvoices(30);
  });

  const [properties] = useState<Property[]>(() => {
    const stored = localStorage.getItem('flashfix_properties');
    return stored ? JSON.parse(stored) : generateMockProperties(6);
  });

  // Persist jobs to localStorage
  useEffect(() => {
    localStorage.setItem('flashfix_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Persist invoices to localStorage
  useEffect(() => {
    localStorage.setItem('flashfix_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status } : inv
    ));
  };

  const addJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const deleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
  };

  return (
    <DataContext.Provider value={{
      jobs,
      invoices,
      properties,
      updateJobStatus,
      updateInvoiceStatus,
      addJob,
      addInvoice,
      deleteJob,
      deleteInvoice,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
