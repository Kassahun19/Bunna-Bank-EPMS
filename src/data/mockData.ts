import {
  District,
  Branch,
  Department,
  User,
  KPI,
  PerformanceTarget,
  DailyPerformanceReport,
  Announcement,
  Notification,
  BankHoliday,
  AuditLog
} from '../types';
import { bunnaDistrictsAndAreaOffices, bunnaBranchDirectory } from './bunnaBranchDirectory';

export const initialDistricts: District[] = bunnaDistrictsAndAreaOffices;

export const initialBranches: Branch[] = bunnaBranchDirectory;

export const initialDepartments: Department[] = [
  { id: 'DEP-01', name: 'Retail Banking & DFS', code: 'RB', description: 'Manages deposit mobilization, account opening, and digital banking activations.' },
  { id: 'DEP-02', name: 'International Banking (FCY)', code: 'IB', description: 'Handles foreign currency trade, remittances, and SWIFT services.' },
  { id: 'DEP-03', name: 'Credit & Loans', code: 'CL', description: 'Evaluates loan applications, SME finance, and credit monitoring.' },
  { id: 'DEP-04', name: 'Human Resource Management', code: 'HR', description: 'Oversees staff performance, training, payroll, and promotions.' },
  { id: 'DEP-05', name: 'Digital Banking & Innovation', code: 'DBI', description: 'Manages Bunna Mobile, Internet Banking, ATMs, and Merchant POS.' },
];

export const initialKPIs: KPI[] = [
  { id: 'KPI-001', code: 'DEP_ETB', name: 'Deposits Mobilized (ETB)', category: 'Financial', unit: 'ETB', weight: 25, description: 'Total value of savings, demand, and fixed time deposits mobilized.' },
  { id: 'KPI-002', code: 'FCY_ETB', name: 'Foreign Currency Inflow (ETB)', category: 'Financial', unit: 'ETB', weight: 20, description: 'Total export earnings, foreign remittances, and FCY deposits in ETB equivalent.' },
  { id: 'KPI-003', code: 'DFS_ETB', name: 'Digital Financial Services (ETB)', category: 'Financial', unit: 'ETB', weight: 15, description: 'Volume transacted via Bunna Mobile, Internet Banking, and POS merchant acquiring.' },
  { id: 'KPI-004', code: 'ACC_OPEN', name: 'Account Openings', category: 'Customer Acquisition', unit: 'Count', weight: 10, description: 'Number of new individual, joint, and corporate accounts opened.' },
  { id: 'KPI-005', code: 'MB_ACT', name: 'Mobile Banking Activations', category: 'Digital Banking', unit: 'Count', weight: 10, description: 'Number of customers onboarded and actively transacting on Bunna Mobile.' },
  { id: 'KPI-006', code: 'IB_ACT', name: 'Internet Banking Activations', category: 'Digital Banking', unit: 'Count', weight: 8, description: 'Number of retail and corporate clients registered for Internet Banking.' },
  { id: 'KPI-007', code: 'MERCH_SOL', name: 'Merchant Solutions & QR', category: 'Digital Banking', unit: 'Count', weight: 7, description: 'Number of Bunna POS merchants and QR Code merchants deployed.' },
  { id: 'KPI-008', code: 'ATM_CARD', name: 'ATM Card Activations', category: 'Digital Banking', unit: 'Count', weight: 5, description: 'Number of debit/prepaid ATM cards issued and activated.' },
];

