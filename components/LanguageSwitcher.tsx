'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh-CN')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'zh-CN'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        中文
      </button>
    </div>
  );
}
