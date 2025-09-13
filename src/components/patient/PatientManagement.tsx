import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Patient, Medication, Procedure } from '@/types/auth';
import { 
  Baby, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Weight, 
  Phone, 
  AlertTriangle,
  Pill,
  Stethoscope,
  Save,
  X
} from 'lucide-react';

export const PatientManagement: React.FC = () => {
  const { user, patients, addPatient, updatePatient, deletePatient } = useAuth();
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gestationalAge: 0,
    birthWeight: 0,
    currentWeight: 0,
    gender: 'male' as 'male' | 'female',
    medicalRecordNumber: '',
    admissionDate: '',
    assignedDoctor: user?.role === 'doctor' ? user.id : '',
    assignedNurses: user?.role === 'nurse' ? [user.id] : [],
    parentContact: {
      motherName: '',
      fatherName: '',
      phoneNumber: '',
      emergencyContact: ''
    },
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: [],
      procedures: []
    },
    currentStatus: 'stable' as const,
    riskLevel: 'low' as const
  });

  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    notes: ''
  });
  const [newProcedure, setNewProcedure] = useState({
    name: '',
    date: '',
    notes: '',
    outcome: ''
  });

  const handleAddPatient = () => {
    if (!user) return;

    const patientData = {
      ...newPatient,
      admissionDate: newPatient.admissionDate || new Date().toISOString()
    };

    addPatient(patientData);
    setIsAddingPatient(false);
    resetNewPatient();
  };

  const resetNewPatient = () => {
    setNewPatient({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gestationalAge: 0,
      birthWeight: 0,
      currentWeight: 0,
      gender: 'male',
      medicalRecordNumber: '',
      admissionDate: '',
      assignedDoctor: user?.role === 'doctor' ? user.id : '',
      assignedNurses: user?.role === 'nurse' ? [user.id] : [],
      parentContact: {
        motherName: '',
        fatherName: '',
        phoneNumber: '',
        emergencyContact: ''
      },
      medicalHistory: {
        conditions: [],
        allergies: [],
        medications: [],
        procedures: []
      },
      currentStatus: 'stable',
      riskLevel: 'low'
    });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setNewPatient(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          conditions: [...prev.medicalHistory.conditions, newCondition.trim()]
        }
      }));
      setNewCondition('');
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setNewPatient(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          allergies: [...prev.medicalHistory.allergies, newAllergy.trim()]
        }
      }));
      setNewAllergy('');
    }
  };

  const addMedication = () => {
    if (newMedication.name.trim() && user) {
      const medication: Medication = {
        id: Date.now().toString(),
        ...newMedication,
        prescribedBy: user.id
      };
      
      setNewPatient(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          medications: [...prev.medicalHistory.medications, medication]
        }
      }));
      
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        startDate: '',
        notes: ''
      });
    }
  };

  const addProcedure = () => {
    if (newProcedure.name.trim() && user) {
      const procedure: Procedure = {
        id: Date.now().toString(),
        ...newProcedure,
        performedBy: user.id
      };
      
      setNewPatient(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          procedures: [...prev.medicalHistory.procedures, procedure]
        }
      }));
      
      setNewProcedure({
        name: '',
        date: '',
        notes: '',
        outcome: ''
      });
    }
  };

  const removeCondition = (index: number) => {
    setNewPatient(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        conditions: prev.medicalHistory.conditions.filter((_, i) => i !== index)
      }
    }));
  };

  const removeAllergy = (index: number) => {
    setNewPatient(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        allergies: prev.medicalHistory.allergies.filter((_, i) => i !== index)
      }
    }));
  };

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

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patient Management</h2>
        {user.role === 'doctor' && (
          <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient's information and medical details
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="medical">Medical History</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newPatient.firstName}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Baby"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newPatient.lastName}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="datetime-local"
                        value={newPatient.dateOfBirth}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={newPatient.gender}
                        onValueChange={(value: 'male' | 'female') => 
                          setNewPatient(prev => ({ ...prev, gender: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gestationalAge">Gestational Age (weeks)</Label>
                      <Input
                        id="gestationalAge"
                        type="number"
                        value={newPatient.gestationalAge}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, gestationalAge: parseInt(e.target.value) || 0 }))}
                        placeholder="32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthWeight">Birth Weight (grams)</Label>
                      <Input
                        id="birthWeight"
                        type="number"
                        value={newPatient.birthWeight}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, birthWeight: parseInt(e.target.value) || 0 }))}
                        placeholder="1800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentWeight">Current Weight (grams)</Label>
                      <Input
                        id="currentWeight"
                        type="number"
                        value={newPatient.currentWeight}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, currentWeight: parseInt(e.target.value) || 0 }))}
                        placeholder="1950"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalRecordNumber">Medical Record Number</Label>
                    <Input
                      id="medicalRecordNumber"
                      value={newPatient.medicalRecordNumber}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, medicalRecordNumber: e.target.value }))}
                      placeholder="MRN001234"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="motherName">Mother's Name</Label>
                      <Input
                        id="motherName"
                        value={newPatient.parentContact.motherName}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          parentContact: { ...prev.parentContact, motherName: e.target.value }
                        }))}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input
                        id="fatherName"
                        value={newPatient.parentContact.fatherName}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          parentContact: { ...prev.parentContact, fatherName: e.target.value }
                        }))}
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={newPatient.parentContact.phoneNumber}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          parentContact: { ...prev.parentContact, phoneNumber: e.target.value }
                        }))}
                        placeholder="+1-555-0123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={newPatient.parentContact.emergencyContact}
                        onChange={(e) => setNewPatient(prev => ({
                          ...prev,
                          parentContact: { ...prev.parentContact, emergencyContact: e.target.value }
                        }))}
                        placeholder="+1-555-0124"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Medical Conditions</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          placeholder="Enter condition"
                          onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                        />
                        <Button onClick={addCondition} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newPatient.medicalHistory.conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {condition}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeCondition(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Allergies</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          placeholder="Enter allergy"
                          onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                        />
                        <Button onClick={addAllergy} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newPatient.medicalHistory.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="flex items-center gap-1">
                            {allergy}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeAllergy(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medications" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicationName">Medication Name</Label>
                        <Input
                          id="medicationName"
                          value={newMedication.name}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Surfactant"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input
                          id="dosage"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                          placeholder="100mg/kg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input
                          id="frequency"
                          value={newMedication.frequency}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                          placeholder="Once daily"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={newMedication.startDate}
                          onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicationNotes">Notes</Label>
                      <Textarea
                        id="medicationNotes"
                        value={newMedication.notes}
                        onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes about the medication"
                      />
                    </div>

                    <Button onClick={addMedication} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>

                    {newPatient.medicalHistory.medications.length > 0 && (
                      <div className="space-y-2">
                        <Label>Added Medications</Label>
                        <div className="space-y-2">
                          {newPatient.medicalHistory.medications.map((med, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {med.dosage} • {med.frequency}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  <Pill className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingPatient(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient}>
                  <Save className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {patient.firstName} {patient.lastName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    MRN: {patient.medicalRecordNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(patient.currentStatus)}>
                    {patient.currentStatus.toUpperCase()}
                  </Badge>
                  <Badge className={getRiskColor(patient.riskLevel)}>
                    {patient.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">GA</p>
                    <p className="font-medium">{patient.gestationalAge}w</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{patient.currentWeight}g</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Parents</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.parentContact.motherName} & {patient.parentContact.fatherName}
                    </p>
                  </div>
                </div>
              </div>

              {patient.medicalHistory.conditions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Conditions</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {patient.medicalHistory.conditions.slice(0, 2).map((condition, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                    {patient.medicalHistory.conditions.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{patient.medicalHistory.conditions.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <Baby className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {user.role === 'doctor' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingPatient(patient)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {patients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Baby className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Patients Assigned</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any patients assigned to you at this time.
            </p>
            {user.role === 'doctor' && (
              <Button onClick={() => setIsAddingPatient(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Patient
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
