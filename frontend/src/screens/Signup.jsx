import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import axios from '../config/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
// import { UserContext } from '../context/userContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [timer, setTimer] = useState(60);
  const otpInputRefs = useRef([]);
  const otpModalRef = useRef(null);
  const navigate = useNavigate();
  // const { setUser } = useContext(UserContext)
  const dispatch = useDispatch();

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
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

      dispatch(setAuthUser({
        user: res.data.newUser,
        token: res.data.token
      }))

      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Some error occurred');
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
    } finally {
      setOTPLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0 && showOTPModal) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, showOTPModal]);

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
      <div className="bg-gray-800 text-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up to ALVEN</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your username"
              required
            />
          </div>
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
            {loading ? <LoadingSpinner /> : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300">
              Login
            </Link>
          </p>
        </div>
      </div>

      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div
            ref={otpModalRef}
            className="bg-gray-800 w-full max-w-md rounded-t-lg p-6 md:p-8 pb-12"
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
                    className="w-12 h-12 text-center text-2xl bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
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
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-300"
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