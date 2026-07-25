import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, Share2, ShieldCheck, QrCode, Building2, CheckCircle2, DollarSign, Receipt, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TaxBillReceiptModal = ({ isOpen, onClose, taxRecord, isReceipt = false }) => {
  const { showToast } = useApp();
  const printRef = useRef(null);

  if (!isOpen || !taxRecord) return null;

  const billNumber = taxRecord.billNumber || `BILL-2026-${taxRecord.id.replace(/\D/g, '') || '8812'}`;
  const receiptNumber = taxRecord.receiptNumber || `REC-2026-${taxRecord.id.replace(/\D/g, '') || '9941'}`;
  const issueDateStr = new Date(taxRecord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const dueDateStr = new Date(taxRecord.dueDate || Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const paidDateStr = new Date(taxRecord.paidAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const baseAmount = taxRecord.amount || 4500;
  const penalty = taxRecord.penalty || 0;
  const totalPayable = baseAmount + penalty;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const docType = isReceipt ? 'Payment_Receipt' : 'Tax_Demand_Bill';
    showToast(`Downloading Official Municipal ${docType}...`);
    const element = document.createElement("a");
    const file = new Blob([
      `KOPARGAON MUNICIPAL CORPORATION - ${isReceipt ? 'OFFICIAL TAX PAYMENT RECEIPT' : 'OFFICIAL TAX DEMAND BILL'}\n` +
      `Bill Number: ${billNumber}\n` +
      `${isReceipt ? `Receipt Number: ${receiptNumber}\n` : ''}` +
      `Citizen Name: ${taxRecord.citizenName || 'Ramesh Deshmukh'}\n` +
      `Property Assessment #: ${taxRecord.propertyNumber || 'KPG-PROP-4218'}\n` +
      `Tax Category: ${taxRecord.taxCategory || 'Property Tax'}\n` +
      `Assessment Year: 2025-2026\n` +
      `Ward: Ward ${taxRecord.ward || 4}\n` +
      `Base Amount: ₹${baseAmount}\n` +
      `Penalty/Interest: ₹${penalty}\n` +
      `Total ${isReceipt ? 'Paid' : 'Payable'}: ₹${totalPayable}\n` +
      `Status: ${taxRecord.status || (isReceipt ? 'PAID' : 'UNPAID')}\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `KMC_${docType}_${billNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-300 print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none"
        >
          {/* Action Header Bar */}
          <div className="p-3 sm:p-4 bg-[#0A2540] text-white flex flex-wrap items-center justify-between gap-2 shrink-0 z-10 border-b border-slate-800 print:hidden">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                {isReceipt ? 'Official Tax Payment Receipt' : 'Official Municipal Tax Demand Bill'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handlePrint}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/80 dark:bg-slate-900/50 print:bg-white print:overflow-visible">
            
            {/* Double Border Official Invoice Frame */}
            <div 
              ref={printRef} 
              className="p-4 sm:p-8 space-y-6 font-serif bg-white text-slate-900 border-4 sm:border-8 border-double border-slate-300 rounded-lg shadow-sm print:border-4 print:shadow-none"
            >
              {/* Header Emblem */}
              <div className="text-center border-b-2 border-slate-900 pb-4 relative">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-3">
                  <div className="text-center sm:text-left font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">STATE OF MAHARASHTRA</span>
                    <span className="text-xs font-bold text-[#0A2540] block">AHMEDNAGAR DISTRICT</span>
                  </div>
                  
                  <div className="w-16 h-16 rounded-full bg-[#0A2540] text-amber-400 flex flex-col items-center justify-center font-sans font-bold border-2 border-amber-400 shadow-md shrink-0 my-1 sm:my-0">
                    <Building2 className="w-6 h-6 mb-0.5" />
                    <span className="text-[7px] tracking-tighter uppercase font-mono">KMC REVENUE</span>
                  </div>

                  <div className="text-center sm:text-right font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">TAX ADMINISTRATION</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 block">
                      {isReceipt ? 'RECEIPT #VERIFIED' : 'DEMAND BILL #ISSUED'}
                    </span>
                  </div>
                </div>

                <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wider text-[#0A2540] font-sans leading-tight">
                  Kopargaon Municipal Corporation
                </h1>
                <h2 className="text-xs sm:text-sm font-semibold text-slate-700 tracking-wide font-sans mt-1 uppercase">
                  {isReceipt ? 'OFFICIAL TAX PAYMENT RECEIPT' : 'MUNICIPAL TAX DEMAND BILL & ASSESSMENT'}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-1">
                  Issued under the Maharashtra Municipal Corporations Revenue & Property Tax Act, 2026
                </p>
              </div>

              {/* Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 border border-slate-200 rounded font-sans text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Bill Number</span>
                  <span className="font-mono font-bold text-slate-800 break-all">{billNumber}</span>
                </div>
                {isReceipt && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Receipt Number</span>
                    <span className="font-mono font-bold text-emerald-700 break-all">{receiptNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessment Year</span>
                  <span className="font-semibold text-slate-800">2025 - 2026</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isReceipt ? 'Paid Date' : 'Due Date'}</span>
                  <span className="font-bold text-slate-900">{isReceipt ? paidDateStr : dueDateStr}</span>
                </div>
              </div>

              {/* Property & Taxpayer Details */}
              <div className="font-sans text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 border-b border-slate-300 pb-1">
                  1. Taxpayer & Property Record
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 min-w-[450px]">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold w-1/3 border-r border-slate-200">Taxpayer Name</td>
                        <td className="p-2 font-bold text-slate-900">{taxRecord.citizenName || 'Ramesh Deshmukh'}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Tax Category</td>
                        <td className="p-2 font-bold text-orange-600">{taxRecord.taxCategory || 'Property Tax'}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Property Assessment #</td>
                        <td className="p-2 font-mono font-bold text-slate-800">{taxRecord.propertyNumber || 'KPG-PROP-4218'}</td>
                      </tr>
                      <tr>
                        <td className="p-2 bg-slate-100 font-semibold border-r border-slate-200">Property Address & Ward</td>
                        <td className="p-2">{taxRecord.address || 'Shivaji Chowk, Ward 4, Kopargaon'} (Ward {taxRecord.ward || 4})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Itemized Calculation */}
              <div className="font-sans text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-300 pb-1 mb-2">
                  2. Itemized Assessment Breakdown
                </h3>
                <table className="w-full border-collapse border border-slate-300 text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold uppercase text-[10px]">
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5">Base Assessment ({taxRecord.taxCategory || 'Property Tax'})</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹{baseAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    {penalty > 0 && (
                      <tr>
                        <td className="p-2.5 text-rose-600 font-semibold">Late Payment Interest / Penalty</td>
                        <td className="p-2.5 text-right font-mono text-rose-600 font-semibold">₹{penalty.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-50 font-bold text-sm">
                      <td className="p-3 text-slate-900">{isReceipt ? 'Total Amount Paid' : 'Total Net Amount Payable'}</td>
                      <td className="p-3 text-right font-mono text-emerald-700 text-base">₹{totalPayable.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status & QR Verification */}
              <div className="font-sans border-t-2 border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto border-2 border-slate-900 p-1 bg-white flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block mt-1">Scan to Verify Digital Receipt</span>
                </div>

                <div className="text-center border-y sm:border-y-0 sm:border-x border-slate-300 py-2 sm:py-0 px-2">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 font-bold text-xs rounded border uppercase tracking-wider mb-1 ${
                    isReceipt ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isReceipt ? 'PAYMENT COMPLETED' : 'DEMAND NOTICE ACTIVE'}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Kopargaon Municipal Revenue & Finance Department
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <div className="h-10 flex items-end justify-center sm:justify-end mb-1">
                    <span className="italic font-serif font-bold text-base text-slate-800 underline decoration-slate-400">
                      Er. A. K. Deshmukh
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Chief Revenue Officer</span>
                  <span className="text-[10px] text-slate-500 block">Kopargaon Municipal Corporation</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
