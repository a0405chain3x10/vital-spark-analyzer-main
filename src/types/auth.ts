export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'doctor' | 'nurse';
  department: string;
  licenseNumber: string;
  specialization?: string;
  shift?: 'day' | 'night' | 'rotating';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gestationalAge: number; // in weeks
  birthWeight: number; // in grams
  currentWeight: number; // in grams
  gender: 'male' | 'female';
  medicalRecordNumber: string;
  admissionDate: string;
  assignedDoctor: string; // User ID
  assignedNurses: string[]; // Array of User IDs
  parentContact: {
    motherName: string;
    fatherName: string;
    phoneNumber: string;
    emergencyContact: string;
  };
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: Medication[];
    procedures: Procedure[];
  };
  currentStatus: 'stable' | 'critical' | 'improving' | 'deteriorating';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string; // User ID
  notes?: string;
}

export interface Procedure {
  id: string;
  name: string;
  date: string;
  performedBy: string; // User ID
  notes: string;
  outcome: string;
}

export interface AuthContextType {
  user: User | null;
  patients: Patient[];
  selectedPatient: Patient | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => Promise<boolean>;
  selectPatient: (patientId: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  deletePatient: (patientId: string) => void;
  assignPatientToStaff: (patientId: string, doctorId?: string, nurseIds?: string[]) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'doctor' | 'nurse';
  department: string;
  licenseNumber: string;
  specialization?: string;
  shift?: 'day' | 'night' | 'rotating';
}
