// rmm/api/managers.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-p0ja.onrender.com';

export interface Manager {
    _id: string;
    name: string;
    company?: string;
    department?: string;
    // add any other fields you want to render in search results
  }
  


export const getManagers = async (
  query: string,
  mode: 'name' | 'company'
): Promise<Manager[]> => {
  try {
    const url = `${BASE_URL}/api/rmm/managers/search/${encodeURIComponent(query)}?searchMode=${mode}`;

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch managers: ${res.status}`);
    }

    const data = await res.json();
    return data as Manager[];
  } catch (error) {
    console.error('Error fetching managers:', error);
    return [];
  }
};
