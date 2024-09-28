import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import CryptoJS from 'crypto-js';
import AdminPage from './AdminPage'

const SECRET_KEY = 'your-secret-key'; // Use a strong secret key

function App() {
  // Function to encrypt the value
  const encryptValue = (value) => {
    return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  };

  // Function to decrypt the value
  const decryptValue = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Initialize authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedValue = localStorage.getItem('isAuthenticated');
    return storedValue ? decryptValue(storedValue) === 'true' : false;
  });
  const [userPrivileges,setUserPrivileges] = useState();

  // Update localStorage whenever authentication state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', encryptValue(isAuthenticated.toString()));
  }, [isAuthenticated]);
  console.log(isAuthenticated);
  
  const [id, setId] = useState(null);


  return (
    
    <Router>
  <Routes>
    <Route
      path="/login"
      element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserPrivileges={setUserPrivileges} setoutId={setId} />}
    />
    <Route
      path="/dashboard"
      element={isAuthenticated && userPrivileges === 0 ? (
        <DashboardPage id={id} setIsAuthenticated={setIsAuthenticated}  />
      ) : (
        <Navigate to="/login" />
      )}
    />
    <Route
      path="/admin"
      element={isAuthenticated && userPrivileges === 1 ? (
        <AdminPage setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Navigate to="/login" />
      )}
    />
    {/* Default route */}
    <Route
      path="/"
      element={
        isAuthenticated ? (
          userPrivileges === 1 ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/dashboard" />
          )
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  </Routes>
</Router>

  );
}

export default App;
