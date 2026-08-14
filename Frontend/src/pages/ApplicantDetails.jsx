import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import Loading from '../components/Loading';

import { getApplicationById } from '../services/api';

const ApplicantDetails = () => {
  const { applicationId } = useParams();

  const navigate = useNavigate();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);

      const data = await getApplicationById(applicationId);

      setApplication(data.application);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || 'Failed to fetch applicant');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <Loading text="Loading applicant details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="rounded-lg bg-destructive/10 text-destructive p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back */}

        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          ← Back
        </Button>

        {/* Header */}

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h1 className="text-3xl font-bold">{application.fullName}</h1>

                <p className="text-muted-foreground mt-1">
                  {application.email}
                </p>
              </div>

              <Badge className="w-fit">{application.status}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>

                <p className="font-medium mt-1">{application.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>

                <p className="font-medium mt-1">{application.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone</p>

                <p className="font-medium mt-1">{application.phone}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Location</p>

                <p className="font-medium mt-1">{application.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job */}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Applied For</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-xl font-semibold">{application.job?.title}</h2>

            <p className="text-muted-foreground">{application.job?.company}</p>
          </CardContent>
        </Card>

        {/* Cover Letter */}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
              {application.coverLetter}
            </p>
          </CardContent>
        </Card>

        {/* Resume */}

        {application.resume && (
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{application.resume.fileName}</p>

                  <p className="text-sm text-muted-foreground">
                    Candidate Resume
                  </p>
                </div>

                <Button
                  onClick={() =>
                    window.open(
                      `http://localhost:3000/${application.resume.filePath}`,
                      '_blank',
                    )
                  }
                >
                  View Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default ApplicantDetails;
