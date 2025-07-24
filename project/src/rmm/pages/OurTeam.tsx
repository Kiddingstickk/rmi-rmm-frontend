import React from 'react';

const OurTeam = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meet the Team</h1>
      <p className="mb-8 text-lg">
        We're a group of engineers, designers, and workplace advocates committed to transparency in leadership.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Example team member */}
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Satyam Pandey</h3>
          <p className="text-sm text-gray-600">Founder & Product Architect</p>
          <p className="mt-2 text-sm">
            Passionate about building fair systems and empowering professionals through honest feedback.
          </p>
        </div>

        {/* Add more team members here */}
      </div>
    </main>
  );
};

export default OurTeam;