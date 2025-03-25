import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link'; // Importing Link for navigation
import { useRouter } from 'next/router';
import { useUser } from '../../context/UserContext'; // Importing useUser to access setUser

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setUser } = useUser(); // Accessing setUser from UserContext

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });

    
    if (error) {
      setError(error.message);
    } else {
      setUser(user); // Set user state in context after successful login
      router.push('/'); // Redirect to home page
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link href="/auth/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
