import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// ========================================
// AUTH
// ========================================

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData);

  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');

  return response.data;
};

// ========================================
// RESUME
// ========================================

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

// ========================================
// JOBS
// ========================================

export const getAllJobs = async (params = {}) => {
  const response = await api.get('/jobs', { params });

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

// ========================================
// APPLICATIONS
// ========================================

export const applyForJob = async (applicationData) => {
  const response = await api.post('/applications', applicationData);

  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/applications/my');

  return response.data;
};

export const getApplicationById = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`);

  return response.data;
};

// ========================================
// ADMIN
// ========================================

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');

  return response.data;
};

export const getAdminJobs = async () => {
  const response = await api.get('/admin/jobs');

  return response.data;
};

export const createAdminJob = async (jobData) => {
  const response = await api.post('/admin/jobs', jobData);

  return response.data;
};

export const updateAdminJob = async (jobId, jobData) => {
  const response = await api.put(`/admin/jobs/${jobId}`, jobData);

  return response.data;
};

export const deleteAdminJob = async (jobId) => {
  const response = await api.delete(`/admin/jobs/${jobId}`);

  return response.data;
};

export const getAllApplicants = async (params = {}) => {
  const response = await api.get('/admin/applicants', { params });

  return response.data;
};

export const getApplicantsByJob = async (jobId) => {
  const response = await api.get(`/admin/jobs/${jobId}/applicants`);

  return response.data;
};

export const getAdminApplicationById = async (applicationId) => {
  const response = await api.get(`/admin/applications/${applicationId}`);

  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(
    `/admin/applications/${applicationId}/status`,
    {
      status,
    },
  );

  return response.data;
};

export const scheduleInterview = async (applicationId, data) => {
  const response = await api.post(
    `/admin/applications/${applicationId}/interview`,
    data,
  );

  return response.data;
};

export const updateInterviewResult = async (applicationId, data) => {
  const response = await api.patch(
    `/admin/applications/${applicationId}/interview-result`,
    data,
  );

  return response.data;
};

export const createOffer = async (applicationId, data) => {
  const response = await api.post(
    `/admin/applications/${applicationId}/offer`,
    data,
  );

  return response.data;
};

export const getAdminInterviews = async (params = {}) => {
  const response = await api.get('/admin/interviews', { params });

  return response.data;
};

export const getAdminOffers = async (params = {}) => {
  const response = await api.get('/admin/offers', { params });

  return response.data;
};

export const getRecruitmentAnalytics = async () => {
  const response = await api.get('/admin/analytics');

  return response.data;
};

// ========================================
// CANDIDATE INTERVIEW / OFFER
// ========================================

export const respondToInterview = async (applicationId, response) => {
  const result = await api.patch(
    `/candidate/applications/${applicationId}/interview`,
    {
      response,
    },
  );

  return result.data;
};

export const respondToOffer = async (applicationId, response) => {
  const result = await api.patch(
    `/candidate/applications/${applicationId}/offer`,
    {
      response,
    },
  );

  return result.data;
};

export default api;
