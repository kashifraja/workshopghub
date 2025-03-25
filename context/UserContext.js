import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Importing the Supabase client

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state as null

  useEffect(() => {
    const fetchSession = async () => {
      // Fetch session from Supabase

      console.log("Fetching session..."); // Debug log

      const { data: { session }, error } = await supabase.auth.getSession(); // Check current session
      if (error) {
        console.error("Error fetching session:", error.message); // Log error if fetching session fails
      } else if (session) {
        console.log("Session found:", session); // Debug log

        setUser(session.user); // Set user state from session
      } else {
        console.error("No active session found."); // Log error if no session
        setUser(null); // Clear user state if no session

      }
    };

    fetchSession(); // Call the fetchSession function

    // Retrieve user from local storage if available
    const storedUser = localStorage.getItem('user'); // Retrieve user from local storage
    if (storedUser) {
      console.log("User retrieved from local storage:", JSON.parse(storedUser)); // Log retrieved user
      setUser(JSON.parse(storedUser)); // Set user state from local storage
    }
  }, []); // Run once on component mount

    const login = async (email, password) => {
      // Log in user with Supabase

    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log("User object returned from Supabase:", user); // Log the user object after login
    setUser(user); // Set user data on login
    localStorage.setItem('user', JSON.stringify(user)); // Save user to local storage
  };

    const logout = async () => {
      // Log out user from Supabase

    await supabase.auth.signOut(); // Sign out from Supabase
    console.log("User logged out"); // Log logout action
    setUser(null); // Clear user data on logout
    localStorage.removeItem('user'); // Remove user from local storage
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
