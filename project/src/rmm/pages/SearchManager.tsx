import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';
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
        const data = await getManagers(query, searchMode);
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/searchresults?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

      <main>
        {/* ✅ Adjusted Hero Section */}
        <section
          className="relative bg-cover bg-center text-white mt-[64px] pt-16 pb-32 px-6"
          style={{ backgroundImage: "url('/rmmbg.avif')" }}
        >
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div className="relative z-10 flex flex-col justify-between items-center text-center h-full">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">Search Managers</h1>
              <p className="text-lg max-w-3xl mx-auto text-gray-100 mb-10">
                Find and explore anonymous reviews of workplace managers across industries. Search by name or company to discover leadership insights shared by real professionals.
              </p>

              {/* Search Input */}
              <div className="w-full max-w-md relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                            onClick={() => {
                              const slug = person.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                              navigate(`/management/managers/${slug}/${person._id}`);
                            }}
                            className="px-4 py-3 hover:bg-gray-100 border-b cursor-pointer"
                          >
                            <p className="font-medium">{person.Name || person.name}</p>
                            <p className="text-sm text-gray-500">{person.Department || person.company?.name || 'No company assigned'}</p>
                          </div>
                        ))}
                        <div
                          onClick={() => navigate(`/search-managers?q=${encodeURIComponent(query.trim())}`)}
                          className="px-4 py-3 text-center text-sm font-medium bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-b-md"
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
                className="text-white bg-pastelBlue hover:bg-blue-600 font-semibold py-2 px-5 rounded-md text-sm"
              >
                SEARCH BY {searchMode === 'name' ? 'WORKPLACE' : 'NAME'}
              </button>
            </div>
          </div>
        </section>

        {/* ✅ SEO Content Section */}
        <section className="py-16 px-6 max-w-4xl mx-auto text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Why Search for Managers?</h2>
          <p className="text-base leading-relaxed mb-4">
            Leadership plays a critical role in shaping workplace culture, team morale, and career growth. By searching for managers on Rate My Manager, you gain access to real, anonymous feedback from professionals who’ve worked with them.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Whether you're preparing for an interview, considering a job offer, or simply curious about leadership at a company — our search tool helps you make informed decisions. Discover patterns, praise, and concerns shared by others in your industry.
          </p>
          <p className="text-base leading-relaxed">
            Want to contribute your own experience?
            <a href="/rate-manager" className="text-blue-600 hover:underline ml-1">Rate a manager anonymously</a>.
          </p>
        </section>

       {/* ✅ Popular Companies */}
      <section className="py-12 px-6 max-w-6xl mx-auto text-gray-800">
        <h2 className="text-2xl font-bold mb-6">Popular Companies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {['Zomato', 'Swiggy', 'Infosys', 'TCS', 'Reliance Retail', 'HDFC Bank'].map((company) => (
            <a
              key={company}
              href={`/searchresults?q=${encodeURIComponent(company)}`}
              className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-md p-5 transition"
            >
              <h3 className="text-lg font-semibold text-blue-700">{company}</h3>
              <p className="text-sm text-gray-600 mt-1">Explore reviews from employees and candidates.</p>
            </a>
          ))}
        </div>
      </section>

      {/* ✅ Popular Managers */}
      <section className="py-12 px-6 max-w-6xl mx-auto text-gray-800">
        <h2 className="text-2xl font-bold mb-6">Popular Managers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: 'Ravi Kumar', title: 'Operations Head' },
            { name: 'Priya Mehta', title: 'HR Manager' },
            { name: 'John Smith', title: 'Tech Lead' },
            { name: 'Anjali Verma', title: 'Marketing Director' },
            { name: 'Amit Joshi', title: 'Finance Manager' },
            { name: 'Sneha Rao', title: 'Product Manager' },
          ].map((manager) => (
            <a
              key={manager.name}
              href={`/searchresults?q=${encodeURIComponent(manager.name)}`}
              className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-md p-5 transition"
            >
              <h3 className="text-lg font-semibold text-blue-700">{manager.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{manager.title}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ✅ Trending Searches */}
      <section className="py-12 px-6 max-w-6xl mx-auto text-gray-800">
        <h2 className="text-2xl font-bold mb-6">Trending Searches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            'Tech Leads in Bangalore',
            'HR Managers in Hospitality',
            'Startup Founders',
            'Remote Team Managers',
            'Sales Heads in FMCG',
            'Design Leads in SaaS',
          ].map((topic) => (
            <a
              key={topic}
              href={`/searchresults?q=${encodeURIComponent(topic)}`}
              className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-md p-5 transition"
            >
              <h3 className="text-lg font-semibold text-blue-700">{topic}</h3>
              <p className="text-sm text-gray-600 mt-1">See what professionals are saying.</p>
            </a>
          ))}
        </div>
      </section>    

      </main>

      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Rate My Manager</h3>
            <p className="text-sm leading-relaxed">
              Empowering professionals to share honest feedback about workplace leadership. 
              Transparency starts with your voice.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/search-managers" className="hover:underline">Search Managers</a></li>
              <li><a href="/rate-manager" className="hover:underline">Rate a Manager</a></li>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
              <li><a href="/team" className="hover:underline">Our Team</a></li>
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
            <p className="text-sm">Email: support@ratemymanager.com</p>
            <p className="text-sm">Phone: +91 98765 43210</p>
            <p className="text-sm mt-2">© {new Date().getFullYear()} Rate My Manager</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default SearchManager;