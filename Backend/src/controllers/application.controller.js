import Application from '../models/application.model.js';
import Resume from '../models/resume.model.js';
import Job from '../models/job.model.js';

const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeId, fullName, email, phone, location, coverLetter } =
      req.body;

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

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    // Check resume

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }


    const existingApplication = await Application.findOne({
      job: jobId,
      resume: resumeId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: 'You have already applied for this job',
      });
    }

    const application = await Application.create({
      job: jobId,

      resume: resumeId,

      fullName,

      email,

      phone,

      location,

      coverLetter,
    });

    return res.status(201).json({
      message: 'Application submitted successfully',

      application,
    });
  } catch (error) {
    console.error('Apply job error:', error);

    return res.status(500).json({
      message: 'Failed to submit application',
    });
  }
};


const getApplicantsByJob = async (req, res) => {
    try {

        const { jobId } = req.params;

        const applications = await Application.find({
            job: jobId
        })
            .populate("job")
            .populate("resume")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            message: "Applicants fetched successfully",
            totalApplicants: applications.length,
            applications
        });

    } catch (error) {

        console.error(
            "Get applicants error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch applicants"
        });
    }
};


const getApplicationById = async (req, res) => {
    try {

        const application =
            await Application.findById(req.params.id)
                .populate("job")
                .populate("resume");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        return res.status(200).json({
            message: "Applicant details fetched successfully",
            application
        });

    } catch (error) {

        console.error(
            "Get application error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch applicant details"
        });
    }
};

export { applyForJob, getApplicantsByJob, getApplicationById };
