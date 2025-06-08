import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating
        ? <AiFillStar key={i} className="text-yellow-500" />
        : <AiOutlineStar key={i} className="text-gray-300" />
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

interface DecodedToken {
  userId: string;
  exp: number;
}

export interface ReplyType {
  userId: string;
  replyText: string;
  createdAt: string;
}

export interface RatingType {
  _id: string;
  userId: string;
  rating: number;
  review: string;
  createdAt: string;
  replies: ReplyType[];
}

export interface InterviewerType {
  _id: string;
  name: string;
  position: string;
  company: string;
  ratings: RatingType[];
  // add any other fields like profileImage, bio, etc.
}



const calculateWeightedRating = (ratings: { rating: number }[]) => {
  if (!ratings || ratings.length === 0) return 0;
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const numRatings = ratings.length;
  const rawAvg = ratings.reduce((sum, entry) => sum + entry.rating, 0) / numRatings;
  const weight = sigmoid(numRatings / 5);
  const globalAvg = 3;
  return parseFloat(((1 - weight) * globalAvg + weight * rawAvg).toFixed(2));
};

const getReviewCardColor = (rating: number) => {
  if (rating <= 2) return 'bg-red-50 border-red-300';
  if (rating === 3) return 'bg-yellow-50 border-yellow-300';
  return 'bg-green-50 border-green-300';
};

// Map interview status to question sets
const statusQuestions = (status: string): string[] => {
  switch (status) {
    case 'cleared':
      return [
        "How helpful was the interviewer in explaining the process?",
        "Did the interviewer make you feel comfortable?",
        "Were the questions relevant to the role?",
        "How would you rate the technical difficulty?",
        "Would you interview with this person again?",
      ];
    case 'not-cleared':
      return [
        "Was the interviewer respectful during the process?",
        "Did you receive constructive feedback?",
        "Did you feel fairly evaluated?",
        "Were there any red flags during the interview?",
        "Would you interview with this person again?",
      ];
    case 'waiting':
      return [
        "How was the communication throughout the process?",
        "Were the expectations clearly stated?",
        "Did you face any technical or scheduling issues?",
        "Did you feel confident about the interview?",
        "Would you prefer this interviewer again?",
      ];
    default:
      return [];
  }
};

const InterviewerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [replyTexts ,setReplyTexts] = useState<{ [key: string]: string }>({});
  const [interviewer, setInterviewer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [existingUserReview, setExistingUserReview] = useState<any>(null);
  const [showReplyInput, setShowReplyInput] = useState<{ [reviewId: string]: boolean }>({});
  const [repliesByReviewId, setRepliesByReviewId] = useState<{ [key: string]: any[] }>({});


  


  // Read query params
  const queryParams = new URLSearchParams(location.search);
  const isReviewFlow = queryParams.get('review') === 'true';
  const statusParam = queryParams.get('status') || '';

  // State for interview status and questions
  const [interviewStatus, setInterviewStatus] = useState<string>(statusParam);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [customAnswers, setCustomAnswers] = useState<string[]>([]);
  const token = localStorage.getItem("token"); // adjust key as per your setup

  



  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers/${id}`);
        setInterviewer(response.data);

        const token = localStorage.getItem('token');
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
          } else {
            setUserId(decoded.userId);
            const existing = response.data.ratings.find((r: any) => r.userId === decoded.userId);
            if (existing) setExistingUserReview(existing);
          }
        }
      } catch (err) {
        console.error('Failed to fetch interviewer:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewer();
  }, [id]);


  // Pre-fill form when editing
  useEffect(() => {
    if (existingUserReview) {
      setRating(existingUserReview.rating);
      setReview(existingUserReview.review);
      setInterviewStatus(existingUserReview.interviewStatus || '');
      setCustomAnswers(existingUserReview.customAnswers || []);
    }
  }, [existingUserReview]);

  // Initialize review flow from modal selection
  useEffect(() => {
    if (isReviewFlow) {
      if (statusParam === 'did-not-happen') {
        alert('You must attend an interview to leave a review.');
        navigate(`/interviewers/${id}`);
      } else {
        setInterviewStatus(statusParam);
      }
    }
  }, [isReviewFlow, statusParam]);

  // Update questions/answers when status changes
  useEffect(() => {
    if (interviewStatus) {
      const qs = statusQuestions(interviewStatus);
      setCustomQuestions(qs);
      setCustomAnswers(Array(qs.length).fill(''));
    } else {
      setCustomQuestions([]);
      setCustomAnswers([]);
    }
  }, [interviewStatus]);

  useEffect(() => {
    if (interviewer?.ratings?.length) {
      interviewer.ratings.forEach((entry: any) => {
        fetchReplies(entry._id);
      });
    }
  }, [interviewer]);

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...customAnswers];
    updated[index] = value;
    setCustomAnswers(updated);
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { alert('You must be logged in to submit a review.'); return; }
    if (!rating || !review || !interviewStatus) {
      alert('Please fill in all required fields.');
      return;
    }
    if (interviewStatus === 'did-not-happen') {
      alert('You must have had an interview to submit a review.');
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/interviewers/${id}/rating`,
        { rating, review, customAnswers, interviewStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Thank you for your feedback!');
      const refreshed = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers/${id}`);
      setInterviewer(refreshed.data);
      setRating(0); setReview(''); setInterviewStatus(''); setCustomAnswers([]);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review.');
    }
  };


  const handleLike = async (reviewId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interviewers/${interviewer._id}/reviews/${reviewId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          //Replace with actual token from your auth state
        },
      });
      const data = await res.json();
      // Update UI based on response
      setInterviewer((prev: any) => ({
        ...prev,
        ratings: prev.ratings.map((r: any) =>
          r._id === reviewId ? { ...r, likes: Array(data.likes).fill("x"), dislikes: Array(data.dislikes).fill("x") } : r
        )
      }));
    } catch (err) {
      console.error("Like failed", err);
    }
  };
  
  const handleDislike = async (reviewId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interviewers/${interviewer._id}/reviews/${reviewId}/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`

        },
      });
      const data = await res.json();
      // Update UI based on response
      setInterviewer((prev: any) => ({
        ...prev,
        ratings: prev.ratings.map((r: any) =>
          r._id === reviewId ? { ...r, likes: Array(data.likes).fill("x"), dislikes: Array(data.dislikes).fill("x") } : r
        )
      }));
    } catch (err) {
      console.error("Dislike failed", err);
    }
  };
  

  const handleReplySubmit = async(e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    if (!replyTexts[reviewId]?.trim()) return;
 // Don't submit if empty
  
    try {
      console.log("Token being sent:", token);

      const response = await fetch('${import.meta.env.VITE_API_URL}/api/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Assuming you have a token
        },
        body: JSON.stringify({ reviewId, text: replyTexts[reviewId] }),
      });
  
      const data = await response.json();
      const text = replyTexts[reviewId];

  
      if (data.reply) {
        // Reset and refetch replies
        setReplyTexts((prev) => ({
          ...prev,
          [reviewId]: '', // Clear just this one field
        }));
        setShowReplyInput((prev) => ({
          ...prev,
          [reviewId]: true , // or false, depending on what you want
        }));
        
        fetchReplies(reviewId); // Refetch replies for the review
      } else {
        console.log('Failed to add reply');
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  
  


  const fetchReplies = async (reviewId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/replies/${reviewId}`);
      const data = await response.json();

      console.log("Replies fetched:", data);
  
      setRepliesByReviewId((prev) => ({
        ...prev,
        [reviewId]: data,
      }));
    }catch (err) {
      console.error('Error fetching replies:',err);
    }
  };
  


  const handleReviewEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { alert('You must be logged in to edit your review.'); return; }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/interviewers/${id}/rating`,
        { rating, review, customAnswers, interviewStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Your review has been updated!');
      const refreshed = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviewers/${id}`);
      setInterviewer(refreshed.data); setRating(0); setReview(''); setCustomAnswers([]);
    } catch (err) {
      console.error('Error editing rating:', err);
      alert('Failed to update review. Please try again.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!interviewer) return <div className="p-6">Interviewer not found.</div>;

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)" }}>
      <div className="max-w-3xl mx-auto bg-white bg-opacity-80 rounded-3xl shadow-xl p-8">
        {/* Profile Header */}
        <div className="flex items-center mb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full mr-6 flex items-center justify-center text-3xl text-white font-bold bg-gradient-to-br from-blue-400 to-purple-500">{interviewer.name.charAt(0)}</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{interviewer.name}</h1>
            <p className="text-lg text-gray-600"><strong>Company:</strong> {interviewer.company}</p>
            <p className="text-lg text-gray-600"><strong>Position:</strong> {interviewer.position}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Details</h2>
          <div className="text-lg"><strong>Rating:</strong> <div className="flex items-center">{renderStars(calculateWeightedRating(interviewer.ratings))}</div></div>
          <p className="text-lg"><strong>Experience:</strong> {interviewer.experience || 'N/A'}</p>
        </div>

        {/* Review Section */}
        {userId && !existingUserReview && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Leave a Rating & Review</h3>
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Interview Status</label>
                <select
                  value={interviewStatus}
                  onChange={(e) => setInterviewStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select status</option>
                  <option value="cleared">Cleared</option>
                  <option value="not-cleared">Not Cleared</option>
                  <option value="waiting">Waiting for Result</option>
                  <option value="did-not-happen">Did Not Have Interview</option>
                </select>
              </div>

              {interviewStatus === 'did-not-happen' && <p className="text-red-500 text-sm">You must attend the interview to leave a review.</p>}

              {customQuestions.map((q, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">{q}</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={2}
                    value={customAnswers[i] || ''}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                  ></textarea>
                </div>
              ))}

              <div className="flex items-center">
                {[1,2,3,4,5].map(star => (
                  <span key={star} onClick={() => setRating(star)} className={`cursor-pointer ${rating >= star ? 'text-yellow-500':'text-gray-300'}`}><AiFillStar /></span>
                ))}
              </div>

              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Write your experience here..."
                required
              ></textarea>

              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md" disabled={interviewStatus==='did-not-happen'}>Submit Review</button>
            </form>
          </div>
        )}


{/* Edit Review */}
{userId && existingUserReview && (
  <form onSubmit={handleReviewEdit} className="space-y-4 p-4 border rounded-lg shadow-md bg-white mt-6">
    <h3 className="text-xl font-semibold">Edit Your Review</h3>

    {/* Rating */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        required
      />
    </div>

    {/* Interview Status */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Interview Status</label>
      <select
        value={interviewStatus}
        onChange={(e) => setInterviewStatus(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        required
      >
        <option value="cleared">Cleared</option>
        <option value="not-cleared">Not Cleared</option>
        <option value="waiting">Waiting for Result</option>
        <option value="did-not-happen">Did Not Happen</option>
      </select>
    </div>

    {/* Review Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Your Review</label>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        placeholder="Describe your experience"
        required
      />
    </div>

    {/* Custom Answers */}
    {customAnswers.map((answer, index) => (
      <div key={index}>
        <label className="block text-sm font-medium text-gray-700">
          Answer {index + 1}
        </label>
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            const updatedAnswers = [...customAnswers];
            updatedAnswers[index] = e.target.value;
            setCustomAnswers(updatedAnswers);
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      )}



        {/* Display Reviews */}
        {interviewer.ratings?.length > 0 && (
  <div className="mt-8">
    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Reviews</h3>
    <div className="space-y-6">
    {interviewer.ratings.map((entry:any) => (
  <div key={entry._id} className={`p-4 rounded-xl border shadow-md ${getReviewCardColor(entry.rating)}`}>
    <div className="font-semibold text-lg">
      Rating:
      <div className="flex items-center">{renderStars(entry.rating)}</div>
    </div>
    <p className="text-gray-800 italic my-1">"{entry.review}"</p>
    <p className="text-sm text-gray-600">Submitted on {new Date(entry.date).toLocaleDateString()}</p>

    <div className="flex gap-4 mt-2">
      <button
        onClick={() => handleLike(entry._id)}
        className="text-green-600 font-medium hover:scale-105 transition"
      >
        👍 {entry.likes?.length || 0}
      </button>
      <button
        onClick={() => handleDislike(entry._id)}
        className="text-red-600 font-medium hover:scale-105 transition"
      >
        👎 {entry.dislikes?.length || 0}
      </button>
    </div>

{/* Existing replies */}
{repliesByReviewId[entry._id]?.length > 0 && (
  <div className="ml-4 mt-2 space-y-2">
   {repliesByReviewId[entry._id]?.map((rep: any) => (
      <div key={rep._id} className="text-sm bg-gray-100 p-2 rounded-md border-l-4 border-blue-400">
        <p className="italic">{rep.text}</p>
        <p className="text-gray-500 text-xs">By: {rep.userName || 'Anonymous'} • {new Date(rep.createdAt).toLocaleDateString()}</p>
      </div>
    ))}
  </div>
)}

{/* Toggle Reply Button */}
{userId && (
  <div className="ml-4 mt-4">
    {!showReplyInput[entry._id] ? (
      <button
        onClick={() =>
          setShowReplyInput((prev) => ({ ...prev, [entry._id]: true }))
        }
        className="text-black underline bg-transparent p-0 hover:opacity-70"
      >
        Reply
      </button>
    ) : (
      <form onSubmit={(e) => handleReplySubmit(e, entry._id)}>
        <textarea
          value={replyTexts[entry._id] || ''}
          onChange={(e) =>
            setReplyTexts({ ...replyTexts, [entry._id]: e.target.value })
          }
          placeholder="Write a reply..."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={2}
          required
        />
        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
          >
            Send
          </button>
          <button
            type="button"
            onClick={() =>
              setShowReplyInput((prev) => ({ ...prev, [entry._id]: false }))
            }
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </div>
)}



  </div>

))}

          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default InterviewerProfile;