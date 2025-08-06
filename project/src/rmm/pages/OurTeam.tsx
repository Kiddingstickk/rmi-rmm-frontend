import React, { useEffect } from 'react';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio: string;
}

const { isLoggedIn, logout } = useAuth();

const team: TeamMember[] = [
  {
    name: 'Kaleab Asmamaw',
    role: 'Founder & CEO',
    image: '/team/kaleab.jpg',
    bio: 'Kaleab Asmamaw is the Founder and CEO of Rate My Manager. He leads our mission to bring transparency and accountability to workplace leadership.',
  },
  {
    name: 'Satyam Pandey',
    role: 'Co-Founder & CTO',
    image: '/team/satyam.jpg',
    bio: 'Satyam Pandey is the Co-Founder and CTO of Rate My Manager. He drives our engineering efforts, building secure and scalable SaaS tools for workplace feedback.',
  },
];

const OurTeam = () => {
  useEffect(() => {
    const jsonLd = document.createElement('script');
    jsonLd.setAttribute('type', 'application/ld+json');
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Rate My Manager",
      "url": "https://ratemymanagement.com/team",
      "founders": team.map((member) => ({
        "@type": "Person",
        "name": member.name,
        "jobTitle": member.role,
        "description": member.bio,
        "image": `https://ratemymanagement.com${member.image}`,
      })),
    });
    document.head.appendChild(jsonLd);
    return () => {
      document.head.removeChild(jsonLd);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
    <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

    <main className="bg-white min-h-screen px-6 py-16 text-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Meet the Team</h1>
        <p className="text-lg text-gray-600 mb-12">
          Learn more about the people behind Rate My Manager — building tools for transparency and trust in the workplace.
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {team.map((member) => (
            <article
              key={member.name}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 text-left"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600 mb-4">
                  👤
                </div>
              )}
              <h2 className="text-xl font-semibold text-blue-700">{member.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{member.role}</p>
              <p className="text-sm text-gray-700">{member.bio}</p>
            </article>
          ))}
        </section>

        <div className="mt-12 text-center">
          <a href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold">
            Back to Home
          </a>
        </div>
      </div>
    </main>
    </div>
  );
};

export default OurTeam;