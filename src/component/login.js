// src/Login.js
import React, { useState } from 'react';
import { userData } from '../userData'; // Import user and admin data
import '../styles.css'; // Import CSS styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = (e) => {
      e.preventDefault();
      // Check if the entered credentials match any user in userData
      const { users, admins } = userData;
      const foundUser = users.find(user => user.username === username && user.password === password);
      const foundAdmin = admins.find(admin => admin.username === username && admin.password === password);
      
      if (foundUser) {
        alert('User login successful');
        navigate('/userdashboard'); // Redirect to User Dashboard
      } else if (foundAdmin) {
        alert('Admin login successful');
        navigate('/admindashboard'); // Redirect to Admin Dashboard
      } else {
        alert('Invalid credentials');
      }
    };
  
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
};

export default Login;
