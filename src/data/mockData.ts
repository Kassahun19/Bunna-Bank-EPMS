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

export const initialKPIs: KPI[] = [];

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
