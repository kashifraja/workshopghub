import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient'; // Ensure you have a supabase client setup

const Login = () => {
  const router = useRouter(); // Initialize useRouter

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/'); // Redirect to home or another page after login
    }
  };

  return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>


      <div className="card p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <button onClick={() => router.push('/')} className="btn btn-secondary mb-4">Home</button> {/* Home button */}
        <h1 className="text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button> {/* Login button */}
        </form>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
