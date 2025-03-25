import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link'; // Import Link for navigation
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import { useRouter } from 'next/router'; // Import useRouter
import { useUser } from '../context/UserContext'; // Importing the useUser hook

const Reports = () => {
  const router = useRouter(); // Initialize useRouter
  const { user } = useUser(); // Accessing user information from UserContext

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalRepairs, setTotalRepairs] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalShopProfit, setTotalShopProfit] = useState(0); // Added state for total shop profit
  const [totalMechanicCommission, setTotalMechanicCommission] = useState(0); // Added state for total mechanic commission
  const [totalPartsListPrice, setTotalPartsListPrice] = useState(0); // Added state for total parts list price
  const [totalPartsCostPrice, setTotalPartsCostPrice] = useState(0); // Added state for total parts cost price
  const [filteredRecords, setFilteredRecords] = useState([]); // State for filtered records
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    let totalShopProfit = 0; // Initialize total shop profit
    let totalMechanicCommission = 0; // Initialize total mechanic commission
    let totalPartsListPrice = 0; // Initialize total parts list price
    let totalPartsCostPrice = 0; // Initialize total parts cost price

    try {
      const response = await axios.get('/api/repairlist'); // Adjust the endpoint as necessary
      const records = response.data;

      // Filter records based on the selected date range
      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });

      // Set filtered records to state
      setFilteredRecords(filteredRecords);

      // Calculate total repairs and total revenue
      setTotalRepairs(filteredRecords.length);
      totalShopProfit = filteredRecords.reduce((acc, record) => acc + record.shopprofit, 0); // Calculate total shop profit
      totalMechanicCommission = filteredRecords.reduce((acc, record) => acc + record.mechanicCommission, 0); // Calculate total mechanic commission
      totalPartsListPrice = filteredRecords.reduce((acc, record) => acc + record.partsListPrice, 0); // Calculate total parts list price
      totalPartsCostPrice = filteredRecords.reduce((acc, record) => acc + record.partsCostPrice, 0); // Calculate total parts cost price

      setTotalRevenue(filteredRecords.reduce((acc, record) => acc + record.total, 0));
      setTotalShopProfit(totalShopProfit); // Set total shop profit state
      setTotalMechanicCommission(totalMechanicCommission); // Set total mechanic commission state
      setTotalPartsListPrice(totalPartsListPrice); // Set total parts list price state
      setTotalPartsCostPrice(totalPartsCostPrice); // Set total parts cost price state

    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const exportToExcel = () => {
    const recordsToExport = filteredRecords.map(record => ({
      date: new Date(record.date).toLocaleDateString('en-US'),
      shopprofit: record.shopprofit,
      mechanicCommission: record.mechanicCommission,
      partsListPrice: record.partsListPrice,
      partsCostPrice: record.partsCostPrice,
    }));

    const ws = XLSX.utils.json_to_sheet(recordsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'reports.xlsx');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4" style={{ color: 'black' }}>ASIN Repair Report</h1>
      <div className="mb-4 d-flex">
        <Link href="/" className="btn btn-secondary me-2">Home</Link> {/* Home button */}
        <Link href="/repairlist" className="btn btn-primary me-2">Repair List</Link> {/* Repair List button */}
        <button type="button" className="btn btn-info me-2" onClick={exportToExcel}>Export to Excel</button> {/* Export button */}
        <button type="submit" className="btn btn-success" onClick={handleSubmit}>Generate Report</button> {/* Generate Report button */}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
            required
          />
        </div>
      </form>
      {error && <div className="alert alert-danger mt-3">Error: {error}</div>}
      <div className="mt-4">
        <h5>Filtered Records:</h5>
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-primary">Date</th>
              <th className="table-primary">Shop Profit</th>
              <th className="table-primary">Mechanic Commission</th>
              <th className="table-primary">Parts List Price</th>
              <th className="table-primary">Parts Cost Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.date).toLocaleDateString('en-US')}</td>
                  <td>${record.shopprofit.toFixed(2)}</td>
                  <td>${record.mechanicCommission.toFixed(2)}</td>
                  <td>${record.partsListPrice.toFixed(2)}</td>
                  <td>${record.partsCostPrice.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No records found for the selected date range.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Totals:</strong></td>
              <td><strong>${totalShopProfit.toFixed(2)}</strong></td>
              <td><strong>${totalMechanicCommission.toFixed(2)}</strong></td>
              <td><strong>${totalPartsListPrice.toFixed(2)}</strong></td>
              <td><strong>${totalPartsCostPrice.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default Reports;
