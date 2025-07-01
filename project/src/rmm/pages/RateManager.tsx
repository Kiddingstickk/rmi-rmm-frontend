import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';
import { createManager } from '../lib/managers';
import { getDepartments, createDepartment } from '../lib/department';
import { submitManagerReview } from '../lib/managers';

const RateManager = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [branch, setBranch] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!departmentName.trim()) return setDepartmentSuggestions([]);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await getDepartments(departmentName);
        setDepartmentSuggestions(results || []);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    }, 300);
  }, [departmentName]);

  const handleDepartmentSelect = (dept: any) => {
    setDepartmentName(dept.name);
    setDepartmentId(dept._id);
    setDepartmentSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) return setMessage('You must be logged in to submit.');

    if (!name || !position || !departmentName || !reviewText || rating < 1) {
      setMessage('Please complete all required fields and provide a rating.');
      return;
    }

    try {
      setLoading(true);

      let deptId = departmentId;
      if (!deptId) {
        const newDept = await createDepartment({ name: departmentName });
        deptId = newDept._id;
      }

      const manager = await createManager({
        name,
        position,
        branch,
        departmentId: deptId,
      });

      await submitManagerReview({
        managerId: manager._id,
        rating,
        reviewText,
        anonymous: true,
      });

      setMessage('✅ Submitted successfully!');
      navigate(`/managers/${manager._id}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

      <section
        className="relative bg-cover bg-center text-white mt-[64px] py-24"
        style={{
          backgroundImage: "url('/rmmformbg.jpeg')",
          filter: 'grayscale(20%) brightness(0.85) saturate(70%)',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-500 mb-2">
            RATE A MANAGER
          </h1>
          <p className="text-white text-sm">Couldn’t find your manager? Add and rate them below.</p>
        </div>
      </section>

      <main className="flex justify-center px-4 py-12 bg-gray-50">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Manager Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="Branch / Office"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="input"
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Department"
                value={departmentName}
                onChange={(e) => {
                  setDepartmentName(e.target.value);
                  setDepartmentId('');
                }}
                required
                className="input"
              />
              {departmentSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                  {departmentSuggestions.map((dept: any) => (
                    <li
                      key={dept._id}
                      onClick={() => handleDepartmentSelect(dept)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    >
                      {dept.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Rating</label>
            <StarRating />
            <span className="text-blue-600">{rating > 0 && `${rating} stars`}</span>
          </div>

          <textarea
            placeholder="Write your review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            rows={4}
            className="input"
          />

          {message && <p className="text-sm text-center text-blue-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? 'Submitting...' : 'Submit Manager & Review'}
          </button>
        </form>
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        Anonymous by default — built for honesty 💙
      </footer>
    </div>
  );
};

export default RateManager;
