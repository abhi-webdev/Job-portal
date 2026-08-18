import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Compass,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Users2,
  Zap,
  CheckCircle2,
  Clock,
  Building2,
  ChevronRight,
  FileText,
  Send,
  Calendar,
  Award,
  PartyPopper,
  Shield,
  Layers,
  Terminal,
  HeartHandshake,
  Coffee,
  Laptop,
  Flame,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getAllJobs, getMatchingJobs, getMyApplications } from '../services/api';
import ResumeUpload from '../components/ResumeUpload';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const POPULAR_LOCATIONS = [
  'Bangalore',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Hyderabad',
  'Bhopal',
  'Indore',
  'Remote',
];

const HIRING_STEPS = [
  {
    step: '01',
    title: 'Explore Opportunities',
    desc: 'Browse verified openings or let our keyword matcher rank jobs based on your skills.',
    icon: Compass,
  },
  {
    step: '02',
    title: 'Submit Application',
    desc: 'Apply directly in 2 minutes with your resume, portfolio, and contact info.',
    icon: Send,
  },
  {
    step: '03',
    title: 'Interview & Discuss',
    desc: 'Engage with our technical team in collaborative coding and architecture sessions.',
    icon: Calendar,
  },
  {
    step: '04',
    title: 'Selection & Offer',
    desc: 'Receive your formal offer letter with competitive CTC, joining date, and perks.',
    icon: Award,
  },
  {
    step: '05',
    title: 'Join Our Team',
    desc: 'Complete seamless digital onboarding and start building impactful products.',
    icon: PartyPopper,
  },
];

const WHY_JOIN_US = [
  {
    title: 'Rapid Career Growth',
    desc: 'Transparent leveling tracks, merit-based advancement, and direct mentorship from industry leaders.',
    icon: TrendingUp,
  },
  {
    title: 'Continuous Learning',
    desc: 'Annual education allowances, technical conference tickets, and dedicated innovation hack days.',
    icon: GraduationCap,
  },
  {
    title: 'High-Trust Culture',
    desc: 'Autonomy, zero micromanagement, flexible working hours, and psychologically safe team environments.',
    icon: Users2,
  },
  {
    title: 'Impactful Engineering',
    desc: 'Build high-scale systems and mission-critical cloud software relied upon by millions.',
    icon: Zap,
  },
];

