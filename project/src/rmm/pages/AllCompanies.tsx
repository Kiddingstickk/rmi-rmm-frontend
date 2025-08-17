import { useEffect, useState } from "react";

interface Company {
    _id: string;
    name: string;
    slug: string;
    tagline?: string;
    totalReviews: number;
    totalManagers: number;
  }

const HeroSection = () => (
  <section className="py-16 px-6 text-center bg-gray-50">
    <h1 className="text-4xl font-bold mb-4 text-gray-800">Explore Reviewed Companies</h1>
    <p className="text-gray-600 max-w-xl mx-auto">
      Browse companies rated by professionals across industries. Discover leadership, culture, and workplace insights.
    </p>
  </section>
);

const CompanyCard = ({ company }: { company: Company }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition">
    <h3 className="text-2xl font-bold text-gray-800">{company.name}</h3>
    {company.tagline && <p className="text-gray-600 mt-1">{company.tagline}</p>}
    <div className="mt-2 text-sm text-gray-500">
      {company.totalReviews} reviews • {company.totalManagers} managers
    </div>
    <a
      href={`/management/companies/${company.slug}/${company._id}`}
      className="text-blue-600 mt-3 inline-block font-medium hover:underline"
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

  return (
    <main className="bg-gray-100 min-h-screen">
      <HeroSection />
      <section className="max-w-4xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading companies...</p>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No companies have been reviewed yet.</p>
            <a href="/rate-manager" className="text-blue-600 underline">Be the first to rate a manager</a>
          </div>
        ) : (
          companies.map(company => (
            <CompanyCard key={company._id} company={company} />
          ))
        )}
      </section>
    </main>
  );
};

export default AllCompaniesPage;