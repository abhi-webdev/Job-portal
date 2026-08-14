import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append('resume', file);

  const response = await api.post('/resumes/upload', formData);

  return response.data;
};

export const getAllResumes = async () => {
  const response = await api.get('/resumes');

  return response.data;
};

export const getResumeById = async (resumeId) => {
  const response = await api.get(`/resumes/${resumeId}`);

  return response.data;
};

export const deleteResume = async (resumeId) => {
  const response = await api.delete(`/resumes/${resumeId}`);

  return response.data;
};

export const getAllJobs = async () => {
  const response = await api.get('/jobs');

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);

  return response.data;
};

export const getMatchingJobs = async (resumeId) => {
  const response = await api.get(`/jobs/match/${resumeId}`);

  return response.data;
};

export const applyForJob = async (applicationData) => {
  const response = await api.post('/applications', applicationData);

  return response.data;
};

export const getApplicantsByJob = async (jobId) => {

    const response = await api.get(
        `/applications/job/${jobId}`
    );

    return response.data;
};


export const getApplicationById = async (applicationId) => {

    const response = await api.get(
        `/applications/${applicationId}`
    );

    return response.data;
};

export default api;
