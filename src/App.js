import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import QuoteList from './Components/QuoteList';
import QuoteCreation from './Components/QuoteCreation';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/quotes" element={<QuoteList />} />
          <Route path="/create-quote" element={<QuoteCreation />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

