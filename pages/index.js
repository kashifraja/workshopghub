import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { useUser } from '../context/UserContext'; // Importing the useUser hook
import { useRouter } from 'next/router'; // Import useRouter

const HomePage = () => {
  const router = useRouter(); // Initialize useRouter
  const { user, logout } = useUser(); // Accessing user information from UserContext

  const handleLogout = async () => {
    await logout(); // Call the logout function from context
    router.push('/'); // Redirect to home page after logout
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>Welcome to ASIN Shop</h1>
        <p>Your one-stop solution for all your repair needs!</p>
        {user ? (
          <>
            <h5 className="mb-4">Welcome, {user.email}!</h5> {/* Display welcome message if user is logged in */}
            <button onClick={handleLogout} className="btn btn-primary">Sign Out</button>
          </>
        ) : (
          <Link href="/auth/login" className="btn btn-primary">Login</Link> // Show login link if user is not logged in
        )}
      </header>

      <nav className="mb-4">
        {user && (
          <ul className="nav nav-pills justify-content-center">
            <li className="nav-item">
              <button onClick={() => router.push('/jobtype')} className="btn btn-success">View Job Types</button> {/* Green button for job types */}
              <button onClick={() => router.push('/mechaniclist')} className="btn btn-info">View Mechanics</button> {/* Blue button for mechanics */}
              <button onClick={() => router.push('/repairlist')} className="btn btn-warning">View Repair Records</button> {/* Yellow button for repair records */}
            </li>
          </ul>
        )}
      </nav>

      <div className="text-center">
        <p>Explore our services and get started today!</p>
      </div>
    </div>
  );
};

export default HomePage;
