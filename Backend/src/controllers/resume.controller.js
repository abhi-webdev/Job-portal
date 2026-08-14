
import Resume from "../models/resume.model.js"
import extractTextFromPdf from "../services/pdf.service.js"
import extrectKerwords from "../services/keyword.services.js"
import fs from "fs"

const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required"
            });
        }

        const extractedText =
            await extractTextFromPdf(req.file.path);

        const keywords =
            await extrectKerwords(extractedText);

        const resume = await Resume.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            extractedText: extractedText,
            keywords: keywords
        });

        return res.status(201).json({
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to upload resume",
            error: error.message
        });
    }
};

const getMyResumes = async(req, res) => {
    try {
        const resumes = await Resume.find()
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            message: "Resumes found successfully",
            resumes
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch resumes"
        });
    }
}

const getResumeById = async (req, res) => {
    try {

        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            message: "Resume found successfully",
            resume
        });

    } catch (error) {

        console.error("Get resume error:", error);

        return res.status(500).json({
            message: "Failed to fetch resume",
            error: error.message
        });
    }
};

const deleteResume = async (req, res) => {
    try {

        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        if (fs.existsSync(resume.filePath)) {
            fs.unlinkSync(resume.filePath);
        }

        await Resume.findByIdAndDelete(resume._id);

        return res.status(200).json({
            message: "Resume deleted successfully"
        });

    } catch (error) {

        console.error("Delete resume error:", error);

        return res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
};

export {uploadResume, getMyResumes, getResumeById, deleteResume}