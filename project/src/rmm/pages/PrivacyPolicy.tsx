import React from 'react';

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This policy outlines how we collect, use, and protect your data.
      </p>

      <ul className="list-disc pl-6 space-y-3 text-sm">
        <li>We collect minimal personal data required for account creation and review submission.</li>
        <li>We do not sell or share your data with third parties.</li>
        <li>All reviews are anonymous unless explicitly stated otherwise.</li>
        <li>You can request data deletion by contacting support@ratemymanager.com.</li>
      </ul>
    </main>
  );
};

export default PrivacyPolicy;