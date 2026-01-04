'use client';

import { useLanguage } from './LanguageContext';
import { Ball } from '@/types/ball';
import { Passive } from '@/types/passive';

export function useTranslation() {
  const { t, language } = useLanguage();

  /**
   * Get translated ball name
   */
  const getBallName = (ball: Ball): string => {
    if (language === 'zh-CN') {
      const translations = (t as any).balls;
      if (translations && translations[ball.id]) {
        return translations[ball.id].name || ball.name;
      }
    }
    return ball.name;
  };

  /**
   * Get translated ball description
   */
  const getBallDescription = (ball: Ball): string => {
    if (language === 'zh-CN') {
      const translations = (t as any).balls;
      if (translations && translations[ball.id]) {
        return translations[ball.id].description || ball.description;
      }
    }
    return ball.description;
  };

  /**
   * Get translated passive name
   */
  const getPassiveName = (passive: Passive): string => {
    if (language === 'zh-CN') {
      const translations = (t as any).passives;
      if (translations && translations[passive.id]) {
        return translations[passive.id].name || passive.name;
      }
    }
    return passive.name;
  };

  /**
   * Get translated passive description
   */
  const getPassiveDescription = (passive: Passive): string => {
    if (language === 'zh-CN') {
      const translations = (t as any).passives;
      if (translations && translations[passive.id]) {
        return translations[passive.id].description || passive.description;
      }
    }
    return passive.description;
  };

  /**
   * Get translated category name
   */
  const getCategoryName = (category: string): string => {
    if (language === 'zh-CN') {
      const translations = (t as any).categories;
      if (translations && translations[category]) {
        return translations[category];
      }
    }
    return category;
  };

  /**
   * Get translated element name
   */
  const getElementName = (element?: string): string => {
    if (!element) return '';
    if (language === 'zh-CN') {
      const translations = (t as any).elements;
      if (translations && translations[element]) {
        return translations[element];
      }
    }
    return element;
  };

  return {
    t,
    language,
    getBallName,
    getBallDescription,
    getPassiveName,
    getPassiveDescription,
    getCategoryName,
    getElementName,
  };
}
