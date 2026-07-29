import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'kopargaon_smart_city_jwt_secret_key_2026';

app.use(cors());
app.use(express.json());

// In-Memory Enterprise Storage (MongoDB ready schemas)
let complaintsDB = [
  {
    id: 'KPG-2026-1042',
    citizenId: 'CIT-8821',
    submittedBy: 'Ramesh Patil',
    citizenEmail: 'ramesh.p@kopargaon.gov.in',
    category: 'Sanitation',
    title: 'Severe Garbage Overflow & Drain Blockage',
    description: 'Waste heap overflowing near Shivaji Chowk market area blocking main drainage line causing foul odor and health hazard.',
    address: 'Shivaji Chowk Market, Ward 4',
    ward: 4,
    latitude: 19.8855,
    longitude: 74.4821,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    status: 'Pending',
    priority: 'High',
    department: 'Sanitation & Solid Waste Management',
    assignedOfficer: null,
    submittedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    workStartedAt: null,
    completedAt: null,
    isEscalated: false,
    remarks: [],
    supportingDocuments: [],
    completionReport: null,
    timeline: [
      {
        id: 'EVT-1001',
        status: 'Pending',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        actor: { name: 'Ramesh Patil', role: 'Citizen', department: 'Resident' },
        action: 'Complaint Registered',
        note: 'Submitted complaint with geolocation and site photo.'
      }
    ]
  },
  {
    id: 'KPG-2026-1039',
    citizenId: 'CIT-7712',
    submittedBy: 'Priya Sharma',
    citizenEmail: 'priya.s@kopargaon.gov.in',
    category: 'Water Supply',
    title: 'Main Pipeline Burst & Low Pressure',
    description: 'Underground pipeline leakage near Ward 2 high school causing flooding on road and zero water pressure.',
    address: 'Near Mahatma Gandhi School, Ward 2',
    ward: 2,
    latitude: 19.8912,
    longitude: 74.4789,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    priority: 'Emergency',
    department: 'Water Supply & Sewerage Department',
    assignedOfficer: 'Er. Suresh Deshmukh',
    submittedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    workStartedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    completedAt: null,
    isEscalated: false,
    remarks: ['Repair squad deployed with heavy excavation machinery.'],
    supportingDocuments: [],
    completionReport: null,
    timeline: [
      {
        id: 'EVT-1002',
        status: 'Pending',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        actor: { name: 'Priya Sharma', role: 'Citizen', department: 'Resident' },
        action: 'Complaint Registered',
        note: 'Submitted pipeline leak issue.'
      },
      {
        id: 'EVT-1003',
        status: 'In Progress',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        actor: { name: 'Er. Suresh Deshmukh', role: 'Municipal Officer', department: 'Water Supply' },
        action: 'Work Started',
        note: 'Assigned to emergency repair squad. Work in progress.'
      }
    ]
  },
  {
    id: 'KPG-2026-0988',
    citizenId: 'CIT-4410',
    submittedBy: 'Anil Kulkarni',
    citizenEmail: 'anil.k@kopargaon.gov.in',
    category: 'Public Works (PWD)',
    title: 'Hazardous Pothole on Station Road',
    description: 'Deep road cave-in and pothole causing severe traffic disruption and accidents.',
    address: 'Station Road Near Flyover, Ward 6',
    ward: 6,
    latitude: 19.8790,
    longitude: 74.4910,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'Escalated',
    priority: 'High',
    department: 'Public Works (PWD)',
    assignedOfficer: 'Rajesh Shinde',
    submittedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(), // > 3 days (Overdue)
    dueDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    workStartedAt: null,
    completedAt: null,
    isEscalated: true,
    remarks: ['SLA breached (3 days exceeded). Auto-escalated to Municipal Commissioner.'],
    supportingDocuments: [],
    completionReport: null,
    timeline: [
      {
        id: 'EVT-1004',
        status: 'Pending',
        timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
        actor: { name: 'Anil Kulkarni', role: 'Citizen', department: 'Resident' },
        action: 'Complaint Registered',
        note: 'Submitted pothole ticket.'
      },
      {
        id: 'EVT-1005',
        status: 'Escalated',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        actor: { name: 'SYSTEM_SLA_ENGINE', role: 'System Daemon', department: 'Governance Engine' },
        action: 'SLA Auto-Escalation',
        note: 'Complaint unresolved past 3 working days SLA limit. Escalated to Higher Authority.'
      }
    ]
  }
];

