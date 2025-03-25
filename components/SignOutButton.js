import React from 'react';
import { useUser } from '../context/UserContext'; // Importing the useUser hook
import { useRouter } from 'next/router';

const SignOutButton = () => {
  const { logout } = useUser() || {}; // Accessing logout function from UserContext with error handling

  const router = useRouter();

  const handleSignOut = () => {
    if (logout) {
      logout(); // Call logout function to clear user data
    } else {
      console.error("Logout function is not available."); // Log error if logout is not available
    }

    router.push('/'); // Redirect to home page after signing out
  };

  return (
    <button onClick={handleSignOut} className="mt-3 btn btn-danger">

      Sign Out
    </button>
  );
};

export default SignOutButton;
