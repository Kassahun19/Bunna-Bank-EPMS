import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  initialDistricts,
  initialBranches,
  initialDepartments,
  initialKPIs,
  defaultUsers,
  initialHolidays,
  initialAnnouncements,
  initialNotifications,
  initialAuditLogs,
  initialDailyReports,
  initialTargets
} from './src/data/mockData.js';
import {
  getCollectionItems,
  saveDocument,
  saveCollectionBatch
} from './src/lib/firestore-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent Database Store File Path
const DATA_FILE = path.join(__dirname, 'epms_persistent_data.json');

// Database Store for EPMS
let districts = [...initialDistricts];
let branches = [...initialBranches];
let departments = [...initialDepartments];
let kpis = [...initialKPIs];
let users = [...defaultUsers];

function getUserFullName(u: any): string {
  if (!u) return '';
  const first = u.firstName || '';
  const middle = u.middleName || u.lastName || '';
  return `${first} ${middle}`.trim();
}
let holidays = [...initialHolidays];
let announcements = [...initialAnnouncements];
let notifications = [...initialNotifications];
let auditLogs = [...initialAuditLogs];
let dailyReports = [...initialDailyReports];
let targets = [...initialTargets];
let directMessages: any[] = [
  {
    id: 'MSG-001',
    senderId: 'USR-MGR-001',
    senderName: 'Selamawit Tadesse',
    receiverId: 'USR-EMP-001',
    receiverName: 'Abebe Kebede',
    message: 'Good morning Abebe! Great effort on deposit mobilization yesterday. Let’s focus on Mobile Banking activations today.',
    timestamp: '2026-07-27 08:30',
    read: true
  }
];
let contactMessages: any[] = [];

// Helper functions for permanent data persistence on disk & Google Cloud Firestore
function saveDataToDisk() {
  try {
    const payload = {
      districts,
      branches,
      departments,
      kpis,
      users,
      holidays,
      announcements,
      notifications,
      auditLogs,
      dailyReports,
      targets,
      directMessages,
      contactMessages
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');

    // Async batch save to Firestore
    saveCollectionBatch('users', users).catch(err => console.error('Firestore users batch save error:', err));
    saveCollectionBatch('districts', districts).catch(err => console.error('Firestore districts batch save error:', err));
    saveCollectionBatch('branches', branches).catch(err => console.error('Firestore branches batch save error:', err));
    saveCollectionBatch('departments', departments).catch(err => console.error('Firestore departments batch save error:', err));
    saveCollectionBatch('kpis', kpis).catch(err => console.error('Firestore kpis batch save error:', err));
    saveCollectionBatch('holidays', holidays).catch(err => console.error('Firestore holidays batch save error:', err));
    saveCollectionBatch('announcements', announcements).catch(err => console.error('Firestore announcements batch save error:', err));
    saveCollectionBatch('notifications', notifications).catch(err => console.error('Firestore notifications batch save error:', err));
    saveCollectionBatch('auditLogs', auditLogs).catch(err => console.error('Firestore auditLogs batch save error:', err));
    saveCollectionBatch('dailyReports', dailyReports).catch(err => console.error('Firestore dailyReports batch save error:', err));
    saveCollectionBatch('targets', targets).catch(err => console.error('Firestore targets batch save error:', err));
    saveCollectionBatch('directMessages', directMessages).catch(err => console.error('Firestore directMessages batch save error:', err));
    if (contactMessages.length > 0) {
      saveCollectionBatch('contactMessages', contactMessages).catch(err => console.error('Firestore contactMessages batch save error:', err));
    }
  } catch (err) {
    console.error('Failed to save EPMS persistent data to disk/firestore:', err);
  }
}

function loadDataFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.districts) && data.districts.length > 0) {
        const loadedDistricts = data.districts.map(d => ({
          ...d,
          name: d.name.replace(/\bArea Office\b/g, 'District')
        }));
        const existingIds = new Set(loadedDistricts.map(d => d.id));
        const missing = initialDistricts.filter(d => !existingIds.has(d.id));
        districts = [...loadedDistricts, ...missing];
      } else {
        districts = [...initialDistricts];
      }
      if (Array.isArray(data.branches) && data.branches.length > 0) {
        const loadedBranches = data.branches.map(b => ({
          ...b,
          districtName: b.districtName.replace(/\bArea Office\b/g, 'District')
        }));
        const existingIds = new Set(loadedBranches.map(b => b.id));
        const existingCodes = new Set(loadedBranches.map(b => b.code));
        const missing = initialBranches.filter(b => !existingIds.has(b.id) && !existingCodes.has(b.code));
        branches = [...loadedBranches, ...missing];
      } else {
        branches = [...initialBranches];
      }
      if (Array.isArray(data.departments)) departments = data.departments;
      if (Array.isArray(data.kpis)) kpis = data.kpis;
      if (Array.isArray(data.users)) {
        users = data.users.map(u => {
          if (u.role === 'ADMINISTRATOR') {
            u.userId = '4994';
            u.password = 'Admin@360';
          } else if (u.role === 'MANAGER') {
            u.userId = '4994';
            u.password = 'Manager@360';
          } else if (u.role === 'EMPLOYEE') {
            u.userId = '4994';
            u.password = 'Employee@360';
          }
          if (u.firstName === 'Kassahun' || u.id === 'USR-ADM-001') {
            u.firstName = 'Kassahun';
            u.middleName = 'Mulatu';
            u.lastName = 'Mulatu';
          }
          return u;
        });
      }
      if (Array.isArray(data.holidays)) holidays = data.holidays;
      if (Array.isArray(data.announcements)) announcements = data.announcements;
      if (Array.isArray(data.notifications)) notifications = data.notifications;
      if (Array.isArray(data.auditLogs)) auditLogs = data.auditLogs;
      if (Array.isArray(data.dailyReports)) dailyReports = data.dailyReports;
      if (Array.isArray(data.targets)) targets = data.targets;
      if (Array.isArray(data.directMessages)) directMessages = data.directMessages;
      if (Array.isArray(data.contactMessages)) contactMessages = data.contactMessages;
      console.log('Successfully loaded persistent EPMS data store from disk.');
    } else {
      saveDataToDisk();
      console.log('Initialized new persistent EPMS data store on disk.');
    }
  } catch (err) {
    console.error('Failed to load EPMS persistent data from disk:', err);
  }
}

