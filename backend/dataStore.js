import bcrypt from 'bcryptjs';

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

// ─── 1. USERS COLLECTION ──────────────────────────────────────────────────────
let users = [
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
    id: 'CIT-4410',
    name: 'Anil Kulkarni',
    email: 'anil.k@kopargaon.gov.in',
    phone: '+91 98111 22233',
    aadhaar: '9876-5432-1098',
    district: 'Ahilyanagar (Ahmednagar)',
    city: 'Kopargaon',
    ward: 6,
    address: 'Station Road, Ward 6, Kopargaon',
    passwordHash: HASHED_CITIZEN_PASS,
    role: ROLES.CITIZEN,
    department: 'Resident',
    mfaEnabled: false,
    registeredAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString()
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
    id: 'KMC-OFFICER-002',
    officerId: 'water_officer',
    name: 'Er. Rajesh Shinde',
    email: 'water.officer@kopargaon.gov.in',
    phone: '+91 98220 11002',
    role: ROLES.STAFF,
    department: DEPARTMENTS.WATER,
    badge: 'KMC-WTR-002',
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

// ─── 2. MUNICIPAL TEAMS COLLECTION ───────────────────────────────────────────
let teams = [
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
    activeTicketsCount: 1
  },
  {
    id: 'TEAM-WTR-01',
    name: 'Godavari Emergency Pipeline Repair Unit',
    department: DEPARTMENTS.WATER,
    assignedWard: 2,
    leaderId: 'KMC-OFFICER-002',
    membersCount: 6,
    vehicles: [
      { vehicleNumber: 'MH-17-W-1042', type: 'Excavator & Valve Van', status: 'Deployed' }
    ],
    status: 'Deployed',
    activeTicketsCount: 1
  },
  {
    id: 'TEAM-PWD-01',
    name: 'Station Road Asphalt & Pothole Squad',
    department: DEPARTMENTS.PWD,
    assignedWard: 6,
    leaderId: 'KMC-OFFICER-002',
    membersCount: 10,
    vehicles: [
      { vehicleNumber: 'MH-17-P-9021', type: 'Road Roller & Hotmix Unit', status: 'Standby' }
    ],
    status: 'Standby',
    activeTicketsCount: 1
  }
];

// ─── 3. INFRASTRUCTURE & ASSETS COLLECTION ───────────────────────────────────
let assets = [
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
    managedBy: 'KMC-OFFICER-002',
    lastInspectedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'AST-ELE-01',
    name: 'Kopargaon 132kV Substation Grid',
    category: 'Electrical Substation',
    department: DEPARTMENTS.LIGHTING,
    location: { address: 'Subhash Road, Ward 6', ward: 6, latitude: 19.8790, longitude: 74.4910 },
    status: ASSET_STATUS.OPERATIONAL,
    healthScore: 94,
    capacity: '132 kV Grid Capacity',
    managedBy: 'KMC-OFFICER-001',
    lastInspectedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'AST-TRN-01',
    name: 'MSRTC Central Bus Transit Depot',
    category: 'Transit Hub',
    department: DEPARTMENTS.TOWN_PLANNING,
    location: { address: 'Central Bus Stand, Ward 2', ward: 2, latitude: 19.8912, longitude: 74.4789 },
    status: ASSET_STATUS.OPERATIONAL,
    healthScore: 88,
    capacity: '180 Bus Departures / Day',
    managedBy: 'KMC-OFFICER-001',
    lastInspectedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  }
];

// ─── 4. SENSORS & LIVE TELEMETRY COLLECTION ─────────────────────────────────
let sensors = [
  {
    id: 'SNS-WTR-01',
    assetId: 'AST-WTR-01',
    sensorType: 'WaterPressure',
    location: { ward: 4, latitude: 19.8855, longitude: 74.4821, landmark: 'Shivaji Chowk Main Valve' },
    currentValue: 38,
    unit: 'psi',
    status: SENSOR_STATUS.WARNING,
    lastReadingAt: new Date().toISOString(),
    historicalReadings: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 45 },
      { timestamp: new Date().toISOString(), value: 38 }
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
  },
  {
    id: 'SNS-TRF-01',
    assetId: 'AST-TRN-01',
    sensorType: 'TrafficDensity',
    location: { ward: 2, latitude: 19.8912, longitude: 74.4789, landmark: 'Bus Stand Junction' },
    currentValue: 74,
    unit: '% density',
    status: SENSOR_STATUS.WARNING,
    lastReadingAt: new Date().toISOString(),
    historicalReadings: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 50 },
      { timestamp: new Date().toISOString(), value: 74 }
    ]
  },
  {
    id: 'SNS-WST-01',
    assetId: 'AST-GB-01',
    sensorType: 'WasteBinLevel',
    location: { ward: 4, latitude: 19.8855, longitude: 74.4821, landmark: 'Shivaji Chowk Market Bin' },
    currentValue: 88,
    unit: '% full',
    status: SENSOR_STATUS.CRITICAL,
    lastReadingAt: new Date().toISOString(),
    historicalReadings: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), value: 70 },
      { timestamp: new Date().toISOString(), value: 88 }
    ]
  }
];

