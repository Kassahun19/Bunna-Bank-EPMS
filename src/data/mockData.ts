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

export const initialDistricts: District[] = [
  // Regional Cities as Districts
  { id: 'DIST-001', name: 'Addis Ababa District', code: 'AAD', region: 'Addis Ababa', branchCount: 8, totalEmployees: 450, managerName: 'Abebe Kebede' },
  { id: 'DIST-002', name: 'Hawassa District', code: 'HWD', region: 'Sidama Region', branchCount: 4, totalEmployees: 280, managerName: 'Tigist Haile' },
  { id: 'DIST-003', name: 'Adama District', code: 'ADM', region: 'Oromia Region', branchCount: 4, totalEmployees: 250, managerName: 'Dawit Yohannes' },
  { id: 'DIST-004', name: 'Dire Dawa District', code: 'DDW', region: 'Dire Dawa & Harari Region', branchCount: 3, totalEmployees: 210, managerName: 'Genet Worku' },
  { id: 'DIST-005', name: 'Bahir Dar District', code: 'BDR', region: 'Amhara Region', branchCount: 3, totalEmployees: 220, managerName: 'Kassahun Belay' },
  { id: 'DIST-006', name: 'Mekelle District', code: 'MKL', region: 'Tigray Region', branchCount: 3, totalEmployees: 190, managerName: 'Berhane Tekle' },
  { id: 'DIST-007', name: 'Jimma District', code: 'JMA', region: 'Oromia Region', branchCount: 3, totalEmployees: 180, managerName: 'Girma Demissie' },
  { id: 'DIST-008', name: 'Gondar District', code: 'GDR', region: 'Amhara Region', branchCount: 3, totalEmployees: 175, managerName: 'Mulugeta Tadesse' },
  { id: 'DIST-009', name: 'Jigjiga District', code: 'JJG', region: 'Somali Region', branchCount: 2, totalEmployees: 140, managerName: 'Fatima Ahmed' },
  { id: 'DIST-010', name: 'Semera District', code: 'SMR', region: 'Afar Region', branchCount: 2, totalEmployees: 110, managerName: 'Mohammed Ali' },

  // Zone Cities as Districts
  { id: 'DIST-011', name: 'Bishoftu District', code: 'BSH', region: 'East Shewa Zone, Oromia', branchCount: 2, totalEmployees: 130, managerName: 'Tolosa Bekele' },
  { id: 'DIST-012', name: 'Dessie District', code: 'DES', region: 'South Wollo Zone, Amhara', branchCount: 2, totalEmployees: 160, managerName: 'Yirga Worku' },
  { id: 'DIST-013', name: 'Debre Markos District', code: 'DBM', region: 'East Gojjam Zone, Amhara', branchCount: 2, totalEmployees: 125, managerName: 'Getachew Assefa' },
  { id: 'DIST-014', name: 'Nekemte District', code: 'NKT', region: 'East Welega Zone, Oromia', branchCount: 2, totalEmployees: 135, managerName: 'Lammaa Gudina' },
  { id: 'DIST-015', name: 'Hosanna District', code: 'HSN', region: 'Hadiya Zone, Central Ethiopia', branchCount: 2, totalEmployees: 115, managerName: 'Hailemariam Desalegn' },
  { id: 'DIST-016', name: 'Arba Minch District', code: 'AMN', region: 'Gamo Zone, South Ethiopia', branchCount: 2, totalEmployees: 140, managerName: 'Teshale Markos' },
  { id: 'DIST-017', name: 'Shashemene District', code: 'SHM', region: 'West Arsi Zone, Oromia', branchCount: 2, totalEmployees: 130, managerName: 'Bedria Oumer' },
  { id: 'DIST-018', name: 'Wolaita Sodo District', code: 'WSD', region: 'Wolaita Zone, South Ethiopia', branchCount: 2, totalEmployees: 125, managerName: 'Abebech Bassa' },
  { id: 'DIST-019', name: 'Harar District', code: 'HRR', region: 'Harari Region / Zone', branchCount: 2, totalEmployees: 105, managerName: 'Abdi Yusuf' },
  { id: 'DIST-020', name: 'Asosa District', code: 'ASO', region: 'Benishangul-Gumuz', branchCount: 1, totalEmployees: 95, managerName: 'Kifle Wolde' },
  { id: 'DIST-021', name: 'Gambela District', code: 'GMB', region: 'Gambela Region', branchCount: 1, totalEmployees: 90, managerName: 'Othow Omot' },
];

