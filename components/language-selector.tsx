'use client';

import { useTranslations } from '@/lib/use-translations';

const languageOptions = [
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
];

export default function LanguageSelector() {
    const { language, setLanguage } = useTranslations();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as any);
    };

    const currentOption = languageOptions.find(opt => opt.value === language);

    return (
        <div className="relative">
            <select
                value={language}
                onChange={handleLanguageChange}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary bg-white appearance-none pr-8"
            >
                {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.flag} {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
            </div>
        </div>
    );
}
