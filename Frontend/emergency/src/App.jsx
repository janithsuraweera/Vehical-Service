import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import EmergencyForm from './components/EmergencyForm'
import EmergencyList from './components/EmergencyList'
import EmergencyDetails from './components/EmergencyDetails';
import UpdateEmergencyForm from './components/UpdateEmergencyForm';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/emergency-form" element={<EmergencyForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/list" element={<EmergencyList />} />
        <Route path="/emergency/:id" element={<EmergencyDetails />} />
        <Route path="/update-emergency/:id" element={<UpdateEmergencyForm />} />
        <Route path="/dash" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};


export default App
