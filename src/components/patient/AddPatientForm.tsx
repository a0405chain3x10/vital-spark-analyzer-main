import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Patient, Medication, Procedure } from '@/types/auth';
import { Plus, X, Save } from 'lucide-react';

interface AddPatientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSuccess, onCancel }) => {
  const { user, addPatient } = useAuth();

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

  const handleAddPatient = () => {
    if (!user) return;

    const patientData = {
      ...newPatient,
      admissionDate: newPatient.admissionDate || new Date().toISOString()
    };

    addPatient(patientData);
    onSuccess?.();
    resetForm();
  };

  const resetForm = () => {
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

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
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

            <div className="space-y-4">
              <Label>Quick Add Medication</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Medication name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                />
                <Input
                  type="datetime-local"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <Button onClick={addMedication} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleAddPatient}>
          <Save className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>
    </div>
  );
};
