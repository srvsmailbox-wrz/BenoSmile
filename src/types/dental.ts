export type SpecialtyType = 
  | 'omnipratique'
  | 'implantologie'
  | 'orthodontie'
  | 'pedodontie'
  | 'esthetique'
  | 'parodontologie';

export interface Practitioner {
  id: string;
  name: string;
  title: string;
  specialty: string;
  specialtyKey: SpecialtyType;
  rppsNumber: string;
  avatarUrl: string;
  bio: string;
  diplomas: string[];
  conventionSector: 'Secteur 1 (Sans dépassement)' | 'Secteur 2 (Honoraires maîtrisés)';
  availableDays: number[]; // 1 = Monday, 6 = Saturday
  experienceYears: number;
}

export type CareCategory = 'prevention' | 'soins' | 'urgence' | 'esthetique' | 'chirurgie' | 'orthodontie';

export interface CareReason {
  id: string;
  title: string;
  category: CareCategory;
  categoryLabel: string;
  durationMinutes: number;
  basePrice: number;
  secuCoveragePercent: number;
  conventionInfo: string;
  description: string;
  isUrgent?: boolean;
}

export interface ToothInfo {
  number: number;
  name: string;
  arch: 'upper' | 'lower';
  side: 'left' | 'right';
  type: 'incisive' | 'canine' | 'premolaire' | 'molaire';
}

export interface PatientInfo {
  civility: 'M.' | 'Mme';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  isNewPatient: boolean;
  socialSecurityNumber?: string;
  medicalAlerts?: string[];
  notes?: string;
}

export type AppointmentStatus = 
  | 'confirmed' 
  | 'waiting_room' 
  | 'in_consultation' 
  | 'completed' 
  | 'cancelled';

export interface Appointment {
  id: string;
  referenceCode: string;
  practitionerId: string;
  practitionerName: string;
  reasonId: string;
  reasonTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  patientInfo: PatientInfo;
  selectedTooth?: number;
  selectedToothName?: string;
  symptoms?: string[];
  status: AppointmentStatus;
  createdAt: string;
  priceEstimate: number;
}

export interface DaySchedule {
  date: string;
  displayDay: string;
  displayDate: string;
  availableSlotsCount: number;
  isToday?: boolean;
}

export interface TimeSlot {
  time: string;
  practitionerId: string;
  isAvailable: boolean;
}
