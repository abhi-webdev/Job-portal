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
import { UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const data = await register(formData);

      setSuccess('Account created successfully! Redirecting...');

      setTimeout(() => {
        const fromPath = location.state?.from?.pathname || '/';
        const fromState = location.state?.from?.state;
        navigate(fromPath, { state: fromState, replace: true });
      }, 800);
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Create Candidate Account</CardTitle>
          <CardDescription className="text-xs">
            Join JobMatch to track your applications, interviews, and job offers
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive p-3 text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 p-3 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input
                name="name"
                placeholder="e.g. Abhimanyu Kumar"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-10 text-sm"
              />
            </div>

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
                minLength={6}
                required
                className="h-10 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">Must be at least 6 characters</p>
            </div>

            <Button type="submit" className="w-full h-10 text-sm font-semibold gap-2" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register & Continue'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link
                to="/login"
                state={location.state}
                className="text-primary font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Register;