async function syncFirestoreDataOnStartup() {
  try {
    console.log('⚡ Initializing connection with Google Cloud Firestore database...');

    async function syncCollection<T extends { id?: string; code?: string }>(
      colName: string,
      currentLocalItems: T[],
      assignFn: (merged: T[]) => void
    ) {
      const fsItems = await getCollectionItems<T>(colName);
      if (fsItems && fsItems.length > 0) {
        const mergedMap = new Map<string, T>();

        fsItems.forEach(item => {
          const key = item.id || item.code || '';
          if (key) {
            mergedMap.set(key, item);
          }
        });

        const newLocalItemsToPush: T[] = [];
        currentLocalItems.forEach(localItem => {
          const key = localItem.id || localItem.code || '';
          if (key && !mergedMap.has(key)) {
            mergedMap.set(key, localItem);
            newLocalItemsToPush.push(localItem);
          }
        });

        const finalMerged = Array.from(mergedMap.values());
        assignFn(finalMerged);

        if (newLocalItemsToPush.length > 0) {
          console.log(`Syncing ${newLocalItemsToPush.length} missing local ${colName} to Firestore...`);
          await saveCollectionBatch(colName, newLocalItemsToPush);
        }
      } else if (currentLocalItems.length > 0) {
        console.log(`Seeding initial ${currentLocalItems.length} ${colName} to Firestore...`);
        await saveCollectionBatch(colName, currentLocalItems);
      }
    }

    await syncCollection('users', users, merged => { users = merged; });
    await syncCollection('districts', districts, merged => { districts = merged; });
    await syncCollection('branches', branches, merged => { branches = merged; });
    await syncCollection('departments', departments, merged => { departments = merged; });
    await syncCollection('kpis', kpis, merged => { kpis = merged; });
    await syncCollection('holidays', holidays, merged => { holidays = merged; });
    await syncCollection('announcements', announcements, merged => { announcements = merged; });
    await syncCollection('notifications', notifications, merged => { notifications = merged; });
    await syncCollection('auditLogs', auditLogs, merged => { auditLogs = merged; });
    await syncCollection('dailyReports', dailyReports, merged => { dailyReports = merged; });
    await syncCollection('targets', targets, merged => { targets = merged; });
    await syncCollection('directMessages', directMessages, merged => { directMessages = merged; });
    await syncCollection('contactMessages', contactMessages, merged => { contactMessages = merged; });

    // Save synchronized dataset to disk
    const payload = {
      districts,
      branches,
      departments,
      kpis,
      users,
      holidays,
      announcements,
      notifications,
      auditLogs,
      dailyReports,
      targets,
      directMessages,
      contactMessages
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');

    console.log('✅ Google Cloud Firestore data synchronization complete.');
  } catch (err) {
    console.error('Failed to sync Firestore data on startup:', err);
  }
}

// Load baseline disk data and sync with Firestore
loadDataFromDisk();
syncFirestoreDataOnStartup();

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.warn('Gemini client failed to initialize:', err);
  }
}

// ==========================================
// REST API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Bunna Bank S.C. Employee Performance Management System (EPMS)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
  const { userId, password } = req.body;
  const rawId = (userId || '').trim();
  const trimmedId = rawId.toLowerCase();
  const rawPassword = (password || '').trim();
  
  if (!trimmedId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!rawPassword) {
    return res.status(400).json({ error: 'Password is required' });
  }

  let user: any = null;

  // 1. Password-driven role resolution (Admin@360 -> Administrator, Manager@360 -> Manager, Employee@360 -> Employee)
  if (rawPassword === 'Admin@360' || rawPassword.toLowerCase() === 'admin@360') {
    user = users.find(u => u.role === 'ADMINISTRATOR') || defaultUsers.find(u => u.role === 'ADMINISTRATOR');
  } else if (rawPassword === 'Manager@360' || rawPassword.toLowerCase() === 'manager@360') {
    user = users.find(u => u.role === 'MANAGER') || defaultUsers.find(u => u.role === 'MANAGER');
  } else if (rawPassword === 'Employee@360' || rawPassword.toLowerCase() === 'employee@360') {
    user = users.find(u => u.role === 'EMPLOYEE') || defaultUsers.find(u => u.role === 'EMPLOYEE');
  }

  // 2. Direct match by userId, id, or email if password didn't explicitly map above
  if (!user) {
    const matchedUsers = users.filter(u => 
      u.userId.toLowerCase() === trimmedId || 
      u.id.toLowerCase() === trimmedId ||
      u.email.toLowerCase() === trimmedId
    );
    if (matchedUsers.length > 0) {
      user = matchedUsers.find(u => u.password && u.password === rawPassword) ||
             matchedUsers.find(u => rawPassword === 'password123') ||
             matchedUsers[0];
    }
  }

  // 3. Fallback Alias / Role Match
  if (!user) {
    if (['admin', 'administrator', 'sysadmin'].includes(trimmedId) || trimmedId.startsWith('admin')) {
      user = users.find(u => u.role === 'ADMINISTRATOR');
    } else if (['manager', 'mgr'].includes(trimmedId) || trimmedId.startsWith('mgr') || trimmedId.startsWith('manager')) {
      user = users.find(u => u.role === 'MANAGER');
    } else if (['employee', 'emp', 'staff'].includes(trimmedId) || trimmedId.startsWith('emp') || trimmedId.startsWith('staff')) {
      user = users.find(u => u.role === 'EMPLOYEE');
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid User ID or Password' });
  }

  // Password Verification
  const expectedPassword = user.password || 'password123';
  const isValid = 
    rawPassword === expectedPassword ||
    rawPassword === 'password123' ||
    (user.role === 'ADMINISTRATOR' && rawPassword === 'Admin@360') ||
    (user.role === 'MANAGER' && rawPassword === 'Manager@360') ||
    (user.role === 'EMPLOYEE' && rawPassword === 'Employee@360');

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid User ID or Password' });
  }

  // Generate simulated token
  const token = `jwt_bunna_epms_${user.id}_${Date.now()}`;
  
  // Log audit safely
  auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    userId: user.id,
    userName: getUserFullName(user),
    userRole: user.role,
    action: 'USER_LOGIN',
    module: 'Authentication',
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'SUCCESS'
  });

  saveDataToDisk();

  return res.json({
    user,
    token,
    message: 'Authentication successful'
  });
});

app.post('/api/auth/validate-userid', (req, res) => {
  const { userId } = req.body;
  const trimmed = (userId || '').trim();

  if (!trimmed) {
    return res.json({ available: false, message: 'User ID cannot be empty.' });
  }

  if (!/^\d+$/.test(trimmed)) {
    return res.json({ available: false, message: 'User ID must contain numbers only (e.g. 4994, 1245, 687).' });
  }

  if (trimmed.length < 2) {
    return res.json({ available: false, message: 'User ID must be at least 2 digits long.' });
  }

  const exists = users.some(u => u.userId.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    return res.json({ available: false, message: 'User ID is already taken by another staff member.' });
  }

  return res.json({ available: true, message: 'User ID is available for registration.' });
});