export const initialBranches: Branch[] = [
  // Addis Ababa District Branches
  { id: 'BR-AAD-01', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Main HQ Branch', code: 'AAD-01', type: 'Main Branch', employeeCount: 120, managerName: 'Selamawit Tadesse', location: 'Arat Kilo, Addis Ababa' },
  { id: 'BR-AAD-02', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Arat Kilo Branch', code: 'AAD-02', type: 'Grade I', employeeCount: 35, managerName: 'Aman Kassaye', location: 'Arat Kilo, Addis Ababa' },
  { id: 'BR-AAD-03', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Bole Medhanealem Branch', code: 'AAD-03', type: 'Grade I', employeeCount: 45, managerName: 'Eleni Berhanu', location: 'Bole, Addis Ababa' },
  { id: 'BR-AAD-04', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Megenagna Branch', code: 'AAD-04', type: 'Grade I', employeeCount: 40, managerName: 'Yared Alemayehu', location: 'Megenagna, Addis Ababa' },
  { id: 'BR-AAD-05', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Piazza Branch', code: 'AAD-05', type: 'Grade I', employeeCount: 32, managerName: 'Kassahun Bekele', location: 'Piazza, Addis Ababa' },
  { id: 'BR-AAD-06', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Kazanchis Branch', code: 'AAD-06', type: 'Grade II', employeeCount: 28, managerName: 'Tigist Zewde', location: 'Kazanchis, Addis Ababa' },
  { id: 'BR-AAD-07', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Mexico Square Branch', code: 'AAD-07', type: 'Grade II', employeeCount: 26, managerName: 'Henok Worku', location: 'Mexico Square, Addis Ababa' },
  { id: 'BR-AAD-08', districtId: 'DIST-001', districtName: 'Addis Ababa District', name: 'Addis Ababa Sarbet Branch', code: 'AAD-08', type: 'Grade II', employeeCount: 25, managerName: 'Tewodros Bekele', location: 'Sarbet, Addis Ababa' },

  // Hawassa District Branches
  { id: 'BR-HWD-01', districtId: 'DIST-002', districtName: 'Hawassa District', name: 'Hawassa Main Branch', code: 'HWD-01', type: 'Main Branch', employeeCount: 55, managerName: 'Ainshe Solomon', location: 'Piazza, Hawassa' },
  { id: 'BR-HWD-02', districtId: 'DIST-002', districtName: 'Hawassa District', name: 'Hawassa Tabor Branch', code: 'HWD-02', type: 'Grade I', employeeCount: 30, managerName: 'Tariku Lemma', location: 'Tabor, Hawassa' },
  { id: 'BR-HWD-03', districtId: 'DIST-002', districtName: 'Hawassa District', name: 'Hawassa Menagesha Branch', code: 'HWD-03', type: 'Grade II', employeeCount: 24, managerName: 'Senait Wolde', location: 'Menagesha, Hawassa' },
  { id: 'BR-HWD-04', districtId: 'DIST-002', districtName: 'Hawassa District', name: 'Hawassa Lake View Branch', code: 'HWD-04', type: 'Grade II', employeeCount: 22, managerName: 'Daniel Assefa', location: 'Lake Area, Hawassa' },

  // Adama District Branches
  { id: 'BR-ADM-01', districtId: 'DIST-003', districtName: 'Adama District', name: 'Adama Main Branch', code: 'ADM-01', type: 'Main Branch', employeeCount: 50, managerName: 'Daniel Mengistu', location: 'Central Market, Adama' },
  { id: 'BR-ADM-02', districtId: 'DIST-003', districtName: 'Adama District', name: 'Adama Wonji Road Branch', code: 'ADM-02', type: 'Grade I', employeeCount: 28, managerName: 'Girma Tufa', location: 'Wonji Road, Adama' },
  { id: 'BR-ADM-03', districtId: 'DIST-003', districtName: 'Adama District', name: 'Adama Ganda Hara Branch', code: 'ADM-03', type: 'Grade II', employeeCount: 25, managerName: 'Lensa Chala', location: 'Ganda Hara, Adama' },
  { id: 'BR-ADM-04', districtId: 'DIST-003', districtName: 'Adama District', name: 'Adama Express Highway Branch', code: 'ADM-04', type: 'Grade II', employeeCount: 20, managerName: 'Bekele Dinku', location: 'Express Highway, Adama' },

  // Dire Dawa District Branches
  { id: 'BR-DDW-01', districtId: 'DIST-004', districtName: 'Dire Dawa District', name: 'Dire Dawa Main Branch', code: 'DDW-01', type: 'Main Branch', employeeCount: 45, managerName: 'Mustafa Omar', location: 'Kebele 01, Dire Dawa' },
  { id: 'BR-DDW-02', districtId: 'DIST-004', districtName: 'Dire Dawa District', name: 'Dire Dawa Taiwan Market Branch', code: 'DDW-02', type: 'Grade I', employeeCount: 26, managerName: 'Amina Idris', location: 'Taiwan Market, Dire Dawa' },
  { id: 'BR-DDW-03', districtId: 'DIST-004', districtName: 'Dire Dawa District', name: 'Dire Dawa Kebele 02 Branch', code: 'DDW-03', type: 'Grade II', employeeCount: 22, managerName: 'Suleiman Hassan', location: 'Kebele 02, Dire Dawa' },

  // Bahir Dar District Branches
  { id: 'BR-BDR-01', districtId: 'DIST-005', districtName: 'Bahir Dar District', name: 'Bahir Dar Main Branch', code: 'BDR-01', type: 'Main Branch', employeeCount: 48, managerName: 'Aster Wolde', location: 'City Center, Bahir Dar' },
  { id: 'BR-BDR-02', districtId: 'DIST-005', districtName: 'Bahir Dar District', name: 'Bahir Dar Lake Tana Branch', code: 'BDR-02', type: 'Grade I', employeeCount: 32, managerName: 'Mulugeta Belay', location: 'Lake Tana Shore, Bahir Dar' },
  { id: 'BR-BDR-03', districtId: 'DIST-005', districtName: 'Bahir Dar District', name: 'Bahir Dar Kebele 11 Branch', code: 'BDR-03', type: 'Grade II', employeeCount: 24, managerName: 'Tizita Mengesha', location: 'Kebele 11, Bahir Dar' },

  // Mekelle District Branches
  { id: 'BR-MKL-01', districtId: 'DIST-006', districtName: 'Mekelle District', name: 'Mekelle Main Branch', code: 'MKL-01', type: 'Main Branch', employeeCount: 42, managerName: 'Berhane Tekle', location: 'City Center, Mekelle' },
  { id: 'BR-MKL-02', districtId: 'DIST-006', districtName: 'Mekelle District', name: 'Mekelle Kedamay Weyane Branch', code: 'MKL-02', type: 'Grade I', employeeCount: 28, managerName: 'Gebremeshkel Hagos', location: 'Kedamay Weyane, Mekelle' },
  { id: 'BR-MKL-03', districtId: 'DIST-006', districtName: 'Mekelle District', name: 'Mekelle Ayder Branch', code: 'MKL-03', type: 'Grade II', employeeCount: 22, managerName: 'Letebrahan Kahsay', location: 'Ayder, Mekelle' },

  // Jimma District Branches
  { id: 'BR-JMA-01', districtId: 'DIST-007', districtName: 'Jimma District', name: 'Jimma Main Branch', code: 'JMA-01', type: 'Main Branch', employeeCount: 44, managerName: 'Girma Demissie', location: 'Center Town, Jimma' },
  { id: 'BR-JMA-02', districtId: 'DIST-007', districtName: 'Jimma District', name: 'Jimma Ginjo Branch', code: 'JMA-02', type: 'Grade I', employeeCount: 26, managerName: 'Jihad Abba', location: 'Ginjo, Jimma' },
  { id: 'BR-JMA-03', districtId: 'DIST-007', districtName: 'Jimma District', name: 'Jimma Hermata Branch', code: 'JMA-03', type: 'Grade II', employeeCount: 22, managerName: 'Rahma Abdo', location: 'Hermata Market, Jimma' },

  // Gondar District Branches
  { id: 'BR-GDR-01', districtId: 'DIST-008', districtName: 'Gondar District', name: 'Gondar Main Branch', code: 'GDR-01', type: 'Main Branch', employeeCount: 46, managerName: 'Yohannes Getachew', location: 'Piazza, Gondar' },
  { id: 'BR-GDR-02', districtId: 'DIST-008', districtName: 'Gondar District', name: 'Gondar Arada Branch', code: 'GDR-02', type: 'Grade I', employeeCount: 27, managerName: 'Tewabech Worku', location: 'Arada, Gondar' },
  { id: 'BR-GDR-03', districtId: 'DIST-008', districtName: 'Gondar District', name: 'Gondar Maraki Branch', code: 'GDR-03', type: 'Grade II', employeeCount: 23, managerName: 'Getaneh Wole', location: 'Maraki Campus, Gondar' },

  // Jigjiga District Branches
  { id: 'BR-JJG-01', districtId: 'DIST-009', districtName: 'Jigjiga District', name: 'Jigjiga Main Branch', code: 'JJG-01', type: 'Main Branch', employeeCount: 38, managerName: 'Ahmed Nur', location: 'City Center, Jigjiga' },
  { id: 'BR-JJG-02', districtId: 'DIST-009', districtName: 'Jigjiga District', name: 'Jigjiga Taiwan Branch', code: 'JJG-02', type: 'Grade I', employeeCount: 24, managerName: 'Farhiya Hassan', location: 'Taiwan Market, Jigjiga' },

  // Semera District Branches
  { id: 'BR-SMR-01', districtId: 'DIST-010', districtName: 'Semera District', name: 'Semera Main Branch', code: 'SMR-01', type: 'Main Branch', employeeCount: 32, managerName: 'Mohammed Ali', location: 'Semera Town' },
  { id: 'BR-SMR-02', districtId: 'DIST-010', districtName: 'Semera District', name: 'Semera Logia Branch', code: 'SMR-02', type: 'Grade I', employeeCount: 25, managerName: 'Fatuma Humed', location: 'Logia Highway, Semera' },

  // ZONE CITIES DISTRICT BRANCHES
  // Bishoftu District
  { id: 'BR-BSH-01', districtId: 'DIST-011', districtName: 'Bishoftu District', name: 'Bishoftu Central Branch', code: 'BSH-01', type: 'Main Branch', employeeCount: 35, managerName: 'Tolosa Bekele', location: 'City Center, Bishoftu' },
  { id: 'BR-BSH-02', districtId: 'DIST-011', districtName: 'Bishoftu District', name: 'Bishoftu Lake Hora Branch', code: 'BSH-02', type: 'Grade I', employeeCount: 22, managerName: 'Chaltu Deresse', location: 'Lake Hora, Bishoftu' },

  // Dessie District
  { id: 'BR-DES-01', districtId: 'DIST-012', districtName: 'Dessie District', name: 'Dessie Main Branch', code: 'DES-01', type: 'Main Branch', employeeCount: 40, managerName: 'Yirga Worku', location: 'Piazza, Dessie' },
  { id: 'BR-DES-02', districtId: 'DIST-012', districtName: 'Dessie District', name: 'Dessie Arada Branch', code: 'DES-02', type: 'Grade I', employeeCount: 25, managerName: 'Habtamu Yimer', location: 'Arada, Dessie' },

  // Debre Markos District
  { id: 'BR-DBM-01', districtId: 'DIST-013', districtName: 'Debre Markos District', name: 'Debre Markos Main Branch', code: 'DBM-01', type: 'Main Branch', employeeCount: 36, managerName: 'Getachew Assefa', location: 'City Center, Debre Markos' },
  { id: 'BR-DBM-02', districtId: 'DIST-013', districtName: 'Debre Markos District', name: 'Debre Markos Teklehaimanot Branch', code: 'DBM-02', type: 'Grade I', employeeCount: 22, managerName: 'Birtukan Teshale', location: 'Teklehaimanot, Debre Markos' },

  // Nekemte District
  { id: 'BR-NKT-01', districtId: 'DIST-014', districtName: 'Nekemte District', name: 'Nekemte Main Branch', code: 'NKT-01', type: 'Main Branch', employeeCount: 38, managerName: 'Lammaa Gudina', location: 'Town Center, Nekemte' },
  { id: 'BR-NKT-02', districtId: 'DIST-014', districtName: 'Nekemte District', name: 'Nekemte Ketto Branch', code: 'NKT-02', type: 'Grade I', employeeCount: 22, managerName: 'Abebech Gudeta', location: 'Ketto Road, Nekemte' },

  // Hosanna District
  { id: 'BR-HSN-01', districtId: 'DIST-015', districtName: 'Hosanna District', name: 'Hosanna Main Branch', code: 'HSN-01', type: 'Main Branch', employeeCount: 32, managerName: 'Hailemariam Desalegn', location: 'Center, Hosanna' },
  { id: 'BR-HSN-02', districtId: 'DIST-015', districtName: 'Hosanna District', name: 'Hosanna Sech Duna Branch', code: 'HSN-02', type: 'Grade I', employeeCount: 20, managerName: 'Matewos Ersado', location: 'Sech Duna, Hosanna' },

  // Arba Minch District
  { id: 'BR-AMN-01', districtId: 'DIST-016', districtName: 'Arba Minch District', name: 'Arba Minch Main Branch', code: 'AMN-01', type: 'Main Branch', employeeCount: 36, managerName: 'Teshale Markos', location: 'Sikela, Arba Minch' },
  { id: 'BR-AMN-02', districtId: 'DIST-016', districtName: 'Arba Minch District', name: 'Arba Minch Secha Branch', code: 'AMN-02', type: 'Grade I', employeeCount: 22, managerName: 'Meselech Gibe', location: 'Secha, Arba Minch' },

  // Shashemene District
  { id: 'BR-SHM-01', districtId: 'DIST-017', districtName: 'Shashemene District', name: 'Shashemene Main Branch', code: 'SHM-01', type: 'Main Branch', employeeCount: 38, managerName: 'Bedria Oumer', location: 'City Center, Shashemene' },
  { id: 'BR-SHM-02', districtId: 'DIST-017', districtName: 'Shashemene District', name: 'Shashemene Abosto Branch', code: 'SHM-02', type: 'Grade I', employeeCount: 24, managerName: 'Tarekegn Biru', location: 'Abosto, Shashemene' },

  // Wolaita Sodo District
  { id: 'BR-WSD-01', districtId: 'DIST-018', districtName: 'Wolaita Sodo District', name: 'Wolaita Sodo Main Branch', code: 'WSD-01', type: 'Main Branch', employeeCount: 35, managerName: 'Abebech Bassa', location: 'Center, Wolaita Sodo' },
  { id: 'BR-WSD-02', districtId: 'DIST-018', districtName: 'Wolaita Sodo District', name: 'Wolaita Sodo Aroge Gebeya Branch', code: 'WSD-02', type: 'Grade I', employeeCount: 22, managerName: 'Takele Wolde', location: 'Aroge Gebeya, Wolaita Sodo' },

  // Harar District
  { id: 'BR-HRR-01', districtId: 'DIST-019', districtName: 'Harar District', name: 'Harar Jugol Branch', code: 'HRR-01', type: 'Main Branch', employeeCount: 30, managerName: 'Abdi Yusuf', location: 'Jugol Gate, Harar' },
  { id: 'BR-HRR-02', districtId: 'DIST-019', districtName: 'Harar District', name: 'Harar Duke Branch', code: 'HRR-02', type: 'Grade I', employeeCount: 20, managerName: 'Muna Rashid', location: 'Duke, Harar' },

  // Asosa District
  { id: 'BR-ASO-01', districtId: 'DIST-020', districtName: 'Asosa District', name: 'Asosa Main Branch', code: 'ASO-01', type: 'Main Branch', employeeCount: 28, managerName: 'Kifle Wolde', location: 'Town Center, Asosa' },

  // Gambela District
  { id: 'BR-GMB-01', districtId: 'DIST-021', districtName: 'Gambela District', name: 'Gambela Main Branch', code: 'GMB-01', type: 'Main Branch', employeeCount: 26, managerName: 'Othow Omot', location: 'City Center, Gambela' },
];

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
    districtId: 'DIST-001',
    districtName: 'Addis Ababa District',
    branchId: 'BR-AAD-01',
    branchName: 'Addis Ababa Main HQ Branch',
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
    districtId: 'DIST-001',
    districtName: 'Addis Ababa District',
    branchId: 'BR-AAD-01',
    branchName: 'Addis Ababa Main HQ Branch',
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
    districtId: 'DIST-001',
    districtName: 'Addis Ababa District',
    branchId: 'BR-AAD-01',
    branchName: 'Addis Ababa Main HQ Branch',
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
    districtId: 'DIST-001',
    districtName: 'Addis Ababa District',
    branchId: 'BR-AAD-01',
    branchName: 'Addis Ababa Main HQ Branch',
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
    districtId: 'DIST-001',
    districtName: 'Addis Ababa District',
    branchId: 'BR-AAD-01',
    branchName: 'Addis Ababa Main HQ Branch',
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
    districtId: 'DIST-001',
    districtName: 'Addis Ababa District',
    branchId: 'BR-AAD-01',
    branchName: 'Addis Ababa Main HQ Branch',
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
    districtId: 'DIST-001',
    districtName: 'Addis Ababa District',
    branchId: 'BR-AAD-01',
    branchName: 'Addis Ababa Main HQ Branch',
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
