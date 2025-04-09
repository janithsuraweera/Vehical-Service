import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'




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