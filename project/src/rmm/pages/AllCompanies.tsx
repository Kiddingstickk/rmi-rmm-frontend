import { useRef, useEffect, useState } from "react";
import ResponsiveNavbar from "../components/Navbar/navbar";
import { useAuth } from "../../rmi/lib/useAuth";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface Branch {
  city: string;
  location?: { lat: number; lng: number };
}

interface Company {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  totalReviews: number;
  totalManagers: number;
  rating: number;
  createdAt: string;
  branchIds?: string[];
}

const { isLoggedIn, logout } = useAuth();

const CompanyMap = ({
  locations,
}: {
  locations: { company: string; city: string; lat: number; lng: number }[];
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20, lng: 78 },
      zoom: 3,
    });

    locations.forEach(({ company, city, lat, lng }) => {
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: `${company} — ${city}`,
      });
    });
  }, [locations]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
};

const fetchBranches = async (ids: string[]): Promise<Branch[]> => {
  const response = await fetch(`https://backend-p0ja.onrender.com/api/branches?ids=${ids.join(",")}`);
  const data = await response.json();
  return data as Branch[];
};


const geocodeCity = async (
  city: string
): Promise<{ city: string; lat: number; lng: number }> => {
  const response = await fetch("https://backend-p0ja.onrender.com/api/geocode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city }),
  });

  const data: { lat: number; lng: number } = await response.json();
  return { city, lat: data.lat, lng: data.lng };
};

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
    <div className="mt-1 text-sm font-medium text-blue-600">
      ⭐ {company.rating.toFixed(1)}
    </div>
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
  const [locations, setLocations] = useState<
    { company: string; city: string; lat: number; lng: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then(async (data: Company[]) => {
        setCompanies(data);
        setLoading(false);

        const allLocations: {
          company: string;
          city: string;
          lat: number;
          lng: number;
        }[] = [];

        for (const company of data) {
          if (!company.branchIds?.length) continue;

          try {
            const branches = await fetchBranches(company.branchIds);
            const uniqueCities = [...new Set(branches.map((b: any) => b.city))];

            for (const city of uniqueCities) {
              try {
                const { lat, lng } = await geocodeCity(city);
                allLocations.push({ company: company.name, city, lat, lng });
              } catch {
                console.warn(`Failed to geocode ${city}`);
              }
            }
          } catch {
            console.warn(`Failed to fetch branches for ${company.name}`);
          }
        }

        setLocations(allLocations);
      });
  }, []);

  const topRated = [...companies]
    .filter((c) => c.rating >= 4.2)
    .sort((a: Company, b: Company) => b.rating - a.rating)
    .slice(0, 4);

  const recentlyAdded = [...companies]
    .sort(
      (a: Company, b: Company) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  return (
    <main className="bg-gray-100 min-h-screen">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />
      <section className="py-12 px-6 text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Explore workplaces reviewed by real employees
        </h1>
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
              {topRated.map((company) => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>

            <SectionTitle title="Recently Added" />
            <div className="flex flex-wrap gap-4 mb-10">
              {recentlyAdded.map((company) => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bg-white py-10 px-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Company Locations
        </h2>
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <CompanyMap locations={locations} />
        </div>
      </section>
    </main>
  );
};

export default AllCompaniesPage;