// ─── 5. COMPLAINTS COLLECTION ────────────────────────────────────────────────
let complaints = [
  {
    id: 'CMP1023',
    citizenId: 'CIT-8821',
    submittedBy: 'Swanandi Kathale',
    citizenEmail: 'citizen@kopargaon.gov.in',
    category: 'Street Light',
    title: 'Streetlight Malfunction near Shivaji Chowk',
    description: 'LED streetlamp fixture flickering and failing at night near Shivaji Chowk.',
    department: DEPARTMENTS.LIGHTING,
    priority: COMPLAINT_PRIORITY.NORMAL,
    status: COMPLAINT_STATUS.RESOLVED,
    location: { address: 'Shivaji Chowk, Ward 4', ward: 4, latitude: 19.8855, longitude: 74.4821 },
    imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
    supportingDocuments: ['KPG-DOC-101'],
    assignedOfficerId: 'KMC-OFFICER-001',
    assignedOfficer: 'Er. Ramesh Shinde',
    assignedTeamId: 'TEAM-SAN-01',
    submittedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    workStartedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isEscalated: false,
    remarks: ['Replacement LED bulb installed and tested.'],
    timeline: [
      {
        id: 'EVT-1001',
        status: COMPLAINT_STATUS.REPORTED,
        timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        actor: { id: 'CIT-8821', name: 'Swanandi Kathale', role: ROLES.CITIZEN, department: 'Resident' },
        action: 'Complaint Registered',
        note: 'Submitted ticket via Citizen Portal.'
      },
      {
        id: 'EVT-1001B',
        status: COMPLAINT_STATUS.ASSIGNED,
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        actor: { id: 'KMC-OFFICER-001', name: 'Er. Ramesh Shinde', role: ROLES.STAFF, department: DEPARTMENTS.LIGHTING },
        action: 'Squad Assigned',
        note: 'Assigned to Electrical Maintenance Unit.'
      },
      {
        id: 'EVT-1002',
        status: COMPLAINT_STATUS.RESOLVED,
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        actor: { id: 'KMC-OFFICER-001', name: 'Er. Ramesh Shinde', role: ROLES.STAFF, department: DEPARTMENTS.LIGHTING },
        action: 'Complaint Resolved',
        note: 'Lighting fixture replaced.'
      }
    ]
  },
  {
    id: 'CMP1032',
    citizenId: 'CIT-8821',
    submittedBy: 'Swanandi Kathale',
    citizenEmail: 'citizen@kopargaon.gov.in',
    category: 'Water Leakage',
    title: 'Water Supply Pipeline Leakage',
    description: 'Underground main line valve seepage near Ward 4 market street causing low water pressure.',
    department: DEPARTMENTS.WATER,
    priority: COMPLAINT_PRIORITY.HIGH,
    status: COMPLAINT_STATUS.IN_PROGRESS,
    location: { address: 'Market Yard, Ward 4', ward: 4, latitude: 19.8890, longitude: 74.4810 },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    supportingDocuments: ['KPG-DOC-102'],
    assignedOfficerId: 'KMC-OFFICER-002',
    assignedOfficer: 'Er. Suresh Deshmukh',
    assignedTeamId: 'TEAM-WTR-01',
    submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    workStartedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    completedAt: null,
    isEscalated: false,
    remarks: ['Excavation and valve replacement squad deployed.'],
    timeline: [
      {
        id: 'EVT-1003A',
        status: COMPLAINT_STATUS.REPORTED,
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        actor: { id: 'CIT-8821', name: 'Swanandi Kathale', role: ROLES.CITIZEN, department: 'Resident' },
        action: 'Complaint Registered',
        note: 'Submitted ticket via Citizen Portal.'
      },
      {
        id: 'EVT-1003',
        status: COMPLAINT_STATUS.IN_PROGRESS,
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        actor: { id: 'KMC-OFFICER-002', name: 'Er. Suresh Deshmukh', role: ROLES.STAFF, department: DEPARTMENTS.WATER },
        action: 'Work Commenced',
        note: 'Repair team assigned.'
      }
    ]
  },
  {
    id: 'KPG-2026-0988',
    citizenId: 'CIT-4410',
    submittedBy: 'Anil Kulkarni',
    citizenEmail: 'anil.k@kopargaon.gov.in',
    category: 'Pothole',
    title: 'Hazardous Road Cave-in on Station Road',
    description: 'Deep road cave-in causing traffic bottleneck and vehicle damage.',
    department: DEPARTMENTS.PWD,
    priority: COMPLAINT_PRIORITY.HIGH,
    status: COMPLAINT_STATUS.ESCALATED,
    location: { address: 'Station Road Flyover, Ward 6', ward: 6, latitude: 19.8790, longitude: 74.4910 },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    supportingDocuments: [],
    assignedOfficerId: 'KMC-OFFICER-002',
    assignedOfficer: 'Rajesh Shinde',
    assignedTeamId: 'TEAM-PWD-01',
    submittedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    workStartedAt: null,
    completedAt: null,
    isEscalated: true,
    remarks: ['SLA breached. Escalated to Higher Authority.'],
    timeline: []
  }
];

