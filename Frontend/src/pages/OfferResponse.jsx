import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { respondToOffer } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Loading from '../components/Loading';

const OfferResponse = () => {
  const { applicationId, response } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    handleResponse();
  }, [applicationId, response]);

  const handleResponse = async () => {
    try {
      setLoading(true);
      setError('');

      const normalized = response?.toLowerCase();
      if (!['accept', 'accepted', 'reject', 'rejected'].includes(normalized)) {
        setError('Invalid offer action. Action must be accept or reject.');
        return;
      }

      const backendResponse =
        normalized === 'accept' || normalized === 'accepted' ? 'Accepted' : 'Rejected';

      const data = await respondToOffer(applicationId, backendResponse);
      setSuccess(data.message || `Offer ${backendResponse.toLowerCase()} successfully`);
    } catch (err) {
      console.error('Offer response error:', err);
      setError(err.response?.data?.message || 'Failed to submit offer response');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Loading text="Recording your response to the offer..." />
      </div>
    );
  }

  const isAccepted =
    response?.toLowerCase() === 'accept' || response?.toLowerCase() === 'accepted';

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {success ? (
          <Card className="shadow-lg border-border text-center">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                {isAccepted ? '🎉' : '✓'}
              </div>

              <h1 className="text-2xl font-bold text-foreground">
                {isAccepted ? 'Offer Accepted!' : 'Offer Declined'}
              </h1>

              <p className="text-sm text-muted-foreground">{success}</p>

              <div className="pt-4 flex flex-col gap-2">
                <Button onClick={() => navigate(`/my-applications/${applicationId}`)} className="gap-1.5">
                  View Application Details <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/my-applications')}>
                  My Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-destructive/30 text-center">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h1 className="text-2xl font-bold text-foreground">Unable to Process Response</h1>

              <p className="text-sm text-destructive">{error}</p>

              <div className="pt-4">
                <Button onClick={() => navigate(`/my-applications/${applicationId}`)} className="w-full">
                  Go to Application Page
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default OfferResponse;
