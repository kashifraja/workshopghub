import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router'; // Import useRouter
import { useUser } from '../context/UserContext'; // Importing the useUser hook

const JobType = () => {
  const router = useRouter(); // Initialize useRouter
  const { user } = useUser(); // Accessing user information from UserContext

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newJobType, setNewJobType] = useState(''); // State for new job type input
  const [newDescription, setNewDescription] = useState(''); // State for new job type description

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const { data, error } = await supabase.from('jobtype').select('*');
        if (error) throw error;
        setJobTypes(data);
      } catch (err) {
        setError('Failed to fetch job types');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobTypes();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const { error } = await supabase.from('jobtype').insert([{ name: newJobType, description: newDescription }]);
    if (error) {
      console.error('Error adding job type:', error);
    } else {
      setJobTypes([...jobTypes, { id: Date.now(), name: newJobType, description: newDescription }]); // Update state with new job type
      setNewJobType(''); // Clear input field
      setNewDescription(''); // Clear description field
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('jobtype').delete().eq('id', id);
    console.log('Deleting job type with ID:', id); // Log the ID of the job type being deleted

    if (error) {
      console.error('Error deleting job type:', error);
    } else {
      setJobTypes(jobTypes.filter(jobType => jobType.id !== id));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <button onClick={() => router.push('/')} className="btn btn-secondary mb-4">Home</button> {/* Home button */}
      <h1>Job Type Listings</h1>

      <form onSubmit={handleAdd}>
        <input type="text" placeholder="Job Type Name" value={newJobType} onChange={(e) => setNewJobType(e.target.value)} required />
        <input type="text" placeholder="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Add Job Type</button>
      </form>
      <ul className="list-group">
        {jobTypes.map((jobType) => (
          <li key={jobType.id} className="list-group-item">
            <h5>{jobType.name}</h5>
            <p>Description: {jobType.description}</p>
            <button onClick={() => handleDelete(jobType.id)} className="btn btn-danger btn-sm float-end">Delete</button>
          </li>
        ))} 
      </ul>
    </div>
  );
};

export default JobType;