// ─── 6. PERMISSIONS & APPLICATIONS COLLECTION ───────────────────────────────
let permissions = [
  {
    id: 'KPG-PERM-2026-0041',
    applicantId: 'CIT-8821',
    applicantName: 'Swanandi Kathale',
    citizenEmail: 'citizen@kopargaon.gov.in',
    permissionType: 'New House Construction',
    category: 'Residential',
    plotAreaSqFt: 1800,
    location: { propertyAddress: 'Plot 12, Sai Nagar, Ward 4, Kopargaon', ward: 4, propertyNumber: 'KPG-PROP-4218', latitude: 19.8855, longitude: 74.4821 },
    architectName: 'Ar. Vilas Deshmukh',
    status: 'Approved',
    submittedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    inspectionDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    scrutinyFeeAmount: 1500,
    scrutinyFeePaid: true,
    certificateNumber: 'KMC-PERM-2026-0041',
    certificateIssued: true,
    documentId: 'KPG-DOC-201',
    notes: 'Approved under Kopargaon Town Planning DCR 2026.'
  }
];

// ─── 7. PAYMENTS & TAXES COLLECTION ────────────────────────────────────────
let taxes = [
  {
    id: 'KPG-TAX-2026-0102',
    billNumber: 'BILL-2026-0102',
    citizenId: 'CIT-8821',
    citizenName: 'Swanandi Kathale',
    citizenEmail: 'citizen@kopargaon.gov.in',
    propertyNumber: 'KPG-PROP-4218',
    location: { address: 'Shivaji Chowk, Ward 4, Kopargaon', ward: 4, latitude: 19.8855, longitude: 74.4821 },
    taxCategory: 'Property Tax',
    amount: 4200,
    penalty: 0,
    totalAmount: 4200,
    status: 'Paid',
    dueDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    paymentMethod: 'UPI / NetBanking',
    receiptNumber: 'REC-2026-9812',
    receiptDocId: 'KPG-DOC-301'
  }
];

// ─── 8. PRIVATE DOCUMENTS COLLECTION ────────────────────────────────────────
let documents = [
  {
    id: 'KPG-DOC-101',
    title: 'Streetlight Site Photo & Verification',
    ownerId: 'CIT-8821',
    ownerEmail: 'citizen@kopargaon.gov.in',
    documentType: 'ComplaintAttachment',
    fileType: 'image/png',
    isPrivate: true,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  },
  {
    id: 'KPG-DOC-201',
    title: 'Approved Building Plan Certificate',
    ownerId: 'CIT-8821',
    ownerEmail: 'citizen@kopargaon.gov.in',
    documentType: 'PermissionCertificate',
    fileType: 'application/pdf',
    isPrivate: true,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'KPG-DOC-301',
    title: 'Property Tax Official Payment Receipt 2026',
    ownerId: 'CIT-8821',
    ownerEmail: 'citizen@kopargaon.gov.in',
    documentType: 'TaxReceipt',
    fileType: 'application/pdf',
    isPrivate: true,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }
];

