import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  Briefcase,
  Terminal,
  RefreshCw,
  X,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  getAllApplicants,
  getApplicantsByJob,
  getAdminJobs,
  updateApplicationStatus,
} from '../../services/api';

const ALL_STATUSES = [
  'All',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Interview Completed',
  'Selected',
  'Offer Sent',
  'Offer Accepted',
  'Offer Rejected',
  'Rejected',
];

const AdminApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(jobId || 'all');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    setSelectedJob(jobId || 'all');
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      let applicantData = null;
      if (jobId && jobId !== 'all' && jobId !== 'undefined') {
        try {
          applicantData = await getApplicantsByJob(jobId);
        } catch (jobAppErr) {
          console.warn('Specific job applicants fetch failed, falling back to all applicants:', jobAppErr);
          applicantData = await getAllApplicants().catch(() => ({ applications: [] }));
        }
      } else {
        applicantData = await getAllApplicants().catch(() => ({ applications: [] }));
      }

      const jobsData = await getAdminJobs().catch(() => ({ jobs: [] }));

      setApplications(applicantData?.applications || []);
      setJobs(jobsData?.jobs || []);
    } catch (err) {
      console.error('Fetch applicants error:', err);
      setError(err.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app)),
      );
    } catch (err) {
      console.error('Status update error:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedStatus('All');
    setSelectedJob('all');
  };

  const filteredApplications = applications.filter((app) => {
    const candidateName = app.fullName || '';
    const candidateEmail = app.email || '';
    const jobTitle = app.job?.title || '';
    const jobCompany = app.job?.company || '';
    const candidateLocation = app.location || '';

    const matchesSearch =
      !search.trim() ||
      candidateName.toLowerCase().includes(search.toLowerCase().trim()) ||
      candidateEmail.toLowerCase().includes(search.toLowerCase().trim()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase().trim()) ||
      jobCompany.toLowerCase().includes(search.toLowerCase().trim()) ||
      candidateLocation.toLowerCase().includes(search.toLowerCase().trim());

    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;

    // Safely extract job ID whether populated or raw string
    const appIdJob = app.job?._id ? app.job._id.toString() : (app.job ? app.job.toString() : '');
    const matchesJob =
      selectedJob === 'all' ||
      !selectedJob ||
      appIdJob === selectedJob ||
      (app.job && typeof app.job === 'object' && app.job._id?.toString() === selectedJob);

    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusCount = (st) => {
    if (st === 'All') return applications.length;
    return applications.filter((a) => a.status === st).length;
  };

  const hasActiveFilters = search.trim() !== '' || selectedStatus !== 'All' || selectedJob !== 'all';

  return (
    <AdminLayout>
      {/* Header */}
      <div className="space-y-4">
        {jobId && (
          <Button variant="ghost" onClick={() => navigate('/admin/applicants')} className="gap-2 -ml-2 text-xs">
            <ArrowLeft className="w-4 h-4" /> View Global Applicant Pool
          </Button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-muted text-muted-foreground border border-border">
              <Terminal className="w-3 h-3 text-primary" />
              <span>applicant_pipeline.ts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Candidate Pipeline & Review
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {jobId ? 'Filtered applicant list for selected position' : 'Global applicant pool across all active openings'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="gap-1.5 text-xs h-9"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <div className="bg-card px-4 py-2 rounded-xl border border-border text-center">
              <p className="text-[10px] font-mono uppercase font-semibold text-muted-foreground">Showing</p>
              <p className="text-xl font-bold font-mono text-primary">{filteredApplications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchData} className="text-xs h-7">
            Retry
          </Button>
        </div>
      )}

      {/* Filter and Search Section */}
      <div className="bg-card p-4 rounded-xl border border-border space-y-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search candidate name, email, role, tech stack, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border text-sm h-10"
            />
          </div>

          {/* Job Filter Dropdown */}
          {!jobId && (
            <div>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Job Openings ({jobs.length})</option>
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Status Pills & Clear Filters */}
        <div className="flex items-center justify-between gap-2 pt-1 pb-1">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {ALL_STATUSES.map((status) => {
              const count = getStatusCount(status);
              const isSelected = selectedStatus === status;

              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Applicant List */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loading text="Loading candidate applications..." />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-2xl border border-border p-8 space-y-3">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-1 opacity-40" />
          <h3 className="font-bold text-lg text-foreground">No applicants match criteria</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {hasActiveFilters
              ? 'Filters are currently active. Click below to clear all filters and view all candidates.'
              : 'Candidate submissions will appear here as they apply.'}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs mt-2"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app) => (
            <Card
              key={app._id}
              className="hover:border-primary/40 hover:shadow-xs transition-all duration-150 border-border bg-card overflow-hidden rounded-xl"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Candidate Profile Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      {app.fullName ? app.fullName.charAt(0).toUpperCase() : 'C'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-foreground leading-tight">
                          {app.fullName}
                        </h3>
                        <StatusBadge status={app.status} size="sm" />
                      </div>

                      <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
                        Applied for{' '}
                        <span className="font-semibold text-foreground">
                          {app.job?.title || 'Job Opening'}
                        </span>
                        {app.job?.company ? ` at ${app.job.company}` : ''}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-primary/70" /> {app.email}
                        </span>
                        {app.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-primary/70" /> {app.phone}
                          </span>
                        )}
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary/70" /> {app.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stage Quick Update & Action Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">STAGE:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                        className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Interview Completed">Interview Completed</option>
                        <option value="Selected">Selected</option>
                        <option value="Offer Sent">Offer Sent</option>
                        <option value="Offer Accepted">Offer Accepted (Hired)</option>
                        <option value="Offer Rejected">Offer Rejected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* View Details Button */}
                    <Button
                      size="sm"
                      onClick={() => navigate(`/admin/applications/${app._id}`)}
                      className="gap-1.5 text-xs shrink-0 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Manage Candidate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminApplicants;
