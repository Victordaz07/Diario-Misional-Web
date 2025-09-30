'use client';

import { useTranslations } from '@/lib/use-translations';

const languages = [
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'pt-BR' as const, name: 'Português', flag: '🇧🇷' },
];

export default function LanguageSelector() {
    const { language, setLanguage } = useTranslations();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value as any;
        console.log('Changing language to:', newLanguage);
        setLanguage(newLanguage);
    };

    return (
        <div className="relative">
            <select
                value={language}
                onChange={handleLanguageChange}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}