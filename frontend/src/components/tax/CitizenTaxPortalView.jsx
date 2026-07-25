import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Receipt, CreditCard, CheckCircle2, Download, Eye, QrCode, 
  Building2, ShieldCheck, ArrowRight, AlertTriangle, Sparkles, Smartphone, Landmark, Wallet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaxBillReceiptModal } from './TaxBillReceiptModal';

export const CitizenTaxPortalView = () => {
  const { taxRecords = [], processTaxPayment, showToast, citizenUser } = useApp();

  const [selectedRecordForPayment, setSelectedRecordForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'NetBanking' | 'Card' | 'Wallet'
  const [selectedRecordForBill, setSelectedRecordForBill] = useState(null);
  const [isReceiptView, setIsReceiptView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter records for logged in citizen or default sample property
  const myTaxes = taxRecords.filter(t => 
    t.citizenId === citizenUser?.id || t.citizenEmail === citizenUser?.email || t.ward === (citizenUser?.ward || 4)
  );

  const unpaidTaxes = myTaxes.filter(t => t.status === 'Unpaid' || t.status === 'Overdue');
  const paidTaxes = myTaxes.filter(t => t.status === 'Paid');

  const totalOutstanding = unpaidTaxes.reduce((sum, t) => sum + (t.amount || 0) + (t.penalty || 0), 0);

  const handlePayNow = (e) => {
    e.preventDefault();
    if (!selectedRecordForPayment) return;

    setIsProcessing(true);
    setTimeout(() => {
      processTaxPayment(selectedRecordForPayment.id, paymentMethod);
      setIsProcessing(false);
      setSelectedRecordForPayment(null);
      showToast(`Payment of ₹${selectedRecordForPayment.amount} successful via ${paymentMethod}! Official receipt generated.`);
    }, 1200);
  };

  const openBillModal = (record, receiptMode = false) => {
    setSelectedRecordForBill(record);
    setIsReceiptView(receiptMode);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#103459] to-[#0A2540] p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-sky-900/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shadow-inner shrink-0">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                KOPARGAON CITIZEN TAX PORTAL
              </span>
              <span className="text-xs text-slate-300 font-mono">Ward {citizenUser?.ward || 4} Property & Utility Revenue</span>
            </div>
            <h1 className="text-xl font-black tracking-tight mt-1">
              Digital Municipal Tax Payments & Clearance Desk
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              View tax assessments, pay property & water bills online via UPI/NetBanking, download official payment receipts, and obtain tax clearance certificates.
            </p>
          </div>
        </div>

        {/* Quick Outstanding Card */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0 text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Total Outstanding Dues</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{totalOutstanding > 0 ? `₹${totalOutstanding.toLocaleString('en-IN')}` : '₹0 (No Dues)'}</span>
        </div>
      </div>

      {/* Main Grid: Unpaid Demand Bills vs Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Unpaid Demand Bills Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-orange-600" />
              Outstanding Municipal Tax Dues ({unpaidTaxes.length})
            </h3>
          </div>

          {unpaidTaxes.length === 0 ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-3xl text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-sm">No Outstanding Municipal Dues!</h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 max-w-md mx-auto">
                All property, water, and solid waste tax bills for your property in Kopargaon are fully paid up to date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {unpaidTaxes.map((tax) => (
                <div
                  key={tax.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-600">#{tax.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                        {tax.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                      {tax.taxCategory} — FY 2025-26
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Property Assessment: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{tax.propertyNumber || 'KPG-PROP-4218'}</span> • {tax.address || 'Shivaji Chowk, Ward 4'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">
                      Due Date: {new Date(tax.dueDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Payable</span>
                      <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono text-emerald-600">
                        ₹{(tax.amount + (tax.penalty || 0)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openBillModal(tax, false)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Bill
                      </button>

                      <button
                        onClick={() => setSelectedRecordForPayment(tax)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Pay Online
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment History */}
          <div className="pt-4 space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Recent Payment Receipts ({paidTaxes.length})
            </h3>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      <th className="p-3">Receipt Ref</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Paid Date</th>
                      <th className="p-3">Amount Paid</th>
                      <th className="p-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {paidTaxes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">
                          No previous tax payment receipts on record.
                        </td>
                      </tr>
                    ) : (
                      paidTaxes.map((pt) => (
                        <tr key={pt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-mono font-bold text-emerald-600">
                            {pt.receiptNumber || `REC-${pt.id}`}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                            {pt.taxCategory}
                          </td>
                          <td className="p-3 font-mono text-slate-500">
                            {new Date(pt.paidAt || Date.now()).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                            ₹{(pt.amount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => openBillModal(pt, true)}
                              className="px-3 py-1 bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold rounded-lg text-[11px] hover:bg-sky-200"
                            >
                              Download Receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Payment Architecture Simulator Sidebar (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Unified Digital Payment Gateway
            </h4>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Kopargaon Municipal Corporation supports instant zero-fee tax payments via government payment gateway endpoints.
            </p>

            <div className="space-y-2">
              {[
                { id: 'UPI', label: 'UPI Instant (BHIM / GPay / PhonePe)', icon: Smartphone },
                { id: 'NetBanking', label: 'Net Banking (SBI / HDFC / ICICI)', icon: Landmark },
                { id: 'Card', label: 'Credit / Debit Cards (RuPay)', icon: CreditCard },
                { id: 'Wallet', label: 'Digital Wallets & Bank Transfer', icon: Wallet }
              ].map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center font-bold">
                    <m.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-[11px] text-amber-900 dark:text-amber-300">
              <p className="font-bold">24x7 Digital Receipts & Instant Certificate</p>
              <p className="opacity-90 mt-0.5">
                Every payment generates an instant digitally signed QR code receipt accepted for property transfer and clearance.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Online Payment Modal */}
      <AnimatePresence>
        {selectedRecordForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md space-y-4 my-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Municipal Tax Payment Gateway</h3>
                </div>
                <button onClick={() => setSelectedRecordForPayment(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tax Category & Record</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">{selectedRecordForPayment.taxCategory}</span>
                <span className="font-mono text-emerald-600 font-extrabold text-lg block">₹{(selectedRecordForPayment.amount + (selectedRecordForPayment.penalty || 0)).toLocaleString('en-IN')}</span>
              </div>

              <form onSubmit={handlePayNow} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-bold text-xs">
                    {['UPI', 'NetBanking', 'Card', 'Wallet'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          paymentMethod === method ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-extrabold' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {method === 'UPI' ? 'UPI / QR Code' : method}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center space-y-2 border border-slate-200 dark:border-slate-800">
                    <div className="w-28 h-28 mx-auto bg-white p-1 rounded-xl border border-slate-300 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 block">Scan with GPay / PhonePe / BHIM</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wide flex items-center justify-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isProcessing ? 'Processing Payment Gateway...' : `Confirm & Pay ₹${(selectedRecordForPayment.amount + (selectedRecordForPayment.penalty || 0)).toLocaleString('en-IN')}`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bill & Receipt Modal */}
      <TaxBillReceiptModal
        isOpen={!!selectedRecordForBill}
        onClose={() => setSelectedRecordForBill(null)}
        taxRecord={selectedRecordForBill}
        isReceipt={isReceiptView}
      />
    </div>
  );
};
