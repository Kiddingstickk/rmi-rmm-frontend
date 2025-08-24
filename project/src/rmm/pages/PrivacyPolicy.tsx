import React from 'react';

import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';



const PrivacyPolicy = () => {
  const { isLoggedIn, logout } = useAuth();
  
  return (
    <div className="bg-white min-h-screen">
    <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />

    <main className="min-h-screen bg-white text-gray-800 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Effective Date: July 28, 2025<br />
        Last Updated: July 28, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>Email address:</strong> Collected during account creation or login.</li>
          <li><strong>Session cookies:</strong> Used to maintain login state and navigation.</li>
          <li><strong>Review content:</strong> Submitted anonymously unless the user chooses to identify themselves.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>To authenticate users and manage accounts.</li>
          <li>To prevent spam and abuse.</li>
          <li>To improve platform functionality and user experience.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing and Disclosure</h2>
        <p className="text-sm">
          We do not sell, rent, or share your personal data with third parties. Data may be disclosed only if required by law or to protect platform integrity.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Data Retention and Deletion</h2>
        <p className="text-sm">
          You may request deletion of your account and associated data at any time by contacting <a href="mailto:support@ratemymanagement.com" className="text-blue-600 underline">support@ratemymanagement.com</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p className="text-sm">
          We implement reasonable technical and organizational measures to protect your data, including secure authentication and limited access controls.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Children’s Privacy</h2>
        <p className="text-sm">
          Our platform is not intended for users under the age of 13. We do not knowingly collect personal data from children.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
        <p className="text-sm">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
        <p className="text-sm">
          If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@ratemymanagement.com" className="text-blue-600 underline">support@ratemymanagement.com</a>.
        </p>
      </section>
    </main>
    </div>
  );
};

export default PrivacyPolicy;