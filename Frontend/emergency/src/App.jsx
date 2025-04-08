import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import EmergencyForm from './components/emergency/EmergencyForm'
import EmergencyList from './components/emergency/EmergencyList'
import EmergencyDetails from './components/emergency/EmergencyDetails';
import UpdateEmergencyForm from './components/emergency/UpdateEmergencyForm';
import HomePage from './components/emergency/HomePage';
import LoginForm from './components/emergency/LoginForm';
import SignupForm from './components/emergency/SignupForm';
import Dashboard from './components/emergency/Dashboard';



import HomePage from '././components/inventory/HomePage';
import InventoryForm from './components/inventory/InventoryForm';
import InventoryList from './components/inventory/InventoryList';
import UpdateInventoryForm from './components/inventory/UpdateInventoryForm';
import Dashboard from './components/inventory/Dashboard';
import InventoryDetails from './components/inventory/InventoryDetails';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="e" element={<HomePage />} />
        <Route path="/emergency-form" element={<EmergencyForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/list" element={<EmergencyList />} />
        <Route path="/emergency/:id" element={<EmergencyDetails />} />
        <Route path="/update-emergency/:id" element={<UpdateEmergencyForm />} />
        <Route path="/dash" element={<Dashboard />} />


        <Route path="i" element={<HomePage />} />
        <Route path="/inventory-form" element={<InventoryForm/>} />
        <Route path="/inventory-list" element={<InventoryList/>}/>
        <Route path="/update-inventory/:id" element={<UpdateInventoryForm/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/inventory/:id" element={<InventoryDetails/>}/>
       
      </Routes>
    </Router>
  );
};


export default App
