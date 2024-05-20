import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PasswordChangePage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state to manage initial loading state

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Access email and otp query parameters
  const email = queryParams.get('email');
  const otp = queryParams.get('otp');
  const body = { email: email, otp: otp };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://passwordreset-test-sn8l.vercel.app/verify', body);
        if (response.data.message === "success") {
          setPage(true);
        } else {
          setPage(false);
        }
      } catch (error) {
        // Handle error
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false when request is done
      }
    };

    fetchData();
  }, [email, otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body2={email:email,password:password}

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    else
    {
       const response2=await axios.patch('https://passwordreset-test-sn8l.vercel.app/passwordupdate', body2);
       if(response2.status===200)
       {
        setPassword('');
        setConfirmPassword('');
        setMessage('Password changed successfully');
       }

    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <>
      {page ? (
        <div className="max-w-md mx-auto mt-8 px-4 py-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Password Change</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            {message && <p className="text-red-500 mb-4">{message}</p>}
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Change Password
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-semibold mb-4">Error: Invalid Page</h2>
          <p className="text-red-500">Sorry, the page you are trying to access is invalid.</p>
        </div>
      )}
    </>
  );
};

export default PasswordChangePage;
