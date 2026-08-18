import mongoose from "mongoose";
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import getMatchingJob from "../services/job.service.js";

const getAllJobs = async (req, res) => {
    try {
        const { search, location, jobType, experience } = req.query;

        let matchStage = {};
        if (location && location !== 'all' && location.trim() !== '') {
            matchStage.location = { $regex: location.trim(), $options: 'i' };
        }
        if (jobType && jobType !== 'all' && jobType !== 'All Types' && jobType.trim() !== '') {
            matchStage.jobType = { $regex: jobType.trim(), $options: 'i' };
        }
        if (experience && experience !== 'all' && experience.trim() !== '') {
            matchStage.experience = { $regex: experience.trim(), $options: 'i' };
        }
        if (search && search.trim() !== '') {
            const s = search.trim();
            matchStage.$or = [
                { title: { $regex: s, $options: 'i' } },
                { description: { $regex: s, $options: 'i' } },
                { skills: { $in: [new RegExp(s, 'i')] } },
                { company: { $regex: s, $options: 'i' } },
                { location: { $regex: s, $options: 'i' } },
            ];
        }

        const pipeline = [];
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push(
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
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        );

        const jobs = await Job.aggregate(pipeline);
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
};

const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID format"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({
            message: "Job fetched successfully",
            job
        });
    } catch (error) {
        console.error("Get job by ID error:", error);
        return res.status(500).json({
            message: "Failed to fetch job",
            error: error.message
        });
    }
};

const matchJobs = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        const jobs = await getMatchingJob(resume.keywords);

        return res.json({
            message: "Matching Job found",
            resumeId: resume._id,
            keywords: resume.keywords,
            jobs
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to match jobs"
        });
    }
};

export { matchJobs, getAllJobs, getJobById };