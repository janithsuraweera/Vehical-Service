import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'



import HomePage from '././components/inventory/HomePage';
import InventoryForm from './components/inventory/InventoryForm';
import InventoryList from './components/inventory/InventoryList';
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory-form" element={<InventoryForm/>} />
        <Route path="/inventory-list" element={<InventoryList/>}/>
        <Route path="/inventory-list" element={<InventoryList/>}/>
       
      </Routes>
    </Router>
  );
};


export default App
