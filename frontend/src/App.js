import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountManagement from './components/AccountManagement';
import TransactionManagement from './components/TransactionManagement';
import './App.css';

// ProtectedRoute component
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (token) {
    return children; // Allow access to protected pages
  } else {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountManagement /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionManagement /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;