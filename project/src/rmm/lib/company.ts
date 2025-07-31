const BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const getCompanies = async (query?: string) => {
  const url = query
    ? `${BASE_URL}/api/companies?search=${encodeURIComponent(query)}`
    : `${BASE_URL}/api/companies`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch companies');
  return res.json();
};

export const createCompany = async ({ name }: { name: string }) => {
  const res = await fetch(`${BASE_URL}/api/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error('Failed to create company');
  return res.json();
};