let notificationsDB = [
  {
    id: 'NOTIF-101',
    recipientRole: 'officer',
    recipientId: 'KMC-OFFICER-001',
    title: 'New High Priority Complaint',
    description: 'Complaint KPG-2026-1042 registered in Sanitation Department (Ward 4).',
    complaintId: 'KPG-2026-1042',
    priority: 'High',
    department: 'Sanitation & Solid Waste Management',
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    read: false,
    actionLink: '/municipality/dashboard'
  },
  {
    id: 'NOTIF-102',
    recipientRole: 'higher_authority',
    recipientId: 'HA-COMMISSIONER-01',
    title: 'SLA Breach Auto-Escalation Warning',
    description: 'Complaint KPG-2026-0988 (PWD Ward 6) breached 3-day SLA limit and requires immediate intervention.',
    complaintId: 'KPG-2026-0988',
    priority: 'Escalated',
    department: 'Public Works (PWD)',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: false,
    actionLink: '/municipality/dashboard?tab=higher_authority'
  }
];

let announcementsDB = [
  {
    id: 'ANN-2026-001',
    title: 'Scheduled Water Supply Shutdown - Ward 2 & Ward 4',
    description: 'Water pipeline maintenance and valve replacement work scheduled on Sunday from 08:00 AM to 04:00 PM. Residents are requested to store adequate water.',
    category: 'Water Supply Shutdown',
    priority: 'High',
    targetWards: [2, 4],
    publishedBy: 'Chief Water Engineer',
    publishDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    status: 'Published',
    attachments: []
  },
  {
    id: 'ANN-2026-002',
    title: 'Monsoon Heavy Rainfall Advisory & Emergency Toll-Free Number',
    description: 'High rainfall advisory issued for Kopargaon district. Control room emergency helpline active 24x7: 1800-233-4567.',
    category: 'Emergency Notice',
    priority: 'Urgent/Emergency',
    targetWards: [1, 2, 3, 4, 5, 6, 7, 8],
    publishedBy: 'Municipal Commissioner Office',
    publishDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    status: 'Published',
    attachments: []
  }
];

let auditLogsDB = [
  {
    id: 'AUD-9001',
    timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    user: { name: 'Anil Kulkarni', role: 'Citizen', department: 'Resident' },
    ipAddress: '192.168.1.45',
    action: 'COMPLAINT_SUBMITTED',
    entityId: 'KPG-2026-0988',
    entityType: 'Complaint',
    previousValue: null,
    newValue: { status: 'Pending', category: 'Public Works (PWD)' }
  },
  {
    id: 'AUD-9002',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    user: { name: 'SYSTEM_SLA_ENGINE', role: 'System Daemon', department: 'Governance Engine' },
    ipAddress: '127.0.0.1 (System)',
    action: 'AUTOMATIC_SLA_ESCALATION',
    entityId: 'KPG-2026-0988',
    entityType: 'Complaint',
    previousValue: { status: 'Pending', isEscalated: false },
    newValue: { status: 'Escalated', isEscalated: true, reason: 'Exceeded 3 working days resolution limit' }
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Kopargaon Municipal Governance & Accountability Engine Operational',
    lastSync: new Date().toISOString()
  });
});

// Complaints Endpoints
app.get('/api/complaints', (req, res) => {
  res.json({ success: true, count: complaintsDB.length, data: complaintsDB });
});

app.get('/api/complaints/:id', (req, res) => {
  const item = complaintsDB.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Complaint not found' });
  res.json({ success: true, data: item });
});

