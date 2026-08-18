import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  CalendarDays,
  FileCheck,
  BarChart3,
  LogOut,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Jobs & Openings',
      path: '/admin/jobs',
      icon: BriefcaseBusiness,
    },
    {
      label: 'Applicants',
      path: '/admin/applicants',
      icon: Users,
    },
    {
      label: 'Interviews',
      path: '/admin/interviews',
      icon: CalendarDays,
    },
    {
      label: 'Job Offers',
      path: '/admin/offers',
      icon: FileCheck,
    },
    {
      label: 'Recruitment Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="hidden lg:flex w-64 min-h-screen border-r border-border bg-card flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Logo Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-sm shadow-primary/30">
            J
          </div>
          <div>
            <h1 className="font-bold text-base leading-none text-foreground">JobMatch</h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-primary">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-4 pb-2">
        <button
          onClick={() => navigate('/admin/jobs/create')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-xs shadow-sm hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Management
        </div>
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            Candidate View
          </span>
        </Link>

        <div className="pt-2 border-t border-border/50 flex items-center justify-between px-2">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email || 'admin@jobmatch.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
