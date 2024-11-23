import { Schema, model } from 'mongoose';

interface IReportRegistration {
  email: string;
  company: string;
  state: string;
  firstName: string;
  lastName: string;
  marketingOptIn: boolean;
  createdAt: Date;
}

const reportRegistrationSchema = new Schema<IReportRegistration>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    enum: [
      'Victoria',
      'New South Wales',
      'Queensland',
      'Western Australia',
      'South Australia',
      'Tasmania',
      'Northern Territory',
      'Australian Capital Territory',
    ],
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  marketingOptIn: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
reportRegistrationSchema.index({ email: 1 });
reportRegistrationSchema.index({ state: 1 });
reportRegistrationSchema.index({ createdAt: -1 });

const ReportRegistration = model<IReportRegistration>('ReportRegistration', reportRegistrationSchema);

export default ReportRegistration;
