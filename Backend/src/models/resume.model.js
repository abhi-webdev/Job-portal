import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
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
  { timestamps: true },
);

const resume = mongoose.model("Resume", resumeSchema)

export default resume
