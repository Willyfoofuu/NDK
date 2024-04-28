//adminDashboard
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import { debounce } from 'lodash';
import { setEditIndex, updateNewEntry, resetNewEntry } from '../utils/slices/formSlice';
import { fetchData } from '../utils/slices/dataSlice';
import '../styles.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { data, stockNames, months, isFetching, error } = useSelector((state) => state.data);
  const { editIndex, newEntry } = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  const handleEdit = (index) => {
    dispatch(setEditIndex(index));
  };
  
  const handleSave = async (index) => {
    try {
      await api.put(`/data/${data[index].id}`, data[index]);
      dispatch(setEditIndex(null));
      dispatch(fetchData()); // Dispatch fetchData after successful save
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  const debouncedInputChange = debounce(handleInputChange, 300);

  function handleInputChange(e) {
    const { name, value } = e.target;
    const updatedEntry = {
      ...newEntry,
      [name]: value,
    };

    const tradingSymbol = `${value}${updatedEntry.Expiry_Month}${updatedEntry.Strike_Price}${updatedEntry.Options}`;
    const key = `${tradingSymbol}${updatedEntry.Target}${updatedEntry.Stop_Loss}`;
    updatedEntry.Key = key;
    updatedEntry.Trading_Symbol = tradingSymbol;

    dispatch(updateNewEntry(updatedEntry));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await api.post('/data/post', newEntry);
      alert('Data submitted successfully!');
      dispatch(resetNewEntry());
      dispatch(fetchData()); // Dispatch fetchData after successful submit
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
                            onChange={(e) => debouncedInputChange(e)}
                          >
                            <option value="">Select Option</option>
                            <option value="PE">PE</option>
                            <option value="CE">CE</option>
                          </select>
                        ) : key === 'Status' ? (
                          <select
                            name={key}
                            value={item[key]}
                            onChange={(e) => debouncedInputChange(e)}
                          >
                            <option value="">Select Status</option>
                            <option value="Open">Open</option>
                            <option value="Close">Close</option>
                          </select>
                        ) : key === 'Expiry_Month' ? (
                          <select
                            name={key}
                            value={item[key]}
                            onChange={(e) => debouncedInputChange(e)}
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
                            onChange={(e) => debouncedInputChange(e)}
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
                            onChange={(e) => debouncedInputChange(e)}
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