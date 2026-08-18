import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: '',
    },

    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;