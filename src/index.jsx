import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify'; // Import from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling
import App from './App';
import { AuthProvider } from './Authentication/authContext';
import './tailwind.css';

// Use createRoot from ReactDOM/client
const root = createRoot(document.getElementById('root'));

// Render your app within createRoot, wrapped with ToastContainer
root.render(
  <React.StrictMode>
    <ToastContainer /> {/* Render ToastContainer to provide toast functionality */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
