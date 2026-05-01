"use client"

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { sendOTP, verifyOtp, resetPassword, clearError } from '@/app/redux/authSlice';
import Loading from '@/app/common/loading';
import Link from 'next/link';
import Spinner from '@/app/common/spinner';
import { isValidUsername } from '@/app/common/utils/validationHelpers';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [inputError, setInputError] = useState('');
  const [otpError, setOtpError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    const error = isValidUsername(value);
    setInputError(error);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);
    const sanitizedValue = value.replace(/[a-zA-Z<>'"]/g, '');
    setOtp(sanitizedValue);
    const error = sanitizedValue !== value ? 'Invalid characters detected in OTP.' : '';
    setOtpError(error);
  };

  const handleSendOTP = () => {
    const usernameError = isValidUsername(username);
    if (usernameError) {
      setInputError(usernameError);
      return;
    }
    setInputError('');
    dispatch(sendOTP({ username }))
      .unwrap()
      .then(() => setStep(2))
      .catch((err) => console.error('OTP Send Failed', err));
  };

  const handleVerifyOTP = () => {
    const otpError = otp.match(/[^0-9]/) ? 'OTP can only contain numbers.' : '';
    if (otpError) {
      setOtpError(otpError);
      return;
    }
    setOtpError('');
    dispatch(verifyOtp({ username, otp }))
      .unwrap()
      .then(() => router.push('/login/reset-password'))
      .catch((err) => console.error('OTP Verification Failed', err));
  };

  // Clear errors when navigating to login page
  const handleNavigateToLogin = () => {
    dispatch(clearError()); // Clear any existing errors
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center h-auto bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-4 text-2xl font-bold text-center">
          {step === 1 ? 'Forgot Password' : 'Verify OTP'}
        </h2>
        {step === 1 ? (
          <>
            <input
              type="text"
              placeholder="Enter User Name"
              value={username}
              onChange={handleUsernameChange}
              className={`w-full px-3 py-2 mt-2 mb-1 border rounded-md ${inputError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {inputError && <p className="mt-2 text-sm text-red-500 mb-4">{inputError}</p>}
            <button
              onClick={handleSendOTP}
              className="flex justify-center items-center w-full py-2 mt-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading && <Spinner />}
              {loading ? 'Sending OTP' : 'Send OTP'}
            </button>
            <Link href="../../" className="block mt-4 text-center text-blue-500">
              Already have an account? Login
            </Link>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              className={`w-full px-3 py-2 mt-2 mb-4 border rounded-md ${otpError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {otpError && <p className="mt-2 text-sm text-red-500 mb-4">{otpError}</p>}
            <button
              onClick={handleVerifyOTP}
              className="flex items-center justify-center w-full py-2 mt-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading && <Spinner />}
              {loading ? 'Verifying OTP' : 'Verify OTP'}
            </button>
            <Link href="../../" className="block mt-4 text-center text-blue-500" onClick={handleNavigateToLogin}>
              Already have an account? Login
            </Link>
          </>
        )}
        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
}
