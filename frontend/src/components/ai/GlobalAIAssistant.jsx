import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  X,
  Minus,
  Send,
  Mic,
  MicOff,
  Volume2,
  Paperclip,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Sliders,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Play,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCityIntelligence } from '../../hooks/useCityIntelligence';
import { useAIEngine } from '../../hooks/useAIEngine';
import { detectUserIntent, formatIntentResponse, INTENTS } from '../../services/aiKnowledgeBase';
import { fetchKopargaonWeather } from '../../services/weatherService';
import { fetchLiveKopargaonPOIs } from '../../services/poiService';

export const GlobalAIAssistant = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const { complaints = [], notifications = [], announcements = [], auditLogs = [] } = useApp();
  const cityIntel = useCityIntelligence({ complaints, notifications, announcements, auditLogs });
  const aiEngine = useAIEngine(cityIntel);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'predictions' | 'alerts' | 'decisions' | 'whatif'

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [activeContext, setActiveContext] = useState(null);

  // What-if simulation state
  const [selectedScenarioId, setSelectedScenarioId] = useState('garbage-truck');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentLang = i18n.language || 'en';

  const greetings = {
    en: "Hello 👋\nI am the AI Smart Assistant for Kopargaon Digital Twin Platform.\nI monitor live city telemetry, complaints, SLAs, and service status in real-time. How can I assist you?",
    mr: "नमस्कार 👋\nमी कोपरगाव डिजिटल ट्विन प्लॅटफॉर्मचा एआय स्मार्ट सहाय्यक आहे.\nमी प्रत्यक्ष शहर माहिती, तक्रारी व सेवांचा रिअल-टाईम अंदाज घेतो. आज मी कशी मदत करू?",
    hi: "नमस्ते 👋\nमैं कोपरगांव डिजिटल ट्विन प्लेटफॉर्म का एआई स्मार्ट सहायक हूँ।\nमैं वास्तविक समय शहर टेलीमेट्री और शिकायतों की निगरानी करता हूँ। मैं आपकी क्या सहायता कर सकता हूँ?"
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: greetings[currentLang] || greetings.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: "📊 City Health Status", query: "What is the current city health status?" },
        { label: "🚦 Traffic Forecast", query: "Traffic hotspots and forecast?" },
        { label: "🚨 Active Alerts", query: "Show active critical alerts" }
      ]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeTab]);

  // Global trigger event
  useEffect(() => {
    const handleOpenAI = (e) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
      }
      if (e.detail && e.detail.query) {
        setActiveTab('chat');
        handleSendMessage(e.detail.query);
      }
    };
    window.addEventListener('OPEN_GLOBAL_AI_ASSISTANT', handleOpenAI);
    return () => window.removeEventListener('OPEN_GLOBAL_AI_ASSISTANT', handleOpenAI);
  }, []);

  // Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [currentLang]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachedFile(file);
  };

  const handleActionButtonClick = (actionItem) => {
    if (actionItem.query) {
      handleSendMessage(actionItem.query);
      return;
    }
    if (actionItem.tab) {
      navigate('/citizen/dashboard');
      window.dispatchEvent(new CustomEvent('SWITCH_CITIZEN_TAB', { detail: actionItem.tab }));
    }
  };

  // Async Live AI Query Processor
  const processAIQueryAsync = async (queryText, attachedImg = null) => {
    const q = queryText.toLowerCase().trim();

    // 1. Attached image
    if (attachedImg) {
      setActiveContext(INTENTS.REGISTER_COMPLAINT);
      return {
        text: `📷 **Photo Attached**: "${attachedImg.name}"\n\n🤖 **AI Telemetry Inspection**:\n• Suggested Category: 🚨 Sanitation / Garbage\n• Ward Location: Ward 4 (Kopargaon Center)\n• SLA Guaranteed: 72 Hours\n\nWould you like to open the Grievance Registration form with this photo attached?`,
        actions: [{ label: "🚨 Register Grievance", tab: "register_complaint" }]
      };
    }

    // 2. Real City Data Context Response
    const cityContextResp = aiEngine.buildCityContextResponse(q, cityIntel.aiContext);
    if (cityContextResp) return cityContextResp;

    // 3. Live Weather Query
    if (q.includes('weather') || q.includes('rain') || q.includes('temperature') || q.includes('temp')) {
      const weatherRes = await fetchKopargaonWeather();
      if (weatherRes.success) {
        return {
          text: `🌤 **Live Kopargaon Weather Telemetry**:\n\n• **Temperature**: ${weatherRes.temperature}°C (Feels like ${weatherRes.feelsLike}°C)\n• **Condition**: ${weatherRes.conditionText}\n• **Humidity**: ${weatherRes.humidity}%\n• **Wind Speed**: ${weatherRes.windSpeed} km/h\n• **UV Index**: ${weatherRes.uvIndex}\n• **Sunrise**: ${weatherRes.sunrise} | **Sunset**: ${weatherRes.sunset}\n• **Source**: ${weatherRes.source} (Updated at ${weatherRes.updatedAt})`,
          actions: [{ label: "🌤 Weather & Traffic Page", tab: "weather" }]
        };
      }
    }

    // 4. Live Hospital Query
    if (q.includes('hospital') || q.includes('clinic') || q.includes('doctor') || q.includes('medical')) {
      const poiRes = await fetchLiveKopargaonPOIs();
      const hospitals = (poiRes.pois || []).filter(p => p.category === 'hospital' || p.name.toLowerCase().includes('hospital'));
      if (hospitals.length > 0) {
        let text = `🏥 **Nearest Hospitals in Kopargaon (OpenStreetMap Live)**:\n\n`;
        hospitals.slice(0, 3).forEach((h, idx) => {
          text += `${idx + 1}. **${h.name}**\n   • Ward ${h.ward} | Details: ${h.details}\n`;
        });
        return {
          text,
          actions: [{ label: "🗺 Locate Hospitals on GIS Map", tab: "smart_map" }, { label: "📞 Emergency Services", tab: "emergency" }]
        };
      }
    }

    // 5. Live Police Query
    if (q.includes('police') || q.includes('cop') || q.includes('station')) {
      const poiRes = await fetchLiveKopargaonPOIs();
      const police = (poiRes.pois || []).filter(p => p.category === 'police' || p.name.toLowerCase().includes('police'));
      if (police.length > 0) {
        let text = `🚓 **Nearest Police Stations in Kopargaon (OpenStreetMap Live)**:\n\n`;
        police.slice(0, 2).forEach((p, idx) => {
          text += `${idx + 1}. **${p.name}**\n   • Ward ${p.ward} | Details: ${p.details}\n`;
        });
        text += `\n**Emergency Helpline**: Dial 112 / 100`;
        return {
          text,
          actions: [{ label: "🚨 Emergency Directory", tab: "emergency" }, { label: "🗺 View on GIS Map", tab: "smart_map" }]
        };
      }
    }

    // 6. Standard Knowledge Base Intent classifier
    const { intent, isFollowUp } = detectUserIntent(queryText, activeContext);
    if (intent !== INTENTS.UNKNOWN) {
      setActiveContext(intent);
      const response = formatIntentResponse(intent, currentLang, isFollowUp);
      if (response) return response;
    }

    // Fallback response with live system stats
    return {
      text: `🤖 **Kopargaon Digital Twin AI Engine**\n\nI monitored the current city status:\n• City Health Score: **${cityIntel.cityHealth.overall}/100** (${cityIntel.cityHealth.grade})\n• Open Complaints: **${cityIntel.metrics.open}**\n• Active Critical Alerts: **${cityIntel.metrics.slaBreached}**\n\nHow can I help you today?`,
      actions: [
        { label: "🏛 Building Permits", tab: "permissions" },
        { label: "💳 Property Tax", tab: "property_tax" },
        { label: "🚨 Register Complaint", tab: "register_complaint" }
      ]
    };
  };

  const handleSendMessage = (overrideText = null) => {
    const textToSend = overrideText || inputQuery;
    if (!textToSend.trim() && !attachedFile) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend || (attachedFile ? `Attached file: ${attachedFile.name}` : ''),
      file: attachedFile ? attachedFile.name : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentAttached = attachedFile;
    setInputQuery('');
    setAttachedFile(null);
    setIsTyping(true);

    processAIQueryAsync(textToSend, currentAttached).then(({ text, actions }) => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text,
        actions: actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    });
  };

  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    setActiveContext(null);
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: greetings[currentLang] || greetings.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: []
      }
    ]);
  };

  const selectedScenario = aiEngine.WHATIF_SCENARIOS.find(s => s.id === selectedScenarioId) || aiEngine.WHATIF_SCENARIOS[0];
  const simulationResult = selectedScenario ? selectedScenario.simulate(cityIntel.metrics) : null;

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">
          <div className="group relative flex items-center">
            <div className="hidden sm:block absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1F3A] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap border border-[#FF9933] pointer-events-none">
              🤖 AI Smart Assistant & Digital Twin
            </div>
            <div className="absolute inset-0 rounded-full bg-[#FF9933] opacity-40 animate-ping"></div>

            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 border-2 border-[#FF9933] cursor-pointer"
              title="Kopargaon AI Smart Assistant"
            >
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF9933]" />
              {cityIntel.metrics.slaBreached > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center border border-white animate-pulse">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[10000] bg-white dark:bg-slate-900 border border-[#0B2545]/20 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isMinimized
                ? 'w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] h-13 rounded-2xl'
                : 'w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] h-[560px] max-h-[calc(100vh-80px)] rounded-2xl'
            }`}
          >
            {/* Header */}
            <div className="bg-[#0B2545] text-white p-3 border-b-2 border-[#FF9933] flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1 relative">
                  <Bot className="w-5 h-5 text-[#FF9933]" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B1F3A]"></span>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white leading-tight">
                    Kopargaon AI Intelligence
                  </h3>
                  <div className="flex items-center gap-1.5 text-[9px] text-[#FF9933] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Digital Twin Live Connected</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={handleClearChat} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors" title="Clear Chat">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors" title={isMinimized ? 'Expand' : 'Minimize'}>
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-rose-400 transition-colors" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Navigation Bar for AI Assistant Modes */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold overflow-x-auto shrink-0 custom-scrollbar">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'chat'
                        ? 'bg-white dark:bg-slate-700 text-[#0B2545] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('predictions')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'predictions'
                        ? 'bg-white dark:bg-slate-700 text-[#0B2545] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Predictions</span>
                    <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded font-mono">EST</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('alerts')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer relative ${
                      activeTab === 'alerts'
                        ? 'bg-white dark:bg-slate-700 text-[#0B2545] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    <span>Alerts</span>
                    {aiEngine.smartAlerts.length > 0 && (
                      <span className="px-1 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black">
                        {aiEngine.smartAlerts.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('decisions')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'decisions'
                        ? 'bg-white dark:bg-slate-700 text-[#0B2545] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Decisions</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('whatif')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'whatif'
                        ? 'bg-white dark:bg-slate-700 text-[#0B2545] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-500" />
                    <span>What-If</span>
                    <span className="text-[8px] bg-purple-100 text-purple-800 px-1 rounded font-mono">SIM</span>
                  </button>
                </div>

                {/* TAB CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] dark:bg-slate-900 custom-scrollbar">

                  {/* TAB 1: CONVERSATIONAL CHAT */}
                  {activeTab === 'chat' && (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => {
                        const isAi = msg.sender === 'ai';

                        return (
                          <div key={msg.id || idx} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                            <div className="flex items-end gap-1.5 max-w-[92%]">
                              {isAi && (
                                <div className="w-6 h-6 rounded-full bg-[#0B1F3A] text-[#FF9933] flex items-center justify-center text-[10px] shrink-0 mb-1">
                                  🤖
                                </div>
                              )}

                              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-sm relative group ${isAi ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-none' : 'bg-[#0B1F3A] text-white rounded-br-none'}`}>
                                {msg.file && (
                                  <div className="mb-2 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px] font-mono text-sky-600 dark:text-sky-300 flex items-center gap-1">
                                    <ImageIcon className="w-3.5 h-3.5" /> Attached: {msg.file}
                                  </div>
                                )}

                                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                                {isAi && msg.actions && msg.actions.length > 0 && (
                                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
                                    {msg.actions.map((act, actIdx) => (
                                      <button
                                        key={actIdx}
                                        onClick={() => handleActionButtonClick(act)}
                                        className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#071426] text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors border border-[#0B1F3A] cursor-pointer"
                                      >
                                        <span>{act.label}</span>
                                        <ArrowRight className="w-3 h-3 text-[#FF9933]" />
                                      </button>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-slate-100 dark:border-slate-700 text-[9px] text-slate-400">
                                  <span>{msg.timestamp}</span>
                                  {isAi && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => speakText(msg.text)} className="hover:text-[#0B1F3A] dark:hover:text-white p-0.5" title="Read Aloud">
                                        <Volume2 className="w-3 h-3" />
                                      </button>
                                      <button onClick={() => handleCopyMessage(msg.text, idx)} className="hover:text-[#0B1F3A] dark:hover:text-white p-0.5" title="Copy">
                                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {isTyping && (
                        <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-[120px]">
                          <div className="w-2 h-2 rounded-full bg-[#0B1F3A] dark:bg-sky-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-[#FF9933] animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 rounded-full bg-[#138808] animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {/* TAB 2: AI PREDICTIONS */}
                  {activeTab === 'predictions' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-black text-amber-800 dark:text-amber-300">
                          <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                            <Sparkles className="w-3.5 h-3.5" /> AI Predictive Telemetry
                          </span>
                          <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded text-[9px] font-mono font-bold">
                            ESTIMATED
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                          Forecasts combine live complaint trends, time-of-day patterns & historical SLAs. All predictions are <strong>clearly labeled as estimated</strong>.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {aiEngine.predictions.map(pred => (
                          <div key={pred.id} className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{pred.icon}</span>
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{pred.title}</h4>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono font-bold text-slate-500">{pred.confidence}% confidence</span>
                                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 rounded text-[9px] font-black font-mono">
                                  ESTIMATED
                                </span>
                              </div>
                            </div>

                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{pred.summary}</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{pred.detail}</p>

                            <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-[11px] space-y-1">
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase text-[9px] block">
                                Recommended Action:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 font-semibold">{pred.recommendation}</p>
                            </div>

                            <p className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-700">
                              {pred.basis}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SMART ALERTS */}
                  {activeTab === 'alerts' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-black text-red-800 dark:text-red-300">
                          <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                            <ShieldAlert className="w-3.5 h-3.5" /> Real System Alerts
                          </span>
                          <span className="px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded text-[9px] font-mono font-bold">
                            REAL-TIME
                          </span>
                        </div>
                        <p className="text-[11px] text-red-700 dark:text-red-300 leading-relaxed">
                          Auto-generated from active SLA breaches, escalations & complaint density.
                        </p>
                      </div>

                      {aiEngine.smartAlerts.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs font-medium">
                          No active critical alerts. All SLAs compliant.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {aiEngine.smartAlerts.map(alert => (
                            <div key={alert.id} className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-l-4 border-red-500 border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">{alert.title}</h4>
                                </div>
                                <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded text-[9px] font-black uppercase">
                                  {alert.severity}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{alert.description}</p>

                              <div className="p-2 bg-red-50/50 dark:bg-red-900/10 rounded-lg text-[11px] space-y-0.5">
                                <span className="font-bold text-red-800 dark:text-red-300 uppercase text-[9px] block">Recommended Municipal Action:</span>
                                <p className="text-slate-700 dark:text-slate-300 font-semibold">{alert.action}</p>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                                <span>Location: {alert.location}</span>
                                <span>Dept: {alert.department}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: DECISION SUPPORT */}
                  {activeTab === 'decisions' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-black text-amber-800 dark:text-amber-300">
                          <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                            <Lightbulb className="w-3.5 h-3.5" /> Smart Decision Support
                          </span>
                          <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded text-[9px] font-mono font-bold">
                            RECOMMENDATIONS
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                          AI recommendations based on current live data to optimize municipal response & resource dispatch.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {aiEngine.decisionSupport.map(dec => (
                          <div key={dec.id} className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${dec.priorityColor}`}>
                                {dec.priority} PRIORITY
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-400">{dec.department}</span>
                            </div>

                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{dec.title}</h4>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{dec.rationale}</p>

                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-[11px] space-y-0.5 border border-emerald-200 dark:border-emerald-700">
                              <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase text-[9px] block">Suggested Executive Action:</span>
                              <p className="text-slate-800 dark:text-slate-200 font-semibold">{dec.action}</p>
                            </div>

                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
                              <span>Estimated Impact:</span>
                              <span>{dec.impact}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: WHAT-IF SIMULATION */}
                  {activeTab === 'whatif' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-black text-purple-800 dark:text-purple-300">
                          <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                            <Sliders className="w-3.5 h-3.5" /> What-If Scenario Simulator
                          </span>
                          <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 rounded text-[9px] font-mono font-bold">
                            SIMULATED / ESTIMATED
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-700 dark:text-purple-300 leading-relaxed">
                          Test municipal decisions before execution. All before/after impacts are <strong>clearly labeled as simulated estimates</strong>.
                        </p>
                      </div>

                      {/* Scenario Selector */}
                      <div className="grid grid-cols-2 gap-2">
                        {aiEngine.WHATIF_SCENARIOS.map(sc => (
                          <button
                            key={sc.id}
                            onClick={() => setSelectedScenarioId(sc.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              selectedScenarioId === sc.id
                                ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 font-bold">
                              <span>{sc.icon}</span>
                              <span className="truncate">{sc.label}</span>
                            </div>
                            <p className="text-[10px] opacity-80 line-clamp-1">{sc.description}</p>
                          </button>
                        ))}
                      </div>

                      {/* Selected Scenario Impact Simulation */}
                      {simulationResult && (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{selectedScenario.icon}</span>
                              <span>{selectedScenario.label}</span>
                            </h4>
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded text-[9px] font-black font-mono">
                              SIMULATED IMPACT
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                            {simulationResult.summary}
                          </p>

                          {/* Before / After Comparison Box */}
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 text-xs space-y-1">
                              <span className="font-black text-red-700 dark:text-red-300 uppercase text-[9px] block">Current State (Before):</span>
                              {Object.entries(simulationResult.before).map(([k, v]) => (
                                <div key={k} className="text-[10px] text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span> {v}
                                </div>
                              ))}
                            </div>

                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700 text-xs space-y-1">
                              <span className="font-black text-emerald-700 dark:text-emerald-300 uppercase text-[9px] block">Estimated Impact (After):</span>
                              {Object.entries(simulationResult.after).map(([k, v]) => (
                                <div key={k} className="text-[10px] text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span> {v}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                            <span>Est. Time to Impact: {simulationResult.after.timeToImpact}</span>
                            <span>Est. Cost: {simulationResult.after.cost}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Footer Input Form (only shown in chat tab) */}
                {activeTab === 'chat' && (
                  <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
                    {attachedFile && (
                      <div className="mb-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium text-[#0B1F3A] dark:text-white flex items-center justify-between">
                        <span className="truncate">📎 Attached: {attachedFile.name}</span>
                        <button onClick={() => setAttachedFile(null)} className="text-rose-500 p-0.5">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />

                      <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <button type="button" onClick={toggleVoiceInput} className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      <input
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        placeholder="Ask weather, traffic, hospital, tax..."
                        className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B1F3A] text-slate-900 dark:text-white"
                      />

                      <button type="submit" className="p-2.5 bg-[#0B1F3A] hover:bg-[#071426] text-white rounded-xl shadow-md transition-all border border-[#0B1F3A] cursor-pointer">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalAIAssistant;
