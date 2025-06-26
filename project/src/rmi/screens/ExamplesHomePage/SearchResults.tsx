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

  const handleSave = async (interviewer: Interviewer) => {
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
    <div className="bg-neutralCanvas min-h-screen px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center text-deepGray mb-10">
        Search Results for “{query}”
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {pageResults.map((interviewer, index) => (
          <div
            key={index}
            className="relative cursor-pointer animate-fade-up bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 border hover:outline hover:outline-2 hover:outline-blue-500/20"
            onClick={() => {
              setSelectedInterviewer(interviewer);
              setShowReviewPrompt(true);
            }}
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            <h3 className="text-lg font-bold text-deepGray mb-1">{interviewer.name}</h3>
            <p className="text-sm text-mutedGray">🏢 <strong>Company:</strong> {interviewer.company}</p>
            <p className="text-sm text-mutedGray">👔 <strong>Position:</strong> {interviewer.position || 'N/A'}</p>
            <p className="text-sm text-mutedGray">📖 <strong>Experience:</strong> {interviewer.experience || 'N/A'}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neutralCanvas text-deepGray">
                ⭐ {calculateWeightedRating(interviewer.ratings)} / 5
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(interviewer);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                  savedIds.includes(interviewer._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {savedIds.includes(interviewer._id) ? 'Unsave' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-2 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-white hover:bg-gray-100 text-deepGray border shadow-sm disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded font-medium ${
                currentPage === i + 1
                  ? 'bg-professionalBlue text-white'
                  : 'bg-white hover:bg-gray-100 text-deepGray border'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-white hover:bg-gray-100 text-deepGray border shadow-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate('/add-interviewer')}
          className="bg-actionYellow hover:bg-yellow-400 text-deepGray font-medium py-2 px-6 rounded-lg transition"
        >
          Add Interviewer
        </button>
      </div>

      {/* Modal 1: Review or View */}
      {showReviewPrompt && selectedInterviewer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8 animate-fade-up">
            <h2 className="text-2xl font-semibold text-deepGray mb-6 text-center">
              What would you like to do?
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setShowReviewPrompt(false);
                  setShowStatusPrompt(true);
                }}
                className="w-full py-3 bg-gray-100 text-deepGray rounded-lg hover:bg-professionalBlue hover:text-white transition"
              >
                Submit a Review
              </button>
              <button
                onClick={() => {
                  setShowReviewPrompt(false);
                  navigate(`/interviewers/${selectedInterviewer._id}`);
                }}
                className="w-full py-3 bg-gray-100 text-deepGray rounded-lg hover:bg-professionalBlue hover:text-white transition"
              >
                Just View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Select Status */}
      {showStatusPrompt && selectedInterviewer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8 animate-fade-up">
            <h2 className="text-2xl font-semibold text-deepGray mb-6 text-center">
              What's your interview status?
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {['cleared', 'not-cleared', 'waiting', 'did-not-happen'].map((status) => {
                const hoverStyles = {
                  cleared: 'hover:bg-green-500',
                  'not-cleared': 'hover:bg-red-500',
                  waiting: 'hover:bg-yellow-400',
                  'did-not-happen': 'hover:bg-mutedGray',
                }[status];

                return (
                  <button
                    key={status}
                    onClick={() => {
                      setShowStatusPrompt(false);
                      navigate(`/interviewers/${selectedInterviewer._id}?review=true&status=${status}`);
                    }}
                    className={`w-full py-3 bg-gray-100 text-deepGray rounded-lg transition-colors ${hoverStyles} hover:text-white`}
                  >
                    {status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
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

// ⭐ Weighted Rating Calculation
const calculateWeightedRating = (ratings: { rating: number }[] = []) => {
  if (ratings.length === 0) return '0.00';
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const numRatings = ratings.length;
  const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / numRatings;
  const weight = sigmoid(numRatings / 5);
  const globalAvg = 3;
  return ((1 - weight) * globalAvg + weight * avg).toFixed(2);
};

export default SearchResults;
