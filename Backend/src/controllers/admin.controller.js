import mongoose from 'mongoose';
import Job from '../models/job.model.js';
import Application from '../models/application.model.js';
import User from '../models/user.model.js';
import Resume from '../models/resume.model.js';
import {
  sendInterviewEmail,
  sendInterviewResultEmail,
  sendOfferEmail,
} from '../services/email.service.js';

const getAdminDashboard = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();

    const totalApplications = await Application.countDocuments();

    const totalApplicants = await Application.distinct('applicant');

    // =====================================
    // APPLICATION STATUS COUNTS
    // =====================================

    const statusStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // =====================================
    // APPLICATIONS BY JOB
    // =====================================

    const applicationsByJob = await Application.aggregate([
      {
        $group: {
          _id: '$job',
          count: {
            $sum: 1,
          },
        },
      },

      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'job',
        },
      },

      {
        $unwind: {
          path: '$job',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          jobId: '$_id',

          title: '$job.title',

          company: '$job.company',

          count: 1,
        },
      },

      {
        $sort: {
          count: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    // =====================================
    // RECENT APPLICATIONS
    // =====================================

    const recentApplications = await Application.find()

      .populate('job', 'title company')

      .populate('applicant', 'name email')

      .sort({
        createdAt: -1,
      })

      .limit(8)

      .lean();

    // =====================================
    // ACTIVE JOBS
    // =====================================

    const activeJobs = await Job.countDocuments({
      $or: [
        {
          status: 'Active',
        },
        {
          status: {
            $exists: false,
          },
        },
      ],
    });

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(200).json({
      message: 'Admin dashboard data fetched successfully',

      stats: {
        totalJobs,

        totalApplications,

        totalApplicants: totalApplicants.length,

        activeJobs,
      },

      statusStats,

      applicationsByJob,

      recentApplications,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);

    return res.status(500).json({
      message: 'Failed to fetch admin dashboard',
    });
  }
};

const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'applications',
        },
      },

      {
        $addFields: {
          applicationCount: {
            $size: '$applications',
          },
        },
      },

      {
        $project: {
          applications: 0,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res.status(200).json({
      message: 'Jobs fetched successfully',
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('Admin jobs error:', error);

    return res.status(500).json({
      message: 'Failed to fetch jobs',
    });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      skills,
      location,
      jobType,
      experience,
      applyUrl,
      timeline,
    } = req.body;

    console.log('TITLE:', title);
    console.log('COMPANY:', company);
    console.log('DESCRIPTION:', description);
    console.log('LOCATION:', location);
    console.log('JOB TYPE:', jobType);
    console.log('EXPERIENCE:', experience);
    console.log('SKILLS:', skills);
    console.log('APPLY URL:', applyUrl);
    console.log('TIMELINE:', timeline);
    if (
      !title ||
      !company ||
      !description ||
      !location ||
      !jobType ||
      !experience
    ) {
      return res.status(400).json({
        message: 'Required job fields are missing',
      });
    }

    const job = await Job.create({
      title,

      company,

      description,

      skills: skills || [],

      location,

      jobType,

      experience,

      applyUrl,

      timeline: timeline || {},
    });

    return res.status(201).json({
      message: 'Job created successfully',

      job,
    });
  } catch (error) {
    console.error('Create job error:', error);

    return res.status(500).json({
      message: 'Failed to create job',
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      company,
      description,
      skills,
      location,
      jobType,
      experience,
      applyUrl,
      timeline,
    } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    if (title !== undefined) job.title = title;

    if (company !== undefined) job.company = company;

    if (description !== undefined) job.description = description;

    if (skills !== undefined) job.skills = skills;

    if (location !== undefined) job.location = location;

    if (jobType !== undefined) job.jobType = jobType;

    if (experience !== undefined) job.experience = experience;

    if (applyUrl !== undefined) job.applyUrl = applyUrl;

    if (timeline !== undefined) job.timeline = timeline;

    await job.save();

    return res.status(200).json({
      message: 'Job updated successfully',

      job,
    });
  } catch (error) {
    console.error('Update job error:', error);

    return res.status(500).json({
      message: 'Failed to update job',
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    await Application.deleteMany({
      job: id,
    });

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Job and related applications deleted successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);

    return res.status(500).json({
      message: 'Failed to delete job',
    });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: 'Invalid Job ID format',
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate('job', 'title company location jobType timeline')
      .populate('applicant', 'name email')
      .populate('resume', 'fileName filePath keywords')
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      message: 'Applicants fetched successfully',
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
      },
      totalApplicants: applications.length,
      applications,
    });
  } catch (error) {
    console.error('Get applicants error:', error);

    return res.status(500).json({
      message: 'Failed to fetch applicants',
      error: error.message,
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: 'Invalid application ID format',
      });
    }

    const application = await Application.findById(applicationId)
      .populate('applicant', 'name email')
      .populate('job')
      .populate('resume');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    return res.status(200).json({
      message: 'Application details fetched successfully',
      application,
    });
  } catch (error) {
    console.error('Get application error:', error);

    return res.status(500).json({
      message: 'Failed to fetch application',
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { status } = req.body;

    const allowedStatuses = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Interview Completed',
      'Selected',
      'Rejected',
      'Offer Sent',
      'Offer Accepted',
      'Offer Rejected',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid application status',
      });
    }

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    application.status = status;

    await application.save();

    return res.status(200).json({
      message: 'Application status updated successfully',

      application,
    });
  } catch (error) {
    console.error('Update application status error:', error);

    return res.status(500).json({
      message: 'Failed to update application status',
    });
  }
};

const scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { interviewDate, interviewTime, meetingLink, message } = req.body;

    if (!interviewDate || !interviewTime || !meetingLink) {
      return res.status(400).json({
        message: 'Interview date, time and meeting link are required',
      });
    }

    const application =
      await Application.findById(applicationId).populate('job');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    application.interview = {
      interviewDate,
      interviewTime,
      meetingLink,
      message: message || '',
      candidateResponse: 'Pending',
      result: 'Pending',
    };

    // Automatically update status
    application.status = 'Interview Scheduled';

    await application.save();

    // Send email here
    // await sendInterviewEmail(...)
    try {
      await sendInterviewEmail({
        email: application.email,
        name: application.fullName,
        jobTitle: application.job.title,
        company: application.job.company,
        interviewDate,
        interviewTime,
        meetingLink,
        message,
      });

      console.log('Interview email sent successfully ✅');
    } catch (emailError) {
      console.error('Interview email failed:', emailError);
    }

    return res.status(200).json({
      message: 'Interview scheduled successfully',
      application,
    });
  } catch (error) {
    console.error('Schedule interview error:', error);

    return res.status(500).json({
      message: 'Failed to schedule interview',
      error: error.message,
    });
  }
};
const createOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { position, salary, joiningDate, expiryDate, message } = req.body;

    console.log('========== CREATE OFFER ==========');
    console.log('Application ID:', applicationId);
    console.log('Position:', position);
    console.log('Salary:', salary);
    console.log('Joining Date:', joiningDate);
    console.log('Expiry Date:', expiryDate);
    console.log('Message:', message);

    // =========================
    // VALIDATION
    // =========================

    if (!position || !salary || !joiningDate || !expiryDate) {
      return res.status(400).json({
        message: 'Position, salary, joining date and expiry date are required',
      });
    }

    // =========================
    // FIND APPLICATION
    // =========================

    const application =
      await Application.findById(applicationId).populate('job');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    // =========================
    // CHECK INTERVIEW RESULT
    // =========================

    if (application.interview?.result !== 'Selected') {
      return res.status(400).json({
        message: 'Offer can only be created for selected candidates',
      });
    }

    // =========================
    // PREVENT DUPLICATE OFFER
    // =========================

    if (application.offer && application.offer.status === 'Sent') {
      return res.status(409).json({
        message: 'Offer has already been sent to this candidate',
      });
    }

    // =========================
    // SAVE OFFER
    // =========================

    application.offer = {
      status: 'Sent',

      position,

      salary: Number(salary),

      joiningDate,

      expiryDate,

      message: message || '',

      candidateResponse: 'Pending',

      respondedAt: null,

      createdAt: new Date(),
    };

    application.status = 'Offer Sent';

    await application.save();

    console.log('========== OFFER SAVED ==========');
    console.log(application.offer);

    // =========================
    // SEND OFFER EMAIL
    // =========================

    await sendOfferEmail({
      email: application.email,

      name: application.fullName,

      jobTitle: application.job.title,

      company: application.job.company,

      position,

      salary,

      joiningDate,

      expiryDate,

      message,

      applicationId,
    });

    console.log('Offer email sent successfully ✅');

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      message: 'Offer letter created and email sent successfully',

      application,
    });
  } catch (error) {
    console.error('Create offer error:', error);

    return res.status(500).json({
      message: 'Failed to create offer',

      error: error.message,
    });
  }
};

