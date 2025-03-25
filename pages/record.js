import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { supabase } from '../utils/supabaseClient'; // Importing the Supabase client
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Importing the useUser hook

const RecordPage = () => {
  const router = useRouter(); // Initialize useRouter
  const { user } = useUser(); // Accessing user information from UserContext

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);


  const [jobTypes, setJobTypes] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [formData, setFormData] = useState({
    date: '',                // Current date (initialized as empty)
    vehicleName: '',         // Required field for the vehicle name
    namePlate: '',           // Required field for the name plate
    color: '',               // Required field for the vehicle color
    jobDescription: '',      // Required field for the job description
    partsListPrice: 0,      // Default value set to 0
    partsCostPrice: 0,      // Default value set to 0
    shopLabor: 0,           // Default value set to 0
    mechanicLabor: 0,       // Required field for mechanic labor costs
    paidBy: '',              // Required field for payment method (selected from dropdown)
    total: 0,               // Calculated total, read-only
    mechanicCommission: 0,   // Calculated mechanic commission, read-only
    shopprofit: 0,           // Calculated shop profit, read-only
    mechanic: '',            // Field for selected mechanic
  });

  useEffect(() => {
    const fetchJobTypes = async () => {
      const response = await axios.get('/api/jobTypes');
      setJobTypes(response.data);
    };

    const fetchMechanics = async () => {
      const { data, error } = await supabase.from('mechanic').select('*');
      if (error) throw error;
      setMechanics(data);
    };

    fetchJobTypes();
    fetchMechanics();

    // Set current date
    setFormData((prevData) => ({
      ...prevData,
      date: new Date().toISOString().split('T')[0], // Set current date
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert price fields to numbers
    const numericValue = ['partsListPrice', 'partsCostPrice', 'shopLabor', 'mechanicLabor'].includes(name) ? Number(value) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));

    // Handle mechanic selection
    if (name === 'mechanic') {
      setFormData((prevData) => ({
        ...prevData,
        mechanic: value, // Update mechanic name in state
        mechanicLabor: value ? prevData.mechanicLabor : 0, // Set mechanicLabor to 0 if no mechanic is selected
      }));
    }

    // Calculate mechanic commission if mechanic is selected
    if (name === 'mechanic') {
      const selectedMechanic = mechanics.find(mechanic => mechanic.name === value);
      const commission = selectedMechanic ? selectedMechanic.commission : 0; // Fetch commission instead of percentage
      const commissionValue = (Number(formData.mechanicLabor) * commission) / 100; // Calculate mechanic commission based on selected mechanic

      setFormData((prevData) => ({
        ...prevData,
        mechanicCommission: commissionValue, // Ensure mechanicCommission is updated correctly
      }));
    }

    // Recalculate commission if mechanicLabor is updated
    if (name === 'mechanicLabor') {
      const selectedMechanic = mechanics.find(mechanic => mechanic.name === formData.mechanic);
      const commission = selectedMechanic ? selectedMechanic.commission : 0; // Fetch commission instead of percentage
      const commissionValue = (Number(value) * commission) / 100; // Calculate mechanic commission based on selected mechanic

      setFormData((prevData) => ({
        ...prevData,
        mechanicCommission: commissionValue, // Ensure mechanicCommission is updated correctly
      }));
    }

    // Recalculate shop profit when relevant fields are updated
    if (['shopLabor', 'partsListPrice', 'partsCostPrice'].includes(name)) {
      const shopProfit = (Number(formData.partsListPrice) - Number(formData.partsCostPrice)) + Number(formData.shopLabor); // Calculate shop profit

      setFormData((prevData) => ({
        ...prevData,
        shopprofit: shopProfit, // Update shopprofit in state
      }));

      // Log the updated values for debugging
      console.log("Updated Values:");
      console.log("partsListPrice:", formData.partsListPrice);
      console.log("partsCostPrice:", formData.partsCostPrice);
      console.log("shopLabor:", formData.shopLabor);
      console.log("Calculated shopProfit:", shopProfit);
    }
  };

  const calculateTotal = () => {
    const { partsListPrice, shopLabor } = formData; // Only include partsListPrice and shopLabor
    const total = Number(partsListPrice) + Number(shopLabor); // Calculate total excluding mechanic labor

    setFormData((prevData) => ({
      ...prevData,
      total, // Ensure total is stored as a number
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // Log the form data
    try {
      await axios.post('/api/records', { ...formData, mechanicCommission: formData.mechanicCommission }); // Ensure mechanicCommission is included

      // Redirect to home page with success message
      router.push({
        pathname: '/',
        query: { message: 'Record has been saved successfully!' }
      });
      // Show success message on the record page
      alert('Record has been saved successfully!');

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">ASIN Repair Record</h1>
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={() => router.push('/')}>Home</button>
        <button className="btn btn-primary" onClick={() => router.push('/repairlist')}>Repair List</button>
      </div>
      <input type="hidden" name="date" value={formData.date} /> {/* Set current date */}

      <form onSubmit={handleSubmit} className="form">
        <div className="mb-3">
          <label className="form-label">Vehicle Name:</label>
          <input type="text" name="vehicleName" onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Name Plate:</label>
          <input type="text" name="namePlate" onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Color:</label>
          <input type="text" name="color" onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Job Description:</label>
          <textarea name="jobDescription" onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Parts List Price:</label>
          <input type="number" name="partsListPrice" onChange={handleChange} onBlur={calculateTotal} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Parts Cost Price:</label>
          <input type="number" name="partsCostPrice" onChange={handleChange} onBlur={calculateTotal} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Job Type:</label>
          <select name="jobType" onChange={handleChange} required className="form-select">
            <option value="">Select Job Type</option>
            {jobTypes.map((job) => (
              <option key={job._id} value={job.name}>{job.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Mechanic:</label>
          <select name="mechanic" onChange={handleChange} className="form-select">
            <option value="">Select Mechanic</option>
            {mechanics.map((mechanic) => (
              <option key={mechanic._id} value={mechanic.name}>{mechanic.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Shop Labor:</label>
          <input type="number" name="shopLabor" onChange={handleChange} onBlur={calculateTotal} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Mechanic Labor:</label>
          <input type="number" name="mechanicLabor" onChange={handleChange} onBlur={calculateTotal} required className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Mechanic Commission:</label>
          <input type="number" value={formData.mechanicCommission} readOnly className="form-control" placeholder="Mechanic Commission" />
        </div>
        <div className="mb-3">
          <label className="form-label">Paid By:</label>
          <select name="paidBy" onChange={handleChange} required className="form-select">
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Zille">Zille</option>
            <option value="Online Pay">Online Pay</option>
            <option value="Cheque">Cheque</option>
            <option value="Due">Due</option>

          </select>
        </div>
        <div className="mb-3">
          <input type="number" value={formData.total} readOnly className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button> {/* Submit button */}
      </form>
    </div>
  );
};

export default RecordPage;
