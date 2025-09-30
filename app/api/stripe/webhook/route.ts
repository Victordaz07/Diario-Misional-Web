// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const { missionaryId, viewerId, planId, type, amount } = session.metadata;

    if (type === 'one-time') {
        // Registrar donación única
        await db.collection('donations').add({
            id: session.id,
            viewerId,
            missionaryId,
            amount: parseInt(amount!),
            currency: 'USD',
            status: 'completed',
            type: 'one-time',
            planId: null,
            stripeSessionId: session.id,
            createdAt: new Date(),
        });
    } else {
        // Registrar suscripción
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await db.collection('subscriptions').add({
            id: subscription.id,
            viewerId,
            missionaryId,
            planId,
            status: 'active',
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            createdAt: new Date(),
        });

        // Registrar la primera donación
        await db.collection('donations').add({
            id: `don-${Date.now()}`,
            viewerId,
            missionaryId,
            amount: subscription.items.data[0].price.unit_amount! / 100,
            currency: 'USD',
            status: 'completed',
            type: 'sponsorship',
            planId,
            stripeSessionId: session.id,
            stripeSubscriptionId: subscription.id,
            createdAt: new Date(),
        });
    }

    // Actualizar estado del viewer
    await db.collection('viewers').doc(viewerId).update({
        stripeCustomerId: session.customer as string,
        lastPaymentDate: new Date(),
        status: 'active',
    });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const { missionaryId, viewerId, planId } = subscription.metadata;

    // Registrar pago exitoso
    await db.collection('donations').add({
        id: `don-${Date.now()}`,
        viewerId,
        missionaryId,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'completed',
        type: 'sponsorship',
        planId,
        stripeInvoiceId: invoice.id,
        stripeSubscriptionId: subscription.id,
        createdAt: new Date(),
    });

    // Actualizar fecha de último pago
    await db.collection('viewers').doc(viewerId).update({
        lastPaymentDate: new Date(),
        status: 'active',
    });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const { viewerId } = subscription.metadata;

    // Registrar pago fallido
    await db.collection('donations').add({
        id: `don-failed-${Date.now()}`,
        viewerId,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        status: 'failed',
        type: 'sponsorship',
        stripeInvoiceId: invoice.id,
        stripeSubscriptionId: subscription.id,
        createdAt: new Date(),
    });

    // Actualizar estado del viewer
    await db.collection('viewers').doc(viewerId).update({
        status: 'payment_failed',
        lastPaymentAttempt: new Date(),
    });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const { viewerId } = subscription.metadata;

    await db.collection('subscriptions').doc(subscription.id).update({
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
    });

    // Actualizar estado del viewer
    await db.collection('viewers').doc(viewerId).update({
        status: subscription.status === 'active' ? 'active' : 'inactive',
        updatedAt: new Date(),
    });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const { viewerId } = subscription.metadata;

    await db.collection('subscriptions').doc(subscription.id).update({
        status: 'canceled',
        canceledAt: new Date(),
    });

    // Actualizar estado del viewer
    await db.collection('viewers').doc(viewerId).update({
        status: 'canceled',
        canceledAt: new Date(),
    });
}
