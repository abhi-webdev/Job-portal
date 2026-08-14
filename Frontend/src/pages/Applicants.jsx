import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import Loading from '../components/Loading';

import { getApplicantsByJob } from '../services/api';

const Applicants = () => {
  const { jobId } = useParams();

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const data = await getApplicantsByJob(jobId);

      setApplications(data.applications || []);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <Loading text="Loading applicants..." />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      {/* Header */}

      <div className="mb-8">
        <Badge className="mb-3">Applicants</Badge>

        <h1 className="text-4xl font-bold">Job Applicants</h1>

        <p className="text-muted-foreground mt-2">
          {applications.length} people have applied for this position.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 text-destructive p-4">
          {error}
        </div>
      )}

      {/* Empty */}

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <div className="text-5xl mb-4">👤</div>

            <h2 className="text-xl font-semibold">No applicants yet</h2>

            <p className="text-muted-foreground mt-2">
              Applicants will appear here when someone applies.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application._id} className="hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  {/* Applicant */}

                  <div>
                    <h2 className="text-xl font-semibold">
                      {application.fullName}
                    </h2>

                    <p className="text-muted-foreground">{application.email}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">{application.location}</Badge>

                      <Badge>{application.status}</Badge>
                    </div>
                  </div>

                  {/* Date */}

                  <div className="text-sm text-muted-foreground">
                    Applied on{' '}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>

                  {/* Details */}

                  <Button
                    onClick={() => navigate(`/applications/${application._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default Applicants;
