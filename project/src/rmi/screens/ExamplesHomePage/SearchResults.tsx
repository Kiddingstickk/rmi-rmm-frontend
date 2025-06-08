import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


interface Interviewer {
  _id: string;
  name: string;
  // Add other properties as needed
}

const SearchResults = () => {
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedInterviewers, setSavedInterviewers] = useState<Interviewer[]>([]);
  
  const [selectedInterviewer, setSelectedInterviewer] = useState<any | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
 


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
          }).then(res => res.json())
        ]);
  
        // Log the savedRes to check its structure
        console.log('savedRes:', savedRes);
        
        setResults(searchRes.data);
        
        // Check if savedRes is an array before mapping over it
        if (Array.isArray(savedRes)) {
          const savedIds = savedRes.map((int: Interviewer) => int._id);
          setSavedIds(savedIds);
        } else {
          // Handle the case where savedRes is not an array
          console.error('Expected an array but got:', savedRes);
          setSavedIds([]); // If it's not an array, reset savedIds
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    if (query) fetchResultsAndSaved();
  }, [query]);
  
  


  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers/search/${query}`);
        setResults(response.data);
      } catch (err) {
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
   // Fetch saved interviewers from local storage
   const saved = localStorage.getItem('savedInterviewers');
   if (saved) {
     setSavedInterviewers(JSON.parse(saved));
   }

    if (query) fetchResults();
  }, [query]);


  const handleSave = async (interviewer: any) => {
    try {
      const token = localStorage.getItem('token'); // get JWT from localStorage
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/toggle-save/${interviewer._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log(data.message);
  
      // Update savedIds after the save toggle
      setSavedIds((prev) =>
        prev.includes(interviewer._id)
          ? prev.filter((id) => id !== interviewer._id) // Remove if already saved
          : [...prev, interviewer._id] // Add if not saved
      );
    } catch (err) {
      console.error('Error saving interviewer:', err);
    }
  };
  



  const isSaved = (interviewerId: string) => {
    return savedIds.includes(interviewerId);
  };
  
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
    <div className="p-6 md:p-10 min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1724593825200-39731dcdacf8?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-white drop-shadow-lg">Search Results for “{query}”</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {results.map((interviewer, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 bg-white bg-opacity-70 backdrop-blur-md"
            onClick={() => handleCardClick(interviewer)}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{interviewer.name}</h3>
            <p className="text-gray-700 mb-1">🏢 <strong>Company:</strong> {interviewer.company}</p>
            <p className="text-gray-700 mb-1">👔 <strong>Position:</strong> {interviewer.position || 'N/A'}</p>
            <p className="text-gray-700 mb-1">📖 <strong>Experience:</strong> {interviewer.experience || 'N/A'}</p>
            <div className="mt-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-900 bg-white bg-opacity-80">
                ⭐ {calculateWeightedRating(interviewer.ratings)} / 5
              </span>
  {/* Save Button at Bottom-Right */}
  <button
  onClick={(e) => {
    e.stopPropagation();
    handleSave(interviewer);
  }}
  className={`absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shadow-md transition-all ${
    isSaved(interviewer._id) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
  }`}
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 3.75H6.75A2.25 2.25 0 004.5 6v15l7.5-4.5 7.5 4.5V6a2.25 2.25 0 00-2.25-2.25z" />
  </svg>
  {isSaved(interviewer._id) ? 'Unsave' : 'Save'}
</button>

            </div>
          </div>
        ))}
      </div>

            {/* Add Interviewer Button */}
            <div className="flex justify-center mt-8">
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
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8 transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">What would you like to do?</h2>
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
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8 transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">What's your interview status?</h2>
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

// Sigmoid-Weighted Average Calculation
const calculateWeightedRating = (ratings: { rating: number }[]) => {
  if (!ratings || ratings.length === 0) return '0.00';
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const numRatings = ratings.length;
  const rawAvg = ratings.reduce((sum, entry) => sum + entry.rating, 0) / numRatings;
  const weight = sigmoid(numRatings / 5);
  const globalAvg = 3;
  return ((1 - weight) * globalAvg + weight * rawAvg).toFixed(2);
};

export default SearchResults;