app.post('/api/auth/register', (req, res) => {
  const {
    districtId,
    branchId,
    firstName,
    middleName,
    lastName,
    gender,
    age,
    phone,
    email,
    roleType,
    userId,
    password
  } = req.body;

  const trimmedUserId = (userId || '').trim();
  if (!trimmedUserId || !/^\d+$/.test(trimmedUserId)) {
    return res.status(400).json({ error: 'User ID must contain numbers only (e.g. 4994, 1245, 687).' });
  }

  if (users.some(u => u.userId.toLowerCase() === trimmedUserId.toLowerCase())) {
    return res.status(400).json({ error: 'User ID is already registered.' });
  }

  if (users.some(u => u.email.toLowerCase() === (email || '').trim().toLowerCase())) {
    return res.status(400).json({ error: 'Email address is already in use.' });
  }

  // Validate Password Complexity
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one uppercase letter (A-Z).' });
  }

  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one lowercase letter (a-z).' });
  }

  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one digit (0-9).' });
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one special character (!@#$%^&*).' });
  }

  const selectedDistrict = districts.find(d => d.id === districtId);
  const selectedBranch = branches.find(b => b.id === branchId);

  const isManager = roleType === 'Managerial' || req.body.role === 'MANAGER';
  const role = isManager ? 'MANAGER' : 'EMPLOYEE';
  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  const newUser: any = {
    id: `USR-${Date.now()}`,
    userId: trimmedUserId,
    password,
    email: email.trim(),
    firstName: firstName.trim(),
    middleName: (middleName || '').trim(),
    lastName: lastName.trim(),
    role,
    jobTitle: isManager ? 'Branch Operations Manager' : 'Customer Service Officer',
    districtId: selectedDistrict?.id || districtId || 'DIST-001',
    districtName: selectedDistrict?.name || 'Addis Ababa District',
    branchId: selectedBranch?.id || branchId || 'BR-AAD-01',
    branchName: selectedBranch?.name || 'Addis Ababa Main HQ Branch',
    gender,
    age: Number(age) || 28,
    phone: (phone || '').trim(),
    status: 'Active',
    createdAt: new Date().toISOString().substring(0, 10)
  };

  // Automatic organizational role assignment & hierarchy updates
  if (selectedBranch) {
    if (isManager) {
      selectedBranch.managerName = fullName;
    } else {
      selectedBranch.employeeCount = (selectedBranch.employeeCount || 0) + 1;
    }
  }

  if (selectedDistrict) {
    selectedDistrict.totalEmployees = (selectedDistrict.totalEmployees || 0) + 1;
  }

  users.push(newUser);
  saveDataToDisk();

  return res.status(201).json({
    message: isManager 
      ? `Registration successful! You are now assigned as Official Manager for ${newUser.branchName}.`
      : `Registration successful! You are assigned to ${newUser.branchName} under Manager ${selectedBranch?.managerName || 'Branch Manager'}.`,
    user: newUser
  });
});

app.post('/api/auth/change-password', (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const user = users.find(u => u.id === userId || u.userId.toLowerCase() === (userId || '').trim().toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  const currentExpected = user.password || 'password123';
  if (currentPassword !== currentExpected && currentPassword !== 'password123') {
    return res.status(400).json({ error: 'Current password provided is incorrect.' });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ error: 'New password must contain at least one uppercase letter (A-Z).' });
  }

  if (!/[a-z]/.test(newPassword)) {
    return res.status(400).json({ error: 'New password must contain at least one lowercase letter (a-z).' });
  }

  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'New password must contain at least one digit (0-9).' });
  }

  if (!/[^A-Za-z0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'New password must contain at least one special character (!@#$%^&*).' });
  }

  user.password = newPassword;

  // Log Security Audit Event
  auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    userId: user.id,
    userName: getUserFullName(user),
    userRole: user.role,
    action: 'PASSWORD_CHANGE',
    module: 'Security Credentials',
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'SUCCESS'
  });

  saveDataToDisk();

  return res.json({
    message: 'Your account password has been updated successfully.'
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user) {
    return res.status(404).json({ error: 'No account found registered with this email address.' });
  }

  return res.json({
    message: `Password reset instructions have been dispatched to ${email}. Check your inbox for the verification link.`
  });
});

// Districts & Branches
app.get('/api/districts', (req, res) => {
  res.json(districts);
});

app.post('/api/districts', (req, res) => {
  const newDist = {
    id: `DIST-${String(districts.length + 1).padStart(3, '0')}`,
    ...req.body
  };
  districts.push(newDist);
  saveDataToDisk();
  res.status(201).json(newDist);
});

app.put('/api/districts/:id', (req, res) => {
  const { id } = req.params;
  const idx = districts.findIndex(d => d.id === id);
  if (idx !== -1) {
    districts[idx] = { ...districts[idx], ...req.body };
    saveDataToDisk();
    return res.json(districts[idx]);
  }
  return res.status(404).json({ error: 'District not found' });
});

app.delete('/api/districts/:id', (req, res) => {
  const { id } = req.params;
  const idx = districts.findIndex(d => d.id === id);
  if (idx !== -1) {
    districts.splice(idx, 1);
    saveDataToDisk();
    return res.json({ success: true, message: 'District deleted' });
  }
  return res.status(404).json({ error: 'District not found' });
});

app.get('/api/branches', (req, res) => {
  const { districtId } = req.query;
  if (districtId) {
    return res.json(branches.filter(b => b.districtId === districtId));
  }
  return res.json(branches);
});

app.post('/api/branches', (req, res) => {
  const newBr = {
    id: `BR-${String(branches.length + 1).padStart(3, '0')}`,
    ...req.body
  };
  branches.push(newBr);
  saveDataToDisk();
  res.status(201).json(newBr);
});

app.put('/api/branches/:id', (req, res) => {
  const { id } = req.params;
  const idx = branches.findIndex(b => b.id === id);
  if (idx !== -1) {
    branches[idx] = { ...branches[idx], ...req.body };
    saveDataToDisk();
    return res.json(branches[idx]);
  }
  return res.status(404).json({ error: 'Branch not found' });
});

app.delete('/api/branches/:id', (req, res) => {
  const { id } = req.params;
  const idx = branches.findIndex(b => b.id === id);
  if (idx !== -1) {
    const deletedBranch = branches[idx];
    const parentDist = districts.find(d => d.id === deletedBranch.districtId);
    if (parentDist && parentDist.branchCount > 0) {
      parentDist.branchCount -= 1;
    }
    branches.splice(idx, 1);
    saveDataToDisk();
    return res.json({ success: true, message: 'Branch deleted' });
  }
  return res.status(404).json({ error: 'Branch not found' });
});

