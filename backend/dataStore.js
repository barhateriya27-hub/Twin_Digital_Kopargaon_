import bcrypt from 'bcryptjs';
import { isDbConnected } from './db.js';
import { User, Complaint, Permission, Tax, Asset, Sensor, Team, Notification, AiInsight, AuditLog, Document } from './models.js';

// ─── CONSTANTS & ENUMS ────────────────────────────────────────────────────────
const SALT_ROUNDS = 10;

export const ROLES = {
  CITIZEN: 'citizen',
  STAFF: 'staff',
  ADMIN: 'admin'
};

export const DEPARTMENTS = {
  SANITATION: 'Sanitation & Solid Waste Management',
  WATER: 'Water Supply & Sewerage Department',
  PWD: 'Public Works (PWD)',
  LIGHTING: 'Electrical & Street Lighting',
  TOWN_PLANNING: 'Town Planning & Transit',
  REVENUE: 'Revenue & Tax Assessment',
  HEALTH: 'Health & Disaster Management',
  HEADQUARTERS: 'Municipal Headquarters'
};

export const COMPLAINT_STATUS = {
  REPORTED: 'Reported',
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
  ESCALATED: 'Escalated',
  REJECTED: 'Rejected'
};

export const COMPLAINT_PRIORITY = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  EMERGENCY: 'Emergency'
};

export const ASSET_STATUS = {
  OPERATIONAL: 'Operational',
  MAINTENANCE: 'Under Maintenance',
  DEGRADED: 'Degraded',
  CRITICAL: 'Critical Risk'
};

export const SENSOR_STATUS = {
  NORMAL: 'Normal',
  WARNING: 'Warning',
  CRITICAL: 'Critical',
  OFFLINE: 'Offline'
};

// ─── PRE-HASHED PASSWORDS ─────────────────────────────────────────────────────
const HASHED_CITIZEN_PASS = bcrypt.hashSync('citizen123', SALT_ROUNDS);
const HASHED_OFFICER_PASS = bcrypt.hashSync('kpg@123', SALT_ROUNDS);
const HASHED_ADMIN_PASS = bcrypt.hashSync('admin123', SALT_ROUNDS);

// ─── SYSTEM SEED DATASETS (PRESERVED SYSTEM CONFIGURATIONS) ───────────────────
const initialUsers = [
  {
    id: 'CIT-8821',
    name: 'Swanandi Kathale',
    email: 'citizen@kopargaon.gov.in',
    phone: '+91 98765 43210',
    aadhaar: '1234-5678-9012',
    district: 'Ahilyanagar (Ahmednagar)',
    city: 'Kopargaon',
    ward: 4,
    address: 'Shivaji Chowk, Ward 4, Kopargaon - 423601',
    passwordHash: HASHED_CITIZEN_PASS,
    role: ROLES.CITIZEN,
    department: 'Resident',
    mfaEnabled: false,
    registeredAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'KMC-OFFICER-001',
    officerId: 'kpg',
    name: 'Officer Er. Suresh Deshmukh',
    email: 'sanitation.officer@kopargaon.gov.in',
    phone: '+91 98220 11001',
    role: ROLES.STAFF,
    department: DEPARTMENTS.SANITATION,
    badge: 'KMC-SAN-001',
    passwordHash: HASHED_OFFICER_PASS,
    mfaEnabled: true,
    registeredAt: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'KMC-ADMIN-001',
    officerId: 'admin',
    name: 'Smart City Commissioner',
    email: 'commissioner@kopargaon.gov.in',
    phone: '+91 98220 00000',
    role: ROLES.ADMIN,
    department: DEPARTMENTS.HEADQUARTERS,
    badge: 'KMC-COMMISSIONER-01',
    passwordHash: HASHED_ADMIN_PASS,
    mfaEnabled: true,
    registeredAt: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString()
  }
];

const initialTeams = [
  {
    id: 'TEAM-SAN-01',
    name: 'Ward 4 Sanitation Quick Response Squad',
    department: DEPARTMENTS.SANITATION,
    assignedWard: 4,
    leaderId: 'KMC-OFFICER-001',
    membersCount: 8,
    vehicles: [
      { vehicleNumber: 'MH-17-BC-4412', type: 'Compactor Truck', status: 'Deployed' },
      { vehicleNumber: 'MH-17-BC-8810', type: 'Sweeper Van', status: 'On Duty' }
    ],
    status: 'Deployed',
    activeTicketsCount: 0
  },
  {
    id: 'TEAM-WTR-01',
    name: 'Godavari Emergency Pipeline Repair Unit',
    department: DEPARTMENTS.WATER,
    assignedWard: 2,
    leaderId: 'KMC-OFFICER-001',
    membersCount: 6,
    vehicles: [
      { vehicleNumber: 'MH-17-W-1042', type: 'Excavator & Valve Van', status: 'Standby' }
    ],
    status: 'Standby',
    activeTicketsCount: 0
  }
];

