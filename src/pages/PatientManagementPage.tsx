import React from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { PatientManagement } from '@/components/patient/PatientManagement';

const PatientManagementPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">
        <PatientManagement />
      </div>
    </div>
  );
};

export default PatientManagementPage;
