import Application from '../models/application.model.js';

const respondToInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { response } = req.body;

    if (!['Accepted', 'Rejected'].includes(response)) {
      return res.status(400).json({
        message: 'Invalid interview response',
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      applicant: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    if (application.status !== 'Interview Scheduled') {
      return res.status(400).json({
        message: 'Interview response is not available for this application',
      });
    }

    application.interview.candidateResponse = response;

    application.status =
      response === 'Accepted' ? 'Interview Accepted' : 'Interview Rejected';

    await application.save();

    return res.status(200).json({
      message:
        response === 'Accepted'
          ? 'Interview accepted successfully'
          : 'Interview rejected successfully',

      application,
    });
  } catch (error) {
    console.error('Interview response error:', error);

    return res.status(500).json({
      message: 'Failed to update interview response',
    });
  }
};

const respondToOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { response } = req.body;

    if (!['Accepted', 'Rejected'].includes(response)) {
      return res.status(400).json({
        message: 'Invalid offer response',
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      applicant: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    if (!application.offer || application.offer.status === 'Not Created') {
      return res.status(400).json({
        message: 'Offer has not been issued for this application',
      });
    }

    application.offer.candidateResponse = response;
    application.offer.status =
      response === 'Accepted' ? 'Accepted' : 'Rejected';
    application.offer.respondedAt = new Date();

    application.status =
      response === 'Accepted'
        ? 'Offer Accepted'
        : 'Offer Rejected';

    await application.save();

    return res.status(200).json({
      message:
        response === 'Accepted'
          ? 'Offer accepted successfully'
          : 'Offer rejected successfully',

      application,
    });
  } catch (error) {
    console.error(
      'Offer response error:',
      error,
    );

    return res.status(500).json({
      message:
        'Failed to update offer response',
    });
  }
};

export { respondToInterview, respondToOffer };
