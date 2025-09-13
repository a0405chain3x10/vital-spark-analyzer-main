import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Patient } from '@/types/auth';
import { 
  Baby, 
  Calendar, 
  Weight, 
  Phone, 
  AlertTriangle,
  Pill,
  Stethoscope,
  User,
  Clock,
  Activity,
  Heart,
  Droplets
} from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
  onClose?: () => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onClose }) => {
  const { user } = useAuth();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Baby className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-muted-foreground">
              MRN: {patient.medicalRecordNumber} • {calculateAge(patient.dateOfBirth)} old
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(patient.currentStatus)}>
            {patient.currentStatus.toUpperCase()}
          </Badge>
          <Badge className={getRiskColor(patient.riskLevel)}>
            {patient.riskLevel.toUpperCase()} RISK
          </Badge>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Gestational Age</p>
                <p className="text-lg font-semibold">{patient.gestationalAge} weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Weight className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-lg font-semibold">{patient.currentWeight}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Birth Weight</p>
                <p className="text-lg font-semibold">{patient.birthWeight}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Days in NICU</p>
                <p className="text-lg font-semibold">
                  {Math.ceil((new Date().getTime() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Admission Date</p>
                    <p className="font-medium">{formatDate(patient.admissionDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Care Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Doctor</p>
                  <p className="font-medium">Dr. {patient.assignedDoctor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Nurses</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.assignedNurses.map((nurseId, index) => (
                      <Badge key={index} variant="secondary">
                        Nurse {nurseId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {patient.medicalHistory.conditions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Medical Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Medical Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory.conditions.length > 0 ? (
                  <div className="space-y-2">
                    {patient.medicalHistory.conditions.map((condition, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{condition}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No medical conditions recorded</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {patient.medicalHistory.allergies.map((allergy, index) => (
                      <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                        <p className="font-medium text-red-800">{allergy}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No known allergies</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.medicalHistory.medications.length > 0 ? (
                <div className="space-y-4">
                  {patient.medicalHistory.medications.map((medication) => (
                    <div key={medication.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{medication.name}</h4>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Dosage</p>
                              <p className="font-medium">{medication.dosage}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Frequency</p>
                              <p className="font-medium">{medication.frequency}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Start Date</p>
                              <p className="font-medium">{formatDate(medication.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Prescribed By</p>
                              <p className="font-medium">Dr. {medication.prescribedBy}</p>
                            </div>
                          </div>
                          {medication.notes && (
                            <div className="mt-3">
                              <p className="text-muted-foreground text-sm">Notes</p>
                              <p className="text-sm">{medication.notes}</p>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-4">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No medications currently prescribed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Medical Procedures
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.medicalHistory.procedures.length > 0 ? (
                <div className="space-y-4">
                  {patient.medicalHistory.procedures.map((procedure) => (
                    <div key={procedure.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{procedure.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(procedure.date)} • Performed by Dr. {procedure.performedBy}
                          </p>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Procedure Notes</p>
                          <p className="text-sm">{procedure.notes}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Outcome</p>
                          <p className="text-sm">{procedure.outcome}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No procedures recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Parent Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mother's Name</p>
                    <p className="font-medium">{patient.parentContact.motherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Father's Name</p>
                    <p className="font-medium">{patient.parentContact.fatherName}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Phone</p>
                    <p className="font-medium">{patient.parentContact.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                    <p className="font-medium">{patient.parentContact.emergencyContact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
