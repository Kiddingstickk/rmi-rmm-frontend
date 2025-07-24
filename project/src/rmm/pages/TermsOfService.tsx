import React from 'react';

const TermsOfService = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        By using Rate My Manager, you agree to the following terms:
      </p>

      <ul className="list-disc pl-6 space-y-3 text-sm">
        <li>You must be truthful and respectful in your reviews.</li>
        <li>We reserve the right to moderate or remove inappropriate content.</li>
        <li>Accounts may be suspended for violating community guidelines.</li>
        <li>Use of this platform does not constitute legal advice or employment action.</li>
      </ul>
    </main>
  );
};

export default TermsOfService;