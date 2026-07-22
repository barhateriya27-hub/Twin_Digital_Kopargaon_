import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialComplaints = [
  {
    id: 'KPG-2026-1042',
    title: 'Major Pipeline Leakage Near Municipal High School',
    category: 'Water Leakage',
    description: 'High pressure water pipe ruptured causing waterlogging on main road. Approximately 5,000L water wasted per hour.',
    ward: 4,
    locationName: 'Station Road, Ward 4',
    status: 'In Progress',
    priority: 'Critical',
    department: 'Water Supply',
    assignedOfficer: 'Er. Rajesh Deshmukh',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Amit Patil',
    createdAt: '2026-07-19T09:30:00Z',
    updatedAt: '2026-07-20T10:15:00Z',
    aiConfidence: 99.2,
    timeline: [
      { status: 'Pending', timestamp: '2026-07-19T09:30:00Z', note: 'Grievance submitted by citizen.' },
      { status: 'Assigned', timestamp: '2026-07-19T10:00:00Z', note: 'AI Auto-classified as Critical Water Leakage. Routed to Water Dept.' },
      { status: 'In Progress', timestamp: '2026-07-20T08:00:00Z', note: 'Maintenance crew deployed on site with valve isolation units.' }
    ]
  },
  {
    id: 'KPG-2026-1041',
    title: 'Uncollected Commercial Garbage Overflow',
    category: 'Garbage',
    description: 'Waste bin overflowing behind Market Yard. Poses severe health risk and attracts stray animals.',
    ward: 7,
    locationName: 'Subhash Road Market, Ward 7',
    status: 'Assigned',
    priority: 'High',
    department: 'Sanitation',
    assignedOfficer: 'Officer Ramesh Kulkarni',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Priya Sharma',
    createdAt: '2026-07-20T07:15:00Z',
    updatedAt: '2026-07-20T08:30:00Z',
    aiConfidence: 96.5,
    timeline: [
      { status: 'Pending', timestamp: '2026-07-20T07:15:00Z', note: 'Submitted via Citizen Mobile Portal.' },
      { status: 'Assigned', timestamp: '2026-07-20T08:30:00Z', note: 'Assigned to Ward 7 Sanitation Fleet Truck #04.' }
    ]
  },
  {
    id: 'KPG-2026-1039',
    title: 'Deep Pothole at Godavari Bridge Approach Road',
    category: 'Pothole',
    description: 'Dangerous 2ft pothole causing severe traffic slowdowns and bike hazard.',
    ward: 12,
    locationName: 'Godavari Bridge South Side, Ward 12',
    status: 'Pending',
    priority: 'Medium',
    department: 'Public Works (PWD)',
    assignedOfficer: null,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Sanjay Pawar',
    createdAt: '2026-07-20T11:45:00Z',
    updatedAt: '2026-07-20T11:45:00Z',
    aiConfidence: 94.1,
    timeline: [
      { status: 'Pending', timestamp: '2026-07-20T11:45:00Z', note: 'Logged in system. AI classification pending officer validation.' }
    ]
  },
  {
    id: 'KPG-2026-1035',
    title: 'Non-Functional LED Street Lights (5 Poles)',
    category: 'Street Light',
    description: 'Entire stretch of Bypass Road dark for 3 consecutive nights. Safety concern.',
    ward: 18,
    locationName: 'Shirdi Highway Bypass, Ward 18',
    status: 'Resolved',
    priority: 'Medium',
    department: 'Electrical',
    assignedOfficer: 'Tech. Vikas Shinde',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Kavita Joshi',
    createdAt: '2026-07-18T14:00:00Z',
    updatedAt: '2026-07-19T17:30:00Z',
    aiConfidence: 98.9,
    timeline: [
      { status: 'Pending', timestamp: '2026-07-18T14:00:00Z', note: 'Reported by resident.' },
      { status: 'Assigned', timestamp: '2026-07-18T15:20:00Z', note: 'Routed to Ward 18 Electrical Maintenance.' },
      { status: 'In Progress', timestamp: '2026-07-19T09:00:00Z', note: 'Transformer breaker replaced.' },
      { status: 'Resolved', timestamp: '2026-07-19T17:30:00Z', note: 'All 5 LED luminaires operational and verified via IoT sensor telemetry.' }
    ]
  },
  {
    id: 'KPG-2026-1030',
    title: 'Traffic Signal Malfunction at Bus Stand Junction',
    category: 'Traffic',
    description: 'Red light stuck on permanent loop causing 1.5km tailback during peak hours.',
    ward: 2,
    locationName: 'MSRTC Central Bus Stand, Ward 2',
    status: 'In Progress',
    priority: 'High',
    department: 'Traffic & Transit',
    assignedOfficer: 'Insp. Sunil More',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Rahul Gawali',
    createdAt: '2026-07-20T08:00:00Z',
    updatedAt: '2026-07-20T09:10:00Z',
    aiConfidence: 97.8,
    timeline: [
      { status: 'Pending', timestamp: '2026-07-20T08:00:00Z', note: 'Reported by local commuter.' },
      { status: 'Assigned', timestamp: '2026-07-20T08:15:00Z', note: 'Traffic cell notified.' },
      { status: 'In Progress', timestamp: '2026-07-20T09:10:00Z', note: 'Manual traffic override engaged; signal controller board replacement underway.' }
    ]
  }
];

