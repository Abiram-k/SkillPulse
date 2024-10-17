import Login from "./Pages/User/login/Login";
import React from "react";
import Signup from "./Pages/User/signup/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Otp from "./Pages/User/otp/Otp";
import LandingPage from "./Pages/User/landingpage/LandingPage";
import HomePage from "./Pages/User/homPage/HomePage";
import Dashboard from "./Pages/Admin/dashboard/DashBoard";
import AdminLogin from "./Pages/Admin/login/AdminLogin";
import AdminLayout from "./Pages/Admin/adminLayout/AdminLayout";
import Customers from "./Pages/coustumers/Customers";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />

          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout/>}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />

          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
