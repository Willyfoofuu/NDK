// src/UserDashboard.js
import React, { useState } from 'react';

const UserDashboard = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send feedback data to backend or perform desired action
    console.log('Submitted feedback:', feedback);
    setFeedback('');
  };

  return (
    <div>
      <h2>Welcome User!</h2>
      <form onSubmit={handleSubmit}>
        <label>Feedback:</label>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} required />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default UserDashboard;
