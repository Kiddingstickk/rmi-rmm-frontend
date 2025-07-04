import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth'; // ✅ Adjust path based on your RMM structure
import { getManagers } from '../lib/managers';

const SearchManager = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'company'>('name');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) return setResults([]);
      setIsSearching(true);
      try {
        const data = await getManagers(query, searchMode); // 👈 Real manager data
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchMode]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white mt-[64px] py-40"
        style={{ backgroundImage: "url('/rmmbg.png')" }} // Swap if needed
      >
        <div className="absolute inset-0 bg-black/60 z-0" />

        <div className="relative z-10 flex flex-col justify-between items-center text-center px-6 h-full">
          {/* Top Content */}
          <div className="flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            SEARCH MANAGER
          </h1>


            <div className="w-full max-w-md relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder={`Search by ${searchMode}...`}
                className="w-full bg-white/20 text-white px-5 py-3 rounded-t-md backdrop-blur-sm placeholder:text-white/70 focus:outline-none"
              />

              {query && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white text-black shadow-lg z-10 max-h-64 overflow-y-auto rounded-b-md border">
                  {isSearching ? (
                    <div className="p-4 text-sm text-gray-500">Searching...</div>
                  ) : results.length > 0 ? (
                    results.map((person, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/rmm/management/managers/${person._id}`)}
                    className="px-4 py-3 hover:bg-gray-100 border-b cursor-pointer"
                  >
                    <p className="font-medium">{person.Name || person.name}</p>
                    <p className="text-sm text-gray-500">{person.Department || person.company}</p>
                  </div>

                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500">No matches found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Button */}
          <div className="mt-6">
            <button
              onClick={() =>
                setSearchMode((prev) => (prev === 'name' ? 'company' : 'name'))
              }
              className="text-white bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-5 rounded-md text-sm"
            >
              SEARCH BY {searchMode === 'name' ? 'WORKPLACE' : 'NAME'}
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

export default SearchManager;
