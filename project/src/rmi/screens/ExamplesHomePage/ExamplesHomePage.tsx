import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/ui/MainLayout';
import { getInterviewers } from '../../lib/api';
import { Button } from '../../components/ui/button';
import MinimalLoader from "../../components/ui/AnimatedLoader";

const ExampleHomePage = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState<'name' | 'company'>('name');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const toggleSearchMode = () =>
    setSearchMode((prev) => (prev === 'name' ? 'company' : 'name'));

  const searchInterviewers = async () => {
    if (!searchQuery) return setResults([]);
    setIsSearching(true);
    try {
      const data = await getInterviewers(searchQuery, searchMode);
      setResults(data);
    } catch (err) {
      console.error('Error fetching interviewers:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(searchInterviewers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/search/${searchQuery}`);
    }, 1200);
  };

  return (
    <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      <section className="relative w-full bg-neutralCanvas dark:bg-gray-900 overflow-hidden px-4 sm:px-6">
        <div className="blob top-[-80px] left-[-60px] hidden sm:block" />
        <div className="blob top-[60%] left-[80%] hidden sm:block" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col justify-center items-center text-center pt-20 sm:pt-28 pb-16">
          <h1 className="text-3xl sm:text-5xl font-bold text-deepGray dark:text-white animate-fade-up">
            Rate My Interviewer
          </h1>
          <p className="typing-container text-sm sm:text-lg text-mutedGray dark:text-gray-300 mt-3 max-w-full sm:max-w-xl mx-auto text-center">
            <span className="inline-block">Honest, AI-driven feedback for your career growth</span>
            <span className="blinking-cursor" />
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 w-full max-w-md space-y-3"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={`Search by ${searchMode}...`}
                className="w-full bg-white dark:bg-gray-800 text-deepGray dark:text-white border border-professionalBlue dark:border-gray-600 px-4 py-3 rounded-lg placeholder:text-mutedGray dark:placeholder:text-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-professionalBlue dark:focus:ring-indigo-400 text-sm sm:text-base"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-auto text-left text-sm">
                  {isSearching ? (
                    <div className="p-4 text-center text-mutedGray dark:text-gray-300">
                      <p className="font-medium">Loading...</p>
                      <p className="text-xs text-yellow-600 mt-1">⚠️ Backend might take a few seconds.</p>
                    </div>
                  ) : results.length > 0 ? (
                    results.map((i, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(`/interviewers/${i._id}`)}
                        className="px-4 py-3 hover:bg-blue-100/30 dark:hover:bg-blue-500/20 cursor-pointer border-b border-gray-200 dark:border-gray-700 text-deepGray dark:text-white"
                      >
                        <p className="font-medium">{i.Name || i.name}</p>
                        <p className="text-sm text-mutedGray dark:text-gray-400">
                          {i.Company || i.company}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-mutedGray dark:text-gray-300">No matches found</div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={toggleSearchMode}
              className="w-full bg-professionalBlue dark:bg-indigo-600 text-white hover:bg-blue-700 dark:hover:bg-indigo-500 rounded-md text-sm sm:text-base"
            >
              Switch to {searchMode === 'name' ? 'Company' : 'Name'}
            </Button>
          </form>
        </div>
      </section>

      <section className="bg-neutralCanvas dark:bg-gray-900 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-deepGray dark:text-white mb-2">
            Join the RMI Community
          </h2>
          <p className="text-mutedGray dark:text-gray-300 mb-10 text-sm sm:text-lg">
            Empower others. Shape better interviews.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                label: 'Manage your reviews',
                icon: 'https://cdn-icons-png.flaticon.com/512/3039/3039397.png',
              },
              {
                label: 'Stay anonymous always',
                icon: 'https://cdn-icons-png.flaticon.com/512/2717/2717437.png',
              },
              {
                label: 'Like or Dislike interviews',
                icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md hover:outline hover:outline-1 hover:outline-professionalBlue/30 transition"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 dark:invert"
                />
                <p className="text-base sm:text-lg font-semibold text-deepGray dark:text-white">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button
              onClick={() => navigate('/signin')}
              className="bg-actionYellow dark:bg-yellow-500 text-deepGray dark:text-black hover:bg-yellow-400 rounded-lg font-semibold px-6 py-3 text-sm sm:text-base"
            >
              Sign In to Get Started
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-deepGray dark:bg-gray-950 text-neutralCanvas dark:text-gray-200 py-6 px-4 sm:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm">
        <span className="font-semibold text-center sm:text-left">
          Rate My Interviewer
        </span>
        <div className="flex gap-6 justify-center sm:justify-start">
          <a href="/contact" className="hover:text-actionYellow dark:hover:text-yellow-400">
            Contact Us
          </a>
          <a href="/team" className="hover:text-actionYellow dark:hover:text-yellow-400">
            Our Team
          </a>
        </div>
        <div className="flex gap-4 justify-center sm:justify-end">
          <img className="w-5 h-5 dark:invert" src="/logo-instagram.svg" alt="Instagram" />
          <img className="w-5 h-5 dark:invert" src="/logo-twitter.svg" alt="Twitter" />
        </div>
      </footer>

      {isLoading && <MinimalLoader />}
    </MainLayout>
  );
};

export default ExampleHomePage