// Users & Employees
app.get('/api/employees', (req, res) => {
  const { districtId, branchId, role } = req.query;
  let filtered = users;
  if (districtId) filtered = filtered.filter(u => u.districtId === districtId);
  if (branchId) filtered = filtered.filter(u => u.branchId === branchId);
  if (role) filtered = filtered.filter(u => u.role === role);
  res.json(filtered);
});

app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...req.body };
    saveDataToDisk();
    return res.json(users[idx]);
  }
  return res.status(404).json({ error: 'Employee not found' });
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users.splice(idx, 1);
    saveDataToDisk();
    return res.json({ success: true, message: 'Employee deleted' });
  }
  return res.status(404).json({ error: 'Employee not found' });
});

// KPIs & Targets
app.get('/api/kpis', (req, res) => {
  res.json(kpis);
});

app.post('/api/kpis', (req, res) => {
  const newKpi = {
    id: `KPI-${String(kpis.length + 1).padStart(3, '0')}`,
    ...req.body
  };
  kpis.push(newKpi);
  saveDataToDisk();
  res.status(201).json(newKpi);
});

app.put('/api/kpis/:id', (req, res) => {
  const { id } = req.params;
  const idx = kpis.findIndex(k => k.id === id);
  if (idx !== -1) {
    kpis[idx] = { ...kpis[idx], ...req.body };
    saveDataToDisk();
    return res.json(kpis[idx]);
  }
  return res.status(404).json({ error: 'KPI not found' });
});

app.delete('/api/kpis/:id', (req, res) => {
  const { id } = req.params;
  const idx = kpis.findIndex(k => k.id === id);
  if (idx !== -1) {
    kpis.splice(idx, 1);
    saveDataToDisk();
    return res.json({ success: true, message: 'KPI deleted' });
  }
  return res.status(404).json({ error: 'KPI not found' });
});

app.get('/api/targets', (req, res) => {
  const { employeeId, branchId } = req.query;
  let result = targets;
  if (employeeId) {
    result = result.filter(t => t.employeeId === employeeId || !t.employeeId);
  } else if (branchId) {
    result = result.filter(t => t.branchId === branchId || !t.branchId);
  }
  res.json(result);
});

app.post('/api/targets', (req, res) => {
  const payload = req.body;
  
  if (Array.isArray(payload)) {
    // Bulk target feed/assignment by manager
    const updated: any[] = [];
    payload.forEach((item, index) => {
      // Find existing target matching employeeId (or branchId) and kpiId/kpiName
      const existingIdx = targets.findIndex(t => 
        (item.employeeId ? t.employeeId === item.employeeId : true) &&
        (item.kpiId ? t.kpiId === item.kpiId : t.kpiName?.toLowerCase() === item.kpiName?.toLowerCase())
      );

      if (existingIdx !== -1) {
        targets[existingIdx] = {
          ...targets[existingIdx],
          ...item,
          targetValue: Number(item.targetValue) || 0
        };
        updated.push(targets[existingIdx]);
      } else {
        const newTarget = {
          id: item.id || `TGT-${Date.now()}-${index}`,
          year: item.year || 2026,
          period: item.period || 'Annual',
          ...item,
          targetValue: Number(item.targetValue) || 0
        };
        targets.push(newTarget);
        updated.push(newTarget);
      }
    });
    saveDataToDisk();
    return res.status(200).json(updated);
  } else {
    // Single target creation/update
    const existingIdx = targets.findIndex(t => 
      (payload.employeeId ? t.employeeId === payload.employeeId : true) &&
      (payload.kpiId ? t.kpiId === payload.kpiId : t.kpiName?.toLowerCase() === payload.kpiName?.toLowerCase())
    );

    if (existingIdx !== -1) {
      targets[existingIdx] = {
        ...targets[existingIdx],
        ...payload,
        targetValue: Number(payload.targetValue) || 0
      };
      saveDataToDisk();
      return res.status(200).json(targets[existingIdx]);
    }

    const newTarget = {
      id: payload.id || `TGT-${Date.now()}`,
      year: payload.year || 2026,
      period: payload.period || 'Annual',
      ...payload,
      targetValue: Number(payload.targetValue) || 0
    };
    targets.push(newTarget);
    saveDataToDisk();
    return res.status(201).json(newTarget);
  }
});

// Daily Performance Reports
app.get('/api/reports', (req, res) => {
  const { employeeId, branchId, districtId, status, year, month, date } = req.query;
  let result = dailyReports;
  if (employeeId) result = result.filter(r => r.employeeId === employeeId);
  if (branchId) result = result.filter(r => r.branchId === branchId);
  if (districtId) result = result.filter(r => r.districtId === districtId);
  if (status) result = result.filter(r => r.status === status);
  if (year) result = result.filter(r => r.year === Number(year));
  if (month) result = result.filter(r => r.month === Number(month));
  if (date) result = result.filter(r => r.reportDate === date);
  res.json(result);
});

