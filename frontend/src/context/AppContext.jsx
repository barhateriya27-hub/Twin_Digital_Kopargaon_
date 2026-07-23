import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Complaints state
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('kpg_complaints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasMockData = parsed.some(c => c.id && c.id.startsWith('KPG-2026-104'));
        if (hasMockData) {
          localStorage.removeItem('kpg_complaints');
          return [];
        }
        return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // System Alerts state
  const [cityAlerts, setCityAlerts] = useState([]);

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
      name: 'Registered Resident',
      email: email || 'citizen@kopargaon.gov.in',
      phone: '+91 98000 00000',
      ward: 1,
      address: 'Kopargaon Municipal District'
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
      ward: parseInt(data.wardNumber) || 1,
      address: data.address || 'Kopargaon'
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
    if ((officerId === 'kpg' && password === 'kpg@123') || (officerId === 'admin' && password === 'admin123')) {
      const officer = {
        officerId: officerId,
        name: 'Municipal Administrator',
        role: 'Smart City Commissioner',
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

    const wardNum = parseInt(newCompData.ward) || citizenUser?.ward || 1;
    const newId = `KPG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = newCompData.category || 'Garbage';
    const dept = categoriesMap[category] || 'Public Works (PWD)';
    const now = new Date().toISOString();

    // Generate accurate Kopargaon spatial coordinates
    const latOffset = (wardNum % 4) * 0.006 - 0.009;
    const lngOffset = Math.floor(wardNum / 4) * 0.006 - 0.009;
    const latitude = Number((19.8833 + latOffset).toFixed(4));
    const longitude = Number((74.4833 + lngOffset).toFixed(4));

    const created = {
      id: newId,
      title: newCompData.title,
      category: category,
      description: newCompData.description,
      ward: wardNum,
      locationName: newCompData.locationName || `Ward ${wardNum}, Kopargaon, Maharashtra`,
      latitude: latitude,
      longitude: longitude,
      status: 'Pending',
      priority: newCompData.priority || 'High',
      department: dept,
      assignedOfficer: null,
      imageUrl: newCompData.imageUrl || '',
      submittedBy: citizenUser ? citizenUser.name : 'Resident Citizen',
      createdAt: now,
      updatedAt: now,
      timeline: [
        { status: 'Pending', timestamp: now, note: `Submitted via Citizen Portal. Categorized into ${dept}.` }
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
          status: 'In Progress',
          assignedOfficer: officerName,
          department: department || c.department,
          updatedAt: now,
          timeline: [
            ...c.timeline,
            { status: 'In Progress', timestamp: now, note: `Assigned to ${officerName} (${department || c.department})` }
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
      cityAlerts,
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
