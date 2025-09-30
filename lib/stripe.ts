// lib/stripe.ts
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Configuración del servidor (para webhooks y operaciones del servidor)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

// Configuración del cliente (para operaciones del frontend)
export const getStripe = () => {
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Configuración de precios de planes de patrocinio
export const SPONSORSHIP_PLANS = {
    family: {
        priceId: process.env.STRIPE_FAMILY_PLAN_PRICE_ID!,
        name: 'Plan Familiar',
        price: 5,
        currency: 'USD',
        interval: 'month',
        features: [
            'Acceso al feed de progreso',
            'Reportes mensuales',
            'Actualizaciones semanales'
        ]
    },
    bronze: {
        priceId: process.env.STRIPE_BRONZE_PLAN_PRICE_ID!,
        name: 'Plan Bronce',
        price: 25,
        currency: 'USD',
        interval: 'month',
        features: [
            'Todo lo del Plan Familiar',
            'Mención en reportes',
            'Acceso a contenido exclusivo'
        ]
    },
    silver: {
        priceId: process.env.STRIPE_SILVER_PLAN_PRICE_ID!,
        name: 'Plan Plata',
        price: 50,
        currency: 'USD',
        interval: 'month',
        features: [
            'Todo lo del Plan Bronce',
            'Acceso anticipado a contenido',
            'Reportes detallados'
        ]
    },
    gold: {
        priceId: process.env.STRIPE_GOLD_PLAN_PRICE_ID!,
        name: 'Plan Oro',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: [
            'Todo lo del Plan Plata',
            'Llamada trimestral con misionero',
            'Contenido premium exclusivo'
        ]
    }
};

// Función para crear una sesión de checkout
export async function createCheckoutSession({
    planId,
    missionaryId,
    viewerId,
    successUrl,
    cancelUrl
}: {
    planId: string;
    missionaryId: string;
    viewerId: string;
    successUrl: string;
    cancelUrl: string;
}) {
    const plan = SPONSORSHIP_PLANS[planId as keyof typeof SPONSORSHIP_PLANS];

    if (!plan) {
        throw new Error('Plan no encontrado');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: plan.priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            missionaryId,
            viewerId,
            planId,
        },
        customer_email: undefined, // Se puede agregar si se tiene el email
        subscription_data: {
            metadata: {
                missionaryId,
                viewerId,
                planId,
            },
        },
    });

    return session;
}

// Función para crear una sesión de pago único
export async function createOneTimePaymentSession({
    amount,
    missionaryId,
    viewerId,
    successUrl,
    cancelUrl
}: {
    amount: number;
    missionaryId: string;
    viewerId: string;
    successUrl: string;
    cancelUrl: string;
}) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Donación Única - Diario Misional',
                        description: `Donación única para apoyar la misión`,
                    },
                    unit_amount: amount * 100, // Stripe usa centavos
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            missionaryId,
            viewerId,
            type: 'one-time',
            amount: amount.toString(),
        },
    });

    return session;
}

// Función para crear un portal de cliente
export async function createCustomerPortalSession({
    customerId,
    returnUrl
}: {
    customerId: string;
    returnUrl: string;
}) {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    return session;
}

// Función para obtener información de una suscripción
export async function getSubscription(subscriptionId: string) {
    return await stripe.subscriptions.retrieve(subscriptionId);
}

// Función para cancelar una suscripción
export async function cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.cancel(subscriptionId);
}

// Función para obtener el historial de pagos de un cliente
export async function getCustomerPayments(customerId: string) {
    const payments = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 100,
    });

    return payments;
}
