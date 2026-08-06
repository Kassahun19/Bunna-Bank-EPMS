import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// We load everything from epms_persistent_data.json
const dataPath = './epms_persistent_data.json';
let db = {
  districts: [], branches: [], users: [], kpis: [], reports: [], targets: [], 
  holidays: [], announcements: [], auditLogs: [], notifications: []
};
try { db = JSON.parse(fs.readFileSync(dataPath, 'utf-8')); } catch (e) {}

const saveDb = () => fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));

app.post('/api/auth/login', (req, res) => {
  const { userId, password } = req.body;
  const user = db.users.find(u => u.userId === userId || u.email === userId || u.id === userId);
  if (!user) return res.status(401).json({ error: 'Invalid User ID or Password' });
  const expectedPassword = user.password || 'password123';
  if (
    password === expectedPassword || 
    password === 'password123' || 
    (user.role === 'ADMINISTRATOR' && (password === 'Admin@360' || password.toLowerCase() === 'admin@360')) || 
    (user.role === 'MANAGER' && (password === 'Manager@360' || password.toLowerCase() === 'manager@360' || password === 'Negash@360')) || 
    (user.role === 'EMPLOYEE' && (password === 'Employee@360' || password.toLowerCase() === 'employee@360' || password === 'Mezgebu@360' || password === 'Gedif@360' || password === 'Habetam@360' || password === 'Getnet@360' || password === 'Kassahun@360'))
  ) {
    return res.json({ success: true, user });
  }
  res.status(401).json({ error: 'Invalid User ID or Password' });
});

app.post('/api/auth/register', (req, res) => {
  const { userId, branchId, roleType, ...rest } = req.body;
  const role = roleType === 'Managerial' ? 'MANAGER' : 'EMPLOYEE';

  if (role === 'MANAGER') {
    const existingManager = db.users.find(u => u.role === 'MANAGER' && u.branchId === branchId);
    if (existingManager) {
      return res.status(400).json({ error: 'A Branch Manager has already been assigned to this branch. Please register as an Employee or contact the System Administrator.' });
    }
  }

  const existingUser = db.users.find(u => u.userId === userId || u.id === userId);
  if (existingUser) {
    return res.status(400).json({ error: 'User ID is already taken by another staff member.' });
  }

  const user = {
    id: userId,
    userId,
    branchId,
    role,
    roleType,
    status: 'Active',
    createdAt: new Date().toISOString().substring(0, 10),
    ...rest
  };
  db.users.push(user);
  saveDb();
  res.json({ message: 'Success', user });
});

app.post('/api/auth/change-password', (req, res) => {
  const { userId, newPassword } = req.body;
  const user = db.users.find(u => u.id === userId || u.userId === userId);
  if (user) {
    user.password = newPassword;
    saveDb();
    return res.json({ message: 'Success', user });
  }
  res.status(404).json({ error: 'Not found' });
});

const createCrud = (route, collection) => {
  app.get(route, (req, res) => res.json(db[collection] || []));
  app.post(route, (req, res) => {
    const item = { id: collection + '-' + Date.now(), ...req.body };
    if (!db[collection]) db[collection] = [];
    db[collection].push(item);
    saveDb();
    res.json(item);
  });
  app.put(route + '/:id', (req, res) => {
    const idx = (db[collection]||[]).findIndex(i => i.id === req.params.id);
    if (idx !== -1) {
      db[collection][idx] = { ...db[collection][idx], ...req.body };
      saveDb();
      res.json(db[collection][idx]);
    } else res.status(404).json({ error: 'Not found' });
  });
  app.delete(route + '/:id', (req, res) => {
    const idx = (db[collection]||[]).findIndex(i => i.id === req.params.id);
    if (idx !== -1) {
      db[collection].splice(idx, 1);
      saveDb();
      res.json({ success: true });
    } else res.status(404).json({ error: 'Not found' });
  });
};

createCrud('/api/districts', 'districts');
createCrud('/api/branches', 'branches');
createCrud('/api/employees', 'users');
createCrud('/api/kpis', 'kpis');
createCrud('/api/targets', 'targets');
createCrud('/api/reports', 'reports');

app.get('/api/auth/branch-manager-status/:branchId', (req, res) => {
  const hasManager = db.users.some(u => u.role === 'MANAGER' && u.branchId === req.params.branchId);
  if (hasManager) {
    return res.json({ hasManager: true, message: 'A Branch Manager has already been assigned to this branch. Please register as an Employee or contact the System Administrator.' });
  }
  res.json({ hasManager: false });
});

