import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Sparkles,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Calendar,
  Building2,
  Mail,
  ArrowRight,
  IndianRupee,
  PartyPopper,
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/admin/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAdminOffers } from '../../services/api';

const OfferManagement = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all, pending, accepted, rejected

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminOffers();
      setOffers(data.offers || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Fetch offers error:', err);
      setError(err.response?.data?.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const getExpiryInfo = (expiryDate) => {
    if (!expiryDate) return { isExpired: false, text: 'No Expiry' };
    const exp = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { isExpired: true, text: 'Offer Expired' };
    if (diffDays === 0) return { isExpired: false, text: 'Expires Today' };
    return { isExpired: false, text: `${diffDays} days left` };
  };

  const filteredOffers = offers.filter((item) => {
    const matchesSearch =
      item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.offer?.position?.toLowerCase().includes(search.toLowerCase()) ||
      item.job?.company?.toLowerCase().includes(search.toLowerCase());

    const isAccepted = item.offer?.status === 'Accepted' || item.status === 'Offer Accepted';
    const isRejected = item.offer?.status === 'Rejected' || item.status === 'Offer Rejected';
    const isPending = !isAccepted && !isRejected;

    if (filterTab === 'accepted') return matchesSearch && isAccepted;
    if (filterTab === 'rejected') return matchesSearch && isRejected;
    if (filterTab === 'pending') return matchesSearch && isPending;

    return matchesSearch;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Phase 3F · Offer Letters & Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Job Offer & Compensation Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Issue official offer letters, set CTC compensation, and track candidate acceptances.
          </p>
        </div>

        <Button onClick={() => navigate('/admin/applicants')} className="gap-2 shrink-0">
          <Users className="w-4 h-4" />
          View Selected Candidates
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Total Offers Issued</p>
          <p className="text-2xl font-bold text-foreground mt-1">{offers.length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Offers Accepted (Hired 🎉)</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.accepted || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Pending Candidate Response</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.sent || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">Cumulative Offered CTC</p>
          <p className="text-2xl font-bold text-primary mt-1">
            ₹{((stats.totalOfferedSalary || 0) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-card p-4 rounded-xl border border-border space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidate, position, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All Offers ({offers.length})
          </button>
          <button
            onClick={() => setFilterTab('accepted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'accepted' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Accepted / Hired ({stats.accepted || 0})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending Response ({stats.sent || 0})
          </button>
          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              filterTab === 'rejected' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Declined ({stats.rejected || 0})
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <Loading text="Loading job offers..." />
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-xl border border-border p-8">
          <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="font-semibold text-lg text-foreground">No offers found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search || filterTab !== 'all'
              ? 'Try changing your search keywords or filter tab.'
              : 'Issue offer letters to candidates who have passed the interview stage.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.map((app) => {
            const of = app.offer || {};
            const isAccepted = of.status === 'Accepted' || app.status === 'Offer Accepted';
            const isRejected = of.status === 'Rejected' || app.status === 'Offer Rejected';
            const expiry = getExpiryInfo(of.expiryDate);

            return (
              <Card
                key={app._id}
                className={`hover:shadow-md transition-all border flex flex-col justify-between ${
                  isAccepted
                    ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/20'
                    : 'border-border'
                }`}
              >
                <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                  <div>
                    {/* Header: Position & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-primary">
                        {of.position || app.job?.title}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>

                    <h3 className="font-bold text-lg text-foreground line-clamp-1">{app.fullName}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {app.job?.company || 'Company'}
                    </p>

                    {/* Salary & Date Highlights */}
                    <div className="mt-3.5 p-3.5 rounded-xl bg-muted/40 text-xs space-y-2 border border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Offered CTC:</span>
                        <span className="font-bold text-emerald-600 text-sm">
                          ₹{Number(of.salary || 0).toLocaleString('en-IN')} / yr
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Joining Date:</span>
                        <span className="font-semibold text-foreground">
                          {of.joiningDate ? new Date(of.joiningDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/50">
                        <span className="text-muted-foreground">Offer Expiry:</span>
                        <span
                          className={`font-medium ${
                            expiry.isExpired ? 'text-rose-600' : 'text-foreground'
                          }`}
                        >
                          {of.expiryDate ? new Date(of.expiryDate).toLocaleDateString() : 'N/A'}{' '}
                          <span className="text-[10px] text-muted-foreground">({expiry.text})</span>
                        </span>
                      </div>
                    </div>

                    {isAccepted && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-500/10 p-2 rounded-lg">
                        <PartyPopper className="w-4 h-4 shrink-0" /> Candidate accepted offer and is ready to join!
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Issued: {of.createdAt ? new Date(of.createdAt).toLocaleDateString() : 'Recently'}
                    </span>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/admin/applications/${app._id}`)}
                      className="text-xs gap-1"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default OfferManagement;