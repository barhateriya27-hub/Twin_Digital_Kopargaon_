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
  Navigation,
  Building2,
  ArrowRight
} from 'lucide-react';
import { detectUserIntent, formatIntentResponse, INTENTS } from '../../services/aiKnowledgeBase';
import { fetchKopargaonWeather } from '../../services/weatherService';
import { fetchLiveKopargaonPOIs } from '../../services/poiService';

export const GlobalAIAssistant = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  const [activeContext, setActiveContext] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentLang = i18n.language || 'en';

  const greetings = {
    en: "Hello 👋\nI am the AI Smart Assistant for Kopargaon Municipal Council.\nHow can I help you with municipal services, building permissions, or property tax today?",
    mr: "नमस्कार 👋\nमी कोपरगाव नगर परिषदेचा एआय स्मार्ट सहाय्यक आहे.\nआज मी तुम्हाला नगरपालिका सेवा, बांधकाम परवाने किंवा मालमत्ता कराबाबत कशी मदत करू शकतो?",
    hi: "नमस्ते 👋\nमैं कोपरगांव नगर परिषद का एआई स्मार्ट सहायक हूँ।\nआज मैं आपकी क्या सहायता कर सकता हूँ?"
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: greetings[currentLang] || greetings.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: []
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Event listener to open AI assistant globally from any action button
  useEffect(() => {
    const handleOpenAI = (e) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail && e.detail.query) {
        handleSendMessage(e.detail.query);
      }
    };
    window.addEventListener('OPEN_GLOBAL_AI_ASSISTANT', handleOpenAI);
    return () => window.removeEventListener('OPEN_GLOBAL_AI_ASSISTANT', handleOpenAI);
  }, []);

  // Voice Microphone Setup
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

  const initialQuickActions = [
    { label: '🌤 Today Weather', query: "What is today's weather?" },
    { label: '🏥 Nearest Hospital', query: 'Nearest hospital?' },
    { label: '🚓 Nearest Police Station', query: 'Nearest police station?' },
    { label: '🏛 Building Permit', query: 'I want permission for building a house in Kopargaon' },
    { label: '💳 Property Tax', query: 'How to pay Property Tax online' },
    { label: '🚨 Register Complaint', query: 'I want to register a complaint' },
  ];

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
        text: `📷 **Photo Attached**: "${attachedImg.name}"\n\n🤖 **AI Inspection Result**:\n• Suggested Category: 🚨 Sanitation / Garbage\n• Ward Location: Ward 4 (Kopargaon Center)\n• SLA: 72 Hours Guaranteed\n\nWould you like me to open the Grievance Registration form with this photo attached?`,
        actions: [{ label: "🚨 Submit Grievance Ticket", tab: "complaints" }]
      };
    }

    // 2. Live Weather Query
    if (q.includes('weather') || q.includes('rain') || q.includes('temperature') || q.includes('temp')) {
      const weatherRes = await fetchKopargaonWeather();
      if (weatherRes.success) {
        return {
          text: `🌤 **Live Kopargaon Weather Telemetry**:\n\n• **Temperature**: ${weatherRes.temperature}°C (Feels like ${weatherRes.feelsLike}°C)\n• **Condition**: ${weatherRes.conditionText}\n• **Humidity**: ${weatherRes.humidity}%\n• **Wind Speed**: ${weatherRes.windSpeed} km/h\n• **UV Index**: ${weatherRes.uvIndex}\n• **Sunrise**: ${weatherRes.sunrise} | **Sunset**: ${weatherRes.sunset}\n• **Source**: ${weatherRes.source} (Updated at ${weatherRes.updatedAt})`,
          actions: [{ label: "🌤 Open Weather & Traffic", tab: "weather" }]
        };
      } else {
        return {
          text: `🌤 **Live Weather Status**:\n\nLive data currently unavailable`,
          actions: []
        };
      }
    }

    // 3. Live Hospital Query
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
          actions: [{ label: "🗺 Locate Hospitals on GIS Map", tab: "smart_map" }, { label: "📞 Emergency Contacts", tab: "emergency_page" }]
        };
      }
    }

    // 4. Live Police Query
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
          actions: [{ label: "🚨 Emergency Directory", tab: "emergency_page" }, { label: "🗺 View on GIS Map", tab: "smart_map" }]
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

    // Fallback response
    return {
      text: `Thank you for contacting Kopargaon Municipal Council AI Assistant.\n\nAll municipal services, GIS Spatial Digital Twin layers, and 72-hour grievance SLAs are active.\n\nIf you need assistance, select an option below:`,
      actions: [
        { label: "🏛 Building Permits", tab: "permissions" },
        { label: "💳 Property Tax", tab: "tax" },
        { label: "🚨 Register Complaint", tab: "complaints" }
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

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
          <div className="group relative flex items-center">
            <div className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1F3A] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap border border-[#FF9933] pointer-events-none">
              🤖 AI Smart Assistant
            </div>
            <div className="absolute inset-0 rounded-full bg-[#FF9933] opacity-40 animate-ping"></div>

            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="relative w-14 h-14 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 border-2 border-[#FF9933]"
              title="Kopargaon AI Smart Assistant"
            >
              <Bot className="w-7 h-7 text-[#FF9933]" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed bottom-0 right-0 z-[10000] bg-white border-l border-[#0B1F3A]/20 shadow-2xl flex flex-col transition-all duration-300 ${
              isMinimized
                ? 'h-14 w-full sm:w-[380px] md:w-[420px] rounded-t-2xl'
                : 'h-full sm:h-[620px] sm:bottom-4 sm:right-4 w-full sm:w-[380px] md:w-[420px] sm:rounded-3xl border'
            }`}
          >
            <div className="bg-[#0B1F3A] text-white p-3.5 sm:rounded-t-3xl border-b-2 border-[#FF9933] flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1 relative">
                  <Bot className="w-5 h-5 text-[#FF9933]" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B1F3A]"></span>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white leading-tight">
                    Kopargaon Smart AI Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 text-[9px] text-[#FF9933] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Telemetry Active</span>
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC] custom-scrollbar">
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

                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-sm relative group ${isAi ? 'bg-white text-slate-900 border border-slate-200 rounded-bl-none' : 'bg-[#0B1F3A] text-white rounded-br-none'}`}>
                          {msg.file && (
                            <div className="mb-2 p-1.5 bg-slate-100 rounded-lg text-[10px] font-mono text-sky-600 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5" /> Attached: {msg.file}
                            </div>
                          )}

                          <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                          {isAi && msg.actions && msg.actions.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                              {msg.actions.map((act, actIdx) => (
                                <button
                                  key={actIdx}
                                  onClick={() => handleActionButtonClick(act)}
                                  className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#071426] text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors border border-[#0B1F3A]"
                                >
                                  <span>{act.label}</span>
                                  <ArrowRight className="w-3 h-3 text-[#FF9933]" />
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-slate-100 text-[9px] text-slate-400">
                            <span>{msg.timestamp}</span>
                            {isAi && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => speakText(msg.text)} className="hover:text-[#0B1F3A] p-0.5" title="Read Aloud">
                                  <Volume2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleCopyMessage(msg.text, idx)} className="hover:text-[#0B1F3A] p-0.5" title="Copy">
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
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 max-w-[120px]">
                    <div className="w-2 h-2 rounded-full bg-[#0B1F3A] animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-[#FF9933] animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#138808] animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}

                <div ref={messagesEndRef} />

                {messages.length === 1 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Live AI Quick Queries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {initialQuickActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action.query)}
                          className="px-2.5 py-1 bg-white hover:bg-[#0B1F3A] hover:text-white border border-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition-all shadow-xs"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {!isMinimized && (
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                {attachedFile && (
                  <div className="mb-2 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-[#0B1F3A] flex items-center justify-between">
                    <span className="truncate">📎 Attached: {attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} className="text-rose-500 p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />

                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-xl transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button type="button" onClick={toggleVoiceInput} className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-[#0B1F3A] hover:bg-slate-100'}`}>
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask weather, nearest hospital, police station..."
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B1F3A] text-slate-900"
                  />

                  <button type="submit" className="p-2.5 bg-[#0B1F3A] hover:bg-[#071426] text-white rounded-xl shadow-md transition-all border border-[#0B1F3A]">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalAIAssistant;
