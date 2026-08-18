import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Video,
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Award,
  Calendar,
  Building2,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/admin/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getAdminInterviews, updateInterviewResult } from '../../services/api';

const InterviewManagement = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all, pending, accepted, rejected, selected, failed

  // Result modal state
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [resultData, setResultData] = useState({ result: 'Selected', message: '' });
  const [submittingResult, setSubmittingResult] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminInterviews();
      setInterviews(data.interviews || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Fetch interviews error:', err);
      setError(err.response?.data?.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResultModal = (app) => {
    setActiveModalApp(app);
    setResultData({
      result: app.interview?.result === 'Rejected' ? 'Rejected' : 'Selected',
      message: app.interview?.resultMessage || '',
    });
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalApp) return;

    try {
      setSubmittingResult(true);
      await updateInterviewResult(activeModalApp._id, resultData);
      setActiveModalApp(null);
      await fetchInterviews();
    } catch (err) {
      console.error('Submit result error:', err);
      alert(err.response?.data?.message || 'Failed to record interview result');
    } finally {
      setSubmittingResult(false);
    }
  };

  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.job?.company?.toLowerCase().includes(search.toLowerCase());

    const resp = item.interview?.candidateResponse;
    const res = item.interview?.result;

    if (filterTab === 'pending') return matchesSearch && resp === 'Pending';
    if (filterTab === 'accepted') return matchesSearch && resp === 'Accepted';
    if (filterTab === 'declined') return matchesSearch && resp === 'Rejected';
    if (filterTab === 'selected') return matchesSearch && res === 'Selected';
    if (filterTab === 'failed') return matchesSearch && res === 'Rejected';

    return matchesSearch;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Phase 3D & 3E · Live Candidate Interviews
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Interview Management & Evaluation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track candidate confirmations, join video rooms, and record post-interview evaluations.
          </p>
        </div>

        <Button onClick={() => navigate('/admin/applicants')} className="gap-2 shrink-0">
          <Users className="w-4 h-4" />
          Shortlisted Candidates
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Total Scheduled</p>
          <p className="text-2xl font-bold text-foreground mt-1">{interviews.length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Candidate Confirmed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.accepted || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Pending Confirmation</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.scheduled || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Selected / Cleared</p>
          <p className="text-2xl font-bold text-primary mt-1">{stats.selected || 0}</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-card p-4 rounded-xl border border-border space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidate, email, role, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All Interviews ({interviews.length})
          </button>
          <button
            onClick={() => setFilterTab('accepted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'accepted' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Candidate Accepted ({stats.accepted || 0})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending Confirmation ({stats.scheduled || 0})
          </button>
          <button
            onClick={() => setFilterTab('selected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'selected' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Selected Candidates ({stats.selected || 0})
          </button>
          <button
            onClick={() => setFilterTab('declined')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'declined' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Declined Invites ({stats.rejected || 0})
          </button>
        </div>
      </div>

      {/* Interviews Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loading text="Loading interviews..." />
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-xl border border-border p-8">
          <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="font-semibold text-lg text-foreground">No interviews found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search || filterTab !== 'all'
              ? 'Try changing your search keywords or filter.'
              : 'Schedule interviews with shortlisted candidates from their applicant detail pages.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInterviews.map((app) => {
            const iv = app.interview || {};
            const isSelected = iv.result === 'Selected';
            const isFailed = iv.result === 'Rejected';

            return (
              <Card key={app._id} className="hover:shadow-md transition-all border-border flex flex-col justify-between">
                <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                  <div>
                    {/* Top Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200">
                        {iv.interviewTime || '10:00 AM'}
                      </span>

                      {iv.candidateResponse === 'Accepted' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" /> Candidate Confirmed
                        </span>
                      ) : iv.candidateResponse === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600">
                          <XCircle className="w-3 h-3" /> Declined
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                          <Clock className="w-3 h-3" /> Pending Confirmation
                        </span>
                      )}
                    </div>

                    {/* Candidate Name & Role */}
                    <h3 className="font-bold text-base text-foreground line-clamp-1">{app.fullName}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                      <Building2 className="w-3.5 h-3.5" />
                      {app.job?.title || 'Job Opening'} · {app.job?.company}
                    </p>

                    {/* Date & Meeting Info */}
                    <div className="mt-3 p-3 rounded-xl bg-muted/40 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Interview Date:</span>
                        <span className="font-semibold text-foreground">
                          {iv.interviewDate ? new Date(iv.interviewDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      {iv.meetingLink && (
                        <div className="pt-1">
                          <a
                            href={iv.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                          >
                            <Video className="w-3.5 h-3.5" /> Launch Video Meeting
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Result Badge if evaluated */}
                    {iv.result && iv.result !== 'Pending' && (
                      <div className="mt-3 flex items-center justify-between text-xs p-2 rounded-lg bg-muted/60">
                        <span className="text-muted-foreground">Evaluation:</span>
                        <StatusBadge status={iv.result} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenResultModal(app)}
                      className="text-xs gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {iv.result && iv.result !== 'Pending' ? 'Edit Result' : 'Record Result'}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/admin/applications/${app._id}`)}
                      className="text-xs gap-1"
                    >
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Record Result Modal */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase text-primary">Phase 3E: Evaluation</span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                Record Result for {activeModalApp.fullName}
              </h3>
              <p className="text-xs text-muted-foreground">
                Role: {activeModalApp.job?.title} at {activeModalApp.job?.company}
              </p>
            </div>

            <form onSubmit={handleResultSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Interview Decision *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResultData({ ...resultData, result: 'Selected' })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      resultData.result === 'Selected'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-background hover:bg-muted border-border text-foreground'
                    }`}
                  >
                    ✓ Selected (Pass)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultData({ ...resultData, result: 'Rejected' })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      resultData.result === 'Rejected'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-background hover:bg-muted border-border text-foreground'
                    }`}
                  >
                    ✕ Rejected (Fail)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Feedback / Email Note</label>
                <Textarea
                  rows={3}
                  value={resultData.message}
                  onChange={(e) => setResultData({ ...resultData, message: e.target.value })}
                  placeholder="Provide constructive feedback for the candidate notification email..."
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModalApp(null)}
                  disabled={submittingResult}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submittingResult} className="bg-primary min-w-28">
                  {submittingResult ? 'Saving...' : 'Submit & Email'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default InterviewManagement;