import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { dataStore, ROLES, COMPLAINT_STATUS } from './dataStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'kpg_enterprise_smart_city_sec_jwt_key_2026_prod';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'kpg_secure_http_only_cookie_secret_99421';
const IS_PROD = process.env.NODE_ENV === 'production';

// 1. Production Security Headers & Helmet Configuration
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 2. Cookie Parser
app.use(cookieParser(COOKIE_SECRET));

// 3. CORS Configuration
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiting Middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Rate limit exceeded. Please slow down.' }
});

app.use('/api/', apiLimiter);

// Input Sanitization Helper
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
};

const sanitizeInput = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeInput);
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      sanitized[key] = sanitizeString(val);
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizeInput(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
};

// Memory store for active OTP / MFA challenges
let otpStore = {};
let mfaStore = {};

// ─── REAL-TIME SERVER-SENT EVENTS (SSE) ENGINE ────────────────────────────────
let sseClients = [];

export const broadcastEvent = (eventType, payload) => {
  const data = JSON.stringify({
    type: eventType,
    payload,
    timestamp: new Date().toISOString()
  });

  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${data}\n\n`);
    } catch (err) {
      // Ignore socket write errors
    }
  });
};

app.get('/api/events/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.flushHeaders();

  const clientId = `CLIENT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  const connectedMsg = JSON.stringify({
    type: 'CONNECTED',
    payload: { clientId, activeClients: sseClients.length },
    timestamp: new Date().toISOString()
  });
  res.write(`data: ${connectedMsg}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// Token & Cookie Helpers
const setSessionCookie = (res, token) => {
  res.cookie('kpg_session', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
};

const clearSessionCookie = (res) => {
  res.cookie('kpg_session', '', {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 0
  });
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  let token = req.cookies?.kpg_session;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please log in to continue.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Session expired or invalid token. Please log in again.' });
  }
};

// RBAC Middleware
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      dataStore.auditLogs.add(req, 'ROLE_ACCESS_DENIED', 'N/A', 'RBAC', 'DENIED', `User role '${req.user.role}' attempted restricted resource requiring [${allowedRoles.join(', ')}].`);
      return res.status(403).json({
        success: false,
        error: 'Access Denied: You do not have sufficient permissions to perform this operation.',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }
    next();
  };
};

// ─── 5. UNIFIED DATA ARCHITECTURE ENDPOINTS ──────────────────────────────────

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Kopargaon Enterprise Governance Data Engine',
    securityMode: 'Bcrypt + HTTP-Only Cookies + Rate Limiting + Real-Time SSE Stream',
    activeSSEClients: sseClients.length,
    timestamp: new Date().toISOString()
  });
});

// Single Source of Truth Overview Metrics
app.get('/api/data/overview', (req, res) => {
  res.json({ success: true, data: dataStore.getCityOverview() });
});

// Infrastructure & Assets Endpoint
app.get('/api/infrastructure/assets', (req, res) => {
  res.json({ success: true, count: dataStore.assets.getAll().length, data: dataStore.assets.getAll() });
});

// Sensors & Telemetry Endpoint
app.get('/api/sensors/live', (req, res) => {
  res.json({ success: true, count: dataStore.sensors.getAll().length, data: dataStore.sensors.getAll() });
});

// Municipal Response Teams Endpoint
app.get('/api/teams', (req, res) => {
  res.json({ success: true, count: dataStore.teams.getAll().length, data: dataStore.teams.getAll() });
});

// AI Insights & Predictions Endpoint
app.get('/api/ai/insights', (req, res) => {
  res.json({ success: true, count: dataStore.aiInsights.getAll().length, data: dataStore.aiInsights.getAll() });
});

// Optional/Flexible Auth middleware for AI Query endpoint
const optionalAuthenticate = (req, res, next) => {
  let token = req.cookies?.kpg_session;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      req.user = null;
    }
  }
  next();
};

// Grounded AI Query & Data Analytics Assistant Endpoint (Powered by Google Gemini + Real Data)
app.post('/api/ai/query', optionalAuthenticate, async (req, res) => {
  const { query, imageBase64, imageMimeType, language } = req.body;
  const user = req.user || { role: ROLES.CITIZEN, id: 'CIT-GUEST', name: 'Citizen Resident' };
  const userRole = user.role || ROLES.CITIZEN;

  // 1. Fetch Real Data Collections from Single Source of Truth dataStore
  const allComplaints = dataStore.complaints.getAll();
  const allAssets = dataStore.assets.getAll();
  const allSensors = dataStore.sensors.getAll();

  const totalCount = allComplaints.length;
  const nowMs = Date.now();

  const openComplaints = allComplaints.filter(c => 
    c.status !== COMPLAINT_STATUS.RESOLVED && 
    c.status !== COMPLAINT_STATUS.COMPLETED && 
    c.status !== COMPLAINT_STATUS.CLOSED
  );

  const resolvedComplaints = allComplaints.filter(c => 
    c.status === COMPLAINT_STATUS.RESOLVED || 
    c.status === COMPLAINT_STATUS.COMPLETED || 
    c.status === COMPLAINT_STATUS.CLOSED
  );

  const escalatedComplaints = allComplaints.filter(c => c.isEscalated || c.status === 'Escalated');

  const slaBreachedComplaints = openComplaints.filter(c => {
    if (!c.dueDate) return false;
    return new Date(c.dueDate).getTime() < nowMs;
  });

  // Ward Analytics (Unresolved complaints per ward)
  const wardOpenMap = {};
  const wardTotalMap = {};
  openComplaints.forEach(c => {
    const w = c.location?.ward || c.ward || 1;
    wardOpenMap[w] = (wardOpenMap[w] || 0) + 1;
  });
  allComplaints.forEach(c => {
    const w = c.location?.ward || c.ward || 1;
    wardTotalMap[w] = (wardTotalMap[w] || 0) + 1;
  });

  const sortedWards = Object.keys(wardOpenMap).sort((a, b) => wardOpenMap[b] - wardOpenMap[a]);
  const topHotspotWard = sortedWards[0] || null;
  const hotspotCount = topHotspotWard ? wardOpenMap[topHotspotWard] : 0;

  // Category Analytics (Most common problems)
  const categoryOpenMap = {};
  const categoryTotalMap = {};
  allComplaints.forEach(c => {
    const cat = c.category || 'General';
    categoryTotalMap[cat] = (categoryTotalMap[cat] || 0) + 1;
    if (c.status !== COMPLAINT_STATUS.RESOLVED && c.status !== COMPLAINT_STATUS.COMPLETED && c.status !== COMPLAINT_STATUS.CLOSED) {
      categoryOpenMap[cat] = (categoryOpenMap[cat] || 0) + 1;
    }
  });
  const sortedCategories = Object.keys(categoryTotalMap).sort((a, b) => categoryTotalMap[b] - categoryTotalMap[a]);

  // Repeated Complaint Clusters (Ward + Category combination with >1 complaint)
  const clusterMap = {};
  allComplaints.forEach(c => {
    const w = c.location?.ward || c.ward || 1;
    const cat = c.category || 'General';
    const key = `Ward ${w} - ${cat}`;
    clusterMap[key] = (clusterMap[key] || 0) + 1;
  });
  const repeatedClusters = Object.entries(clusterMap)
    .filter(([k, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  // Urgent & Emergency Incidents
  const urgentIncidents = openComplaints.filter(c => 
    c.priority === 'Emergency' || 
    c.priority === 'High' || 
    c.isEscalated ||
    (c.dueDate && new Date(c.dueDate).getTime() < nowMs)
  );

  // Time Trends (Recent vs Older)
  const cutoff48h = nowMs - 48 * 3600 * 1000;
  const recentSubmissions = allComplaints.filter(c => new Date(c.submittedAt || c.createdAt).getTime() >= cutoff48h);
  const olderSubmissions = allComplaints.filter(c => new Date(c.submittedAt || c.createdAt).getTime() < cutoff48h);

  // Process Query Intent & Build Fact-Grounded Response
  const qLower = (query || '').toLowerCase().trim();
  let responseText = '';

  if (qLower.match(/^(hi|hii|hiii|hello|hey|namaste|namaskar|good morning|good evening|good afternoon)/i) || qLower.includes('who are you') || qLower.includes('what can you do') || qLower.includes('give me the reply') || qLower.includes('how are you')) {
    responseText = `👋 **Hello! Welcome to Kopargaon Smart City AI Assistant.**\n\nI am your AI Governance Assistant connected to the live Kopargaon Municipal Council database.\n\nHere are some questions you can ask me:\n• 📍 **"Which areas have the most unresolved complaints?"**\n• 🚨 **"Which incidents need urgent attention?"**\n• 📊 **"What are the most common problems?"**\n• 🏛 **"How to apply for a building permit?"**\n• 💳 **"How do I pay property tax?"**\n\nHow can I help you today?`;
  } else if (totalCount === 0) {
    responseText = `📊 **REAL DATABASE FACTS:**\nCurrently, there are no registered complaint records in the Kopargaon municipal database.\n\n🤖 **AI RECOMMENDATION:**\nMaintain proactive monitoring across all 28 wards.`;
  } else if (qLower.includes('unresolved') || qLower.includes('area') || qLower.includes('ward') || qLower.includes('most complaint')) {
    const wardListStr = sortedWards.slice(0, 5).map(w => `• **Ward ${w}**: ${wardOpenMap[w]} unresolved complaint(s)`).join('\n');
    
    responseText = `📊 **REAL DATABASE FACTS (Unresolved Complaints by Area):**\n` +
      `• Total Unresolved Complaints in Kopargaon: **${openComplaints.length}** out of ${totalCount} total tickets.\n` +
      `• Top Affected Wards:\n${wardListStr || 'None'}\n\n` +
      `🤖 **AI GOVERNANCE RECOMMENDATIONS:**\n` +
      `1. **Priority Deployment**: Reallocate Ward Inspection Officers to **Ward ${topHotspotWard || 1}** which holds the highest concentration of unresolved issues (${hotspotCount} open).\n` +
      `2. **Resource Alignment**: Coordinate sanitation and PWD teams for a multi-department sweep in Ward ${topHotspotWard || 1}.\n\n` +
      `🔒 *Data Context: Grounded in live Kopargaon dataStore records. User Role: ${userRole.toUpperCase()}.*`;

  } else if (qLower.includes('common') || qLower.includes('category') || qLower.includes('problem') || qLower.includes('type')) {
    const catListStr = sortedCategories.map(cat => `• **${cat}**: ${categoryTotalMap[cat]} total (${categoryOpenMap[cat] || 0} unresolved)`).join('\n');

    responseText = `📊 **REAL DATABASE FACTS (Most Common Problems):**\n` +
      `• Complaint Categories Ranked by Frequency:\n${catListStr}\n\n` +
      `🤖 **AI GOVERNANCE RECOMMENDATIONS:**\n` +
      `1. **Capacity Adjustment**: The primary complaint category is **"${sortedCategories[0]}"** (${categoryTotalMap[sortedCategories[0]]} tickets). Increase squad capacity for this sector.\n` +
      `2. **Preventive Maintenance**: Procure spare materials targeted specifically at ${sortedCategories[0]} infrastructure.\n\n` +
      `🔒 *Data Context: Grounded in live Kopargaon dataStore records.*`;

  } else if (qLower.includes('urgent') || qLower.includes('emergency') || qLower.includes('attention') || qLower.includes('priority')) {
    const urgentListStr = urgentIncidents.map(u => 
      `• **Ticket #${u.id}** (${u.category}): ${u.title} — Ward ${u.location?.ward || u.ward} [Priority: ${u.priority}, Status: ${u.status}]`
    ).join('\n');

    responseText = `📊 **REAL DATABASE FACTS (Incidents Needing Urgent Attention):**\n` +
      `• Total Urgent / SLA Breached / Escalated Incidents: **${urgentIncidents.length}**\n` +
      `${urgentListStr || '• No urgent or SLA breached tickets currently.'}\n\n` +
      `🤖 **AI GOVERNANCE RECOMMENDATIONS:**\n` +
      `${urgentIncidents.length > 0 
        ? `1. **Immediate Field Dispatch**: Assign executive field engineers to Ticket #${urgentIncidents[0].id} (${urgentIncidents[0].category} in Ward ${urgentIncidents[0].location?.ward || urgentIncidents[0].ward}).\n2. **SLA Rescue**: Dispatch emergency teams to clear all ${slaBreachedComplaints.length} SLA-breached tickets.`
        : '1. Maintain routine monitoring. All active tickets are currently operating within SLA limits.'}\n\n` +
      `🔒 *Data Context: Grounded in live Kopargaon dataStore records.*`;

  } else if (qLower.includes('repeat') || qLower.includes('recur') || qLower.includes('frequent') || qLower.includes('cluster')) {
    const clusterStr = repeatedClusters.map(([cluster, count]) => `• **${cluster}**: ${count} repeated incidents`).join('\n');

    responseText = `📊 **REAL DATABASE FACTS (Repeated / Recurring Incidents):**\n` +
      `${repeatedClusters.length > 0 
        ? `The following geographic & category clusters have experienced repeated failures:\n${clusterStr}` 
        : '• No repeated complaint clusters detected across wards.'}\n\n` +
      `🤖 **AI GOVERNANCE RECOMMENDATIONS:**\n` +
      `${repeatedClusters.length > 0 
        ? `1. **Root-Cause Investigation**: Conduct structural engineering audit on **${repeatedClusters[0][0]}** to replace failing infrastructure rather than patching symptoms.\n2. **IoT Telemetry**: Deploy telemetry sensors at ${repeatedClusters[0][0]} for automated failure detection.` 
        : '1. Continue standard maintenance protocols.'}\n\n` +
      `🔒 *Data Context: Grounded in live Kopargaon dataStore records.*`;

  } else if (qLower.includes('trend') || qLower.includes('increase') || qLower.includes('decrease') || qLower.includes('rate')) {
    responseText = `📊 **REAL DATABASE FACTS (Submission & Resolution Trends):**\n` +
      `• **Recent Submissions (Last 48 Hours)**: ${recentSubmissions.length} new complaint(s)\n` +
      `• **Older Submissions**: ${olderSubmissions.length} complaint(s)\n` +
      `• **Overall Resolution Rate**: ${Math.round((resolvedComplaints.length / Math.max(1, totalCount)) * 100)}% (${resolvedComplaints.length} resolved out of ${totalCount})\n` +
      `• **Active SLA Breaches**: ${slaBreachedComplaints.length} overdue ticket(s)\n\n` +
      `🤖 **AI GOVERNANCE RECOMMENDATIONS:**\n` +
      `1. **Trend Analysis**: ${recentSubmissions.length > olderSubmissions.length ? 'Submissions are INCREASING recently — increase triage velocity.' : 'Submission rate is STABLE.'}\n` +
      `2. **Resolution Target**: Elevate overall resolution rate from ${Math.round((resolvedComplaints.length / Math.max(1, totalCount)) * 100)}% to target 85%+.\n\n` +
      `🔒 *Data Context: Grounded in live Kopargaon dataStore records.*`;

  } else {
    const topWardStr = topHotspotWard ? `Ward ${topHotspotWard} (${hotspotCount} open)` : 'None';
    const topCatStr = sortedCategories[0] ? `"${sortedCategories[0]}" (${categoryOpenMap[sortedCategories[0]] || 0} open)` : 'None';

    responseText = `📊 **REAL DATABASE FACTS (Kopargaon Smart City Overview):**\n` +
      `• **Total Registered Tickets**: ${totalCount}\n` +
      `• **Unresolved Complaints**: ${openComplaints.length}\n` +
      `• **Resolved Complaints**: ${resolvedComplaints.length} (${Math.round((resolvedComplaints.length / Math.max(1, totalCount)) * 100)}% resolution rate)\n` +
      `• **Highest Unresolved Ward**: ${topWardStr}\n` +
      `• **Primary Problem Category**: ${topCatStr}\n` +
      `• **Urgent / SLA Breached Tickets**: ${urgentIncidents.length}\n\n` +
      `🤖 **AI GOVERNANCE RECOMMENDATIONS:**\n` +
      `1. **Focus Ward ${topHotspotWard || 1}**: Priority allocation of field teams to clear ${hotspotCount} unresolved issues.\n` +
      `2. **Target ${sortedCategories[0] || 'Sanitation'}**: Reallocate 2 maintenance units to address category backlog.\n` +
      `3. **Clear Urgent Tickets**: Address ${urgentIncidents.length} priority ticket(s) immediately.\n\n` +
      `🔒 *Data Access Level: ${userRole.toUpperCase()} — Fully Grounded in Kopargaon Single Source Database.*`;
  }

  // 2. Google Gemini Generative AI Execution with Live Grounded Context
  let finalResponseText = responseText;
  let responseSource = 'grounded-engine';

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const isGeminiAvailable = Boolean(
    geminiApiKey &&
    geminiApiKey.trim() !== '' &&
    geminiApiKey !== 'xyz' &&
    geminiApiKey !== 'YOUR_GEMINI_API_KEY'
  );

  if (isGeminiAvailable && query) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey.trim());
      
      const candidateModels = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.7-flash'];
      const langMap = { mr: 'Marathi (मराठी)', hi: 'Hindi (हिन्दी)', en: 'English' };
      const requestedLang = langMap[language] || 'English';

      const promptContext = `You are a helpful, conversational AI Assistant for Kopargaon Smart City / Municipal Council (कोपरगाव नगर परिषद), Maharashtra, India.

