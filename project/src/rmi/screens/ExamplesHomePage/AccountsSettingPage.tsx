
import { useEffect, useState, type FormEvent } from 'react';
import {
  UserRound,
  Mail,
  CalendarDays,
  LockKeyhole,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { getValidToken, setAuthSession } from '../../lib/authSession';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AccountSettings = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getValidToken();

        if (!token) {
          throw new Error('Please sign in to access account settings.');
        }

        const response = await fetch(
          `${API_BASE_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load account information.');
        }

        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
        });

        setName(data.name);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while loading your account.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleNameUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name cannot be empty.');
      return;
    }

    if (trimmedName === user?.name) {
      setError('You have not made any changes to your name.');
      return;
    }

    try {
      setSavingName(true);

      const token = getValidToken();

      if (!token) {
        throw new Error('Your session has expired. Please sign in again.');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/user/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: trimmedName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update your name.');
      }

      setAuthSession(data.token, data.user.id);

      setUser((previous) =>
        previous ? { ...previous, name: data.user.name } : previous
      );

      setName(data.user.name);
      setSuccess('Your name has been updated successfully.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Your new password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Your new passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Your new password must be different from your current password.');
      return;
    }

    try {
      setSavingPassword(true);

      const token = getValidToken();

      if (!token) {
        throw new Error('Your session has expired. Please sign in again.');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/user/change-password`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to change your password.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setSuccess('Your password has been changed successfully.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const inputClass =
    'mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#213A6B] focus:ring-2 focus:ring-[#213A6B]/10';

  const passwordInputClass =
    'mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-[#213A6B] focus:ring-2 focus:ring-[#213A6B]/10';

  const renderPasswordInput = (
    label: string,
    value: string,
    setter: (value: string) => void,
    visible: boolean,
    toggle: () => void,
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className={passwordInputClass}
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] px-5 py-14">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-200" />
          <div className="h-64 rounded-xl bg-white border border-gray-200" />
          <div className="h-80 rounded-xl bg-white border border-gray-200" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-5">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center">
          <AlertCircle size={30} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load account settings
          </h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14">

        <div className="mb-9">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#213A6B] uppercase mb-3">
            Account / Settings
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
            Account settings
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage your personal information and account security.
          </p>
        </div>

        {(error || success) && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm ${
              error
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {error ? (
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            )}

            <p>{error || success}</p>
          </div>
        )}

        <div className="space-y-6">

          {/* Personal information */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6 sm:p-8">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-lg bg-[#EEF2F8] flex items-center justify-center">
                  <UserRound size={21} className="text-[#213A6B]" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Personal information
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Update the name associated with your account.
                  </p>
                </div>
              </div>

              <form onSubmit={handleNameUpdate}>
                <div className="max-w-xl">
                  <label className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    maxLength={80}
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={savingName || name.trim() === user.name}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#213A6B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#192F59] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingName && <Loader2 size={16} className="animate-spin" />}
                    {savingName ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>

            </div>
          </section>

          {/* Password and security */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6 sm:p-8">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-lg bg-[#EEF2F8] flex items-center justify-center">
                  <LockKeyhole size={21} className="text-[#213A6B]" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Password & security
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Choose a strong password to keep your account secure.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate}>
                <div className="max-w-xl space-y-5">

                  {renderPasswordInput(
                    'Current password',
                    currentPassword,
                    setCurrentPassword,
                    showCurrentPassword,
                    () => setShowCurrentPassword((value) => !value),
                    'Enter your current password'
                  )}

                  {renderPasswordInput(
                    'New password',
                    newPassword,
                    setNewPassword,
                    showNewPassword,
                    () => setShowNewPassword((value) => !value),
                    'Enter a new password'
                  )}

                  {renderPasswordInput(
                    'Confirm new password',
                    confirmPassword,
                    setConfirmPassword,
                    showConfirmPassword,
                    () => setShowConfirmPassword((value) => !value),
                    'Confirm your new password'
                  )}

                  <p className="text-xs text-gray-500">
                    Your new password must contain at least 8 characters.
                  </p>

                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#213A6B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#192F59] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingPassword && <Loader2 size={16} className="animate-spin" />}
                    {savingPassword ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              </form>

            </div>
          </section>

          {/* Account information */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6 sm:p-8">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-lg bg-[#EEF2F8] flex items-center justify-center">
                  <ShieldCheck size={21} className="text-[#213A6B]" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Account information
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Details associated with your RMM account.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Mail size={16} />
                    <span className="text-xs font-medium">Email address</span>
                  </div>

                  <p className="text-sm font-medium text-gray-900 break-all">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Email address cannot be changed.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <CalendarDays size={16} />
                    <span className="text-xs font-medium">Member since</span>
                  </div>

                  <p className="text-sm font-medium text-gray-900">
                    {formattedDate}
                  </p>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default AccountSettings;
