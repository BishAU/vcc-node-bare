import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Load and compile email template
const loadTemplate = async (templateName: string) => {
  const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.hbs`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  return handlebars.compile(templateContent);
};

export const sendEmail = async ({ to, subject, template, context }: EmailOptions) => {
  try {
    // Load and compile template
    const compiledTemplate = await loadTemplate(template);
    const html = compiledTemplate(context);

    // Send email
    await transporter.sendMail({
      from: `"VCC Support" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
