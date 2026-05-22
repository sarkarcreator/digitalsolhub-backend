import React from 'react';
import { Navigate } from 'react-router-dom';
import { Language } from '../types';

const AdminRedirect: React.FC = () => {
  return <Navigate to={`/${Language.ENGLISH}/admin-dashboard`} replace />;
};

export default AdminRedirect;
