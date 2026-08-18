import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  ArrowRight,
  Sparkles,
  Video,
  Building2,
  MapPin,
} from 'lucide-react';

import { getMyApplications } from '../services/api';
import Loading from '../components/Loading';
import StatusBadge from '../components/admin/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyApplications();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 flex justify-center">
        <Loading text="Loading your applications..." />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Career Activity
        </span>
        <h1 className="text-3xl font-bold text-foreground mt-1">My Job Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track interview rounds, respond to job offers, and review application milestones.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center space-y-4">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h2 className="text-xl font-bold text-foreground">No applications submitted yet</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Upload your resume on the homepage to find instant matches, or explore all active openings.
            </p>
            <Button onClick={() => navigate('/jobs')} className="mt-2">
              Browse Open Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const hasInterview = app.interview?.interviewDate && app.status === 'Interview Scheduled';
            const hasOffer = app.offer?.status === 'Sent' && app.status === 'Offer Sent';
            const isHired = app.status === 'Offer Accepted';

            return (
              <Card
                key={app._id}
                className={`hover:shadow-md transition-all border ${
                  hasOffer
                    ? 'border-emerald-400 dark:border-emerald-800 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                    : hasInterview
                    ? 'border-indigo-400 dark:border-indigo-800 bg-indigo-500/5 ring-1 ring-indigo-500/20'
                    : 'border-border'
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg font-bold text-foreground">{app.job?.title || 'Job Opening'}</h2>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                        <span className="flex items-center gap-1 text-foreground">
                          <Building2 className="w-3.5 h-3.5" />
                          {app.job?.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {app.job?.location || app.location}
                        </span>
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/my-applications/${app._id}`)}
                      className="gap-1.5 text-xs self-start sm:self-auto"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Highlights banner if action needed */}
                  {hasOffer && (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        Official Job Offer Received! Review your salary & joining date.
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/my-applications/${app._id}`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3 shrink-0"
                      >
                        Review Offer
                      </Button>
                    </div>
                  )}

                  {hasInterview && (
                    <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-indigo-800 dark:text-indigo-300">
                        <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                        Interview Scheduled for {new Date(app.interview.interviewDate).toLocaleDateString()} at {app.interview.interviewTime}.
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/my-applications/${app._id}`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-3 shrink-0"
                      >
                        Respond
                      </Button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                    <span>Application ID: {app._id.substring(app._id.length - 8)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyApplications;
