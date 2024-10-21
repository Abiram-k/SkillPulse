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
import Customers from "./Pages/Admin/coustumers/Customers";
import Products from "./Pages/Admin/products/Products";
import AddProduct from "./Pages/Admin/addProduct/AddProduct";
import Category from "./Pages/Admin/categoryManagement/Category";
import EditCategory from "./Pages/Admin/editCategory/EditCategory";
import Provider from "./Components/Provider";
import EditProduct from "./Pages/Admin/editProduct/EditProduct";
import ProductDetails from "./Pages/User/productDetails/ProductDetails";
import UserLayout from "./Pages/User/userLayout/UserLayout";
import ProtectUserHome from "./Protected/ProtectUserHome";
import ProtectAuthUser from "./Protected/ProtectAuthUser";
import AccountOverview from "./Pages/User/accountOverview/accountOverview";
import GoogleAuthComponent from "./Pages/User/googleAuthComponent/googleAuthComponent";
import Shop from "./Pages/User/shop/Shop";
import SearchProducts from "./Pages/User/searchProducts/SearchProducts";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/googleRedirect" element={<GoogleAuthComponent />} />
          <Route
            path="/login"
            element={
              <ProtectAuthUser>
                <Login />
              </ProtectAuthUser>
            }
          />

          <Route
            path="/signup"
            element={
              <ProtectAuthUser>
                <Signup />
              </ProtectAuthUser>
            }
          />
          <Route
            path="/otp"
            element={
              <ProtectAuthUser>
                <Otp />
              </ProtectAuthUser>
            }
          />

          <Route
            path="/"
            element={
              <ProtectAuthUser>
                <LandingPage />
              </ProtectAuthUser>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectUserHome>
                <UserLayout />
              </ProtectUserHome>
            }
          >
            <Route path="search" element={<SearchProducts />} />


            <Route
              path="home"
              element={
                <ProtectUserHome>
                  <Provider>
                    <HomePage />
                  </Provider>
                </ProtectUserHome>
              }
            />
            <Route
              path="shop"
              element={
                <ProtectUserHome>
                  <Shop />
                </ProtectUserHome>
              }
            />
            <Route
              path="productDetails"
              element={
                <Provider>
                  <ProductDetails />
                </Provider>
              }
            />
            <Route path="profile" element={<AccountOverview />} />
          </Route>

          <Route path="admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route
              path="products"
              element={
                <Provider>
                  <Products />
                </Provider>
              }
            />
            <Route path="products/add" element={<AddProduct />} />
            <Route
              path="products/edit"
              element={
                <Provider>
                  <EditProduct />
                </Provider>
              }
            />
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
