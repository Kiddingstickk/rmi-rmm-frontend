import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Interviewer {
  _id: string;
  name: string;
  company?: string;
  position?: string;
  experience?: string;
  ratings?: { rating: number }[];
}

const RESULTS_PER_PAGE = 12;

const calculateWeightedRating = (ratings: { rating: number }[] = []) => {
  if (!ratings.length) return 0;
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const rawAvg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  const weight = sigmoid(ratings.length / 5);
  const globalAvg = 3;
  return parseFloat(((1 - weight) * globalAvg + weight * rawAvg).toFixed(2));
};

const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'bg-green-100 text-green-800';
  if (rating <= 2) return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const SearchResults = () => {
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();

  const [results, setResults] = useState<Interviewer[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const [res, savedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers/search/${query}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/user/saved`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setResults(res.data);
        setSavedIds(savedRes.data.map((r: Interviewer) => r._id));
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
      setCurrentPage(1);
    }
  }, [query]);

  const handleSave = async (interviewer: Interviewer) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/toggle-save/${interviewer._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedIds((prev) =>
        prev.includes(interviewer._id)
          ? prev.filter((id) => id !== interviewer._id)
          : [...prev, interviewer._id]
      );
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const pageResults = results.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🔶 Header */}
      <header className="bg-yellow-400 flex items-center justify-between px-8 py-6 shadow-md">
        <img src="/rmi-logo.png" alt="RMI Logo" className="w-12 h-12 rounded-full" />
        <h1 className="text-xl font-bold text-black">SEARCH RESULTS:</h1>
      </header>

      <main className="flex-grow px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for <span className="text-yellow-600">"{query}"</span>
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : results.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <h3 className="text-xl font-semibold">No results found</h3>
            <img src="/no-results.png" alt="No results" className="mx-auto mt-4 w-64 opacity-60" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageResults.map((int) => {
              const avg = calculateWeightedRating(int.ratings);
              const cardStyle = getRatingColor(avg);
              return (
                <div
                  key={int._id}
                  onClick={() => navigate(`/interviewers/${int._id}`)}
                  className={`cursor-pointer rounded-xl p-6 shadow-md hover:shadow-xl hover:ring-2 hover:ring-yellow-400 transition ${cardStyle}`}
                >
                  <h3 className="text-lg font-bold">{int.name}</h3>
                  <p className="text-sm">🏢 {int.company}</p>
                  <p className="text-sm">👔 {int.position || 'N/A'}</p>
                  <p className="text-sm">📖 {int.experience || 'N/A'}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm font-medium">⭐ {avg.toFixed(1)} / 5</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(int);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        savedIds.includes(int._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {savedIds.includes(int._id) ? 'Unsave' : 'Save'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-white hover:bg-gray-200 border border-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded font-medium ${
                  currentPage === i + 1
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-white hover:bg-gray-200 border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;