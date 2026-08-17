//mport React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";
import {
  Search,
  UserRound,
  Building2,
  Star,
  MessageSquareText,
  UsersRound,
  ArrowRight,
  UserPlus,
} from "lucide-react";

const FindYourManager = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={false} onLogout={() => {}} />

      {/* Hero */}
      <section className="bg-gray-50 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-6">
            <Search size={28} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5">
            How to Find Your Manager
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Looking for your manager on Rate My Manager? Search by their name
            or company to find their profile and explore workplace feedback.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Search for a Manager
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              You can search Rate My Manager using your manager's name or the
              company they work for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Search by Name */}
            <div className="border border-gray-200 rounded-xl p-7 bg-white shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <UserRound size={24} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search by Manager Name
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Enter your manager's first name, last name, or both to look
                for their profile. If they are already listed on Rate My
                Manager, their profile should appear in the search results.
              </p>
            </div>

            {/* Search by Company */}
            <div className="border border-gray-200 rounded-xl p-7 bg-white shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Building2 size={24} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search by Company
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Don't remember your manager's full name? Search for their
                company instead and explore the managers associated with that
                organization.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/search-managers")}
              className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-7 py-3 rounded-md font-semibold transition"
            >
              Search Managers
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Can You Find on a Manager Profile?
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Once you find a manager, their profile gives you a better idea
              of how employees have experienced their leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rating */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-5">
                <Star size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Overall Rating
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                See the manager's overall rating based on the reviews submitted
                by employees.
              </p>
            </div>

            {/* Manager Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <UserRound size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manager Information
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Find information such as the manager's position, company, and
                other profile details.
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-5">
                <MessageSquareText size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Employee Reviews
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Read experiences shared by employees who have worked with the
                manager.
              </p>
            </div>

            {/* Leadership */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <UsersRound size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Leadership Feedback
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Explore feedback about different aspects of management,
                including leadership, communication, teamwork, empathy, and
                fairness.
              </p>
            </div>

            {/* Company */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Building2 size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Information
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                See which company the manager is associated with and explore
                other managers from the same organization.
              </p>
            </div>

            {/* Reviews & Ratings */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                <Star size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Rating Breakdown
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Get more context than a single overall score by looking at the
                different areas employees have rated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manager Not Found */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 text-white rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <UserPlus size={27} />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Can't Find Your Manager?
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              If your manager isn't listed yet, you can create a manager
              profile so employees can share their workplace experiences.
            </p>

            <button
              onClick={() => navigate("/rate-manager")}
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-7 py-3 rounded-md font-semibold transition"
            >
              Create a Manager Profile
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Ready to find your manager?
          </h2>

          <p className="text-gray-600 mb-7">
            Search Rate My Manager to discover manager profiles and workplace
            experiences.
          </p>

          <button
            onClick={() => navigate("/search-managers")}
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-7 py-3 rounded-md font-semibold transition"
          >
            Search Managers
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default FindYourManager;