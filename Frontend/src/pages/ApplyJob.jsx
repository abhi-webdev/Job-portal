import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { applyForJob } from '../services/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

const ApplyJob = () => {
  const { jobId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const resumeId = location.state?.resumeId;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    coverLetter: '',
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    setSuccess('');

    if (!resumeId) {
      setError(
        'Resume information is missing. Please upload your resume again.',
      );

      return;
    }

    try {
      setLoading(true);

      const data = await applyForJob({
        jobId,

        resumeId,

        ...formData,
      });

      setSuccess(data.message);

      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Apply for Job</h1>

          <p className="text-muted-foreground mt-2">
            Fill in your details to submit your application.
          </p>
        </div>

        {success && (
          <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/30 p-5 text-green-600">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>

              <div>
                <p className="font-semibold">Application Submitted</p>

                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>

                <Input
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>

                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>

                <Input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>

                <Input
                  name="location"
                  placeholder="Bangalore, India"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Letter</label>

                <Textarea
                  name="coverLetter"
                  placeholder="Tell the recruiter why you are interested in this job..."
                  rows={7}
                  value={formData.coverLetter}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ApplyJob;
