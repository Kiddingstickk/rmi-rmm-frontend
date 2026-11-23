
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../../lib/api';
import ResponsiveNavbar from '../../../rmm/components/Navbar/navbar';
import { useAuth } from '../../lib/useAuth';
import { setAuthSession } from '../../lib/authSession';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';
  const { isLoggedIn, logout, isReady } = useAuth();

  useEffect(() => {
    if (isReady && isLoggedIn) {
      navigate(redirectTo, { replace: true });
    }
  }, [isReady, isLoggedIn, navigate, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/rmi/login', {
        email,
        password,
      });

      const token = response.data.token;
      const userId = response.data.user?.id;

      if (!token || !userId) {
        throw new Error('Invalid login response');
      }

      setAuthSession(token, userId);

      alert('Login successful');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#102847]">
      <ResponsiveNavbar
        isLoggedIn={isLoggedIn}
        onLogout={logout}
      />

      <main className="min-h-[calc(100vh-70px)] flex items-center justify-center px-5 py-8 lg:px-10 lg:py-12">

        <div className="w-full max-w-6xl min-h-[650px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl border border-[#e5ebf2] bg-white shadow-[0_20px_70px_rgba(16,40,71,0.09)]">

          
      
        {/* LEFT: BRAND / IMAGE AREA */}
        <section className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-[#102847] p-12 xl:p-16 text-white">

          <img
            src="/login_page_image.jpg"
            alt="Rate My Management"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07172c]/75 via-[#102847]/20 to-[#102847]/25" />

          {/* Brand name */}
          <div className="relative z-10 mt-auto mb-auto">
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight xl:text-6xl 2xl:text-7xl">
              RATE MY
              <br />
              MANAGEMENT
            </h1>

            <p className="mt-5 text-sm font-medium tracking-[0.18em] text-white/85 xl:text-base">
              WHERE WORKPLACE VOICES MATTER.
            </p>
          </div>

        </section>



          {/* RIGHT: LOGIN FORM */}
          <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14 xl:px-20">

            <div className="w-full max-w-md">

              {/* Mobile brand heading */}
              <div className="mb-10 lg:hidden">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#42658a]">
                  Rate My Management
                </p>
              </div>

              <div className="mb-9">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#52749a]">
                  Welcome back
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-[#102847] sm:text-4xl">
                  Sign in to your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#718096]">
                  Continue your journey towards better workplace insights.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#263e5a]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-lg border border-[#d9e2ed] bg-[#f8fafd] px-4 py-3.5 text-sm text-[#102847] outline-none transition placeholder:text-[#9aa9ba] focus:border-[#315d87] focus:bg-white focus:ring-4 focus:ring-[#315d87]/10"
                    required
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#263e5a]"
                    >
                      Password
                    </label>

                    <a
                      href="#"
                      className="text-xs font-medium text-[#315d87] transition hover:text-[#102847] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-[#d9e2ed] bg-[#f8fafd] px-4 py-3.5 text-sm text-[#102847] outline-none transition placeholder:text-[#9aa9ba] focus:border-[#315d87] focus:bg-white focus:ring-4 focus:ring-[#315d87]/10"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#102847] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#1b426b] focus:outline-none focus:ring-4 focus:ring-[#315d87]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>

              </form>

              <div className="mt-8 border-t border-[#e8edf3] pt-7">
                <p className="text-center text-sm text-[#718096]">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    state={location.state}
                    className="font-semibold text-[#234e78] transition hover:text-[#102847] hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              <p className="mt-12 text-center text-xs text-[#9aa8b8]">
                Rate My Management
              </p>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default SignIn;