CRITICAL RULES:
1. Speak naturally, directly, concisely, and helpfully in ${requestedLang}.
2. NEVER output repetitive lists of services or menus (NEVER say "Welcome to the Citizen Portal", NEVER output lists like "* Report a Civic Issue...", "* Track Complaint Status...", "* Municipal Information...", etc.).
3. When the user says "help me", "hi", "hey", or asks for help, reply with a simple, friendly 1-2 sentence conversational response asking what specific question or issue they have.
4. When the user asks a specific question (e.g. about water, property tax, building permits, or complaints), answer that specific question directly and clearly without extra filler or unsolicited menus.
5. Only provide database statistics (complaint counts, ward numbers, resolution rates) if the user explicitly asks for them.

DATABASE REFERENCE (Use ONLY if the user specifically asks for statistics or reports):
- Total Registered Tickets: ${totalCount}
- Open Complaints: ${openComplaints.length}
- Resolved Complaints: ${resolvedComplaints.length} (${Math.round((resolvedComplaints.length / Math.max(1, totalCount)) * 100)}%)
- SLA Breached: ${slaBreachedComplaints.length}
- Hotspot Ward: Ward ${topHotspotWard || 1} (${hotspotCount} open)
- Primary Categories: ${sortedCategories.slice(0, 4).map(c => `${c} (${categoryTotalMap[c]} total, ${categoryOpenMap[c] || 0} open)`).join(', ')}
- Urgent Tickets: ${urgentIncidents.length}`;

      const promptParts = [promptContext, `\nUser Question: ${query}`];

      if (imageBase64) {
        promptParts.push({
          inlineData: {
            data: imageBase64,
            mimeType: imageMimeType || 'image/jpeg'
          }
        });
      }

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(promptParts);
          const geminiRes = await result.response;
          const text = geminiRes.text();
          if (text && text.trim()) {
            finalResponseText = text.trim();
            responseSource = `gemini (${modelName})`;
            break;
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} attempt note:`, modelErr.message);
        }
      }
    } catch (err) {
      console.warn('Gemini API call error (falling back to grounded telemetry engine):', err.message);
    }
  }

  // Safe Audit Log Execution
  dataStore.auditLogs.add(
    req,
    'AI_QUERY_EXECUTED',
    'AI_ENGINE',
    'DataAnalytics',
    'SUCCESS',
    `Grounded AI query evaluated for role '${userRole}' on ${totalCount} records (source: ${responseSource}).`
  );

  res.json({
    success: true,
    query: query,
    userRole: userRole,
    responseText: finalResponseText,
    source: responseSource,
    dataSummary: {
      totalComplaints: totalCount,
      openComplaints: openComplaints.length,
      resolvedComplaints: resolvedComplaints.length,
      slaBreaches: slaBreachedComplaints.length,
      topHotspotWard: topHotspotWard,
      topCategory: sortedCategories[0] || null
    },
    timestamp: new Date().toISOString()
  });
});

