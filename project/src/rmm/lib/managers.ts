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
    const url = `${BASE_URL}/api/managers/search/${encodeURIComponent(query)}?searchMode=${mode}`;

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



// rmm/api/managers.ts


export const createManager = async (data: {
    name: string;
    position: string;
    branch?: string;
    departmentId: string;
    bio?: string;
    company?: string;
  }) =>  {
  const res = await fetch(`${BASE_URL}/api/managers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Manager creation failed');
  return res.json();
};



export const submitManagerReview = async ({
    managerId,
    rating,
    reviewText,
    anonymous,
    leadership,
    communication,
    teamwork,
    empathy,
    fairness,
  
  }: {
    managerId: string;
    rating: number;
    reviewText: string;
    anonymous: boolean;
    leadership: number;
    communication: number;
    teamwork: number;
    empathy: number;
    fairness: number;
  
  }) => {
    const res = await fetch(`${BASE_URL}/api/manager-reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        managerId,
        rating,
        reviewText,
        anonymous,
        leadership,
        communication,
        teamwork,
        empathy,
        fairness,
      }),
    });
  
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  };
