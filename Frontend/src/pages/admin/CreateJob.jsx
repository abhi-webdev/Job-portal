import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createAdminJob } from '../../services/api';

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full Time',
    experience: '1-3 years',
    salary: '',
    skills: '',
    description: '',
    applyUrl: '',
    applicationStart: new Date().toISOString().split('T')[0],
    applicationDeadline: '',
    screeningDate: '',
    interviewStart: '',
    interviewEnd: '',
    resultDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

      const data = await createAdminJob(payload);
      setSuccess(data.message || 'Job opening created successfully');

      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1200);
    } catch (err) {
      console.error('Create job error:', err);
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/jobs')} className="gap-2 -ml-2 text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Button>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Phase 3B · Job Creation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Post a New Job Opening
          </h1>
          <p className="text-sm text-muted-foreground">
            Define requirements, skills match criteria, and the complete application deadline timeline.
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
          {/* General Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Role & Company Details
              </CardTitle>
              <CardDescription className="text-xs">
                Essential metadata to attract and filter qualified applicants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Job Title *</label>
                  <Input
                    name="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Company Name *</label>
                  <Input
                    name="company"
                    placeholder="e.g. Acme Innovations"
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
                    placeholder="e.g. Bangalore / Remote"
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
                  <label className="text-xs font-semibold text-foreground">Experience Required *</label>
                  <Input
                    name="experience"
                    placeholder="e.g. 2-5 years"
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
                    placeholder="e.g. ₹12 - ₹18 LPA"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Required Skills (Comma separated) *</label>
                  <Input
                    name="skills"
                    placeholder="React, Node.js, TypeScript, Tailwind, MongoDB"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Used by AI engine to match uploaded resumes
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Job Description *</label>
                <Textarea
                  name="description"
                  placeholder="Provide an overview of responsibilities, requirements, and perks..."
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Recruitment Timeline & Deadlines (Phase 3B)
              </CardTitle>
              <CardDescription className="text-xs">
                Set active application window and planned interview dates
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
                  <label className="text-xs font-semibold text-foreground">
                    Application Deadline *
                  </label>
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

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/jobs')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 min-w-32">
              {loading ? 'Creating Job...' : 'Publish Job'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateJob;
