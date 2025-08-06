import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';


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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/companies/search/company/_/${id}`).then(res => setData(res.data));
  }, [id]);

  if (!data) return <div className="p-8">Loading...</div>;

  const { company, managers } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-800">
      {/* Company Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900">{company.name}</h1>
        <p className="text-gray-600 mt-2">{company.description || 'No description available yet.'}</p>
        <div className="mt-2 text-lg font-semibold text-blue-700">
          Average Rating: ⭐ {company.avgRating}
        </div>
        <div className="mt-1 text-sm text-green-600">All reviews are anonymous and verified</div>
      </div>

      {/* Leadership Team */}
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Leadership Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map(m => (
          <div key={m._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-900">{m.name}</h3>
            <p className="text-gray-500">{m.position}</p>
            <div className="mt-2 text-blue-700">Rating: ⭐ {m.averageRating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}