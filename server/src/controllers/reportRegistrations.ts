import { Request, Response } from 'express';
import ReportRegistration from '../models/ReportRegistration';
import { sendEmail } from '../utils/email';

export const createReportRegistration = async (req: Request, res: Response) => {
  try {
    const { email, company, state, firstName, lastName, marketingOptIn } = req.body;

    // Check if user already registered
    const existingRegistration = await ReportRegistration.findOne({ email });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'This email has already been registered for the report.',
      });
    }

    // Create new registration
    const registration = new ReportRegistration({
      email,
      company,
      state,
      firstName,
      lastName,
      marketingOptIn,
    });

    await registration.save();

    // Send confirmation email with report
    await sendEmail({
      to: email,
      subject: 'Your VCC Employment Report',
      template: 'report-registration',
      context: {
        firstName,
        reportUrl: process.env.REPORT_URL,
        unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe?email=${email}`,
      },
    });

    // If user opted in for marketing, add to marketing list
    if (marketingOptIn) {
      // TODO: Add to marketing email list (e.g., Mailchimp, SendGrid)
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Check your email for the report.',
    });
  } catch (error) {
    console.error('Report registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
    });
  }
};

export const getReportRegistrations = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, state } = req.query;
    const query = state ? { state } : {};

    const registrations = await ReportRegistration.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await ReportRegistration.countDocuments(query);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations.',
    });
  }
};
