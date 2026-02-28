import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import '@/App.css';

// Pages
import HomePage from '@/pages/HomePage';
import UniversityDetailPage from '@/pages/UniversityDetailPage';
import LoginPage from '@/pages/LoginPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import AdminDashboard from '@/pages/AdminDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';

// Context
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BrandingProvider } from '@/context/BrandingContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BrandingProvider>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/university/:id" element={<UniversityDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/manager/*"
              element={
                <PrivateRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrandingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;