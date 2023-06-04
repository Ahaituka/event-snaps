'use client'

import { signOut } from 'next-auth/react';
import React from 'react';

interface HostDashboardProps {
  // You may have to pass in some props, 
  // like a callback function to update some state in the parent component
}

const HostDashboard: React.FC<HostDashboardProps> = (props) => {
  const handleGuestSite = () => {
    // Implement the function to upload images to Google Drive here
  };

  const handleCreateLink = () => {
    // Implement the function to create a unique shareable link here
  };

  return (
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl font-bold mt-20 mb-10">Host Dashboard</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
        onClick={handleGuestSite}
      >
        Customise Guest Website
      </button>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mr-4"
        onClick={handleCreateLink}
      >
        Create Shareable Link
      </button>

      <button
        className="bg-red-500 text-white py-2 px-4 rounded"
        onClick={() => signOut()}
      >
         Sign out
      </button>
      
    </div>
  );
};

export default HostDashboard;
