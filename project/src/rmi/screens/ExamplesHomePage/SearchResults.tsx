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


const RESULTS_PER_PAGE = 10;

const SearchResults = () => {
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();

  const [results, setResults] = useState<Interviewer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState<any | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);

  useEffect(() => {
    const fetchResultsAndSaved = async () => {
      setLoading(true);
      setError(null);
      try {
        const [searchRes, savedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers/search/${query}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/user/saved`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }).then(res => res.json()),
        ]);

        setResults(searchRes.data);

        if (Array.isArray(savedRes)) {
          const ids = savedRes.map((int: Interviewer) => int._id);
          setSavedIds(ids);
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResultsAndSaved();
      setCurrentPage(1);
    }
  }, [query]);

  const handleSave = async (interviewer: any) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/toggle-save/${interviewer._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedIds(prev =>
        prev.includes(interviewer._id)
          ? prev.filter(id => id !== interviewer._id)
          : [...prev, interviewer._id]
      );
    } catch (err) {
      console.error('Error saving interviewer:', err);
    }
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const handleCardClick = (interviewer: any) => {
    setSelectedInterviewer(interviewer);
    setShowReviewPrompt(true);
  };

  const handleView = () => {
    if (selectedInterviewer) {
      navigate(`/interviewers/${selectedInterviewer._id}`);
    }
  };

  const handleReview = () => {
    setShowReviewPrompt(false);
    setShowStatusPrompt(true);
  };

  const handleStatusSelect = (status: string) => {
    if (selectedInterviewer) {
      navigate(`/interviewers/${selectedInterviewer._id}?review=true&status=${status}`);
    }
  };

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const pageResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">No results found for “{query}”</h2>
        <img src="/no-results.png" alt="No results" className="mx-auto w-64 opacity-50" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 sm:px-6 py-10"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1724593825200-39731dcdacf8?q=80&w=1925&auto=format&fit=crop')",
      }}
    >
      <h1 className="text-3xl sm:text-4xl font-semibold text-center text-white drop-shadow-lg mb-10">
        Search Results for “{query}”
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {pageResults.map((interviewer, index) => (
          <div
            key={index}
            className="relative cursor-pointer rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 bg-white bg-opacity-80 backdrop-blur"
            onClick={() => handleCardClick(interviewer)}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-1">{interviewer.name}</h3>
            <p className="text-sm text-gray-800">🏢 <strong>Company:</strong> {interviewer.company}</p>
            <p className="text-sm text-gray-800">👔 <strong>Position:</strong> {interviewer.position || 'N/A'}</p>
            <p className="text-sm text-gray-800">📖 <strong>Experience:</strong> {interviewer.experience || 'N/A'}</p>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-900 bg-white bg-opacity-90">
                ⭐ {calculateWeightedRating(interviewer.ratings)} / 5
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(interviewer);
                }}
                className={`absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-md ${
                  isSaved(interviewer._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {isSaved(interviewer._id) ? 'Unsave' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-2 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-white/80 hover:bg-white text-deepGray shadow disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-professionalBlue text-white'
                  : 'bg-white/80 hover:bg-white text-deepGray'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-white/80 hover:bg-white text-deepGray shadow disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* CTA Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate('/add-interviewer')}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition"
        >
          Add Interviewer
        </button>
      </div>
      {/* Modal 1: Review or View */}
      {showReviewPrompt && selectedInterviewer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              What would you like to do?
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleReview}
                className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                Submit a Review
              </button>
              <button
                onClick={handleView}
                className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                Just View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Select Interview Status */}
      {showStatusPrompt && selectedInterviewer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              What's your interview status?
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {['cleared', 'not-cleared', 'waiting', 'did-not-happen'].map((status) => {
                const hoverClasses = {
                  'cleared': 'hover:bg-green-500 hover:text-white',
                  'not-cleared': 'hover:bg-red-500 hover:text-white',
                  'waiting': 'hover:bg-yellow-500 hover:text-white',
                  'did-not-happen': 'hover:bg-gray-500 hover:text-white',
                }[status];

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className={`w-full py-3 bg-white text-gray-800 rounded-lg transition-colors ${hoverClasses}`}
                  >
                    {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Weighted Rating Calculation Function
const calculateWeightedRating = (ratings: { rating: number }[] = []) => {
  if (ratings.length === 0) return '0.00';
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const numRatings = ratings.length;
  const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / numRatings;
  const weight = sigmoid(numRatings / 5); // More reviews = more weight
  const globalAvg = 3; // Assume neutral baseline
  return ((1 - weight) * globalAvg + weight * avg).toFixed(2);
};

export default SearchResults;
