import Resume from '../models/resume.model.js';
import extractTextFromPdf from '../services/pdf.service.js';
import extrectKerwords from '../services/keyword.services.js';
import fs from 'fs';
import path from 'path';

const uploadResume = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: 'Resume PDF is required',
      });
    }

    console.log('USER:', req.user);
    console.log('FILE:', req.file);

    // 1. Extract text from PDF
    const extractedText = await extractTextFromPdf(
      req.file.path
    );


    // 2. Extract keywords from resume text
    const keywords = await extrectKerwords(
      extractedText
    );

    // 3. Save resume
    const resume = await Resume.create({
      user: req.user ? req.user._id : undefined,
      fileName: req.file.originalname,
      filePath: req.file.path,
      extractedText,
      keywords,
    });


    return res.status(201).json({

      message: 'Resume uploaded successfully',

      resume,

    });

  } catch (error) {

    console.error('Upload resume error:', error);

    return res.status(500).json({

      message: 'Failed to upload resume',

      error: error.message,

    });
  }
};


const getMyResumes = async (req, res) => {
  try {

    const resumes = await Resume.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({

      message: 'Resumes found successfully',

      resumes,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      message: 'Failed to fetch resumes',

    });
  }
};


const getResumeById = async (req, res) => {
  try {

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {

      return res.status(404).json({
        message: 'Resume not found or does not belong to you',
      });

    }

    return res.status(200).json({

      message: 'Resume found successfully',

      resume,

    });

  } catch (error) {

    console.error('Get resume error:', error);

    return res.status(500).json({

      message: 'Failed to fetch resume',

      error: error.message,

    });
  }
};


const deleteResume = async (req, res) => {
  try {

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {

      return res.status(404).json({
        message: 'Resume not found or does not belong to you',
      });

    }

    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Resume.findByIdAndDelete(resume._id);

    return res.status(200).json({
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    return res.status(500).json({
      message: 'Failed to delete resume',
      error: error.message,
    });
  }
};

const streamResumePdf = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }

    let filePath = resume.filePath;
    if (!fs.existsSync(filePath)) {
      // Try resolving relative to workspace
      const resolved = path.resolve(filePath);
      if (fs.existsSync(resolved)) {
        filePath = resolved;
      } else {
        return res.status(404).json({
          message: 'Resume file not found on server disk',
        });
      }
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${resume.fileName || 'resume.pdf'}"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Stream resume error:', error);
    return res.status(500).json({
      message: 'Failed to stream resume file',
      error: error.message,
    });
  }
};

export {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  streamResumePdf,
};