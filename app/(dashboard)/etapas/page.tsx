'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import {
    MissionStage,
    MissionCall,
    MissionProgress,
    mockMissionCall,
    getStageStatus,
    calculateOverallProgress,
    generatePreMissionTasks,
    generateAchievements
} from '@/lib/mission-stages';
import { calculateStageDates } from '@/lib/mtc-data';

export default function EtapasPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [missionCall] = useState<MissionCall>(mockMissionCall);
    const [stages, setStages] = useState<MissionStage[]>([]);
    const [progress, setProgress] = useState<MissionProgress>({
        currentStage: 'pre-mission',
        overallProgress: 0,
        daysInMission: 0,
        completedTasks: 0,
        totalTasks: 0,
        achievements: []
    });

    useEffect(() => {
        // Calculate stage dates based on mission call
        const stageDates = calculateStageDates(missionCall.callDate, missionCall.needsLanguageLearning);
        const today = new Date();

        // Calculate days in mission
        const missionStart = stageDates.missionFieldStart;
        const daysInMission = Math.max(0, Math.floor((today.getTime() - missionStart.getTime()) / (1000 * 60 * 60 * 24)));

        // Generate stages with dynamic status
        const generatedStages: MissionStage[] = [
            {
                id: 'pre-mission',
                title: t('preMission'),
                description: t('preMissionDesc'),
                status: getStageStatus({
                    stageStart: stageDates.preMissionStart,
                    stageEnd: stageDates.preMissionEnd,
                    today: today
                }),
                startDate: stageDates.preMissionStart,
                endDate: stageDates.preMissionEnd,
                tasks: generatePreMissionTasks(),
                achievements: generateAchievements('pre-mission')
            },
            {
                id: 'mtc',
                title: t('mtc'),
                description: t('mtcDesc'),
                status: getStageStatus({
                    stageStart: stageDates.mtcStart,
                    stageEnd: stageDates.mtcEnd,
                    today: today
                }),
                startDate: stageDates.mtcStart,
                endDate: stageDates.mtcEnd,
                tasks: [],
                achievements: []
            },
            {
                id: 'mission-field',
                title: t('missionField'),
                description: t('fieldDesc'),
                status: getStageStatus({
                    stageStart: stageDates.missionFieldStart,
                    stageEnd: stageDates.missionFieldEnd,
                    today: today
                }),
                startDate: stageDates.missionFieldStart,
                endDate: stageDates.missionFieldEnd,
                tasks: [],
                achievements: []
            },
            {
                id: 'post-mission',
                title: t('postMission'),
                description: t('postMissionDesc'),
                status: getStageStatus({
                    stageStart: stageDates.postMissionStart,
                    stageEnd: stageDates.postMissionEnd,
                    today: today
                }),
                startDate: stageDates.postMissionStart,
                endDate: stageDates.postMissionEnd,
                tasks: [],
                achievements: []
            }
        ];

        setStages(generatedStages);

        // Calculate overall progress
        const overallProgress = calculateOverallProgress(generatedStages, daysInMission);
        setProgress({
            currentStage: overallProgress.currentStage,
            overallProgress: overallProgress.overallProgress,
            daysInMission: daysInMission,
            completedTasks: overallProgress.completedTasks,
            totalTasks: overallProgress.totalTasks,
            achievements: overallProgress.achievements
        });
    }, [missionCall, t]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return { text: t('completed'), bgColor: 'bg-green-100', textColor: 'text-green-700' };
            case 'current':
                return { text: t('current'), bgColor: 'bg-primary', textColor: 'text-white' };
            case 'available':
                return { text: t('available'), bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
            case 'locked':
                return { text: t('locked'), bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
            default:
                return { text: t('unknown'), bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
        }
    };

    const completedStages = stages.filter(s => s.status === 'completed').length;
    const currentStages = stages.filter(s => s.status === 'current').length;
    const lockedStages = stages.filter(s => s.status === 'locked').length;
    const currentStage = stages.find(s => s.status === 'current');

    return (
        <div className="p-4">
            {/* Header */}
            <section className="mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-seedling text-white text-lg"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{t('stagesTitle')}</h2>
                        <p className="text-gray-600">{t('stagesSubtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Mission Journey Card */}
            <section className="mb-6">
                <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{t('journeyTitle')}</h3>
                            <p className="text-primary-100">{t('journeySubtitle')}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{progress.daysInMission}</div>
                            <div className="text-sm text-primary-100">{t('dayOfService')}</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <i className="fa-solid fa-calendar text-primary-200"></i>
                            <span>{missionCall.mission}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i className="fa-solid fa-map-marker-alt text-primary-200"></i>
                            <span>{missionCall.mission}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i className="fa-solid fa-building text-primary-200"></i>
                            <span>{t('mtc')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Progress Summary */}
            <section className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">{completedStages}</div>
                        <div className="text-sm text-gray-600">{t('completedStages')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{currentStages}</div>
                        <div className="text-sm text-gray-600">{t('currentStageCount')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{lockedStages}</div>
                        <div className="text-sm text-gray-600">{t('futureStages')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{progress.overallProgress.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">{t('overallProgress')}</div>
                    </div>
                </div>
            </section>

            {/* Current Stage */}
            {currentStage && (
                <section className="mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{t('currentStage')}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(currentStage.status).bgColor} ${getStatusBadge(currentStage.status).textColor}`}>
                                {getStatusBadge(currentStage.status).text}
                            </span>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">{currentStage.title}</h4>
                            <p className="text-gray-600">{currentStage.description}</p>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-primary font-medium">{t('currentStageMessage')} {currentStage.title.toLowerCase()}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Stages Timeline */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('stagesTimeline')}</h3>
                <div className="space-y-4">
                    {stages.map((stage, index) => {
                        const statusBadge = getStatusBadge(stage.status);
                        const isLast = index === stages.length - 1;
                        
                        return (
                            <div key={stage.id} className="relative">
                                <div className="flex items-start space-x-4">
                                    {/* Timeline dot */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        stage.status === 'completed' ? 'bg-green-500' :
                                        stage.status === 'current' ? 'bg-primary' :
                                        stage.status === 'available' ? 'bg-blue-500' :
                                        'bg-gray-300'
                                    }`}>
                                        <i className={`fa-solid ${
                                            stage.status === 'completed' ? 'fa-check' :
                                            stage.status === 'current' ? 'fa-play' :
                                            stage.status === 'available' ? 'fa-unlock' :
                                            'fa-lock'
                                        } text-white text-sm`}></i>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-lg font-semibold text-gray-800">{stage.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}>
                                                {statusBadge.text}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 mb-4">{stage.description}</p>
                                        
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <i className="fa-solid fa-calendar"></i>
                                                <span>{stage.startDate.toLocaleDateString()} - {stage.endDate?.toLocaleDateString() || t('present')}</span>
                                            </div>
                                        </div>
                                        
                                        {stage.status === 'current' && (
                                            <div className="mt-4">
                                                <Link 
                                                    href={`/etapas/${stage.id}`}
                                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                                >
                                                    <i className="fa-solid fa-arrow-right"></i>
                                                    <span>{t('viewDetails')}</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Timeline line */}
                                {!isLast && (
                                    <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}