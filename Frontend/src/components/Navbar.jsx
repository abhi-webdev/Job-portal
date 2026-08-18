import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, ShieldCheck, Terminal, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Don't render top public navbar on dedicated admin screens
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-mono font-bold text-sm shadow-sm transition-transform duration-200 group-hover:scale-105">
            &gt;_
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-foreground">JobMatch</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Careers
            </span>
          </div>
        </Link>

        {/* Links & Actions */}
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden sm:flex items-center gap-5 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors py-1 ${
                location.pathname === '/'
                  ? 'text-primary font-semibold border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Careers Home
            </Link>

            <Link
              to="/jobs"
              className={`transition-colors py-1 ${
                location.pathname === '/jobs'
                  ? 'text-primary font-semibold border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Open Roles
            </Link>

            {user && user.role !== 'admin' && (
              <Link
                to="/my-applications"
                className={`transition-colors py-1 ${
                  location.pathname.startsWith('/my-applications')
                    ? 'text-primary font-semibold border-b-2 border-primary -mb-[2px]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                My Applications
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                {user.role === 'admin' ? (
                  <Button
                    onClick={() => navigate('/admin/dashboard')}
                    size="sm"
                    className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Panel
                  </Button>
                ) : null}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="text-xs font-medium gap-1.5"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-xs font-medium"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
