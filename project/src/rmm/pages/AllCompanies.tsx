import { useEffect, useState } from "react";
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';

interface Company {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  totalReviews: number;
  totalManagers: number;
  rating: number;
  createdAt: string;
  branches?: { location: { lat: number; lng: number } }[];
}

const { isLoggedIn, logout } = useAuth();


const Navbar = () => (
  <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
    <div className="text-xl font-bold text-blue-600">RateMyManagement</div>
    <div className="space-x-4">
      <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
      <a href="/rate-manager" className="text-gray-700 hover:text-blue-600">Rate a Manager</a>
      <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
    </div>
  </nav>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
);

const CompanyCard = ({ company }: { company: Company }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition w-full sm:w-[48%] md:w-[23%]">
    <h3 className="text-lg font-bold text-gray-800">{company.name}</h3>
    <p className="text-sm text-gray-600 mt-1">{company.tagline || "No tagline yet"}</p>
    <div className="mt-2 text-sm text-gray-500">
      {company.totalReviews} reviews • {company.totalManagers} managers
    </div>
    <div className="mt-1 text-sm font-medium text-blue-600">⭐ {company.rating.toFixed(1)}</div>
    <a
      href={`/management/companies/${company.slug}/${company._id}`}
      className="text-blue-600 mt-2 inline-block text-sm hover:underline"
    >
      View Company →
    </a>
  </div>
);

const AllCompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then(res => res.json())
      .then((data: Company[]) => {
        setCompanies(data);
        setLoading(false);
      });
  }, []);

  const topRated = [...companies]
    .filter(c => c.rating >= 4.2)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const recentlyAdded = [...companies]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <main className="bg-gray-100 min-h-screen">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />
      <section className="py-12 px-6 text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore workplaces reviewed by real employees</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Trusted reviews on managers and companies worldwide.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading companies...</p>
        ) : (
          <>
            <SectionTitle title="Top Rated Companies" />
            <div className="flex flex-wrap gap-4 mb-10">
              {topRated.map(company => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>

            <SectionTitle title="Recently Added" />
            <div className="flex flex-wrap gap-4 mb-10">
              {recentlyAdded.map(company => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bg-white py-10 px-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Company Locations</h2>
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          {/* Replace with Mapbox or Leaflet map */}
          [Map Placeholder]
        </div>
      </section>
    </main>
  );
};

export default AllCompaniesPage;
