
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
  address: string;
  previousSchool: string;
  status: StudentStatus;
  photoUrl?: string;
}

export const CLASSES = [
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3'
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    admissionNumber: 'SF/2023/001',
    fullName: 'Adewale Thompson',
    dateOfBirth: '2008-05-14',
    dateOfAdmission: '2023-09-01',
    gender: 'Male',
    class: 'SSS 1',
    parentName: 'Mr. & Mrs. Thompson',
    parentContact: '08012345678',
    address: '12 Victoria Island, Lagos',
    previousSchool: 'Grace Garden International',
    status: 'Active',
    photoUrl: 'https://picsum.photos/seed/student1/400/400'
  },
  {
    id: '2',
    admissionNumber: 'SF/2023/002',
    fullName: 'Chioma Okeke',
    dateOfBirth: '2010-11-20',
    dateOfAdmission: '2023-09-01',
    gender: 'Female',
    class: 'JSS 3',
    parentName: 'Dr. Okeke',
    parentContact: '08098765432',
    address: '45 Lekki Phase 1, Lagos',
    previousSchool: 'Bright Minds Academy',
    status: 'Active',
    photoUrl: 'https://picsum.photos/seed/student2/400/400'
  },
  {
    id: '3',
    admissionNumber: 'SF/2022/045',
    fullName: 'Musa Ibrahim',
    dateOfBirth: '2009-02-10',
    dateOfAdmission: '2022-09-10',
    gender: 'Male',
    class: 'SSS 2',
    parentName: 'Alhaji Ibrahim',
    parentContact: '07011223344',
    address: '8 Ikeja GRA, Lagos',
    previousSchool: 'Northern Star College',
    status: 'Withdrawn',
    photoUrl: 'https://picsum.photos/seed/student3/400/400'
  }
];