// ─── 9. NOTIFICATIONS COLLECTION ─────────────────────────────────────────────
let notifications = [
  {
    id: 'NOTIF-101',
    recipientRole: ROLES.CITIZEN,
    recipientId: 'CIT-8821',
    title: 'Complaint CMP1023 Status Updated',
    description: 'Your complaint CMP1023 (Street Light) has been marked Resolved.',
    relatedEntityType: 'Complaint',
    relatedEntityId: 'CMP1023',
    priority: COMPLAINT_PRIORITY.NORMAL,
    department: DEPARTMENTS.LIGHTING,
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: false,
    actionLink: '/citizen/track-complaint'
  }
];

// ─── 10. AI INSIGHTS & PREDICTIONS COLLECTION ───────────────────────────────
let aiInsights = [
  {
    id: 'INS-TRF-01',
    domain: 'Traffic',
    title: 'Station Road Peak Traffic Congestion',
    summary: 'High congestion risk detected at Station Road junction.',
    detail: 'Morning and evening rush hours experience 40% density increase.',
    confidence: 82,
    severity: 'high',
    hotspotWard: 4,
    basis: 'Time-of-day traffic sensor data SNS-TRF-01',
    recommendation: 'Deploy 2 traffic wardens during 08:00-10:00 AM.',
    generatedAt: new Date().toISOString(),
    label: 'ESTIMATED'
  },
  {
    id: 'INS-WST-01',
    domain: 'Garbage',
    title: 'Ward 4 Market Garbage Overflow Warning',
    summary: 'Sanitation bin level reaches 88% capacity.',
    detail: 'High bin telemetry reading requires immediate van dispatch.',
    confidence: 88,
    severity: 'critical',
    hotspotWard: 4,
    basis: 'IoT Sensor SNS-WST-01',
    recommendation: 'Deploy Compactor Truck MH-17-BC-4412 to clear market bin.',
    generatedAt: new Date().toISOString(),
    label: 'LIVE_TELEMETRY'
  }
];

// ─── 11. AUDIT & SECURITY LOGS COLLECTION ───────────────────────────────────
let auditLogs = [
  {
    id: 'AUD-9001',
    timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    user: { id: 'CIT-4410', name: 'Anil Kulkarni', role: ROLES.CITIZEN, department: 'Resident' },
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
    action: 'COMPLAINT_SUBMITTED',
    entityId: 'KPG-2026-0988',
    entityType: 'Complaint',
    status: 'SUCCESS',
    details: 'Pothole complaint registered in Ward 6.'
  }
];

// ─── UNIFIED DATA ACCESS API & HELPER METHODS ────────────────────────────────

