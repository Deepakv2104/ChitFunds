import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify'; // Import from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling
import App from './App';
import { AuthProvider } from './Authentication/authContext';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
