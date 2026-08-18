import bcrypt from 'bcryptjs';
import Application from '../models/application.model.js';
import Resume from '../models/resume.model.js';
import Job from '../models/job.model.js';
import User from '../models/user.model.js';
import { generateToken } from './auth.controller.js';
import { sendApplicationEmail } from '../services/email.service.js';

const generateRandomPassword = () => {
  const letters = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
  const numbers = '23456789';
  let pwd = 'Job@';
  for (let i = 0; i < 3; i++) {
    pwd += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return pwd;
};

const applyForJob = async (req, res) => {
  try {
    console.log('========== APPLY JOB ==========');
    console.log('USER:', req.user);
    console.log('BODY:', req.body);

    // ==============================
    // GET BODY
    // ==============================
    const { jobId, resumeId, fullName, email, phone, location, coverLetter } =
      req.body;

    // ==============================
    // VALIDATION
    // ==============================
    if (
      !jobId ||
      !resumeId ||
      !fullName ||
      !email ||
      !phone ||
      !location ||
      !coverLetter
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    // ==============================
    // FIND JOB
    // ==============================
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    // ==============================
    // FIND RESUME
    // ==============================
    let resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }

    // ==============================
    // USER RESOLUTION / AUTO-REGISTRATION
    // ==============================
    const normalizedEmail = email.toLowerCase().trim();
    let currentUser = req.user;
    let generatedPassword = null;
    let isNewUser = false;

    if (!currentUser) {
      let user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        generatedPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        user = await User.create({
          name: fullName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: 'user',
        });
        isNewUser = true;
      }

      currentUser = user;
    }

    // Link resume if unassigned
    if (!resume.user) {
      resume.user = currentUser._id;
      await resume.save();
    } else if (req.user && resume.user.toString() !== currentUser._id.toString()) {
      return res.status(403).json({
        message: 'Resume does not belong to you',
      });
    }

    // ==============================
    // CHECK DUPLICATE APPLICATION
    // ==============================
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: currentUser._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: 'You have already applied for this job',
      });
    }

    // ==============================
    // CREATE APPLICATION
    // ==============================
    const application = await Application.create({
      job: jobId,
      resume: resumeId,
      applicant: currentUser._id,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      location: location.trim(),
      coverLetter: coverLetter.trim(),
    });

    console.log('Application created:', application._id);

    // ==============================
    // SET AUTH COOKIE / LOG IN USER
    // ==============================
    const token = generateToken(currentUser);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ==============================
    // SEND EMAIL (WITH CREDENTIALS IF NEW USER)
    // ==============================
    try {
      await sendApplicationEmail({
        email: normalizedEmail,
        name: fullName.trim(),
        jobTitle: job.title,
        company: job.company,
        generatedPassword,
      });
      console.log('Application email sent successfully ✅', normalizedEmail);
    } catch (emailError) {
      console.error('Application created but email failed:', emailError);
    }

    return res.status(201).json({
      message: isNewUser
        ? 'Application submitted! Your login credentials have been sent to your email.'
        : 'Application submitted successfully',
      application,
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
      isNewUser,
    });
  } catch (error) {
    console.error('========== APPLY JOB ERROR ==========');
    console.error(error);

    return res.status(500).json({
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};
const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({
      job: jobId,
    })
      .populate('job')
      .populate('resume')
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: 'Applicants fetched successfully',
      totalApplicants: applications.length,
      applications,
    });
  } catch (error) {
    console.error('Get applicants error:', error);

    return res.status(500).json({
      message: 'Failed to fetch applicants',
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('resume');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    return res.status(200).json({
      message: 'Applicant details fetched successfully',
      application,
    });
  } catch (error) {
    console.error('Get application error:', error);

    return res.status(500).json({
      message: 'Failed to fetch applicant details',
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate('job', 'title company location jobType')
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: 'Applications fetched successfully',
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Failed to fetch applications',
    });
  }
};

const getMyApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      applicant: req.user._id,
    })
      .populate('job')
      .populate('resume');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    return res.status(200).json({
      application,
    });
  } catch (error) {
    console.error('Get application error:', error);

    return res.status(500).json({
      message: 'Failed to fetch application',
    });
  }
};

const respondToInterview = async (req, res) => {
  try {
    const { response } = req.body;

    if (!['Accepted', 'Rejected'].includes(response)) {
      return res.status(400).json({
        message: 'Invalid interview response',
      });
    }

    const application = await Application.findOne({
      _id: req.params.applicationId,
      applicant: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    if (!application.interview?.interviewDate) {
      return res.status(400).json({
        message: 'Interview has not been scheduled',
      });
    }

    application.interview.candidateResponse = response;
    application.interview.respondedAt = new Date();

    if (response === 'Accepted') {
      application.status = 'Interview Accepted';
    } else {
      application.status = 'Interview Rejected';
    }

    await application.save();

    return res.status(200).json({
      message: `Interview ${response.toLowerCase()} successfully`,
      application,
    });
  } catch (error) {
    console.error('Interview response error:', error);

    return res.status(500).json({
      message: 'Failed to submit interview response',
    });
  }
};

const respondToOffer = async (req, res) => {
  try {
    const { response } = req.body;

    if (!['Accepted', 'Rejected'].includes(response)) {
      return res.status(400).json({
        message: 'Invalid offer response',
      });
    }

    const application = await Application.findOne({
      _id: req.params.applicationId,
      applicant: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    if (!application.offer || application.offer.status === 'Not Created') {
      return res.status(400).json({
        message: 'Offer has not been created',
      });
    }

    application.offer.candidateResponse = response;
    application.offer.status = response === 'Accepted' ? 'Accepted' : 'Rejected';
    application.offer.respondedAt = new Date();

    if (response === 'Accepted') {
      application.status = 'Offer Accepted';
    } else {
      application.status = 'Offer Rejected';
    }

    await application.save();

    return res.status(200).json({
      message: `Offer ${response.toLowerCase()} successfully`,
      application,
    });
  } catch (error) {
    console.error('Offer response error:', error);

    return res.status(500).json({
      message: 'Failed to submit offer response',
    });
  }
};

export {
  applyForJob,
  getApplicantsByJob,
  getApplicationById,
  getMyApplications,
  getMyApplicationById,
  respondToInterview,
  respondToOffer,
};