const LIFE_PERKS = [
  {
    title: 'Work Flexibility',
    desc: 'Remote-friendly policies and modern collaborative engineering hubs.',
    icon: Laptop,
  },
  {
    title: 'Comprehensive Healthcare',
    desc: 'Full medical, dental, and mental wellness coverage for you and your family.',
    icon: Shield,
  },
  {
    title: 'Workstation Stipend',
    desc: 'Top-of-the-line MacBook Pro, 4K monitors, and ergonomic setup allowance.',
    icon: Coffee,
  },
  {
    title: 'Team Offsites & Culture',
    desc: 'Quarterly team retreats, hackathons, open source contributions, and game nights.',
    icon: HeartHandshake,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [userCity, setUserCity] = useState('');

  // Jobs State
  const [allJobs, setAllJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState('');

  // Candidate Tracker & Applications State (if logged in)
  const [userApplications, setUserApplications] = useState([]);

  // Resume Match State
  const [resume, setResume] = useState(null);
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [loadingMatching, setLoadingMatching] = useState(false);
  const [matchError, setMatchError] = useState('');

  const resumeSectionRef = useRef(null);
  const positionsSectionRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoadingJobs(true);
      const jobsRes = await getAllJobs();
      setAllJobs(jobsRes.jobs || []);

      if (user && user.role !== 'admin') {
        const appsRes = await getMyApplications().catch(() => ({ applications: [] }));
        setUserApplications(appsRes.applications || []);
      }
    } catch (err) {
      console.error('Fetch home data error:', err);
      setJobsError('Failed to load job openings. Please refresh.');
    } finally {
      setLoadingJobs(false);
    }
  };

  // Browser Geolocation Detection
  const handleUseMyLocation = () => {
    setLocationMessage('');
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser. Please select manually.');
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

          setSearchLocation(city);
          setUserCity(city);
          setLocationMessage(`📍 Detected location: ${city}`);
        } catch (err) {
          console.warn('Reverse geocode error, using fallback:', err);
          setSearchLocation('Bangalore');
          setUserCity('Bangalore');
          setLocationMessage('📍 Approximate location set to Bangalore');
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err);
        setDetectingLocation(false);
        setLocationMessage(
          'Unable to detect your location. Please select your location manually.',
        );
      },
      { timeout: 8000 },
    );
  };

  // Submit Main Search
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set('search', searchTerm.trim());
    if (searchLocation.trim()) query.set('location', searchLocation.trim());
    navigate(`/jobs?${query.toString()}`);
  };

  // Handle Resume Upload & Matching
  const handleResumeSuccess = async (uploadedResume) => {
    setResume(uploadedResume);
    setMatchError('');

    try {
      setLoadingMatching(true);
      const data = await getMatchingJobs(uploadedResume._id);
      setMatchingJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setMatchError(err.response?.data?.message || 'Failed to match jobs for this resume.');
    } finally {
      setLoadingMatching(false);
    }
  };

  const resetResumeSearch = () => {
    setResume(null);
    setMatchingJobs([]);
    setMatchError('');
  };

  // Filter Jobs Near You
  const activeLocationForNearYou = userCity || searchLocation;
  const jobsNearYou = activeLocationForNearYou
    ? allJobs.filter((job) =>
        job.location?.toLowerCase().includes(activeLocationForNearYou.toLowerCase()),
      )
    : [];

  // ONLY show the 4 most recently launched jobs on the career page
  const recentlyLaunchedJobs = allJobs.slice(0, 4);

  return (
    <main className="min-h-screen bg-background text-foreground space-y-16 sm:space-y-24 pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & JOB SEARCH */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 border-b border-border/60 bg-gradient-to-b from-card/60 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center space-y-6">
          {/* Company Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Careers Portal · We Are Actively Hiring</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
            Build Your Career <br className="hidden sm:inline" />
            <span className="text-primary underline decoration-primary/30 underline-offset-8">
              With Us
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover opportunities, grow your engineering skills, and build the future with our high-impact team.
          </p>

          {/* Unified Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-3 sm:p-4 rounded-2xl bg-card border border-border shadow-md max-w-4xl mx-auto space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Keyword / Role Input */}
              <div className="relative md:col-span-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or skill (e.g. Frontend, React, Go)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Location Input */}
              <div className="relative md:col-span-4">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  placeholder="Location (e.g. Bangalore, Mumbai, Remote)..."
                  value={searchLocation}
                  onChange={(e) => {
                    setSearchLocation(e.target.value);
                    if (e.target.value) setUserCity(e.target.value);
                  }}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl text-sm gap-1.5 shadow-xs"
                >
                  <Search className="w-4 h-4" /> Search Jobs
                </Button>
              </div>
            </div>

            {/* Geolocation Button & Location Notice */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 px-1 text-xs">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={detectingLocation}
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium transition-colors"
              >
                <Compass className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin' : ''}`} />
                {detectingLocation ? 'Detecting your city...' : 'Use my location'}
              </button>

              {locationMessage && (
                <span className="text-[11px] text-muted-foreground italic">
                  {locationMessage}
                </span>
              )}
            </div>
          </form>

          {/* Quick Location Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            <span className="text-xs text-muted-foreground font-mono mr-1">Popular Hubs:</span>
            {POPULAR_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSearchLocation(loc);
                  setUserCity(loc);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  searchLocation.toLowerCase() === loc.toLowerCase()
                    ? 'bg-primary text-primary-foreground font-semibold border-primary'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZED CANDIDATE DASHBOARD SNAPSHOT (For Logged In Users) */}
      {/* ========================================================================= */}
      {user && user.role !== 'admin' && (
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Card className="bg-card border-border shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-lg font-bold text-foreground">
                    Welcome back, {user.name} 👋
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  You have <span className="font-semibold text-foreground">{userApplications.length} active application(s)</span> in our pipeline. Track your stages, interview meeting links, and formal offer letters.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/my-applications')}
                  className="text-xs font-semibold h-9 px-4 w-full md:w-auto"
                >
                  Track Applications ({userApplications.length})
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="text-xs font-semibold h-9 px-4 bg-primary hover:bg-primary-hover text-primary-foreground shrink-0"
                >
                  View Profile Hub
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. JOBS NEAR YOU (LOCATION-BASED DISCOVERY) */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location-Based Matching</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {activeLocationForNearYou
                ? `Opportunities in ${activeLocationForNearYou}`
                : 'Jobs Near You'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {activeLocationForNearYou
                ? `Showing active engineering openings located in or around ${activeLocationForNearYou}`
                : 'Select your city or use geolocation to discover nearby engineering roles.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!activeLocationForNearYou ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseMyLocation}
                className="text-xs gap-1.5 h-8 border-border"
              >
                <Compass className="w-3.5 h-3.5 text-primary" /> Select Location
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUserCity('');
                  setSearchLocation('');
                }}
                className="text-xs text-muted-foreground hover:text-foreground h-8"
              >
                Clear Location
              </Button>
            )}
          </div>
        </div>

        {/* Jobs Near You Grid */}
        {activeLocationForNearYou && jobsNearYou.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobsNearYou.map((job) => (
              <JobCard key={job._id} result={job} showMatch={false} />
            ))}
          </div>
        ) : activeLocationForNearYou && jobsNearYou.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-3">
            <Building2 className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
            <h3 className="text-base font-bold text-foreground">
              No specific openings currently listed in {activeLocationForNearYou}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              We frequently hire for Remote roles and across other main engineering hubs. Explore all open positions below!
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => positionsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs"
            >
              Browse Recent Openings
            </Button>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-4">
            <Compass className="w-10 h-10 mx-auto text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                Find opportunities near your location
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Quickly locate openings in your city or pick from our primary technology centers.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setUserCity(loc);
                    setSearchLocation(loc);
                  }}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary border border-border transition-colors"
                >
                  📍 {loc}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. RECENTLY LAUNCHED ROLES (EXACTLY 4 RECENT JOBS ON CAREER PAGE) */}
      {/* ========================================================================= */}
      <section ref={positionsSectionRef} className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Latest 4 Openings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Recently Launched Roles
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              The 4 newest engineering and product positions opened by our team. All {allJobs.length} openings are available in Open Roles.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/jobs')}
            className="text-xs font-semibold gap-1 self-start sm:self-auto h-9"
          >
            All Open Roles ({allJobs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {loadingJobs ? (
          <div className="py-20 flex justify-center">
            <Loading text="Loading recently launched openings..." />
          </div>
        ) : jobsError ? (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {jobsError}
          </div>
        ) : recentlyLaunchedJobs.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card border border-border text-center text-muted-foreground text-xs font-mono">
            No openings published yet. Check back shortly.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recentlyLaunchedJobs.map((job) => (
                <JobCard key={job._id} result={job} showMatch={false} />
              ))}
            </div>

            {/* Prominent Link to Open Roles */}
            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                Looking for more roles in other engineering disciplines, locations, or experience levels?
              </p>
              <Button
                onClick={() => navigate('/jobs')}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs h-10 px-6 rounded-xl gap-2 shadow-xs"
              >
                Explore All {allJobs.length} Open Roles <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. AI RESUME MATCHING ENGINE (EXISTING FEATURE PRESERVED) */}
      {/* ========================================================================= */}
      <section ref={resumeSectionRef} className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Matching Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Find Your Best-Fit Role
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Upload your resume in PDF format. Our algorithm extracts your tech stack and ranks our openings by relevance score.
          </p>
        </div>

        {!resume ? (
          <ResumeUpload onSuccess={handleResumeSuccess} />
        ) : (
          <div className="space-y-6">
            {/* Parsed Summary Card */}
            <Card className="bg-card border-border shadow-xs rounded-2xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">
                      Analyzed Document
                    </span>
                    <h3 className="text-xl font-bold text-foreground">{resume.fileName}</h3>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetResumeSearch}
                    className="text-xs self-start sm:self-auto"
                  >
                    Upload Another
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                    <p className="text-[10px] font-mono text-muted-foreground">SKILLS DETECTED</p>
                    <p className="text-2xl font-bold font-mono text-foreground mt-0.5">
                      {resume.keywords?.length || 0}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                    <p className="text-[10px] font-mono text-muted-foreground">MATCHED ROLES</p>
                    <p className="text-2xl font-bold font-mono text-foreground mt-0.5">
                      {matchingJobs.length}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-[10px] font-mono text-primary font-bold">TOP MATCH SCORE</p>
                    <p className="text-2xl font-bold font-mono text-primary mt-0.5">
                      {matchingJobs.length > 0
                        ? Math.max(...matchingJobs.map((item) => item.score))
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                {resume.keywords && resume.keywords.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-mono font-bold text-foreground">
                      Extracted Technical Skills:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.keywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-muted text-foreground border border-border"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {loadingMatching ? (
              <div className="py-16 flex justify-center">
                <Loading text="Ranking company openings against your resume..." />
              </div>
            ) : matchError ? (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {matchError}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Ranked Job Matches ({matchingJobs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {matchingJobs.map((result) => (
                    <JobCard
                      key={result.job._id}
                      result={result}
                      resumeId={resume._id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY JOIN US? (COMPANY VALUE PROPOSITIONS) */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Company Culture & Growth</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Why Build Your Career With Us?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We foster an engineering-first culture where ambitious builders solve challenging problems and own their outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_JOIN_US.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all duration-200 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground leading-snug">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. OUR HIRING PROCESS (5-STEP ROADMAP) */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clear & Transparent</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Our Hiring Process
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We value your time with a swift, transparent, and structured recruitment experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {HIRING_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {step.step}
                  </span>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-sm text-foreground leading-tight">{step.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. LIFE AT OUR COMPANY */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
            <Coffee className="w-3.5 h-3.5" />
            <span>Benefits & Environment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Life At Our Company
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We equip our team with industry-leading benefits, flexibility, and equipment to do your best work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LIFE_PERKS.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-200 space-y-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-foreground">{perk.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. READY TO BUILD YOUR CAREER? (BOTTOM CTA BANNER) */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-md text-center space-y-5 relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ready to build your career with us?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Explore our current open positions or upload your resume for immediate skills match ranking.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/jobs')}
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm h-11 px-6 rounded-xl gap-2 shadow-xs"
            >
              <Briefcase className="w-4 h-4" /> Explore All Open Roles
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => resumeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="font-semibold text-sm h-11 px-6 rounded-xl gap-2 border-border"
            >
              <Sparkles className="w-4 h-4 text-primary" /> Upload Resume for Match
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
