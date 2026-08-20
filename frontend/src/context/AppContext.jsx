import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateSLADueDate } from '../utils/governanceUtils';
import { isTokenValid } from '../utils/jwtUtils';
import { fetchInfrastructureAssets, fetchLiveSensors, fetchMunicipalTeams, fetchCityOverview } from '../services/digitalTwinService';
import { fetchKopargaonWeather } from '../services/weatherService';

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

  // JWT Token State for Citizen and Municipal Officer / Admin Sessions
  const [citizenToken, setCitizenToken] = useState(() => {
    const token = localStorage.getItem('kpg_citizen_token');
    return isTokenValid(token) ? token : null;
  });

  // Active Citizen User State
  const [citizenUser, setCitizenUser] = useState(() => {
    const saved = localStorage.getItem('kpg_citizen_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.fullName)) {
          return { role: 'citizen', ...parsed };
        }
      } catch (e) {}
    }
    return null;
  });

  const [officerToken, setOfficerToken] = useState(() => {
    const token = localStorage.getItem('kpg_officer_token');
    return isTokenValid(token) ? token : null;
  });

  // Officer / Admin User State
  const [officerUser, setOfficerUser] = useState(() => {
    const saved = localStorage.getItem('kpg_officer_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.officerId)) {
          return { role: parsed.role || 'officer', ...parsed };
        }
      } catch (e) {}
    }
    return null;
  });

  // Session Expired State
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Validate active JWT tokens on focus and interval
  useEffect(() => {
    const validateSessions = () => {
      const cToken = localStorage.getItem('kpg_citizen_token');
      if (cToken && !isTokenValid(cToken)) {
        setCitizenToken(null);
        setCitizenUser(null);
        localStorage.removeItem('kpg_citizen_token');
        localStorage.removeItem('kpg_citizen_user');
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

  // Clean Transactional States (No local storage fallback/mock seeding)
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [permissionApplications, setPermissionApplications] = useState([]);
  const [taxRecords, setTaxRecords] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Weather Telemetry State
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [weatherRefreshStatus, setWeatherRefreshStatus] = useState('');

  // Toast notifications helper
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (message, type = 'success') => {
    setToastMessage({ id: Date.now(), message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

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
      } else if (type === 'TAX_CREATED') {
        setTaxRecords(prev => {
          if (prev.some(t => t.id === payload.id)) return prev;
          return [payload, ...prev];
        });
      } else if (type === 'TAX_PAID') {
        setTaxRecords(prev => prev.map(t => t.id === payload.id ? { ...t, ...payload } : t));
      } else if (type === 'PERMISSION_CREATED') {
        setPermissionApplications(prev => {
          if (prev.some(p => p.id === payload.id)) return prev;
          return [payload, ...prev];
        });
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

  // Load Initial Unified Data from Backend APIs dynamically
  const loadUnifiedData = async () => {
    try {
      const [assetsData, sensorsData, teamsData, overviewData] = await Promise.all([
        fetchInfrastructureAssets().catch(() => []),
        fetchLiveSensors().catch(() => []),
        fetchMunicipalTeams().catch(() => []),
        fetchCityOverview().catch(() => null)
      ]);

      if (assetsData && assetsData.length > 0) setAssets(assetsData);
      if (sensorsData && sensorsData.length > 0) setSensors(sensorsData);
      if (teamsData && teamsData.length > 0) setTeams(teamsData);
      if (overviewData) setCityOverview(overviewData);

      // Fetch transactional states dynamically based on JWT token
      if (citizenToken) {
        const headers = { 'Authorization': `Bearer ${citizenToken}` };
        const [cRes, pRes, tRes, nRes] = await Promise.all([
          fetch('/api/complaints', { headers }),
          fetch('/api/permissions', { headers }),
          fetch('/api/taxes', { headers }),
          fetch('/api/notifications', { headers })
        ]);

        const [cData, pData, tData, nData] = await Promise.all([
          cRes.json().catch(() => ({ success: false })),
          pRes.json().catch(() => ({ success: false })),
          tRes.json().catch(() => ({ success: false })),
          nRes.json().catch(() => ({ success: false }))
        ]);

        if (cData.success) setComplaints(cData.data || []);
        if (pData.success) setPermissionApplications(pData.permissions || []);
        if (tData.success) setTaxRecords(tData.taxes || []);
        if (nData.success) setNotifications(nData.data || []);
      } else if (officerToken) {
        const headers = { 'Authorization': `Bearer ${officerToken}` };
        const isAdmin = officerUser && officerUser.role === 'admin';

        const fetches = [
          fetch('/api/complaints', { headers }),
          fetch('/api/permissions', { headers }),
          fetch('/api/taxes', { headers }),
          fetch('/api/notifications', { headers })
        ];

        if (isAdmin) {
          fetches.push(fetch('/api/audit-logs', { headers }));
        }

        const responses = await Promise.all(fetches);
        const [cData, pData, tData, nData] = await Promise.all([
          responses[0].json().catch(() => ({ success: false })),
          responses[1].json().catch(() => ({ success: false })),
          responses[2].json().catch(() => ({ success: false })),
          responses[3].json().catch(() => ({ success: false }))
        ]);

        if (cData.success) setComplaints(cData.data || []);
        if (pData.success) setPermissionApplications(pData.permissions || []);
        if (tData.success) setTaxRecords(tData.taxes || []);
        if (nData.success) setNotifications(nData.data || []);

        if (isAdmin && responses[4]) {
          const aData = await responses[4].json().catch(() => ({ success: false }));
          if (aData.success) setAuditLogs(aData.data || []);
        }
      }
    } catch (e) {
      console.warn('[API Load Error] Connection error during initial load:', e.message);
    }
  };

  useEffect(() => {
    loadUnifiedData();
    const interval = setInterval(loadUnifiedData, 20000);
    return () => clearInterval(interval);
  }, [citizenToken, officerToken]);

  // Synchronize User objects in LocalStorage (only auth credentials)
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

      showToast(`Account Created Successfully! Welcome to Kopargaon Citizen Portal, ${user.name}.`);
      return true;
    } catch (err) {
      showToast('Registration failed. Database / API server is unreachable.', 'error');
      return false;
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
      showToast('Login failed. Database / API server is unreachable.', 'error');
      return false;
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
      showToast('Officer login failed. Database / API server is unreachable.', 'error');
      return false;
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

    try {
      const response = await fetch('/api/citizens/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify(updatedUser)
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Profile update failed.', 'error');
        return false;
      }

      setCitizenUser(resData.user);
      localStorage.setItem('kpg_citizen_user', JSON.stringify(resData.user));
      showToast('Profile updated successfully!');
      return true;
    } catch (e) {
      showToast('Profile update failed. Connection error.', 'error');
      return false;
    }
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
      showToast('Password reset failed. Backend service is offline.', 'error');
      return false;
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
    setComplaints([]);
    setPermissionApplications([]);
    setTaxRecords([]);
    setNotifications([]);
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
    setComplaints([]);
    setPermissionApplications([]);
    setTaxRecords([]);
    setNotifications([]);
    setAuditLogs([]);
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

  const addNotification = (title, description, recipientRole = 'citizen', priority = 'Normal', department = 'General') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      recipientRole,
      title,
      description,
      priority,
      department,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const checkAndGenerateWeatherNotifications = (weather) => {
    if (!weather) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const lastAlertDate = localStorage.getItem('kpg_last_weather_alert_date');
    if (lastAlertDate === todayStr) return; // Already alerted today, don't spam

    let alertTitle = '';
    let alertDesc = '';
    let isSignificant = false;

    if (weather.temperature > 39) {
      alertTitle = '⚠️ Extreme Heat Advisory';
      alertDesc = `High temperatures of ${weather.temperature}°C expected in Kopargaon today. Stay hydrated and avoid direct sunlight.`;
      isSignificant = true;
    } else if (weather.rainfall > 4 || (weather.rainProbability > 85 && weather.conditionText.toLowerCase().includes('rain'))) {
      alertTitle = '🌧️ Heavy Rain Alert';
      alertDesc = `Heavy rain is expected in Kopargaon. Drive safely, avoid low-lying underpasses, and expect minor traffic delays.`;
      isSignificant = true;
    } else if (weather.windSpeed > 30) {
      alertTitle = '💨 Strong Wind Advisory';
      alertDesc = `Strong winds of ${weather.windSpeed} km/h detected. Secure loose outdoor objects and stay clear of weak structures.`;
      isSignificant = true;
    }

    if (isSignificant) {
      addNotification(alertTitle, alertDesc, 'citizen', 'High', 'Emergency Management');
      localStorage.setItem('kpg_last_weather_alert_date', todayStr);
    }
  };

  const refreshWeather = async (silent = false) => {
    if (!silent) {
      setLoadingWeather(true);
      setWeatherRefreshStatus('Updating live weather data...');
    }
    try {
      const data = await fetchKopargaonWeather();
      if (data && data.success) {
        setWeatherData(data);
        setWeatherError(null);
        checkAndGenerateWeatherNotifications(data);
        if (!silent) {
          setWeatherRefreshStatus('Weather updated successfully.');
          setTimeout(() => setWeatherRefreshStatus(''), 3000);
        }
      } else {
        setWeatherError(data?.error || 'Weather data is temporarily unavailable. Please try again.');
        if (!silent) setWeatherRefreshStatus('');
      }
    } catch (e) {
      setWeatherError('Weather data is temporarily unavailable. Please try again.');
      if (!silent) setWeatherRefreshStatus('');
    } finally {
      if (!silent) setLoadingWeather(false);
    }
  };

  // Weather Initialization & Periodic Refresh
  useEffect(() => {
    refreshWeather(true);
    const interval = setInterval(() => {
      refreshWeather(true);
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const addComplaint = async (newCompData) => {
    const categoriesMap = {
      'Garbage': 'Sanitation & Solid Waste Management',
      'Pothole': 'Public Works (PWD)',
      'Water Leakage': 'Water Supply & Sewerage Department',
      'Street Light': 'Electrical & Street Lighting',
      'Traffic': 'Town Planning & Transit'
    };

    const wardNum = parseInt(newCompData.ward) || citizenUser?.ward || 4;
    const category = newCompData.category || 'Garbage';
    const dept = categoriesMap[category] || 'Public Works (PWD)';

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          category: category,
          title: newCompData.title,
          description: newCompData.description,
          department: dept,
          priority: newCompData.priority || 'High',
          ward: wardNum,
          address: newCompData.locationName || `Ward ${wardNum}, Kopargaon`,
          imageUrl: newCompData.imageUrl || ''
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to submit complaint.', 'error');
        return null;
      }

      const created = resData.data;
      setComplaints(prev => [created, ...prev]);
      showToast(`Complaint ${created.id} Submitted Successfully! SLA tracking active.`);
      
      const overview = await fetchCityOverview().catch(() => null);
      if (overview) setCityOverview(overview);

      return created;
    } catch (err) {
      showToast('Failed to submit complaint. Database is unreachable.', 'error');
      return null;
    }
  };

  const assignComplaint = async (id, assignedOfficer, note = '') => {
    try {
      const response = await fetch(`/api/complaints/${id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${officerToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ assignedOfficer, note })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to assign complaint.', 'error');
        return false;
      }

      const updated = resData.data;
      setComplaints(prev => prev.map(c => c.id === id ? updated : c));
      showToast(`Ticket #${id} assigned to ${assignedOfficer}`, 'info');
      
      const overview = await fetchCityOverview().catch(() => null);
      if (overview) setCityOverview(overview);

      return true;
    } catch (err) {
      showToast('Failed to assign complaint. Connection error.', 'error');
      return false;
    }
  };

  const updateComplaintStatus = async (id, newStatus, note = '', officerName = null) => {
    try {
      const response = await fetch(`/api/complaints/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${officerToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, note, assignedOfficer: officerName })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to update status.', 'error');
        return false;
      }

      const updated = resData.data;
      setComplaints(prev => prev.map(c => c.id === id ? updated : c));
      showToast(`Ticket #${id} updated to ${newStatus}`, 'info');

      const overview = await fetchCityOverview().catch(() => null);
      if (overview) setCityOverview(overview);

      return true;
    } catch (err) {
      showToast('Failed to update status. Connection error.', 'error');
      return false;
    }
  };

  const issueOfficerWarning = async (complaintId, officerName, note) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${officerToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'Escalated',
          note: `FORMAL WARNING ISSUED to ${officerName}: ${note}`
        })
      });
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to issue warning.', 'error');
        return false;
      }
      setComplaints(prev => prev.map(c => c.id === complaintId ? resData.data : c));
      showToast(`Formal Warning issued for Ticket #${complaintId}`, 'warning');
      return true;
    } catch (e) {
      showToast('Connection error issuing warning.', 'error');
      return false;
    }
  };

  const requestExplanation = async (complaintId, note) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${officerToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'Escalated',
          note: `EXPLANATION DEMANDED: ${note}`
        })
      });
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to request explanation.', 'error');
        return false;
      }
      setComplaints(prev => prev.map(c => c.id === complaintId ? resData.data : c));
      showToast(`Formal Explanation requested for Ticket #${complaintId}`, 'info');
      return true;
    } catch (e) {
      showToast('Connection error demanding explanation.', 'error');
      return false;
    }
  };

  const addPermissionApplication = async (data) => {
    try {
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          permissionType: data.permissionType,
          category: data.category,
          plotAreaSqFt: Number(data.plotAreaSqFt),
          ward: Number(data.ward),
          propertyAddress: data.propertyAddress,
          architectName: data.architectName,
          propertyNumber: data.propertyNumber || `KPG-PROP-${Math.floor(1000 + Math.random() * 9000)}`
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to submit application.', 'error');
        return null;
      }

      const created = resData.permission;
      setPermissionApplications(prev => [created, ...prev]);
      showToast(`Permission Application ${created.id} Submitted!`);
      return created;
    } catch (err) {
      showToast('Failed to submit building permission application.', 'error');
      return null;
    }
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

  const createTaxRecord = async (data) => {
    try {
      const response = await fetch('/api/taxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${officerToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          citizenId: data.citizenId || 'CIT-8821',
          citizenName: data.citizenName || 'Resident',
          citizenEmail: data.citizenEmail || 'citizen@kopargaon.gov.in',
          propertyNumber: data.propertyNumber || 'KPG-PROP-0000',
          address: data.address || 'Kopargaon',
          ward: Number(data.ward) || 4,
          taxCategory: data.taxCategory || 'Property Tax',
          amount: Number(data.amount) || 2500,
          dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to generate tax bill.', 'error');
        return null;
      }

      const created = resData.tax;
      setTaxRecords(prev => [created, ...prev]);
      showToast(`Tax Bill ${created.id} Created Successfully!`);
      return created;
    } catch (err) {
      showToast('Failed to generate tax bill. Connection error.', 'error');
      return null;
    }
  };

  const processTaxPayment = async (taxId, paymentMethod = 'UPI / NetBanking') => {
    try {
      const response = await fetch(`/api/taxes/${taxId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ paymentMethod })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.error || 'Failed to process tax payment.', 'error');
        return false;
      }

      const updated = resData.tax;
      setTaxRecords(prev => prev.map(t => t.id === taxId ? updated : t));
      showToast(`Tax Payment Received! Receipt #${updated.receiptNumber} generated.`);
      return true;
    } catch (err) {
      showToast('Failed to complete tax payment. Connection error.', 'error');
      return false;
    }
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
    issueOfficerWarning,
    requestExplanation,
    permissionApplications,
    addPermissionApplication,
    updatePermissionStatus,
    taxRecords,
    createTaxRecord,
    processTaxPayment,
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    weatherData,
    loadingWeather,
    weatherError,
    weatherRefreshStatus,
    refreshWeather,
    announcements,
    auditLogs,
    toastMessage,
    showToast,
    registeredCitizens: []
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
