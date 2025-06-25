import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/ui/MainLayout';
import { getInterviewers } from '../../lib/api';
import { Button } from '../../components/ui/button';

const ExampleHomePage = (): JSX.Element => {
  // State
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

  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const toggleSearchMode = () => {
    setSearchMode(prev => (prev === 'name' ? 'company' : 'name'));
  };
  const searchInterviewers = async () => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
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
      {/* Hero & Search */}
      <section className="flex flex-col items-center px-6 py-40 w-full bg-neutral-100">
        <div
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.09)',
          }}
          className="w-full h-[600px] relative flex flex-col justify-between"
        >
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center z-10 text-white">
            <h1 className="font-title-hero text-4xl font-bold">Rate My Interviewer</h1>
            <p className="mt-2 text-[#f8f8ff]">Enter your company name to get started</p>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 max-w-md z-10">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={`Search by ${searchMode === 'name' ? 'name' : 'company'}...`}
                className="w-full bg-transparent text-[#f8f8ff] border border-[#f8f8ff] px-4 py-2 rounded placeholder-[#f8f8ff] focus:outline-none focus:ring-2 focus:ring-[#f8f8ff]"
              />

                <Button
                  onClick={toggleSearchMode}
                  className="mt-2 mx-auto block bg-gray-200 text-[#1e1e1e] rounded-lg"
                >
                  Switch to {searchMode === 'name' ? 'Company' : 'Name'}
                </Button>

                {searchQuery && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <div className="text-gray-800 font-medium">Loading...</div>
                        <div className="mt-2 text-sm text-yellow-600 font-semibold">
                          ⚠️ Our backend is hosted on a free tier and may take up to 60 seconds to wake up. Thank you for your patience!
                        </div>
                      </div>
                    ) : results.length > 0 ? (
                      results.map((i, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                          onClick={() => navigate(`/interviewers/${i._id}`)}
                        >
                          <p className="font-semibold text-gray-800">{i.Name || i.name}</p>
                          <p className="text-sm text-gray-600">{i.Company || i.company}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No matches found</div>
                    )}
                  </div>
                )}
            </form>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="w-full bg-[#f0faff] py-12">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Join the RMI Family</h2>
          <p className="text-lg text-gray-600 mb-10">Love RMI? Let's make it official.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Manage Ratings */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3039/3039397.png"
                alt="Manage Ratings"
                className="w-32 h-32 mb-4"
              />
              <p className="text-xl font-semibold">Manage and edit your ratings</p>
            </div>

            {/* Anonymous Ratings */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2717/2717437.png"
                alt="Anonymous"
                className="w-32 h-32 mb-4"
              />
              <p className="text-xl font-semibold mb-4">Your ratings are always anonymous</p>
              <Button
                className="bg-[#9b9b9b] border-[#767676] rounded-lg"
                onClick={() => navigate('/signin')}
              >
                Sign in now
              </Button>
            </div>

            {/* Like/Dislike Ratings */}
            <div className="flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828778.png"
                alt="Like/Dislike"
                className="w-32 h-32 mb-4"
              />
              <p className="text-xl font-semibold">Like or dislike ratings</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">Advertisement</p>
        </div>
      </section>

      {/* Footer with Socials, Contact Us & Team */}
      <footer className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-6 bg-white border-t border-[#d9d9d9]">
        <img
          src="https://images.unsplash.com/photo-1706696951106-b400c3808043?q=80&w=2081"
          alt="Logo"
          className="w-12 h-12 mb-4 md:mb-0"
        />
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </button>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => navigate('/team')}
          >
            Our Team
          </button>
        </div>
        <div className="flex items-center gap-4">
          <img className="w-6 h-6" alt="Instagram" src="/logo-instagram.svg" />
          <img className="w-6 h-6" alt="Twitter" src="/logo-twitter.svg" />
        </div>
      </footer>
    </MainLayout>
  );
};

export default ExampleHomePage;