export const defaultUsers: User[] = [
  {
    id: 'USR-ADM-001',
    userId: '4994',
    email: 'kassahunmulatu273@gmail.com',
    firstName: 'Kassahun',
    middleName: 'Mulatu',
    lastName: 'Mulatu',
    role: 'ADMINISTRATOR',
    jobTitle: 'EPMS System Architect & Enterprise Admin',
    districtId: 'DIST-EAD',
    districtName: 'East A.A District',
    branchId: 'BR-101',
    branchName: 'Main HQ Branch',
    gender: 'Male',
    age: 32,
    phone: '+251911002233',
    status: 'Active',
    createdAt: '2026-01-01',
    password: 'Admin@360'
  },
  {
    id: 'USR-MGR-001',
    userId: '4994',
    email: 'manager.selam@bunnabanksc.com',
    firstName: 'Selamawit',
    middleName: 'Tadesse',
    lastName: 'Tadesse',
    role: 'MANAGER',
    jobTitle: 'Branch Operations Manager',
    districtId: 'DIST-EAD',
    districtName: 'East A.A District',
    branchId: 'BR-101',
    branchName: 'Main HQ Branch',
    gender: 'Female',
    age: 38,
    phone: '+251922334455',
    status: 'Active',
    createdAt: '2026-01-15',
    password: 'Manager@360'
  },
  {
    id: 'USR-EMP-001',
    userId: '4994',
    email: 'employee.kebede@bunnabanksc.com',
    firstName: 'Abebe',
    middleName: 'Kebede',
    lastName: 'Kebede',
    role: 'EMPLOYEE',
    jobTitle: 'Senior Customer Service Officer',
    districtId: 'DIST-EAD',
    districtName: 'East A.A District',
    branchId: 'BR-101',
    branchName: 'Main HQ Branch',
    gender: 'Male',
    age: 28,
    phone: '+251933445566',
    status: 'Active',
    createdAt: '2026-02-01',
    password: 'Employee@360'
  },
  {
    id: 'USR-EMP-002',
    userId: '1245',
    email: 'employee.marta@bunnabanksc.com',
    firstName: 'Marta',
    middleName: 'Hailu',
    lastName: 'Hailu',
    role: 'EMPLOYEE',
    jobTitle: 'Relationship Officer - Digital Banking',
    districtId: 'DIST-EAD',
    districtName: 'East A.A District',
    branchId: 'BR-101',
    branchName: 'Main HQ Branch',
    gender: 'Female',
    age: 26,
    phone: '+251944556677',
    status: 'Active',
    createdAt: '2026-02-10',
    password: 'Employee@360'
  },
  {
    id: 'USR-EMP-003',
    userId: '2356',
    email: 'employee.dawit@bunnabanksc.com',
    firstName: 'Dawit',
    middleName: 'Yohannes',
    lastName: 'Yohannes',
    role: 'EMPLOYEE',
    jobTitle: 'Junior Teller Officer',
    districtId: 'DIST-EAD',
    districtName: 'East A.A District',
    branchId: 'BR-101',
    branchName: 'Main HQ Branch',
    gender: 'Male',
    age: 25,
    phone: '+251955667788',
    status: 'Active',
    createdAt: '2026-02-15',
    password: 'Employee@360'
  },
  {
    id: 'USR-EMP-004',
    userId: '3467',
    email: 'employee.tigist@bunnabanksc.com',
    firstName: 'Tigist',
    middleName: 'Haile',
    lastName: 'Haile',
    role: 'EMPLOYEE',
    jobTitle: 'Digital Financial Services Officer',
    districtId: 'DIST-EAD',
    districtName: 'East A.A District',
    branchId: 'BR-101',
    branchName: 'Main HQ Branch',
    gender: 'Female',
    age: 27,
    phone: '+251966778899',
    status: 'Active',
    createdAt: '2026-02-20',
    password: 'Employee@360'
  },
  {
    id: 'USR-EMP-005',
    userId: '4578',
    email: 'employee.samuel@bunnabanksc.com',
    firstName: 'Samuel',
    middleName: 'Worku',
    lastName: 'Worku',
    role: 'EMPLOYEE',
    jobTitle: 'Forex & Trade Finance Specialist',
    districtId: 'DIST-EAD',
    districtName: 'East A.A District',
    branchId: 'BR-101',
    branchName: 'Main HQ Branch',
    gender: 'Male',
    age: 29,
    phone: '+251977889900',
    status: 'Active',
    createdAt: '2026-03-01',
    password: 'Employee@360'
  }
];

export const initialHolidays: BankHoliday[] = [
  { id: 'HOL-001', name: 'Ethiopian New Year (Enkutatash)', date: '2026-09-11', description: 'Official National & Banking Holiday', recurring: true },
  { id: 'HOL-002', name: 'Finding of the True Cross (Meskel)', date: '2026-09-27', description: 'Official Religious & Banking Holiday', recurring: true },
  { id: 'HOL-003', name: 'Ethiopian Christmas (Genna)', date: '2026-01-07', description: 'Official Religious & Banking Holiday', recurring: true },
  { id: 'HOL-004', name: 'Ethiopian Epiphany (Timkat)', date: '2026-01-19', description: 'Official Religious & Banking Holiday', recurring: true },
  { id: 'HOL-005', name: 'Victory of Adwa Day', date: '2026-03-02', description: 'Official National Holiday', recurring: true },
  { id: 'HOL-006', name: 'International Workers Day', date: '2026-05-01', description: 'Official Public & Banking Holiday', recurring: true },
  { id: 'HOL-007', name: 'Patriots Victory Day', date: '2026-05-05', description: 'Official National Holiday', recurring: true },
  { id: 'HOL-008', name: 'Eid al-Fitr', date: '2026-03-20', description: 'Islamic Public Holiday (Subject to moon sighting)', recurring: false },
  { id: 'HOL-009', name: 'Eid al-Adha (Arefa)', date: '2026-05-27', description: 'Islamic Public Holiday (Subject to moon sighting)', recurring: false },
];

export const initialAnnouncements: Announcement[] = [];

export const initialNotifications: Notification[] = [];

export const initialAuditLogs: AuditLog[] = [];

export const initialDailyReports: DailyPerformanceReport[] = [];

export const initialTargets: PerformanceTarget[] = [];
