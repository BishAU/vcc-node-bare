import nodemailer from 'nodemailer';
import { formatDate } from './utils';

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface EmailTemplate {
    subject: string;
    html: string;
}

export async function sendEmail(to: string, template: EmailTemplate) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: template.subject,
            html: template.html,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export function getSubscriptionCreatedTemplate(data: {
    customerName: string;
    productName: string;
    amount: number;
    currency: string;
    interval: string;
    nextBillingDate: string;
}): EmailTemplate {
    return {
        subject: 'Subscription Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Thank you for your subscription!</h2>
                <p>Dear ${data.customerName},</p>
                <p>Your subscription to ${data.productName} has been successfully created.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Subscription Details</h3>
                    <p><strong>Product:</strong> ${data.productName}</p>
                    <p><strong>Amount:</strong> ${data.currency} ${(
            data.amount / 100
        ).toFixed(2)}/${data.interval}</p>
                    <p><strong>Next Billing Date:</strong> ${formatDate(
                        data.nextBillingDate
                    )}</p>
                </div>
                
                <p>You can manage your subscription anytime by visiting your account dashboard.</p>
                
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                
                <p>Best regards,<br>Your Team</p>
            </div>
        `,
    };
}

export function getSubscriptionUpdatedTemplate(data: {
    customerName: string;
    productName: string;
    changes: string[];
    nextBillingDate: string;
}): EmailTemplate {
    return {
        subject: 'Subscription Updated',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Subscription Update Confirmation</h2>
                <p>Dear ${data.customerName},</p>
                <p>Your subscription to ${data.productName} has been updated.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Changes Made</h3>
                    <ul>
                        ${data.changes
                            .map((change) => `<li>${change}</li>`)
                            .join('')}
                    </ul>
                    <p><strong>Next Billing Date:</strong> ${formatDate(
                        data.nextBillingDate
                    )}</p>
                </div>
                
                <p>You can review these changes in your account dashboard.</p>
                
                <p>If you didn't make these changes or have any questions, please contact our support team immediately.</p>
                
                <p>Best regards,<br>Your Team</p>
            </div>
        `,
    };
}

export function getSubscriptionCancelledTemplate(data: {
    customerName: string;
    productName: string;
    endDate: string;
}): EmailTemplate {
    return {
        subject: 'Subscription Cancellation Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Subscription Cancellation Confirmation</h2>
                <p>Dear ${data.customerName},</p>
                <p>We're sorry to see you go. Your subscription to ${
                    data.productName
                } has been cancelled.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Cancellation Details</h3>
                    <p>Your subscription will remain active until ${formatDate(
                        data.endDate
                    )}.</p>
                </div>
                
                <p>If you cancelled by mistake or would like to resubscribe, you can do so through your account dashboard.</p>
                
                <p>We'd love to hear your feedback on how we can improve our service.</p>
                
                <p>Best regards,<br>Your Team</p>
            </div>
        `,
    };
}

export function getPaymentFailedTemplate(data: {
    customerName: string;
    productName: string;
    amount: number;
    currency: string;
    retryDate: string;
}): EmailTemplate {
    return {
        subject: 'Payment Failed - Action Required',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Payment Failed</h2>
                <p>Dear ${data.customerName},</p>
                <p>We were unable to process the payment for your subscription to ${
                    data.productName
                }.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Payment Details</h3>
                    <p><strong>Amount:</strong> ${data.currency} ${(
            data.amount / 100
        ).toFixed(2)}</p>
                    <p><strong>Next Retry Date:</strong> ${formatDate(
                        data.retryDate
                    )}</p>
                </div>
                
                <p>To ensure uninterrupted service, please:</p>
                <ol>
                    <li>Check your payment method details in your account dashboard</li>
                    <li>Ensure your card hasn't expired</li>
                    <li>Verify you have sufficient funds available</li>
                </ol>
                
                <p>If you need assistance, please contact our support team.</p>
                
                <p>Best regards,<br>Your Team</p>
            </div>
        `,
    };
}
