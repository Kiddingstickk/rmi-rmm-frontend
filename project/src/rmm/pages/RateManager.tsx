import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';
import { getManagers } from '../lib/managers';
import { createManager } from '../lib/managers';
import { getDepartments} from '../lib/department';
import { submitManagerReview } from '../lib/managers';



const RateManager = () => {
  const { isLoggedIn, logout,} = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [branch, setBranch] = useState('');
  const [bio, setBio] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const data = await getDepartments();
      setDepartments(data);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return setMessage('You must be logged in to submit.');

    if (!name || !position || !departmentId || !reviewText || rating < 1) {
        setMessage('Please complete all required fields and provide a rating.');
        return;
      }

    try {
      setLoading(true);
      const manager = await createManager({ name, position, branch, departmentId, bio });
      await submitManagerReview({
        managerId: manager._id,
        rating,
        reviewText,
        anonymous,
      });
      setMessage('✅ Manager submitted and review posted!');
      navigate(`/managers/${manager._id}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* Hero */}
      <section
        className="relative bg-cover bg-center text-white mt-[64px] py-24"
        style={{
          backgroundImage: "url('/rmmformbg.jpeg')",
          filter: 'grayscale(20%) brightness(0.85) saturate(70%)',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-500 mb-4">
            RATE A MANAGER
          </h1>
          <p className="text-white text-sm">Didn't find your manager? Add and rate them here.</p>
        </div>
      </section>

      {/* Form */}
      <main className="flex justify-center px-4 py-12 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md space-y-6"
        >
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

            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
              className="input"
            >
              <option value="">Select Department</option>
              {departments.map((dept: any) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Short Bio (optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="input"
          />

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Rating (1 to 5)</label>
            <input
              type="range"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <span>{rating} ⭐</span>
          </div>

          <textarea
            placeholder="Write your review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            rows={4}
            className="input"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            Post anonymously
          </label>

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

      <footer className="text-center text-gray-500 text-sm py-6">Built with trust 💙</footer>
    </div>
  );
};

export default RateManager;
