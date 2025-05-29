import React from 'react';

const AccountSettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Account Settings</h1>

      {/* Profile Info */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile Info</h2>
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input type="text" className="mt-1 w-full border rounded p-2" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input type="email" className="mt-1 w-full border rounded p-2 bg-gray-100 cursor-not-allowed" disabled value="you@example.com" />
          </div>
          <div className="text-sm text-gray-500">Joined: Jan 1, 2024</div>
        </div>
      </section>

      {/* Your Activity */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Activity</h2>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-600">You can manage your reviews and saved interviewers here. (To be implemented)</p>
        </div>
      </section>

      {/* Security */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Security</h2>
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Change Password</label>
            <input type="password" className="mt-1 w-full border rounded p-2" placeholder="New password" />
          </div>
          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Update Password</button>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
        <div className="bg-red-50 border border-red-200 rounded-xl shadow p-4">
          <p className="text-red-700 mb-2">Deleting your account is irreversible. All your data will be lost.</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Account</button>
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;