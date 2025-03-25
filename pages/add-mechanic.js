import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../context/UserContext'; // Importing the useUser hook

const AddMechanic = () => {
  const router = useRouter(); // Initialize useRouter
  const { user } = useUser(); // Accessing user information from UserContext

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const [newMechanicName, setNewMechanicName] = useState('');
  const [newMechanicCommission, setNewMechanicCommission] = useState('');
  const [newMechanicSpecialty, setNewMechanicSpecialty] = useState('');
  const [error, setError] = useState(null);


  const handleAddMechanic = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('mechanic').insert([
        { name: newMechanicName, commission: newMechanicCommission, specialty: newMechanicSpecialty },
      ]);
      if (error) throw error;
      // Redirect to mechanic list after successful addition
      router.push('/mechaniclist');
    } catch (err) {
      setError('Failed to add mechanic');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add New Mechanic</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleAddMechanic}>
        <input
          type="text"
          placeholder="Name"
          value={newMechanicName}
          onChange={(e) => setNewMechanicName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Commission"
          value={newMechanicCommission}
          onChange={(e) => setNewMechanicCommission(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Specialty"
          value={newMechanicSpecialty}
          onChange={(e) => setNewMechanicSpecialty(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Add Mechanic</button>
      </form>
    </div>
  );
};

export default AddMechanic;