const updateInterviewResult = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { result, message } = req.body;

    console.log('===== INTERVIEW RESULT =====');

    console.log('Application:', applicationId);
    console.log('Result:', result);

    if (!['Selected', 'Rejected'].includes(result)) {
      return res.status(400).json({
        message: 'Invalid interview result',
      });
    }

    const application =
      await Application.findById(applicationId).populate('job');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    // Save interview result

    application.interview.result = result;

    application.interview.resultMessage = message || '';

    // =====================================
    // REJECTED
    // =====================================

    if (result === 'Rejected') {
      application.status = 'Rejected';

      await application.save();

      await sendInterviewResultEmail({
        email: application.email,
        name: application.fullName,
        jobTitle: application.job.title,
        company: application.job.company,
        result: 'Rejected',
        resultMessage:
          message ||
          'Thank you for taking the time to interview with us. Unfortunately, we have decided to move forward with another candidate. We sincerely appreciate your effort and wish you success in your future career.',
      });

      return res.status(200).json({
        message: 'Interview rejection sent successfully',
        application,
      });
    }

    // =====================================
    // SELECTED
    // =====================================

    application.status = 'Selected';

    application.offer = {
      status: 'Not Created',
      candidateResponse: 'Pending',
    };

    await application.save();

    await sendInterviewResultEmail({
      email: application.email,
      name: application.fullName,
      jobTitle: application.job.title,
      company: application.job.company,
      result: 'Selected',
      resultMessage:
        message ||
        'Congratulations! We are pleased to inform you that you have successfully cleared the interview round. Our team will shortly share your offer details with you.',
    });

    return res.status(200).json({
      message: 'Candidate selected successfully',
      application,
    });
  } catch (error) {
    console.error('Interview result error:', error);

    return res.status(500).json({
      message: 'Failed to update interview result',
      error: error.message,
    });
  }
};

const respondToOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { response } = req.body;

    console.log('========== OFFER RESPONSE ==========');
    console.log('Application:', applicationId);
    console.log('Response:', response);
    console.log('User:', req.user._id);

    if (!['Accepted', 'Rejected'].includes(response)) {
      return res.status(400).json({
        message: 'Invalid offer response',
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    // IMPORTANT
    // Check candidate ownership

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not allowed to respond to this offer',
      });
    }

    // Check offer exists

    if (!application.offer || application.offer.status === 'Not Created') {
      return res.status(400).json({
        message: 'Offer has not been created',
      });
    }

    // Check already responded

    if (application.offer.candidateResponse !== 'Pending') {
      return res.status(400).json({
        message: 'You have already responded to this offer',
      });
    }

    // Update candidate response

    application.offer.candidateResponse = response;

    application.offer.status =
      response === 'Accepted' ? 'Accepted' : 'Rejected';

    application.offer.respondedAt = new Date();

    // Update application status

    application.status =
      response === 'Accepted' ? 'Offer Accepted' : 'Offer Rejected';

    await application.save();

    console.log('Offer response updated successfully ✅');

    return res.status(200).json({
      message:
        response === 'Accepted'
          ? 'Offer accepted successfully'
          : 'Offer rejected successfully',

      application,
    });
  } catch (error) {
    console.error('Respond offer error:', error);

    return res.status(500).json({
      message: 'Failed to respond to offer',
      error: error.message,
    });
  }
};

