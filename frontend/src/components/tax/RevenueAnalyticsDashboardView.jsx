import React from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, ShieldCheck, Landmark, Building2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RevenueAnalyticsDashboardView = () => {
  const { taxRecords = [] } = useApp();

  const totalCollected = taxRecords.filter(t => t.status === 'Paid').reduce((s, t) => s + (t.amount || 0), 0);
  const totalPending = taxRecords.filter(t => t.status === 'Unpaid' || t.status === 'Overdue').reduce((s, t) => s + (t.amount || 0) + (t.penalty || 0), 0);
  const totalTarget = totalCollected + totalPending;
  const collectionEfficiency = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 100;

  // Revenue breakdown by Ward
  const wardBreakdown = [1, 2, 3, 4, 5, 6, 7, 8].map(w => {
    const wardTaxes = taxRecords.filter(t => (t.ward || 4) === w);
    const collected = wardTaxes.filter(t => t.status === 'Paid').reduce((s, t) => s + (t.amount || 0), 0);
    const pending = wardTaxes.filter(t => t.status === 'Unpaid' || t.status === 'Overdue').reduce((s, t) => s + (t.amount || 0) + (t.penalty || 0), 0);
    return { ward: w, collected, pending };
  });

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#103459] to-[#0A2540] p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-sky-900/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold shadow-inner shrink-0">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                EXECUTIVE REVENUE ANALYTICS
              </span>
              <span className="text-xs text-slate-300 font-mono">Municipal Commissioner Intelligence Desk</span>
            </div>
            <h1 className="text-xl font-black tracking-tight mt-1">
              Municipal Revenue Trends & Ward Collection Efficiency
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Comprehensive analytics on municipal tax collection, ward-wise performance, category breakdown, outstanding dues forecasting, and treasury compliance.
            </p>
          </div>
        </div>

        {/* Collection Efficiency Badge */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0 text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Collection Efficiency</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{collectionEfficiency}% Target Reached</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Revenue Target</span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">₹{totalTarget.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Realized Treasury Revenue</span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">₹{totalCollected.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Outstanding Arrears</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">₹{totalPending.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-200 dark:border-sky-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">Ward Collection Rate</span>
          <span className="text-2xl font-black text-sky-600 font-mono mt-1 block">{collectionEfficiency}% Compliance</span>
        </div>
      </div>

      {/* Ward Collection Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-500" />
          Ward-wise Tax Collection Breakdown (Wards 1 – 8)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {wardBreakdown.map((w) => {
            const wardTotal = w.collected + w.pending;
            const pct = wardTotal > 0 ? Math.round((w.collected / wardTotal) * 100) : 100;

            return (
              <div key={w.ward} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Ward {w.ward}</span>
                  <span className="font-mono text-[10px] font-bold text-emerald-600">{pct}% Paid</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                </div>

                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Collected: ₹{w.collected.toLocaleString('en-IN')}</span>
                  <span className="text-rose-600 font-bold">Dues: ₹{w.pending.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
