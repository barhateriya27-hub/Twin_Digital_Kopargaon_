import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Droplets, 
  AlertOctagon, 
  Landmark, 
  ShieldAlert, 
  Calendar, 
  ExternalLink,
  Info
} from 'lucide-react';
import axios from 'axios';

export const NoticeBoard = ({ announcements = [] }) => {
  const [filter, setFilter] = useState('All');
  const [liveNotices, setLiveNotices] = useState([]);
  const [isFeedAvailable, setIsFeedAvailable] = useState(true);

  useEffect(() => {
    // Attempt to check if live municipal RSS feed is available
    const checkLiveFeed = async () => {
      try {
        // Attempt fetching official notice endpoint
        const res = await axios.get('/api/notices/rss', { timeout: 3000 });
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setLiveNotices(res.data);
          setIsFeedAvailable(true);
        } else {
          setIsFeedAvailable(false);
        }
      } catch (err) {
        // Official RSS/API unavailable
        setIsFeedAvailable(false);
      }
    };

    checkLiveFeed();
  }, []);

  const displayNotices = announcements.length > 0 ? announcements : liveNotices;
  const categories = ['All', 'Water Supply Notices', 'Road Closures', 'Government Schemes', 'Emergency Alerts'];

  const filteredNotices = displayNotices.filter(n => {
    if (filter === 'All') return true;
    return n.category === filter || (filter === 'Water Supply Notices' && n.category?.includes('Water'));
  });

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0B2545] text-[#FF9933]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2545]">
              Official Scrollable Government Notice Board
            </h3>
            <p className="text-xs text-slate-500">
              Authenticated bulletins & announcements from Kopargaon Municipal Council
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Notice Container */}
      {!isFeedAvailable && displayNotices.length === 0 ? (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-xs space-y-1">
          <Info className="w-5 h-5 text-slate-400 mx-auto" />
          <p className="font-bold text-[#0B2545]">No live notice feed available.</p>
          <p className="text-[11px] text-slate-400">The Kopargaon Municipal RSS feed is currently offline or unreachable.</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {filteredNotices.map((item) => {
            const isEmergency = item.priority === 'Urgent/Emergency' || item.category === 'Emergency Alerts';

            return (
              <div
                key={item.id || item.title}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  isEmergency 
                    ? 'bg-rose-50 border-red-300' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    isEmergency ? 'bg-[#B71C1C] text-white' : 'bg-[#0B2545]/10 text-[#0B2545]'
                  }`}>
                    {item.category || 'Official Advisory'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3 h-3 text-[#FF9933]" /> {item.date || '30 Jul 2026'}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-[#0B2545] leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono text-slate-400 font-bold">Ref: {item.id}</span>
                  <span className="text-[#0B2545] font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
                    Official Gazette PDF <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
