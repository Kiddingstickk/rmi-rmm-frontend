import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '../../../rmm/components/Navbar/navbar';
import { useAuth } from '../../lib/useAuth';
import { getInterviewers, Interviewer } from '../../lib/api';

const SearchInterviewer = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'company'>('name');
  const [results, setResults] = useState<Interviewer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const data = await getInterviewers(query, searchMode);
        setResults(data); // ✅ No .results needed — your API returns Interviewer[]
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchMode]);

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/search/${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white mt-[64px] py-40"
        style={{ backgroundImage: "url('/rmibg.avif')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 flex flex-col justify-between items-center text-center px-6 h-full">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              SEARCH INTERVIEWER
            </h1>

            <div className="w-full max-w-md relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleEnterKey}
                type="text"
                placeholder={`Search by ${searchMode}...`}
                className="w-full bg-white/20 text-white px-5 py-3 rounded-t-md backdrop-blur-sm placeholder:text-white/70 focus:outline-none"
              />

              {query && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white text-black shadow-lg z-10 max-h-64 overflow-y-auto rounded-b-md border">
                  {isSearching ? (
                    <div className="p-4 text-sm text-gray-500">Searching...</div>
                  ) : results.length > 0 ? (
                    <>
                      {results.map((person, i) => (
                        <div
                          key={i}
                          onClick={() => navigate(`/interviewers/${person._id}`)}
                          className="px-4 py-3 hover:bg-gray-100 border-b cursor-pointer"
                        >
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm text-gray-500">{person.company || '—'}</p>
                        </div>
                      ))}
                      <div
                        onClick={() => navigate(`/search/${encodeURIComponent(query.trim())}`)}
                        className="px-4 py-3 text-center text-sm font-medium bg-yellow-100 hover:bg-yellow-200 cursor-pointer rounded-b-md"
                      >
                        See full results
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-sm text-gray-500">No matches found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="mt-6">
            <button
              onClick={() =>
                setSearchMode((prev) => (prev === 'name' ? 'company' : 'name'))
              }
              className="text-black bg-pastelYellow hover:bg-yellow-300 font-semibold py-2 px-5 rounded-md text-sm"
            >
              SEARCH BY {searchMode === 'name' ? 'COMPANY' : 'NAME'}
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-500 text-sm py-6">
        100% Anonymous
      </footer>
    </div>
  );
};

export default SearchInterviewer;