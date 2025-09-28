'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, getTranslation, Language, Translations } from './translations';

interface TranslationContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
    translations: Translations;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('es');

    useEffect(() => {
        // Get language from localStorage or browser language
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && translations[savedLanguage]) {
            setLanguage(savedLanguage);
        } else {
            // Detect browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('en')) {
                setLanguage('en');
            } else if (browserLang.startsWith('fr')) {
                setLanguage('fr');
            } else if (browserLang.startsWith('pt')) {
                setLanguage('pt-BR');
            } else {
                setLanguage('es'); // Default to Spanish
            }
        }
    }, []);

    const handleSetLanguage = (newLanguage: Language) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    const t = (key: string) => getTranslation(language, key);

    return (
        <TranslationContext.Provider
            value={{
                language,
                setLanguage: handleSetLanguage,
                t,
                translations: translations[language]
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslations() {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslations must be used within a TranslationProvider');
    }
    return context;
}
