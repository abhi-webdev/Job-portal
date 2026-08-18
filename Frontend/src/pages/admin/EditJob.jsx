import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getJobById, updateAdminJob, deleteAdminJob } from '../../services/api';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [loadingJob, setLoadingJob] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full Time',
    experience: '',
    salary: '',
    skills: '',
    description: '',
    applyUrl: '',
    applicationStart: '',
    applicationDeadline: '',
    screeningDate: '',
    interviewStart: '',
    interviewEnd: '',
    resultDate: '',
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const fetchJob = async () => {
    try {
      setLoadingJob(true);
      setError('');
      const data = await getJobById(jobId);
      const job = data.job || data;

      if (!job) {
        setError('Job opening not found');
        return;
      }

      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        jobType: job.jobType || 'Full Time',
        experience: job.experience || '',
        salary: job.salary || '',
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
        description: job.description || '',
        applyUrl: job.applyUrl || '',
        applicationStart: formatDateForInput(job.timeline?.applicationStart),
        applicationDeadline: formatDateForInput(job.timeline?.applicationDeadline),
        screeningDate: formatDateForInput(job.timeline?.screeningDate),
        interviewStart: formatDateForInput(job.timeline?.interviewStart),
        interviewEnd: formatDateForInput(job.timeline?.interviewEnd),
        resultDate: formatDateForInput(job.timeline?.resultDate),
      });
    } catch (err) {
      console.error('Fetch job error:', err);
      setError(err.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setLoadingJob(false);
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
    setSuccess('');

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        experience: formData.experience,
        salary: formData.salary,
        applyUrl: formData.applyUrl,
        description: formData.description,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        timeline: {
          applicationStart: formData.applicationStart ? new Date(formData.applicationStart) : undefined,
          applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined,
          screeningDate: formData.screeningDate ? new Date(formData.screeningDate) : undefined,
          interviewStart: formData.interviewStart ? new Date(formData.interviewStart) : undefined,
          interviewEnd: formData.interviewEnd ? new Date(formData.interviewEnd) : undefined,
          resultDate: formData.resultDate ? new Date(formData.resultDate) : undefined,
        },
      };

      const data = await updateAdminJob(jobId, payload);
      setSuccess(data.message || 'Job updated successfully');

      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1200);
    } catch (err) {
      console.error('Update job error:', err);
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job opening and all associated applications?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteAdminJob(jobId);
      navigate('/admin/jobs');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  if (loadingJob) {
    return (
      <AdminLayout>
        <div className="py-24 flex justify-center">
          <Loading text="Loading job information..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin/jobs')} className="gap-2 -ml-2 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Button>

          <Button variant="outline" onClick={handleDelete} className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-1.5 text-xs">
            <Trash2 className="w-4 h-4" /> Delete Job
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Phase 3B · Job Editing
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Edit Job Opening
          </h1>
          <p className="text-sm text-muted-foreground">
            Modify role specifications, adjust application deadlines, or update required skills.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Role & Company Details
              </CardTitle>
              <CardDescription className="text-xs">
                Update job details and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Job Title *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Company Name *</label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Location *</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Job Type *</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Experience *</label>
                  <Input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Salary / CTC Range</label>
                  <Input
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Required Skills *</label>
                  <Input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Job Description *</label>
                <Textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Application Deadline & Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                Adjust key dates for the application lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Application Start Date</label>
                  <Input
                    type="date"
                    name="applicationStart"
                    value={formData.applicationStart}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Application Deadline *</label>
                  <Input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Screening Date</label>
                  <Input
                    type="date"
                    name="screeningDate"
                    value={formData.screeningDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Interview Start Date</label>
                  <Input
                    type="date"
                    name="interviewStart"
                    value={formData.interviewStart}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Final Result Date</label>
                  <Input
                    type="date"
                    name="resultDate"
                    value={formData.resultDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/jobs')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-32">
              {loading ? 'Saving Changes...' : 'Update Job'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditJob;
