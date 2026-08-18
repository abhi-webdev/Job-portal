import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAllJobs } from '../services/api';
import {
  Search,
  MapPin,
  Briefcase,
  Compass,
  Filter,
  Terminal,
  X,
  Sparkles,
  Building2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const JOB_TYPES = ['All Types', 'Full Time', 'Remote', 'Contract', 'Internship'];
const EXP_LEVELS = ['All Experience', '0-2 Years', '2-5 Years', '5+ Years'];
const POPULAR_CITIES = [
  'All Locations',
  'Bangalore',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Hyderabad',
  'Bhopal',
  'Indore',
  'Remote',
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedExp, setSelectedExp] = useState('All Experience');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationNotice, setLocationNotice] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch job openings.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    setLocationNotice('');
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation not supported by browser.');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.state ||
            'Bangalore';

          setLocation(city);
          setLocationNotice(`📍 Detected: ${city}`);
        } catch {
          setLocation('Bangalore');
          setLocationNotice('📍 Set to Bangalore');
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        setLocationNotice('Unable to detect your location. Please select your location manually.');
      },
      { timeout: 8000 },
    );
  };

  const clearAllFilters = () => {
    setSearch('');
    setLocation('');
    setSelectedType('All Types');
    setSelectedExp('All Experience');
    setLocationNotice('');
    setSearchParams({});
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title?.toLowerCase() || '';
    const desc = job.description?.toLowerCase() || '';
    const comp = job.company?.toLowerCase() || '';
    const loc = job.location?.toLowerCase() || '';
    const type = job.jobType?.toLowerCase() || '';
    const exp = job.experience?.toLowerCase() || '';
    const skills = job.skills?.map((s) => s.toLowerCase()) || [];

    // Search filter
    const matchesSearch =
      !search.trim() ||
      title.includes(search.toLowerCase().trim()) ||
      desc.includes(search.toLowerCase().trim()) ||
      comp.includes(search.toLowerCase().trim()) ||
      loc.includes(search.toLowerCase().trim()) ||
      skills.some((s) => s.includes(search.toLowerCase().trim()));

    // Location filter
    const matchesLocation =
      !location.trim() ||
      location === 'All Locations' ||
      loc.includes(location.toLowerCase().trim());

    // Type filter
    const matchesType =
      selectedType === 'All Types' ||
      type.includes(selectedType.toLowerCase().trim());

    // Experience filter
    const matchesExp =
      selectedExp === 'All Experience' ||
      exp.includes(selectedExp.toLowerCase().replace(' years', '').trim());

    return matchesSearch && matchesLocation && matchesType && matchesExp;
  });

  const hasActiveFilters =
    search.trim() !== '' ||
    location.trim() !== '' ||
    selectedType !== 'All Types' ||
    selectedExp !== 'All Experience';

  return (
    <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
          <Building2 className="w-3.5 h-3.5" />
          <span>Official Company Careers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Current Open Positions
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Search and filter verified engineering, infrastructure, and product opportunities across all locations.
        </p>
      </div>

      {/* Multi-Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
        {/* Search and Location inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by role, stack (React, Node, Go...), or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-background border-border text-sm"
            />
          </div>

          {/* Location Search */}
          <div className="relative md:col-span-4">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <Input
              placeholder="Filter by location (e.g. Bangalore, Mumbai)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-11 bg-background border-border text-sm"
            />
          </div>

          {/* Use My Location Button */}
          <div className="md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUseMyLocation}
              disabled={detectingLocation}
              className="w-full h-11 text-xs gap-1.5 border-border font-medium"
            >
              <Compass className={`w-3.5 h-3.5 text-primary ${detectingLocation ? 'animate-spin' : ''}`} />
              {detectingLocation ? 'Detecting...' : 'Near Me'}
            </Button>
          </div>
        </div>

        {locationNotice && (
          <p className="text-xs text-muted-foreground italic px-1">
            {locationNotice}
          </p>
        )}

        {/* Quick City Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs font-mono text-muted-foreground mr-1 shrink-0">City:</span>
          {POPULAR_CITIES.map((city) => {
            const isSelected =
              (city === 'All Locations' && !location) ||
              location.toLowerCase() === city.toLowerCase();

            return (
              <button
                key={city}
                onClick={() => setLocation(city === 'All Locations' ? '' : city)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row (Job Type & Experience) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/80">
          <div className="flex flex-wrap items-center gap-3">
            {/* Job Type */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-mono">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground cursor-pointer focus:ring-1 focus:ring-primary"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-mono">Experience:</span>
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground cursor-pointer focus:ring-1 focus:ring-primary"
              >
                {EXP_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>SHOWING {filteredJobs.length} OPEN POSITIONS</span>
        {hasActiveFilters && (
          <span className="text-primary font-semibold">FILTERS ACTIVE</span>
        )}
      </div>

      {loading && (
        <div className="py-20 flex justify-center">
          <Loading text="Filtering company openings..." />
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <EmptyState
          title="No positions match your search criteria"
          description="Try broadening your location or skill keywords, or click 'Clear All Filters'."
        />
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} result={job} showMatch={false} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Jobs;
