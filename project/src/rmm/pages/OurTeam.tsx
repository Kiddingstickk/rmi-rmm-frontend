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
    image: '/kaleab.jpg',
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

    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/bggg.jpg')" }}
  >
      <main className=" min-h-screen px-6 py-16 text-gray-800">
        <div className="max-w-5xl mx-auto">

          {/* Team Section */}
          <section className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-600 mb-10">
              The people behind the platform — engineers, founders, and reformers committed to transparency and trust.
            </p>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
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
                  <h3 className="text-xl font-semibold text-blue-700">{member.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-700">{member.bio}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Mission Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Our Mission</h1>
            <p className="text-lg text-gray-700 mb-6">
              At Rate My Manager, we believe that transparency isn’t just a feature — it’s a foundation. Every employee deserves a workplace where leadership is accountable, feedback is valued, and mental health is protected.
            </p>
            <p className="text-md text-gray-600 mb-4">
              Our mission is to empower professionals to share honest experiences, uncover patterns of toxic behavior, and drive cultural reform from the ground up. We’re building tools that don’t just collect data — they spark conversations, protect careers, and challenge outdated norms.
            </p>
            <p className="text-md text-gray-600">
              Whether you're navigating a difficult manager, seeking clarity before your next job, or simply advocating for better leadership — Rate My Manager is your platform for truth, trust, and transformation.
            </p>
          </section>

          <section className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">What’s Next for Rate My Manager</h2>
            <p className="text-md text-gray-700 mb-4">
              We’re just getting started. Our roadmap includes anonymous company-level insights, manager improvement dashboards, and AI-powered pattern detection to help teams spot toxicity before it spreads.
            </p>
            <p className="text-md text-gray-600 mb-4">
              We're also working on integrations with job boards, resume builders, and mental health resources — so users can make informed career decisions with confidence and clarity.
            </p>
            <p className="text-md text-gray-600">
              Our long-term vision? To become the global standard for leadership accountability and workplace transparency — where every manager is rated not just by performance, but by humanity.
            </p>
          </section>


          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              Back to Home
            </a>
          </div>
        </div>
      </main>
      </div>

    </div>
  );
};

export default OurTeam;