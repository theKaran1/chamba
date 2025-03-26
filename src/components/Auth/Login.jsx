import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'; // Corrected import
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import Input from '../utils/Input';
import { BaseUrl } from '../utils/Endpoint';
import Label from '../utils/Label';
import Button from '../utils/Button';
import backgroundImage from '../../assets/img/login-background.png'
import Form from '../utils/Form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BaseUrl}/api/login/`, data);
      console.log(response?.data, "response")
      const token = response.data.access;
      const refresh = response.data.refresh;
      const sessionKey = response.data.session_key;
      const firstName =  response.data.first_name;
      const lastName = response.data.last_name;
      if (token) {
        localStorage.setItem('access', token);
        localStorage.setItem('refresh_token',refresh);
        localStorage.setItem('first_name', firstName);
        localStorage.setItem('last_name', lastName)
        localStorage.setItem('email',response.data.email)
        // sessionStorage.setItem('session_key', sessionKey)
        toast.success('Login successful', {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/add-candidate');
      } else {
        toast.error('Login credentials are wrong');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Login failed');
        console.error('Server error:', error.response);
      } else if (error.request) {
        toast.error('No response from the server');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className='main-container'>
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // Removed transition={Bounce} since Bounce isn’t imported; use Slide if needed
        transition="Slide" // Optional: Add this if you want a transition (requires import)
      />

      <div className="login-container">
      <div className="image-box">
            <img src={backgroundImage} alt="HR Illustration"/>
        </div>
        <div className="login-box"> 
            <div className="login-title">Welcome Back!!</div>
            <div className="subtitle">Sign In to your management account</div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Label id="login-label">Name</Label>
            <Input
                type="email"
                register={register('email', {
                  required: { value: true, message: 'Email is required' },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email}
                placeholder="Enter your email"
              />
              <Label id="login-label">Password</Label>
            <Input
                type="password"
                register={register('password', {
                  required: { value: true, message: 'Password is required' },
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={errors.password}
                placeholder="Enter your password"
              />
                  <div class="bottom-links">
         
            <a href="#">Forgot Password?</a>
            </div>
             <Button
              type="submit"
           
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
            <div className="bottom-links"><span>Don't have an account yet? <a href="#">Sign Up</a></span></div>
            
            </Form>
        </div>
    
    </div>
    </div>
  );
};

export default Login;