const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDepartments = async () => {
  const res = await fetch(`${BASE_URL}/api/departments`);
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
};
