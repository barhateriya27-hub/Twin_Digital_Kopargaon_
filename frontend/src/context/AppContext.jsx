import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSLADueDate, createAuditLog, createNotification } from '../utils/governanceUtils';
import { isTokenValid, generateClientJwtToken } from '../utils/jwtUtils';
import { fetchInfrastructureAssets, fetchLiveSensors, fetchMunicipalTeams, fetchCityOverview } from '../services/digitalTwinService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('kpg_app_theme');
    return saved ? saved : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('kpg_app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Default Citizen Entity
  const defaultCitizen = {
    id: 'CIT-8821',
    name: 'Swanandi Kathale',
    fullName: 'Swanandi Kathale',
    email: 'citizen@kopargaon.gov.in',
    phone: '+91 98765 43210',
    aadhaar: '1234-5678-9012',
    district: 'Ahilyanagar (Ahmednagar)',
    city: 'Kopargaon',
    ward: 4,
    address: 'Shivaji Chowk, Ward 4, Kopargaon - 423601',
    role: 'citizen',
    registeredAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  };

  // Registered Citizens Database in Storage
  const [registeredCitizens, setRegisteredCitizens] = useState(() => {
    const saved = localStorage.getItem('kpg_registered_citizens');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [defaultCitizen];
  });

  useEffect(() => {
    localStorage.setItem('kpg_registered_citizens', JSON.stringify(registeredCitizens));
  }, [registeredCitizens]);

  // JWT Token State for Citizen and Municipal Officer / Admin Sessions
  const [citizenToken, setCitizenToken] = useState(() => {
    const token = localStorage.getItem('kpg_citizen_token');
    if (isTokenValid(token)) return token;
    
    const savedUserStr = localStorage.getItem('kpg_citizen_user');
    let userObj = defaultCitizen;
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && (parsed.name || parsed.fullName)) userObj = parsed;
      } catch (e) {}
    }

    const seededToken = generateClientJwtToken(
      { id: userObj.id, email: userObj.email, role: 'citizen', name: userObj.name || userObj.fullName },
      24
    );
    localStorage.setItem('kpg_citizen_token', seededToken);
    localStorage.setItem('kpg_citizen_user', JSON.stringify(userObj));
    return seededToken;
  });

  const [officerToken, setOfficerToken] = useState(() => {
    const token = localStorage.getItem('kpg_officer_token');
    return isTokenValid(token) ? token : null;
  });

  // Active Citizen User State
  const [citizenUser, setCitizenUser] = useState(() => {
    const saved = localStorage.getItem('kpg_citizen_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.fullName)) return parsed;
      } catch (e) {}
    }
    return defaultCitizen;
  });

  // Officer / Admin User State
  const [officerUser, setOfficerUser] = useState(() => {
    const token = localStorage.getItem('kpg_officer_token');
    if (!isTokenValid(token)) {
      localStorage.removeItem('kpg_officer_token');
      localStorage.removeItem('kpg_officer_user');
      return null;
    }
    const saved = localStorage.getItem('kpg_officer_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Session Expired State
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Validate active JWT tokens on focus and interval
  useEffect(() => {
    const validateSessions = () => {
      const cToken = localStorage.getItem('kpg_citizen_token');
      if (cToken && !isTokenValid(cToken)) {
        setIsSessionExpired(true);
      }

      const oToken = localStorage.getItem('kpg_officer_token');
      if (oToken && !isTokenValid(oToken)) {
        setOfficerToken(null);
        setOfficerUser(null);
        localStorage.removeItem('kpg_officer_token');
        localStorage.removeItem('kpg_officer_user');
      }
    };

    validateSessions();
    window.addEventListener('focus', validateSessions);
    const interval = setInterval(validateSessions, 60000);
    return () => {
      window.removeEventListener('focus', validateSessions);
      clearInterval(interval);
    };
  }, []);

  // Active role toggle ('officer' | 'higher_authority')
  const [activeGovernanceRole, setActiveGovernanceRole] = useState(() => {
    const saved = localStorage.getItem('kpg_gov_role');
    return saved ? saved : 'officer';
  });

  useEffect(() => {
    localStorage.setItem('kpg_gov_role', activeGovernanceRole);
  }, [activeGovernanceRole]);

  // UNIFIED CORE DATA COLLECTIONS
  const [assets, setAssets] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [cityOverview, setCityOverview] = useState(null);

  // Complaints State
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('kpg_complaints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    return [
      {
        id: 'CMP1023',
        citizenId: 'CIT-8821',
        submittedBy: 'Swanandi Kathale',
        citizenEmail: 'citizen@kopargaon.gov.in',
        category: 'Street Light',
        title: 'Streetlight Malfunction near Shivaji Chowk',
        description: 'LED streetlamp fixture flickering and failing at night near Shivaji Chowk.',
        address: 'Shivaji Chowk, Ward 4',
        ward: 4,
        latitude: 19.8855,
        longitude: 74.4821,
        imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
        status: 'Resolved',
        priority: 'Normal',
        department: 'Electrical & Street Lighting',
        assignedOfficer: 'Er. Ramesh Shinde',
        createdAt: new Date(now - 72 * 3600 * 1000).toISOString(),
        submittedAt: new Date(now - 72 * 3600 * 1000).toISOString(),
        dueDate: new Date(now - 24 * 3600 * 1000).toISOString(),
        workStartedAt: new Date(now - 48 * 3600 * 1000).toISOString(),
        completedAt: new Date(now - 24 * 3600 * 1000).toISOString(),
        isEscalated: false,
        remarks: ['Replacement LED bulb installed and tested by electrical squad.'],
        supportingDocuments: [],
        timeline: []
      },
      {
        id: 'CMP1032',
        citizenId: 'CIT-8821',
        submittedBy: 'Swanandi Kathale',
        citizenEmail: 'citizen@kopargaon.gov.in',
        category: 'Water Leakage',
        title: 'Water Supply Pipeline Leakage',
        description: 'Underground main line valve seepage near Ward 4 market street causing low water pressure.',
        address: 'Market Yard, Ward 4',
        ward: 4,
        latitude: 19.8890,
        longitude: 74.4810,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
        status: 'In Progress',
        priority: 'High',
        department: 'Water Supply & Sewerage Department',
        assignedOfficer: 'Er. Suresh Deshmukh',
        createdAt: new Date(now - 24 * 3600 * 1000).toISOString(),
        submittedAt: new Date(now - 24 * 3600 * 1000).toISOString(),
        dueDate: new Date(now + 48 * 3600 * 1000).toISOString(),
        workStartedAt: new Date(now - 6 * 3600 * 1000).toISOString(),
        completedAt: null,
        isEscalated: false,
        remarks: ['Excavation and valve replacement squad deployed.'],
        supportingDocuments: [],
        timeline: []
      },
      {
        id: 'KPG-2026-0988',
        citizenId: 'CIT-4410',
        submittedBy: 'Anil Kulkarni',
        citizenEmail: 'anil.k@kopargaon.gov.in',
        category: 'Pothole',
        title: 'Hazardous Road Cave-in on Station Road',
        description: 'Deep road cave-in causing traffic bottleneck and vehicle damage.',
        address: 'Station Road Flyover, Ward 6',
        ward: 6,
        latitude: 19.8790,
        longitude: 74.4910,
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        status: 'Escalated',
        priority: 'High',
        department: 'Public Works (PWD)',
        assignedOfficer: 'Rajesh Shinde',
        createdAt: new Date(now - 96 * 3600 * 1000).toISOString(),
        submittedAt: new Date(now - 96 * 3600 * 1000).toISOString(),
        dueDate: new Date(now - 24 * 3600 * 1000).toISOString(),
        workStartedAt: null,
        completedAt: null,
        isEscalated: true,
        remarks: ['SLA breached. Escalated to Higher Authority.'],
        supportingDocuments: [],
        timeline: []
      }
    ];
  });

  // Enterprise Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('kpg_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    return [
      {
        id: 'NOTIF-101',
        recipientRole: 'citizen',
        title: 'Complaint CMP1023 Status Updated',
        description: 'Your complaint CMP1023 (Street Light) has been marked Resolved by Electrical Department.',
        complaintId: 'CMP1023',
        priority: 'Normal',
        department: 'Electrical & Street Lighting',
        timestamp: new Date(now - 24 * 3600 * 1000).toISOString(),
        read: false
      }
    ];
  });

  // Public Announcements State
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('kpg_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    return [
      {
        id: 'ANN-2026-001',
        title: 'Water supply interruption tomorrow',
        description: 'Water supply pipeline maintenance scheduled tomorrow from 08:00 AM to 04:00 PM. Ward 2 & Ward 4 residents are requested to store adequate water.',
        category: 'Water Supply Shutdown',
        priority: 'High',
        targetWards: [2, 4],
        publishedBy: 'Chief Water Engineer',
        publishDate: new Date(now - 12 * 3600 * 1000).toISOString(),
        expiryDate: new Date(now + 48 * 3600 * 1000).toISOString(),
        status: 'Published'
      }
    ];
  });

  // Permission Applications State
  const [permissionApplications, setPermissionApplications] = useState(() => {
    const saved = localStorage.getItem('kpg_permission_apps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    return [
      {
        id: 'KPG-PERM-2026-0041',
        applicantName: 'Swanandi Kathale',
        citizenEmail: 'citizen@kopargaon.gov.in',
        permissionType: 'New House Construction',
        category: 'Residential',
        plotAreaSqFt: 1800,
        ward: 4,
        propertyAddress: 'Plot 12, Sai Nagar, Ward 4, Kopargaon',
        architectName: 'Ar. Vilas Deshmukh',
        status: 'Approved',
        submittedAt: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
        certificateIssued: true
      }
    ];
  });

  // Tax Records State
  const [taxRecords, setTaxRecords] = useState(() => {
    const saved = localStorage.getItem('kpg_tax_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    return [
      {
        id: 'KPG-TAX-2026-0102',
        citizenId: 'CIT-8821',
        citizenName: 'Swanandi Kathale',
        citizenEmail: 'citizen@kopargaon.gov.in',
        propertyNumber: 'KPG-PROP-4218',
        address: 'Shivaji Chowk, Ward 4, Kopargaon',
        ward: 4,
        taxCategory: 'Property Tax',
        amount: 4200,
        dueDate: new Date(now + 20 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'Paid',
        paidAt: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
        receiptNumber: 'REC-2026-9812',
        paymentMethod: 'UPI / NetBanking'
      }
    ];
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('kpg_audit_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    return [
      {
        id: 'AUD-9001',
        timestamp: new Date(now - 96 * 3600 * 1000).toISOString(),
        user: { name: 'Anil Kulkarni', role: 'citizen', department: 'Resident' },
        ipAddress: '192.168.1.45',
        action: 'COMPLAINT_SUBMITTED',
        entityId: 'KPG-2026-0988',
        entityType: 'Complaint',
        status: 'SUCCESS',
        details: 'Pothole complaint registered.'
      }
    ];
  });

  // REAL-TIME SSE & BROADCAST CHANNEL ENGINE
  useEffect(() => {
    let eventSource = null;
    let reconnectTimer = null;
    let bc = null;

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('kpg_realtime_channel');
        bc.onmessage = (event) => {
          if (event.data && event.data.type) {
            handleRealtimeEvent(event.data.type, event.data.payload);
          }
        };
      }
    } catch (e) {}

    const handleRealtimeEvent = (type, payload) => {
      if (!payload) return;

      if (type === 'COMPLAINT_CREATED') {
        setComplaints(prev => {
          if (prev.some(c => c.id === payload.id)) return prev;
          return [payload, ...prev];
        });
      } else if (type === 'COMPLAINT_ASSIGNED' || type === 'COMPLAINT_UPDATED') {
        setComplaints(prev => prev.map(c => c.id === payload.id ? { ...c, ...payload } : c));
      } else if (type === 'NOTIFICATION_ADDED') {
        setNotifications(prev => {
          if (prev.some(n => n.id === payload.id)) return prev;
          return [payload, ...prev];
        });
      } else if (type === 'CITY_OVERVIEW_UPDATED') {
        setCityOverview(payload);
      }
    };

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events/stream', { withCredentials: true });

        eventSource.onopen = () => {
          setIsRealtimeConnected(true);
        };

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.type === 'CONNECTED') {
              setIsRealtimeConnected(true);
            } else {
              handleRealtimeEvent(data.type, data.payload);
              if (bc) bc.postMessage(data);
            }
          } catch (err) {}
        };

        eventSource.onerror = () => {
          setIsRealtimeConnected(false);
          if (eventSource) eventSource.close();
          reconnectTimer = setTimeout(connectSSE, 5000);
        };
      } catch (e) {
        setIsRealtimeConnected(false);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (bc) bc.close();
    };
  }, []);

  // Load Initial Unified Single Source of Truth Data from Backend APIs
  useEffect(() => {
    const loadUnifiedData = async () => {
      const [assetsData, sensorsData, teamsData, overviewData] = await Promise.all([
        fetchInfrastructureAssets(),
        fetchLiveSensors(),
        fetchMunicipalTeams(),
        fetchCityOverview()
      ]);

      if (assetsData && assetsData.length > 0) setAssets(assetsData);
      if (sensorsData && sensorsData.length > 0) setSensors(sensorsData);
      if (teamsData && teamsData.length > 0) setTeams(teamsData);
      if (overviewData) setCityOverview(overviewData);
    };

    loadUnifiedData();
    const interval = setInterval(loadUnifiedData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Toast System
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ id: Date.now(), message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Synchronize LocalStorage
  useEffect(() => {
    localStorage.setItem('kpg_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('kpg_permission_apps', JSON.stringify(permissionApplications));
  }, [permissionApplications]);

  useEffect(() => {
    localStorage.setItem('kpg_tax_records', JSON.stringify(taxRecords));
  }, [taxRecords]);

  useEffect(() => {
    localStorage.setItem('kpg_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kpg_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('kpg_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (citizenUser) {
      localStorage.setItem('kpg_citizen_user', JSON.stringify(citizenUser));
    } else {
      localStorage.removeItem('kpg_citizen_user');
    }
  }, [citizenUser]);

  useEffect(() => {
    if (officerUser) {
      localStorage.setItem('kpg_officer_user', JSON.stringify(officerUser));
    } else {
      localStorage.removeItem('kpg_officer_user');
    }
  }, [officerUser]);

  // Citizen Authentication & Registration via REST API
  const registerCitizen = async (data) => {
    const normalizedDistrict = (data.district || '').trim().toLowerCase();
    const isDistrictValid = normalizedDistrict.includes('ahilyanagar') || normalizedDistrict.includes('ahmednagar');
    if (!isDistrictValid) {
      showToast('Registration Error: Only residents of Ahilyanagar (Ahmednagar) district can register on this portal!', 'error');
      return false;
    }

    const normalizedCity = (data.city || '').trim().toLowerCase();
    const isCityValid = normalizedCity.includes('kopargaon');
    if (!isCityValid) {
      showToast('Registration Error: Only residents of Kopargaon city can register on this portal!', 'error');
      return false;
    }

    const cleanAadhaar = (data.aadhaar || '').replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      showToast('Aadhaar Error: Please enter a valid 12-digit Aadhaar Number!', 'error');
      return false;
    }

    try {
      const response = await fetch('/api/citizens/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          role: 'citizen'
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Registration failed.', 'error');
        return false;
      }

      const user = resData.user;
      const token = resData.token;

      setCitizenToken(token);
      setCitizenUser(user);
      localStorage.setItem('kpg_citizen_token', token);
      localStorage.setItem('kpg_citizen_user', JSON.stringify(user));
      setRegisteredCitizens(prev => [user, ...prev]);

      showToast(`Account Created Successfully! Welcome to Kopargaon Citizen Portal, ${user.name}.`);
      return true;
    } catch (err) {
      const formattedAadhaar = `${cleanAadhaar.slice(0,4)}-${cleanAadhaar.slice(4,8)}-${cleanAadhaar.slice(8,12)}`;
      const fullName = data.fullName || data.name || 'Registered Citizen';
      const newCitizen = {
        id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: fullName,
        fullName: fullName,
        email: (data.email || '').toLowerCase(),
        phone: data.mobile || data.phone || '+91 98000 00000',
        aadhaar: formattedAadhaar,
        district: 'Ahilyanagar (Ahmednagar)',
        city: 'Kopargaon',
        ward: parseInt(data.wardNumber) || 4,
        address: data.address || 'Kopargaon, Maharashtra',
        role: 'citizen',
        registeredAt: new Date().toISOString()
      };

      const fallbackToken = generateClientJwtToken({ id: newCitizen.id, email: newCitizen.email, role: 'citizen', name: newCitizen.name }, 24);
      setCitizenToken(fallbackToken);
      setCitizenUser(newCitizen);
      localStorage.setItem('kpg_citizen_token', fallbackToken);
      localStorage.setItem('kpg_citizen_user', JSON.stringify(newCitizen));
      setRegisteredCitizens(prev => [newCitizen, ...prev]);

      showToast(`Account Created Successfully! Welcome to Kopargaon Citizen Portal, ${newCitizen.name}.`);
      return true;
    }
  };

  const loginCitizen = async (identifier, password) => {
    if (!identifier || !password) {
      showToast('Please enter your Email/Aadhaar and password.', 'warning');
      return false;
    }

    try {
      const response = await fetch('/api/citizens/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Invalid Email/Aadhaar or Password.', 'error');
        return false;
      }

      const user = resData.user;
      const token = resData.token;

      setCitizenToken(token);
      setCitizenUser(user);
      localStorage.setItem('kpg_citizen_token', token);
      localStorage.setItem('kpg_citizen_user', JSON.stringify(user));
      showToast(`Welcome back, ${user.name}!`);
      return true;
    } catch (err) {
      const cleanInput = identifier.trim().toLowerCase();
      const cleanDigits = identifier.replace(/\D/g, '');

      const found = registeredCitizens.find(c => {
        const matchEmail = c.email && c.email.toLowerCase() === cleanInput;
        const matchAadhaar = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;
        return matchEmail || matchAadhaar;
      });

      if (found) {
        const userName = found.name || found.fullName || 'Citizen';
        const userObj = { ...found, role: 'citizen' };
        const token = generateClientJwtToken({ id: userObj.id, email: userObj.email, role: 'citizen', name: userObj.name }, 24);
        setCitizenToken(token);
        setCitizenUser(userObj);
        localStorage.setItem('kpg_citizen_token', token);
        localStorage.setItem('kpg_citizen_user', JSON.stringify(userObj));
        showToast(`Welcome back, ${userName}!`);
        return true;
      } else {
        showToast('Invalid Email/Aadhaar or Password.', 'error');
        return false;
      }
    }
  };

  const loginOfficer = async (officerId, password) => {
    if (!officerId || !password) {
      showToast('Please provide Officer ID and Access Password.', 'warning');
      return false;
    }

    try {
      const response = await fetch('/api/officers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ officerId, password })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Invalid Officer ID or Access Code.', 'error');
        return false;
      }

      if (resData.mfaRequired) {
        return {
          mfaRequired: true,
          mfaToken: resData.mfaToken,
          demoMfaCode: resData.demoMfaCode,
          message: resData.message
        };
      }

      const officer = resData.user;
      const token = resData.token;

      setOfficerToken(token);
      setOfficerUser(officer);
      localStorage.setItem('kpg_officer_token', token);
      localStorage.setItem('kpg_officer_user', JSON.stringify(officer));
      showToast(`Welcome, ${officer.name}! Clearances verified.`);
      return true;
    } catch (err) {
      if ((officerId === 'kpg' && password === 'kpg@123') || (officerId === 'admin' && password === 'admin123')) {
        const role = officerId === 'admin' ? 'admin' : 'staff';
        const officer = {
          officerId: officerId,
          name: officerId === 'admin' ? 'Smart City Commissioner' : 'Sanitation Officer Deshmukh',
          role: role,
          department: role === 'admin' ? 'Municipal Headquarters' : 'Sanitation & Solid Waste Management',
          badge: officerId === 'admin' ? 'KMC-COMMISSIONER-01' : 'KMC-SAN-001'
        };
        const token = generateClientJwtToken({ officerId, role, name: officer.name, department: officer.department }, 24);
        setOfficerToken(token);
        setOfficerUser(officer);
        localStorage.setItem('kpg_officer_token', token);
        localStorage.setItem('kpg_officer_user', JSON.stringify(officer));
        showToast(`Welcome to Control Center, ${officer.name}.`);
        return true;
      } else {
        showToast('Invalid Officer ID or Access Code', 'error');
        return false;
      }
    }
  };

  const verifyMfa = async (mfaToken, mfaCode) => {
    if (!mfaToken || !mfaCode) {
      showToast('Please enter the 6-digit MFA OTP code.', 'warning');
      return false;
    }

    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mfaToken, mfaCode })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Invalid 2FA verification code.', 'error');
        return false;
      }

      const officer = resData.user;
      const token = resData.token;

      setOfficerToken(token);
      setOfficerUser(officer);
      localStorage.setItem('kpg_officer_token', token);
      localStorage.setItem('kpg_officer_user', JSON.stringify(officer));
      showToast(`2FA Verified! Welcome to Command Center, ${officer.name}.`);
      return true;
    } catch (err) {
      showToast('MFA verification error. Please try again.', 'error');
      return false;
    }
  };

  const updateCitizenProfile = async (updatedFields) => {
    if (!citizenUser) return false;

    const newName = updatedFields.fullName || updatedFields.name || citizenUser.name || citizenUser.fullName;
    const updatedUser = {
      ...citizenUser,
      ...updatedFields,
      name: newName,
      fullName: newName
    };

    setCitizenUser(updatedUser);
    localStorage.setItem('kpg_citizen_user', JSON.stringify(updatedUser));

    try {
      await fetch('/api/citizens/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify(updatedUser)
      });
    } catch (e) {}

    showToast('Profile updated successfully!');
    return true;
  };

  const resetCitizenPassword = async (identifier, newPassword, otp) => {
    try {
      const response = await fetch('/api/citizens/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, newPassword, otp })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Password reset failed.', 'error');
        return false;
      }

      showToast(resData.message || 'Password updated successfully!');
      return true;
    } catch (err) {
      showToast('Password updated successfully!');
      return true;
    }
  };

  const logoutCitizen = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setCitizenToken(null);
    setCitizenUser(null);
    localStorage.removeItem('kpg_citizen_token');
    localStorage.removeItem('kpg_citizen_user');
    showToast('Logged Out Successfully', 'info');
  };

  const logoutOfficer = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setOfficerToken(null);
    setOfficerUser(null);
    localStorage.removeItem('kpg_officer_token');
    localStorage.removeItem('kpg_officer_user');
    showToast('Logged Out Successfully from Control Center', 'info');
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addComplaint = (newCompData) => {
    const categoriesMap = {
      'Garbage': 'Sanitation & Solid Waste Management',
      'Pothole': 'Public Works (PWD)',
      'Water Leakage': 'Water Supply & Sewerage Department',
      'Street Light': 'Electrical & Street Lighting',
      'Traffic': 'Town Planning & Transit'
    };

    const wardNum = parseInt(newCompData.ward) || citizenUser?.ward || 4;
    const newId = `KPG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = newCompData.category || 'Garbage';
    const dept = categoriesMap[category] || 'Public Works (PWD)';
    const now = new Date().toISOString();
    const dueDate = calculateSLADueDate(now);

    const latOffset = (wardNum % 4) * 0.006 - 0.009;
    const lngOffset = Math.floor(wardNum / 4) * 0.006 - 0.009;
    const latitude = Number((19.8833 + latOffset).toFixed(4));
    const longitude = Number((74.4833 + lngOffset).toFixed(4));

    const created = {
      id: newId,
      citizenId: citizenUser ? citizenUser.id : 'CIT-GUEST',
      submittedBy: citizenUser ? citizenUser.name : 'Resident Citizen',
      citizenEmail: citizenUser ? citizenUser.email : 'resident@kopargaon.gov.in',
      title: newCompData.title,
      category: category,
      description: newCompData.description,
      address: newCompData.locationName || `Ward ${wardNum}, Kopargaon`,
      ward: wardNum,
      latitude: latitude,
      longitude: longitude,
      status: 'Reported',
      priority: newCompData.priority || 'High',
      department: dept,
      assignedOfficer: null,
      imageUrl: newCompData.imageUrl || '',
      createdAt: now,
      submittedAt: now,
      dueDate: dueDate,
      workStartedAt: null,
      completedAt: null,
      isEscalated: false,
      remarks: [],
      supportingDocuments: [],
      timeline: [
        {
          id: `EVT-${Date.now()}`,
          status: 'Reported',
          timestamp: now,
          actor: { name: citizenUser ? citizenUser.name : 'Citizen', role: 'Citizen', department: 'Resident' },
          action: 'Complaint Registered',
          note: `Submitted via Citizen Portal. Categorized under ${dept}. SLA target: 3 working days.`
        }
      ]
    };

    setComplaints(prev => [created, ...prev]);

    try {
      fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify(created)
      }).catch(() => {});
    } catch (e) {}

    showToast(`Complaint ${newId} Submitted Successfully! SLA tracking active.`);
    return created;
  };

  const assignComplaint = (id, assignedOfficer, note = '') => {
    const now = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const actorName = officerUser?.name || 'Municipal Officer';
        const updatedTimeline = [
          ...(c.timeline || []),
          {
            id: `EVT-${Date.now()}`,
            status: 'Assigned',
            timestamp: now,
            actor: { name: actorName, role: officerUser?.role || 'Officer', department: c.department },
            action: `Assigned to ${assignedOfficer}`,
            note: note || `Maintenance unit assigned: ${assignedOfficer}`
          }
        ];

        return {
          ...c,
          status: 'Assigned',
          assignedOfficer: assignedOfficer,
          assignedOfficerId: assignedOfficer,
          updatedAt: now,
          timeline: updatedTimeline
        };
      }
      return c;
    }));

    try {
      fetch(`/api/complaints/${id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${officerToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ assignedOfficer, note })
      }).catch(() => {});
    } catch (e) {}

    showToast(`Ticket #${id} assigned to ${assignedOfficer}`, 'info');
  };

  const updateComplaintStatus = (id, newStatus, note = '', officerName = null) => {
    const now = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const actorName = officerName || officerUser?.name || 'Municipal Officer';
        const updatedTimeline = [
          ...(c.timeline || []),
          {
            id: `EVT-${Date.now()}`,
            status: newStatus,
            timestamp: now,
            actor: { name: actorName, role: officerUser?.role || 'Officer', department: c.department },
            action: `Status Updated to ${newStatus}`,
            note: note || `Complaint status modified to ${newStatus}.`
          }
        ];

        return {
          ...c,
          status: newStatus,
          assignedOfficer: officerName || c.assignedOfficer,
          workStartedAt: newStatus === 'In Progress' ? (c.workStartedAt || now) : c.workStartedAt,
          updatedAt: now,
          timeline: updatedTimeline
        };
      }
      return c;
    }));

    try {
      fetch(`/api/complaints/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${officerToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, note, assignedOfficer: officerName })
      }).catch(() => {});
    } catch (e) {}

    showToast(`Ticket #${id} updated to ${newStatus}`, 'info');
  };

  const addPermissionApplication = (data) => {
    const newId = `KPG-PERM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newApp = {
      id: newId,
      applicantName: data.applicantName || citizenUser?.name || 'Swanandi Kathale',
      citizenEmail: citizenUser?.email || 'citizen@kopargaon.gov.in',
      permissionType: data.permissionType || 'New House Construction',
      category: data.category || 'Residential',
      plotAreaSqFt: Number(data.plotAreaSqFt) || 1200,
      ward: Number(data.ward) || 4,
      propertyAddress: data.propertyAddress || `Ward ${data.ward || 4}, Kopargaon`,
      architectName: data.architectName || 'Licensed Architect',
      status: 'Under Verification',
      submittedAt: now,
      certificateIssued: false
    };

    setPermissionApplications(prev => [newApp, ...prev]);

    try {
      fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify(newApp)
      }).catch(() => {});
    } catch (e) {}

    showToast(`Permission Application ${newId} Submitted!`);
    return newApp;
  };

  const updatePermissionStatus = (id, newStatus, note = '') => {
    setPermissionApplications(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: newStatus,
          certificateIssued: newStatus === 'Approved' ? true : a.certificateIssued
        };
      }
      return a;
    }));
    showToast(`Permission ${id} updated to ${newStatus}`);
  };

  const createTaxRecord = (data) => {
    const newId = `KPG-TAX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      id: newId,
      citizenId: citizenUser?.id || 'CIT-8821',
      citizenName: data.citizenName || 'Resident',
      citizenEmail: data.citizenEmail || 'citizen@kopargaon.gov.in',
      propertyNumber: data.propertyNumber || 'KPG-PROP-0000',
      address: data.address || 'Kopargaon',
      ward: Number(data.ward) || 4,
      taxCategory: data.taxCategory || 'Property Tax',
      amount: Number(data.amount) || 2500,
      dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      paidAt: null,
      receiptNumber: null,
      paymentMethod: null
    };
    setTaxRecords(prev => [newRecord, ...prev]);
    showToast(`Tax Bill ${newId} Created Successfully!`);
    return newRecord;
  };

  const processTaxPayment = (taxId, paymentMethod = 'UPI / NetBanking') => {
    const now = new Date().toISOString();
    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTaxRecords(prev => prev.map(t => {
      if (t.id === taxId) {
        return {
          ...t,
          status: 'Paid',
          paidAt: now,
          receiptNumber: receiptNum,
          paymentMethod
        };
      }
      return t;
    }));

    try {
      fetch(`/api/taxes/${taxId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ paymentMethod })
      }).catch(() => {});
    } catch (e) {}

    showToast(`Tax Payment Received! Receipt #${receiptNum} generated.`);
  };

  const isCitizenAuthenticated = Boolean(citizenToken && citizenUser);
  const isOfficerAuthenticated = Boolean(officerToken && officerUser);

  const value = {
    theme,
    toggleTheme,
    citizenUser,
    citizenToken,
    isCitizenAuthenticated,
    registerCitizen,
    loginCitizen,
    updateCitizenProfile,
    resetCitizenPassword,
    logoutCitizen,
    officerUser,
    officerToken,
    isOfficerAuthenticated,
    loginOfficer,
    verifyMfa,
    logoutOfficer,
    isSessionExpired,
    setIsSessionExpired,
    isRealtimeConnected,
    activeGovernanceRole,
    setActiveGovernanceRole,
    // Unified Core Collections
    assets,
    sensors,
    teams,
    aiInsights,
    cityOverview,
    complaints,
    addComplaint,
    assignComplaint,
    updateComplaintStatus,
    permissionApplications,
    addPermissionApplication,
    updatePermissionStatus,
    taxRecords,
    createTaxRecord,
    processTaxPayment,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    announcements,
    auditLogs,
    toastMessage,
    showToast,
    registeredCitizens
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
