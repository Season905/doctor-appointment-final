import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './AppWrapper';  // Changed from App to AppWrapper
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Single import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />  {/* Updated to use AppWrapper */}
  </React.StrictMode>
);