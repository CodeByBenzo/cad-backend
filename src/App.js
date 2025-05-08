import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WhitelistForm from './components/WhitelistForm'; // Your existing form
import AdminPanel from './components/AdminPanel'; // The admin panel

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WhitelistForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
