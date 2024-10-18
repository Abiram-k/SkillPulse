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
import Products from "./Pages/Admin/products/Products";
import AddProduct from "./Pages/Admin/addProduct/AddProduct";
import Category from "./Pages/Admin/categoryManagement/Category";
import EditCategory from "./Pages/Admin/editCategory/EditCategory";
import Provider from "./Components/Provider";
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

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit" element={<AddProduct />} />
            {/* <Provider> */}
            <Route
              path="category"
              element={
                <Provider>
                  <Category />
                </Provider>
              }
            />
            <Route
              path="category/edit"
              element={
                <Provider>
                  <EditCategory />
                </Provider>
              }
            />
            {/* </Provider> */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
