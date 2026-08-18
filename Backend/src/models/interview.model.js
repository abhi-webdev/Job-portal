import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },

    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    interviewType: {
      type: String,
      enum: [
        'Online',
        'Offline',
        'Phone',
      ],
      required: true,
    },

    meetingLink: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      default: '',
    },

    instructions: {
      type: String,
      default: '',
    },

    candidateResponse: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Rejected',
      ],
      default: 'Pending',
    },

    result: {
      type: String,
      enum: [
        'Pending',
        'Passed',
        'Failed',
      ],
      default: 'Pending',
    },

    feedback: {
      type: String,
      default: '',
    },

    resultUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model(
  'Interview',
  interviewSchema
);

export default Interview;