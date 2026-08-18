import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },

    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    position: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    offerLetterUrl: {
      type: String,
      default: '',
    },

    expiresAt: {
      type: Date,
      required: true,
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

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model(
  'Offer',
  offerSchema
);

export default Offer;