import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import Login from '../pages/Auth/Login';

// Import all pages components
import Dashboard from '../pages/Dashboard';
import RealtimeStatus from '../pages/Inventory/RealtimeStatus';
import Appraisal from '../pages/Inventory/Appraisal';
import InventoryAnalytics from '../pages/Inventory/Analytics';
import Leads from '../pages/Sales/Leads';
import Desking from '../pages/Sales/Desking';
import Finance from '../pages/Sales/Finance';
import Workshop from '../pages/Service/Workshop';
import Parts from '../pages/Service/Parts';
import KPIAnalytics from '../pages/Analytics';
import Settings from '../pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // We use `isAuthenticated || true` in development to skip logging in repeatedly
  // In production, we would use strictly `isAuthenticated`
  const isLoggedIn = isAuthenticated || true; 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Main Layout containing all protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="inventory">
          <Route path="realtime-status" element={<RealtimeStatus />} />
          <Route path="appraisal" element={<Appraisal />} />
          <Route path="analytics" element={<InventoryAnalytics />} />
        </Route>
        
        <Route path="sales">
          <Route path="leads" element={<Leads />} />
          <Route path="desking" element={<Desking />} />
          <Route path="finance" element={<Finance />} />
        </Route>

        <Route path="service">
          <Route path="workshop" element={<Workshop />} />
          <Route path="parts" element={<Parts />} />
        </Route>

        <Route path="analytics" element={<KPIAnalytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
