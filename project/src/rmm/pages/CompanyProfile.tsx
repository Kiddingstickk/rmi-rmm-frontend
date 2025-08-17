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

  if (!data) return <div className="p-8 text-center text-gray-500">Loading company profile...</div>;

  const { company, managers } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-white border shadow flex items-center justify-center text-gray-500 text-sm">
            Logo
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-2">
              {company.name}
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">Verified</span>
            </h1>
            <p className="text-gray-600 mt-2 italic">
              {company.description || 'No description available yet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Managers', value: managers.length, icon: '👥' },
          { label: 'Avg Rating', value: `⭐ ${company.avgRating}`, icon: '📊' },
          { label: 'Reviews', value: '—', icon: '📝' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-white border rounded-lg p-4 shadow-sm text-center hover:shadow-md transition"
          >
            <div className="text-2xl">{stat.icon}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            <div className="text-xl font-bold text-blue-800 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Rating Distribution */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <div className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
          📈 Rating Distribution
        </div>
        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          [Chart Placeholder]
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-center">
        <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow w-full">
          ⭐ Rate a Manager
        </button>
        <button
          onClick={() => navigate(`/companies/${company.name}/${company._id}/rate-company`)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow w-full"
        >
          🏢 Rate This Company
        </button>
      </div>

      {/* Trust Disclaimer */}
      <div className="text-sm text-green-600 text-center mb-12">
        All reviews are anonymous and verified for authenticity.
      </div>

      {/* Leadership Team */}
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Leadership Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map(m => (
          <div
            key={m._id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                {m.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.position}</p>
              </div>
            </div>
            <div className="mt-2 text-blue-700 text-sm">Rating: ⭐ {m.averageRating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}