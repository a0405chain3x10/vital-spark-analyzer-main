import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { AddPatientForm } from '@/components/patient/AddPatientForm';
import { Patient } from '@/types/auth';
import { Baby, Calendar, Weight, AlertTriangle, User, LogOut, Plus } from 'lucide-react';

export const PatientSelector: React.FC = () => {
  const { user, patients, selectedPatient, selectPatient, logout } = useAuth();

  if (!user) return null;

  const getStatusColor = (status: Patient['currentStatus']) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'improving': return 'bg-blue-100 text-blue-800';
      case 'deteriorating': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: Patient['riskLevel']) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else {
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      return `${weeks}w ${remainingDays}d`;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {user.role === 'doctor' ? 'Dr.' : 'Nurse'} • {user.department}
                {user.specialization && ` • ${user.specialization}`}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              Select Patient ({patients.length} assigned)
            </label>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
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
          <Select
            value={selectedPatient?.id || ''}
            onValueChange={selectPatient}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a patient to monitor" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  <div className="flex items-center gap-2">
                    <Baby className="h-4 w-4" />
                    <span>
                      {patient.firstName} {patient.lastName} 
                      <span className="text-muted-foreground ml-1">
                        ({patient.medicalRecordNumber})
                      </span>
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPatient && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  MRN: {selectedPatient.medicalRecordNumber}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedPatient.currentStatus)}>
                  {selectedPatient.currentStatus.toUpperCase()}
                </Badge>
                <Badge className={getRiskColor(selectedPatient.riskLevel)}>
                  {selectedPatient.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{calculateAge(selectedPatient.dateOfBirth)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-medium">{selectedPatient.currentWeight}g</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Baby className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">GA</p>
                  <p className="font-medium">{selectedPatient.gestationalAge}w</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Conditions</p>
                  <p className="font-medium">{selectedPatient.medicalHistory.conditions.length}</p>
                </div>
              </div>
            </div>

            {selectedPatient.medicalHistory.conditions.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium mb-2">Active Conditions:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.medicalHistory.conditions.slice(0, 3).map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                  {selectedPatient.medicalHistory.conditions.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedPatient.medicalHistory.conditions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {patients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Baby className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No patients assigned to you at this time.</p>
            <p className="text-sm">Contact your supervisor for patient assignments.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
