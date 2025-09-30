// app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createOneTimePaymentSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { planId, amount, missionaryId, viewerId, type } = body;

        if (!missionaryId || !viewerId) {
            return NextResponse.json(
                { error: 'Faltan parámetros requeridos' },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const successUrl = `${baseUrl}/portal-familiar?success=true`;
        const cancelUrl = `${baseUrl}/portal-familiar?canceled=true`;

        let session;

        if (type === 'one-time' && amount) {
            // Crear sesión para pago único
            session = await createOneTimePaymentSession({
                amount,
                missionaryId,
                viewerId,
                successUrl,
                cancelUrl,
            });
        } else if (planId) {
            // Crear sesión para suscripción
            session = await createCheckoutSession({
                planId,
                missionaryId,
                viewerId,
                successUrl,
                cancelUrl,
            });
        } else {
            return NextResponse.json(
                { error: 'Tipo de pago no válido' },
                { status: 400 }
            );
        }

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
