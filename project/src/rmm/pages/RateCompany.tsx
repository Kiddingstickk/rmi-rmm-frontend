import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth'
import { useParams } from 'react-router-dom';

interface RateCompanyProps {
    isLoggedIn: boolean;
    logout: () => void;
  }
  

  

const RateCompany : React.FC<RateCompanyProps>= ({ isLoggedIn, logout }) => {
    const { companyId } = useParams(); // 🔥 Extract from route
    const [isEligible, setIsEligible] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [rating, setRating] = useState(0);


   
  


  // Ratings
  const [workLifeBalance, setWorkLifeBalance] = useState(0);
  const [compensation, setCompensation] = useState(0);
  const [culture, setCulture] = useState(0);
  const [careerGrowth, setCareerGrowth] = useState(0);
  const [diversity, setDiversity] = useState(0);

  // Reviews
  const [treatment, setTreatment] = useState('');
  const [careerGrowthText, setCareerGrowthText] = useState('');
  const [diversityText, setDiversityText] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [advice, setAdvice] = useState('');

  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);



  const StarRating = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`text-2xl ${star <= value ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };
  

  const DimensionRating = ({
    label,
    value,
    onChange
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }) => {
    return (
      <div>
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={`px-3 py-1 rounded-full border ${
                num <= value ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const res = await axios.get(`/api/company-reviews/check-eligibility/${companyId}`);
        setIsEligible(res.data.eligible);
      } catch (err) {
        console.error('Error checking eligibility:', err);
      }
    };
    checkEligibility();
  }, [companyId]);




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      companyId,
      isAnonymous : true,
      ratings: {
        workLifeBalance,
        compensation,
        culture,
        careerGrowth,
        diversity
      },
      reviews: {
        treatment,
        careerGrowth: careerGrowthText,
        diversity: diversityText,
        pros,
        cons,
        advice
      }
    };

    try {
      const res = await axios.post('/api/company-reviews/submit', payload);
      setMessage('Review submitted successfully!');
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setMessage("You've already submitted a review for this company this month.");
          } else {
            setMessage('Failed to submit review.');
          }
        } else {
          console.error('Unexpected error:', err);
        }
      }
       finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />
  
      <main className="flex justify-center p-8">
        {!isEligible ? (
          <div className="text-center text-gray-600 text-lg mt-12">
            You must review a manager in this company before submitting a company review.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl grid grid-cols-1 gap-8 bg-white p-8 rounded-xl shadow-lg"
          >
            <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">
              Rate {companyName}
            </h1>
  
            {/* Overall Rating */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Overall Company Rating
              </label>
              <StarRating value={rating} onChange={setRating} />
              <span className="text-yellow-600 text-sm">
                {rating > 0 && `${rating} stars`}
              </span>
            </div>
  
            {/* Dimension Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DimensionRating label="Work-Life Balance" value={workLifeBalance} onChange={setWorkLifeBalance} />
              <DimensionRating label="Compensation" value={compensation} onChange={setCompensation} />
              <DimensionRating label="Company Culture" value={culture} onChange={setCulture} />
              <DimensionRating label="Career Growth" value={careerGrowth} onChange={setCareerGrowth} />
              <DimensionRating label="Diversity & Inclusion" value={diversity} onChange={setDiversity} />
            </div>
  
            {/* Review Texts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                rows={4}
                placeholder="How were you treated at this company?"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <textarea
                value={careerGrowthText}
                onChange={(e) => setCareerGrowthText(e.target.value)}
                rows={4}
                placeholder="Describe your career growth experience..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                value={diversityText}
                onChange={(e) => setDiversityText(e.target.value)}
                rows={4}
                placeholder="How inclusive was the environment?"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                rows={3}
                placeholder="Pros of working here..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                rows={3}
                placeholder="Cons of working here..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                rows={3}
                placeholder="Advice to management..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
  
            {/* Message Feedback */}
            {message && (
              <div className="text-center text-sm text-blue-700 mt-4">
                {message}
              </div>
            )}
  
            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-pastelBlue hover:bg-blue-400 text-black font-bold px-8 py-3 rounded-md transition"
              >
                {loading ? 'Submitting...' : 'Submit Company Review'}
              </button>
            </div>
          </form>
        )}
      </main>
  
      <footer className="text-center text-gray-500 text-sm py-6">
        Anonymous by default — built for honesty 💛
      </footer>
    </div>
  );
};

export default RateCompany;