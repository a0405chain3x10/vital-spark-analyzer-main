import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'doctor' | 'nurse';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user } = useAuth();

  // If no user is logged in, show login form
  if (!user) {
    return <LoginForm />;
  }

  // If a specific role is required and user doesn't have it, show access denied
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. 
            Required role: {requiredRole}
          </p>
          <p className="text-sm text-muted-foreground">
            Your role: {user.role}
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};
