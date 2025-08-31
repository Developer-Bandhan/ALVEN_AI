import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
// import { UserContext } from '../context/userContext';
import { setAuthUser } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();
  // const { setUser } = useContext(UserContext);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/users/login', { email, password});
      toast.success("Login successful! ");

      // localStorage.setItem('token', res.data.token);
      // setUser(res.data.user);

      dispatch(setAuthUser({
        user: res.data.user,
        token: res.data.token
      }));

      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    try {
      setForgotPasswordLoading(true);
      const res = await axios.post('/users/forgot-password', { email});
      toast.success("Check your email for password reset link.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong! Try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 text-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to ALVEN</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
          >
            {loading ? <LoadingSpinner/> : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm mt-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
            >
              {forgotPasswordLoading ? "Processing..." : "Forgot password?"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;