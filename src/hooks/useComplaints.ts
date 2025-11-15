import { useContext } from 'react';
import { ComplaintsContext } from '../context/ComplaintsContext';

export const useComplaints = () => {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within ComplaintsProvider');
  }
  return context;
};