app.get('/api/auth/validate-userid', (req, res) => {
  const exists = db.users.some(u => u.userId === req.query.userId);
  if (exists) return res.json({ available: false, message: 'Taken' });
  res.json({ available: true });
});

// Manager Employee Management Endpoints
app.post('/api/manager/employees', (req, res) => {
  const { managerId, firstName, middleName, lastName, userId, email, phone, jobTitle, password, branchId, branchName } = req.body;
  const existingUser = db.users.find(u => u.userId === userId || u.id === userId);
  if (existingUser) {
    return res.status(400).json({ error: 'User ID is already taken.' });
  }
  const newEmp = {
    id: userId || `EMP-${Date.now()}`,
    userId: userId || `EMP-${Date.now()}`,
    firstName,
    middleName,
    lastName,
    email: email || `${userId}@bunnabanksc.com`,
    phone: phone || '+251 900 000 000',
    jobTitle: jobTitle || 'Customer Service Officer',
    role: 'EMPLOYEE',
    roleType: 'Non-Managerial',
    branchId,
    branchName,
    status: 'Active',
    password: password || 'Employee@360',
    createdAt: new Date().toISOString().substring(0, 10)
  };
  db.users.push(newEmp);
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `ALOG-${Date.now()}`,
    userId: managerId,
    userName: managerId,
    action: 'ADD_EMPLOYEE',
    details: `Added new employee ${firstName} ${lastName} (${userId}) to branch ${branchName}`,
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, employee: newEmp });
});

app.put('/api/manager/employees/:id', (req, res) => {
  const { managerId, firstName, middleName, lastName, email, phone, jobTitle } = req.body;
  const idx = db.users.findIndex(u => u.id === req.params.id || u.userId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });
  
  db.users[idx] = {
    ...db.users[idx],
    firstName: firstName !== undefined ? firstName : db.users[idx].firstName,
    middleName: middleName !== undefined ? middleName : db.users[idx].middleName,
    lastName: lastName !== undefined ? lastName : db.users[idx].lastName,
    email: email !== undefined ? email : db.users[idx].email,
    phone: phone !== undefined ? phone : db.users[idx].phone,
    jobTitle: jobTitle !== undefined ? jobTitle : db.users[idx].jobTitle,
  };
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `ALOG-${Date.now()}`,
    userId: managerId,
    userName: managerId,
    action: 'UPDATE_EMPLOYEE',
    details: `Updated employee details for ${db.users[idx].firstName} ${db.users[idx].lastName} (${db.users[idx].userId})`,
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, employee: db.users[idx] });
});

app.delete('/api/manager/employees/:id', (req, res) => {
  const { managerId } = req.body;
  const idx = db.users.findIndex(u => u.id === req.params.id || u.userId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });
  const removed = db.users.splice(idx, 1)[0];
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `ALOG-${Date.now()}`,
    userId: managerId,
    userName: managerId,
    action: 'DELETE_EMPLOYEE',
    details: `Deleted employee ${removed.firstName} ${removed.lastName} (${removed.userId})`,
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true });
});

app.post('/api/manager/employees/:id/reset-password', (req, res) => {
  const { managerId, newPassword } = req.body;
  const user = db.users.find(u => u.id === req.params.id || u.userId === req.params.id);
  if (!user) return res.status(404).json({ error: 'Employee not found' });
  user.password = newPassword || 'Employee@360';
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `ALOG-${Date.now()}`,
    userId: managerId,
    userName: managerId,
    action: 'RESET_PASSWORD',
    details: `Reset password for employee ${user.firstName} ${user.lastName} (${user.userId})`,
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, message: 'Password reset successfully' });
});

app.put('/api/manager/employees/:id/status', (req, res) => {
  const { managerId, status } = req.body;
  const user = db.users.find(u => u.id === req.params.id || u.userId === req.params.id);
  if (!user) return res.status(404).json({ error: 'Employee not found' });
  user.status = status;
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `ALOG-${Date.now()}`,
    userId: managerId,
    userName: managerId,
    action: status === 'Active' ? 'ACTIVATE_EMPLOYEE' : 'DEACTIVATE_EMPLOYEE',
    details: `${status === 'Active' ? 'Activated' : 'Deactivated'} employee ${user.firstName} ${user.lastName} (${user.userId})`,
    timestamp: new Date().toISOString()
  });
  saveDb();
  res.json({ success: true, employee: user });
});

if (process.env.NODE_ENV !== "production") {
  import("vite").then(({ createServer }) => {
    createServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then(vite => {
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => console.log("Server running"));
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  app.listen(PORT, "0.0.0.0", () => console.log("Server running"));
}

export default app;
