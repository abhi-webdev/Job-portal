
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import getMatchingJob from "../services/job.service.js";


const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "job",
                    as: "applications"
                }
            },

            {
                $addFields: {
                    applicationCount: {
                        $size: "$applications"
                    }
                }
            },

            {
                $project: {
                    applications: 0
                }
            }
        ]);
        return res.status(200).json({
            message: "Jobs fetched successfully",
            totalJobs: jobs.length,
            jobs
        });
    } catch (error) {
         console.error("Get all jobs error:", error);

        return res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
}

const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch job"
        });
    }
}

const matchJobs = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

         const jobs = await getMatchingJob(
            resume.keywords
        );

        res.json({
            message : "Matching Job found",
            resumeId: resume._id,
            keywords: resume.keywords,
            jobs
        });
    } catch (error) {
         console.error(error);

        res.status(500).json({
            message: "Failed to match jobs"
        });
    }
}

export  {matchJobs, getAllJobs, getJobById}