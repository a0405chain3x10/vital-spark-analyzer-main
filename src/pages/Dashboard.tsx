import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { PatientSelector } from '@/components/patient/PatientSelector';
import { RiskAnalysisDashboard } from '@/components/RiskAnalysisDashboard';
import { PatientProfile } from '@/components/patient/PatientProfile';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Activity, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, selectedPatient } = useAuth();
  const [activeView, setActiveView] = useState<'monitoring' | 'profile'>('monitoring');

  if (!user) {
    return null; // This should be handled by ProtectedRoute, but just in case
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Patient Selector */}
        <PatientSelector />

        {selectedPatient ? (
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'monitoring' | 'profile')}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Vital Monitoring
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patient Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="mt-6">
              <RiskAnalysisDashboard />
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <PatientProfile patient={selectedPatient} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted/30 rounded-lg p-8 max-w-md mx-auto">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Patient Selected</h3>
              <p className="text-muted-foreground mb-4">
                Please select a patient from the dropdown above to begin monitoring.
              </p>
              {user.role === 'doctor' && (
                <p className="text-sm text-muted-foreground">
                  If you don't see any patients, you may need to add them to your care list.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
