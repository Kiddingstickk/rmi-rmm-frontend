
import { useEffect, useState } from 'react';
import {
  UserRound,
  Mail,
  CalendarDays,
  FileText,
  Coins,
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  totalReviews: number;
  tokens: number;
  createdAt: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please sign in to view your profile.');
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Unable to load your profile. Please try again.');
        }

        const data = await res.json();

        setUser({
          _id: data.id,
          name: data.name,
          email: data.email,
          totalReviews: data.totalReviews,
          tokens: data.tokens,
          createdAt: data.createdAt,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while loading your profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] px-6 py-16">
        <div className="max-w-6xl mx-auto animate-pulse space-y-8">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 bg-white border rounded-xl" />
            <div className="h-72 bg-white border rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load profile
          </h2>
          <p className="text-sm text-gray-500">
            {error || 'Your profile information could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14">

        {/* Page heading */}
        <div className="mb-9">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#213A6B] uppercase mb-3">
            Account / Profile
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
            Your profile
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            View your personal information and activity on Rate My Management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Personal information */}
          <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm">

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-[#EEF2F8] flex items-center justify-center shrink-0">
                  <UserRound size={25} className="text-[#213A6B]" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    RMM Member
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-7">
                <h3 className="text-sm font-semibold text-gray-900 mb-6">
                  Personal information
                </h3>

                <div className="space-y-6">

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <UserRound size={17} className="text-gray-500" />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Mail size={17} className="text-gray-500" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Email address</p>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <CalendarDays size={17} className="text-gray-500" />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Member since</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* Activity and statistics */}
          <aside className="space-y-6">

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-5">
                Your activity
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#EEF2F8] flex items-center justify-center">
                  <FileText size={20} className="text-[#213A6B]" />
                </div>

                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {user.totalReviews}
                  </p>
                  <p className="text-xs text-gray-500">
                    Reviews submitted
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 my-5" />

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#EEF2F8] flex items-center justify-center">
                  <Coins size={20} className="text-[#213A6B]" />
                </div>

                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {user.tokens}
                  </p>
                  <p className="text-xs text-gray-500">
                    Tokens earned
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-[#213A6B] rounded-xl p-6 text-white">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                Rate My Management
              </p>

              <h3 className="text-lg font-semibold mb-2">
                Your voice matters.
              </h3>

              <p className="text-sm text-white/75 leading-relaxed">
                Share your workplace experiences and help others make informed career decisions.
              </p>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
};

export default Profile;