export const dataStore = {
  // Users Repository
  users: {
    find: (predicate) => users.find(predicate),
    filter: (predicate) => users.filter(predicate),
    getAll: () => [...users],
    add: (newUser) => {
      users.unshift(newUser);
      return newUser;
    },
    update: (id, updates) => {
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        return users[idx];
      }
      return null;
    }
  },

  // Complaints Repository
  complaints: {
    find: (predicate) => complaints.find(predicate),
    filter: (predicate) => complaints.filter(predicate),
    getAll: () => [...complaints],
    add: (newComp) => {
      complaints.unshift(newComp);
      return newComp;
    },
    assignOfficer: (id, assignedOfficer, assignedTeamId, note, actorName, officerRole, department) => {
      const comp = complaints.find(c => c.id === id);
      if (comp) {
        comp.assignedOfficer = assignedOfficer || comp.assignedOfficer;
        comp.assignedOfficerId = assignedOfficer || comp.assignedOfficerId;
        if (assignedTeamId) comp.assignedTeamId = assignedTeamId;
        comp.status = COMPLAINT_STATUS.ASSIGNED;
        comp.timeline.push({
          id: `EVT-${Date.now()}`,
          status: COMPLAINT_STATUS.ASSIGNED,
          timestamp: new Date().toISOString(),
          actor: { name: actorName || 'Municipal Control Center', role: officerRole || ROLES.STAFF, department: department || comp.department },
          action: `Assigned to ${assignedOfficer || assignedTeamId || 'Field Squad'}`,
          note: note || `Maintenance team assigned: ${assignedOfficer || assignedTeamId}`
        });
        return comp;
      }
      return null;
    },
    updateStatus: (id, status, note, actorName, officerRole, department) => {
      const comp = complaints.find(c => c.id === id);
      if (comp) {
        comp.status = status;
        if ((status === COMPLAINT_STATUS.IN_PROGRESS || status === 'In Progress') && !comp.workStartedAt) {
          comp.workStartedAt = new Date().toISOString();
        }
        if (status === COMPLAINT_STATUS.RESOLVED || status === 'Resolved' || status === COMPLAINT_STATUS.COMPLETED || status === COMPLAINT_STATUS.CLOSED || status === 'Closed') {
          comp.completedAt = new Date().toISOString();
        }
        comp.timeline.push({
          id: `EVT-${Date.now()}`,
          status,
          timestamp: new Date().toISOString(),
          actor: { name: actorName, role: officerRole, department: department || comp.department },
          action: `Status modified to ${status}`,
          note: note || `Updated by ${actorName}`
        });
        return comp;
      }
      return null;
    }
  },

  // Permissions Repository
  permissions: {
    find: (predicate) => permissions.find(predicate),
    filter: (predicate) => permissions.filter(predicate),
    getAll: () => [...permissions],
    add: (newPerm) => {
      permissions.unshift(newPerm);
      return newPerm;
    }
  },

  // Taxes Repository
  taxes: {
    find: (predicate) => taxes.find(predicate),
    filter: (predicate) => taxes.filter(predicate),
    getAll: () => [...taxes],
    add: (newTax) => {
      taxes.unshift(newTax);
      return newTax;
    },
    processPayment: (id, paymentMethod) => {
      const tax = taxes.find(t => t.id === id);
      if (tax) {
        tax.status = 'Paid';
        tax.paidAt = new Date().toISOString();
        tax.paymentMethod = paymentMethod || 'UPI / NetBanking';
        tax.receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        return tax;
      }
      return null;
    }
  },

  // Infrastructure Assets Repository
  assets: {
    getAll: () => [...assets],
    find: (predicate) => assets.find(predicate)
  },

  // Sensors Repository
  sensors: {
    getAll: () => [...sensors],
    find: (predicate) => sensors.find(predicate)
  },

  // Teams Repository
  teams: {
    getAll: () => [...teams],
    find: (predicate) => teams.find(predicate)
  },

  // Notifications Repository
  notifications: {
    getAll: () => [...notifications],
    filter: (predicate) => notifications.filter(predicate),
    add: (newNotif) => {
      notifications.unshift(newNotif);
      return newNotif;
    }
  },

  // AI Insights Repository
  aiInsights: {
    getAll: () => [...aiInsights]
  },

  // Audit Logs Repository
  auditLogs: {
    getAll: () => [...auditLogs],
    add: (req, action, entityId, entityType, status = 'SUCCESS', details = '') => {
      const logEntry = {
        id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
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
      auditLogs.unshift(logEntry);
      return logEntry;
    }
  },

  // Private Documents Repository
  documents: {
    find: (predicate) => documents.find(predicate),
    getAll: () => [...documents]
  },

  // Aggregate City Overview Metrics
  getCityOverview: () => {
    const totalComplaints = complaints.length;
    const openComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.REPORTED || c.status === COMPLAINT_STATUS.PENDING || c.status === COMPLAINT_STATUS.ASSIGNED || c.status === COMPLAINT_STATUS.IN_PROGRESS).length;
    const resolvedComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED || c.status === COMPLAINT_STATUS.COMPLETED || c.status === COMPLAINT_STATUS.CLOSED).length;
    const escalatedComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.ESCALATED).length;
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

    return {
      totalCitizens: users.filter(u => u.role === ROLES.CITIZEN).length,
      totalStaff: users.filter(u => u.role === ROLES.STAFF || u.role === ROLES.ADMIN).length,
      totalAssets: assets.length,
      totalSensors: sensors.length,
      activeTeams: teams.filter(t => t.status === 'Deployed' || t.status === 'On Duty').length,
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
