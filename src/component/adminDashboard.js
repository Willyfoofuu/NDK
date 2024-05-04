import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../utils/api';
import { updateNewEntry, resetNewEntry } from '../utils/slices/formSlice';
import '../styles.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchData, addRow, setData } from '../utils/slices/dataSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { data, stockNames, months } = useSelector((state) => state.data);
  const { newEntry } = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);


  const handleSave = async (params) => {
    try {
      console.log('params.data:', params.data);
      await api.put(`/data/${params.data.id}`, params.data);
      dispatch(fetchData());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedData = [...data];
    const isEmptyRow = updatedData[index] === undefined || Object.keys(updatedData[index]).length === 0;
  
    let updatedEntry;
    if (isEmptyRow) {
      updatedEntry = { ...newEntry, [name]: value };
    } else {
      updatedEntry = { ...updatedData[index], [name]: value };
      // Create a new object with the necessary properties
      updatedEntry = {
        id: updatedEntry.id,
        Stock_Name: updatedEntry.Stock_Name,
        Expiry_Month: updatedEntry.Expiry_Month,
        // Add other necessary properties
        [name]: value
      };
    }
  
    const tradingSymbol = `${updatedEntry.Stock_Name}${updatedEntry.Expiry_Month}${updatedEntry.Strike_Price}${updatedEntry.Options}`;
    const key = `${tradingSymbol}${updatedEntry.Target}${updatedEntry.Stop_Loss}`;
    updatedEntry.Key = key;
    updatedEntry.Trading_Symbol = tradingSymbol;
    updatedData[index] = updatedEntry;
    dispatch(setData(updatedData));
  };
  
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      dispatch(fetchData());
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data. Please try again.');
    }
  };

 
  const columnDefs = [
    { headerName: 'Key', field: 'Key', editable: false },
    { headerName: 'Trading Symbol', field: 'Trading_Symbol', editable: false },
    { headerName: 'Account', field: 'Account', editable: false },
    {
      headerName: 'Stock Name',
      field: 'Stock_Name',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: stockNames
      },
      cellRenderer: (params) => {
        return params.value; // Display the selected value in the dropdown
      }
    },
    { headerName: 'Expiry Year', field: 'Expiry_Year', editable: true },
    {
      headerName: 'Expiry Month',
      field: 'Expiry_Month',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: months
      },
      cellRenderer: (params) => {
        return params.value; // Display the selected value in the dropdown
      }
    },
    { headerName: 'Strike Price', field: 'Strike_Price', editable: true },
    { headerName: 'Options', field: 'Options', editable: true },
    { headerName: 'Target', field: 'Target', editable: true },
    { headerName: 'Stop Loss', field: 'Stop_Loss', editable: true },
    { headerName: 'Status', field: 'Status', editable: true },
    {
      headerName: 'Actions',
      cellRenderer: (params) => {
        return (
          <div>
            <button onClick={() => handleSave(params)}>Save</button>
          </div>
        );
      },
      minWidth: 120,
      maxWidth: 150
    }
  ];
  

  const handleAddRow = async () => {
    try {
      // Create the new row data
      const tradingSymbol = `${newEntry.Stock_Name}${newEntry.Expiry_Month}${newEntry.Strike_Price}${newEntry.Options}`;
      const key = `${tradingSymbol}${newEntry.Target}${newEntry.Stop_Loss}`;
      const newRowData = {
        id: Math.random(), // Generate a unique ID (replace with your ID generation logic)
        Key: key,
        Trading_Symbol: tradingSymbol,
        ...newEntry
      };
  
      // Dispatch an action to add the new row to the Redux store
      dispatch(addRow(newRowData));
  
      // Reset the newEntry form after adding the row
      dispatch(resetNewEntry());
    } catch (error) {
      console.error('Error adding new row:', error);
      alert('Error adding new row. Please try again.');
    }
  };
  
  
  
  
  
  

  return (
    <div>
      <h2>Welcome Admin!</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
           
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={{ flex: 1, minWidth: 150, resizable: true }}
            editType="fullRow"
            onCellValueChanged={handleInputChange}
          />
        </div>
        <button type="submit">Add</button>
        <button type="button" onClick={handleAddRow}>Add Row</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
