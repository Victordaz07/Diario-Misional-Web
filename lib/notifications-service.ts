// lib/notifications-service.ts
import { db } from './firebase';

export interface Notification {
    id: string;
    userId: string;
    type: 'payment_success' | 'payment_failed' | 'new_content' | 'sponsorship_update' | 'general';
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: Date;
    expiresAt?: Date;
}

export interface EmailNotification {
    to: string;
    subject: string;
    html: string;
    text: string;
}

class NotificationsService {
    // Crear notificación
    async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
        try {
            const notificationData = {
                ...notification,
                createdAt: new Date(),
            };

            const docRef = await db.collection('notifications').add(notificationData);
            return docRef.id;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Obtener notificaciones del usuario
    async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
        try {
            const snapshot = await db
                .collection('notifications')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                expiresAt: doc.data().expiresAt?.toDate(),
            })) as Notification[];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    // Marcar notificación como leída
    async markAsRead(notificationId: string): Promise<void> {
        try {
            await db.collection('notifications').doc(notificationId).update({
                read: true,
                readAt: new Date(),
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Marcar todas las notificaciones como leídas
    async markAllAsRead(userId: string): Promise<void> {
        try {
            const snapshot = await db
                .collection('notifications')
                .where('userId', '==', userId)
                .where('read', '==', false)
                .get();

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.update(doc.ref, {
                    read: true,
                    readAt: new Date(),
                });
            });

            await batch.commit();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Eliminar notificación
    async deleteNotification(notificationId: string): Promise<void> {
        try {
            await db.collection('notifications').doc(notificationId).delete();
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    // Limpiar notificaciones expiradas
    async cleanupExpiredNotifications(): Promise<void> {
        try {
            const now = new Date();
            const snapshot = await db
                .collection('notifications')
                .where('expiresAt', '<=', now)
                .get();

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        } catch (error) {
            console.error('Error cleaning up expired notifications:', error);
        }
    }

    // Enviar notificación por email (simulado)
    async sendEmailNotification(emailNotification: EmailNotification): Promise<boolean> {
        try {
            // En un entorno real, aquí integrarías con un servicio como SendGrid, AWS SES, etc.
            console.log('Email notification:', emailNotification);

            // Simular envío exitoso
            return true;
        } catch (error) {
            console.error('Error sending email notification:', error);
            return false;
        }
    }

    // Notificaciones específicas del sistema
    async notifyPaymentSuccess(userId: string, amount: number, planName?: string): Promise<void> {
        const title = '¡Pago Exitoso!';
        const message = planName
            ? `Tu suscripción al ${planName} por $${amount} se ha procesado correctamente.`
            : `Tu donación de $${amount} se ha procesado correctamente.`;

        await this.createNotification({
            userId,
            type: 'payment_success',
            title,
            message,
            data: { amount, planName },
            read: false,
        });
    }

    async notifyPaymentFailed(userId: string, amount: number, reason?: string): Promise<void> {
        const title = 'Pago Fallido';
        const message = `Tu pago de $${amount} no pudo ser procesado.${reason ? ` Razón: ${reason}` : ''}`;

        await this.createNotification({
            userId,
            type: 'payment_failed',
            title,
            message,
            data: { amount, reason },
            read: false,
        });
    }

    async notifyNewContent(userId: string, contentType: string, missionaryName: string): Promise<void> {
        const title = 'Nuevo Contenido Disponible';
        const message = `${missionaryName} ha compartido nuevo contenido: ${contentType}`;

        await this.createNotification({
            userId,
            type: 'new_content',
            title,
            message,
            data: { contentType, missionaryName },
            read: false,
        });
    }

    async notifySponsorshipUpdate(userId: string, action: string, planName?: string): Promise<void> {
        const title = 'Actualización de Patrocinio';
        const message = planName
            ? `Tu patrocinio ${planName} ha sido ${action}.`
            : `Tu patrocinio ha sido ${action}.`;

        await this.createNotification({
            userId,
            type: 'sponsorship_update',
            title,
            message,
            data: { action, planName },
            read: false,
        });
    }

    // Obtener estadísticas de notificaciones
    async getNotificationStats(userId: string): Promise<{
        total: number;
        unread: number;
        byType: Record<string, number>;
    }> {
        try {
            const snapshot = await db
                .collection('notifications')
                .where('userId', '==', userId)
                .get();

            const notifications = snapshot.docs.map(doc => doc.data()) as Notification[];

            const stats = {
                total: notifications.length,
                unread: notifications.filter(n => !n.read).length,
                byType: notifications.reduce((acc, n) => {
                    acc[n.type] = (acc[n.type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
            };

            return stats;
        } catch (error) {
            console.error('Error getting notification stats:', error);
            return { total: 0, unread: 0, byType: {} };
        }
    }
}

export const notificationsService = new NotificationsService();
