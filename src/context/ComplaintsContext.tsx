import React, { createContext, useState, ReactNode } from 'react';

export interface Complaint {
  _id: string;
  title: string;
  type: string;
  status: 'pending' | 'running' | 'resolved' | 'rejected';
  createdAt: string;
  description: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  phone?: string;
  email?: string;
}

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, '_id' | 'createdAt' | 'status'> & { location?: string; priority?: 'low' | 'medium' | 'high'; phone?: string; email?: string }) => void;
}

export const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    _id: "1",
    title: "مشكلة في نظام التدفئة",
    type: "صيانة",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "التدفئة لا تعمل بشكل صحيح في الطابق الأول",
  },
  {
    _id: "2",
    title: "تسرب المياه في الحمام",
    type: "إصلاح",
    status: "running",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "يوجد تسرب بسيط في أنابيب الحمام",
  },
  {
    _id: "3",
    title: "دهان الجدران التالفة",
    type: "دهان",
    status: "resolved",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "تم إعادة دهان الجدران بنجاح",
  },
  {
    _id: "4",
    title: "إصلاح الأبواب المعطلة",
    type: "صيانة",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "أبواب الشقة تحتاج إلى إصلاح",
  },
  {
    _id: "5",
    title: "تنظيف السلالم العامة",
    type: "تنظيف",
    status: "running",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "تنظيف شامل للسلالم والممرات",
  },
];

export const ComplaintsProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);

  const addComplaint = (complaint: Omit<Complaint, '_id' | 'createdAt' | 'status'> & { location?: string; priority?: 'low' | 'medium' | 'high'; phone?: string; email?: string }) => {
    const newComplaint: Complaint = {
      ...complaint,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, addComplaint }}>
      {children}
    </ComplaintsContext.Provider>
  );
};
