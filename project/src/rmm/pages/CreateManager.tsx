import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";
import {
  UserPlus,
  Search,
  UserRound,
  Building2,
  BriefcaseBusiness,
  Star,
  MessageSquareText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const ManagerNotListed = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <Navbar isLoggedIn={false} onLogout={() => {}} />

      {/* Hero */}
      <section className="bg-gray-50 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-6">
            <UserPlus size={28} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5">
            Can't Find Your Manager?
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            If your manager isn't listed on Rate My Manager, you can add them
            while submitting your first review. The manager profile is created
            together with your review.
          </p>
        </div>
      </section>

      {/* First Search */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Search Before Adding a Manager
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Before adding a new manager, search by their name or company to
              make sure a profile doesn't already exist. This helps avoid
              creating duplicate profiles for the same manager.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Search by Name */}
            <div className="border border-gray-200 rounded-xl p-7 bg-white shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <UserRound size={24} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search by Name
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Search using your manager's first name, last name, or both to
                see whether their profile is already available.
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
                You can also search for your company and check whether your
                manager is already listed there.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/search-managers")}
              className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-7 py-3 rounded-md font-semibold transition"
            >
              Search Managers
              <Search size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Add Manager + Review Flow */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Adding a Manager Works
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A manager profile isn't created as an empty profile. You add the
              manager by submitting your first review about them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <span className="font-bold">1</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Enter Manager Details
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Provide basic information such as the manager's name, position,
                company, and other relevant workplace details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <span className="font-bold">2</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Rate the Manager
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Give an overall rating and rate different areas of their
                management, including leadership, communication, teamwork,
                empathy, and fairness.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <span className="font-bold">3</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Share Your Experience
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Answer the review questions and describe your experience
                working with the manager in your own words.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-5">
                <span className="font-bold">4</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Submit Your Review
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Once your review is submitted, the manager profile and the
                first review are created together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Rate */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You'll Rate
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Your review isn't limited to one overall score. You can provide
              feedback across several areas of management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Leadership */}
            <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Star size={22} />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                Leadership
              </h3>

              <p className="text-sm text-gray-600">
                How effectively does the manager lead their team?
              </p>
            </div>

            {/* Communication */}
            <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <MessageSquareText size={22} />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                Communication
              </h3>

              <p className="text-sm text-gray-600">
                How clearly does the manager communicate?
              </p>
            </div>

            {/* Teamwork */}
            <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <UserRound size={22} />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                Teamwork
              </h3>

              <p className="text-sm text-gray-600">
                How well does the manager work with their team?
              </p>
            </div>

            {/* Empathy */}
            <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <UserRound size={22} />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                Empathy
              </h3>

              <p className="text-sm text-gray-600">
                Does the manager understand and consider their employees?
              </p>
            </div>

            {/* Fairness */}
            <div className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={22} />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                Fairness
              </h3>

              <p className="text-sm text-gray-600">
                Does the manager treat employees fairly and consistently?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Review Questions */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Share What Your Experience Was Like
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Your written feedback adds context to the ratings and helps
              others understand what working with the manager was actually
              like.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Leadership
              </h3>

              <p className="text-gray-600">
                What’s one thing your manager did that showed strong or weak
                leadership?
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Communication
              </h3>

              <p className="text-gray-600">
                How clearly did your manager communicate goals or expectations?
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Support
              </h3>

              <p className="text-gray-600">
                Did you feel supported in your role? Why or why not?
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Your Review
              </h3>

              <p className="text-gray-600">
                Share any additional experience or context that you believe
                would help someone understand what it was like working with
                this manager.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Anonymous */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 text-white rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={28} />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Your Review Is Anonymous by Default
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Rate My Manager is designed to give employees a place to share
              honest workplace experiences without putting their identity at
              the center of the review.
            </p>

            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mt-4">
              Your feedback can help others understand what working with a
              manager may be like while keeping the focus on the experience
              being shared.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Add Your Manager?
          </h2>

          <p className="text-gray-600 mb-8">
            If you couldn't find your manager, you can add them while
            submitting your first review.
          </p>

          <button
            onClick={() => navigate("/rate-manager")}
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-7 py-3 rounded-md font-semibold transition"
          >
            Rate a Manager
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ManagerNotListed;