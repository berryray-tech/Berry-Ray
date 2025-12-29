// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
// Use the new routing tools
import { 
  createBrowserRouter, 
  RouterProvider 
} from 'react-router-dom';

import App from './App';
import './index.css';

// 1. Define the routes array (replace the entire App.jsx <Routes> structure)
// NOTE: Since your App.jsx has components inside the <Routes>, 
// you may need to restructure your App.jsx slightly.

// For now, let's assume App.jsx returns a root layout component
// and all other routing logic is moved here:

const router = createBrowserRouter([
  // Example Routes (You must match the paths and elements from your App.jsx <Routes>)
  {
    path: "/",
    element: <App />, // App now acts as a Layout/Root component
    children: [
      {
        index: true, 
        element: <Home />,
      },
      {
        path: "about", 
        element: <About />,
      },
      // ... include ALL routes here, including /admin/login and /admin/dashboard
    ],
  },
], {
  // 2. Add the future object here to opt-in to v7 behavior
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Use the RouterProvider to render the router instance */}
    <RouterProvider router={router} />
  </React.StrictMode>
);