import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/ui/MainLayout';
import { getInterviewers } from '../../lib/api';
import { Button } from '../../components/ui/button';

const ExampleHomePage = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState<'name' | 'company'>('name');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    if (searchQuery.trim()) navigate(`/search/${searchQuery}`);
  };

  return (
    <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      {/* Hero */}
      <section className="relative w-full bg-neutralCanvas overflow-hidden px-4 sm:px-6">
        <div className="blob top-[-80px] left-[-60px]" />
        <div className="blob top-[60%] left-[80%]" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col justify-center items-center text-center pt-20 sm:pt-28 pb-16">
          <h1 className="text-3xl sm:text-5xl font-bold text-deepGray animate-fade-up">
            Rate My Interviewer
          </h1>
          <p className="typing-container text-sm sm:text-lg text-mutedGray mt-3 max-w-md">
            Honest, AI-driven feedback for your career growth
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
                className="w-full bg-white text-deepGray border border-professionalBlue px-4 py-3 rounded-lg placeholder:text-mutedGray shadow focus:outline-none focus:ring-2 focus:ring-professionalBlue text-sm sm:text-base"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-auto text-left text-sm">
                  {isSearching ? (
                    <div className="p-4 text-center text-mutedGray">
                      <p className="font-medium">Loading...</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        ⚠️ Backend might take a few seconds.
                      </p>
                    </div>
                  ) : results.length > 0 ? (
                    results.map((i, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(`/interviewers/${i._id}`)}
                        className="px-4 py-3 hover:bg-blue-100/30 cursor-pointer border-b text-deepGray"
                      >
                        <p className="font-medium">{i.Name || i.name}</p>
                        <p className="text-sm text-mutedGray">
                          {i.Company || i.company}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-mutedGray">No matches found</div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={toggleSearchMode}
              className="w-full bg-professionalBlue text-white hover:bg-blue-700 rounded-md text-sm sm:text-base"
            >
              Switch to {searchMode === 'name' ? 'Company' : 'Name'}
            </Button>
          </form>
        </div>
      </section>

      {/* Join */}
      <section className="bg-neutralCanvas py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-deepGray mb-2">
            Join the RMI Community
          </h2>
          <p className="text-mutedGray mb-10 text-sm sm:text-lg">
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
                className="bg-white p-6 rounded-lg shadow hover:shadow-md hover:outline hover:outline-1 hover:outline-professionalBlue/30 transition"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
                />
                <p className="text-base sm:text-lg font-semibold text-deepGray">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button
              onClick={() => navigate('/signin')}
              className="bg-actionYellow text-deepGray hover:bg-yellow-400 rounded-lg font-semibold px-6 py-3 text-sm sm:text-base"
            >
              Sign In to Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deepGray text-neutralCanvas py-6 px-4 sm:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm">
        <span className="font-semibold text-center sm:text-left">
          Rate My Interviewer
        </span>
        <div className="flex gap-6 justify-center sm:justify-start">
          <a href="/contact" className="hover:text-actionYellow">
            Contact Us
          </a>
          <a href="/team" className="hover:text-actionYellow">
            Our Team
          </a>
        </div>
        <div className="flex gap-4 justify-center sm:justify-end">
          <img className="w-5 h-5" src="/logo-instagram.svg" alt="Instagram" />
          <img className="w-5 h-5" src="/logo-twitter.svg" alt="Twitter" />
        </div>
      </footer>
    </MainLayout>
  );
};

export default ExampleHomePage;
