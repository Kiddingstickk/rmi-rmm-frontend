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



{/* 🚀 Hero Section */}
{/* 🚀 Hero Section */}
<section
  className="relative bg-cover bg-center text-white mt-[64px] pt-20 pb-32 px-6"
  style={{ backgroundImage: "url('/rmibg.avif')" }} // Replace with your actual image path
>
  <div className="absolute inset-0 bg-black/30 z-0" />
  <div className="relative z-10 text-center">
    <h2 className="text-4xl sm:text-6xl font-extrabold mb-10">
      RATE MY INTERVIEWER
    </h2>
    <div className="flex justify-center gap-6 flex-wrap">
      <button
        onClick={() => navigate('/search-interviewers')}
        className="bg-pastelYellow hover:bg-yellow-300 text-black px-6 py-3 rounded-md font-semibold"

      >
        Search Interviewers
      </button>
      <button
        onClick={() => navigate('/rate-interviewer')}
        className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold"
      >
        Rate Now
      </button>
    </div>
  </div>
</section>


<section className="bg-neutralCanvas dark:bg-gray-900 py-16 px-6">
  <div className="max-w-6xl mx-auto text-center">
    <h3 className="text-3xl sm:text-4xl font-bold text-deepGray dark:text-white mb-10">
      How it Works
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {/* Card 1 */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg flex flex-col justify-center items-center text-deepGray dark:text-white">
        <img src="/webpic.png" alt="Search" className="w-14 h-14 mb-4" />
        <p className="text-sm sm:text-base font-medium">Search by Interviewer Name or Company</p>
      </div>

      {/* Card 2 */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg flex flex-col justify-center items-center text-deepGray dark:text-white">
        <img src="/pencil.png" alt="Position" className="w-14 h-14 mb-4" />
        <p className="text-sm sm:text-base font-medium">Add the position you interviewed for</p>
      </div>

      {/* Card 3 */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg flex flex-col justify-center items-center text-deepGray dark:text-white">
        <img src="/likedislike.png" alt="Review" className="w-14 h-14 mb-4" />
        <p className="text-sm sm:text-base font-medium">Add your review</p>
      </div>

      {/* Card 4 */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg flex flex-col justify-center items-center text-deepGray dark:text-white">
        <img src="/detective.png" alt="Anonymous" className="w-14 h-14 mb-4" />
        <p className="text-sm sm:text-base font-medium">Share to the world anonymously</p>
      </div>
    </div>

    <div className="mt-10">
      <Button
        onClick={() => navigate('/contact')}
        className="bg-pastelYellow text-black hover:bg-yellow-300 rounded-lg px-6 py-3 font-semibold"
      >
        Contact Us
      </Button>
    </div>
  </div>
</section>
</main>

  </MainLayout>
  );
};

export default ExampleHomePage