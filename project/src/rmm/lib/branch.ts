const BASE_URL = import.meta.env.VITE_API_BASE_URL;



/** Fetch branches matching a search term (name, city, location) */
export const getBranches = async (query?: string) => {
  const url = query
    ? `${BASE_URL}/api/branches?search=${encodeURIComponent(query)}`
    : `${BASE_URL}/api/branches`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch branches');
  return res.json();
};

/** Create a new branch with company linkage */
export const createBranch = async ({
  name,
  companyId,
  city,
  location = '',
}: {
  name: string;
  companyId: string;
  city: string;
  location?: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/branches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name, companyId, city, location }),
  });

  if (!res.ok) throw new Error('Failed to create branch');
  return res.json();
};




export const findOrCreateBranch = async (
  companyId: string,
  city: string,
  location: string
) => {
  const query = `${city} ${location}`.trim(); // Broad fuzzy match
  const branches = await getBranches(query);

  const match = branches.find(
    (b: any) =>
      Array.isArray(b.company) &&
      b.company.some((c: any) => c._id === companyId)&&
      b.city.toLowerCase() === city.toLowerCase() &&
      b.location.toLowerCase() === location.toLowerCase()
  );

  if (match) return match;

  // Create if not found
  return await createBranch({
    name: `${city}${location ? ' - ' + location : ''}`,
    companyId,
    city,
    location,
  });
};