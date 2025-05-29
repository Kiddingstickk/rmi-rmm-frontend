// lib/api.ts

export interface Interviewer {
  _id: string;
  name: string;
  position: string;
  company: string;
}

// Base API URL: adjust via environment variable or fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch interviewers by name or company from the backend.
 * Now includes `searchMode` query param to utilize the `mode` argument
 */
export const getInterviewers = async (
  query: string,
  mode: 'name' | 'company'
): Promise<Interviewer[]> => {
  try {
    // Construct full endpoint URL including mode as a query param
    const url = `${BASE_URL}/api/interviewers/search/${encodeURIComponent(query)}?searchMode=${mode}`;

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Error response:', text);
      throw new Error(`Failed to fetch interviewers: ${res.status}`);
    }

    const data = await res.json();
    return data as Interviewer[];
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    return [];
  }
};

