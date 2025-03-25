import React, { useEffect } from 'react'; // Importing useEffect for side effects

import { useUser } from '../context/UserContext'; // Importing the useUser hook
import { useRouter } from 'next/router';

const SignOut = () => {
  const { logout } = useUser(); // Accessing logout function from UserContext
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = () => {
      logout(); // Call logout function to clear user data
      router.push('/'); // Redirect to home page after signing out
    };

    handleSignOut(); // Automatically sign out and redirect when this component is rendered
  }, [logout, router]);

  return null; // No UI needed for sign-out
};

export default SignOut;
