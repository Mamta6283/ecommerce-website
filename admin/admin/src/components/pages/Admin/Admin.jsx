import React from 'react';
import './Admin.css'
import Sidebar from '../../sidbar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AddProduct from '../../AddProduct/AddProduct';
import ListProduct from '../../ListProduct/ListProduct';

function Admin(props) {
    return (
        <div className='admin'>

          <Sidebar></Sidebar>
          <Routes>
            <Route path='/addproduct' element={<AddProduct></AddProduct>}></Route>
            <Route path='/listproduct' element={<ListProduct></ListProduct>}></Route>
          </Routes>
        </div>
    );
}

export default Admin;