import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Users,
  FileCheck2,
  Activity,
  CalendarDays,
  Award,
  FileCheck,
  TrendingUp,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loading from '../../components/Loading';
import AdminLayout from '../../layouts/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import ApplicationStatusChart from '../../components/admin/ApplicationStatusChart';
import ApplicationsByJobChart from '../../components/admin/ApplicationsByJobChart';
import RecruitmentFunnel from '../../components/admin/RecruitmentFunnel';
import RecentApplications from '../../components/admin/RecentApplications';
import { getAdminDashboard } from '../../services/api';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex items-center justify-center">
          <Loading text="Loading recruitment analytics..." />
        </div>
      </AdminLayout>
    );
  }

  const stats = dashboard?.stats || {};
  const statusStats = dashboard?.statusStats || [];

  const getStatusCount = (name) => {
    const found = statusStats.find((s) => s._id === name);
    return found ? found.count : 0;
  };

  const hiredCount = getStatusCount('Offer Accepted');
  const interviewsCount = getStatusCount('Interview Scheduled') + getStatusCount('Interview Accepted') + getStatusCount('Interview Completed');
  const offersCount = getStatusCount('Offer Sent') + getStatusCount('Offer Accepted') + getStatusCount('Offer Rejected');
  const shortlistedCount = getStatusCount('Shortlisted');

  return (
    <AdminLayout>
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Phase 3A · Executive Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Recruitment Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor real-time hiring velocity, candidate stages, and active pipeline metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/admin/jobs/create')} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Create Job
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/analytics')} className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Funnel Analytics
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive p-4 text-sm">
          {error}
        </div>
      )}

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Positions"
          value={stats.totalJobs || 0}
          description="Job openings posted"
          icon={BriefcaseBusiness}
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications || 0}
          description="Candidate submissions"
          icon={FileCheck2}
        />
        <StatCard
          title="Interviews Conducted"
          value={interviewsCount}
          description="Scheduled / Completed"
          icon={CalendarDays}
        />
        <StatCard
          title="Candidates Hired"
          value={hiredCount}
          description="Accepted job offers 🎉"
          icon={Award}
        />
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Shortlisted</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{shortlistedCount}</p>
          </div>
          <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
            SL
          </span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Offers Sent</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{offersCount}</p>
          </div>
          <span className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-xs">
            OS
          </span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Unique Candidates</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{stats.totalApplicants || 0}</p>
          </div>
          <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
            UC
          </span>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Active Jobs</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{stats.activeJobs || 0}</p>
          </div>
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            AJ
          </span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Application Status Distribution</CardTitle>
              <CardDescription className="text-xs">Breakdown of candidates across recruitment stages</CardDescription>
            </div>
            <Link to="/admin/applicants" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            <ApplicationStatusChart data={statusStats} />
          </CardContent>
        </Card>

        {/* Applications by Job */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Applications by Job Role</CardTitle>
              <CardDescription className="text-xs">Top positions receiving candidate applications</CardDescription>
            </div>
            <Link to="/admin/jobs" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Manage Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            <ApplicationsByJobChart data={dashboard?.applicationsByJob || []} />
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Pipeline & Funnel Progress */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">Recruitment Pipeline Funnel</CardTitle>
            <CardDescription className="text-xs">Candidate progression from submission to offer acceptance</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/analytics')}>
            Deep Funnel Report
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <RecruitmentFunnel statusStats={statusStats} />
        </CardContent>
      </Card>

      {/* Recent Applications Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Candidate Applications</CardTitle>
            <CardDescription className="text-xs">Latest submissions requiring review or action</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/applicants')}>
            View All Applicants
          </Button>
        </CardHeader>
        <CardContent>
          <RecentApplications applications={dashboard?.recentApplications || []} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
