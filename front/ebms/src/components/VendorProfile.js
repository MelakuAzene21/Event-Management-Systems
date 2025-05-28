import React from 'react';
import ProfileOverview from './ProfileOverview';
import Portfolio from './Portfolio';

const VendorProfile = () => {
  return (
    <div className="min-h-screen bg-white p-4">
      {/* Profile Header
      <div className="mb-6">
        <ProfileHeader />
      </div> */}

      {/* Profile Overview */}
      <div className="mb-6">
        <ProfileOverview />
      </div>

      {/* Portfolio */}
      <div>
        <Portfolio />
      </div>
    </div>
  );
};

export default VendorProfile;