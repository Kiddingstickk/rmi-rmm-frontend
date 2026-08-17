//import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";
import { useAuth } from '../../rmi/lib/useAuth';

const FindManager = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Find Your Manager
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Looking for a manager you've worked with? Search Rate My Manager
            by manager name or company to find their profile and explore
            workplace reviews.
          </p>

          <button
            onClick={() => navigate("/search-managers")}
            className="mt-8 bg-black hover:bg-gray-800 text-white px-7 py-3 rounded-md font-semibold transition"
          >
            Search Managers →
          </button>
        </div>
      </section>

      {/* How to Find Your Manager */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Find Your Manager
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Finding a manager on Rate My Manager only takes a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mb-5">
                1
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Search by Name
              </h3>

              <p className="text-gray-600 leading-relaxed">
                If you know your manager's name, start by searching for them
                directly. Enter their name into the manager search and look
                through the available results.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mb-5">
                2
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Search by Company
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Don't remember your manager's exact name? You can search by
                company and explore the managers associated with that
                organization.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mb-5">
                3
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Check the Profile
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Once you find a potential match, check their name, position,
                company, and other available information to make sure you've
                found the right manager.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* What You'll Find */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Can You Find on a Manager Profile?
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              A manager profile brings together information and workplace
              experiences shared by professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ⭐ Overall Rating
              </h3>

              <p className="text-gray-600">
                See the manager's overall rating based on reviews submitted by
                professionals.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📊 Leadership Ratings
              </h3>

              <p className="text-gray-600">
                Explore ratings across different aspects of management,
                including leadership, communication, teamwork, empathy, and
                fairness.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🏢 Company & Position
              </h3>

              <p className="text-gray-600">
                Check the company and position associated with the manager to
                help distinguish them from people with similar names.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                💬 Workplace Reviews
              </h3>

              <p className="text-gray-600">
                Read experiences shared by other professionals who have worked
                with the manager.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Can't Find Manager */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Can't Find Your Manager?
          </h2>

          <p className="text-gray-600 leading-relaxed mb-8">
            Not every manager has a profile on Rate My Manager yet. If you've
            searched by name and company and still can't find them, you can
            create a new manager profile and then share your experience.
          </p>

          <button
            onClick={() => navigate("/rate-manager")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-md font-semibold transition"
          >
            Create a Manager Profile →
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Manager?
          </h2>

          <p className="text-gray-300 mb-8">
            Search by name or company and see what professionals are saying
            about workplace leadership.
          </p>

          <button
            onClick={() => navigate("/search-managers")}
            className="bg-white text-gray-900 hover:bg-gray-200 px-7 py-3 rounded-md font-semibold transition"
          >
            Search Managers →
          </button>
        </div>
      </section>

    </div>
  );
};

export default FindManager;