app.post('/api/complaints', (req, res) => {
  const body = req.body;
  const now = new Date().toISOString();
  const dueDate = new Date(Date.now() + 72 * 3600 * 1000).toISOString(); // 3 working days SLA

  const newComplaint = {
    id: body.id || `KPG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    citizenId: body.citizenId || 'CIT-GUEST',
    submittedBy: body.submittedBy || 'Resident Citizen',
    citizenEmail: body.citizenEmail || 'citizen@kopargaon.gov.in',
    category: body.category || 'Sanitation',
    title: body.title,
    description: body.description,
    address: body.address || body.locationName || 'Kopargaon',
    ward: parseInt(body.ward) || 1,
    latitude: body.latitude || 19.8833,
    longitude: body.longitude || 74.4833,
    imageUrl: body.imageUrl || '',
    status: 'Pending',
    priority: body.priority || 'High',
    department: body.department || 'Public Works (PWD)',
    assignedOfficer: null,
    submittedAt: now,
    dueDate: dueDate,
    workStartedAt: null,
    completedAt: null,
    isEscalated: false,
    remarks: [],
    supportingDocuments: [],
    completionReport: null,
    timeline: [
      {
        id: `EVT-${Date.now()}`,
        status: 'Pending',
        timestamp: now,
        actor: { name: body.submittedBy || 'Citizen', role: 'Citizen', department: 'Resident' },
        action: 'Complaint Registered',
        note: `Complaint submitted under ${body.category || 'General'} category.`
      }
    ]
  };

  complaintsDB.unshift(newComplaint);

  // Audit Log
  const logEntry = {
    id: `AUD-${Date.now()}`,
    timestamp: now,
    user: { name: newComplaint.submittedBy, role: 'Citizen', department: 'Resident' },
    ipAddress: '192.168.1.104',
    action: 'COMPLAINT_SUBMITTED',
    entityId: newComplaint.id,
    entityType: 'Complaint',
    previousValue: null,
    newValue: { status: 'Pending', category: newComplaint.category }
  };
  auditLogsDB.unshift(logEntry);

  // Notification for Officer
  const notif = {
    id: `NOTIF-${Date.now()}`,
    recipientRole: 'officer',
    recipientId: 'KMC-OFFICER-001',
    title: 'New Complaint Registered',
    description: `Ticket ${newComplaint.id} (${newComplaint.category}) logged in Ward ${newComplaint.ward}.`,
    complaintId: newComplaint.id,
    priority: newComplaint.priority,
    department: newComplaint.department,
    timestamp: now,
    read: false,
    actionLink: '/municipality/dashboard'
  };
  notificationsDB.unshift(notif);

  res.status(201).json({ success: true, data: newComplaint });
});

// Notifications Endpoints
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: notificationsDB });
});

app.put('/api/notifications/:id/read', (req, res) => {
  notificationsDB = notificationsDB.map(n => n.id === req.params.id ? { ...n, read: true } : n);
  res.json({ success: true, message: 'Notification marked read' });
});

// Announcements Endpoints
app.get('/api/announcements', (req, res) => {
  res.json({ success: true, data: announcementsDB });
});

app.post('/api/announcements', (req, res) => {
  const body = req.body;
  const now = new Date().toISOString();
  const newAnn = {
    id: `ANN-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: body.title,
    description: body.description,
    category: body.category || 'General Notice',
    priority: body.priority || 'Normal',
    targetWards: body.targetWards || [1, 2, 3, 4, 5, 6, 7, 8],
    publishedBy: body.publishedBy || 'Municipal Administration',
    publishDate: now,
    expiryDate: body.expiryDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    status: 'Published',
    attachments: body.attachments || []
  };
  announcementsDB.unshift(newAnn);

  // Broadcast Notification
  notificationsDB.unshift({
    id: `NOTIF-${Date.now()}`,
    recipientRole: 'citizen',
    recipientId: 'ALL_CITIZENS',
    title: `Public Announcement: ${newAnn.title}`,
    description: newAnn.description.slice(0, 100) + '...',
    complaintId: null,
    priority: newAnn.priority,
    department: 'Municipal Administration',
    timestamp: now,
    read: false,
    actionLink: '/citizen/dashboard'
  });

  res.status(201).json({ success: true, data: newAnn });
});

// Audit Logs Endpoints
app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, data: auditLogsDB });
});

