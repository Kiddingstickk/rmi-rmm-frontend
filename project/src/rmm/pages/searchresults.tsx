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
    <main className="min-h-screen bg-white text-gray-800 px-6 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-center">
        <img src="/rmmlogo.png" alt="RMI Logo" className="mx-auto w-14 h-14 rounded-full mb-4" />
        <h1 className="text-3xl font-bold">Search Results for “{query}”</h1>
        <p className="text-sm text-gray-600 mt-2">
          Discover anonymous feedback on managers across industries. Transparent, honest, and community-driven.
        </p>
      </header>

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : results.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <h3 className="text-xl font-semibold">No managers found</h3>
          <img src="/no-results.png" alt="No results" className="mx-auto mt-4 w-64 opacity-60" />
          <p className="mt-4 text-sm">Try a different name or department.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((manager) => {
            const avg = isFinite(manager.averageRating) ? manager.averageRating : 0;
            const color = calculateRatingColor(avg);

            return (
              <article
                key={manager._id}
                onClick={() => navigate(`/rmm/management/managers/${manager._id}`)}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md p-6 cursor-pointer transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-indigo-700">{manager.name}</h2>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
                    {avg.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  🏢 {manager.department?.name || '—'} &nbsp;|&nbsp; 👔 {manager.position || '—'}
                </p>
                <a
                  href={`/rmm/management/managers/${manager._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  View Full Profile →
                </a>
              </article>
            );
          })}
        </section>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-600 mb-4">Didn’t find who you were looking for?</p>
        <a
          href="/rmm/rate-manager"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold"
        >
          Rate a Manager
        </a>
      </div>
    </main>
  );
};

export default SearchResults;