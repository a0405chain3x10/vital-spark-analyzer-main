import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { AddPatientForm } from '@/components/patient/AddPatientForm';
import { 
  Activity, 
  Users, 
  Stethoscope, 
  LogOut,
  User,
  Plus
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: Activity,
      description: 'Real-time monitoring'
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: Users,
      description: 'Patient management'
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Vital Spark Analyzer</h1>
            <p className="text-sm text-gray-600">Neonatal Care Management</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          {/* Add Patient Button - Available for both doctors and nurses */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient's information and medical details
                </DialogDescription>
              </DialogHeader>
              <AddPatientForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {user.role === 'doctor' ? 'Dr.' : 'Nurse'} {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-600">
                {user.department}
                {user.specialization && ` • ${user.specialization}`}
              </p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
