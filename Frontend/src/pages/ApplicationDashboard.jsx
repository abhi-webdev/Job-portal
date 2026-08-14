import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import Loading from '../components/Loading';

import { getAllJobs } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ApplicationDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const data = await getAllJobs();

      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || 'Failed to fetch application data',
      );
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = jobs.reduce(
    (total, job) => total + (job.applicationCount || 0),
    0,
  );

  const mostAppliedJob =
    jobs.length > 0
      ? [...jobs].sort(
          (a, b) => (b.applicationCount || 0) - (a.applicationCount || 0),
        )[0]
      : null;

  const maxApplications =
    jobs.length > 0
      ? Math.max(...jobs.map((job) => job.applicationCount || 0))
      : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <Loading text="Loading application statistics..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}

      <section className="container mx-auto px-6 pt-12 pb-8">
        <div className="max-w-3xl">
          <Badge className="mb-4">Application Analytics</Badge>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Application Dashboard
          </h1>

          <p className="mt-4 text-muted-foreground text-lg">
            See how many candidates have applied for each available job role.
          </p>
        </div>
      </section>

      {/* Error */}

      {error && (
        <section className="container mx-auto px-6">
          <div className="rounded-lg bg-destructive/10 text-destructive p-4">
            {error}
          </div>
        </section>
      )}

      {/* Statistics */}

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Jobs */}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Jobs
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">{jobs.length}</p>

              <p className="text-sm text-muted-foreground mt-2">
                Available job roles
              </p>
            </CardContent>
          </Card>

          {/* Total Applications */}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">{totalApplications}</p>

              <p className="text-sm text-muted-foreground mt-2">
                Applications received
              </p>
            </CardContent>
          </Card>

          {/* Most Applied */}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Most Applied Role
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-xl font-bold truncate">
                {mostAppliedJob?.title || 'No applications yet'}
              </p>

              <p className="text-sm text-muted-foreground mt-2">
                {mostAppliedJob
                  ? `${mostAppliedJob.applicationCount || 0} applications`
                  : 'No data'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Application Chart */}

      <section className="container mx-auto px-6 py-10">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle>Applications by Job Role</CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  Compare the number of applications received for each position.
                </p>
              </div>

              <Badge variant="secondary">{totalApplications} Total</Badge>
            </div>
          </CardHeader>

          <CardContent>
            {jobs.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-5xl mb-4">📊</div>

                <h3 className="text-lg font-semibold">No jobs available</h3>

                <p className="text-muted-foreground mt-2">
                  Job application statistics will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-7">
                {[...jobs]
                  .sort(
                    (a, b) =>
                      (b.applicationCount || 0) - (a.applicationCount || 0),
                  )
                  .map((job) => {
                    const applications = job.applicationCount || 0;

                    const percentage =
                      maxApplications === 0
                        ? 0
                        : (applications / maxApplications) * 100;

                    return (
                      <div key={job._id} className="space-y-2">
                        {/* Job Info */}

                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold">{job.title}</h3>

                            <p className="text-sm text-muted-foreground">
                              {job.company}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold">
                                {job.applicationCount || 0}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                Applications
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              onClick={() =>
                                navigate(`/applications/job/${job._id}`)
                              }
                            >
                              View Applicants
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}

                        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        {/* Bottom Info */}

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{job.location}</span>

                          <span>{job.jobType}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ApplicationDashboard;
