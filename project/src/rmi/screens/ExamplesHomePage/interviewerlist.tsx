import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Interviewer {
  _id: string;
  name: string;
  position: string;
  company: string;
  rating: number;
}

const InterviewerList: React.FC = () => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [promptType, setPromptType] = useState<'first' | 'second' | null>(null);
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers`);
        setInterviewers(response.data);
      } catch (error) {
        console.error('Error fetching interviewers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewers();
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handlePromptChoice = (choice: 'review' | 'view') => {
    if (choice === 'review') {
      setPromptType('second');
    } else {
      router.push(`/interviewer/${selectedInterviewer?._id}`);
      setPromptType(null);
    }
  };

  const handleInterviewStatus = (status: string) => {
    router.push(`/interviewer/${selectedInterviewer?._id}?status=${status}`);
    setPromptType(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-950 min-h-screen text-gray-800 dark:text-gray-100 transition-colors">
      {loading ? (
        <p className="text-center text-lg">Loading interviewers...</p>
      ) : interviewers.length === 0 ? (
        <p className="text-center text-lg">No interviewers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {interviewers.map((interviewer) => (
            <div
              key={interviewer._id}
              className="p-4 rounded-2xl shadow-md cursor-pointer bg-cover bg-center relative"
              style={{
                backgroundImage:
                  "url('https://source.unsplash.com/random/400x300/?office,workspace')",
              }}
              onClick={() => {
                setSelectedInterviewer(interviewer);
                setPromptType('first');
              }}
            >
              <div className="bg-black/60 dark:bg-black/70 p-4 rounded-xl text-white">
                <h2 className="text-xl font-bold">{interviewer.name}</h2>
                <p className="text-sm">
                  {interviewer.position} at {interviewer.company}
                </p>
                <div
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(
                    interviewer.rating
                  )} shadow`}
                >
                  Rating: {interviewer.rating.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      

{/* First Prompt Modal */}
{promptType === 'first' && selectedInterviewer && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg w-96 text-center text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-4">Are you here to...</h3>
      <button
        onClick={() => handlePromptChoice('review')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-2 transition"
      >
        Submit a Review
      </button>
      <button
        onClick={() => handlePromptChoice('view')}
        className="w-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 py-2 rounded-lg transition"
      >
        Just View Profile
      </button>
    </div>
  </div>
)}

{/* Second Prompt Modal */}
{promptType === 'second' && selectedInterviewer && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg w-96 text-center text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-4">How did your interview go?</h3>
      <button
        onClick={() => handleInterviewStatus('cleared')}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg mb-2 transition"
      >
        Cleared
      </button>
      <button
        onClick={() => handleInterviewStatus('not cleared')}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mb-2 transition"
      >
        Not Cleared
      </button>
      <button
        onClick={() => handleInterviewStatus('waiting')}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg mb-2 transition"
      >
        Waiting for Result
      </button>
      <button
        onClick={() => handleInterviewStatus('no interview')}
        className="w-full bg-gray-400 dark:bg-gray-700 text-white hover:bg-gray-500 dark:hover:bg-gray-600 py-2 rounded-lg transition"
      >
        Did Not Have Interview
      </button>
    </div>
  </div>
)}
</div>
);
};

export default InterviewerList;