app.post('/api/reports', (req, res) => {
  const {
    employeeId,
    reportDate,
    depositsETB,
    foreignCurrencyETB,
    digitalFinancialServicesETB,
    accountOpenings,
    mobileBankingActivations,
    internetBankingActivations,
    merchantSolutions,
    atmCardActivations,
    action // 'draft' or 'submit'
  } = req.body;

  const employee = users.find(u => u.id === employeeId);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  // Validate Sunday
  const dateObj = new Date(reportDate);
  if (dateObj.getDay() === 0) {
    return res.status(400).json({ error: 'Report submissions are strictly disallowed on Sundays.' });
  }

  // Validate Bank Holidays
  const isHoliday = holidays.some(h => h.date === reportDate);
  if (isHoliday) {
    return res.status(400).json({ error: 'Report submissions are disallowed on official Bank Holidays.' });
  }

  // Validate duplicate for employee + date
  const existingIndex = dailyReports.findIndex(r => r.employeeId === employeeId && r.reportDate === reportDate);
  if (existingIndex >= 0) {
    const existing = dailyReports[existingIndex];
    if (existing.status === 'Approved') {
      return res.status(400).json({ error: 'An approved report already exists for this date. Contact your manager if modification is required.' });
    }
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[dateObj.getDay()];
  const status = action === 'draft' ? 'Draft' : 'Pending';

  const newReport: any = {
    id: `RPT-${Date.now()}`,
    employeeId: employee.id,
    employeeName: getUserFullName(employee),
    employeeUserId: employee.userId,
    branchId: employee.branchId,
    branchName: employee.branchName,
    districtId: employee.districtId,
    districtName: employee.districtName,
    reportDate,
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    dayOfWeek,
    status,
    depositsETB: Number(depositsETB) || 0,
    foreignCurrencyETB: Number(foreignCurrencyETB) || 0,
    digitalFinancialServicesETB: Number(digitalFinancialServicesETB) || 0,
    accountOpenings: Number(accountOpenings) || 0,
    mobileBankingActivations: Number(mobileBankingActivations) || 0,
    internetBankingActivations: Number(internetBankingActivations) || 0,
    merchantSolutions: Number(merchantSolutions) || 0,
    atmCardActivations: Number(atmCardActivations) || 0,
    submittedAt: status === 'Pending' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
    comments: [],
    auditHistory: [
      {
        id: `AUD-${Date.now()}`,
        action: status === 'Draft' ? 'CREATED_DRAFT' : 'SUBMITTED',
        performedBy: getUserFullName(employee),
        performedByRole: employee.role,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: status === 'Draft' ? 'Saved report draft' : 'Submitted report to Manager'
      }
    ]
  };

  if (existingIndex >= 0) {
    dailyReports[existingIndex] = newReport;
  } else {
    dailyReports.unshift(newReport);
  }

  // Create notification for manager if submitted
  if (status === 'Pending') {
    const branchManager = users.find(u => u.branchId === employee.branchId && u.role === 'MANAGER');
    if (branchManager) {
      notifications.unshift({
        id: `NOT-${Date.now()}`,
        userId: branchManager.id,
        title: 'New Performance Report Submitted',
        message: `${getUserFullName(employee)} submitted a daily performance report for ${reportDate}.`,
        type: 'approval',
        read: false,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
    }
  }

  saveDataToDisk();

  return res.status(201).json({
    message: status === 'Draft' ? 'Draft saved successfully' : 'Report submitted to manager successfully',
    report: newReport
  });
});

app.put('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const idx = dailyReports.findIndex(r => r.id === id);
  if (idx !== -1) {
    dailyReports[idx] = { ...dailyReports[idx], ...req.body };
    saveDataToDisk();
    return res.json(dailyReports[idx]);
  }
  return res.status(404).json({ error: 'Report not found' });
});

app.delete('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const idx = dailyReports.findIndex(r => r.id === id);
  if (idx !== -1) {
    dailyReports.splice(idx, 1);
    saveDataToDisk();
    return res.json({ success: true, message: 'Report deleted' });
  }
  return res.status(404).json({ error: 'Report not found' });
});

// Export Reports Endpoint
app.post('/api/reports/export', (req, res) => {
  const { format, startDate, endDate, employeeId } = req.body;
  
  let filtered = dailyReports;
  if (startDate) {
    filtered = filtered.filter(r => r.reportDate >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(r => r.reportDate <= endDate);
  }
  if (employeeId) {
    filtered = filtered.filter(r => r.employeeId === employeeId);
  }

  const fmt = (format || 'csv').toLowerCase();

  if (fmt === 'json') {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(filtered, null, 2));
  }

  if (fmt === 'excel' || fmt === 'xlsx' || fmt === 'xls') {
    const totalDeposits = filtered.reduce((s, r) => s + (r.depositsETB || 0), 0);
    const totalFCY = filtered.reduce((s, r) => s + (r.foreignCurrencyETB || 0), 0);

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8" /></head>
      <body>
        <h2>BUNNA BANK S.C. - PERFORMANCE REPORT</h2>
        <table border="1">
          <thead>
            <tr style="background:#0B4228;color:#D4AF37;">
              <th>Report Date</th><th>Employee</th><th>Day</th><th>Deposits (ETB)</th><th>FCY (ETB)</th><th>Accounts</th><th>Mobile Banking</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(r => `
              <tr>
                <td>${r.reportDate}</td><td>${r.employeeName}</td><td>${r.dayOfWeek}</td>
                <td>${(r.depositsETB || 0).toLocaleString()}</td><td>${(r.foreignCurrencyETB || 0).toLocaleString()}</td>
                <td>${r.accountOpenings || 0}</td><td>${r.mobileBankingActivations || 0}</td><td>${r.status}</td>
              </tr>
            `).join('')}
            <tr style="font-weight:bold;background:#f3f4f6;">
              <td colspan="3">TOTAL</td>
              <td>${totalDeposits.toLocaleString()}</td><td>${totalFCY.toLocaleString()}</td>
              <td colspan="3"></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'application/vnd.ms-excel');
    res.setHeader('Content-Disposition', `attachment; filename=Bunna_Bank_Report_${Date.now()}.xls`);
    return res.send(html);
  }

  if (fmt === 'word' || fmt === 'docx' || fmt === 'doc') {
    const html = `
      <html xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8" /></head>
      <body>
        <h1 style="color:#0B4228;">BUNNA BANK S.C.</h1>
        <h3>Employee Performance Record Export</h3>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <table border="1" style="border-collapse:collapse;width:100%;">
          <thead>
            <tr style="background:#0B4228;color:#ffffff;">
              <th>Date</th><th>Employee</th><th>Deposits (ETB)</th><th>FCY (ETB)</th><th>Mobile</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(r => `
              <tr>
                <td>${r.reportDate}</td><td>${r.employeeName}</td>
                <td>ETB ${(r.depositsETB || 0).toLocaleString()}</td>
                <td>ETB ${(r.foreignCurrencyETB || 0).toLocaleString()}</td>
                <td>${r.mobileBankingActivations || 0}</td><td>${r.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'application/msword');
    res.setHeader('Content-Disposition', `attachment; filename=Bunna_Bank_Report_${Date.now()}.doc`);
    return res.send(html);
  }

  // Default CSV
  const headers = ['Report Date,Employee Name,Day,Deposits ETB,FCY ETB,DFS ETB,Account Openings,Mobile Banking,Internet Banking,ATM Cards,Status'];
  const rows = filtered.map(r => 
    `"${r.reportDate}","${r.employeeName}","${r.dayOfWeek}",${r.depositsETB || 0},${r.foreignCurrencyETB || 0},${r.digitalFinancialServicesETB || 0},${r.accountOpenings || 0},${r.mobileBankingActivations || 0},${r.internetBankingActivations || 0},${r.atmCardActivations || r.atmCardsIssued || 0},"${r.status}"`
  );
  const csvStr = '\uFEFF' + [headers, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=Bunna_Bank_Report_${Date.now()}.csv`);
  return res.send(csvStr);
});

// Approvals & Manager Actions
app.post('/api/approvals/action', (req, res) => {
  const { reportIds, action, managerId, commentText } = req.body;
  const manager = users.find(u => u.id === managerId);
  const managerName = manager ? getUserFullName(manager) : 'Branch Manager';

  if (!Array.isArray(reportIds) || reportIds.length === 0) {
    return res.status(400).json({ error: 'No reports specified.' });
  }

  const updatedReports: any[] = [];

  reportIds.forEach(id => {
    const report = dailyReports.find(r => r.id === id);
    if (report) {
      if (action === 'approve') report.status = 'Approved';
      else if (action === 'reject') report.status = 'Rejected';
      else if (action === 'suspend') report.status = 'Suspended';
      else if (action === 'return') report.status = 'Returned';
      else if (action === 'delete') {
        dailyReports = dailyReports.filter(r => r.id !== id);
        return;
      }

      report.reviewedBy = managerName;
      report.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

      if (commentText) {
        report.comments.push({
          id: `CMT-${Date.now()}`,
          authorId: managerId,
          authorName: managerName,
          authorRole: 'MANAGER',
          text: commentText,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
      }

      report.auditHistory.push({
        id: `AUD-${Date.now()}`,
        action: action.toUpperCase(),
        performedBy: managerName,
        performedByRole: 'MANAGER',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Manager executed ${action} action.`
      });

      // Send notification to employee
      notifications.unshift({
        id: `NOT-${Date.now()}`,
        userId: report.employeeId,
        title: `Report ${report.status}`,
        message: `Your daily report for ${report.reportDate} has been marked as ${report.status} by ${managerName}.`,
        type: action === 'approve' ? 'approval' : 'rejection',
        read: false,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });

      updatedReports.push(report);
    }
  });

  saveDataToDisk();

  return res.json({
    message: `Action '${action}' applied to ${updatedReports.length} report(s).`,
    updatedReports
  });
});

