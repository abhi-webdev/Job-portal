import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  Building2,
  MapPin,
  CheckCircle2,
  Upload,
  ArrowLeft,
  Mail,
} from 'lucide-react';

import { applyForJob, getJobById, getAllResumes, uploadResume } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Loading from '../components/Loading';

const ApplyJob = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setAuthUser } = useAuth();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.resumeId || '');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    coverLetter: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingInitial(true);
        const [jobRes, resumeRes] = await Promise.all([
          getJobById(jobId),
          getAllResumes().catch(() => ({ resumes: [] })),
        ]);

        setJob(jobRes.job || jobRes);
        const userResumes = resumeRes.resumes || resumeRes.resume || [];
        setResumes(userResumes);

        if (!selectedResumeId && userResumes.length > 0) {
          setSelectedResumeId(userResumes[0]._id);
        }
      } catch (err) {
        console.error('Init error:', err);
        setError('Failed to load job details');
      } finally {
        setLoadingInitial(false);
      }
    };

    init();
  }, [jobId]);

  const handleInlineResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      setError('');
      const data = await uploadResume(file);
      const newResume = data.resume;
      setResumes((prev) => [newResume, ...prev]);
      setSelectedResumeId(newResume._id);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedResumeId) {
      setError('Please select or upload your resume before submitting.');
      return;
    }

    try {
      setLoading(true);
      const data = await applyForJob({
        jobId,
        resumeId: selectedResumeId,
        ...formData,
      });

      if (data.user && setAuthUser) {
        setAuthUser(data.user);
      }
      setIsNewUser(!!data.isNewUser);
      setSuccessMessage(data.message || 'Application submitted successfully');
      setSuccess(true);
    } catch (err) {
      console.error('Apply job error:', err);
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="container mx-auto px-6 py-24 flex justify-center">
        <Loading text="Loading job application..." />
      </div>
    );
  }

  if (success) {
    return (
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-xl mx-auto">
          <Card className="shadow-lg border-emerald-200 dark:border-emerald-900">
            <CardContent className="p-8 sm:p-10 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-3xl font-bold">
                ✓
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Application Submitted 🎉</h1>
              <p className="text-sm text-muted-foreground">{successMessage}</p>

              {isNewUser && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-left space-y-1.5 mt-4">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                    🔑 Account Created Automatically
                  </p>
                  <p className="text-muted-foreground">
                    An account has been created for <span className="font-semibold text-foreground">{formData.email}</span>. A generated login password has been sent to your email so you can sign in anytime in the future.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-muted/50 border border-border text-xs text-left space-y-1.5 mt-4">
                <p className="text-muted-foreground">
                  A confirmation receipt and status tracker have been emailed to{' '}
                  <span className="font-semibold text-foreground">{formData.email}</span>.
                </p>
                <p className="text-muted-foreground">
                  Position: <strong className="text-foreground">{job?.title}</strong> at {job?.company}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button className="flex-1" onClick={() => navigate('/my-applications')}>
                  View My Applications
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate('/jobs')}>
                  Browse More Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 text-xs">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* Job Banner */}
        {job && (
          <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                Applying For
              </span>
              <h2 className="text-xl font-bold text-foreground mt-0.5">{job.title}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Building2 className="w-3.5 h-3.5" /> {job.company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </span>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground self-start sm:self-auto">
              {job.jobType || 'Full Time'}
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Selection Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Select or Upload Resume *
              </CardTitle>
              <CardDescription className="text-xs">
                Your resume will be reviewed by the hiring team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resumes.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Choose Uploaded Resume:</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs"
                    required
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.fileName} (Uploaded: {new Date(r.createdAt || Date.now()).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="pt-2">
                <label className="text-xs font-semibold text-foreground block mb-1">
                  {resumes.length > 0 ? 'Or upload a different resume (PDF):' : 'Upload Resume PDF:'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleInlineResumeUpload}
                    disabled={uploadingResume}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  {uploadingResume && <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name *</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Address *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone Number *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Current City / Location *</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore, India"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Cover Letter / Note to Recruiter *</label>
                <Textarea
                  name="coverLetter"
                  rows={5}
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Highlight your relevant experience, technical skills, and why you are a great fit for this position..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedResumeId} className="min-w-40">
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ApplyJob;
