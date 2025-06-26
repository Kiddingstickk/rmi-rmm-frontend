// ExampleHomePage.tsx

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
      {/* Hero Section */}
      <section className="relative w-full h-[650px] bg-neutralCanvas overflow-hidden">
        {/* Blobs */}
        <div className="blob top-[-80px] left-[-60px]"></div>
        <div className="blob top-[60%] left-[80%]"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-deepGray animate-fade-up">
            Rate My Interviewer
          </h1>
          <div className="typing-container text-lg md:text-xl text-mutedGray mt-3 max-w-xl">
            Honest, AI-driven feedback for your career growth
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 w-full max-w-md relative space-y-3"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={`Search by ${searchMode}...`}
              className="w-full bg-white text-deepGray border border-professionalBlue px-4 py-3 rounded-lg placeholder:text-mutedGray shadow focus:outline-none focus:ring-2 focus:ring-professionalBlue"
            />
            <Button
              onClick={toggleSearchMode}
              className="w-full bg-professionalBlue text-white hover:bg-blue-700 rounded-md"
            >
              Switch to {searchMode === 'name' ? 'Company' : 'Name'}
            </Button>

            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-mutedGray">
                    <p className="font-medium">Loading...</p>
                    <p className="text-sm text-yellow-600 mt-2">
                      ⚠️ Our backend may take a moment to respond.
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  results.map((i, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/interviewers/${i._id}`)}
                      className="px-4 py-3 hover:bg-blue-100/30 cursor-pointer border-b text-deepGray"
                    >
                      <p className="font-semibold">{i.Name || i.name}</p>
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
          </form>
        </div>
      </section>

      {/* Join Section */}
      <section className="bg-neutralCanvas py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-deepGray mb-3 animate-fade-up">
            Join the RMI Community
          </h2>
          <p className="text-mutedGray mb-10 text-lg">
            Help others and grow your own confidence through shared experience.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
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
                className="bg-white p-6 rounded-lg shadow transition hover:outline hover:outline-2 hover:outline-professionalBlue/30 animate-fade-up"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-20 h-20 mx-auto mb-4"
                />
                <p className="text-lg font-semibold text-deepGray">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button
              onClick={() => navigate('/signin')}
              className="bg-actionYellow text-deepGray hover:bg-yellow-400 rounded-lg font-semibold"
            >
              Sign In to Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deepGray text-neutralCanvas py-6 px-8 flex flex-col md:flex-row items-center justify-between">
        <span className="font-semibold text-xl tracking-wide">
          Rate My Interviewer
        </span>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/contact" className="hover:text-actionYellow">
            Contact Us
          </a>
          <a href="/team" className="hover:text-actionYellow">
            Our Team
          </a>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <img className="w-5 h-5" src="/logo-instagram.svg" alt="Instagram" />
          <img className="w-5 h-5" src="/logo-twitter.svg" alt="Twitter" />
        </div>
      </footer>
    </MainLayout>
  );
};

export default ExampleHomePage;