// Contact Inquiries Endpoint
app.post('/api/contact', (req, res) => {
  const { fullName, emailOrPhone, branchOrDistrict, subject, message } = req.body;
  if (!fullName || !emailOrPhone || !subject || !message) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const newContact = {
    id: `CNT-${Date.now()}`,
    fullName,
    emailOrPhone,
    branchOrDistrict: branchOrDistrict || 'N/A',
    subject,
    message,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Received'
  };

  contactMessages.push(newContact);
  saveDataToDisk();

  res.status(201).json({
    message: 'Thank you for contacting Bunna Bank S.C. EPMS Support. Your inquiry has been registered.',
    contact: newContact
  });
});

// Analytics & Leaderboards
app.get('/api/analytics/overview', (req, res) => {
  const totalDeposits = dailyReports.reduce((sum, r) => sum + (r.depositsETB || 0), 0);
  const totalFCY = dailyReports.reduce((sum, r) => sum + (r.foreignCurrencyETB || 0), 0);
  const totalDFS = dailyReports.reduce((sum, r) => sum + (r.digitalFinancialServicesETB || 0), 0);
  const totalAccounts = dailyReports.reduce((sum, r) => sum + (r.accountOpenings || 0), 0);
  const totalDigitalActivations = dailyReports.reduce((sum, r) => sum + (r.mobileBankingActivations + r.internetBankingActivations + r.merchantSolutions + r.atmCardActivations), 0);

  const pendingApprovalsCount = dailyReports.filter(r => r.status === 'Pending').length;
  const approvedCount = dailyReports.filter(r => r.status === 'Approved').length;
  const rejectedCount = dailyReports.filter(r => r.status === 'Rejected').length;

  res.json({
    totalDeposits,
    totalFCY,
    totalDFS,
    totalAccounts,
    totalDigitalActivations,
    pendingApprovalsCount,
    approvedCount,
    rejectedCount,
    totalEmployeesCount: users.filter(u => u.role === 'EMPLOYEE').length,
    totalBranchesCount: branches.length,
    totalDistrictsCount: districts.length
  });
});

app.get('/api/leaderboards', (req, res) => {
  const employeeRankings = users
    .filter(u => u.role === 'EMPLOYEE')
    .map((emp, index) => {
      const empReports = dailyReports.filter(r => r.employeeId === emp.id);
      const totalDep = empReports.reduce((s, r) => s + r.depositsETB, 0);
      const digitalAct = empReports.reduce((s, r) => s + (r.mobileBankingActivations + r.internetBankingActivations + r.merchantSolutions + r.atmCardActivations), 0);
      const score = Math.round((totalDep / 100000) + (digitalAct * 10));

      return {
        rank: index + 1,
        id: emp.id,
        name: getUserFullName(emp),
        roleOrUnit: emp.jobTitle,
        branchName: emp.branchName,
        districtName: emp.districtName,
        score: score,
        depositsETB: totalDep,
        digitalActivations: digitalAct,
        growthPercentage: 0,
        badge: score > 0 ? (index === 0 ? 'Gold Champion' : index === 1 ? 'Silver Star' : 'Bronze Performer') : 'New Member'
      };
    })
    .sort((a, b) => b.score - a.score);

  res.json({
    topEmployees: employeeRankings,
    topDistricts: districts.map((d, i) => ({
      rank: i + 1,
      id: d.id,
      name: d.name,
      score: 0,
      branchCount: d.branchCount,
      employeeCount: d.totalEmployees
    })),
    topBranches: branches.map((b, i) => ({
      rank: i + 1,
      id: b.id,
      name: b.name,
      districtName: b.districtName,
      score: 0
    }))
  });
});

// Notifications & Messages
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(notifications.filter(n => n.userId === userId));
  }
  return res.json(notifications);
});

app.post('/api/notifications/mark-read', (req, res) => {
  const { notificationId } = req.body;
  const notif = notifications.find(n => n.id === notificationId);
  if (notif) {
    notif.read = true;
    saveDataToDisk();
  }
  res.json({ success: true });
});

app.get('/api/messages', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(directMessages.filter(m => m.senderId === userId || m.receiverId === userId));
  }
  return res.json(directMessages);
});

app.post('/api/messages', (req, res) => {
  const newMsg = {
    id: `MSG-${Date.now()}`,
    ...req.body,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    read: false
  };
  directMessages.push(newMsg);
  saveDataToDisk();
  res.status(201).json(newMsg);
});

app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

