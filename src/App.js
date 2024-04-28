// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './component/adminDashboard';
import Login from './component/login';
import UserDashboard from './component/userDashboard';

const App = () => {
  return (
    <Router>
      <div className="App">
      <Routes>
      <Route path="/" element={<Login />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