// SLA Auto-Check Endpoint
app.post('/api/sla-check', (req, res) => {
  const now = new Date();
  let escalatedCount = 0;

  complaintsDB = complaintsDB.map(c => {
    if (c.status !== 'Completed' && c.status !== 'Resolved' && !c.isEscalated) {
      const dueTime = new Date(c.dueDate);
      if (now > dueTime) {
        escalatedCount++;
        const nowIso = now.toISOString();
        
        // Audit log
        auditLogsDB.unshift({
          id: `AUD-${Date.now()}-${Math.floor(Math.random()*100)}`,
          timestamp: nowIso,
          user: { name: 'SYSTEM_SLA_ENGINE', role: 'System Daemon', department: 'Governance Engine' },
          ipAddress: '127.0.0.1 (System)',
          action: 'AUTOMATIC_SLA_ESCALATION',
          entityId: c.id,
          entityType: 'Complaint',
          previousValue: { status: c.status, isEscalated: false },
          newValue: { status: 'Escalated', isEscalated: true, reason: 'Passed 3-day resolution SLA deadline' }
        });

        // Escalation Notification to Higher Authority
        notificationsDB.unshift({
          id: `NOTIF-${Date.now()}-${Math.floor(Math.random()*100)}`,
          recipientRole: 'higher_authority',
          recipientId: 'HA-COMMISSIONER-01',
          title: `CRITICAL: SLA Breached - Escalated Ticket ${c.id}`,
          description: `Ticket ${c.id} (${c.department}) unresolved past 3-day SLA limit. Requires intervention.`,
          complaintId: c.id,
          priority: 'Escalated',
          department: c.department,
          timestamp: nowIso,
          read: false,
          actionLink: '/municipality/dashboard?tab=higher_authority'
        });

        return {
          ...c,
          status: 'Escalated',
          isEscalated: true,
          timeline: [
            ...c.timeline,
            {
              id: `EVT-${Date.now()}`,
              status: 'Escalated',
              timestamp: nowIso,
              actor: { name: 'SYSTEM_SLA_ENGINE', role: 'System Daemon', department: 'Governance Engine' },
              action: 'SLA Auto-Escalation',
              note: 'Overdue 3 working days SLA limit. Automatically escalated to Higher Authority Dashboard.'
            }
          ]
        };
      }
    }
    return c;
  });

  res.json({ success: true, message: `SLA Engine complete. ${escalatedCount} complaints auto-escalated.` });
});

// Citizen Registration & Authentication Storage
let registeredCitizensDB = [
  {
    id: 'CIT-8821',
    name: 'Ramesh Deshmukh',
    email: 'citizen@kopargaon.gov.in',
    phone: '+91 98765 43210',
    aadhaar: '1234-5678-9012',
    district: 'Ahilyanagar (Ahmednagar)',
    city: 'Kopargaon',
    ward: 4,
    address: 'Shivaji Chowk, Ward 4, Kopargaon - 423601',
    password: 'citizen123',
    registeredAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  }
];

