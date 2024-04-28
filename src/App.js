import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './component/adminDashboard';
import Login from './component/login';
import UserDashboard from './component/userDashboard';
import { Provider } from 'react-redux';
import store from './utils/store'; // Updated path

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;