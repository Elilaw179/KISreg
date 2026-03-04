export type StudentStatus = 'Active' | 'Withdrawn';

export interface Student {
  id: string;
  admissionNumber: string;
  fullName: string;
  dateOfBirth: string;
  dateOfAdmission: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string;
  parentName: string;
  parentContact: string;
  parentEmail: string;
  parentOccupation: string;
  address: string;
  previousSchool: string;
  status: StudentStatus;
  photoUrl?: string;
  nationality: string;
  bloodGroup?: string;
  medicalInfo?: string;
}

export interface Teacher {
  id: string;
  staffId: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  phone: string;
  email: string;
  address: string;
  designation: string;
  department: string;
  qualification: string;
  dateOfJoining: string;
  photoUrl?: string;
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
}

export const CLASSES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SS 1', 'SS 2', 'SS 3'
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    admissionNumber: 'KIS/2024/001',
    fullName: 'Adewale Thompson',
    dateOfBirth: '2008-05-14',
    dateOfAdmission: '2023-09-01',
    gender: 'Male',
    class: 'SS 1',
    parentName: 'Mr. & Mrs. Thompson',
    parentContact: '08012345678',
    parentEmail: 'thompson@example.com',
    parentOccupation: 'Mechanical Engineer',
    address: '12 Victoria Island, Lagos',
    previousSchool: 'Grace Garden International',
    status: 'Active',
    photoUrl: 'https://picsum.photos/seed/student1/400/400',
    nationality: 'Nigerian',
    bloodGroup: 'O+',
    medicalInfo: 'No known allergies'
  },
  {
    id: '2',
    admissionNumber: 'KIS/2024/002',
    fullName: 'Chioma Okeke',
    dateOfBirth: '2010-11-20',
    dateOfAdmission: '2023-09-01',
    gender: 'Female',
    class: 'JSS 3',
    parentName: 'Dr. & Dr. (Mrs) Okeke',
    parentContact: '08098765432',
    parentEmail: 'okeke.family@gmail.com',
    parentOccupation: 'Medical Consultants',
    address: '45 Lekki Phase 1, Lagos',
    previousSchool: 'Bright Minds Academy',
    status: 'Active',
    photoUrl: 'https://picsum.photos/seed/student2/400/400',
    nationality: 'Nigerian',
    bloodGroup: 'A+',
    medicalInfo: 'Severe Peanut allergy'
  },
  {
    id: '3',
    admissionNumber: 'KIS/2024/003',
    fullName: 'Ibrahim Musa',
    dateOfBirth: '2009-03-12',
    dateOfAdmission: '2024-01-10',
    gender: 'Male',
    class: 'SS 2',
    parentName: 'Alhaji Musa',
    parentContact: '07033445566',
    parentEmail: 'musa.i@yahoo.com',
    parentOccupation: 'Business Executive',
    address: '88 Ikeja GRA, Lagos',
    previousSchool: 'First Enrollment',
    status: 'Active',
    photoUrl: 'https://picsum.photos/seed/student3/400/400',
    nationality: 'Nigerian',
    bloodGroup: 'B+',
    medicalInfo: 'None'
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    staffId: 'KIS/STAFF/001',
    fullName: 'Mr. Olumide Bakare',
    dateOfBirth: '1985-04-12',
    gender: 'Male',
    nationality: 'Nigerian',
    maritalStatus: 'Married',
    phone: '08022334455',
    email: 'olumide.bakare@kourrklys.edu.ng',
    address: '22 Gbagada Estate, Lagos',
    designation: 'Mathematics Teacher',
    department: 'Sciences',
    qualification: 'B.Sc (Ed) Mathematics',
    dateOfJoining: '2020-01-15',
    photoUrl: 'https://picsum.photos/seed/teacher1/400/400',
    nextOfKin: {
      name: 'Mrs. Funmi Bakare',
      relationship: 'Spouse',
      phone: '08033445566',
      address: '22 Gbagada Estate, Lagos'
    }
  },
  {
    id: '2',
    staffId: 'KIS/STAFF/002',
    fullName: 'Ms. Sarah Okoro',
    dateOfBirth: '1992-07-25',
    gender: 'Female',
    nationality: 'Nigerian',
    maritalStatus: 'Single',
    phone: '09011223344',
    email: 'sarah.okoro@kourrklys.edu.ng',
    address: '15 Ikeja Along, Lagos',
    designation: 'English Language Teacher',
    department: 'Languages',
    qualification: 'B.A (Ed) English',
    dateOfJoining: '2022-09-01',
    photoUrl: 'https://picsum.photos/seed/teacher2/400/400',
    nextOfKin: {
      name: 'Mr. Jude Okoro',
      relationship: 'Brother',
      phone: '08122334455',
      address: '8 Owerri Road, Enugu'
    }
  }
];
