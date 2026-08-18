import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ArrowLeft,
  PartyPopper,
  MapPin,
  FileText,
} from 'lucide-react';

import Loading from '../components/Loading';
import StatusBadge from '../components/admin/StatusBadge';
import ApplicationTimeline from '../components/admin/ApplicationTimeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getApplicationById,
  respondToInterview,
  respondToOffer,
} from '../services/api';

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getApplicationById(applicationId);
      setApplication(data.application || data);
    } catch (err) {
      console.error('Fetch application error:', err);
      setError(err.response?.data?.message || 'Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewResponse = async (response) => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');

      const data = await respondToInterview(applicationId, response);
      setApplication(data.application || application);
      setSuccess(data.message || `Interview invitation ${response.toLowerCase()} successfully`);
      await fetchApplication();
    } catch (err) {
      console.error('Interview response error:', err);
      setError(err.response?.data?.message || 'Failed to submit interview response');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOfferResponse = async (response) => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');

      const data = await respondToOffer(applicationId, response);
      setApplication(data.application || application);
      setSuccess(data.message || `Job offer ${response.toLowerCase()} successfully`);
      await fetchApplication();
    } catch (err) {
      console.error('Offer response error:', err);
      setError(err.response?.data?.message || 'Failed to submit offer response');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 flex justify-center">
        <Loading text="Loading your application tracker..." />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-bold">Application not found</h2>
        <Button onClick={() => navigate('/my-applications')} className="mt-4">
          Back to My Applications
        </Button>
      </div>
    );
  }

  const job = application.job;
  const interview = application.interview;
  const offer = application.offer;

  const isInterviewPending =
    interview?.interviewDate &&
    (interview.candidateResponse === 'Pending' || application.status === 'Interview Scheduled');

  const isOfferPending =
    offer?.status === 'Sent' &&
    (offer.candidateResponse === 'Pending' || application.status === 'Offer Sent');

  const isHired =
    offer?.status === 'Accepted' ||
    offer?.candidateResponse === 'Accepted' ||
    application.status === 'Offer Accepted';

  return (
    <main className="container mx-auto px-6 py-10 max-w-4xl space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/my-applications')} className="gap-2 -ml-2 text-xs">
        <ArrowLeft className="w-4 h-4" /> Back to My Applications
      </Button>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Application Status Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{job?.title || 'Job Role'}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium text-foreground">{job?.company}</span>
            <span>•</span>
            <span>{job?.location}</span>
          </p>
        </div>

        <StatusBadge status={application.status} size="lg" />
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

      {/* Visual Timeline Tracker */}
      <ApplicationTimeline application={application} />

      {/* HIRED CELEBRATION BANNER */}
      {isHired && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border-2 border-emerald-500/30 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/30 animate-bounce">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-foreground">Congratulations! You're Hired!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You have accepted the offer letter for <strong className="text-foreground">{offer?.position || job?.title}</strong> at <strong className="text-foreground">{job?.company}</strong>.
            The hiring team will reach out with your onboarding schedule.
          </p>
        </div>
      )}

      {/* PHASE 3F: JOB OFFER LETTER CARD */}
      {offer?.status && offer.status !== 'Not Created' && (
        <Card className={`border-2 ${isOfferPending ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-border'}`}>
          <CardHeader className="bg-emerald-500/5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-5 h-5" />
                Official Job Offer Letter
              </CardTitle>
              <StatusBadge
                status={
                  offer.status === 'Accepted' || offer.candidateResponse === 'Accepted'
                    ? 'Offer Accepted'
                    : offer.status === 'Rejected' || offer.candidateResponse === 'Rejected'
                    ? 'Offer Rejected'
                    : 'Offer Sent'
                }
                size="sm"
              />
            </div>
            <CardDescription className="text-xs">
              Review your compensation and position details below
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 text-xs">
              <div>
                <p className="text-muted-foreground">Offered Position</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{offer.position || job?.title}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Annual CTC / Salary</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">
                  ₹{Number(offer.salary || 0).toLocaleString('en-IN')} / yr
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Joining Date</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : 'Immediate'}
                </p>
              </div>
            </div>

            {offer.message && (
              <div className="p-4 rounded-xl bg-muted/30 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-1">Message from Hiring Team:</strong>
                {offer.message}
              </div>
            )}

            {offer.expiryDate && (
              <p className="text-xs text-muted-foreground text-center">
                This offer is valid until <strong>{new Date(offer.expiryDate).toLocaleDateString()}</strong>.
              </p>
            )}

            {/* Accept / Reject Buttons for Candidate */}
            {isOfferPending && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
                <Button
                  onClick={() => handleOfferResponse('Accepted')}
                  disabled={actionLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-sm shadow-md"
                >
                  <PartyPopper className="w-4 h-4" />
                  Accept Job Offer 🎉
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOfferResponse('Rejected')}
                  disabled={actionLoading}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  Decline Offer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PHASE 3D: SCHEDULED INTERVIEW CARD */}
      {interview?.interviewDate && (
        <Card className={`border-2 ${isInterviewPending ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-border'}`}>
          <CardHeader className="bg-indigo-500/5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Video className="w-5 h-5" />
                Scheduled Interview Round
              </CardTitle>
              <Badge variant="outline" className="text-xs bg-background">
                Response: {interview.candidateResponse || 'Pending'}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Live technical & culture interview session
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-bold text-foreground text-sm mt-0.5">
                    {new Date(interview.interviewDate).toLocaleDateString()} at {interview.interviewTime}
                  </p>
                </div>
              </div>

              {interview.meetingLink && (
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-muted-foreground">Video Meeting</p>
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary hover:underline text-sm mt-0.5 inline-block"
                    >
                      Join Meeting Room →
                    </a>
                  </div>
                </div>
              )}
            </div>

            {interview.message && (
              <div className="p-3.5 rounded-xl bg-muted/30 text-xs text-muted-foreground">
                <strong className="text-foreground block mb-1">Instructions:</strong>
                {interview.message}
              </div>
            )}

            {/* Candidate Accept / Reject Interview Buttons */}
            {isInterviewPending && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
                <Button
                  onClick={() => handleInterviewResponse('Accepted')}
                  disabled={actionLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Attendance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleInterviewResponse('Rejected')}
                  disabled={actionLoading}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  Decline Invitation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PHASE 3E: INTERVIEW EVALUATION FEEDBACK */}
      {interview?.result && interview.result !== 'Pending' && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Interview Evaluation Result
              </CardTitle>
              <StatusBadge status={interview.result} size="sm" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-muted/40 text-xs text-foreground leading-relaxed">
              {interview.resultMessage || (
                interview.result === 'Selected'
                  ? 'You have successfully passed the interview round! Our team is preparing your offer details.'
                  : 'Thank you for your time. We have decided to move forward with other candidates at this time.'
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default ApplicationDetails;
