import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './global.css';
import { MainLayout } from './layout/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <div>
        <MainLayout />
      </div>
    </BrowserRouter>
  );
}

export default App;
