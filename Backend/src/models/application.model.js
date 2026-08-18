import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    coverLetter: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Interview Completed',
        'Selected',
        'Offer Sent',
        'Offer Accepted',
        'Offer Rejected',
        'Rejected',
      ],
      default: 'Applied',
    },
    interview: {
      interviewDate: Date,
      interviewTime: String,
      meetingLink: String,
      message: String,

      candidateResponse: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
      },

      result: {
        type: String,
        enum: ['Pending', 'Selected', 'Rejected'],
        default: 'Pending',
      },

      resultMessage: {
        type: String,
        default: '',
      },
    },

    offer: {
      status: {
        type: String,
        enum: ['Not Created', 'Sent', 'Accepted', 'Rejected'],
        default: 'Not Created',
      },

      position: String,

      salary: Number,

      joiningDate: Date,

      expiryDate: Date,

      message: String,

      offerLetterUrl: String,

      candidateResponse: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
      },

      respondedAt: Date,

      createdAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
