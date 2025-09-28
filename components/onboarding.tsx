'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/use-translations';

interface OnboardingSlide {
    icon: string;
    title: string;
    description: string;
    iconColor?: string;
    bgColor?: string;
}

const getSlides = (t: (key: string) => string): OnboardingSlide[] => [
    {
        icon: 'fa-solid fa-heart',
        title: t('onboarding.welcome'),
        description: t('onboarding.welcomeMessage'),
    },
    {
        icon: 'fa-solid fa-pen-to-square',
        title: t('onboarding.writeHistory'),
        description: t('onboarding.writeHistoryMessage'),
    },
    {
        icon: 'fa-solid fa-users',
        title: t('onboarding.connectFamily'),
        description: t('onboarding.connectFamilyMessage'),
    },
    {
        icon: 'fa-solid fa-crown',
        title: t('onboarding.finalAlbum'),
        description: t('onboarding.finalAlbumMessage'),
        iconColor: 'text-secondary',
        bgColor: 'bg-secondary/20',
    },
];

export default function OnboardingScreen() {
    const { t } = useTranslations();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const slides = getSlides(t);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const updateCarousel = () => {
        if (carouselRef.current) {
            const slideWidth = carouselRef.current.clientWidth;
            carouselRef.current.scrollTo({
                left: currentSlide * slideWidth,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        updateCarousel();
    }, [currentSlide]);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleStart = () => {
        router.push('/login');
    };

    const handleSkip = () => {
        router.push('/login');
    };

    // Touch handling
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentSlide < slides.length - 1) {
            nextSlide();
        }
        if (isRightSwipe && currentSlide > 0) {
            prevSlide();
        }
    };

    return (
        <>
            {/* Font Awesome CDN */}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>

            <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>

                <div className="relative z-10 flex flex-col h-screen">
                    {/* Header */}
                    <header className="p-4 sm:p-6 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-book text-white text-sm sm:text-lg"></i>
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-base sm:text-lg">{t('common.appName')}</h1>
                                <p className="text-white/80 text-xs">{t('common.webApp')}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSkip}
                            className="text-white/80 text-sm font-medium hover:text-white transition-colors"
                        >
                            {t('common.skip')}
                        </button>
                    </header>

                    {/* Carousel Section */}
                    <div className="flex-1 flex flex-col">
                        <div
                            ref={carouselRef}
                            className="carousel-container flex overflow-x-auto snap-x snap-mandatory flex-1"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className="w-full flex-shrink-0 snap-center flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center"
                                >
                                    <div className={`w-24 h-24 sm:w-32 sm:h-32 ${slide.bgColor || 'bg-white/20'
                                        } backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 transition-all duration-500 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                                        }`}>
                                        <i className={`${slide.icon} ${slide.iconColor || 'text-white'
                                            } text-3xl sm:text-5xl`}></i>
                                    </div>
                                    <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 transition-all duration-500 delay-100 ${
                                        isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                                    }">
                                        {slide.title}
                                    </h2>
                                    <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-sm sm:max-w-md lg:max-w-lg mx-auto transition-all duration-500 delay-200 ${
                                        isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                                    }">
                                        {slide.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Navigation Section */}
                        <div className="p-4 sm:p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={prevSlide}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                        }`}
                                    disabled={currentSlide === 0}
                                >
                                    <i className="fa-solid fa-chevron-left text-sm sm:text-base"></i>
                                </button>

                                <button
                                    onClick={nextSlide}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 ${currentSlide === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                        }`}
                                    disabled={currentSlide === slides.length - 1}
                                >
                                    <i className="fa-solid fa-chevron-right text-sm sm:text-base"></i>
                                </button>
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={handleStart}
                                className={`w-full bg-white text-primary font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-500 hover:scale-[1.02] ${currentSlide === slides.length - 1
                                    ? 'opacity-100 transform translate-y-0'
                                    : 'opacity-0 transform translate-y-4 pointer-events-none'
                                    }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-base sm:text-lg">{t('onboarding.startDiary')}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
        </>
    );
}
