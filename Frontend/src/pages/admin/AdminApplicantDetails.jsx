import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  Video,
  Award,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  MessageSquare,
  IndianRupee,
  Download,
  Eye,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/admin/StatusBadge';
import ApplicationTimeline from '../../components/admin/ApplicationTimeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  getAdminApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  updateInterviewResult,
  createOffer,
} from '../../services/api';

const AdminApplicantDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Interview Form (Phase 3D)
  const [interviewData, setInterviewData] = useState({
    interviewDate: '',
    interviewTime: '10:00 AM',
    meetingLink: 'https://meet.google.com/new',
    message: 'Please be ready 5 minutes prior with a working microphone and camera.',
  });

  // Interview Result Form (Phase 3E)
  const [interviewResult, setInterviewResult] = useState({
    result: 'Selected',
    message: '',
  });

  // Offer Letter Form (Phase 3F)
  const [offerData, setOfferData] = useState({
    position: '',
    salary: '',
    joiningDate: '',
    expiryDate: '',
    message: 'We are excited to welcome you to our team and look forward to building great things together!',
  });

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminApplicationById(applicationId);
      const app = data.application;
      setApplication(app);

      // Pre-fill offer position from job title
      if (app?.job?.title) {
        setOfferData((prev) => ({
          ...prev,
          position: app.job.title,
        }));
      }

      // Pre-fill interview result message if empty
      if (app?.fullName) {
        setInterviewResult((prev) => ({
          ...prev,
          message: `Congratulations ${app.fullName}! You have successfully cleared the interview round.`,
        }));
      }
    } catch (err) {
      console.error('Fetch application error:', err);
      setError(err.response?.data?.message || 'Failed to load applicant details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      const res = await updateApplicationStatus(applicationId, newStatus);
      setSuccess(res.message || `Status updated to ${newStatus}`);
      await fetchApplication();
    } catch (err) {
      console.error('Status error:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewData.interviewDate || !interviewData.interviewTime || !interviewData.meetingLink) {
      setError('Date, time, and meeting link are required for interview scheduling');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      const res = await scheduleInterview(applicationId, interviewData);
      setSuccess(res.message || 'Interview invitation scheduled and email sent successfully!');
      await fetchApplication();
    } catch (err) {
      console.error('Schedule interview error:', err);
      setError(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInterviewResultSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      const res = await updateInterviewResult(applicationId, interviewResult);
      setSuccess(res.message || `Interview result recorded: ${interviewResult.result}`);
      await fetchApplication();
    } catch (err) {
      console.error('Interview result error:', err);
      setError(err.response?.data?.message || 'Failed to submit interview result');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateOfferSubmit = async (e) => {
    e.preventDefault();
    if (!offerData.position || !offerData.salary || !offerData.joiningDate || !offerData.expiryDate) {
      setError('Position, CTC salary, joining date, and offer expiry date are required');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      const res = await createOffer(applicationId, offerData);
      setSuccess(res.message || 'Job offer letter issued and email sent successfully!');
      await fetchApplication();
    } catch (err) {
      console.error('Create offer error:', err);
      setError(err.response?.data?.message || 'Failed to generate job offer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex justify-center">
          <Loading text="Loading candidate application details..." />
        </div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout>
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {error || 'Candidate Application Not Found'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {error
              ? 'There was an issue loading the candidate record. Click Retry below.'
              : 'The requested application record could not be located in the database.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchApplication}
              className="text-xs"
            >
              Retry
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/admin/applicants')}
              className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              Back to Applicants Pipeline
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const job = application.job;
  const resume = application.resume;
  const interview = application.interview;
  const offer = application.offer;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/applicants')}
            className="gap-2 -ml-2 text-xs w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Applicants Pipeline
          </Button>

          {/* Quick Stage Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Application Stage:</span>
            <select
              value={application.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={actionLoading}
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary cursor-pointer"
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
        </div>

        {/* Candidate Profile Header Card */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 flex items-center justify-center font-bold text-2xl shrink-0 shadow-inner">
              {application.fullName ? application.fullName.charAt(0).toUpperCase() : 'C'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{application.fullName}</h1>
                <StatusBadge status={application.status} size="md" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Applied for <span className="text-foreground font-semibold">{job?.title || 'Job Opening'}</span> at {job?.company || 'Company'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> {application.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> {application.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {application.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {success}
          </div>
        )}

        {/* Phase 3C: Visual Step Progression Timeline */}
        <ApplicationTimeline application={application} />

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Candidate & Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Candidate Resume & Keyword Matching
                </CardTitle>
                <CardDescription className="text-xs">
                  Skills extracted and matched against job requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const resumeUrl = resume?.filePath
                    ? `http://localhost:3000/${resume.filePath.replace(/\\/g, '/').replace(/^\/+/, '')}`
                    : resume?._id
                    ? `http://localhost:3000/api/resumes/${resume._id}/file`
                    : '';

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-200 shrink-0">
                            PDF
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">
                              {resume?.fileName || 'Candidate_Resume.pdf'}
                            </p>
                            <p className="text-[11px] text-muted-foreground">Uploaded Resume Document</p>
                          </div>
                        </div>

                        {resumeUrl && (
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowPdfPreview((prev) => !prev)}
                              className="text-xs h-8 gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {showPdfPreview ? 'Hide Preview' : 'Preview Resume'}
                            </Button>

                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold shadow-xs transition-colors h-8"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> View PDF
                            </a>

                            <a
                              href={resumeUrl}
                              download={resume?.fileName || 'Resume.pdf'}
                              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted text-xs transition-colors h-8"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>

                      {showPdfPreview && resumeUrl && (
                        <div className="rounded-xl border border-border overflow-hidden bg-background shadow-inner space-y-0">
                          <div className="flex items-center justify-between px-3.5 py-2 bg-muted/70 border-b border-border text-xs">
                            <span className="font-semibold text-foreground flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-primary" /> {resume?.fileName || 'Resume PDF'}
                            </span>
                            <div className="flex items-center gap-2">
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" /> Fullscreen
                              </a>
                              <button
                                type="button"
                                onClick={() => setShowPdfPreview(false)}
                                className="text-xs text-muted-foreground hover:text-foreground font-semibold ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <iframe
                            src={resumeUrl}
                            title="Candidate Resume Preview"
                            className="w-full h-[600px] border-0 bg-muted/10"
                          />
                        </div>
                      )}
                    </>
                  );
                })()}

                {resume?.keywords && resume.keywords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Detected Resume Keywords & Skills:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.keywords.map((kw, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Candidate Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-muted/40 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono text-xs">
                  {application.coverLetter || 'No cover letter submitted.'}
                </div>
              </CardContent>
            </Card>

            {/* Job Opening Details */}
            {job && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Job Opening Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-muted/30">
                    <div>
                      <p className="text-muted-foreground">Company</p>
                      <p className="font-semibold text-foreground mt-0.5">{job.company}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground mt-0.5">{job.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-semibold text-foreground mt-0.5">{job.jobType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Experience</p>
                      <p className="font-semibold text-foreground mt-0.5">{job.experience || 'Not Specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Actions (Phases 3D, 3E, 3F) */}
          <div className="space-y-6">
            {/* Phase 3D: Interview Scheduling Action Card */}
            <Card className="border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader className="pb-3 bg-indigo-500/5 rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                  <CalendarDays className="w-4 h-4" />
                  Phase 3D: Schedule Interview
                </CardTitle>
                <CardDescription className="text-xs">
                  Set meeting details & dispatch invitation email
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {interview?.interviewDate ? (
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200">Scheduled Interview</span>
                      <Badge variant="outline" className="bg-background text-[10px]">
                        Response: {interview.candidateResponse || 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      <strong>Date:</strong> {new Date(interview.interviewDate).toLocaleDateString()} at {interview.interviewTime}
                    </p>
                    <div className="pt-1">
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline flex items-center gap-1 font-semibold"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Meeting Link
                      </a>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleScheduleInterview} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Date *</label>
                      <Input
                        type="date"
                        value={interviewData.interviewDate}
                        onChange={(e) => setInterviewData({ ...interviewData, interviewDate: e.target.value })}
                        required
                        className="text-xs h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Time *</label>
                      <Input
                        value={interviewData.interviewTime}
                        placeholder="e.g. 02:30 PM"
                        onChange={(e) => setInterviewData({ ...interviewData, interviewTime: e.target.value })}
                        required
                        className="text-xs h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Meeting URL *</label>
                    <Input
                      value={interviewData.meetingLink}
                      placeholder="https://meet.google.com/..."
                      onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
                      required
                      className="text-xs h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Instructions / Note</label>
                    <Textarea
                      rows={2}
                      value={interviewData.message}
                      onChange={(e) => setInterviewData({ ...interviewData, message: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <Button type="submit" size="sm" disabled={actionLoading} className="w-full gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Send className="w-3.5 h-3.5" />
                    {interview?.interviewDate ? 'Reschedule & Notify' : 'Send Interview Invite'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Phase 3E: Interview Evaluation & Result Card */}
            <Card className="border-amber-200 dark:border-amber-900 shadow-sm">
              <CardHeader className="pb-3 bg-amber-500/5 rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Award className="w-4 h-4" />
                  Phase 3E: Interview Result
                </CardTitle>
                <CardDescription className="text-xs">
                  Record outcome & trigger selection/rejection email
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {interview?.result && interview.result !== 'Pending' && (
                  <div className="p-3 rounded-xl bg-muted text-xs">
                    <p className="font-semibold text-foreground">Current Result: <StatusBadge status={interview.result} size="sm" /></p>
                    {interview.resultMessage && (
                      <p className="text-muted-foreground mt-1">{interview.resultMessage}</p>
                    )}
                  </div>
                )}

                <form onSubmit={handleInterviewResultSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Decision *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setInterviewResult({ ...interviewResult, result: 'Selected' })}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          interviewResult.result === 'Selected'
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-background hover:bg-muted border-border text-foreground'
                        }`}
                      >
                        ✓ Selected (Pass)
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterviewResult({ ...interviewResult, result: 'Rejected' })}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          interviewResult.result === 'Rejected'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-background hover:bg-muted border-border text-foreground'
                        }`}
                      >
                        ✕ Rejected (Fail)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Feedback / Email Message</label>
                    <Textarea
                      rows={2}
                      value={interviewResult.message}
                      onChange={(e) => setInterviewResult({ ...interviewResult, message: e.target.value })}
                      placeholder="Add personalized feedback for the candidate..."
                      className="text-xs"
                    />
                  </div>

                  <Button type="submit" size="sm" disabled={actionLoading} className="w-full text-xs bg-amber-600 hover:bg-amber-700 text-white">
                    Submit Result & Send Email
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Phase 3F: Offer Letter Generator Card */}
            <Card className="border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader className="pb-3 bg-emerald-500/5 rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  Phase 3F: Issue Job Offer Letter
                </CardTitle>
                <CardDescription className="text-xs">
                  Generate official offer with salary & joining date
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {offer?.status === 'Sent' || offer?.status === 'Accepted' || offer?.status === 'Rejected' ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200">Offer Issued</span>
                      <StatusBadge status={offer.status === 'Accepted' ? 'Offer Accepted' : offer.status === 'Rejected' ? 'Offer Rejected' : 'Offer Sent'} size="sm" />
                    </div>
                    <p className="text-foreground"><strong>CTC:</strong> ₹{Number(offer.salary).toLocaleString('en-IN')}</p>
                    <p className="text-muted-foreground"><strong>Joining:</strong> {new Date(offer.joiningDate).toLocaleDateString()}</p>
                    <p className="text-muted-foreground"><strong>Expires:</strong> {new Date(offer.expiryDate).toLocaleDateString()}</p>
                  </div>
                ) : null}

                <form onSubmit={handleCreateOfferSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Offered Position *</label>
                    <Input
                      value={offerData.position}
                      placeholder="e.g. Senior Frontend Engineer"
                      onChange={(e) => setOfferData({ ...offerData, position: e.target.value })}
                      required
                      className="text-xs h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Annual CTC / Salary (₹) *</label>
                    <Input
                      type="number"
                      value={offerData.salary}
                      placeholder="e.g. 1200000"
                      onChange={(e) => setOfferData({ ...offerData, salary: e.target.value })}
                      required
                      className="text-xs h-8"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Joining Date *</label>
                      <Input
                        type="date"
                        value={offerData.joiningDate}
                        onChange={(e) => setOfferData({ ...offerData, joiningDate: e.target.value })}
                        required
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Expiry Date *</label>
                      <Input
                        type="date"
                        value={offerData.expiryDate}
                        onChange={(e) => setOfferData({ ...offerData, expiryDate: e.target.value })}
                        required
                        className="text-xs h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Offer Letter Message</label>
                    <Textarea
                      rows={2}
                      value={offerData.message}
                      onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <Button type="submit" size="sm" disabled={actionLoading} className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Issue & Dispatch Offer Letter
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicantDetails;
