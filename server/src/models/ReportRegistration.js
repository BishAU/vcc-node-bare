import mongoose from 'mongoose';

const reportRegistrationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  marketingOptIn: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
reportRegistrationSchema.index({ email: 1 });
reportRegistrationSchema.index({ createdAt: -1 });

export const ReportRegistration = mongoose.model('ReportRegistration', reportRegistrationSchema);
