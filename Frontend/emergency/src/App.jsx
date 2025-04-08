import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

// import EmergencyForm from './components/emergency/EmergencyForm'
// import EmergencyList from './components/emergency/EmergencyList'
// import EmergencyDetails from './components/emergency/EmergencyDetails';
// import UpdateEmergencyForm from './components/emergency/UpdateEmergencyForm';
// import LoginForm from './components/emergency/LoginForm';
// import SignupForm from './components/emergency/SignupForm';
// import Dashboard from './components/emergency/Dashboard';


import HomePage from '././components/inventory/HomePage';
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory-form" element={<EmergencyForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/list" element={<EmergencyList />} />
        <Route path="/inventory/:id" element={<EmergencyDetails />} />
        <Route path="/update-inventory/:id" element={<UpdateEmergencyForm />} />
        <Route path="/dash" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};


export default App
