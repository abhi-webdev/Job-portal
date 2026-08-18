import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  CheckCircle2,
  Percent,
  Calendar,
  Layers,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRecruitmentAnalytics } from '../../services/api';

const ORANGE_PALETTE = [
  '#F97316',
  '#EA580C',
  '#FB923C',
  '#C2410C',
  '#FDBA74',
  '#71717A',
  '#A1A1AA',
  '#52525B',
];

const FUNNEL_COLORS = [
  '#F97316',
  '#EA580C',
  '#FB923C',
  '#FDBA74',
  '#A1A1AA',
  '#71717A',
  '#F97316',
];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getRecruitmentAnalytics();
      setData(result);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.response?.data?.message || 'Failed to load recruitment analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex justify-center">
          <Loading text="Computing recruitment funnel metrics..." />
        </div>
      </AdminLayout>
    );
  }

  const funnel = data?.funnel || [];
  const conversionRates = data?.conversionRates || {};
  const statusDistribution = data?.statusDistribution || [];
  const jobsAnalytics = data?.jobsAnalytics || [];
  const stats = data?.stats || {};

  const statusChartData = statusDistribution.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const jobsChartData = jobsAnalytics.map((j) => ({
    title: j.title?.length > 16 ? `${j.title.substring(0, 16)}...` : j.title,
    applications: j.applicationsCount,
    hired: j.hiredCount,
  }));

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            Phase 3G · Funnel Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Recruitment Funnel & Conversion Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Analyze candidate flow velocity, stage conversion efficiency, and hiring outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 px-5 py-2.5 rounded-xl border border-primary/20 text-center">
            <p className="text-[10px] font-mono uppercase font-bold text-primary">Overall Conversion</p>
            <p className="text-2xl font-mono font-extrabold text-primary">
              {conversionRates.overallConversionRate || 0}%
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Conversion Rate Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-card p-4 rounded-xl border border-border space-y-1">
          <p className="text-[11px] font-mono text-muted-foreground">APP → SHORTLIST</p>
          <p className="text-xl font-bold text-foreground font-mono">{conversionRates.appToShortlist || 0}%</p>
          <p className="text-[10px] text-muted-foreground">Screening pass rate</p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border space-y-1">
          <p className="text-[11px] font-mono text-muted-foreground">APP → INTERVIEW</p>
          <p className="text-xl font-bold text-foreground font-mono">{conversionRates.appToInterview || 0}%</p>
          <p className="text-[10px] text-muted-foreground">Interview invite rate</p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border space-y-1">
          <p className="text-[11px] font-mono text-muted-foreground">INTERVIEW → SELECT</p>
          <p className="text-xl font-bold text-foreground font-mono">{conversionRates.interviewToSelect || 0}%</p>
          <p className="text-[10px] text-muted-foreground">Interview clear rate</p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border space-y-1">
          <p className="text-[11px] font-mono text-muted-foreground">SELECT → OFFER</p>
          <p className="text-xl font-bold text-foreground font-mono">{conversionRates.selectToOffer || 0}%</p>
          <p className="text-[10px] text-muted-foreground">Offer issue rate</p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border space-y-1">
          <p className="text-[11px] font-mono text-muted-foreground">OFFER ACCEPT</p>
          <p className="text-xl font-bold text-primary font-mono">{conversionRates.offerAcceptanceRate || 0}%</p>
          <p className="text-[10px] text-muted-foreground">Candidate accept rate</p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border space-y-1">
          <p className="text-[11px] font-mono text-primary font-bold">TOTAL HIRED 🎉</p>
          <p className="text-xl font-extrabold text-primary font-mono">{stats.hiredCount || 0}</p>
          <p className="text-[10px] text-muted-foreground">Placements finalized</p>
        </div>
      </div>

      {/* Main Funnel Waterfall Stage Card */}
      <Card className="shadow-xs border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Recruitment Funnel Pipeline
          </CardTitle>
          <CardDescription className="text-xs">
            Volume and drop-off rate of candidates across each hiring milestone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--foreground)',
                  }}
                  formatter={(value) => [value, 'Candidates']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {funnel.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Funnel Dropoff Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-border">
            {funnel.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-muted/50 border border-border text-center space-y-0.5">
                <p className="text-[11px] font-mono text-foreground truncate">{item.stage}</p>
                <p className="text-lg font-bold font-mono text-foreground">{item.count}</p>
                {idx > 0 && (
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Drop: <span className="font-semibold text-primary">{item.dropRate}%</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job-wise Efficiency Comparison */}
        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Applications vs Placements by Role
            </CardTitle>
            <CardDescription className="text-xs">
              Comparing applicant interest with confirmed offer acceptances
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              {jobsChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
                  No job data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="title" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'var(--foreground)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="applications" name="Applications" fill="#71717A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hired" name="Hired / Accepted" fill="#F97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              Candidate Status Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Current distribution of all candidate records across hiring stages
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              {statusChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-mono">
                  No status data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      innerRadius={50}
                      paddingAngle={3}
                    >
                      {statusChartData.map((_, index) => (
                        <Cell key={index} fill={ORANGE_PALETTE[index % ORANGE_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'var(--foreground)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
