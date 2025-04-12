import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import axios from '../config/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { UserContext } from '../context/userContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpExpiry, setOtpExpiry] = useState(null); // Store OTP expiry time
  const [timer, setTimer] = useState(60); // Timer in seconds
  const otpInputRefs = useRef([]);
  const otpModalRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext)

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post('/users/register', {
        username,
        email,
        password,
      });
      toast.success('OTP sent to your email');
      setShowOTPModal(true);
      setOtpExpiry(res.data.otpExpiry);
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Some error occurred');
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOTPBackspace = (index) => {
    if (index > 0 && !otp[index]) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const enteredOTP = otp.join('');

    try {
      setLoading(true);
      const res = await axios.post('/users/verify-otp', {
        username,
        email,
        otp: enteredOTP,
      });
      toast.success('Registration successful');
      setShowOTPModal(false);
      localStorage.setItem('token', res.data.token)
      setUser(res.data.newUser);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Some error occurred');
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setOTPLoading(true);
      const res = await axios.post('/users/resend-otp', { email });
      toast.success('New OTP sent to your email');
      setOtpExpiry(res.data.otpExpiry);
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
      console.log(error.response?.data || error.message);
    } finally {
      setOTPLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && showOTPModal) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, showOTPModal]);

  // GSAP animation for OTP modal
  useEffect(() => {
    if (showOTPModal) {
      gsap.from(otpModalRef.current, {
        y: '100%',
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, [showOTPModal]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (otpModalRef.current && !otpModalRef.current.contains(event.target)) {
        setShowOTPModal(false);
      }
    };

    if (showOTPModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOTPModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up to ALVEN</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? <LoadingSpinner /> : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Login
            </Link>
          </p>
        </div>
      </div>

      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center">
          <div
            ref={otpModalRef}
            className="bg-gray-800 w-full max-w-md rounded-t-lg p-8 pb-12"
          >
            <h2 className="text-2xl text-white font-bold mb-6 text-center">OTP Verification</h2>
            <form onSubmit={handleOTPSubmit}>
              <div className="flex justify-center space-x-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        handleOTPBackspace(index);
                      }
                    }}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    className="w-12 h-12 text-center text-2xl bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm focus:outline-none"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? <LoadingSpinner /> : 'Verify OTP'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                {timer > 0 ? `Resend OTP in ${timer} seconds` : 'Did not receive the OTP?'}
              </p>
              {timer === 0 && (
                <button
                  onClick={handleResendOTP}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {otpLoading ? 'Processing...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;