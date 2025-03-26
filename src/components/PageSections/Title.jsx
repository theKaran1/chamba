import React, { useState, useRef, useEffect } from 'react';
import userLogo from '../../assets/img/account.png';
import Button from '../utils/Button';
import axios from 'axios';
import { BaseUrl } from '../utils/Endpoint';
import {Link,useNavigate } from 'react-router';
const Title = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const token = localStorage.getItem('access')
  const navigateTo = useNavigate()
  // Toggle profile menu
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('refresh_token');
      // const session_key = sessionStorage.getItem('session_key');
      const response = await axios.post(
        `${BaseUrl}/api/logout/`,
        { refresh: token,
          // session_key: session_key,

         }, // Send token as a property in JSON
        {
          headers: {
            'Content-Type': 'application/json', // Set Content-Type header
          },
        }
      );
        localStorage.removeItem('access');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('email')
        navigateTo('/login')

    } catch (errors) {
      console.error('Logout error:', errors);
      // Handle errors appropriately
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="title-container">
      {/* App Title */}
      <div className="app-title">
       Human Resource Management System
      </div>
      
      {/* Profile Button and Menu */}
      { token ? (
         <div className={`profile-menu ${isProfileMenuOpen ? 'active' : ''}`} ref={profileMenuRef}>
         <Button onClick={toggleProfileMenu} id="profile-btn" className="profile-button">
           <img src={userLogo} alt="Profile" />
         </Button>
 
         {/* Profile Menu Dropdown */}
         <ul className="dropdown-content">
           <li>{localStorage.getItem('first_name')+localStorage.getItem('last_name')}</li> {/* Replace with dynamic name */}
           <li>{localStorage.getItem('email') || 'user Email'}</li>
           <li>
             <button onClick={handleLogout}>Logout</button>
           </li>
         </ul>
       </div>
      ): null}
     
    </div>
  );
};
export default Title;