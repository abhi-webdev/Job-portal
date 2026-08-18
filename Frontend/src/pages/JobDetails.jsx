import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById } from '../services/api';
import Loading from '../components/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobById(jobId);
        setJob(data.job || data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 flex justify-center">
        <Loading text="Loading job opening..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Job opening not found</h2>
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button onClick={() => navigate('/jobs')}>
          Browse All Openings
        </Button>
      </div>
    );
  }

  const isExpired = job.timeline?.applicationDeadline
    ? new Date(job.timeline.applicationDeadline) < new Date(new Date().setHours(0, 0, 0, 0))
    : false;

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 text-xs">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Button>

      <Card className="shadow-lg border-border">
        <CardHeader className="p-6 sm:p-8 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {job.jobType || 'Full Time'}
                </Badge>
                {isExpired ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-200">
                    Deadline Passed
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                    Actively Hiring
                  </span>
                )}
              </div>

              <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                {job.title}
              </CardTitle>

              <p className="text-base text-muted-foreground flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-primary" />
                {job.company}
              </p>
            </div>

            <Button
              size="lg"
              disabled={isExpired}
              onClick={() => navigate(`/apply/${job._id}`)}
              className="text-sm font-semibold min-w-36 self-start sm:self-auto"
            >
              {isExpired ? 'Applications Closed' : 'Apply for this Role'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <MapPin className="w-4 h-4 text-primary mb-1.5" />
              <p className="text-[11px] text-muted-foreground">Location</p>
              <p className="font-semibold text-sm text-foreground">{job.location || 'Remote'}</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <Briefcase className="w-4 h-4 text-primary mb-1.5" />
              <p className="text-[11px] text-muted-foreground">Experience</p>
              <p className="font-semibold text-sm text-foreground">{job.experience || 'Flexible'}</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <IndianRupee className="w-4 h-4 text-primary mb-1.5" />
              <p className="text-[11px] text-muted-foreground">Offered Salary</p>
              <p className="font-semibold text-sm text-foreground">{job.salary || 'Best in Industry'}</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <Clock className="w-4 h-4 text-primary mb-1.5" />
              <p className="text-[11px] text-muted-foreground">Application Deadline</p>
              <p className="font-semibold text-sm text-foreground">
                {job.timeline?.applicationDeadline
                  ? new Date(job.timeline.applicationDeadline).toLocaleDateString()
                  : 'Open'}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Role Description & Responsibilities</h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">Required Skills & Match Criteria</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Application Timeline */}
          {job.timeline && (
            <div className="space-y-3 pt-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Hiring Timeline & Milestones
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {job.timeline.applicationStart && (
                  <div className="p-3 rounded-lg bg-muted/30 border flex justify-between">
                    <span className="text-muted-foreground">Applications Open</span>
                    <span className="font-semibold">{new Date(job.timeline.applicationStart).toLocaleDateString()}</span>
                  </div>
                )}
                {job.timeline.applicationDeadline && (
                  <div className="p-3 rounded-lg bg-muted/30 border flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-semibold text-rose-600">{new Date(job.timeline.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                )}
                {job.timeline.interviewStart && (
                  <div className="p-3 rounded-lg bg-muted/30 border flex justify-between">
                    <span className="text-muted-foreground">Interviews Begin</span>
                    <span className="font-semibold">{new Date(job.timeline.interviewStart).toLocaleDateString()}</span>
                  </div>
                )}
                {job.timeline.resultDate && (
                  <div className="p-3 rounded-lg bg-muted/30 border flex justify-between">
                    <span className="text-muted-foreground">Final Selection Announcement</span>
                    <span className="font-semibold text-emerald-600">{new Date(job.timeline.resultDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default JobDetails;
