const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDepartments = async (query?: string) => {
    const url = query
      ? `${BASE_URL}/api/departments?search=${encodeURIComponent(query)}`
      : `${BASE_URL}/api/departments`;
  
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  };
  


export const createDepartment = async ({ name }: { name: string }) => {
  const res = await fetch(`${BASE_URL}/api/departments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error('Failed to create department');
  return res.json();
};
