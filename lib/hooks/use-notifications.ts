// lib/hooks/use-notifications.ts
import { useState, useEffect } from 'react';
import { notificationsService, Notification } from '@/lib/notifications-service';

export function useNotifications(userId?: string) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                const userNotifications = await notificationsService.getUserNotifications(userId);
                setNotifications(userNotifications);
                setUnreadCount(userNotifications.filter(n => !n.read).length);
            } catch (error) {
                console.error('Error loading notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, [userId]);

    const markAsRead = async (notificationId: string) => {
        try {
            await notificationsService.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;

        try {
            await notificationsService.markAllAsRead(userId);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await notificationsService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
}
