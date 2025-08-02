import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/ui/MainLayout';
import { getInterviewers } from '../../lib/api';
import { Button } from '../../components/ui/button';
import MinimalLoader from "../../components/ui/AnimatedLoader";

const ExampleHomePage = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState<'name' | 'company'>('name');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ SEO: Inject structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Rate My Interviewer",
      "description": "Search and rate interviewers and hiring managers. Share experiences anonymously to promote transparency.",
      "url": "https://ratemymanagement.com/search-interviewers",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ratemymanagement.com/search/{search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const toggleSearchMode = () =>
    setSearchMode((prev) => (prev === 'name' ? 'company' : 'name'));

  const searchInterviewers = async () => {
    if (!searchQuery) return setResults([]);
    setIsSearching(true);
    try {
      const data = await getInterviewers(searchQuery, searchMode);
      setResults(data);
    } catch (err) {
      console.error('Error fetching interviewers:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(searchInterviewers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/search/${searchQuery}`);
    }, 1200);
  };

  return (
    <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      <main className="w-full overflow-hidden">

        {/* ✅ Hero Section */}
        <section
          className="relative bg-cover bg-center text-white mt-[64px] pt-20 pb-32 px-6"
          style={{ backgroundImage: "url('/rmibg.avif')" }}
        >
          <div className="absolute inset-0 bg-black/30 z-0" />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">
              RATE MY INTERVIEWER
            </h1>
            <p className="text-lg max-w-3xl mx-auto text-gray-200 mb-10">
              Discover feedback from real candidates. Rate interviewers and managers anonymously, explore honest experiences, and share your own to empower others.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a href="/search-interviewers" className="bg-pastelYellow hover:bg-yellow-300 text-black px-6 py-3 rounded-md font-semibold">
                Search Interviewers
              </a>
              <a href="/rate-interviewer" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold">
                Rate Now
              </a>
            </div>
          </div>
        </section>

        {/* ✅ How It Works Section */}
        <section className="bg-neutralCanvas py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-deepGray mb-10">
              How it Works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 bg-white shadow rounded-lg flex flex-col justify-center items-center text-deepGray">
                <img src="/webpic.png" alt="Search interface icon for interviewer reviews" className="w-14 h-14 mb-4" />
                <p className="text-sm sm:text-base font-medium">Search by Interviewer Name or Company</p>
              </div>
              <div className="p-6 bg-white shadow rounded-lg flex flex-col justify-center items-center text-deepGray">
                <img src="/pencil.png" alt="Job position entry icon" className="w-14 h-14 mb-4" />
                <p className="text-sm sm:text-base font-medium">Add the position you interviewed for</p>
              </div>
              <div className="p-6 bg-white shadow rounded-lg flex flex-col justify-center items-center text-deepGray">
                <img src="/likedislike.png" alt="Review feedback icon" className="w-14 h-14 mb-4" />
                <p className="text-sm sm:text-base font-medium">Add your review</p>
              </div>
              <div className="p-6 bg-white shadow rounded-lg flex flex-col justify-center items-center text-deepGray">
                <img src="/detective.png" alt="Anonymous sharing icon" className="w-14 h-14 mb-4" />
                <p className="text-sm sm:text-base font-medium">Share to the world anonymously</p>
              </div>
            </div>

            <div className="mt-10">
              <a href="/contact" className="bg-pastelYellow text-black hover:bg-yellow-300 rounded-lg px-6 py-3 font-semibold">
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </main>
    </MainLayout>
  );
};

export default ExampleHomePage;