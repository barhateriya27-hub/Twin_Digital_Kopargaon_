import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSLADueDate, createAuditLog, createNotification } from '../utils/governanceUtils';
import { isTokenValid, generateClientJwtToken } from '../utils/jwtUtils';

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
    password: 'citizen123',
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

  // JWT Token State for Citizen and Municipal Officer Sessions
  const [citizenToken, setCitizenToken] = useState(() => {
    const token = localStorage.getItem('kpg_citizen_token');
    if (isTokenValid(token)) return token;
    
    // Preserve logged-in user if available in localStorage
    const savedUserStr = localStorage.getItem('kpg_citizen_user');
    let userObj = defaultCitizen;
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && (parsed.name || parsed.fullName)) {
          userObj = parsed;
        }
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

  // Officer / Higher Authority user state
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

  // Validate active JWT tokens on focus and interval
  useEffect(() => {
    const validateSessions = () => {
      const cToken = localStorage.getItem('kpg_citizen_token');
      if (cToken && !isTokenValid(cToken)) {
        const savedUserStr = localStorage.getItem('kpg_citizen_user');
        let currentObj = defaultCitizen;
        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            if (parsed && (parsed.name || parsed.fullName)) currentObj = parsed;
          } catch(e) {}
        }
        const refreshedToken = generateClientJwtToken(
          { id: currentObj.id, email: currentObj.email, role: 'citizen', name: currentObj.name || currentObj.fullName },
          24
        );
        setCitizenToken(refreshedToken);
        setCitizenUser(currentObj);
        localStorage.setItem('kpg_citizen_token', refreshedToken);
        localStorage.setItem('kpg_citizen_user', JSON.stringify(currentObj));
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

  // Complaints State with SLA & Governance Lifecycles
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
        category: 'Streetlight Maintenance',
        title: 'Streetlight Malfunction near Shivaji Chowk',
        description: 'LED streetlamp fixture flickering and failing at night near Shivaji Chowk.',
        address: 'Shivaji Chowk, Ward 4',
        ward: 4,
        latitude: 19.8855,
        longitude: 74.4821,
        imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
        status: 'Resolved',
        priority: 'Normal',
        department: 'Electrical & Public Lighting',
        assignedOfficer: 'Er. Ramesh Shinde',
        createdAt: new Date(now - 72 * 3600 * 1000).toISOString(),
        submittedAt: new Date(now - 72 * 3600 * 1000).toISOString(),
        dueDate: new Date(now - 24 * 3600 * 1000).toISOString(),
        workStartedAt: new Date(now - 48 * 3600 * 1000).toISOString(),
        completedAt: new Date(now - 24 * 3600 * 1000).toISOString(),
        isEscalated: false,
        remarks: ['Replacement LED bulb installed and tested by electrical squad.'],
        supportingDocuments: [],
        completionReport: null,
        timeline: [
          {
            id: 'EVT-1001',
            status: 'Pending',
            timestamp: new Date(now - 72 * 3600 * 1000).toISOString(),
            actor: { name: 'Swanandi Kathale', role: 'Citizen', department: 'Resident' },
            action: 'Complaint Submitted',
            note: 'Registered ticket via Citizen Portal.'
          },
          {
            id: 'EVT-1002',
            status: 'In Progress',
            timestamp: new Date(now - 48 * 3600 * 1000).toISOString(),
            actor: { name: 'Er. Ramesh Shinde', role: 'Officer Assigned', department: 'Electrical' },
            action: 'Officer Assigned',
            note: 'Assigned to field electrical maintenance unit.'
          },
          {
            id: 'EVT-1003',
            status: 'Resolved',
            timestamp: new Date(now - 24 * 3600 * 1000).toISOString(),
            actor: { name: 'Er. Ramesh Shinde', role: 'Municipal Officer', department: 'Electrical' },
            action: 'Complaint Closed',
            note: 'Lighting fixture replaced and operational.'
          }
        ]
      },
      {
        id: 'CMP1032',
        citizenId: 'CIT-8821',
        submittedBy: 'Swanandi Kathale',
        citizenEmail: 'citizen@kopargaon.gov.in',
        category: 'Water Supply',
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
        completionReport: null,
        timeline: [
          {
            id: 'EVT-1004',
            status: 'Pending',
            timestamp: new Date(now - 24 * 3600 * 1000).toISOString(),
            actor: { name: 'Swanandi Kathale', role: 'Citizen', department: 'Resident' },
            action: 'Complaint Submitted',
            note: 'Submitted water leakage report.'
          },
          {
            id: 'EVT-1005',
            status: 'In Progress',
            timestamp: new Date(now - 6 * 3600 * 1000).toISOString(),
            actor: { name: 'Er. Suresh Deshmukh', role: 'Officer Assigned', department: 'Water Supply' },
            action: 'Officer Assigned',
            note: 'Repair team assigned. Excavation in progress.'
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
        completionReport: null,
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
        description: 'Your complaint CMP1023 (Streetlight Maintenance) has been marked Resolved by Electrical Department.',
        complaintId: 'CMP1023',
        priority: 'Normal',
        department: 'Electrical & Public Lighting',
        timestamp: new Date(now - 24 * 3600 * 1000).toISOString(),
        read: false
      },
      {
        id: 'NOTIF-102',
        recipientRole: 'citizen',
        title: 'Water Supply Interruption Tomorrow',
        description: 'Notice: Water supply interruption scheduled tomorrow in Ward 4 for pipeline maintenance.',
        priority: 'High',
        department: 'Water Supply',
        timestamp: new Date(now - 12 * 3600 * 1000).toISOString(),
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
        category: 'Water Supply Notices',
        priority: 'High',
        targetWards: [2, 4],
        publishedBy: 'Chief Water Engineer',
        publishDate: new Date(now - 12 * 3600 * 1000).toISOString(),
        expiryDate: new Date(now + 48 * 3600 * 1000).toISOString(),
        status: 'Published',
        attachments: []
      },
      {
        id: 'ANN-2026-002',
        title: 'Property tax due on 31 Aug',
        description: 'Pay your Kopargaon municipal property tax online before 31 Aug 2026 to claim a 5% early payment rebate.',
        category: 'Government Schemes',
        priority: 'Normal',
        targetWards: [1, 2, 3, 4, 5, 6, 7, 8],
        publishedBy: 'Revenue & Tax Assessment Dept',
        publishDate: new Date(now - 24 * 3600 * 1000).toISOString(),
        expiryDate: new Date(now + 30 * 24 * 3600 * 1000).toISOString(),
        status: 'Published',
        attachments: []
      },
      {
        id: 'ANN-2026-003',
        title: 'New road construction in Ward 5',
        description: 'Concrete road paving and drainage infrastructure construction started in Ward 5 Station Road Corridor.',
        category: 'Road Closures',
        priority: 'Normal',
        targetWards: [5],
        publishedBy: 'City Engineer, Kopargaon Municipal Council',
        publishDate: new Date(now - 36 * 3600 * 1000).toISOString(),
        expiryDate: new Date(now + 15 * 24 * 3600 * 1000).toISOString(),
        status: 'Published',
        attachments: []
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
        user: { name: 'Anil Kulkarni', role: 'Citizen', department: 'Resident' },
        ipAddress: '192.168.1.45',
        action: 'COMPLAINT_SUBMITTED',
        entityId: 'KPG-2026-0988',
        entityType: 'Complaint',
        previousValue: null,
        newValue: { status: 'Pending', category: 'Pothole' }
      },
      {
        id: 'AUD-9002',
        timestamp: new Date(now - 24 * 3600 * 1000).toISOString(),
        user: { name: 'SYSTEM_SLA_ENGINE', role: 'System Daemon', department: 'Governance Engine' },
        ipAddress: '127.0.0.1 (System)',
        action: 'AUTOMATIC_SLA_ESCALATION',
        entityId: 'KPG-2026-0988',
        entityType: 'Complaint',
        previousValue: { status: 'Pending', isEscalated: false },
        newValue: { status: 'Escalated', isEscalated: true, reason: 'Exceeded 3 working days resolution limit' }
      }
    ];
  });

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

  // SLA Daemon Engine to auto-escalate breached tickets
  useEffect(() => {
    const checkSLA = () => {
      const now = new Date();
      setComplaints(prev => prev.map(c => {
        if (c.status !== 'Completed' && c.status !== 'Resolved' && !c.isEscalated) {
          const due = new Date(c.dueDate || calculateSLADueDate(c.createdAt || c.submittedAt));
          if (now > due) {
            const nowIso = now.toISOString();

            const logEntry = createAuditLog(
              { name: 'SYSTEM_SLA_ENGINE', role: 'System Daemon', department: 'Governance Engine' },
              'AUTOMATIC_SLA_ESCALATION',
              c.id,
              'Complaint',
              { status: c.status, isEscalated: false },
              { status: 'Escalated', isEscalated: true, reason: 'Exceeded 3 working days SLA limit' }
            );
            setAuditLogs(prevAudit => [logEntry, ...prevAudit]);

            const notif = createNotification(
              'higher_authority',
              `CRITICAL: SLA Breached - Escalated Ticket #${c.id}`,
              `Ticket ${c.id} (${c.department}) unresolved past 3-day SLA limit. Intervention required.`,
              c.id,
              'Escalated',
              c.department
            );
            setNotifications(prevNotif => [notif, ...prevNotif]);

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
      }));
    };

    checkSLA();
    const interval = setInterval(checkSLA, 60000);
    return () => clearInterval(interval);
  }, []);

  // Citizen Authentication & Registration
  const registerCitizen = (data) => {
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

    const cleanEmail = (data.email || '').trim().toLowerCase();
    const exists = registeredCitizens.some(c => {
      const emailMatch = c.email && c.email.toLowerCase() === cleanEmail;
      const aadhaarMatch = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanAadhaar;
      return emailMatch || aadhaarMatch;
    });

    if (exists) {
      showToast('An account with this Email or Aadhaar Number is already registered.', 'warning');
      return false;
    }

    const formattedAadhaar = `${cleanAadhaar.slice(0,4)}-${cleanAadhaar.slice(4,8)}-${cleanAadhaar.slice(8,12)}`;
    const fullName = data.fullName || data.name || 'Registered Citizen';
    const newCitizen = {
      id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fullName,
      fullName: fullName,
      email: cleanEmail,
      phone: data.mobile || data.phone || '+91 98000 00000',
      aadhaar: formattedAadhaar,
      district: 'Ahilyanagar (Ahmednagar)',
      city: 'Kopargaon',
      ward: parseInt(data.wardNumber) || 4,
      address: data.address || 'Kopargaon, Maharashtra',
      password: data.password || 'citizen123',
      registeredAt: new Date().toISOString()
    };

    setRegisteredCitizens(prev => [newCitizen, ...prev]);

    const token = generateClientJwtToken({ id: newCitizen.id, email: newCitizen.email, role: 'citizen', name: newCitizen.name }, 24);
    setCitizenToken(token);
    setCitizenUser(newCitizen);
    localStorage.setItem('kpg_citizen_token', token);
    localStorage.setItem('kpg_citizen_user', JSON.stringify(newCitizen));

    const auditEntry = createAuditLog(
      { name: newCitizen.name, role: 'Citizen', department: 'Resident' },
      'CITIZEN_ACCOUNT_REGISTERED',
      newCitizen.id,
      'CitizenAccount',
      null,
      { email: newCitizen.email, aadhaar: newCitizen.aadhaar, district: newCitizen.district, city: newCitizen.city }
    );
    setAuditLogs(prev => [auditEntry, ...prev]);

    showToast(`Account Created Successfully! Welcome to Kopargaon Citizen Portal, ${newCitizen.name}.`);
    return true;
  };

  const loginCitizen = (identifier, password) => {
    if (!identifier || !password) {
      showToast('Please enter your Email/Aadhaar and password.', 'warning');
      return false;
    }

    const cleanInput = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const found = registeredCitizens.find(c => {
      const matchEmail = c.email && c.email.toLowerCase() === cleanInput;
      const matchAadhaar = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;
      return (matchEmail || matchAadhaar) && c.password === password;
    });

    if (found) {
      const userName = found.name || found.fullName || 'Citizen';
      const userObj = {
        ...found,
        id: found.id,
        userId: found.id,
        name: userName,
        fullName: userName,
        email: found.email,
        role: 'citizen'
      };

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
  };

  const updateCitizenProfile = (updatedFields) => {
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

    setRegisteredCitizens(prev =>
      prev.map(c => (c.id === updatedUser.id || c.email === updatedUser.email ? { ...c, ...updatedUser } : c))
    );

    try {
      if (citizenToken) {
        fetch('/api/citizens/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${citizenToken}`
          },
          body: JSON.stringify(updatedUser)
        }).catch(() => {});
      }
    } catch (e) {}

    showToast('Profile updated successfully!');
    return true;
  };

  const resetCitizenPassword = (identifier, newPassword) => {
    const cleanInput = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    let matched = false;
    setRegisteredCitizens(prev => prev.map(c => {
      const matchEmail = c.email && c.email.toLowerCase() === cleanInput;
      const matchAadhaar = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanDigits && cleanDigits.length === 12;

      if (matchEmail || matchAadhaar) {
        matched = true;
        return { ...c, password: newPassword };
      }
      return c;
    }));

    if (matched) {
      showToast('Password updated successfully!');
      return true;
    } else {
      showToast('Could not find citizen account matching provided identity.', 'error');
      return false;
    }
  };

  const logoutCitizen = () => {
    setCitizenToken(null);
    setCitizenUser(null);
    localStorage.removeItem('kpg_citizen_token');
    localStorage.removeItem('kpg_citizen_user');
    showToast('Logged Out Successfully', 'info');
  };

  const loginOfficer = (officerId, password) => {
    if ((officerId === 'kpg' && password === 'kpg@123') || (officerId === 'admin' && password === 'admin123')) {
      const officer = {
        officerId: officerId,
        name: 'Municipal Administrator',
        role: 'Smart City Commissioner',
        department: 'Municipal Headquarters',
        badge: 'KMC-OFFICER-001'
      };
      const token = generateClientJwtToken({ officerId, role: 'officer', name: officer.name }, 24);
      setOfficerToken(token);
      setOfficerUser(officer);
      localStorage.setItem('kpg_officer_token', token);
      localStorage.setItem('kpg_officer_user', JSON.stringify(officer));
      showToast('Municipal Clearance Verified. Welcome to Control Center.');
      return true;
    } else {
      showToast('Invalid Officer ID or Access Code', 'error');
      return false;
    }
  };

  const logoutOfficer = () => {
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
      status: 'Pending',
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
      completionReport: null,
      timeline: [
        {
          id: `EVT-${Date.now()}`,
          status: 'Pending',
          timestamp: now,
          actor: { name: citizenUser ? citizenUser.name : 'Citizen', role: 'Citizen', department: 'Resident' },
          action: 'Complaint Registered',
          note: `Submitted via Citizen Portal. Categorized under ${dept}. SLA target: 3 working days.`
        }
      ]
    };

    setComplaints(prev => [created, ...prev]);

    const auditEntry = createAuditLog(
      { name: created.submittedBy, role: 'Citizen', department: 'Resident' },
      'COMPLAINT_SUBMITTED',
      created.id,
      'Complaint',
      null,
      { status: 'Pending', category: created.category }
    );
    setAuditLogs(prev => [auditEntry, ...prev]);

    const notif = createNotification(
      'officer',
      `New Complaint #${created.id} Registered`,
      `${created.title} (${created.category}) logged in Ward ${created.ward}.`,
      created.id,
      created.priority,
      created.department
    );
    setNotifications(prev => [notif, ...prev]);

    showToast(`Complaint ${newId} Submitted Successfully! SLA tracking active.`);
    return created;
  };

  const updateComplaintStatus = (id, newStatus, note = '', officerName = null) => {
    const now = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const actorName = officerName || officerUser?.name || 'Municipal Officer';
        const updatedTimeline = [
          ...c.timeline,
          {
            id: `EVT-${Date.now()}`,
            status: newStatus,
            timestamp: now,
            actor: { name: actorName, role: 'Officer', department: c.department },
            action: `Status Updated to ${newStatus}`,
            note: note || `Complaint status modified to ${newStatus}.`
          }
        ];

        const auditEntry = createAuditLog(
          { name: actorName, role: 'Officer', department: c.department },
          'COMPLAINT_STATUS_UPDATED',
          id,
          'Complaint',
          { status: c.status },
          { status: newStatus, note }
        );
        setAuditLogs(prevAudit => [auditEntry, ...prevAudit]);

        const notif = createNotification(
          'citizen',
          `Complaint #${id} Status Changed`,
          `Your ticket status was updated to "${newStatus}". Note: ${note || 'Work in progress.'}`,
          id,
          'Normal',
          c.department
        );
        setNotifications(prevNotif => [notif, ...prevNotif]);

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
    showToast(`Ticket #${id} updated to ${newStatus}`, 'info');
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
    logoutOfficer,
    activeGovernanceRole,
    setActiveGovernanceRole,
    complaints,
    addComplaint,
    updateComplaintStatus,
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
