import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';
import { LANGUAGES } from '../i18n/languages';

export const LanguageSelector = ({ variant = 'topbar', className = '' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const currentLanguageCode = i18n.language || 'en';
  const currentLangObj = LANGUAGES.find(l => l.code === currentLanguageCode) || LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-200 ${
          variant === 'topbar'
            ? 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-orange-500/60 hover:text-white shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-orange-500 shadow-sm'
        }`}
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-orange-500 shrink-0 animate-pulse-slow" />
        <span className="font-bold tracking-wide">{currentLangObj.nativeName}</span>
        <span className="text-[10px] text-slate-400 font-normal uppercase hidden sm:inline">({currentLangObj.code})</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header & Search Bar */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 pb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-orange-500" />
                {t('common.selectLanguage', 'Select Language')}
              </span>
              <span className="text-[9px] bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded font-mono">
                {LANGUAGES.length} Indian Languages
              </span>
            </div>

            <div className="relative mt-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('common.searchLanguage', 'Search language...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                autoFocus
              />
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguageCode;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({lang.name})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded">
                        {lang.code}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                No matching language found
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
            Automatic English Fallback Active
          </div>

        </div>
      )}
    </div>
  );
};
