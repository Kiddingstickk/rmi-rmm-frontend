import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';
import { createManager, submitManagerReview } from '../lib/managers';
import { getDepartments, createDepartment } from '../lib/department';
import { getCompanies, createCompany } from '../lib/company';
import { findOrCreateBranch } from '../lib/branch';


const RateManager = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [branchCity, setBranchCity] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [branchId, setBranchId] = useState('');

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [branchSuggestions, setBranchSuggestions] = useState([]);

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

  useEffect(() => {
    if (!companyName.trim()) return setCompanySuggestions([]);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await getCompanies(companyName);
        setCompanySuggestions(results || []);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      }
    }, 300);
  }, [companyName]);

  const handleDepartmentSelect = (dept: any) => {
    setDepartmentName(dept.name);
    setDepartmentId(dept._id);
    setDepartmentSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return setMessage('You must be logged in to submit.');

    if (!name || !position || !reviewText || rating < 1) {
      setMessage('Please complete all required fields and provide a rating.');
      return;
    }


    try {
      setLoading(true);

      let deptId = departmentId;
      if (!deptId && departmentName.trim()) {
        const newDept = await createDepartment({ name: departmentName });
        deptId = newDept._id;
      }

      let compId = companyId;
      if (!compId) {
        const newCompany = await createCompany({ name: companyName });
        compId = newCompany._id;
      }

      const branch = await findOrCreateBranch(compId, branchCity, branchLocation);
      setBranchId(branch._id);
      


      const managerPayload: any = {
        name,
        position,
        branch: branchId,
        company: compId,
      };
      
      if (deptId) {
        managerPayload.departmentId = deptId;
      }
      
      const manager = await createManager(managerPayload);


      await submitManagerReview({
        managerId: manager._id,
        rating,
        reviewText,
        anonymous: true,
      });

      setMessage('✅ Submitted successfully!');
      navigate(`/management/managers/${manager._id}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => (
    <div className="flex gap-2 text-3xl mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={star <= rating ? 'text-blue-300' : 'text-gray-300'}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />
  
      {/* Form Section */}
      <main className="flex justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-xl shadow-lg"
        >
          {/* Left Column: Form Fields */}
          <div className="space-y-5 md:col-span-2">
            <div>
              <input
                type="text"
                placeholder="Manager Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
  
            <div>
              <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
  
            <div className="relative">
              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setCompanyId('');
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              {companySuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                  {companySuggestions.map((comp: any) => (
                    <li
                      key={comp._id}
                      onClick={() => {
                        setCompanyName(comp.name);
                        setCompanyId(comp._id);
                        setCompanySuggestions([]);
                      }}
                      className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                    >
                      {comp.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
  
            {/*
              <div className="relative">
                <input
                  type="text"
                  placeholder="Department"
                  value={departmentName}
                  onChange={(e) => {
                    setDepartmentName(e.target.value);
                    setDepartmentId('');
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  //required
                />
                {departmentSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                    {departmentSuggestions.map((dept: any) => (
                      <li
                        key={dept._id}
                        onClick={() => handleDepartmentSelect(dept)}
                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                      >
                        {dept.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              */}
  
            <div className="relative">
              <input
                type="text"
                placeholder="Branch City"
                value={branchCity}
                onChange={(e) => {
                  setBranchCity(e.target.value);
                  setBranchId('');
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              {branchSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
                  {branchSuggestions.map((branch: any) => (
                    <li
                      key={branch._id}
                      onClick={() => {
                        setBranchCity(branch.city);
                        setBranchLocation(branch.location || '');
                        setBranchId(branch._id);
                        setBranchSuggestions([]);
                      }}
                      className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                    >
                      {branch.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
  
            <div>
              <input
                type="text"
                placeholder="Specific Branch Location (optional)"
                value={branchLocation}
                onChange={(e) => setBranchLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
  
          {/* Right Column: Avatar */}
          <div className="order-first md:order-none flex justify-center md:justify-end items-start">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-500 shadow-inner">
              👤
            </div>
          </div>
  
          {/* Star Rating */}
          <div className="md:col-span-3">
            <label className="block text-gray-700 font-semibold mb-2">
              Overall Rating
            </label>
            <StarRating />
            <span className="text-yellow-600 text-sm">
              {rating > 0 && `${rating} stars`}
            </span>
          </div>
  
          {/* Review Box */}
          <div className="md:col-span-3">
            <label className="block text-gray-700 font-semibold mb-2">
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              placeholder="Write your feedback about the manager..."
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
  
          {/* Message Feedback */}
          {message && (
            <div className="md:col-span-3 text-center text-sm text-blue-700">
              {message}
            </div>
          )}
  
          {/* Submit Button */}
          <div className="md:col-span-3 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-pastelBlue hover:bg-blue-400 text-black font-bold px-8 py-3 rounded-md transition"
            >
              {loading ? 'Submitting...' : 'Submit Manager & Review'}
            </button>
          </div>
        </form>
      </main>
  
      <footer className="text-center text-gray-500 text-sm py-6">
        Anonymous by default — built for honesty 💛
      </footer>
    </div>
  );
};

export default RateManager;