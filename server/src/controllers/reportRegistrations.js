import { ReportRegistration } from '../models/ReportRegistration.js';
import { sendEmail } from '../utils/email.js';

export const reportRegistrationsApi = {
  create: async (req, res) => {
    try {
      const { email, firstName, lastName, company, state, marketingOptIn } = req.body;
      console.log('Received registration request:', { email, firstName, lastName, company, state, marketingOptIn });

      // Check if email already exists
      const existingRegistration = await ReportRegistration.findOne({ email });
      if (existingRegistration) {
        console.log('Email already registered:', email);
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new registration
      console.log('Creating new registration...');
      const registration = await ReportRegistration.create({
        email,
        firstName,
        lastName,
        company,
        state,
        marketingOptIn
      });
      console.log('Registration created:', registration);

      try {
        // Send confirmation email
        console.log('Sending confirmation email...');
        await sendEmail({
          to: email,
          subject: 'Your VCC Employment Report',
          template: 'report-registration',
          context: {
            firstName,
            reportUrl: process.env.REPORT_URL,
            unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe?email=${email}`
          }
        });
        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the registration if email fails
      }

      res.status(201).json({
        message: 'Registration successful',
        data: registration
      });
    } catch (error) {
      console.error('Error in report registration:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const registrations = await ReportRegistration.find()
        .sort({ createdAt: -1 });
      res.json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};
