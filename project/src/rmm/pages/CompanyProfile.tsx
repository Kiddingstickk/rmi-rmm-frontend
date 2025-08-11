import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Manager {
  _id: string;
  name: string;
  position: string;
  averageRating: number;
}

interface Company {
  _id: string;
  name: string;
  description: string;
  avgRating: string;
}

interface CompanyResponse {
  company: Company;
  managers: Manager[];
}

export default function CompanyProfile() {
  const { id } = useParams();
  const [data, setData] = useState<CompanyResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/companies/search/company/_/${id}`)
      .then(res => setData(res.data));
  }, [id]);

  if (!data) return <div className="p-8">Loading...</div>;

  const { company, managers } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-800">
      {/* Cover Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
        <span className="text-gray-500">[Cover Image Placeholder]</span>
      </div>

      {/* Company Header */}
      <div className="flex items-center gap-6 mb-6">
        {/* Logo */}
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
          Logo
        </div>

        {/* Name + Badge */}
        <div>
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            {company.name}
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
              Verified
            </span>
          </h1>
          <p className="text-gray-600 mt-1">{company.description || 'No description available yet.'}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500">Managers</div>
          <div className="text-xl font-bold text-blue-800">{managers.length}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500">Avg Rating</div>
          <div className="text-xl font-bold text-blue-800">⭐ {company.avgRating}</div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500">Reviews</div>
          <div className="text-xl font-bold text-blue-800">—</div>
        </div>
      </div>

      {/* Rating Distribution Chart */}
      <div className="mb-8">
        <div className="text-lg font-semibold text-blue-800 mb-2">Rating Distribution</div>
        <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center text-gray-500">
          [Chart Placeholder]
        </div>
      </div>

      {/* CTA Button */}
      <div className="mb-8 text-center">
        <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow">
          Rate a Manager
        </button>
      </div>

      <div className="mb-4 text-center">
        <button
          onClick={() => navigate(`/companies/${company.name}/${company._id}/rate-company`)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
        >
          Rate This Company
        </button>
      </div>


      {/* Trust Disclaimer */}
      <div className="text-sm text-green-600 text-center">
        All reviews are anonymous and verified for authenticity.
      </div>

      {/* Leadership Team */}
      <h2 className="text-2xl font-bold text-blue-800 mt-12 mb-4">Leadership Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map(m => (
          <div
            key={m._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">{m.name}</h3>
            <p className="text-gray-500">{m.position}</p>
            <div className="mt-2 text-blue-700">Rating: ⭐ {m.averageRating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}