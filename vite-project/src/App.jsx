import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/login';
import SignupForm from './pages/signup';
import ForgotPasswordForm from './pages/forgot';
import PasswordChangePage from './pages/passwordchange';

const App = () => {
  return (
    <Router>
       <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/changepassword" element={<PasswordChangePage/>} />
    </Routes>
    </Router>
   
  );
};

export default App;
