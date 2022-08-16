import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MainLayout } from './layout/MainLayout';

import './global.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position='top-center' hideProgressBar autoClose={3000} />
      <div>
        <MainLayout />
      </div>
    </BrowserRouter>
  );
}

export default App;