// Citizen Registration REST API
app.post('/api/citizens/register', (req, res) => {
  const { fullName, email, mobile, aadhaar, district, city, wardNumber, address, password } = req.body;

  // Validation 1: District
  const normDist = (district || '').trim().toLowerCase();
  if (!normDist.includes('ahilyanagar') && !normDist.includes('ahmednagar')) {
    return res.status(400).json({ success: false, error: 'Registration rejected: District must be Ahilyanagar (Ahmednagar).' });
  }

  // Validation 2: City
  const normCity = (city || '').trim().toLowerCase();
  if (!normCity.includes('kopargaon')) {
    return res.status(400).json({ success: false, error: 'Registration rejected: City must be Kopargaon.' });
  }

  // Validation 3: 12-digit Aadhaar
  const cleanAadhaar = (aadhaar || '').replace(/\D/g, '');
  if (cleanAadhaar.length !== 12) {
    return res.status(400).json({ success: false, error: 'Invalid Aadhaar: 12 numeric digits required.' });
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const exists = registeredCitizensDB.some(c => c.email === cleanEmail || c.aadhaar.replace(/\D/g, '') === cleanAadhaar);
  if (exists) {
    return res.status(409).json({ success: false, error: 'Account already exists with provided Email or Aadhaar.' });
  }

  const formattedAadhaar = `${cleanAadhaar.slice(0,4)}-${cleanAadhaar.slice(4,8)}-${cleanAadhaar.slice(8,12)}`;
  const newCitizen = {
    id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
    name: fullName || 'Registered Citizen',
    email: cleanEmail,
    phone: mobile || '+91 98000 00000',
    aadhaar: formattedAadhaar,
    district: 'Ahilyanagar (Ahmednagar)',
    city: 'Kopargaon',
    ward: parseInt(wardNumber) || 4,
    address: address || 'Kopargaon, Maharashtra',
    password: password || 'citizen123',
    registeredAt: new Date().toISOString()
  };

  registeredCitizensDB.unshift(newCitizen);
  const token = jwt.sign(
    { id: newCitizen.id, email: newCitizen.email, role: 'citizen', name: newCitizen.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.status(201).json({
    success: true,
    userId: newCitizen.id,
    fullName: newCitizen.name,
    email: newCitizen.email,
    role: 'citizen',
    token,
    citizen: newCitizen
  });
});

// Citizen Login REST API with JWT Token
app.post('/api/citizens/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'Email/Aadhaar and password required.' });
  }

  const cleanInput = identifier.trim().toLowerCase();
  const cleanDigits = identifier.replace(/\D/g, '');

  const user = registeredCitizensDB.find(c => {
    const matchEmail = c.email && c.email.toLowerCase() === cleanInput;
    const matchAadhaar = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;
    return (matchEmail || matchAadhaar) && c.password === password;
  });

  if (user) {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'citizen', name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      success: true,
      userId: user.id,
      fullName: user.name,
      email: user.email,
      role: 'citizen',
      token,
      citizen: user
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid Email/Aadhaar or password.' });
  }
});

// Citizen Verify Session / Me Endpoint
app.get('/api/citizens/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = registeredCitizensDB.find(c => c.id === decoded.id || c.email === decoded.email);
    if (user) {
      res.json({
        success: true,
        userId: user.id,
        fullName: user.name,
        email: user.email,
        role: 'citizen',
        token,
        citizen: user
      });
    } else {
      res.status(404).json({ success: false, error: 'Citizen profile not found.' });
    }
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token expired or invalid.' });
  }
});

// Citizen Profile Update Endpoint
app.put('/api/citizens/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userIndex = registeredCitizensDB.findIndex(c => c.id === decoded.id || c.email === decoded.email);
    if (userIndex !== -1) {
      const { fullName, name, email, phone, ward, address } = req.body;
      const updatedName = fullName || name || registeredCitizensDB[userIndex].name;
      registeredCitizensDB[userIndex] = {
        ...registeredCitizensDB[userIndex],
        name: updatedName,
        email: email || registeredCitizensDB[userIndex].email,
        phone: phone || registeredCitizensDB[userIndex].phone,
        ward: ward !== undefined ? parseInt(ward) : registeredCitizensDB[userIndex].ward,
        address: address || registeredCitizensDB[userIndex].address
      };
      const updatedUser = registeredCitizensDB[userIndex];
      res.json({
        success: true,
        userId: updatedUser.id,
        fullName: updatedUser.name,
        email: updatedUser.email,
        role: 'citizen',
        citizen: updatedUser
      });
    } else {
      res.status(404).json({ success: false, error: 'Citizen profile not found.' });
    }
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token expired or invalid.' });
  }
});

// Municipal Officer Login REST API with JWT Token
app.post('/api/officers/login', (req, res) => {
  const { officerId, password } = req.body;
  if ((officerId === 'kpg' && password === 'kpg@123') || (officerId === 'admin' && password === 'admin123')) {
    const officer = {
      officerId: officerId,
      name: 'Municipal Administrator',
      role: 'Smart City Commissioner',
      department: 'Municipal Headquarters',
      badge: 'KMC-OFFICER-001'
    };
    const token = jwt.sign(
      { officerId: officer.officerId, role: 'officer', name: officer.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      success: true,
      userId: officer.officerId,
      fullName: officer.name,
      email: 'officer@kopargaon.gov.in',
      role: officer.role,
      token,
      officer
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid Officer ID or Access Code.' });
  }
});

// Officer Verify Session / Me Endpoint
app.get('/api/officers/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'officer') {
      const officer = {
        officerId: decoded.officerId || 'kpg',
        name: decoded.name || 'Municipal Administrator',
        role: 'Smart City Commissioner',
        department: 'Municipal Headquarters',
        badge: 'KMC-OFFICER-001'
      };
      res.json({ success: true, officer, token });
    } else {
      res.status(403).json({ success: false, error: 'Invalid officer role token.' });
    }
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token expired or invalid.' });
  }
});

