import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  PlusCircle,
  Search,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getAdminJobs, deleteAdminJob } from '../../services/api';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, expired
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmJob, setDeleteConfirmJob] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Fetch admin jobs error:', err);
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      setDeletingId(jobId);
      await deleteAdminJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setDeleteConfirmJob(null);
    } catch (err) {
      console.error('Delete job error:', err);
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to calculate deadline status
  const getDeadlineInfo = (deadlineDate) => {
    if (!deadlineDate) return { isExpired: false, text: 'No Deadline', badgeColor: 'bg-muted text-muted-foreground' };

    const deadline = new Date(deadlineDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { isExpired: true, text: 'Deadline Passed', badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-200' };
    } else if (diffDays === 0) {
      return { isExpired: false, text: 'Closes Today', badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200' };
    } else if (diffDays === 1) {
      return { isExpired: false, text: '1 day left', badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200' };
    } else {
      return { isExpired: false, text: `${diffDays} days left`, badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase()) ||
      job.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const deadlineInfo = getDeadlineInfo(job.timeline?.applicationDeadline);

    if (filterStatus === 'active') {
      return matchesSearch && !deadlineInfo.isExpired;
    }
    if (filterStatus === 'expired') {
      return matchesSearch && deadlineInfo.isExpired;
    }
    return matchesSearch;
  });

  const activeJobsCount = jobs.filter(
    (j) => !getDeadlineInfo(j.timeline?.applicationDeadline).isExpired,
  ).length;
  const expiredJobsCount = jobs.length - activeJobsCount;
  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Phase 3B · Job Postings & Lifecycle
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Job Openings Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, configure deadlines, monitor application flow, and edit active listings.
          </p>
        </div>

        <Button onClick={() => navigate('/admin/jobs/create')} className="gap-2 shrink-0">
          <PlusCircle className="w-4 h-4" />
          Create New Job Opening
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Total Openings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{jobs.length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Active Deadlines</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{activeJobsCount}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Expired Listings</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{expiredJobsCount}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Total Applications</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalApps}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, skill, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All Openings ({jobs.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'active'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Active Deadline ({activeJobsCount})
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'expired'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Expired ({expiredJobsCount})
          </button>
        </div>
      </div>

      {/* Job Grid / List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loading text="Loading job listings..." />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-xl border border-border p-8">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-60" />
          <h3 className="font-semibold text-lg text-foreground">No job openings found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search || filterStatus !== 'all'
              ? 'Try changing your search keywords or filter criteria.'
              : 'Create your first job posting to start receiving candidate applications.'}
          </p>
          <Button onClick={() => navigate('/admin/jobs/create')} className="mt-5 gap-2">
            <PlusCircle className="w-4 h-4" /> Create Opening
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const deadline = getDeadlineInfo(job.timeline?.applicationDeadline);

            return (
              <Card
                key={job._id}
                className="hover:shadow-md transition-all duration-200 border-border flex flex-col justify-between"
              >
                <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                  {/* Top: Header & Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${deadline.badgeColor}`}
                      >
                        <Clock className="w-3 h-3" />
                        {deadline.text}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {job.jobType || 'Full Time'}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-foreground leading-snug line-clamp-1">
                      {job.title}
                    </h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      {job.company}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location || 'Remote'}
                      </span>
                      {job.experience && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {job.experience}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.slice(0, 4).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Middle: Deadline & Dates */}
                  {job.timeline?.applicationDeadline && (
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline:
                      </span>
                      <span className="font-medium text-foreground">
                        {new Date(job.timeline.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      {job.applicationCount || 0} Applicants
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                        title="Edit Job"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmJob(job)}
                        title="Delete Job"
                        className="p-1.5 rounded-md hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        title="View Public Page"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-foreground">Confirm Job Deletion</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteConfirmJob.title}"</span> at {deleteConfirmJob.company}?
              <br />
              <strong className="text-rose-600">Warning:</strong> This will also remove all associated applicant records.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmJob(null)}
                disabled={deletingId === deleteConfirmJob._id}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteJob(deleteConfirmJob._id)}
                disabled={deletingId === deleteConfirmJob._id}
              >
                {deletingId === deleteConfirmJob._id ? 'Deleting...' : 'Delete Job'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminJobs;
