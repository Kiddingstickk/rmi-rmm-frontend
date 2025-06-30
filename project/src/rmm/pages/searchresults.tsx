import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DepartmentCard from "../components/departments/DepartmentCard";
import ManagerCard from "../components/departments/ManagerCard";
import { Link } from "react-router-dom";

type Department = {
  _id: string;
  name: string;
  managerCount: number;
  averageRating: number;
};

type Manager = {
  _id: string;
  name: string;
  department: { _id: string; name: string };
  position: string;
  averageRating: number;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [departmentResults, setDepartmentResults] = useState<Department[]>([]);
  const [managerResults, setManagerResults] = useState<Manager[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (res.ok) {
          setDepartmentResults(data.departments || []);
          setManagerResults(data.managers || []);
        } else {
          console.error("Search failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  console.log("Managers for", query, managerResults);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      

      {departmentResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Departments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentResults.map((dept) => (
              <DepartmentCard
                key={dept._id}
                name={dept.name}
                managerCount={dept.managerCount}
                averageRating={dept.averageRating}
              />
            ))}
          </div>
        </div>
      )}

      {managerResults.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Managers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managerResults.map((manager) => (
              <Link to={`/rmm/management/managers/${manager._id}`} key={manager._id}>
                <ManagerCard
                  
                  name={manager.name}
                  department={manager.department.name}
                  position={manager.position}
                  averageRating={typeof manager.averageRating === "number" ? manager.averageRating : 0}

                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {managerResults.length === 0 && departmentResults.length === 0 && (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