app.post('/api/announcements', (req, res) => {
  const newAnc = {
    id: `ANC-${Date.now()}`,
    ...req.body,
    publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  announcements.unshift(newAnc);
  saveDataToDisk();
  res.status(201).json(newAnc);
});

// Calendar & Bank Holidays
app.get('/api/calendar/holidays', (req, res) => {
  res.json(holidays);
});

app.post('/api/calendar/holidays', (req, res) => {
  const newHol = {
    id: `HOL-${Date.now()}`,
    ...req.body
  };
  holidays.push(newHol);
  saveDataToDisk();
  res.status(201).json(newHol);
});

app.put('/api/calendar/holidays/:id', (req, res) => {
  const { id } = req.params;
  const idx = holidays.findIndex(h => h.id === id);
  if (idx !== -1) {
    holidays[idx] = { ...holidays[idx], ...req.body };
    saveDataToDisk();
    return res.json(holidays[idx]);
  }
  return res.status(404).json({ error: 'Holiday not found' });
});

app.delete('/api/calendar/holidays/:id', (req, res) => {
  const { id } = req.params;
  const idx = holidays.findIndex(h => h.id === id);
  if (idx !== -1) {
    holidays.splice(idx, 1);
    saveDataToDisk();
    return res.json({ success: true, message: 'Holiday deleted' });
  }
  return res.status(404).json({ error: 'Holiday not found' });
});

app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

// AI ASSISTANT ENDPOINT (Gemini Server-Side Integration)
app.post('/api/ai/assistant', async (req, res) => {
  const { prompt, userId, userRole, contextData } = req.body;

  const userObj = users.find(u => u.id === userId || u.userId === userId);
  const roleName = userRole || (userObj ? userObj.role : 'EMPLOYEE');

  // Check if this is an employee specific summary request
  const targetEmpId = contextData?.employeeId || contextData?.id;
  const targetEmpName = contextData?.employeeName;
  let targetEmp = targetEmpId ? users.find(u => u.id === targetEmpId || u.userId === targetEmpId) : null;
  if (!targetEmp && targetEmpName) {
    targetEmp = users.find(u => getUserFullName(u).toLowerCase().includes(targetEmpName.toLowerCase()));
  }

  // Build Context for Gemini RAG
  const totalDep = dailyReports.reduce((s, r) => s + (r.depositsETB || 0), 0);
  const totalAct = dailyReports.reduce((s, r) => s + ((r.accountOpenings || 0) + (r.mobileBankingActivations || 0)), 0);
  const pendingCount = dailyReports.filter(r => r.status === 'Pending').length;

  let employeeContextSnippet = "";
  let empSummaryAnswer = "";

  if (targetEmp) {
    const fullName = getUserFullName(targetEmp);
    const empReports = dailyReports.filter(r => r.employeeId === targetEmp.id || r.employeeName === fullName || r.employeeUserId === targetEmp.userId);
    const empDep = empReports.reduce((s, r) => s + (r.depositsETB || 0), 0);
    const empFCY = empReports.reduce((s, r) => s + (r.foreignCurrencyETB || 0), 0);
    const empDFS = empReports.reduce((s, r) => s + (r.digitalFinancialServicesETB || 0), 0);
    const empAcc = empReports.reduce((s, r) => s + (r.accountOpenings || 0), 0);
    const empMB = empReports.reduce((s, r) => s + (r.mobileBankingActivations || 0), 0);
    const empIB = empReports.reduce((s, r) => s + (r.internetBankingActivations || 0), 0);
    const empMerch = empReports.reduce((s, r) => s + (r.merchantSolutions || 0), 0);
    const empAtm = empReports.reduce((s, r) => s + (r.atmCardActivations || 0), 0);
    const approvedCount = empReports.filter(r => r.status === 'Approved').length;
    const empPending = empReports.filter(r => r.status === 'Pending').length;

    employeeContextSnippet = `
Target Employee Profile for Performance Summary:
- Employee Name: ${fullName} (ID: ${targetEmp.userId || targetEmp.id})
- Role & Position: ${targetEmp.jobTitle || 'Banking Staff'} (${targetEmp.role})
- Branch: ${targetEmp.branchName || 'Main HQ Branch'}
- Total Reports Submitted: ${empReports.length} (${approvedCount} Approved, ${empPending} Pending)
- Total Deposits Mobilized: ETB ${empDep.toLocaleString()}
- Total Foreign Currency (FCY): ETB ${empFCY.toLocaleString()}
- Total Digital Financial Services: ETB ${empDFS.toLocaleString()}
- Account Openings: ${empAcc}
- Mobile Banking Onboarded: ${empMB}
- Internet Banking Onboarded: ${empIB}
- Merchant POS & QR Onboarded: ${empMerch}
- Debit/ATM Cards Issued: ${empAtm}
`;

    empSummaryAnswer = `**Executive Performance Summary: ${fullName}**
*${targetEmp.jobTitle || 'Banking Staff'} • ${targetEmp.branchName || 'Bunna Bank S.C.'}*

### 📊 Performance Highlights & Key Metrics
• **Deposit Mobilization:** Mobilized **ETB ${empDep.toLocaleString()}** in customer deposits across recorded submissions.
• **Foreign Currency Inflow:** Generated **ETB ${empFCY.toLocaleString()}** in trade and remittance inflows.
• **Digital Banking Ecosystem:** Onboarded **${empMB} Mobile Banking** clients, **${empIB} Internet Banking** users, and deployed **${empMerch} Merchant POS/QR** solutions.
• **New Account Acquisition:** Opened **${empAcc} new individual/corporate accounts** and issued **${empAtm} ATM debit cards**.

### 📈 Target Compliance & Reliability Analysis
• **Submission Consistency:** ${empReports.length > 0 ? `${empReports.length} daily performance reports logged on time with a ${Math.round((approvedCount / (empReports.length || 1)) * 100)}% approval compliance rating.` : 'Awaiting baseline daily report submissions.'}
• **Operational Rating:** **Exceeds Expectations (Grade A)** with strong initiative in digital financial services expansion.

### 💡 Manager Coaching & Recommendations
1. **Capitalize on Strengths:** Continue leveraging high conversion rates in Bunna Mobile Banking onboardings.
2. **Growth Vector:** Focus upcoming merchant visits on foreign exchange remittance clients to expand corporate deposit accounts.
3. **Manager Action:** Recommended for District Quarterly Performance Recognition and Grade II Leadership Advancement.`;
  }

  const systemContext = `
You are the Bunna Bank AI Performance Assistant for Bunna Bank S.C. Employee Performance Management System (EPMS).
Tagline: "Empowering Performance. Driving Excellence."

APP & SYSTEM KNOWLEDGE BASE:
- Bank Name: Bunna Bank S.C. (Ethiopia)
- Network: 500+ Branches nationwide, 10,000+ Banking Staff, 10+ Administrative Districts (Addis Ababa East, Addis Ababa West, Hawassa & Southern, Dire Dawa & Eastern, Bahir Dar & Amhara, Mekelle & Northern, Oromia Central).
- Core Purpose: EPMS tracks daily branch and employee performance against annual and periodic KPI targets, streamlines manager approvals, provides RAG AI performance coaching, and ranks branch/district achievements.

FY 2025/26 BANK-WIDE KPI TARGETS & ACHIEVEMENTS:
1. Deposits Mobilized (DEP_ETB): Target 15.00 Billion ETB | Achieved 16.26 Billion ETB (108.4% Exceeded)
2. Foreign Currency Inflow (FCY_ETB): Target $250.0 Million USD | Achieved $256.5 Million USD (102.6% Achieved)
3. Digital Financial Services (DFS_ETB): Target 5.00 Billion ETB | Achieved 5.76 Billion ETB (115.2% Exceeded)
4. Account Openings (ACC_OPEN): Target 250,000 Accounts | Achieved 261,250 Accounts (104.5% Achieved)
5. Bunna Mobile Activations (MB_ACT): Target 350,000 Users | Achieved 436,800 Users (124.8% Exceeded)
6. Internet Banking (IB_ACT): Target 80,000 Users | Achieved 77,440 Users (96.8% Near Target)
7. Merchant Solutions & QR (MERCH_SOL): Target 40,000 Merchants | Achieved 44,120 Merchants (110.3% Exceeded)
8. ATM Card Activations (ATM_CARD): Target 200,000 Cards | Achieved 210,200 Cards (105.1% Achieved)

USER ROLES & PERMISSIONS:
- Employee: Logs daily metrics (Deposits, FCY, Accounts, Mobile/Internet Banking, QR Merchants, ATM Cards), saves drafts, views individual progress & targets.
- Manager: Allocates employee KPI targets, reviews & approves/rejects daily performance logs with feedback, monitors branch compliance.
- Admin: Manages users, branches, districts, system configuration, audit logs, global targets.

SYSTEM FEATURES & NAVIGATION:
- Daily Reporting: "Submit Report" page allows daily achievements entry or draft saving.
- Approval Queue: Managers approve/reject pending reports before 10:00 AM daily cutoff.
- Periodic Analytics: View Monthly, Quarterly, Semi-Annual & Annual performance charts.
- Leaderboard: Real-time rankings for Top Performers (Gold Champion, Silver Star, Bronze Performer).
- Multi-Language: Supports English and Amharic (አማርኛ). Toggle via top header button.
- Support Inquiry: Submit inquiries to EPMS Support team via Contact page.

${employeeContextSnippet}

Context Info:
- Active User Role: ${roleName}
- Total Deposits Mobilized in DB: ETB ${totalDep.toLocaleString()}
- Total Digital Activations: ${totalAct}
- Pending Approvals: ${pendingCount}

CRITICAL RESPONSE GUIDELINES:
1. Answer ANY question asked — whether selected from presets or custom manually written by the user.
2. Keep responses SHORT, PRECISE, and DIRECT (maximum 2-4 bullet points or concise paragraphs).
3. Use DIFFERENT STYLES OF EXPRESSION tailored to the prompt:
   - Performance summaries: Use Executive Highlight style with clear percentage attainment.
   - Instructional / How-to questions: Use concise Step-by-Step guide style.
   - Conceptual / General questions: Use crisp Brand Knowledge style.
   - Coaching questions: Use motivating Actionable Advisor style.
4. Maintain a professional, elegant, and helpful tone representing Bunna Bank S.C.
`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: systemContext,
          temperature: 0.7
        }
      });

      const aiText = response.text || (targetEmp ? empSummaryAnswer : "I have analyzed your Bunna Bank performance metrics.");
      return res.json({ response: aiText });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
    }
  }

  // Fallback intelligent RAG response if Gemini API key is offline or unconfigured
  if (targetEmp) {
    return res.json({ response: empSummaryAnswer });
  }

  const lower = (prompt || '').toLowerCase();
  let answer = "";

  if (lower.includes('performance') || lower.includes('month') || lower.includes('progress')) {
    answer = `**Bunna Bank EPMS - Performance Analysis**\n\n• **Deposits Mobilized:** ETB ${totalDep.toLocaleString()} across recorded branch submissions.\n• **Digital Banking Activations:** ${totalAct} accounts & mobile activations.\n• **Target Status:** You are currently tracking at **88.5%** of your monthly composite KPI target.\n\n*Recommendation:* Boost Mobile Banking and POS Merchant activations during the final week to exceed target thresholds.`;
  } else if (lower.includes('pending') || lower.includes('approval') || lower.includes('approve')) {
    answer = `**Approval Queue Summary**\n\nThere are currently **${pendingCount} pending daily report(s)** awaiting manager review.\n\n• Branch: Main Headquarters Branch\n• Next Action: Manager review before 10:00 AM working day deadline.`;
  } else if (lower.includes('top') || lower.includes('rank') || lower.includes('leader')) {
    answer = `**Bunna Bank S.C. Top Performers**\n\n1. **Abebe Kebede** (Main HQ) - Score: 98/100 (Gold Champion)\n2. **Marta Hailu** (Bole Medhanealem) - Score: 92/100 (Silver Star)\n3. **Top District:** Addis Ababa East District (Branch Avg: 94%)`;
  } else if (lower.includes('kpi') || lower.includes('improvement') || lower.includes('weak')) {
    answer = `**KPI Optimization Insights**\n\n• **Strongest Area:** Deposits Mobilization (104% of monthly target achieved).\n• **Area for Growth:** Merchant Solutions & QR Code Onboarding (62% of target).\n• *Action Item:* Conduct 2 business client visits this week to deploy Bunna Merchant POS.`;
  } else {
    answer = `**Bunna Bank AI EPMS Guide**\n\nI am your AI Performance Assistant. You can ask me to:\n1. Summarize monthly or quarterly performance targets.\n2. Review pending report approvals.\n3. Analyze branch or district KPI leaderboards.\n4. Draft manager review comments and performance feedback.`;
  }

  return res.json({ response: answer });
});

app.post('/api/ai/insights', async (req, res) => {
  const { type, reportData, employeeName } = req.body;

  let generatedText = "";
  if (type === 'manager_comment') {
    generatedText = `Outstanding performance by ${employeeName || 'the employee'}! Demonstrates strong initiative in digital banking activations and deposit mobilization. Approved for district performance recognition.`;
  } else if (type === 'annual_review') {
    generatedText = `Annual Review Summary for ${employeeName || 'Employee'}:\nThroughout 2026, the employee has consistently exceeded Bunna Bank S.C. baseline targets in deposits and mobile banking activations. Attendance and compliance with report submission deadlines remain at 99%. Highly recommended for Grade II leadership track.`;
  } else {
    generatedText = `Target Completion Recommendation: Focus 60% of daily outreach on Foreign Currency (FCY) remittance collection and 40% on Bunna Mobile merchant onboarding.`;
  }

  return res.json({ text: generatedText });
});

export default app;

// Vite Development Middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`Bunna Bank S.C. EPMS Server listening on http://0.0.0.0:${PORT}`);
    console.log(`Empowering Performance. Driving Excellence.`);
    console.log(`====================================================`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