const initialAlerts = [
  {
    id: 'ALT-101',
    title: 'Scheduled Water Supply Interruption',
    type: 'warning',
    message: 'Maintenance at Godavari Water Works on July 22, 06:00 to 14:00. Wards 1 to 10 affected.',
    timestamp: '2 hours ago',
    ward: 'Wards 1-10'
  },
  {
    id: 'ALT-102',
    title: 'Heavy Rainfall & River Level Watch',
    type: 'critical',
    message: 'Godavari river discharge increased to 22,000 cusecs. Low-lying area sensors active.',
    timestamp: '5 hours ago',
    ward: 'Wards 11, 12 & River Bank'
  },
  {
    id: 'ALT-103',
    title: 'Smart Waste Collection Drive',
    type: 'info',
    message: 'Special wet waste segregator trucks deployed across Wards 15-28 today.',
    timestamp: '1 day ago',
    ward: 'Wards 15-28'
  }
];

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

  // Citizen state
  const [citizenUser, setCitizenUser] = useState(() => {
    const saved = localStorage.getItem('kpg_citizen_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Officer state
  const [officerUser, setOfficerUser] = useState(() => {
    const saved = localStorage.getItem('kpg_officer_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Complaints
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('kpg_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  // Toast System
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ id: Date.now(), message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    localStorage.setItem('kpg_complaints', JSON.stringify(complaints));
  }, [complaints]);

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

  // Auth actions
  const loginCitizen = (email, password) => {
    const user = {
      name: 'Dr. Sameer Kulkarni',
      email: email || 'citizen@kopargaon.gov.in',
      phone: '+91 98220 12345',
      ward: 4,
      address: 'Plot 42, Sai Nagar, Kopargaon - 423601'
    };
    setCitizenUser(user);
    showToast(`Welcome back, ${user.name}!`);
    return true;
  };

  const registerCitizen = (data) => {
    const user = {
      name: data.fullName || 'New Resident',
      email: data.email,
      phone: data.mobile,
      ward: parseInt(data.wardNumber) || 4,
      address: data.address || 'Kopargaon, Ward 4'
    };
    setCitizenUser(user);
    showToast('Registration Successful! Automatically logged in.');
    return true;
  };

  const logoutCitizen = () => {
    setCitizenUser(null);
    showToast('Logged Out Successfully', 'info');
  };

  const loginOfficer = (officerId, password) => {
    if (officerId === 'admin' && password === 'admin123') {
      const officer = {
        officerId: 'admin',
        name: 'Chief Officer A. K. Verma',
        role: 'Smart City Director',
        department: 'Municipal Headquarters',
        badge: 'KMC-OFFICER-001'
      };
      setOfficerUser(officer);
      showToast('Municipal Officer Clearance Verified. Welcome to Control Center.');
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

  // Complaint actions
  const addComplaint = (newCompData) => {
    const categoriesMap = {
      'Garbage': 'Sanitation',
      'Pothole': 'Public Works (PWD)',
      'Water Leakage': 'Water Supply',
      'Street Light': 'Electrical',
      'Traffic': 'Traffic & Transit'
    };

    const newId = `KPG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = newCompData.category || 'Garbage';
    const dept = categoriesMap[category] || 'Public Works (PWD)';
    const now = new Date().toISOString();

    const created = {
      id: newId,
      title: newCompData.title,
      category: category,
      description: newCompData.description,
      ward: parseInt(newCompData.ward) || citizenUser?.ward || 4,
      locationName: newCompData.locationName || `Ward ${newCompData.ward || 4}, Kopargaon`,
      status: 'Pending',
      priority: newCompData.priority || 'High',
      department: dept,
      assignedOfficer: null,
      imageUrl: newCompData.imageUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
      submittedBy: citizenUser ? citizenUser.name : 'Resident Citizen',
      createdAt: now,
      updatedAt: now,
      aiConfidence: (92 + Math.random() * 7).toFixed(1),
      timeline: [
        { status: 'Pending', timestamp: now, note: `Submitted via Citizen Portal. AI Classified into ${dept}.` }
      ]
    };

    setComplaints(prev => [created, ...prev]);
    showToast(`Complaint ${newId} Submitted Successfully!`);
    return created;
  };

  const updateComplaintStatus = (id, newStatus, note = '', officerName = null) => {
    const now = new Date().toISOString();
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const updatedTimeline = [
          ...c.timeline,
          { status: newStatus, timestamp: now, note: note || `Status updated to ${newStatus}` }
        ];
        return {
          ...c,
          status: newStatus,
          assignedOfficer: officerName || c.assignedOfficer,
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
        return {
          ...c,
          status: 'Assigned',
          assignedOfficer: officerName,
          department: department || c.department,
          updatedAt: now,
          timeline: [
            ...c.timeline,
            { status: 'Assigned', timestamp: now, note: `Assigned to ${officerName} (${department || c.department})` }
          ]
        };
      }
      return c;
    }));
    showToast(`Assigned ${id} to ${officerName}`);
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      citizenUser,
      officerUser,
      complaints,
      cityAlerts: initialAlerts,
      toastMessage,
      showToast,
      loginCitizen,
      registerCitizen,
      logoutCitizen,
      loginOfficer,
      logoutOfficer,
      addComplaint,
      updateComplaintStatus,
      assignComplaint
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
