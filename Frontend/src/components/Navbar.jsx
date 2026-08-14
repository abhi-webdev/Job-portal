import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            J
          </div>

          <span className="font-bold text-xl">JobMatch</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/jobs'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Jobs
          </Link>

          <Link to="/applications" className='text-sm font-medium transition-colors'>Applications</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
