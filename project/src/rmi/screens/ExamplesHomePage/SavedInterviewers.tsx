import React, { useEffect, useState } from 'react';

const SavedInterviewers: React.FC = () => {
  const [savedInterviewers, setSavedInterviewers] = useState<any[]>([]);


  useEffect(() => {
    const fetchSavedInterviewers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/user/saved', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedInterviewers(data.savedInterviewers);
        } else {
          console.error('Failed to fetch saved interviewers');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSavedInterviewers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Saved Interviewers</h2>
      {savedInterviewers?.length === 0 ? (
  <p>You have not saved any interviewers yet.</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {savedInterviewers?.map((interviewer: any) => (
      <div key={interviewer._id} className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold">{interviewer.name}</h3>
        <p>{interviewer.position} at {interviewer.company}</p>
        <p>Rating: {interviewer.rating}</p>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default SavedInterviewers;
