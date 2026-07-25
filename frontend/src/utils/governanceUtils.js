/**
 * Governance, Permission & Tax SLA Utilities for Kopargaon Municipal Platform
 */

// 1. Permission Categories & Supported Types
export const PERMISSION_CATEGORIES = {
  Residential: [
    'New House Construction',
    'House Extension',
    'Renovation',
    'Demolition Permission',
    'Boundary Wall Permission'
  ],
  Commercial: [
    'Shop Construction',
    'Commercial Building Permission',
    'Office Construction',
    'Mall / Complex Construction',
    'Warehouse Construction'
  ],
  Business: [
    'New Business Registration',
    'Shop License',
    'Trade License',
    'Food Business Permission',
    'Street Vendor Permission',
    'Hawker License',
    'Industrial Permission'
  ],
  PublicInfrastructure: [
    'Road Excavation Permission',
    'Drainage Connection',
    'Water Connection',
    'Sewer Connection',
    'Electric Utility Coordination',
    'Telecom Cable Laying',
    'Public Event Permission'
  ],
  Temporary: [
    'Festival Permission',
    'Public Gathering',
    'Exhibition',
    'Advertising Hoardings',
    'Temporary Structures',
    'Procession Permission'
  ]
};

// Required documents mapping per permission category
export const REQUIRED_DOCUMENTS = {
  Residential: ['Property Ownership Deed (7/12 Extract)', 'Identity Proof (Aadhaar/PAN)', 'Architectural Layout Plan', 'NOC from Neighbors'],
  Commercial: ['Commercial Property Deed', 'Identity Proof (Aadhaar/PAN)', 'Structural Safety Certificate', 'Fire Safety NOC', 'Building Blueprint'],
  Business: ['Business Registration Certificate', 'Identity Proof', 'Premises Lease/Ownership Deed', 'Food Safety FSSAI (if food business)', 'GST Registration'],
  PublicInfrastructure: ['Work Order Copy', 'Utility Map Diagram', 'Traffic NOC', 'Contractor License', 'Security Deposit Receipt'],
  Temporary: ['Police Department NOC', 'Fire Brigade Clearance', 'Event Grounds Approval', 'Identity Proof of Organizer', 'Emergency Medical Plan']
};

// 2. Municipal Tax Categories & Base Rates
export const TAX_CATEGORIES = [
  'Property Tax',
  'Water Tax',
  'Drainage Tax',
  'Solid Waste Management Charges',
  'Trade License Fees',
  'Building Permission Fees',
  'Advertisement Tax',
  'Market Fees',
  'Parking Fees',
  'Business License Renewal',
  'Rental Property Tax',
  'Other Municipal Charges'
];

// Calculate 3 working days SLA target from submission date
export const calculateSLADueDate = (submittedAtIso) => {
  const submitDate = new Date(submittedAtIso || Date.now());
  // 3 working days (72 hours default for municipal governance)
  const dueDate = new Date(submitDate.getTime() + (72 * 60 * 60 * 1000));
  return dueDate.toISOString();
};

// Calculate detailed SLA status for countdown rendering
export const getSLAStatus = (submittedAtIso, dueDateIso, currentStatus) => {
  if (currentStatus === 'Completed' || currentStatus === 'Resolved' || currentStatus === 'Approved') {
    return {
      statusText: 'Resolved within SLA',
      isOverdue: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      badgeColor: 'green'
    };
  }

  const now = new Date();
  const due = new Date(dueDateIso || calculateSLADueDate(submittedAtIso));
  const diffMs = due.getTime() - now.getTime();

  if (diffMs <= 0) {
    const overdueMs = Math.abs(diffMs);
    const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor((overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return {
      statusText: `OVERDUE: ${overdueDays > 0 ? `${overdueDays}d ` : ''}${overdueHours}h overdue`,
      isOverdue: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      overdueDays,
      overdueHours,
      badgeColor: 'red'
    };
  } else {
    const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let color = 'green';
    if (remainingDays === 0 && remainingHours < 24) {
      color = 'yellow';
    }
    return {
      statusText: `${remainingDays > 0 ? `${remainingDays}d ` : ''}${remainingHours}h remaining`,
      isOverdue: false,
      daysRemaining: remainingDays,
      hoursRemaining: remainingHours,
      badgeColor: color
    };
  }
};

// Mask Citizen Name for Public Privacy compliance
export const maskCitizenName = (name) => {
  if (!name) return 'Resident Citizen';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0) + '***';
  return `${parts[0]} ${parts[1].charAt(0)}.`;
};

// Generate Audit Log Schema
export const createAuditLog = (user, action, entityId, entityType, previousValue, newValue) => {
  return {
    id: `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString(),
    user: {
      name: user?.name || 'Municipal Officer',
      role: user?.role || 'Municipal Officer',
      department: user?.department || 'Administration'
    },
    ipAddress: '192.168.1.104 (Municipal Network)',
    action,
    entityId,
    entityType,
    previousValue: previousValue || null,
    newValue: newValue || null
  };
};

// Generate Notification Schema
export const createNotification = (recipientRole, title, description, complaintId = null, priority = 'Normal', department = 'General') => {
  return {
    id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    recipientRole, // 'officer' | 'citizen' | 'higher_authority'
    title,
    description,
    complaintId,
    priority,
    department,
    timestamp: new Date().toISOString(),
    read: false,
    actionLink: recipientRole === 'citizen' ? '/citizen/dashboard' : '/municipality/dashboard'
  };
};
