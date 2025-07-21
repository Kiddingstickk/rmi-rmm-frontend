import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Manager = {
  _id: string;
  name: string;
  department?: { _id: string; name: string };
  position: string;
  averageRating: number;
};

const calculateRatingColor = (rating: number) => {
  if (rating >= 4) return 'bg-blue-100 text-blue-800';
  if (rating <= 2) return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [results, setResults] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (res.ok) {
          setResults(data.managers || []);
        } else {
          console.error('Search failed:', data.message);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-500 flex items-center justify-between px-8 py-6 shadow-md">
        <img src="/rmmlogo.png" alt="RMI Logo" className="w-12 h-12 rounded-full" />
        <h1 className="text-xl font-bold text-white">MANAGER RESULTS</h1>
      </header>

      <main className="flex-grow px-6 py-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for <span className="text-blue-600">"{query}"</span>
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : results.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <h3 className="text-xl font-semibold">No managers found</h3>
            <img src="/no-results.png" alt="No results" className="mx-auto mt-4 w-64 opacity-60" />
          </div>
        ) : (
          <div className="space-y-5">
            {results.map((manager) => {
              const avg = isFinite(manager.averageRating) ? manager.averageRating : 0;
              const color = calculateRatingColor(avg);

              return (
                <div
                  key={manager._id}
                  onClick={() => navigate(`/rmm/management/managers/${manager._id}`)}
                  className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 cursor-pointer transition"
                >
                  {/* Rating Badge */}
                  <div className={`w-12 h-12 flex items-center justify-center rounded-md font-bold text-sm ${color}`}>
                    {avg.toFixed(1)}
                  </div>

                  {/* Text Info */}
                  <div className="ml-5 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{manager.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                    🏢 {manager.department?.name || '—'} &nbsp;|&nbsp; 👔 {manager.position || '—'}
                    </p>
                  </div>

                  {/* View Button */}
                  <div className="ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/rmm/management/managers/${manager._id}`);
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full font-semibold"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;