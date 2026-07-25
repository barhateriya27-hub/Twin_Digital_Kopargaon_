import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Receipt, Plus, Search, Filter, CheckCircle2, Eye, Download, 
  Building2, User, Calendar, ShieldCheck, AlertCircle, FileText
} from 'lucide-react';
import { TAX_CATEGORIES } from '../../utils/governanceUtils';
import { useApp } from '../../context/AppContext';
import { TaxBillReceiptModal } from './TaxBillReceiptModal';

export const OfficerTaxManagementView = () => {
  const { taxRecords = [], createTaxRecord, processTaxPayment, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // New Tax Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    citizenName: 'Ramesh Deshmukh',
    citizenEmail: 'citizen@kopargaon.gov.in',
    propertyNumber: 'KPG-PROP-4218',
    address: 'Shivaji Chowk, Ward 4, Kopargaon',
    ward: 4,
    taxCategory: 'Property Tax',
    amount: 4500,
    dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  });

  const [selectedRecordForBill, setSelectedRecordForBill] = useState(null);
  const [isReceiptView, setIsReceiptView] = useState(false);

  const filteredTaxes = taxRecords.filter(tax => {
    const matchesSearch = 
      (tax.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tax.citizenName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tax.propertyNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tax.address || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = categoryFilter === 'All' || tax.taxCategory === categoryFilter;
    const matchesStatus = statusFilter === 'All' || tax.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // KPI Calculations
  const totalRevenueCollected = taxRecords.filter(t => t.status === 'Paid').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalPendingDues = taxRecords.filter(t => t.status === 'Unpaid' || t.status === 'Overdue').reduce((sum, t) => sum + (t.amount || 0) + (t.penalty || 0), 0);
  const totalAssessments = taxRecords.length;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createTaxRecord(formData);
    setIsCreateModalOpen(false);
  };

  const handleRecordOfflinePayment = (taxId) => {
    processTaxPayment(taxId, 'Offline Cash Counter');
    showToast(`Offline Payment Recorded for Tax #${taxId}! Official receipt issued.`);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* Executive Revenue Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#103459] to-[#0A2540] p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-sky-900/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shadow-inner shrink-0">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MUNICIPAL REVENUE & TAX ADMINISTRATION
              </span>
              <span className="text-xs text-slate-300 font-mono">Kopargaon Municipal Corporation Treasury</span>
            </div>
            <h1 className="text-xl font-black tracking-tight mt-1">
              Property, Water & Commercial Tax Assessment Hub
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Create tax assessments, generate demand bills, record offline cash/cheque counter payments, manage exemptions, and audit ward collection efficiency.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 text-xs uppercase tracking-wide shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Tax Assessment
        </button>
      </div>

      {/* Revenue KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Revenue Collected</span>
          <span className="text-3xl font-black text-emerald-600 font-mono mt-1 block">₹{totalRevenueCollected.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-amber-200 dark:border-amber-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Total Pending Dues</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1 block">₹{totalPendingDues.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-200 dark:border-sky-900/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">Active Assessments</span>
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">{totalAssessments}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tax ID, Citizen, Property #, Address..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Tax Categories</option>
            {TAX_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Tax Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="p-3">Tax ID</th>
                <th className="p-3">Tax Category</th>
                <th className="p-3">Taxpayer & Property #</th>
                <th className="p-3">Ward</th>
                <th className="p-3">Amount Payable</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTaxes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No tax records match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTaxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-emerald-600">
                      #{tax.id}
                    </td>

                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {tax.taxCategory}
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{tax.citizenName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{tax.propertyNumber || 'KPG-PROP-4218'}</span>
                    </td>

                    <td className="p-3 font-bold">
                      Ward {tax.ward || 4}
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      ₹{(tax.amount + (tax.penalty || 0)).toLocaleString('en-IN')}
                    </td>

                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        tax.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                      }`}>
                        {tax.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setSelectedRecordForBill(tax); setIsReceiptView(tax.status === 'Paid'); }}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-[11px]"
                        >
                          View Bill/Receipt
                        </button>

                        {tax.status !== 'Paid' && (
                          <button
                            onClick={() => handleRecordOfflinePayment(tax.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-sm"
                          >
                            Record Cash Payment
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Tax Assessment Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md space-y-4 my-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Create New Tax Assessment</h3>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Citizen Name *</label>
                  <input
                    type="text"
                    name="citizenName"
                    required
                    value={formData.citizenName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Property # / Assessment Ref *</label>
                  <input
                    type="text"
                    name="propertyNumber"
                    required
                    value={formData.propertyNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tax Category *</label>
                    <select
                      name="taxCategory"
                      value={formData.taxCategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[11px]"
                    >
                      {TAX_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ward Number *</label>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(w => <option key={w} value={w}>Ward {w}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assessment Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wide text-xs"
                >
                  Issue Demand Bill & Assessment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <TaxBillReceiptModal
        isOpen={!!selectedRecordForBill}
        onClose={() => setSelectedRecordForBill(null)}
        taxRecord={selectedRecordForBill}
        isReceipt={isReceiptView}
      />
    </div>
  );
};
