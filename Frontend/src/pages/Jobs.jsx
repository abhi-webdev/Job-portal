import { useEffect, useState } from 'react';

import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

import { getAllJobs } from '../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const data = await getAllJobs();

        setJobs(data.jobs || []);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || 'Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">All Jobs</h1>

        <p className="text-muted-foreground mt-2">
          Explore all available job opportunities.
        </p>
      </div>

      {loading && <Loading text="Loading available jobs..." />}

      {error && !loading && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <EmptyState
          title="No jobs available"
          description="There are currently no jobs in the database."
        />
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {jobs.length} jobs available
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} result={job} showMatch={false} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Jobs;
