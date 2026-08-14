import { useState } from 'react';

import ResumeUpload from '../components/ResumeUpload';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMatchingJobs, applyForJob } from '../services/api';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [matchingJobs, setMatchingJobs] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState('');

  const [applyingJobId, setApplyingJobId] = useState(null);

  const [applicationMessage, setApplicationMessage] = useState('');

  const handleApply = async (jobId) => {
    if (!resume?._id) {
      setApplicationMessage('Please upload your resume first.');
      return;
    }

    try {
      setApplyingJobId(jobId);
      setApplicationMessage('');

      const data = await applyForJob(resume._id, jobId);

      setApplicationMessage(data.message);
    } catch (error) {
      console.error(error);

      setApplicationMessage(
        error.response?.data?.message || 'Failed to apply for job',
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleUploadSuccess = async (uploadedResume) => {
    setResume(uploadedResume);
    setError('');

    try {
      setLoadingJobs(true);

      const data = await getMatchingJobs(uploadedResume._id);

      setMatchingJobs(data.jobs || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || 'Failed to find matching jobs.',
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  const resetSearch = () => {
    setResume(null);
    setMatchingJobs([]);
    setError('');
  };

  const bestScore =
    matchingJobs.length > 0
      ? Math.max(...matchingJobs.map((item) => item.score))
      : 0;

  return (
    <main>
      {/* Hero */}

      <section className="container mx-auto px-6 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-5">AI-powered job matching</Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find Jobs That Match
            <span className="text-primary"> Your Resume</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Upload your resume and discover relevant opportunities based on your
            skills.
          </p>
        </div>
      </section>

      {/* Upload */}

      {!resume && (
        <section className="container mx-auto px-6 pb-20">
          <ResumeUpload onSuccess={handleUploadSuccess} />
        </section>
      )}

      {/* Results */}

      {resume && (
        <section className="container mx-auto px-6 pb-20 space-y-10">
          {/* Resume Summary */}

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Analyzed Resume
                  </p>

                  <h2 className="text-2xl font-bold mt-1">{resume.fileName}</h2>
                </div>

                <Button variant="outline" onClick={resetSearch}>
                  Upload Another
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="rounded-xl bg-muted p-5">
                  <p className="text-sm text-muted-foreground">
                    Skills Detected
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    {resume.keywords?.length || 0}
                  </p>
                </div>

                <div className="rounded-xl bg-muted p-5">
                  <p className="text-sm text-muted-foreground">Matching Jobs</p>

                  <p className="text-3xl font-bold mt-2">
                    {matchingJobs.length}
                  </p>
                </div>

                <div className="rounded-xl bg-muted p-5">
                  <p className="text-sm text-muted-foreground">Best Match</p>

                  <p className="text-3xl font-bold mt-2">{bestScore}%</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-semibold mb-3">Skills detected</p>

                <div className="flex flex-wrap gap-2">
                  {resume.keywords?.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          {/* Loading */}

          {loadingJobs && <Loading text="Finding matching jobs..." />}

          {/* Jobs */}

          {!loadingJobs && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold">Matching Jobs</h2>

                <p className="text-muted-foreground mt-1">
                  Jobs ranked according to your resume.
                </p>
              </div>

              {applicationMessage && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-600">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>

                    <p className="font-medium">{applicationMessage}</p>
                  </div>
                </div>
              )}

              {matchingJobs.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>

                  <h3 className="text-xl font-semibold">
                    No matching jobs found
                  </h3>

                  <p className="text-muted-foreground mt-2">
                    Try uploading a resume with more relevant skills.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {matchingJobs.map((result) => (
                    <JobCard
                      key={result.job._id}
                      result={result}
                      resumeId={resume._id}
                      onApply={handleApply}
                      applyingJobId={applyingJobId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Home;
