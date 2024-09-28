import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './LoginPage.css';
import logo from './black logo.png'; // Adjust the path to your logo


const SECRET_KEY = 'your-secret-key'; // Use the same secret key as in App.js

function LoginPage({setoutId, setIsAuthenticated ,setUserPrivileges}) {
  const [id, setId] = useState();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to encrypt the ID
  const encryptValue = (value) => {
    return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://taskmanagerkhayal.fly.dev/login', { id });
      //console.log({id});
      
        console.log(response.data.success);
        
      if (response.data.success) {
        console.log(response.data.user.privileges);

        if(response.data.user.privileges === 1){
            console.log(response.data.user.privileges);
            setUserPrivileges(1);
            setoutId(id);
        setIsAuthenticated(true);
        navigate('/admin');
        }
        else{
            console.log("here1");
            
            setUserPrivileges(0);
            console.log("here1");

            setoutId(id);
            console.log("here1");

        setIsAuthenticated(true);
        console.log("here1");

        navigate('/dashboard');
        }
       // Set user as authenticated
        //localStorage.setItem('userId', encryptValue(inputid)); // Save encrypted ID to localStorage
        console.log("here");
        
        // response.data.user.privileges === 0 ? navigate('/dashboard'): navigate('/AdminPage'); // Redirect to dashboard
      } else {
        //console.log(response.data.success);
        setError(response.data.message);
        console.log(id);
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      {/* Add the logo here */}
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="login-logo" />
      </div>
      
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">Enter Your ID</label>
        <input
          type="text"
          id="userId"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LoginPage;
