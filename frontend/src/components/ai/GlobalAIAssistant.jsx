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
    en: "Hello 👋\nI am the Data-Grounded AI Governance Assistant for Kopargaon Digital Twin Platform.\nI analyze live city telemetry, database complaints, SLA trends, and ward priorities in real-time. Ask me any analytical question below:",
    mr: "नमस्कार 👋\nमी कोपरगाव डिजिटल ट्विन प्लॅटफॉर्मचा डेटा-आधारित एआय गव्हर्नन्स असिस्टंट आहे.\nमी कोपरगाव नगर परिषदेच्या मूळ डेटाबेसवर आधारित माहिती आणि विश्लेषणात्मक उत्तरे देतो. खालील प्रश्न विचारा:",
    hi: "नमस्ते 👋\nमैं कोपरगांव डिजिटल ट्विन प्लेटफॉर्म का डेटा-गrounded एआई गवर्नेंस सहायक हूँ।\nमैं लाइव डेटाबेस और शिकायतों का विश्लेषण करता हूँ। मुझसे नीचे कोई भी प्रश्न पूछें:"
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: greetings[currentLang] || greetings.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: "📍 Which areas have most unresolved complaints?", query: "Which areas have the most unresolved complaints?" },
        { label: "📊 What are the most common problems?", query: "What are the most common problems?" },
        { label: "🚨 Which incidents need urgent attention?", query: "Which incidents need urgent attention?" },
        { label: "🎯 What actions should municipality prioritize?", query: "What actions should the municipality prioritize?" }
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

  // Async Live Grounded AI Query Processor
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

    // 2. Call Grounded Backend REST API Endpoint (/api/ai/query)
    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: queryText })
      });
      const data = await response.json();
      if (response.ok && data.success && data.responseText) {
        return {
          text: data.responseText,
          actions: [
            { label: "📍 Unresolved Areas", query: "Which areas have the most unresolved complaints?" },
            { label: "🚨 Urgent Incidents", query: "Which incidents need urgent attention?" },
            { label: "📊 Common Problems", query: "What are the most common problems?" }
          ]
        };
      }
    } catch (e) {
      // Fall through to local engine
    }

    // 3. Real City Data Context Response Fallback
    const cityContextResp = aiEngine.buildCityContextResponse(q, cityIntel.aiContext);
    if (cityContextResp) return cityContextResp;

    // 4. Live Weather Query
    if (q.includes('weather') || q.includes('rain') || q.includes('temperature') || q.includes('temp')) {
      const weatherRes = await fetchKopargaonWeather();
      if (weatherRes.success) {
        return {
          text: `🌤 **Live Kopargaon Weather Telemetry**:\n\n• **Temperature**: ${weatherRes.temperature}°C (Feels like ${weatherRes.feelsLike}°C)\n• **Condition**: ${weatherRes.conditionText}\n• **Humidity**: ${weatherRes.humidity}%\n• **Wind Speed**: ${weatherRes.windSpeed} km/h\n• **UV Index**: ${weatherRes.uvIndex}\n• **Sunrise**: ${weatherRes.sunrise} | **Sunset**: ${weatherRes.sunset}\n• **Source**: ${weatherRes.source} (Updated at ${weatherRes.updatedAt})`,
          actions: [{ label: "🌤 Weather & Traffic Page", tab: "weather" }]
        };
      }
    }

    // 5. Standard Knowledge Base Intent classifier
    const { intent, isFollowUp } = detectUserIntent(queryText, activeContext);
    if (intent !== INTENTS.UNKNOWN) {
      setActiveContext(intent);
      const response = formatIntentResponse(intent, currentLang, isFollowUp);
      if (response) return response;
    }

    // Fallback response with live system stats
    return {
      text: `🤖 **Kopargaon Digital Twin AI Engine**\n\nLive Database Context:\n• City Health Score: **${cityIntel.cityHealth.overall}/100** (${cityIntel.cityHealth.grade})\n• Open Complaints: **${cityIntel.metrics.open}**\n• Active Critical Alerts: **${cityIntel.metrics.slaBreached}**\n\nHow can I help you today?`,
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

      if (isSpeaking) {
        speakText(text);
      }
    });
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentScenario = aiEngine.WHATIF_SCENARIOS.find(s => s.id === selectedScenarioId) || aiEngine.WHATIF_SCENARIOS[0];
  const scenarioResult = currentScenario ? currentScenario.simulate(cityIntel.metrics) : null;

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-[999] bg-gradient-to-r from-[#0B2545] via-[#103459] to-[#0B2545] text-white p-3.5 sm:p-4 rounded-full shadow-2xl border-2 border-sky-400/40 flex items-center gap-3 cursor-pointer group hover:shadow-sky-900/30"
          title="Open AI Smart City Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#FF9933] group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
          </div>
          <span className="hidden sm:inline text-xs font-black uppercase tracking-wider text-slate-100 pr-1">
            Grounded AI Assistant
          </span>
        </motion.button>
      )}

      {/* Main Drawer Overlay / Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-[460px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden ${
              isMinimized ? 'h-[64px]' : 'h-[620px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-[#0B2545] text-white p-3.5 flex items-center justify-between border-b border-sky-900/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 text-[#FF9933] border border-white/10">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-white">
                      Data-Grounded AI Assistant
                    </h3>
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded uppercase tracking-wider border border-emerald-400/30">
                      DB Live
                    </span>
                  </div>
                  <p className="text-[10px] text-sky-200 font-mono">Kopargaon Single Source Database Connected</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content body if not minimized */}
            {!isMinimized && (
              <>
                {/* Navigation Tabs */}
                <div className="bg-slate-50 dark:bg-slate-800/80 px-2 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'chat'
                        ? 'bg-[#0B2545] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#FF9933]" />
                    AI Grounded Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('predictions')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'predictions'
                        ? 'bg-[#0B2545] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Forecasts
                  </button>
                  <button
                    onClick={() => setActiveTab('decisions')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'decisions'
                        ? 'bg-[#0B2545] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    Priorities
                  </button>
                  <button
                    onClick={() => setActiveTab('whatif')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'whatif'
                        ? 'bg-[#0B2545] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-sky-400" />
                    Simulations
                  </button>
                </div>

                {/* TAB 1: CHAT INTERFACE */}
                {activeTab === 'chat' && (
                  <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-900/50">
                    {/* Message Transcript Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      {messages.map((msg, index) => (
                        <div
                          key={msg.id || index}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[88%] p-3.5 rounded-2xl text-xs space-y-2 shadow-xs ${
                              msg.sender === 'user'
                                ? 'bg-[#0B2545] text-white rounded-br-none'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                            }`}
                          >
                            <div className="whitespace-pre-wrap leading-relaxed font-sans">
                              {msg.text}
                            </div>

                            {/* Action Buttons if present */}
                            {msg.actions && msg.actions.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-1.5">
                                {msg.actions.map((act, actIdx) => (
                                  <button
                                    key={actIdx}
                                    onClick={() => handleActionButtonClick(act)}
                                    className="w-full text-left px-3 py-1.5 bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-[#0B2545] dark:text-sky-300 flex items-center justify-between border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer"
                                  >
                                    <span>{act.label}</span>
                                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Copy button */}
                            {msg.sender === 'ai' && (
                              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                                <span>{msg.timestamp}</span>
                                <button
                                  onClick={() => handleCopyText(msg.text, index)}
                                  className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex items-start gap-2">
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-500">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0B2545]" />
                            <span>Evaluating database records & analytical trends...</span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Composer */}
                    <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0 space-y-2">
                      {attachedFile && (
                        <div className="px-3 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 rounded-lg text-xs font-semibold flex items-center justify-between border border-sky-200 dark:border-sky-800">
                          <span className="truncate">Attached: {attachedFile.name}</span>
                          <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 text-slate-400 hover:text-[#0B2545] dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                          title="Attach Image / Document"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        <input
                          type="text"
                          value={inputQuery}
                          onChange={(e) => setInputQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask real database questions..."
                          className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0B2545]"
                        />

                        <button
                          onClick={toggleVoiceInput}
                          className={`p-2 rounded-xl cursor-pointer ${
                            isListening
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'text-slate-400 hover:text-[#0B2545] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title="Voice Input"
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleSendMessage()}
                          disabled={!inputQuery.trim() && !attachedFile}
                          className="p-2.5 bg-[#0B2545] hover:bg-[#07192E] text-white rounded-xl disabled:opacity-40 transition-all cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: AI PREDICTIONS & FORECASTS */}
                {activeTab === 'predictions' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-bold">Database Grounded Forecast Models</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded">
                        ESTIMATED
                      </span>
                    </div>

                    {aiEngine.predictions.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{p.icon}</span>
                            <h4 className="font-black text-xs text-slate-900 dark:text-slate-100">{p.title}</h4>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                            {p.confidence}% Confidence
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.summary}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{p.detail}</p>

                        <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 rounded-lg text-xs border border-sky-200 dark:border-sky-900/50">
                          <span className="font-bold text-sky-900 dark:text-sky-300 block">AI Recommended Action:</span>
                          <span className="text-sky-800 dark:text-sky-400">{p.recommendation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: DECISION SUPPORT PRIORITIES */}
                {activeTab === 'decisions' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300">
                      <span className="font-bold block">Municipal Action Matrix (Prioritized Facts)</span>
                      <span className="text-[11px]">Directly derived from open complaints, ward hotspots, and SLA breaches.</span>
                    </div>

                    {aiEngine.decisionSupport.map((d) => (
                      <div
                        key={d.id}
                        className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${d.priorityColor}`}>
                            {d.priority} PRIORITY
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{d.department}</span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{d.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{d.rationale}</p>

                        <div className="p-2.5 bg-slate-50 dark:bg-slate-700/60 rounded-lg text-xs space-y-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">Required Action:</span>
                          <span className="text-slate-600 dark:text-slate-300">{d.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: WHAT-IF SIMULATIONS */}
                {activeTab === 'whatif' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/50 text-xs text-purple-800 dark:text-purple-300 flex items-center justify-between">
                      <span className="font-bold">Policy & Resource Simulation Engine</span>
                      <span className="text-[10px] font-mono font-bold bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded">
                        SIMULATED
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Select Action Scenario:
                      </label>
                      <select
                        value={selectedScenarioId}
                        onChange={(e) => setSelectedScenarioId(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        {aiEngine.WHATIF_SCENARIOS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.icon} {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {scenarioResult && (
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {scenarioResult.summary}
                        </p>

                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Time to Impact</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{scenarioResult.after.timeToImpact}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Cost</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{scenarioResult.after.cost}</span>
                          </div>
                        </div>
                      </div>
                    )}
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
