'use client'

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin, clearError } from "@/app/redux/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Spinner from "../common/spinner";
import { isValidPassword, isValidUsername, limitToCharacters } from "../common/utils/validationHelpers";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
    const newErrors = {};

    const usernameError = isValidUsername(username);
    if (usernameError) newErrors.username = usernameError;
    
    const passwordError = isValidPassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const resultAction = await dispatch(adminLogin({ username, password }));
      if (adminLogin.fulfilled.match(resultAction)) {
        router.push('/pages/Dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e, setter, field) => {
    const limitedValue = limitToCharacters(e.target.value); 
    setter(limitedValue);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) dispatch(clearError());
  };

  return (
    <div className="flex items-center justify-center w-full bg-[#faf9f6]">
      <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-1xl w-full max-w-96 ">
        <h2 className="mb-4 text-2xl font-bold text-center text-[#062c21]">Admin Login</h2>
        <form onSubmit={handleLogin}>
          {error && (
            <p className="mb-3 text-rose-600 font-semibold text-sm">{error}</p>
          )}

          <label htmlFor="username" className="block text-xl font-medium text-[#062c21]">
            User Name
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter Your User Name"
            value={username}
            onChange={(e) => handleChange(e, setUsername, 'username')}
            className={`w-full px-3 py-2 mt-2 mb-1 border rounded-md focus:ring-2 focus:ring-[#062c21] focus:outline-none ${errors.username ? 'border-rose-500' : 'border-slate-300'}`}
          />
          {errors.username && <p className="text-sm text-rose-600">{errors.username}</p>}

          <label htmlFor="password" className="block mt-2 text-xl font-medium text-[#062c21]">
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleChange(e, setPassword, 'password')}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-[#062c21] focus:outline-none ${errors.password ? 'border-rose-500' : 'border-slate-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-slate-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-sm text-rose-600">{errors.password}</p>}

          <button
            type="submit"
            className="flex items-center justify-center w-full py-2 mt-4 text-amber-300 bg-[#062c21] rounded-full hover:bg-[#093d2e] font-semibold transition"
          >
            {loading && <Spinner />}
            {loading ? "Login..." : "Login"}
          </button>

          {/* <p className="mt-4 text-center text-amber-700 cursor-pointer text-1xl hover:text-[#062c21] hover:underline">
            <Link href="/login/register">Don&rsquo;t have an Account? Register</Link>
          </p> */}
          {/* <div className="flex justify-center mt-2">
            <Link href="/login/forgot-password" className="text-amber-700 hover:text-[#062c21] hover:underline" passHref>
              Forgot Password?
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;