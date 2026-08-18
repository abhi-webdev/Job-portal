import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const data = await login(formData);

      // Admin user -> redirect to admin dashboard
      if (data.user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Candidate / normal user -> redirect to target from state if available
        const fromPath = location.state?.from?.pathname || '/';
        const fromState = location.state?.from?.state;
        navigate(fromPath, { state: fromState, replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            <LogIn className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-xs">
            Sign in to your JobMatch candidate or administrator account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive p-3 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-10 text-sm"
              />
            </div>

            <Button type="submit" className="w-full h-10 text-sm font-semibold gap-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Don't have an account?{' '}
              <Link
                to="/register"
                state={location.state}
                className="text-primary font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
