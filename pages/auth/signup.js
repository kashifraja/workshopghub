import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link'; // Importing Link for navigation
import { useRouter } from 'next/router';
import { useUser } from '../../context/UserContext'; // Importing useUser to access setUser

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setUser } = useUser(); // Accessing setUser from UserContext

  const handleSignup = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      setUser(user); // Set user state in context after successful signup
      router.push({ pathname: '/', query: { message: `Successfully signed up as ${email}!` }}); // Redirect to home page with success message
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