const initialAssets = [
  {
    id: 'AST-GB-01',
    name: 'Kopargaon Municipal Corporation HQ',
    category: 'Civic Facility',
    department: DEPARTMENTS.HEADQUARTERS,
    location: { address: 'Station Road, Kopargaon', ward: 1, latitude: 19.8833, longitude: 74.4833 },
    status: ASSET_STATUS.OPERATIONAL,
    healthScore: 98,
    capacity: 'Full Administrative HQ',
    managedBy: 'KMC-ADMIN-001',
    lastInspectedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'AST-WTR-01',
    name: 'Godavari Headworks Pumping Station #1',
    category: 'Water Reservoir',
    department: DEPARTMENTS.WATER,
    location: { address: 'Godavari River Bank, Ward 9', ward: 9, latitude: 19.8890, longitude: 74.4810 },
    status: ASSET_STATUS.OPERATIONAL,
    healthScore: 92,
    capacity: '2.5 Million Liters / Day',
    managedBy: 'KMC-OFFICER-001',
    lastInspectedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }
];

const initialSensors = [
  {
    id: 'SNS-WTR-01',
    assetId: 'AST-WTR-01',
    sensorType: 'WaterPressure',
    location: { ward: 4, latitude: 19.8855, longitude: 74.4821, landmark: 'Shivaji Chowk Main Valve' },
    currentValue: 42,
    unit: 'psi',
    status: SENSOR_STATUS.NORMAL,
    lastReadingAt: new Date().toISOString(),
    historicalReadings: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 45 },
      { timestamp: new Date().toISOString(), value: 42 }
    ]
  },
  {
    id: 'SNS-AIR-01',
    assetId: 'AST-GB-01',
    sensorType: 'AirQualityAQI',
    location: { ward: 1, latitude: 19.8833, longitude: 74.4833, landmark: 'Municipal HQ Terrace' },
    currentValue: 62,
    unit: 'AQI',
    status: SENSOR_STATUS.NORMAL,
    lastReadingAt: new Date().toISOString(),
    historicalReadings: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 65 },
      { timestamp: new Date().toISOString(), value: 62 }
    ]
  }
];

// Cleaned / empty initial datasets for transactional collections
const initialComplaints = [];
const initialPermissions = [];
const initialTaxes = [];
const initialDocuments = [];
const initialNotifications = [];
const initialAiInsights = [];
const initialAuditLogs = [];

// Helper to strictly enforce DB availability
const ensureDbConnected = () => {
  if (!isDbConnected()) {
    throw new Error('Database is offline or not configured. All database access operations are disabled.');
  }
};

// ─── DATABASE INITIALIZATION / SEEDING ROUTINE ────────────────────────────────
export const initializeDatabase = async () => {
  ensureDbConnected();

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[DB Seeding] User collection is empty. Seeding initial users...');
      await User.insertMany(initialUsers);
    }

    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0 && initialComplaints.length > 0) {
      await Complaint.insertMany(initialComplaints);
    }

    const permissionCount = await Permission.countDocuments();
    if (permissionCount === 0 && initialPermissions.length > 0) {
      await Permission.insertMany(initialPermissions);
    }

    const taxCount = await Tax.countDocuments();
    if (taxCount === 0 && initialTaxes.length > 0) {
      await Tax.insertMany(initialTaxes);
    }

    const assetCount = await Asset.countDocuments();
    if (assetCount === 0) {
      console.log('[DB Seeding] Seeding initial infrastructure assets...');
      await Asset.insertMany(initialAssets);
    }

    const sensorCount = await Sensor.countDocuments();
    if (sensorCount === 0) {
      console.log('[DB Seeding] Seeding initial telemetry sensors...');
      await Sensor.insertMany(initialSensors);
    }

    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      console.log('[DB Seeding] Seeding initial municipal teams...');
      await Team.insertMany(initialTeams);
    }

    console.log('✅ [DB Seeding] Database collections populated/verified successfully.');
  } catch (err) {
    console.error('❌ [DB Seeding Error] Failed to seed database collections:', err.message);
  }
};

