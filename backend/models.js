import mongoose from 'mongoose';

// 1. User Model
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  aadhaar: String,
  district: String,
  city: String,
  ward: Number,
  address: String,
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  department: String,
  mfaEnabled: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
  officerId: String,
  badge: String
});

// 2. Complaint Model
const ComplaintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  citizenId: String,
  submittedBy: String,
  citizenEmail: String,
  category: String,
  title: String,
  description: String,
  department: String,
  priority: String,
  status: String,
  location: {
    address: String,
    ward: Number,
    latitude: Number,
    longitude: Number
  },
  imageUrl: String,
  supportingDocuments: [String],
  assignedOfficerId: String,
  assignedOfficer: String,
  assignedTeamId: String,
  submittedAt: { type: Date, default: Date.now },
  dueDate: Date,
  workStartedAt: Date,
  completedAt: Date,
  isEscalated: { type: Boolean, default: false },
  remarks: [String],
  timeline: [{
    id: String,
    status: String,
    timestamp: { type: Date, default: Date.now },
    actor: {
      id: String,
      name: String,
      role: String,
      department: String
    },
    action: String,
    note: String
  }]
});

// 3. Permission Model
const PermissionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  applicantId: String,
  applicantName: String,
  citizenEmail: String,
  permissionType: String,
  category: String,
  plotAreaSqFt: Number,
  location: {
    propertyAddress: String,
    ward: Number,
    propertyNumber: String,
    latitude: Number,
    longitude: Number
  },
  architectName: String,
  status: String,
  submittedAt: { type: Date, default: Date.now },
  dueDate: Date,
  inspectionDate: Date,
  approvedAt: Date,
  scrutinyFeeAmount: Number,
  scrutinyFeePaid: { type: Boolean, default: false },
  certificateNumber: String,
  certificateIssued: { type: Boolean, default: false },
  documentId: String,
  notes: String
});

// 4. Tax Model
const TaxSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  billNumber: String,
  citizenId: String,
  citizenName: String,
  citizenEmail: String,
  propertyNumber: String,
  location: {
    address: String,
    ward: Number,
    latitude: Number,
    longitude: Number
  },
  taxCategory: String,
  amount: Number,
  penalty: { type: Number, default: 0 },
  totalAmount: Number,
  status: String,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
  paymentMethod: String,
  receiptNumber: String,
  receiptDocId: String
});

// 5. Asset Model
const AssetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  category: String,
  department: String,
  location: {
    address: String,
    ward: Number,
    latitude: Number,
    longitude: Number
  },
  status: String,
  healthScore: Number,
  capacity: String,
  managedBy: String,
  lastInspectedAt: Date
});

// 6. Sensor Model
const SensorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  assetId: String,
  sensorType: String,
  location: {
    ward: Number,
    latitude: Number,
    longitude: Number,
    landmark: String
  },
  currentValue: Number,
  unit: String,
  status: String,
  lastReadingAt: { type: Date, default: Date.now },
  historicalReadings: [{
    timestamp: { type: Date, default: Date.now },
    value: Number
  }]
});

// Vehicle Subdocument Schema
const VehicleSchema = new mongoose.Schema({
  vehicleNumber: String,
  type: String,
  status: String
}, { _id: false });

// 7. Team Model
const TeamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  department: String,
  assignedWard: Number,
  leaderId: String,
  membersCount: Number,
  vehicles: [VehicleSchema],
  status: String,
  activeTicketsCount: { type: Number, default: 0 }
});

// 8. Notification Model
const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  recipientRole: String,
  recipientId: String,
  title: String,
  description: String,
  relatedEntityType: String,
  relatedEntityId: String,
  priority: String,
  department: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  actionLink: String
});

// 9. AI Insight Model
const AiInsightSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  domain: String,
  title: String,
  summary: String,
  detail: String,
  confidence: Number,
  severity: String,
  hotspotWard: Number,
  basis: String,
  recommendation: String,
  generatedAt: { type: Date, default: Date.now },
  label: String
});

// 10. Audit Log Model
const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  user: {
    id: String,
    name: String,
    role: String,
    department: String
  },
  ipAddress: String,
  userAgent: String,
  action: String,
  entityId: String,
  entityType: String,
  status: String,
  details: String
});

// 11. Document Model
const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  ownerId: String,
  ownerEmail: String,
  documentType: String,
  fileType: String,
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
export const Complaint = mongoose.model('Complaint', ComplaintSchema);
export const Permission = mongoose.model('Permission', PermissionSchema);
export const Tax = mongoose.model('Tax', TaxSchema);
export const Asset = mongoose.model('Asset', AssetSchema);
export const Sensor = mongoose.model('Sensor', SensorSchema);
export const Team = mongoose.model('Team', TeamSchema);
export const Notification = mongoose.model('Notification', NotificationSchema);
export const AiInsight = mongoose.model('AiInsight', AiInsightSchema);
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
export const Document = mongoose.model('Document', DocumentSchema);
