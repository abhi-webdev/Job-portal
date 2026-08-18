import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UploadResume from './pages/UploadResume';
import MyApplications from './pages/MyApplications';
import ApplicationDetails from './pages/ApplicantDetails';
import OfferResponse from './pages/OfferResponse';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import CreateJob from './pages/admin/CreateJob';
import EditJob from './pages/admin/EditJob';
import AdminApplicants from './pages/admin/AdminApplicants';
import AdminApplicantDetails from './pages/admin/AdminApplicantDetails';
import InterviewManagement from './pages/admin/InterviewManagement';
import OfferManagement from './pages/admin/OfferManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/apply/:jobId" element={<ApplyJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= USER PROTECTED ROUTES ================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload-resume" element={<UploadResume />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/my-applications/:applicationId" element={<ApplicationDetails />} />
            <Route path="/applications/:applicationId" element={<ApplicationDetails />} />
            <Route path="/offer/:applicationId" element={<ApplicationDetails />} />
            <Route path="/offer-response/:applicationId/:response" element={<OfferResponse />} />
          </Route>

          {/* ================= ADMIN PROTECTED ROUTES (Phases 3A - 3G) ================= */}
          <Route element={<AdminRoute />}>
            {/* Phase 3A: Dashboard + Recharts Overview */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Phase 3B: Job CRUD + Application Deadlines */}
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/jobs/create" element={<CreateJob />} />
            <Route path="/admin/jobs/:jobId/edit" element={<EditJob />} />
            <Route path="/admin/jobs/:jobId/applicants" element={<AdminApplicants />} />

            {/* Phase 3C: Applicant Management & Status Timeline */}
            <Route path="/admin/applicants" element={<AdminApplicants />} />
            <Route path="/admin/applications/:applicationId" element={<AdminApplicantDetails />} />

            {/* Phase 3D & 3E: Interview Scheduling & Results */}
            <Route path="/admin/interviews" element={<InterviewManagement />} />

            {/* Phase 3F: Job Offers & CTC Management */}
            <Route path="/admin/offers" element={<OfferManagement />} />

            {/* Phase 3G: Recruitment Funnel & Conversion Analytics */}
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
