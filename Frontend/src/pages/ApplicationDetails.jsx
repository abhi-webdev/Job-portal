import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  getMyApplicationById,
  respondToInterview,
  respondToOffer,
} from '../services/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

const ApplicationDetails = () => {
  const { applicationId } = useParams();

  const navigate = useNavigate();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState('');

  const fetchApplication = async () => {
    try {
      setLoading(true);

      const data = await getMyApplicationById(applicationId);

      setApplication(data.application);
    } catch (error) {
      console.error(error);

      setMessage(error.response?.data?.message || 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const handleInterviewResponse = async (response) => {
    try {
      setActionLoading(true);

      const data = await respondToInterview(applicationId, response);

      setMessage(data.message);

      await fetchApplication();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to respond');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOfferResponse = async (response) => {
    try {
      setActionLoading(true);

      const data = await respondToOffer(applicationId, response);

      setMessage(data.message);

      await fetchApplication();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to respond');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-6 py-20">
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-xl font-bold">Application not found</h2>

            <Button
              className="mt-5"
              onClick={() => navigate('/my-applications')}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const interview = application.interview;

  const offer = application.offer;

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>

          <h1 className="text-4xl font-bold mt-4">Application Details</h1>
        </div>

        {message && (
          <div className="rounded-lg bg-primary/10 p-4">{message}</div>
        )}

        {/* JOB */}

        <Card>
          <CardHeader>
            <CardTitle>{application.job?.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{application.job?.company}</p>

                <p className="text-sm text-muted-foreground">
                  {application.job?.location}
                </p>
              </div>

              <Badge>{application.status}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* TIMELINE */}

        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <Timeline title="Application Submitted" active />

              <Timeline
                title="Current Status"
                active
                status={application.status}
              />

              {interview && <Timeline title="Interview Scheduled" active />}

              {interview?.result && interview.result !== 'Pending' && (
                <Timeline
                  title={`Interview Result: ${interview.result}`}
                  active
                />
              )}

              {offer && <Timeline title="Offer Sent" active />}

              {offer?.response && offer.response !== 'Pending' && (
                <Timeline title={`Offer ${offer.response}`} active />
              )}
            </div>
          </CardContent>
        </Card>

        {/* INTERVIEW */}

        {interview && (
          <Card>
            <CardHeader>
              <CardTitle>Interview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <Info
                label="Date"
                value={
                  interview.interviewDate
                    ? new Date(interview.interviewDate).toLocaleDateString()
                    : ''
                }
              />

              <Info label="Time" value={interview.interviewTime} />

              <Info label="Meeting Link" value={interview.meetingLink} />

              {interview.message && (
                <div className="rounded-lg bg-muted p-4">
                  {interview.message}
                </div>
              )}

              {interview.candidateResponse === 'Pending' && (
                <div className="flex gap-3">
                  <Button
                    disabled={actionLoading}
                    onClick={() => handleInterviewResponse('Accepted')}
                  >
                    Accept Interview
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={actionLoading}
                    onClick={() => handleInterviewResponse('Rejected')}
                  >
                    Reject Interview
                  </Button>
                </div>
              )}

              {interview.candidateResponse !== 'Pending' && (
                <Badge>
                  You {interview.candidateResponse.toLowerCase()} the interview
                </Badge>
              )}
            </CardContent>
          </Card>
        )}

        {/* INTERVIEW RESULT */}

        {interview?.result && interview.result !== 'Pending' && (
          <Card>
            <CardHeader>
              <CardTitle>Interview Result</CardTitle>
            </CardHeader>

            <CardContent>
              <Badge>{interview.result}</Badge>

              {interview.resultMessage && (
                <p className="mt-4 text-muted-foreground">
                  {interview.resultMessage}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* OFFER */}

        {offer && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>🎉 Offer Letter</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <Info label="Salary" value={offer.salary} />

              <Info
                label="Joining Date"
                value={
                  offer.joiningDate
                    ? new Date(offer.joiningDate).toLocaleDateString()
                    : ''
                }
              />

              {offer.message && (
                <div className="rounded-lg bg-muted p-5">{offer.message}</div>
              )}

              {offer.response === 'Pending' && (
                <div className="flex gap-3">
                  <Button
                    disabled={actionLoading}
                    onClick={() => handleOfferResponse('Accepted')}
                  >
                    Accept Offer
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={actionLoading}
                    onClick={() => handleOfferResponse('Rejected')}
                  >
                    Reject Offer
                  </Button>
                </div>
              )}

              {offer.response !== 'Pending' && (
                <div className="rounded-lg bg-muted p-4">
                  You {offer.response.toLowerCase()} this offer.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>

    <p className="font-medium mt-1">{value || 'N/A'}</p>
  </div>
);

const Timeline = ({ title, status, active }) => (
  <div className="flex gap-4">
    <div
      className={`h-3 w-3 rounded-full mt-1 ${
        active ? 'bg-primary' : 'bg-muted'
      }`}
    />

    <div>
      <p className="font-medium">{title}</p>

      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </div>
  </div>
);

export default ApplicationDetails;