// ─── 6. AUTHENTICATION & IDENTITY ENDPOINTS ─────────────────────────────────

// OTP Send
app.post('/api/auth/otp/send', authLimiter, (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, error: 'Email or Mobile number is required.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  otpStore[identifier.trim().toLowerCase()] = { code, expiresAt, verified: false };

  res.json({
    success: true,
    message: `6-digit Verification OTP sent to ${identifier}.`,
    demoOtp: code
  });
});

// OTP Verify
app.post('/api/auth/otp/verify', (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) {
    return res.status(400).json({ success: false, error: 'Identifier and OTP are required.' });
  }

  const key = identifier.trim().toLowerCase();
  const record = otpStore[key];

  if (!record || record.code !== otp.trim()) {
    return res.status(400).json({ success: false, error: 'Invalid Verification OTP.' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[key];
    return res.status(400).json({ success: false, error: 'Verification OTP has expired. Please request a new one.' });
  }

  record.verified = true;
  res.json({ success: true, message: 'Identity verified successfully!' });
});

// Citizen Registration
app.post('/api/citizens/register', authLimiter, (req, res) => {
  const sanitized = sanitizeInput(req.body);
  const { fullName, email, mobile, aadhaar, district, city, wardNumber, address, password } = sanitized;

  const normDist = (district || '').trim().toLowerCase();
  if (!normDist.includes('ahilyanagar') && !normDist.includes('ahmednagar')) {
    return res.status(400).json({ success: false, error: 'Registration rejected: District must be Ahilyanagar (Ahmednagar).' });
  }

  const normCity = (city || '').trim().toLowerCase();
  if (!normCity.includes('kopargaon')) {
    return res.status(400).json({ success: false, error: 'Registration rejected: City must be Kopargaon.' });
  }

  const cleanAadhaar = (aadhaar || '').replace(/\D/g, '');
  if (cleanAadhaar.length !== 12) {
    return res.status(400).json({ success: false, error: 'Invalid Aadhaar: Exactly 12 numeric digits required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const exists = dataStore.users.find(u => u.email === cleanEmail || (u.aadhaar && u.aadhaar.replace(/\D/g, '') === cleanAadhaar));
  if (exists) {
    return res.status(409).json({ success: false, error: 'An account already exists with this Email or Aadhaar Number.' });
  }

  const formattedAadhaar = `${cleanAadhaar.slice(0,4)}-${cleanAadhaar.slice(4,8)}-${cleanAadhaar.slice(8,12)}`;
  const passwordHash = bcrypt.hashSync(password, 10);

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
    passwordHash: passwordHash,
    role: ROLES.CITIZEN,
    department: 'Resident',
    mfaEnabled: false,
    registeredAt: new Date().toISOString()
  };

  dataStore.users.add(newCitizen);

  const token = jwt.sign(
    { id: newCitizen.id, email: newCitizen.email, role: ROLES.CITIZEN, name: newCitizen.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  setSessionCookie(res, token);
  dataStore.auditLogs.add(
    { user: { id: newCitizen.id, name: newCitizen.name, role: ROLES.CITIZEN }, headers: req.headers, socket: req.socket },
    'CITIZEN_REGISTER_SUCCESS',
    newCitizen.id,
    'UserAccount',
    'SUCCESS',
    `Registered new citizen ${newCitizen.name} (${newCitizen.email})`
  );

  const userSafe = { ...newCitizen };
  delete userSafe.passwordHash;

  res.status(201).json({ success: true, user: userSafe, token });
});

// Citizen Login
app.post('/api/citizens/login', authLimiter, (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'Email/Aadhaar and password required.' });
  }

  const cleanInput = identifier.trim().toLowerCase();
  const cleanDigits = identifier.replace(/\D/g, '');

  const user = dataStore.users.find(u => {
    if (u.role !== ROLES.CITIZEN) return false;
    const matchEmail = u.email && u.email.toLowerCase() === cleanInput;
    const matchAadhaar = u.aadhaar && u.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;
    return matchEmail || matchAadhaar;
  });

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    dataStore.auditLogs.add(req, 'LOGIN_FAILURE', identifier, 'CitizenAuth', 'FAILURE', 'Invalid credentials provided.');
    return res.status(401).json({ success: false, error: 'Invalid Email/Aadhaar or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: ROLES.CITIZEN, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  setSessionCookie(res, token);
  dataStore.auditLogs.add(req, 'LOGIN_SUCCESS', user.id, 'CitizenAuth', 'SUCCESS', `Citizen logged in: ${user.name}`);

  const userSafe = { ...user };
  delete userSafe.passwordHash;

  res.json({ success: true, user: userSafe, token });
});

// Officer & Admin Login (Triggers MFA Challenge)
app.post('/api/officers/login', authLimiter, (req, res) => {
  const { officerId, password } = req.body;
  if (!officerId || !password) {
    return res.status(400).json({ success: false, error: 'Officer ID and Password are required.' });
  }

  const cleanId = officerId.trim().toLowerCase();
  const user = dataStore.users.find(u => (u.role === ROLES.STAFF || u.role === ROLES.ADMIN) && u.officerId && u.officerId.toLowerCase() === cleanId);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    dataStore.auditLogs.add(req, 'OFFICER_LOGIN_FAILURE', officerId, 'OfficerAuth', 'FAILURE', 'Invalid officer credentials.');
    return res.status(401).json({ success: false, error: 'Invalid Officer ID or Access Password.' });
  }

  const mfaToken = `MFA-TOK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
  mfaStore[mfaToken] = { userId: user.id, code: mfaCode, expiresAt: Date.now() + 5 * 60 * 1000 };

  dataStore.auditLogs.add(req, 'MFA_CHALLENGE_ISSUED', user.id, 'OfficerAuth', 'PENDING', `MFA challenge generated for ${user.role} (${user.name})`);

  res.json({
    success: true,
    mfaRequired: true,
    mfaToken,
    message: 'Authentication phase 1 successful. Mandatory 2FA OTP code required.',
    demoMfaCode: mfaCode
  });
});

// MFA Verification
app.post('/api/auth/mfa/verify', authLimiter, (req, res) => {
  const { mfaToken, mfaCode } = req.body;
  if (!mfaToken || !mfaCode) {
    return res.status(400).json({ success: false, error: 'MFA Token and 6-digit OTP code are required.' });
  }

  const challenge = mfaStore[mfaToken];
  if (!challenge || challenge.code !== mfaCode.trim()) {
    return res.status(400).json({ success: false, error: 'Invalid 2FA Verification Code.' });
  }

  if (Date.now() > challenge.expiresAt) {
    delete mfaStore[mfaToken];
    return res.status(400).json({ success: false, error: '2FA Verification Code expired. Please sign in again.' });
  }

  const user = dataStore.users.find(u => u.id === challenge.userId);
  delete mfaStore[mfaToken];

  if (!user) {
    return res.status(404).json({ success: false, error: 'Officer profile not found.' });
  }

  const token = jwt.sign(
    { id: user.id, officerId: user.officerId, email: user.email, role: user.role, name: user.name, department: user.department },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  setSessionCookie(res, token);
  req.user = jwt.decode(token);
  dataStore.auditLogs.add(req, 'MFA_VERIFIED_LOGIN_SUCCESS', user.id, 'OfficerAuth', 'SUCCESS', `2FA verified login for ${user.role}: ${user.name}`);

  const userSafe = { ...user };
  delete userSafe.passwordHash;

  res.json({ success: true, user: userSafe, token });
});

// Authenticated User Endpoint
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = dataStore.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User profile not found.' });
  const userSafe = { ...user };
  delete userSafe.passwordHash;
  res.json({ success: true, user: userSafe });
});

// Citizen Profile Update
app.put('/api/citizens/profile', authenticateToken, (req, res) => {
  const sanitized = sanitizeInput(req.body);
  const updated = dataStore.users.update(req.user.id, {
    name: sanitized.name || sanitized.fullName,
    phone: sanitized.phone || sanitized.mobile,
    ward: sanitized.ward !== undefined ? parseInt(sanitized.ward) : undefined,
    address: sanitized.address
  });

  if (!updated) return res.status(404).json({ success: false, error: 'User profile not found.' });

  dataStore.auditLogs.add(req, 'PROFILE_UPDATED', req.user.id, 'UserAccount', 'SUCCESS', `Updated profile for ${req.user.name}`);
  const userSafe = { ...updated };
  delete userSafe.passwordHash;
  res.json({ success: true, user: userSafe });
});

// Password Reset
app.post('/api/citizens/reset-password', authLimiter, (req, res) => {
  const { identifier, newPassword } = req.body;
  if (!identifier || !newPassword) return res.status(400).json({ success: false, error: 'Identifier and new password required.' });

  const cleanInput = identifier.trim().toLowerCase();
  const cleanDigits = identifier.replace(/\D/g, '');

  const user = dataStore.users.find(u => {
    const matchEmail = u.email && u.email.toLowerCase() === cleanInput;
    const matchAadhaar = u.aadhaar && u.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;
    return matchEmail || matchAadhaar;
  });

  if (!user) return res.status(404).json({ success: false, error: 'No citizen account found.' });
  if (newPassword.length < 6) return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });

  dataStore.users.update(user.id, { passwordHash: bcrypt.hashSync(newPassword, 10) });
  dataStore.auditLogs.add({ user: { id: user.id, name: user.name, role: user.role }, headers: req.headers, socket: req.socket }, 'PASSWORD_RESET_SUCCESS', user.id, 'UserAccount', 'SUCCESS', `Password reset for ${user.email}`);

  res.json({ success: true, message: 'Password updated successfully.' });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ─── 7. PROTECTED RESOURCE ENDPOINTS ────────────────────────────────────────

// Complaints Endpoint
app.get('/api/complaints', authenticateToken, (req, res) => {
  let list = dataStore.complaints.getAll();

  if (req.user.role === ROLES.CITIZEN) {
    list = list.filter(c => c.citizenId === req.user.id || c.citizenEmail === req.user.email);
  } else if (req.user.role === ROLES.STAFF) {
    if (req.user.department && req.user.department !== 'Municipal Headquarters') {
      list = list.filter(c => c.department === req.user.department || c.assignedOfficerId === req.user.id);
    }
  }

  res.json({ success: true, count: list.length, data: list });
});

app.get('/api/complaints/:id', authenticateToken, (req, res) => {
  const item = dataStore.complaints.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Complaint ticket not found.' });

  if (req.user.role === ROLES.CITIZEN && item.citizenId !== req.user.id && item.citizenEmail !== req.user.email) {
    dataStore.auditLogs.add(req, 'UNAUTHORIZED_COMPLAINT_ACCESS', req.params.id, 'Complaint', 'DENIED', 'Citizen attempted to view another citizen complaint.');
    return res.status(403).json({ success: false, error: 'Access Denied: You are not authorized to view this ticket.' });
  }

  res.json({ success: true, data: item });
});

app.post('/api/complaints', authenticateToken, (req, res) => {
  const sanitized = sanitizeInput(req.body);
  const now = new Date().toISOString();
  const dueDate = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

  const newComplaint = {
    id: `KPG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    citizenId: req.user.id,
    submittedBy: req.user.name,
    citizenEmail: req.user.email,
    category: sanitized.category || 'General',
    title: sanitized.title,
    description: sanitized.description,
    department: sanitized.department || 'Public Works (PWD)',
    priority: sanitized.priority || COMPLAINT_PRIORITY.HIGH,
    status: COMPLAINT_STATUS.REPORTED,
    location: {
      address: sanitized.address || sanitized.locationName || `Ward ${sanitized.ward || 1}, Kopargaon`,
      ward: parseInt(sanitized.ward) || 1,
      latitude: sanitized.latitude || 19.8833,
      longitude: sanitized.longitude || 74.4833
    },
    imageUrl: sanitized.imageUrl || '',
    supportingDocuments: [],
    assignedOfficerId: null,
    assignedTeamId: 'TEAM-SAN-01',
    submittedAt: now,
    dueDate: dueDate,
    workStartedAt: null,
    completedAt: null,
    isEscalated: false,
    remarks: [],
    timeline: [
      {
        id: `EVT-${Date.now()}`,
        status: COMPLAINT_STATUS.REPORTED,
        timestamp: now,
        actor: { name: req.user.name, role: ROLES.CITIZEN, department: 'Resident' },
        action: 'Complaint Registered',
        note: `Submitted complaint under ${sanitized.category || 'General'}.`
      }
    ]
  };

  dataStore.complaints.add(newComplaint);
  dataStore.auditLogs.add(req, 'COMPLAINT_CREATED', newComplaint.id, 'Complaint', 'SUCCESS', `Created ticket #${newComplaint.id}`);

  // Broadcast Real-Time Events
  broadcastEvent('COMPLAINT_CREATED', newComplaint);
  broadcastEvent('CITY_OVERVIEW_UPDATED', dataStore.getCityOverview());

  res.status(201).json({ success: true, data: newComplaint });
});

// Assign Maintenance Squad / Officer to Complaint Endpoint
app.put('/api/complaints/:id/assign', authenticateToken, requireRoles(ROLES.STAFF, ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  const { assignedOfficer, assignedTeamId, note } = req.body;

  const updated = dataStore.complaints.assignOfficer(
    id,
    assignedOfficer,
    assignedTeamId,
    note,
    req.user.name,
    req.user.role,
    req.user.department
  );

  if (!updated) return res.status(404).json({ success: false, error: 'Complaint ticket not found.' });

  const notif = dataStore.notifications.add({
    id: `NOTIF-${Date.now()}`,
    recipientRole: ROLES.CITIZEN,
    recipientId: updated.citizenId,
    title: `Ticket ${id} Assigned`,
    description: `Maintenance unit (${assignedOfficer || assignedTeamId || 'Field Squad'}) assigned to your ticket #${id}.`,
    relatedEntityType: 'Complaint',
    relatedEntityId: id,
    priority: updated.priority || 'Normal',
    department: updated.department,
    timestamp: new Date().toISOString(),
    read: false,
    actionLink: '/citizen/track-complaint'
  });

  dataStore.auditLogs.add(req, 'COMPLAINT_ASSIGNED', id, 'Complaint', 'SUCCESS', `Assigned to ${assignedOfficer || assignedTeamId}`);

  // Broadcast Real-Time Events
  broadcastEvent('COMPLAINT_ASSIGNED', updated);
  broadcastEvent('NOTIFICATION_ADDED', notif);
  broadcastEvent('CITY_OVERVIEW_UPDATED', dataStore.getCityOverview());

  res.json({ success: true, data: updated });
});

// Update Lifecycle Status Endpoint
app.put('/api/complaints/:id/status', authenticateToken, requireRoles(ROLES.STAFF, ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  const { status, note, assignedOfficer } = req.body;
  const updated = dataStore.complaints.updateStatus(id, status, note, req.user.name, req.user.role, req.user.department);

  if (!updated) return res.status(404).json({ success: false, error: 'Complaint ticket not found.' });

  if (assignedOfficer) {
    updated.assignedOfficer = assignedOfficer;
  }

  const notif = dataStore.notifications.add({
    id: `NOTIF-${Date.now()}`,
    recipientRole: ROLES.CITIZEN,
    recipientId: updated.citizenId,
    title: `Ticket ${id} Status Updated to ${status}`,
    description: `Your complaint #${id} (${updated.title}) status changed to ${status}.`,
    relatedEntityType: 'Complaint',
    relatedEntityId: id,
    priority: updated.priority || 'Normal',
    department: updated.department,
    timestamp: new Date().toISOString(),
    read: false,
    actionLink: '/citizen/track-complaint'
  });

  dataStore.auditLogs.add(req, 'COMPLAINT_STATUS_UPDATED', id, 'Complaint', 'SUCCESS', `Status changed to ${status}`);

  // Broadcast Real-Time Events
  broadcastEvent('COMPLAINT_UPDATED', updated);
  broadcastEvent('NOTIFICATION_ADDED', notif);
  broadcastEvent('CITY_OVERVIEW_UPDATED', dataStore.getCityOverview());

  res.json({ success: true, data: updated });
});

// Permissions Endpoint
app.get('/api/permissions', authenticateToken, (req, res) => {
  let list = dataStore.permissions.getAll();
  if (req.user.role === ROLES.CITIZEN) {
    list = list.filter(p => p.citizenEmail === req.user.email || p.applicantId === req.user.id);
  }
  res.json({ success: true, count: list.length, permissions: list });
});

app.post('/api/permissions', authenticateToken, (req, res) => {
  const sanitized = sanitizeInput(req.body);
  const newApp = {
    id: `KPG-PERM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    applicantId: req.user.id,
    applicantName: req.user.name,
    citizenEmail: req.user.email,
    permissionType: sanitized.permissionType || 'Building Permission',
    category: sanitized.category || 'Residential',
    plotAreaSqFt: Number(sanitized.plotAreaSqFt) || 1200,
    location: {
      propertyAddress: sanitized.propertyAddress || `Ward ${sanitized.ward || 4}, Kopargaon`,
      ward: Number(sanitized.ward) || 4,
      propertyNumber: sanitized.propertyNumber || 'KPG-PROP-0000',
      latitude: 19.8855,
      longitude: 74.4821
    },
    architectName: sanitized.architectName || 'Licensed Architect',
    status: 'Under Verification',
    submittedAt: new Date().toISOString(),
    certificateIssued: false
  };

  dataStore.permissions.add(newApp);
  dataStore.auditLogs.add(req, 'PERMISSION_SUBMITTED', newApp.id, 'Permission', 'SUCCESS', `Permission application ${newApp.id} submitted`);

  broadcastEvent('PERMISSION_CREATED', newApp);

  res.status(201).json({ success: true, permission: newApp });
});

// Taxes Endpoint
app.get('/api/taxes', authenticateToken, (req, res) => {
  let list = dataStore.taxes.getAll();
  if (req.user.role === ROLES.CITIZEN) {
    list = list.filter(t => t.citizenId === req.user.id || t.citizenEmail === req.user.email);
  }
  res.json({ success: true, count: list.length, taxes: list });
});

app.post('/api/taxes/:id/pay', authenticateToken, (req, res) => {
  const paid = dataStore.taxes.processPayment(req.params.id, req.body.paymentMethod);
  if (!paid) return res.status(404).json({ success: false, error: 'Tax record not found.' });

  dataStore.auditLogs.add(req, 'TAX_PAYMENT_PROCESSED', paid.id, 'TaxBill', 'SUCCESS', `Processed tax payment of Rs. ${paid.amount}`);

  broadcastEvent('TAX_PAID', paid);

  res.json({ success: true, tax: paid });
});

// Private Documents Endpoint
app.get('/api/documents/:id', authenticateToken, (req, res) => {
  const doc = dataStore.documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ success: false, error: 'Document not found.' });

  if (req.user.role === ROLES.CITIZEN && doc.ownerId !== req.user.id && doc.ownerEmail !== req.user.email) {
    dataStore.auditLogs.add(req, 'UNAUTHORIZED_DOCUMENT_ACCESS', req.params.id, 'PrivateDocument', 'DENIED', 'Access blocked to non-owned document.');
    return res.status(403).json({ success: false, error: 'Access Denied: You do not have authorization to view this private document.' });
  }

  dataStore.auditLogs.add(req, 'DOCUMENT_VIEWED', doc.id, 'PrivateDocument', 'SUCCESS', `Viewed document ${doc.title}`);
  res.json({ success: true, document: doc });
});

// Security Audit Logs Endpoint (Admin Only)
app.get('/api/audit-logs', authenticateToken, requireRoles(ROLES.ADMIN), (req, res) => {
  res.json({ success: true, count: dataStore.auditLogs.getAll().length, data: dataStore.auditLogs.getAll() });
});

// Notifications Endpoint
app.get('/api/notifications', authenticateToken, (req, res) => {
  let list = dataStore.notifications.getAll();
  if (req.user.role === ROLES.CITIZEN) {
    list = list.filter(n => n.recipientId === req.user.id || n.recipientRole === ROLES.CITIZEN || n.recipientId === 'ALL_CITIZENS');
  }
  res.json({ success: true, data: list });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: IS_PROD ? 'An internal error occurred.' : err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`Kopargaon Enterprise Data Architecture Backend Active`);
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`Real-Time SSE Stream Active at /api/events/stream`);
  console.log(`=======================================================`);
});
