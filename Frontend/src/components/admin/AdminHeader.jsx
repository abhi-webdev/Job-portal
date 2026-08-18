import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';

import ThemeToggle from '../ThemeToggle';

const ROUTE_NAMES = {
  '/admin/dashboard': 'Recruitment Dashboard',
  '/admin/jobs': 'Job Openings & Deadlines',
  '/admin/jobs/create': 'Create New Job Opening',
  '/admin/applicants': 'Applicant Management',
  '/admin/interviews': 'Interview Management',
  '/admin/offers': 'Job Offers & CTC Management',
  '/admin/analytics': 'Recruitment Funnel & Conversion Analytics',
};

const AdminHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentTitle =
    ROUTE_NAMES[location.pathname] ||
    (location.pathname.includes('/edit') ? 'Edit Job Posting' : 'Admin Control Panel');

  return (
    <>
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="font-semibold text-sm sm:text-base text-foreground leading-none">
              {currentTitle}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1 hidden sm:block">
              JobMatch Hiring Pipeline & Candidate Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Portal Home
          </Link>

          <div className="flex items-center gap-2.5 pl-3 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-foreground leading-tight">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Admin
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card z-10 shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div onClick={() => setMobileMenuOpen(false)}>
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
