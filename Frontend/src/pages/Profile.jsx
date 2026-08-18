import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Calendar,
  FileText,
  Briefcase,
  LogOut,
  Sparkles,
  Award,
  Video,
  ExternalLink,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Settings,
  ChevronRight,
  RefreshCw,
  Search,
  PartyPopper,
  AlertCircle,
  Building2,
  Terminal,
  Layers,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  getAllResumes,
  getMyApplications,
  uploadResume,
  deleteResume,
  getMatchingJobs,
} from '../services/api';
import StatusBadge from '../components/admin/StatusBadge';
import Loading from '../components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const TABS = [
  { id: 'overview', label: 'Overview & Activity', icon: Layers },
  { id: 'applications', label: 'Applications & Pipeline', icon: Briefcase },
  { id: 'resumes', label: 'Resumes & Tech Stack', icon: FileText },
  { id: 'interviews-offers', label: 'Interviews & Offers', icon: Award },
  { id: 'account', label: 'Account & Settings', icon: Settings },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('overview');
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Application search & filter in profile
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  useEffect(() => {
    if (user) {
      fetchCandidateData();
    }
  }, [user]);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const [resumesData, appsData] = await Promise.all([
        getAllResumes().catch(() => ({ resume: [] })),
        getMyApplications().catch(() => ({ applications: [] })),
      ]);

      setResumes(resumesData.resume || []);
      setApplications(appsData.applications || []);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setUploadError('Only PDF resumes are supported.');
      return;
    }

    try {
      setUploadingResume(true);
      setUploadError('');
      const data = await uploadResume(file);
      setResumes((prev) => [data.resume, ...prev]);
      setActionSuccess('Resume uploaded and keywords parsed successfully!');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to remove this resume?')) return;
    try {
      await deleteResume(resumeId);
      setResumes((prev) => prev.filter((r) => r._id !== resumeId));
      setActionSuccess('Resume removed.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Delete resume error:', err);
      alert('Failed to delete resume');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  // Filter Active Offers & Interviews
  const scheduledInterviews = applications.filter(
    (a) =>
      a.interview?.interviewDate ||
      [
        'Interview Scheduled',
        'Interview Accepted',
        'Interview Completed',
        'Selected',
      ].includes(a.status),
  );

  const pendingOffers = applications.filter(
    (a) => a.offer?.status === 'Sent' || ['Offer Sent', 'Offer Accepted'].includes(a.status),
  );

  // Aggregate All Extracted Skills
  const allExtractedSkills = Array.from(
    new Set(resumes.flatMap((r) => r.keywords || [])),
  );

  // Filtered Applications for Tab 2
  const filteredApps = applications.filter((app) => {
    const title = app.job?.title?.toLowerCase() || '';
    const comp = app.job?.company?.toLowerCase() || '';
    const loc = app.location?.toLowerCase() || '';
    const matchesSearch =
      title.includes(appSearch.toLowerCase()) ||
      comp.includes(appSearch.toLowerCase()) ||
      loc.includes(appSearch.toLowerCase());

    const matchesStatus =
      appStatusFilter === 'All' || app.status === appStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Profile Completeness
  let completenessScore = 40; // Base registered
  if (resumes.length > 0) completenessScore += 30;
  if (applications.length > 0) completenessScore += 30;

  return (
    <main className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-6 sm:space-y-8">
        {/* ========================================================================= */}
        {/* TOP IDENTITY & MONOGRAM HERO CARD */}
        {/* ========================================================================= */}
        <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Avatar & User Details */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-2xl sm:text-3xl shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {user.name}
                    </h1>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {user.role === 'admin' ? 'Administrator' : 'Candidate Developer'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {user.email}
                  </p>

                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Member since{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
                  </p>
                </div>
              </div>

              {/* Action Buttons & Readiness */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <div className="bg-muted/40 p-3 rounded-2xl border border-border text-left w-full sm:w-auto min-w-40 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono font-semibold">
                    <span className="text-muted-foreground">Profile Readiness</span>
                    <span className="text-primary">{completenessScore}%</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${completenessScore}%` }}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/jobs')}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs h-10 px-4 rounded-xl gap-1.5 shadow-xs w-full sm:w-auto"
                >
                  <Briefcase className="w-4 h-4" /> Browse Roles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Feedback Banners */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Action Callout if Pending Offer or Interview */}
        {pendingOffers.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-card border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                🎉
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Official Job Offer Received!
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You have an active formal offer letter awaiting your review and decision.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`/my-applications/${pendingOffers[0]._id}`)}
              className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold h-9 px-4 rounded-xl shrink-0"
            >
              Review & Respond to Offer →
            </Button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATS METRIC STRIP */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-mono">APPLICATIONS</span>
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {loading ? '...' : applications.length}
            </p>
            <p className="text-[10px] text-muted-foreground">Roles in pipeline</p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-mono">RESUMES</span>
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {loading ? '...' : resumes.length}
            </p>
            <p className="text-[10px] text-muted-foreground">Parsed documents</p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-mono">INTERVIEWS</span>
              <Video className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {loading ? '...' : scheduledInterviews.length}
            </p>
            <p className="text-[10px] text-muted-foreground">Scheduled discussions</p>
          </div>

          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-1">
            <div className="flex items-center justify-between text-primary">
              <span className="text-[11px] font-mono font-bold">OFFERS / HIRED</span>
              <Award className="w-4 h-4" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-primary">
              {loading ? '...' : pendingOffers.length}
            </p>
            <p className="text-[10px] text-primary/80 font-medium">Offers issued</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-card border border-border scrollbar-none shadow-xs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & ACTIVITY */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Recent Applications & Pipeline Flow */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border shadow-xs rounded-2xl">
                  <CardHeader className="p-5 sm:p-6 border-b border-border flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold">Recent Applications</CardTitle>
                      <CardDescription className="text-xs">
                        Latest updates on your active submissions
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('applications')}
                      className="text-xs text-primary hover:underline h-8"
                    >
                      View All ({applications.length}) →
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5 sm:p-6">
                    {loading ? (
                      <Loading text="Loading applications..." />
                    ) : applications.length === 0 ? (
                      <div className="py-12 text-center space-y-3">
                        <Briefcase className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
                        <p className="text-sm font-bold text-foreground">No applications yet</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          Ready to take the next step? Explore our open roles or match your resume.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => navigate('/jobs')}
                          className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground mt-2"
                        >
                          Browse Open Roles
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {applications.slice(0, 4).map((app) => (
                          <div
                            key={app._id}
                            onClick={() => navigate(`/my-applications/${app._id}`)}
                            className="p-4 rounded-xl border border-border bg-background/50 hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                  {app.job?.title || 'Engineering Role'}
                                </h4>
                                <StatusBadge status={app.status} size="sm" />
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <span>{app.job?.company || 'JobMatch'}</span>
                                <span>·</span>
                                <span>{app.location || 'Remote'}</span>
                                <span>·</span>
                                <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 self-start sm:self-auto gap-1"
                            >
                              Details <ChevronRight className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Next Steps */}
                <Card className="bg-card border-border shadow-xs rounded-2xl">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Candidate Acceleration Tips
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                        <p className="font-semibold text-foreground">Upload Multiple Resumes</p>
                        <p className="text-muted-foreground text-[11px]">
                          Upload specialized resumes (e.g. Frontend vs Backend) to get tailored match percentages.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                        <p className="font-semibold text-foreground">Prepare for Interviews</p>
                        <p className="text-muted-foreground text-[11px]">
                          Check your meeting links in advance and review the required tech stack tags.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Skills Cloud & Quick Upload */}
              <div className="space-y-6">
                {/* Skills Cloud */}
                <Card className="bg-card border-border shadow-xs rounded-2xl">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-primary" />
                      Extracted Skills Cloud
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Technical competencies parsed from your uploaded documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-3">
                    {allExtractedSkills.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-3">
                        Upload a resume to automatically extract tech stack keywords.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {allExtractedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-muted text-foreground border border-border hover:border-primary/40 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Direct Upload Widget */}
                <Card className="bg-card border-border shadow-xs rounded-2xl">
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-primary" />
                      Fast Resume Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-3">
                    <label className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-5 text-center cursor-pointer block transition-colors bg-muted/20">
                      <UploadCloud className="w-6 h-6 mx-auto text-primary mb-1.5" />
                      <p className="text-xs font-semibold text-foreground">
                        {uploadingResume ? 'Extracting skills...' : 'Drop or select PDF resume'}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Max 5MB PDF format</p>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploadingResume}
                        className="hidden"
                      />
                    </label>

                    {uploadError && (
                      <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                        {uploadError}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: APPLICATIONS & PIPELINE TRACKER */}
        {/* ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="relative md:col-span-8">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applied roles, company, or location..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="pl-10 h-10 bg-background border-border text-sm"
                  />
                </div>
                <div className="md:col-span-4">
                  <select
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-medium cursor-pointer"
                  >
                    <option value="All">All Pipeline Stages ({applications.length})</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Interview Completed">Interview Completed</option>
                    <option value="Selected">Selected</option>
                    <option value="Offer Sent">Offer Sent</option>
                    <option value="Offer Accepted">Offer Accepted (Hired)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            {filteredApps.length === 0 ? (
              <div className="p-16 text-center bg-card rounded-2xl border border-border space-y-3">
                <Briefcase className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
                <h3 className="font-bold text-base text-foreground">No applications found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No submissions match your filter criteria. Browse all open roles to apply.
                </p>
                <Button
                  onClick={() => navigate('/jobs')}
                  className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground mt-2"
                >
                  Explore Open Roles
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApps.map((app) => (
                  <Card
                    key={app._id}
                    className="bg-card border-border hover:border-primary/40 transition-all rounded-2xl overflow-hidden shadow-xs"
                  >
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-base text-foreground">
                            {app.job?.title || 'Engineering Role'}
                          </h4>
                          <StatusBadge status={app.status} size="sm" />
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                          <span>{app.job?.company || 'Company'}</span>
                          <span>·</span>
                          <MapPin className="w-3.5 h-3.5 text-primary/70" />
                          <span>{app.location || 'Remote'}</span>
                          <span>·</span>
                          <span>Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </p>

                        {/* Interview / Offer Notice on Card */}
                        {app.interview?.interviewDate && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-medium">
                            <Video className="w-3 h-3" /> Interview:{' '}
                            {new Date(app.interview.interviewDate).toLocaleString()}
                          </div>
                        )}
                        {app.offer?.salary && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-300 text-xs font-mono font-bold">
                            🎉 Offer: {app.offer.salary} CTC
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/my-applications/${app._id}`)}
                          className="text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground gap-1 h-9 px-4 rounded-xl"
                        >
                          View Pipeline Tracker <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RESUMES & TECH STACK ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            {/* Upload Box */}
            <Card className="bg-card border-border shadow-xs rounded-2xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-primary" />
                  Add New Resume Document
                </CardTitle>
                <CardDescription className="text-xs">
                  Upload a PDF version of your resume to parse technical skills and match with current openings.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                <label className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-8 text-center cursor-pointer block transition-colors bg-muted/20">
                  <UploadCloud className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">
                    {uploadingResume ? 'Analyzing resume...' : 'Click or drop PDF here to upload'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Standard PDF up to 5MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    disabled={uploadingResume}
                    className="hidden"
                  />
                </label>
                {uploadError && (
                  <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl">
                    {uploadError}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* List of Resumes */}
            <div className="space-y-3">
              <h3 className="font-bold text-base text-foreground">
                Your Saved Resumes ({resumes.length})
              </h3>
              {resumes.length === 0 ? (
                <div className="p-12 text-center bg-card rounded-2xl border border-border text-xs text-muted-foreground">
                  No resumes saved. Upload one above to get automated match scores.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumes.map((res) => (
                    <Card
                      key={res._id}
                      className="bg-card border-border hover:border-primary/30 transition-all rounded-2xl overflow-hidden shadow-xs"
                    >
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-foreground truncate">
                                {res.fileName}
                              </h4>
                              <p className="text-[11px] text-muted-foreground font-mono">
                                Uploaded {new Date(res.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteResume(res._id)}
                            className="text-muted-foreground hover:text-destructive p-1.5 transition-colors"
                            title="Delete resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Extracted Skills */}
                        {res.keywords && res.keywords.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                              {res.keywords.length} Skills Extracted:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {res.keywords.slice(0, 8).map((kw, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-foreground border border-border"
                                >
                                  {kw}
                                </span>
                              ))}
                              {res.keywords.length > 8 && (
                                <span className="text-[10px] font-mono text-muted-foreground self-center">
                                  +{res.keywords.length - 8}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                          <Button
                            size="sm"
                            onClick={() => navigate('/', { state: { autoMatchResumeId: res._id } })}
                            className="text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground gap-1 h-8 rounded-lg w-full"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Match With Open Jobs
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INTERVIEWS & JOB OFFERS HUB */}
        {/* ========================================================================= */}
        {activeTab === 'interviews-offers' && (
          <div className="space-y-8">
            {/* Scheduled Interviews */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Scheduled Technical Interviews ({scheduledInterviews.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live interview schedules, meeting links, and candidate attendance status
                  </p>
                </div>
              </div>

              {scheduledInterviews.length === 0 ? (
                <div className="p-10 text-center bg-card rounded-2xl border border-border text-xs text-muted-foreground">
                  No interviews currently scheduled. You will receive an email and notification once invited.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scheduledInterviews.map((app) => (
                    <Card
                      key={app._id}
                      className="bg-card border-border hover:border-primary/30 transition-all rounded-2xl overflow-hidden shadow-xs"
                    >
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-base text-foreground">
                              {app.job?.title || 'Engineering Role'}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {app.job?.company || 'Company'} · {app.location}
                            </p>
                          </div>
                          <StatusBadge status={app.status} size="sm" />
                        </div>

                        <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5 text-xs">
                          <p className="flex items-center gap-1.5 font-semibold text-foreground">
                            <Calendar className="w-3.5 h-3.5 text-primary" /> Date:{' '}
                            {app.interview?.interviewDate
                              ? new Date(app.interview.interviewDate).toLocaleString()
                              : 'To Be Confirmed'}
                          </p>
                          {app.interview?.meetingLink && (
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <Video className="w-3.5 h-3.5 text-primary" /> Link:{' '}
                              <a
                                href={app.interview.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline truncate max-w-xs"
                              >
                                {app.interview.meetingLink}
                              </a>
                            </p>
                          )}
                          {app.interview?.candidateResponse && (
                            <p className="text-[11px] text-muted-foreground">
                              Your Attendance Response:{' '}
                              <span className="font-semibold text-foreground">
                                {app.interview.candidateResponse}
                              </span>
                            </p>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => navigate(`/my-applications/${app._id}`)}
                          className="w-full text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground h-8 rounded-lg"
                        >
                          Manage Interview & Meeting →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Official Job Offers */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Official Job Offers ({pendingOffers.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Formal compensation terms, CTC breakdown, and offer acceptance
                </p>
              </div>

              {pendingOffers.length === 0 ? (
                <div className="p-10 text-center bg-card rounded-2xl border border-border text-xs text-muted-foreground">
                  No job offers issued yet. Complete your interview stages to receive formal offers.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingOffers.map((app) => (
                    <Card
                      key={app._id}
                      className="bg-card border-primary/40 shadow-sm rounded-2xl overflow-hidden"
                    >
                      <CardContent className="p-5 space-y-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-primary uppercase">
                              Official Offer Letter
                            </span>
                            <h4 className="font-bold text-lg text-foreground">
                              {app.job?.title || 'Selected Position'}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {app.job?.company || 'Company'}
                            </p>
                          </div>
                          <StatusBadge status={app.status} size="sm" />
                        </div>

                        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1 text-xs">
                          <p className="font-bold text-sm text-primary">
                            Compensation (CTC): {app.offer?.salary || 'Offered Package'}
                          </p>
                          {app.offer?.joiningDate && (
                            <p className="text-muted-foreground">
                              Target Joining Date: {new Date(app.offer.joiningDate).toLocaleDateString()}
                            </p>
                          )}
                          {app.offer?.expiryDate && (
                            <p className="text-rose-600 font-semibold">
                              Offer Valid Until: {new Date(app.offer.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => navigate(`/my-applications/${app._id}`)}
                          className="w-full text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground h-9 rounded-xl"
                        >
                          Review Terms & Respond to Offer 🎉
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ACCOUNT & SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'account' && (
          <div className="space-y-6 max-w-3xl">
            <Card className="bg-card border-border shadow-xs rounded-2xl">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold">Account Profile & Security</CardTitle>
                <CardDescription className="text-xs">
                  Review your credentials and visual preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                    <p className="text-muted-foreground font-mono text-[10px]">FULL NAME</p>
                    <p className="font-semibold text-foreground text-sm">{user.name}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                    <p className="text-muted-foreground font-mono text-[10px]">ACCOUNT EMAIL</p>
                    <p className="font-semibold text-foreground text-sm">{user.email}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                    <p className="text-muted-foreground font-mono text-[10px]">ACCOUNT ROLE</p>
                    <p className="font-semibold text-foreground text-sm capitalize">{user.role}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                    <p className="text-muted-foreground font-mono text-[10px]">MEMBER SINCE</p>
                    <p className="font-semibold text-foreground text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                    </p>
                  </div>
                </div>

                {/* Theme Switcher in Profile */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xs text-foreground">Theme Preference</p>
                    <p className="text-[11px] text-muted-foreground">
                      Current active mode: {isDark ? 'Dark Mode (Deep Black)' : 'Light Mode (Clean White)'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="text-xs gap-1.5 h-8 border-border"
                  >
                    {isDark ? <Sun className="w-3.5 h-3.5 text-primary" /> : <Moon className="w-3.5 h-3.5" />}
                    Switch Theme
                  </Button>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="text-xs font-semibold gap-1.5 h-9 px-4 rounded-xl"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out of Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
