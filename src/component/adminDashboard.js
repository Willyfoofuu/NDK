import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles.css';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [stockNames, setStockNames] = useState([]);
  const [months, setMonths] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track index of row in edit mode
  const [newEntry, setNewEntry] = useState({
    Key: '',
    Trading_Symbol: '',
    Stock_Name: '',
    Expiry_Year: '',
    Expiry_Month: '',
    Strike_Price: '',
    Options: '',
    Target: '',
    Stop_Loss: '',
    Status: '',
  });

  useEffect(() => {
    fetchData();
    fetchStockNames();
    fetchMonths();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/data/get');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchStockNames = async () => {
    try {
      const response = await api.get('/stock-names');
      setStockNames(response.data);
    } catch (error) {
      console.error('Error fetching stock names:', error);
    }
  };

  const fetchMonths = async () => {
    try {
      const response = await api.get('/months');
      setMonths(response.data);
    } catch (error) {
      console.error('Error fetching months:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index); // Enter edit mode for a specific row
  };

  const handleSave = async (index) => {
    try {
      // Your API call to update the data
      await api.put(`/data/${data[index].id}`, data[index]);
      setEditIndex(null); // Exit edit mode after saving
      fetchData(); // Refresh data after saving
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));

    // Calculate Key and Trading_Symbol based on rules
    const tradingSymbol = `${value}${newEntry.Expiry_Month}${newEntry.Strike_Price}${newEntry.Options}`;
    const key = `${tradingSymbol}${newEntry.Target}${newEntry.Stop_Loss}`;
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      Key: key,
      Trading_Symbol: tradingSymbol,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields = [
      'Stock_Name',
      'Expiry_Year',
      'Expiry_Month',
      'Strike_Price',
      'Options',
      'Target',
      'Stop_Loss',
      'Status',
      'Key',
      'Trading_Symbol',
    ];
    if (requiredFields.some((field) => !newEntry[field])) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      // Send data to backend
      await api.post('/data/post', newEntry);
      alert('Data submitted successfully!');
      setNewEntry({
        Stock_Name: '',
        Expiry_Year: '',
        Expiry_Month: '',
        Strike_Price: '',
        Options: '',
        Target: '',
        Stop_Loss: '',
        Status: '',
        Key: '',
        Trading_Symbol: '',
      });
      fetchData(); // Refresh data after submitting
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data. Please try again.');
    }
  };

  return (
    <div>
      <h2>Welcome Admin!</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <table className="admin-table">
          <thead>
            <tr>
              {/* Render table headers */}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.keys(item).map((key, idx) => (
                  <td key={idx}>
                    {key === 'Key' || key === 'Trading_Symbol' ? (
                      <input
                        type="text"
                        value={item[key]}
                        readOnly
                        style={{ backgroundColor: '#f0f0f0' }}
                      />
                    ) : (
                      editIndex === index ? (
                        key === 'Options' ? (
                          <select
                            name={key}
                            value={item[key]}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="">Select Option</option>
                            <option value="PE">PE</option>
                            <option value="CE">CE</option>
                          </select>
                        ) : key === 'Status' ? (
                          <select
                            name={key}
                            value={item[key]}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="">Select Status</option>
                            <option value="Open">Open</option>
                            <option value="Close">Close</option>
                          </select>
                        ) : key === 'Expiry_Month' ? (
                          <select
                            name={key}
                            value={item[key]}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="">Select Month</option>
                            {months.map((month) => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                        ) : key === 'Stock_Name' ? (
                          <select
                            name={key}
                            value={item[key]}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="">Select Stock</option>
                            {stockNames.map((stock) => (
                              <option key={stock} value={stock}>{stock}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            name={key}
                            value={item[key]}
                            onChange={(e) => handleInputChange(e)}
                          />
                        )
                      ) : item[key]
                    )}
                  </td>
                ))}
                <td>
                  {editIndex === index ? (
                    <button onClick={() => handleSave(index)}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit(index)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              {Object.keys(newEntry).map((key, idx) => (
                <td key={idx}>
                  {key === 'Options' ? (
                    <select
                      name={key}
                      value={newEntry[key]}
                      onChange={(e) => handleInputChange(e)}
                    >
                      <option value="">Select Option</option>
                      <option value="PE">PE</option>
                      <option value="CE">CE</option>
                    </select>
                  ) : key === 'Status' ? (
                    <select
                      name={key}
                      value={newEntry[key]}
                      onChange={(e) => handleInputChange(e)}
                    >
                      <option value="">Select Status</option>
                      <option value="Open">Open</option>
                      <option value="Close">Close</option>
                    </select>
                  ) : key === 'Expiry_Month' ? (
                    <select
                      name={key}
                      value={newEntry[key]}
                      onChange={(e) => handleInputChange(e)}
                    >
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  ) : key === 'Stock_Name' ? (
                    <select
                      name={key}
                      value={newEntry[key]}
                      onChange={(e) => handleInputChange(e)}
                    >
                      <option value="">Select Stock</option>
                      {stockNames.map((stock) => (
                        <option key={stock} value={stock}>{stock}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={newEntry[key]}
                      onChange={(e) => handleInputChange(e)}
                    />
                  )}
                </td>
              ))}
              <td>
                <button type="submit">Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default AdminDashboard;