const getAllApplicants = async (req, res) => {
  try {
    const { jobId, status, search, sortBy = 'newest' } = req.query;

    let query = {};
    if (
      jobId &&
      jobId !== 'all' &&
      jobId !== 'undefined' &&
      mongoose.Types.ObjectId.isValid(jobId)
    ) {
      query.job = jobId;
    }
    if (status && status !== 'all' && status !== 'All') {
      query.status = status;
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { fullName: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { location: { $regex: s, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'name') sortOptions = { fullName: 1 };

    const applications = await Application.find(query)
      .populate('job', 'title company location jobType timeline')
      .populate('applicant', 'name email')
      .populate('resume', 'fileName filePath keywords')
      .sort(sortOptions)
      .lean();

    return res.status(200).json({
      message: 'Applicants fetched successfully',
      total: applications ? applications.length : 0,
      applications: applications || [],
    });
  } catch (error) {
    console.error('Get all applicants error:', error);
    return res.status(500).json({ message: 'Failed to fetch applicants', error: error.message });
  }
};

const getAdminInterviews = async (req, res) => {
  try {
    const { status, result, candidateResponse, search } = req.query;

    let query = {
      $or: [
        { 'interview.interviewDate': { $exists: true, $ne: null } },
        { status: { $in: ['Interview Scheduled', 'Interview Accepted', 'Interview Rejected', 'Interview Completed', 'Selected', 'Offer Sent', 'Offer Accepted', 'Offer Rejected'] } },
      ],
    };

    if (result && result !== 'all') {
      query['interview.result'] = result;
    }
    if (candidateResponse && candidateResponse !== 'all') {
      query['interview.candidateResponse'] = candidateResponse;
    }

    let applications = await Application.find(query)
      .populate('job', 'title company location')
      .populate('applicant', 'name email')
      .populate('resume', 'fileName filePath keywords')
      .sort({ 'interview.interviewDate': -1, createdAt: -1 })
      .lean();

    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter((app) =>
        app.fullName?.toLowerCase().includes(s) ||
        app.email?.toLowerCase().includes(s) ||
        app.job?.title?.toLowerCase().includes(s) ||
        app.job?.company?.toLowerCase().includes(s)
      );
    }

    const stats = {
      total: applications.length,
      scheduled: applications.filter((a) => a.interview?.candidateResponse === 'Pending').length,
      accepted: applications.filter((a) => a.interview?.candidateResponse === 'Accepted').length,
      rejected: applications.filter((a) => a.interview?.candidateResponse === 'Rejected').length,
      selected: applications.filter((a) => a.interview?.result === 'Selected').length,
      rejectedResult: applications.filter((a) => a.interview?.result === 'Rejected').length,
    };

    return res.status(200).json({
      message: 'Interviews fetched successfully',
      stats,
      interviews: applications,
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    return res.status(500).json({ message: 'Failed to fetch interviews', error: error.message });
  }
};

const getAdminOffers = async (req, res) => {
  try {
    const { status, candidateResponse, search } = req.query;

    let query = {
      $or: [
        { 'offer.status': { $in: ['Sent', 'Accepted', 'Rejected'] } },
        { status: { $in: ['Offer Sent', 'Offer Accepted', 'Offer Rejected'] } },
      ],
    };

    if (status && status !== 'all') {
      query['offer.status'] = status;
    }
    if (candidateResponse && candidateResponse !== 'all') {
      query['offer.candidateResponse'] = candidateResponse;
    }

    let applications = await Application.find(query)
      .populate('job', 'title company location')
      .populate('applicant', 'name email')
      .populate('resume', 'fileName filePath')
      .sort({ 'offer.createdAt': -1, createdAt: -1 })
      .lean();

    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter((app) =>
        app.fullName?.toLowerCase().includes(s) ||
        app.email?.toLowerCase().includes(s) ||
        app.offer?.position?.toLowerCase().includes(s) ||
        app.job?.company?.toLowerCase().includes(s)
      );
    }

    const stats = {
      total: applications.length,
      sent: applications.filter((a) => a.offer?.status === 'Sent' && a.offer?.candidateResponse === 'Pending').length,
      accepted: applications.filter((a) => a.offer?.status === 'Accepted' || a.offer?.candidateResponse === 'Accepted' || a.status === 'Offer Accepted').length,
      rejected: applications.filter((a) => a.offer?.status === 'Rejected' || a.offer?.candidateResponse === 'Rejected' || a.status === 'Offer Rejected').length,
      totalOfferedSalary: applications.reduce((sum, a) => sum + (Number(a.offer?.salary) || 0), 0),
    };

    return res.status(200).json({
      message: 'Offers fetched successfully',
      stats,
      offers: applications,
    });
  } catch (error) {
    console.error('Get offers error:', error);
    return res.status(500).json({ message: 'Failed to fetch offers', error: error.message });
  }
};

const getRecruitmentAnalytics = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalApplicants = (await Application.distinct('applicant')).length;

    // Funnel Counts
    const appliedCount = await Application.countDocuments();
    const reviewedCount = await Application.countDocuments({ status: { $nin: ['Applied'] } });
    const shortlistedCount = await Application.countDocuments({
      status: { $in: ['Shortlisted', 'Interview Scheduled', 'Interview Accepted', 'Interview Rejected', 'Interview Completed', 'Selected', 'Offer Sent', 'Offer Accepted', 'Offer Rejected'] },
    });
    const interviewedCount = await Application.countDocuments({
      $or: [
        { 'interview.interviewDate': { $exists: true, $ne: null } },
        { status: { $in: ['Interview Scheduled', 'Interview Accepted', 'Interview Rejected', 'Interview Completed', 'Selected', 'Offer Sent', 'Offer Accepted', 'Offer Rejected'] } },
      ],
    });
    const selectedCount = await Application.countDocuments({
      $or: [
        { 'interview.result': 'Selected' },
        { status: { $in: ['Selected', 'Offer Sent', 'Offer Accepted', 'Offer Rejected'] } },
      ],
    });
    const offerSentCount = await Application.countDocuments({
      $or: [
        { 'offer.status': { $in: ['Sent', 'Accepted', 'Rejected'] } },
        { status: { $in: ['Offer Sent', 'Offer Accepted', 'Offer Rejected'] } },
      ],
    });
    const hiredCount = await Application.countDocuments({
      $or: [
        { 'offer.status': 'Accepted' },
        { 'offer.candidateResponse': 'Accepted' },
        { status: 'Offer Accepted' },
      ],
    });

    const funnel = [
      { stage: 'Applications', count: appliedCount, color: '#3b82f6', dropRate: 0 },
      { stage: 'Under Review', count: reviewedCount, color: '#6366f1', dropRate: appliedCount ? Math.round(((appliedCount - reviewedCount) / appliedCount) * 100) : 0 },
      { stage: 'Shortlisted', count: shortlistedCount, color: '#8b5cf6', dropRate: reviewedCount ? Math.round(((reviewedCount - shortlistedCount) / reviewedCount) * 100) : 0 },
      { stage: 'Interviewed', count: interviewedCount, color: '#ec4899', dropRate: shortlistedCount ? Math.round(((shortlistedCount - interviewedCount) / shortlistedCount) * 100) : 0 },
      { stage: 'Selected', count: selectedCount, color: '#f59e0b', dropRate: interviewedCount ? Math.round(((interviewedCount - selectedCount) / interviewedCount) * 100) : 0 },
      { stage: 'Offers Sent', count: offerSentCount, color: '#10b981', dropRate: selectedCount ? Math.round(((selectedCount - offerSentCount) / selectedCount) * 100) : 0 },
      { stage: 'Hired 🎉', count: hiredCount, color: '#22c55e', dropRate: offerSentCount ? Math.round(((offerSentCount - hiredCount) / offerSentCount) * 100) : 0 },
    ];

    // Conversion Rates
    const conversionRates = {
      appToShortlist: appliedCount ? Math.round((shortlistedCount / appliedCount) * 100) : 0,
      appToInterview: appliedCount ? Math.round((interviewedCount / appliedCount) * 100) : 0,
      interviewToSelect: interviewedCount ? Math.round((selectedCount / interviewedCount) * 100) : 0,
      selectToOffer: selectedCount ? Math.round((offerSentCount / selectedCount) * 100) : 0,
      offerAcceptanceRate: offerSentCount ? Math.round((hiredCount / offerSentCount) * 100) : 0,
      overallConversionRate: appliedCount ? Math.round((hiredCount / appliedCount) * 100) : 0,
    };

    // Status Distribution
    const statusDistribution = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top Jobs Analytics
    const jobsAnalytics = await Job.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'apps',
        },
      },
      {
        $project: {
          title: 1,
          company: 1,
          location: 1,
          applicationsCount: { $size: '$apps' },
          hiredCount: {
            $size: {
              $filter: {
                input: '$apps',
                as: 'a',
                cond: { $in: ['$$a.status', ['Offer Accepted', 'Hired']] },
              },
            },
          },
        },
      },
      { $sort: { applicationsCount: -1 } },
      { $limit: 8 },
    ]);

    return res.status(200).json({
      message: 'Recruitment analytics fetched successfully',
      stats: {
        totalJobs,
        totalApplications,
        totalApplicants,
        hiredCount,
      },
      funnel,
      conversionRates,
      statusDistribution,
      jobsAnalytics,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

export {
  getAdminDashboard,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  getAllApplicants,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  createOffer,
  updateInterviewResult,
  respondToOffer,
  getAdminInterviews,
  getAdminOffers,
  getRecruitmentAnalytics,
};
