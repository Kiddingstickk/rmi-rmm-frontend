// /screens/AddInterviewer.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInterviewer = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  // Authentication protection: redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.alert('You need to be logged in to add an interviewer.');
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/api/interviewers',
        {
          name,
          company,
          position,
          linkedin,
          email,
          tags: tags.split(',').map(tag => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Interviewer added successfully!');
      navigate('/'); // Redirect to landing page
    } catch (error) {
      console.error('Failed to add interviewer:', error);
      alert('Failed to add interviewer.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10 px-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1604052914311-f0adc900257b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-xl">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Add New Interviewer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Company <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter position/role"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="username@company.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="E.g. DSA, Behavioral, Google"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInterviewer;


