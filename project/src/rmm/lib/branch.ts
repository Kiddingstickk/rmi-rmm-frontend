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
    body: JSON.stringify({ name, companyId, city, location: Array.isArray(location) ? location : [location]
    }),
  });

  if (!res.ok) throw new Error('Failed to create branch');
  return res.json();
};



export const findOrCreateBranch = async (
  companyId: string,
  city: string,
  location: string
) => {
  console.log('[Branch] 🔍 Searching for branches with city:', city);

  let branches;
  try {
    branches = await getBranches(city.trim());
    console.log('[Branch] ✅ Fetched branches:', branches);
  } catch (err) {
    console.error('[Branch] ❌ Failed to fetch branches:', err);
    throw new Error('Branch fetch failed');
  }

  const match = branches.find(
    (b: any) => b.city.toLowerCase() === city.toLowerCase()
  );

  if (match) {
    console.log('[Branch] 🔁 Found existing branch:', match);

    try {
      const updatedBranch = await createBranch({
        name: match.city.trim(),
        companyId,
        city: match.city,
        location,
      });
      console.log('[Branch] ✅ Updated existing branch with company/location:', updatedBranch);
      return updatedBranch;
    } catch (err) {
      console.error('[Branch] ❌ Failed to update existing branch:', err);
      throw new Error('Branch update failed');
    }
  }

  console.log('[Branch] 🆕 No branch found — creating new one');

  try {
    const newBranch = await createBranch({
      name: city.trim(),
      companyId,
      city,
      location,
    });
    console.log('[Branch] ✅ Created new branch:', newBranch);
    return newBranch;
  } catch (err) {
    console.error('[Branch] ❌ Failed to create new branch:', err);
    throw new Error('Branch creation failed');
  }
};