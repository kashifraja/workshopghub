import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../context/UserContext'; // Importing the useUser hook

const MechanicList = () => {
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

  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMechanics = async () => {
      console.log("Fetching mechanics from Supabase...");
      try {
        const { data, error } = await supabase.from('mechanic').select('*');
        if (error) throw error;
        setMechanics(data);
      } catch (err) {
        setError('Failed to fetch mechanics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  const handleAddMechanic = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('mechanic').insert([
        { name: newMechanicName, commission: newMechanicCommission, specialty: newMechanicSpecialty },
      ]);

      if (error) throw error;
      console.log('Mechanic added successfully');
      const { data: newMechanic, error: fetchError } = await supabase.from('mechanic').select('*').eq('id', newMechanic.id).single();

      if (fetchError) throw fetchError;
      setMechanics([...mechanics, newMechanic]);

      setNewMechanicName('');
      setNewMechanicCommission('');
      setNewMechanicSpecialty('');
    } catch (err) {
      setError('Failed to add mechanic');
      console.error(err);
    }
  };

  const handleDeleteMechanic = async (id) => {
    try {
      const { error } = await supabase.from('mechanic').delete().eq('id', String(id));
      if (error) throw error;
      setMechanics(mechanics.filter(mechanic => mechanic.id !== id));
    } catch (err) {
      setError(`Failed to delete mechanic: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <button onClick={() => router.push('/')} className="btn btn-secondary mb-4">Home</button>
      <h1>Mechanic Listings</h1>

      <button onClick={() => router.push('/add-mechanic')} className="btn btn-primary mb-4">Add Mechanic</button>

      <ul className="list-group">
        {mechanics.map((mechanic) => (
          <li key={mechanic.id} className="list-group-item">
            <h5>{mechanic.name}</h5>
            <p>Commission: {mechanic.commission}</p>
            <p>Specialty: {mechanic.specialty}</p>
            <button onClick={() => {
              console.log(`Attempting to delete mechanic with ID: ${mechanic.id}`);
              handleDeleteMechanic(mechanic.id);
            }} className="btn btn-danger btn-sm">Delete</button>
          </li>
        ))} 
      </ul>
    </div>
  );
};

export default MechanicList;
