import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, FileText, Upload, CheckCircle2, Save, FileCheck, Building2, MapPin, Hash, User, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { PERMISSION_CATEGORIES, REQUIRED_DOCUMENTS } from '../../utils/governanceUtils';
import { useApp } from '../../context/AppContext';

export const PermissionApplicationModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { citizenUser, submitPermissionApplication, showToast } = useApp();

  const [step, setStep] = useState(1); // 1: Category, 2: Details, 3: Documents, 4: Review
  const [category, setCategory] = useState('Residential');
  const [permissionType, setPermissionType] = useState('New House Construction');
  
  const [formData, setFormData] = useState({
    applicantName: citizenUser?.fullName || citizenUser?.name || '',
    applicantEmail: citizenUser?.email || 'citizen@kopargaon.gov.in',
    applicantPhone: citizenUser?.phone || '+91 98765 43210',
    aadhaarNumber: citizenUser?.aadhaar || '1234-5678-9012',
    propertyNumber: 'KPG-PROP-4218',
    propertyAddress: citizenUser?.address || 'Shivaji Chowk, Ward 4, Kopargaon - 423601',
    wardNumber: citizenUser?.ward || 4,
    estimatedCost: '15,00,000',
    proposedDuration: '6 Months',
    projectDescription: 'Construction of a G+1 residential building on plot #42, Shivaji Nagar.',
    uploadedDocs: {}
  });

  if (!isOpen) return null;

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setPermissionType(PERMISSION_CATEGORIES[cat][0]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocUpload = (docName) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocs: {
        ...prev.uploadedDocs,
        [docName]: `DOC_${Date.now().toString().slice(-4)}.pdf`
      }
    }));
    showToast(`Uploaded: ${docName}`, 'info');
  };

  const handleSaveDraft = () => {
    showToast('Application draft saved locally. You can resume anytime.', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const appData = {
      category,
      permissionType,
      ...formData,
      status: 'Submitted'
    };

    const created = submitPermissionApplication(appData);
    if (created) {
      setStep(1);
      onClose();
    }
  };

  const requiredDocs = REQUIRED_DOCUMENTS[category] || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Action Header */}
          <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  {t('permissionPortal.headerGovt', 'KOPARGAON MUNICIPAL CORPORATION')}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  {t('permissionPortal.headerTitle', 'Online Municipal Permission & Licensing Application')}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-700/60 shrink-0">
            <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-bold">
              {[
                { num: 1, label: t('permissionPortal.stepCategory', 'Category') },
                { num: 2, label: t('permissionPortal.stepDetails', 'Details') },
                { num: 3, label: t('permissionPortal.stepDocuments', 'Documents') },
                { num: 4, label: t('permissionPortal.stepReview', 'Review & Submit') }
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step === s.num ? 'bg-orange-600 text-white shadow-sm' : step > s.num ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`hidden sm:inline ${step === s.num ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans">

            {/* STEP 1: Select Category & Permission Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t('permissionPortal.selectCategoryTitle', 'Select Permission Category')}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    {t('permissionPortal.selectCategoryDesc', 'Choose the type of municipal clearance required for your property or business in Kopargaon.')}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.keys(PERMISSION_CATEGORIES).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        category === cat
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold shadow-md'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="text-[11px] leading-tight">{cat.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {t('permissionPortal.labelPermissionType', 'Specific Permission Type *')}
                  </label>
                  <select
                    value={permissionType}
                    onChange={(e) => setPermissionType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-bold text-xs"
                  >
                    {PERMISSION_CATEGORIES[category].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-2xl text-sky-900 dark:text-sky-300">
                  <h5 className="font-bold mb-1 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-sky-600" />
                    {t('permissionPortal.overviewPrefix', 'Overview:')} {permissionType}
                  </h5>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    {t('permissionPortal.overviewSlaNote', 'This permission requires verification by the Kopargaon Town Planning & Works Department. Estimated SLA processing time is 3 working days upon complete document submission.')}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: Application & Property Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {t('permissionPortal.step2Title', 'Applicant & Site Property Details')}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelApplicantName', 'Applicant Name *')}</label>
                    <input
                      type="text"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelAadhaar', 'Aadhaar Number *')}</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-mono font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelPropertyExtract', 'Property Assessment # / 7-12 Extract *')}</label>
                    <input
                      type="text"
                      name="propertyNumber"
                      value={formData.propertyNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-mono font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelWardJurisdiction', 'Ward Jurisdiction *')}</label>
                    <select
                      name="wardNumber"
                      value={formData.wardNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-semibold"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(w => (
                        <option key={w} value={w}>{t('taxPortal.wardPrefix', 'Ward')} {w}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelSiteAddress', 'Site Address & Location Landmark *')}</label>
                    <input
                      type="text"
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelEstValue', 'Estimated Project Value (₹)')}</label>
                    <input
                      type="text"
                      name="estimatedCost"
                      value={formData.estimatedCost}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelDuration', 'Proposed Execution Duration')}</label>
                    <input
                      type="text"
                      name="proposedDuration"
                      value={formData.proposedDuration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t('permissionPortal.labelDescription', 'Project Work Description')}</label>
                    <textarea
                      name="projectDescription"
                      rows={3}
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Mandatory Document Uploads */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t('permissionPortal.step3Title', 'Mandatory Verification Documents')}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    {t('permissionPortal.step3Subtitle', 'Upload certified digital copies for your application. Supported formats: PDF, JPG, PNG.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {requiredDocs.map((doc) => {
                    const isUploaded = !!formData.uploadedDocs[doc];
                    return (
                      <div
                        key={doc}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                          isUploaded ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-900 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold block text-xs">{doc}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {isUploaded ? formData.uploadedDocs[doc] : t('permissionPortal.notUploaded', 'Not Uploaded Yet')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDocUpload(doc)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all ${
                            isUploaded ? 'bg-emerald-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          {isUploaded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> {t('permissionPortal.statusUploaded', 'Uploaded')}
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" /> {t('permissionPortal.btnAttach', 'Attach')}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 rounded-2xl">
                  <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300 mb-1">
                    {t('permissionPortal.summaryTitle', 'Application Summary & Legal Declaration')}
                  </h4>
                  <p className="text-[11px] text-orange-800 dark:text-orange-400 leading-relaxed">
                    {t('permissionPortal.summaryDesc', 'Please review your application details. Upon submission, an official tracking ID will be generated and assigned to the Town Planning & Municipal Engineering department.')}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-sans">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('permissionPortal.thCategory', 'Category')}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('permissionPortal.thPermissionType', 'Permission Type')}</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">{permissionType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('permissionPortal.thApplicant', 'Applicant')}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('permissionPortal.thWard', 'Ward')}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t('taxPortal.wardPrefix', 'Ward')} {formData.wardNumber}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t('permissionPortal.uploadedDocsTitle', 'Uploaded Evidence Documents')}</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(formData.uploadedDocs).length > 0 ? (
                      Object.entries(formData.uploadedDocs).map(([k, v]) => (
                        <span key={k} className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                          ✓ {k} ({v})
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-amber-600 italic">{t('permissionPortal.selfDecAttached', 'Self-declaration attached (No optional PDFs uploaded)')}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors text-xs"
            >
              <Save className="w-4 h-4" /> {t('permissionPortal.btnSaveDraft', 'Save Draft')}
            </button>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1 text-xs"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('permissionPortal.btnBack', 'Back')}
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center gap-1 text-xs shadow-md"
                >
                  {t('permissionPortal.btnNext', 'Next Step')} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 text-xs shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> {t('permissionPortal.btnSubmitApp', 'Submit Application')}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
