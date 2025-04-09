import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



import Dashboard from './shared/Dashboard';
import HomePage from './components/inventory/InventoryHomePage';
import InventoryForm from './components/inventory/InventoryForm';
import InventoryList from './components/inventory/InventoryList';
import UpdateInventoryForm from './components/inventory/UpdateInventoryForm';
import InventoryDetails from './components/inventory/InventoryDetails';
import EmergencyForm from './components/emergency/EmergencyForm';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>

        //Home Page Route
        <Route path="/" element={<Dashboard />} />


        //Emergency Routes
        <Route path="/emergencyform" element={<EmergencyForm/>}/>
        <Route path="/emergencylist" element={<EmergencyForm/>}/>
        <Route path="/emergencyform/:id" element={<EmergencyForm/>}/>
        <Route path="/emergencylist/:id" element={<EmergencyForm/>}/>


        //Inventory Routes
        <Route path="/inventory-form" element={<InventoryForm/>} />
        <Route path="/inventory-list" element={<InventoryList/>}/>
        <Route path="/update-inventory/:id" element={<UpdateInventoryForm/>}/>
        <Route path="/inventory/:id" element={<InventoryDetails/>}/>


       
      </Routes>
    </Router>
  );
};


export default App