// Citizen Password Reset REST API
app.post('/api/citizens/reset-password', (req, res) => {
  const { identifier, newPassword } = req.body;
  if (!identifier || !newPassword) {
    return res.status(400).json({ success: false, error: 'Identity and new password required.' });
  }

  const cleanInput = identifier.trim().toLowerCase();
  const cleanDigits = identifier.replace(/\D/g, '');

  const userIndex = registeredCitizensDB.findIndex(c => {
    const matchEmail = c.email && c.email.toLowerCase() === cleanInput;
    const matchAadhaar = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;
    return matchEmail || matchAadhaar;
  });

  if (userIndex !== -1) {
    registeredCitizensDB[userIndex].password = newPassword;
    res.json({ success: true, message: 'Password updated successfully.' });
  } else {
    res.status(404).json({ success: false, error: 'Citizen account not found.' });
  }
});

// Permissions & Licensing DB Storage
let permissionsDB = [
  {
    id: 'PERM-2026-9041',
    category: 'Residential',
    permissionType: 'New House Construction',
    applicantName: 'Ramesh Deshmukh',
    applicantEmail: 'citizen@kopargaon.gov.in',
    propertyNumber: 'KPG-PROP-4218',
    propertyAddress: 'Shivaji Chowk, Ward 4, Kopargaon',
    wardNumber: 4,
    status: 'Approved',
    certificateNumber: 'KMC-PERM-2026-9041',
    submittedAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
  }
];

// Tax & Revenue DB Storage
let taxesDB = [
  {
    id: 'TAX-2026-8812',
    citizenId: 'CIT-8821',
    citizenName: 'Ramesh Deshmukh',
    propertyNumber: 'KPG-PROP-4218',
    address: 'Shivaji Chowk, Ward 4, Kopargaon',
    ward: 4,
    taxCategory: 'Property Tax',
    amount: 4500,
    penalty: 0,
    status: 'Unpaid',
    billNumber: 'BILL-2026-8812',
    dueDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  }
];

// Permissions REST APIs
app.get('/api/permissions', (req, res) => {
  res.json({ success: true, count: permissionsDB.length, permissions: permissionsDB });
});

app.post('/api/permissions', (req, res) => {
  const newApp = {
    id: `PERM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'Submitted',
    submittedAt: new Date().toISOString()
  };
  permissionsDB.unshift(newApp);
  res.status(201).json({ success: true, permission: newApp });
});

app.put('/api/permissions/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const app = permissionsDB.find(p => p.id === id);
  if (app) {
    app.status = status;
    if (status === 'Approved') app.certificateNumber = `KMC-PERM-2026-${id.replace(/\D/g, '')}`;
    res.json({ success: true, permission: app });
  } else {
    res.status(404).json({ success: false, error: 'Permission record not found.' });
  }
});

// Tax REST APIs
app.get('/api/taxes', (req, res) => {
  res.json({ success: true, count: taxesDB.length, taxes: taxesDB });
});

app.post('/api/taxes', (req, res) => {
  const newTax = {
    id: `TAX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    billNumber: `BILL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'Unpaid',
    createdAt: new Date().toISOString()
  };
  taxesDB.unshift(newTax);
  res.status(201).json({ success: true, tax: newTax });
});

app.post('/api/taxes/:id/pay', (req, res) => {
  const { id } = req.params;
  const { paymentMethod } = req.body;
  const tax = taxesDB.find(t => t.id === id);
  if (tax) {
    tax.status = 'Paid';
    tax.paymentMethod = paymentMethod || 'UPI';
    tax.receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    tax.paidAt = new Date().toISOString();
    res.json({ success: true, tax: tax });
  } else {
    res.status(404).json({ success: false, error: 'Tax record not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`Enterprise Municipal Governance API Server running on http://localhost:${PORT}`);
});
