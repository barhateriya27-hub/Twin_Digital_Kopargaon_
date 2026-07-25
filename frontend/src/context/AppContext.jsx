import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSLADueDate, createAuditLog, createNotification } from '../utils/governanceUtils';

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

  // Registered Citizens Database in Storage
  const [registeredCitizens, setRegisteredCitizens] = useState(() => {
    const saved = localStorage.getItem('kpg_registered_citizens');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
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
  });

  useEffect(() => {
    localStorage.setItem('kpg_registered_citizens', JSON.stringify(registeredCitizens));
  }, [registeredCitizens]);

  // Active Citizen User State
  const [citizenUser, setCitizenUser] = useState(() => {
    const saved = localStorage.getItem('kpg_citizen_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Officer / Higher Authority user state
  const [officerUser, setOfficerUser] = useState(() => {
    const saved = localStorage.getItem('kpg_officer_user');
    return saved ? JSON.parse(saved) : null;
  });

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
        createdAt: new Date(now - 36 * 3600 * 1000).toISOString(),
        submittedAt: new Date(now - 36 * 3600 * 1000).toISOString(),
        dueDate: new Date(now + 36 * 3600 * 1000).toISOString(),
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
            timestamp: new Date(now - 36 * 3600 * 1000).toISOString(),
            actor: { name: 'Ramesh Patil', role: 'Citizen', department: 'Resident' },
            action: 'Complaint Registered',
            note: 'Submitted ticket via Citizen Portal with geolocation.'
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
        description: 'Underground pipeline leakage near Ward 2 high school causing water logging on main street.',
        address: 'Near Mahatma Gandhi School, Ward 2',
        ward: 2,
        latitude: 19.8912,
        longitude: 74.4789,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
        status: 'In Progress',
        priority: 'Emergency',
        department: 'Water Supply & Sewerage Department',
        assignedOfficer: 'Er. Suresh Deshmukh',
        createdAt: new Date(now - 48 * 3600 * 1000).toISOString(),
        submittedAt: new Date(now - 48 * 3600 * 1000).toISOString(),
        dueDate: new Date(now + 24 * 3600 * 1000).toISOString(),
        workStartedAt: new Date(now - 12 * 3600 * 1000).toISOString(),
        completedAt: null,
        isEscalated: false,
        remarks: ['Heavy excavation squad deployed.'],
        supportingDocuments: [],
        completionReport: null,
        timeline: [
          {
            id: 'EVT-1002',
            status: 'Pending',
            timestamp: new Date(now - 48 * 3600 * 1000).toISOString(),
            actor: { name: 'Priya Sharma', role: 'Citizen', department: 'Resident' },
            action: 'Complaint Registered',
            note: 'Submitted pipeline issue.'
          },
          {
            id: 'EVT-1003',
            status: 'In Progress',
            timestamp: new Date(now - 12 * 3600 * 1000).toISOString(),
            actor: { name: 'Er. Suresh Deshmukh', role: 'Municipal Officer', department: 'Water Supply' },
            action: 'Work Started',
            note: 'Assigned repair team. Work in execution.'
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
        remarks: ['SLA breached (3 days limit exceeded). Escalated to Higher Authority.'],
        supportingDocuments: [],
        completionReport: null,
        timeline: [
          {
            id: 'EVT-1004',
            status: 'Pending',
            timestamp: new Date(now - 96 * 3600 * 1000).toISOString(),
            actor: { name: 'Anil Kulkarni', role: 'Citizen', department: 'Resident' },
            action: 'Complaint Registered',
            note: 'Submitted pothole ticket.'
          },
          {
            id: 'EVT-1005',
            status: 'Escalated',
            timestamp: new Date(now - 24 * 3600 * 1000).toISOString(),
            actor: { name: 'SYSTEM_SLA_ENGINE', role: 'System Daemon', department: 'Governance Engine' },
            action: 'SLA Auto-Escalation',
            note: 'Complaint unresolved past 3 working days SLA. Escalated to Higher Authority Portal.'
          }
        ]
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
        recipientRole: 'officer',
        title: 'New High Priority Complaint',
        description: 'Complaint KPG-2026-1042 registered in Sanitation Department (Ward 4).',
        complaintId: 'KPG-2026-1042',
        priority: 'High',
        department: 'Sanitation & Solid Waste Management',
        timestamp: new Date(now - 36 * 3600 * 1000).toISOString(),
        read: false
      },
      {
        id: 'NOTIF-102',
        recipientRole: 'higher_authority',
        title: 'SLA Breach Auto-Escalation Warning',
        description: 'Complaint KPG-2026-0988 (PWD Ward 6) breached 3-day SLA limit and requires immediate intervention.',
        complaintId: 'KPG-2026-0988',
        priority: 'Escalated',
        department: 'Public Works (PWD)',
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
        title: 'Scheduled Water Supply Shutdown - Ward 2 & Ward 4',
        description: 'Water pipeline maintenance scheduled on Sunday from 08:00 AM to 04:00 PM. Residents are requested to store adequate water.',
        category: 'Water Supply Shutdown',
        priority: 'High',
        targetWards: [2, 4],
        publishedBy: 'Chief Water Engineer',
        publishDate: new Date(now - 24 * 3600 * 1000).toISOString(),
        expiryDate: new Date(now + 48 * 3600 * 1000).toISOString(),
        status: 'Published',
        attachments: []
      },
      {
        id: 'ANN-2026-002',
        title: 'Monsoon Heavy Rainfall Advisory & Emergency Helpline',
        description: 'High rainfall advisory issued for Kopargaon district. Emergency helpline active 24x7: 1800-233-4567.',
        category: 'Emergency Notice',
        priority: 'Urgent/Emergency',
        targetWards: [1, 2, 3, 4, 5, 6, 7, 8],
        publishedBy: 'Municipal Commissioner Office',
        publishDate: new Date(now).toISOString(),
        expiryDate: new Date(now + 72 * 3600 * 1000).toISOString(),
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
    // Mandatory Validation 1: District Constraint
    const normalizedDistrict = (data.district || '').trim().toLowerCase();
    const isDistrictValid = normalizedDistrict.includes('ahilyanagar') || normalizedDistrict.includes('ahmednagar');

    if (!isDistrictValid) {
      showToast('Registration Error: Only residents of Ahilyanagar (Ahmednagar) district can register on this portal!', 'error');
      return false;
    }

    // Mandatory Validation 2: City Constraint
    const normalizedCity = (data.city || '').trim().toLowerCase();
    const isCityValid = normalizedCity.includes('kopargaon');

    if (!isCityValid) {
      showToast('Registration Error: Only residents of Kopargaon city can register on this portal!', 'error');
      return false;
    }

    // Mandatory Validation 3: 12-Digit Aadhaar Format Validation
    const cleanAadhaar = (data.aadhaar || '').replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      showToast('Aadhaar Error: Please enter a valid 12-digit Aadhaar Number (उदा. 1234 5678 9012)!', 'error');
      return false;
    }

    // Duplicate Check
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const exists = registeredCitizens.some(c => {
      const emailMatch = c.email && c.email.toLowerCase() === cleanEmail;
      const aadhaarMatch = c.aadhaar && c.aadhaar.replace(/\D/g, '') === cleanAadhaar;
      return emailMatch || aadhaarMatch;
    });

    if (exists) {
      showToast('An account with this Email or Aadhaar Number is already registered. Please log in or reset password.', 'warning');
      return false;
    }

    // Create New Citizen Entity
    const formattedAadhaar = `${cleanAadhaar.slice(0,4)}-${cleanAadhaar.slice(4,8)}-${cleanAadhaar.slice(8,12)}`;
    const newCitizen = {
      id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.fullName || 'Registered Citizen',
      email: cleanEmail,
      phone: data.mobile || '+91 98000 00000',
      aadhaar: formattedAadhaar,
      district: 'Ahilyanagar (Ahmednagar)',
      city: 'Kopargaon',
      ward: parseInt(data.wardNumber) || 4,
      address: data.address || 'Kopargaon, Maharashtra',
      password: data.password || 'citizen123',
      registeredAt: new Date().toISOString()
    };

    setRegisteredCitizens(prev => [newCitizen, ...prev]);
    setCitizenUser(newCitizen);

    // Audit log
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
      setCitizenUser(found);
      showToast(`Welcome back, ${found.name}!`);
      return true;
    } else {
      showToast('Invalid Email/Aadhaar or Password. Please try again or use Forgot Password.', 'error');
      return false;
    }
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
      showToast('Password updated successfully! You may now sign in with your new password.');
      return true;
    } else {
      showToast('Could not find citizen account matching provided identity.', 'error');
      return false;
    }
  };

  const logoutCitizen = () => {
    setCitizenUser(null);
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
      setOfficerUser(officer);
      showToast('Municipal Clearance Verified. Welcome to Control Center.');
      return true;
    } else {
      showToast('Invalid Officer ID or Access Code', 'error');
      return false;
    }
  };

  const logoutOfficer = () => {
    setOfficerUser(null);
    showToast('Logged Out Successfully from Control Center', 'info');
  };

  // Notification Actions
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

  // Add New Citizen Complaint
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

    showToast(`Complaint ${id} status updated to ${newStatus}`);
  };

  const assignComplaint = (id, officerName, department) => {
    const now = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const targetDept = department || c.department;
        const updatedTimeline = [
          ...c.timeline,
          {
            id: `EVT-${Date.now()}`,
            status: 'In Progress',
            timestamp: now,
            actor: { name: officerUser?.name || 'Municipal Commissioner', role: 'Authority', department: targetDept },
            action: 'Officer Assigned',
            note: `Assigned to Field Engineer ${officerName} (${targetDept}).`
          }
        ];

        const auditEntry = createAuditLog(
          { name: officerUser?.name || 'Municipal Officer', role: 'Authority', department: targetDept },
          'COMPLAINT_ASSIGNED',
          id,
          'Complaint',
          { assignedOfficer: c.assignedOfficer },
          { assignedOfficer: officerName, department: targetDept }
        );
        setAuditLogs(prevAudit => [auditEntry, ...prevAudit]);

        const notif = createNotification(
          'officer',
          `Ticket #${id} Assigned to You`,
          `You have been assigned to resolve ticket #${id} (${c.category}, Ward ${c.ward}).`,
          id,
          'High',
          targetDept
        );
        setNotifications(prevNotif => [notif, ...prevNotif]);

        return {
          ...c,
          status: 'In Progress',
          assignedOfficer: officerName,
          department: targetDept,
          workStartedAt: c.workStartedAt || now,
          updatedAt: now,
          timeline: updatedTimeline
        };
      }
      return c;
    }));

    showToast(`Assigned Ticket #${id} to ${officerName}`);
  };

  const submitCompletionReport = (id, reportData) => {
    const now = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const updatedTimeline = [
          ...c.timeline,
          {
            id: `EVT-${Date.now()}`,
            status: 'Completed',
            timestamp: now,
            actor: { name: reportData.officerName, role: 'Officer', department: reportData.department },
            action: 'Official Work Completion Report Submitted',
            note: `Completion Certificate generated (${reportData.reportId}). Work verified.`
          }
        ];

        const auditEntry = createAuditLog(
          { name: reportData.officerName, role: 'Officer', department: reportData.department },
          'COMPLETION_REPORT_SUBMITTED',
          id,
          'CompletionReport',
          { status: c.status },
          { status: 'Completed', reportId: reportData.reportId }
        );
        setAuditLogs(prevAudit => [auditEntry, ...prevAudit]);

        const notif = createNotification(
          'citizen',
          `Complaint #${id} Completed - Official Report Available`,
          `Work completed by ${reportData.department}. Download your official completion certificate!`,
          id,
          'Normal',
          reportData.department
        );
        setNotifications(prevNotif => [notif, ...prevNotif]);

        return {
          ...c,
          status: 'Completed',
          completedAt: now,
          completionReport: reportData,
          updatedAt: now,
          timeline: updatedTimeline
        };
      }
      return c;
    }));

    showToast(`Official Work Completion Report Generated for Ticket ${id}! Status marked Completed.`);
  };

  const issueOfficerWarning = (id, officerName, warningNote) => {
    const now = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          timeline: [
            ...c.timeline,
            {
              id: `EVT-${Date.now()}`,
              status: 'Escalated',
              timestamp: now,
              actor: { name: 'Municipal Commissioner Office', role: 'Higher Authority', department: 'Apex Governance' },
              action: 'Formal Warning Issued',
              note: `Higher Authority warning to ${officerName}: ${warningNote}`
            }
          ]
        };
      }
      return c;
    }));

    const auditEntry = createAuditLog(
      { name: 'Municipal Commissioner', role: 'Higher Authority', department: 'Apex Governance' },
      'OFFICER_WARNING_ISSUED',
      id,
      'Officer',
      null,
      { officerName, warningNote }
    );
    setAuditLogs(prev => [auditEntry, ...prev]);

    const notif = createNotification(
      'officer',
      `FORMAL WARNING: Ticket #${id}`,
      `Municipal Commissioner issued a warning regarding ticket #${id}: ${warningNote}`,
      id,
      'Escalated',
      'Apex Governance'
    );
    setNotifications(prev => [notif, ...prev]);
  };

  const requestExplanation = (id, explanationNote) => {
    const now = new Date().toISOString();

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          timeline: [
            ...c.timeline,
            {
              id: `EVT-${Date.now()}`,
              status: 'Under Review',
              timestamp: now,
              actor: { name: 'Municipal Commissioner Office', role: 'Higher Authority', department: 'Apex Governance' },
              action: 'Formal Explanation Requested',
              note: `Higher Authority request: ${explanationNote}`
            }
          ]
        };
      }
      return c;
    }));

    const notif = createNotification(
      'officer',
      `EXPLANATION REQUIRED: Ticket #${id}`,
      `Higher Authority requested formal delay explanation: ${explanationNote}`,
      id,
      'High',
      'Apex Governance'
    );
    setNotifications(prev => [notif, ...prev]);
  };

  const addAnnouncement = (data) => {
    const newAnn = {
      id: `ANN-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title,
      description: data.description,
      category: data.category || 'General Advisory',
      priority: data.priority || 'Normal',
      targetWards: data.targetWards || [1, 2, 3, 4, 5, 6, 7, 8],
      publishedBy: data.publishedBy || 'Municipal Administration',
      publishDate: new Date().toISOString(),
      expiryDate: data.expiryDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: 'Published',
      attachments: []
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    const notif = createNotification(
      'citizen',
      `Public Advisory: ${newAnn.title}`,
      newAnn.description.slice(0, 120) + '...',
      null,
      newAnn.priority,
      'Municipal Administration'
    );
    setNotifications(prev => [notif, ...prev]);

    const auditEntry = createAuditLog(
      { name: 'Municipal Officer', role: 'Officer', department: 'Administration' },
      'PUBLIC_ANNOUNCEMENT_PUBLISHED',
      newAnn.id,
      'Announcement',
      null,
      { title: newAnn.title, priority: newAnn.priority }
    );
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  // Municipal Permissions & Licensing State
  const [permissionApplications, setPermissionApplications] = useState(() => {
    const saved = localStorage.getItem('kpg_permissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    return [
      {
        id: 'PERM-2026-9041',
        category: 'Residential',
        permissionType: 'New House Construction',
        applicantName: 'Ramesh Deshmukh',
        applicantEmail: 'citizen@kopargaon.gov.in',
        applicantPhone: '+91 98765 43210',
        aadhaarNumber: '1234-5678-9012',
        propertyNumber: 'KPG-PROP-4218',
        propertyAddress: 'Shivaji Chowk, Ward 4, Kopargaon',
        wardNumber: 4,
        estimatedCost: '18,50,000',
        proposedDuration: '8 Months',
        projectDescription: 'Construction of G+1 residential bungalow with rainwater harvesting compliance.',
        status: 'Approved',
        certificateNumber: 'KMC-PERM-2026-9041',
        submittedAt: new Date(now - 14 * 24 * 3600 * 1000).toISOString(),
        approvedAt: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
        inspectionLog: {
          fieldRemarks: 'Setbacks and structural boundary line verified compliant with Kopargaon Bye-laws.',
          inspectorSignature: 'Er. V. R. Thorat',
          inspectedAt: new Date(now - 4 * 24 * 3600 * 1000).toISOString()
        }
      },
      {
        id: 'PERM-2026-9088',
        category: 'Commercial',
        permissionType: 'Shop Construction',
        applicantName: 'Priya Sharma',
        applicantEmail: 'priya.s@kopargaon.gov.in',
        applicantPhone: '+91 98220 11223',
        aadhaarNumber: '9876-5432-1098',
        propertyNumber: 'KPG-PROP-1102',
        propertyAddress: 'Station Road Market, Ward 2',
        wardNumber: 2,
        estimatedCost: '8,00,000',
        proposedDuration: '4 Months',
        projectDescription: 'Commercial retail shop renovation and frontage modification.',
        status: 'Inspection Scheduled',
        submittedAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
        scheduledInspectionDate: new Date(now + 24 * 3600 * 1000).toISOString().split('T')[0]
      },
      {
        id: 'PERM-2026-9102',
        category: 'Business',
        permissionType: 'Trade License',
        applicantName: 'Anil Kulkarni',
        applicantEmail: 'anil.k@kopargaon.gov.in',
        applicantPhone: '+91 98500 44332',
        aadhaarNumber: '4455-6677-8899',
        propertyNumber: 'KPG-PROP-3310',
        propertyAddress: 'MG Road Commercial Complex, Ward 6',
        wardNumber: 6,
        estimatedCost: '2,50,000',
        proposedDuration: '1 Year Renewal',
        projectDescription: 'Annual Trade License for General Provisions & Grocery Outlet.',
        status: 'Submitted',
        submittedAt: new Date(now - 12 * 3600 * 1000).toISOString()
      }
    ];
  });

  // Municipal Tax & Revenue Records State
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
        id: 'TAX-2026-8812',
        citizenId: 'CIT-8821',
        citizenName: 'Ramesh Deshmukh',
        citizenEmail: 'citizen@kopargaon.gov.in',
        propertyNumber: 'KPG-PROP-4218',
        address: 'Shivaji Chowk, Ward 4, Kopargaon',
        ward: 4,
        taxCategory: 'Property Tax',
        amount: 4500,
        penalty: 0,
        status: 'Unpaid',
        billNumber: 'BILL-2026-8812',
        dueDate: new Date(now + 20 * 24 * 3600 * 1000).toISOString(),
        createdAt: new Date(now - 10 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'TAX-2026-8813',
        citizenId: 'CIT-8821',
        citizenName: 'Ramesh Deshmukh',
        citizenEmail: 'citizen@kopargaon.gov.in',
        propertyNumber: 'KPG-PROP-4218',
        address: 'Shivaji Chowk, Ward 4, Kopargaon',
        ward: 4,
        taxCategory: 'Water Tax',
        amount: 1200,
        penalty: 0,
        status: 'Paid',
        billNumber: 'BILL-2026-8813',
        receiptNumber: 'REC-2026-9941',
        paidAt: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
        dueDate: new Date(now + 15 * 24 * 3600 * 1000).toISOString(),
        createdAt: new Date(now - 25 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'TAX-2026-8840',
        citizenId: 'CIT-7712',
        citizenName: 'Priya Sharma',
        citizenEmail: 'priya.s@kopargaon.gov.in',
        propertyNumber: 'KPG-PROP-1102',
        address: 'Station Road Market, Ward 2',
        ward: 2,
        taxCategory: 'Trade License Fees',
        amount: 3200,
        penalty: 250,
        status: 'Unpaid',
        billNumber: 'BILL-2026-8840',
        dueDate: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
        createdAt: new Date(now - 35 * 24 * 3600 * 1000).toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kpg_permissions', JSON.stringify(permissionApplications));
  }, [permissionApplications]);

  useEffect(() => {
    localStorage.setItem('kpg_tax_records', JSON.stringify(taxRecords));
  }, [taxRecords]);

  // Permission Application Actions
  const submitPermissionApplication = (data) => {
    const newId = `PERM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: newId,
      category: data.category || 'Residential',
      permissionType: data.permissionType || 'New House Construction',
      applicantName: data.applicantName || citizenUser?.name || 'Citizen Applicant',
      applicantEmail: data.applicantEmail || citizenUser?.email || 'citizen@kopargaon.gov.in',
      applicantPhone: data.applicantPhone || '+91 98000 00000',
      aadhaarNumber: data.aadhaarNumber || '1234-5678-9012',
      propertyNumber: data.propertyNumber || 'KPG-PROP-NEW',
      propertyAddress: data.propertyAddress || 'Kopargaon',
      wardNumber: parseInt(data.wardNumber) || 4,
      estimatedCost: data.estimatedCost || '10,00,000',
      proposedDuration: data.proposedDuration || '6 Months',
      projectDescription: data.projectDescription || '',
      uploadedDocs: data.uploadedDocs || {},
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    };

    setPermissionApplications(prev => [newApp, ...prev]);

    const auditEntry = createAuditLog(
      { name: newApp.applicantName, role: 'Citizen', department: 'Resident' },
      'PERMISSION_APPLICATION_SUBMITTED',
      newApp.id,
      'PermissionApplication',
      null,
      { category: newApp.category, type: newApp.permissionType }
    );
    setAuditLogs(prev => [auditEntry, ...prev]);

    const notif = createNotification(
      'officer',
      `New Permission Application #${newApp.id}`,
      `${newApp.permissionType} application submitted by ${newApp.applicantName} in Ward ${newApp.wardNumber}.`,
      null,
      'Normal',
      'Town Planning & Licensing'
    );
    setNotifications(prev => [notif, ...prev]);

    showToast(`Permission Application ${newId} Submitted Successfully! SLA tracking active.`);
    return newApp;
  };

  const updatePermissionStatus = (id, newStatus, note = '') => {
    const now = new Date().toISOString();

    setPermissionApplications(prev => prev.map(app => {
      if (app.id === id) {
        const certNumber = newStatus === 'Approved' ? (app.certificateNumber || `KMC-PERM-2026-${app.id.replace(/\D/g, '')}`) : app.certificateNumber;

        const auditEntry = createAuditLog(
          { name: officerUser?.name || 'Municipal Officer', role: 'Officer', department: 'Town Planning' },
          'PERMISSION_STATUS_UPDATED',
          id,
          'PermissionApplication',
          { status: app.status },
          { status: newStatus, note, certNumber }
        );
        setAuditLogs(prevAudit => [auditEntry, ...prevAudit]);

        const notif = createNotification(
          'citizen',
          `Permission Application #${id} Update`,
          `Your application status has been changed to "${newStatus}". Note: ${note || 'Updated by Town Planning Authority.'}`,
          null,
          'Normal',
          'Town Planning'
        );
        setNotifications(prevNotif => [notif, ...prevNotif]);

        return {
          ...app,
          status: newStatus,
          certificateNumber: certNumber,
          approvedAt: newStatus === 'Approved' ? now : app.approvedAt,
          updatedAt: now
        };
      }
      return app;
    }));

    showToast(`Application #${id} status updated to ${newStatus}`);
  };

  const scheduleInspection = (id, inspectionData) => {
    setPermissionApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: 'Inspection Scheduled',
          scheduledInspectionDate: inspectionData.scheduledDate,
          assignedInspector: inspectionData.inspectorName,
          inspectionNotes: inspectionData.notes
        };
      }
      return app;
    }));

    const auditEntry = createAuditLog(
      { name: officerUser?.name || 'Municipal Officer', role: 'Officer', department: 'Town Planning' },
      'INSPECTION_SCHEDULED',
      id,
      'PermissionApplication',
      null,
      inspectionData
    );
    setAuditLogs(prev => [auditEntry, ...prev]);

    showToast(`Inspection scheduled for Application #${id} on ${inspectionData.scheduledDate}`);
  };

  const submitInspectionReport = (id, reportData) => {
    setPermissionApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: reportData.inspectionResult === 'Passed' ? 'Inspection Completed' : 'Under Review',
          inspectionLog: reportData
        };
      }
      return app;
    }));

    const auditEntry = createAuditLog(
      { name: reportData.inspectorSignature || 'Field Inspector', role: 'Officer', department: 'Engineering' },
      'INSPECTION_REPORT_SUBMITTED',
      id,
      'PermissionInspection',
      null,
      reportData
    );
    setAuditLogs(prev => [auditEntry, ...prev]);

    showToast(`Field Inspection Report logged for Application #${id}. Findings: ${reportData.inspectionResult}`);
  };

  // Municipal Tax & Revenue Actions
  const createTaxRecord = (data) => {
    const newId = `TAX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const billNumber = `BILL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTax = {
      id: newId,
      citizenId: citizenUser?.id || 'CIT-8821',
      citizenName: data.citizenName || 'Ramesh Deshmukh',
      citizenEmail: data.citizenEmail || 'citizen@kopargaon.gov.in',
      propertyNumber: data.propertyNumber || 'KPG-PROP-4218',
      address: data.address || 'Shivaji Chowk, Ward 4, Kopargaon',
      ward: parseInt(data.ward) || 4,
      taxCategory: data.taxCategory || 'Property Tax',
      amount: parseInt(data.amount) || 2500,
      penalty: 0,
      status: 'Unpaid',
      billNumber: billNumber,
      dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    setTaxRecords(prev => [newTax, ...prev]);

    const auditEntry = createAuditLog(
      { name: officerUser?.name || 'Revenue Officer', role: 'Officer', department: 'Treasury' },
      'TAX_ASSESSMENT_CREATED',
      newTax.id,
      'TaxRecord',
      null,
      { amount: newTax.amount, category: newTax.taxCategory }
    );
    setAuditLogs(prev => [auditEntry, ...prev]);

    const notif = createNotification(
      'citizen',
      `New Tax Demand Bill #${newTax.billNumber}`,
      `A new ${newTax.taxCategory} demand bill for ₹${newTax.amount} has been issued for your property in Ward ${newTax.ward}.`,
      null,
      'High',
      'Tax & Revenue'
    );
    setNotifications(prev => [notif, ...prev]);

    showToast(`Created Tax Assessment ${newId}! Demand bill ${billNumber} issued.`);
    return newTax;
  };

  const processTaxPayment = (taxId, paymentMethod = 'UPI') => {
    const now = new Date().toISOString();
    const receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setTaxRecords(prev => prev.map(t => {
      if (t.id === taxId) {
        const auditEntry = createAuditLog(
          { name: t.citizenName, role: 'Citizen', department: 'Resident' },
          'TAX_PAYMENT_PROCESSED',
          taxId,
          'TaxPayment',
          { status: t.status },
          { status: 'Paid', receiptNumber, paymentMethod }
        );
        setAuditLogs(prevAudit => [auditEntry, ...prevAudit]);

        const notif = createNotification(
          'citizen',
          `Tax Payment Successful - Receipt #${receiptNumber}`,
          `Payment of ₹${t.amount + (t.penalty || 0)} for ${t.taxCategory} completed successfully via ${paymentMethod}.`,
          null,
          'Normal',
          'Tax Treasury'
        );
        setNotifications(prevNotif => [notif, ...prevNotif]);

        return {
          ...t,
          status: 'Paid',
          receiptNumber: receiptNumber,
          paymentMethod: paymentMethod,
          paidAt: now
        };
      }
      return t;
    }));

    showToast(`Payment recorded successfully! Official Receipt ${receiptNumber} generated.`);
  };

  const updateAnnouncement = (id, data) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const archiveAnnouncement = (id) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: 'Archived' } : a));
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      registeredCitizens,
      citizenUser,
      officerUser,
      activeGovernanceRole,
      setActiveGovernanceRole,
      complaints,
      permissionApplications,
      taxRecords,
      notifications,
      announcements,
      auditLogs,
      toastMessage,
      showToast,
      registerCitizen,
      loginCitizen,
      resetCitizenPassword,
      logoutCitizen,
      loginOfficer,
      logoutOfficer,
      addComplaint,
      updateComplaintStatus,
      assignComplaint,
      submitCompletionReport,
      issueOfficerWarning,
      requestExplanation,
      submitPermissionApplication,
      updatePermissionStatus,
      scheduleInspection,
      submitInspectionReport,
      createTaxRecord,
      processTaxPayment,
      addAnnouncement,
      updateAnnouncement,
      archiveAnnouncement,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