// ─── STRICT UNIFIED DATA ACCESS API ───────────────────────────────────────────
export const dataStore = {
  // Users Repository
  users: {
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await User.find({});
        return all.find(predicateOrQuery);
      }
      return await User.findOne(predicateOrQuery);
    },
    filter: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await User.find({});
        return all.filter(predicateOrQuery);
      }
      return await User.find(predicateOrQuery);
    },
    getAll: async () => {
      ensureDbConnected();
      return await User.find({});
    },
    add: async (newUser) => {
      ensureDbConnected();
      const doc = new User(newUser);
      await doc.save();
      return doc.toObject();
    },
    update: async (id, updates) => {
      ensureDbConnected();
      const updated = await User.findOneAndUpdate({ id }, { $set: updates }, { new: true });
      return updated ? updated.toObject() : null;
    }
  },

  // Complaints Repository
  complaints: {
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Complaint.find({});
        return all.find(predicateOrQuery);
      }
      return await Complaint.findOne(predicateOrQuery);
    },
    filter: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Complaint.find({});
        return all.filter(predicateOrQuery);
      }
      return await Complaint.find(predicateOrQuery);
    },
    getAll: async () => {
      ensureDbConnected();
      return await Complaint.find({}).sort({ submittedAt: -1 });
    },
    add: async (newComp) => {
      ensureDbConnected();
      const doc = new Complaint(newComp);
      await doc.save();
      return doc.toObject();
    },
    assignOfficer: async (id, assignedOfficer, assignedTeamId, note, actorName, officerRole, department) => {
      ensureDbConnected();
      const comp = await Complaint.findOne({ id });
      if (comp) {
        comp.assignedOfficer = assignedOfficer || comp.assignedOfficer;
        comp.assignedOfficerId = assignedOfficer || comp.assignedOfficerId;
        if (assignedTeamId) comp.assignedTeamId = assignedTeamId;
        comp.status = COMPLAINT_STATUS.ASSIGNED;
        comp.timeline.push({
          id: `EVT-${Date.now()}`,
          status: COMPLAINT_STATUS.ASSIGNED,
          timestamp: new Date(),
          actor: { name: actorName || 'Municipal Control Center', role: officerRole || ROLES.STAFF, department: department || comp.department },
          action: `Assigned to ${assignedOfficer || assignedTeamId || 'Field Squad'}`,
          note: note || `Maintenance team assigned: ${assignedOfficer || assignedTeamId}`
        });
        await comp.save();
        return comp.toObject();
      }
      return null;
    },
    updateStatus: async (id, status, note, actorName, officerRole, department) => {
      ensureDbConnected();
      const comp = await Complaint.findOne({ id });
      if (comp) {
        comp.status = status;
        if ((status === COMPLAINT_STATUS.IN_PROGRESS || status === 'In Progress') && !comp.workStartedAt) {
          comp.workStartedAt = new Date();
        }
        if (status === COMPLAINT_STATUS.RESOLVED || status === 'Resolved' || status === COMPLAINT_STATUS.COMPLETED || status === COMPLAINT_STATUS.CLOSED || status === 'Closed') {
          comp.completedAt = new Date();
        }
        comp.timeline.push({
          id: `EVT-${Date.now()}`,
          status,
          timestamp: new Date(),
          actor: { name: actorName, role: officerRole, department: department || comp.department },
          action: `Status modified to ${status}`,
          note: note || `Updated by ${actorName}`
        });
        await comp.save();
        return comp.toObject();
      }
      return null;
    }
  },

  // Permissions Repository
  permissions: {
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Permission.find({});
        return all.find(predicateOrQuery);
      }
      return await Permission.findOne(predicateOrQuery);
    },
    filter: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Permission.find({});
        return all.filter(predicateOrQuery);
      }
      return await Permission.find(predicateOrQuery);
    },
    getAll: async () => {
      ensureDbConnected();
      return await Permission.find({}).sort({ submittedAt: -1 });
    },
    add: async (newPerm) => {
      ensureDbConnected();
      const doc = new Permission(newPerm);
      await doc.save();
      return doc.toObject();
    }
  },

  // Taxes Repository
  taxes: {
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Tax.find({});
        return all.find(predicateOrQuery);
      }
      return await Tax.findOne(predicateOrQuery);
    },
    filter: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Tax.find({});
        return all.filter(predicateOrQuery);
      }
      return await Tax.find(predicateOrQuery);
    },
    getAll: async () => {
      ensureDbConnected();
      return await Tax.find({});
    },
    add: async (newTax) => {
      ensureDbConnected();
      const doc = new Tax(newTax);
      await doc.save();
      return doc.toObject();
    },
    processPayment: async (id, paymentMethod) => {
      ensureDbConnected();
      const tax = await Tax.findOne({ id });
      if (tax) {
        tax.status = 'Paid';
        tax.paidAt = new Date();
        tax.paymentMethod = paymentMethod || 'UPI / NetBanking';
        tax.receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        await tax.save();
        return tax.toObject();
      }
      return null;
    }
  },

  // Assets Repository
  assets: {
    getAll: async () => {
      ensureDbConnected();
      return await Asset.find({});
    },
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Asset.find({});
        return all.find(predicateOrQuery);
      }
      return await Asset.findOne(predicateOrQuery);
    }
  },

  // Sensors Repository
  sensors: {
    getAll: async () => {
      ensureDbConnected();
      return await Sensor.find({});
    },
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Sensor.find({});
        return all.find(predicateOrQuery);
      }
      return await Sensor.findOne(predicateOrQuery);
    }
  },

  // Teams Repository
  teams: {
    getAll: async () => {
      ensureDbConnected();
      return await Team.find({});
    },
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Team.find({});
        return all.find(predicateOrQuery);
      }
      return await Team.findOne(predicateOrQuery);
    }
  },

  // Notifications Repository
  notifications: {
    getAll: async () => {
      ensureDbConnected();
      return await Notification.find({}).sort({ timestamp: -1 });
    },
    filter: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Notification.find({});
        return all.filter(predicateOrQuery);
      }
      return await Notification.find(predicateOrQuery);
    },
    add: async (newNotif) => {
      ensureDbConnected();
      const doc = new Notification(newNotif);
      await doc.save();
      return doc.toObject();
    }
  },

  // AI Insights Repository
  aiInsights: {
    getAll: async () => {
      ensureDbConnected();
      return await AiInsight.find({});
    }
  },

  // Audit Logs Repository
  auditLogs: {
    getAll: async () => {
      ensureDbConnected();
      return await AuditLog.find({}).sort({ timestamp: -1 });
    },
    add: async (req, action, entityId, entityType, status = 'SUCCESS', details = '') => {
      ensureDbConnected();
      const logEntry = {
        id: `AUD-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        timestamp: new Date(),
        user: req.user
          ? { id: req.user.id, name: req.user.name, role: req.user.role, department: req.user.department || 'Resident' }
          : { id: 'UNAUTHENTICATED', name: req.body?.email || req.body?.identifier || 'Anonymous', role: 'guest', department: 'Public' },
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        action,
        entityId: entityId || 'N/A',
        entityType: entityType || 'System',
        status,
        details
      };
      const doc = new AuditLog(logEntry);
      await doc.save();
      return doc.toObject();
    }
  },

  // Documents Repository
  documents: {
    find: async (predicateOrQuery) => {
      ensureDbConnected();
      if (typeof predicateOrQuery === 'function') {
        const all = await Document.find({});
        return all.find(predicateOrQuery);
      }
      return await Document.findOne(predicateOrQuery);
    },
    getAll: async () => {
      ensureDbConnected();
      return await Document.find({});
    }
  },

  // Aggregate City Overview Metrics
  getCityOverview: async () => {
    ensureDbConnected();

    const uList = await User.find({});
    const aList = await Asset.find({});
    const sList = await Sensor.find({});
    const tList = await Team.find({});
    const cList = await Complaint.find({});

    const totalComplaints = cList.length;
    const openComplaints = cList.filter(c => c.status === COMPLAINT_STATUS.REPORTED || c.status === COMPLAINT_STATUS.PENDING || c.status === COMPLAINT_STATUS.ASSIGNED || c.status === COMPLAINT_STATUS.IN_PROGRESS).length;
    const resolvedComplaints = cList.filter(c => c.status === COMPLAINT_STATUS.RESOLVED || c.status === COMPLAINT_STATUS.COMPLETED || c.status === COMPLAINT_STATUS.CLOSED).length;
    const escalatedComplaints = cList.filter(c => c.status === COMPLAINT_STATUS.ESCALATED).length;
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

    return {
      totalCitizens: uList.filter(u => u.role === ROLES.CITIZEN).length,
      totalStaff: uList.filter(u => u.role === ROLES.STAFF || u.role === ROLES.ADMIN).length,
      totalAssets: aList.length,
      totalSensors: sList.length,
      activeTeams: tList.filter(t => t.status === 'Deployed' || t.status === 'On Duty').length,
      complaints: {
        total: totalComplaints,
        open: openComplaints,
        resolved: resolvedComplaints,
        escalated: escalatedComplaints,
        resolutionRate: resolutionRate
      },
      cityHealthScore: Math.max(60, Math.min(100, 100 - openComplaints * 5 - escalatedComplaints * 10)),
      lastSync: new Date().toISOString()
    };
  }
};
