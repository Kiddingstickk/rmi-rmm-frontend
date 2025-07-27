import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { useAuth } from "./rmi/lib/useAuth";

// Import components
//import ExampleHomePage from "./rmi/screens/ExamplesHomePage";
import InterviewerList from './rmi/screens/ExamplesHomePage/interviewerlist';
import SearchResults from './rmi/screens/ExamplesHomePage/SearchResults'; 
import InterviewerProfile from './rmi/screens/ExamplesHomePage/InterviewerProfile';// Assuming the path is './screens/SearchResults'
import SignIn from './rmi/screens/ExamplesHomePage/SignIn';
import Register from './rmi/screens/ExamplesHomePage/Register';
import VerifyOtp from './rmi/screens/ExamplesHomePage/VerifyOTP';
import AddInterviewer from './rmi/screens/ExamplesHomePage/AddInterviewer';
import Profile from "./rmi/screens/ExamplesHomePage/Profile";
import MyReviews from './rmi/screens/ExamplesHomePage/MyReviews';
import ContactPage from './rmi/screens/ExamplesHomePage/ContactPage';
import AccountSettings from './rmi/screens/ExamplesHomePage/AccountsSettingPage';
import SavedInterviewers from "./rmi/screens/ExamplesHomePage/SavedInterviewers";
import SearchInterviewer from './rmi/screens/ExamplesHomePage/SearchInterviewer'; 
import RateInterviewer from './rmi/screens/ExamplesHomePage/RateInterviewer';






import RmmLanding from './rmm/pages/RmmLanding';
import ManagementHome from './rmm/pages/ManagementHome';
import DepartmentPage from './rmm/pages/DepartmentPage';
import ManagerProfile from './rmm/pages/ManagerProfile';
import RmmSearchResults from './rmm/pages/searchresults';
import SearchManager from './rmm/pages/SearchManager';
import RateManager from './rmm/pages/RateManager';
import OurTeam from './rmm/pages/OurTeam';
import PrivacyPolicy from './rmm/pages/PrivacyPolicy';
import TermsOfService from './rmm/pages/TermsOfService';





// Tailwind CSS import (No need to change this)
import "../tailwind.css";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
};



// App component that includes routes
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<RmmLanding />} />

        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        
        <Route path="/interviewers/:id" element={<InterviewerProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/saved" element = {<SavedInterviewers />}/>


        

        {/* Interviewer List Page Route */}
        <Route path="/interviewers" element={<InterviewerList />} />
        <Route path="/add-interviewer" element={<AddInterviewer />} />
        {/* Search Results Page Route (Dynamic route) */}
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/search-interviewers" element={<SearchInterviewer />} />
        <Route path="/rate-interviewer" element={<RateInterviewer />} />



        {/* RMM Routes */}
       
        <Route path="/Home" element={<ManagementHome />} />
        <Route path="/management/departments/:name" element={<DepartmentPage />} />
        <Route path="/management/managers/:id" element={<ManagerProfile />} />
        <Route path="/searchresults" element={<RmmSearchResults />} />
        <Route path="/search-managers" element={<SearchManager />} />
        <Route path="/rate-manager" element={<ProtectedRoute><RateManager /></ProtectedRoute>}/>
        <Route path="/team" element={<OurTeam />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

       




      </Routes>
    </Router>
  );
};

// Render the app to the DOM
createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

