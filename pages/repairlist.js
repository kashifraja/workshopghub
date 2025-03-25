import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient'; // Importing Supabase client
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext'; // Importing the useUser hook

const RepairList = () => {
  const router = useRouter(); // Initialize useRouter
  const { user } = useUser(); // Accessing user information from UserContext

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data, error } = await supabase
          .from('repair_records') // Fetching records from Supabase
          .select('*');

        if (error) throw error;

        setRecords(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('repair_records') // Deleting record from Supabase
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecords(records.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record. Please try again.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">ASIN Repair Records</h1>
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={() => router.push('/')}>
          Home
        </button>
        <button className="btn btn-primary" onClick={() => router.push('/record')}>
          Add Repair Record
        </button>
        <button className="btn btn-success" onClick={() => router.push('/reports')}>
          View Reports
        </button>
      </div>
      <table className="table table-striped table-bordered">

        <thead>
          <tr>
            <th>Date</th>
            <th>Vehicle</th>
            <th>DIN</th>
            <th>Color</th>
            <th>Job Des</th>
            <th>PL</th>
            <th>PC</th>
            <th>SL</th>
            <th>ML</th>
            <th>Paid</th>
            <th>Total</th>
            <th>MC</th>
            <th>Shop</th>
            <th>Mechanic</th>
            <th>Job</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{`${new Date(record.date).getMonth() + 1}/${new Date(record.date).getDate()}/${new Date(record.date).getFullYear().toString().slice(-2)}`}</td>
              <td>{record.vehicleName}</td>
              <td>{record.namePlate}</td>
              <td>{record.color}</td>
              <td>{record.jobDescription}</td>
              <td>${record.partsListPrice}</td>
              <td>${record.partsCostPrice}</td>
              <td>${record.shopLabor}</td>
              <td>${record.mechanicLabor}</td>
              <td>{record.paidBy}</td>
              <td>${record.total}</td>
              <td>${record.mechanicCommission}</td>
              <td>${record.shopprofit}</td>
              <td>{record.mechanic}</td>
              <td>{record.jobType}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  );
};

export default RepairList;
