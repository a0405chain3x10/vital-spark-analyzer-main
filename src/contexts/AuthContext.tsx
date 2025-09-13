import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Patient, AuthContextType, LoginCredentials, RegisterData } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'dr.smith@hospital.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'doctor',
    department: 'NICU',
    licenseNumber: 'MD123456',
    specialization: 'Neonatology',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    email: 'nurse.johnson@hospital.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'nurse',
    department: 'NICU',
    licenseNumber: 'RN789012',
    shift: 'day',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T07:30:00Z'
  },
  {
    id: '3',
    email: 'dr.williams@hospital.com',
    firstName: 'Emily',
    lastName: 'Williams',
    role: 'doctor',
    department: 'NICU',
    licenseNumber: 'MD345678',
    specialization: 'Pediatric Cardiology',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockPatients: Patient[] = [
  {
    id: 'p1',
    firstName: 'Baby',
    lastName: 'Anderson',
    dateOfBirth: '2024-01-10T14:30:00Z',
    gestationalAge: 32,
    birthWeight: 1800,
    currentWeight: 1950,
    gender: 'male',
    medicalRecordNumber: 'MRN001234',
    admissionDate: '2024-01-10T14:30:00Z',
    assignedDoctor: '1',
    assignedNurses: ['2'],
    parentContact: {
      motherName: 'Lisa Anderson',
      fatherName: 'Mark Anderson',
      phoneNumber: '+1-555-0123',
      emergencyContact: '+1-555-0124'
    },
    medicalHistory: {
      conditions: ['Premature birth', 'Respiratory distress syndrome'],
      allergies: [],
      medications: [
        {
          id: 'm1',
          name: 'Surfactant',
          dosage: '100mg/kg',
          frequency: 'Once',
          startDate: '2024-01-10T15:00:00Z',
          prescribedBy: '1',
          notes: 'Administered for RDS treatment'
        }
      ],
      procedures: [
        {
          id: 'pr1',
          name: 'Intubation',
          date: '2024-01-10T14:45:00Z',
          performedBy: '1',
          notes: 'Emergency intubation due to respiratory distress',
          outcome: 'Successful, patient stabilized'
        }
      ]
    },
    currentStatus: 'stable',
    riskLevel: 'moderate',
    isActive: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'p2',
    firstName: 'Baby',
    lastName: 'Chen',
    dateOfBirth: '2024-01-12T09:15:00Z',
    gestationalAge: 28,
    birthWeight: 1200,
    currentWeight: 1350,
    gender: 'female',
    medicalRecordNumber: 'MRN001235',
    admissionDate: '2024-01-12T09:15:00Z',
    assignedDoctor: '3',
    assignedNurses: ['2'],
    parentContact: {
      motherName: 'Wei Chen',
      fatherName: 'David Chen',
      phoneNumber: '+1-555-0125',
      emergencyContact: '+1-555-0126'
    },
    medicalHistory: {
      conditions: ['Extremely premature birth', 'Patent ductus arteriosus'],
      allergies: [],
      medications: [
        {
          id: 'm2',
          name: 'Indomethacin',
          dosage: '0.1mg/kg',
          frequency: 'Every 12 hours',
          startDate: '2024-01-13T08:00:00Z',
          prescribedBy: '3',
          notes: 'For PDA closure'
        }
      ],
      procedures: []
    },
    currentStatus: 'critical',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Filter patients based on user role and assignments
  const getAccessiblePatients = (currentUser: User): Patient[] => {
    if (!currentUser) return [];
    
    return patients.filter(patient => {
      if (currentUser.role === 'doctor') {
        return patient.assignedDoctor === currentUser.id;
      } else if (currentUser.role === 'nurse') {
        return patient.assignedNurses.includes(currentUser.id);
      }
      return false;
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email && u.isActive);
    
    if (foundUser) {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Set first accessible patient as selected
      const accessiblePatients = getAccessiblePatients(updatedUser);
      if (accessiblePatients.length > 0) {
        setSelectedPatient(accessiblePatients[0]);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setSelectedPatient(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      department: userData.department,
      licenseNumber: userData.licenseNumber,
      specialization: userData.specialization,
      shift: userData.shift,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      return false;
    }

    mockUsers.push(newUser);
    return true;
  };

  const selectPatient = (patientId: string) => {
    if (!user) return;
    
    const accessiblePatients = getAccessiblePatients(user);
    const patient = accessiblePatients.find(p => p.id === patientId);
    
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (patientId: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
        : patient
    ));

    // Update selected patient if it's the one being updated
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }
  };

  const deletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
    
    // Clear selected patient if it's the one being deleted
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(null);
    }
  };

  const assignPatientToStaff = (patientId: string, doctorId?: string, nurseIds?: string[]) => {
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId) {
        const updates: Partial<Patient> = { updatedAt: new Date().toISOString() };
        
        if (doctorId !== undefined) {
          updates.assignedDoctor = doctorId;
        }
        
        if (nurseIds !== undefined) {
          updates.assignedNurses = nurseIds;
        }
        
        return { ...patient, ...updates };
      }
      return patient;
    }));
  };

  const contextValue: AuthContextType = {
    user,
    patients: user ? getAccessiblePatients(user) : [],
    selectedPatient,
    login,
    logout,
    register,
    selectPatient,
    addPatient,
    updatePatient,
    deletePatient,
    assignPatientToStaff
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
