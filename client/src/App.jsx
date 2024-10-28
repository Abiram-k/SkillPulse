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
import AccountOverview from "./Pages/User/accountOverview/AccountOverview";
import GoogleAuthComponent from "./Pages/User/googleAuthComponent/googleAuthComponent";
import Shop from "./Pages/User/shop/Shop";
import SearchProducts from "./Pages/User/searchProducts/SearchProducts";
import ProtectedAuthAdmin from "./Protected/ProtectedAuthAdmin";
import ProtectedDashboardAdmin from "./Protected/ProtectedDashboard";
import ProtectedOtp from "./Protected/ProtectOtp";
import Breadcrumbs from "./Components/Breadcrumbs";
import ManageAddress from "./Pages/User/manageAdress/ManageAddress";
import AccountLayout from "./Pages/User/accountLayout/AccountLayout";
import AddAddress from "./Pages/User/manageAdress/AddAddress";
import EditAddress from "./Pages/User/manageAdress/EditAddress";
import Wishlist from "./Pages/User/wishlist/Wishlist";
import ShoppingCartPage from "./Pages/User/cart/ShoppingCartPage";
import Checkout from "./Pages/User/checkout.jsx/CheckOut";
function App() {
  return (
    <>
      <Router>
        <Breadcrumbs />
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
              <ProtectedOtp>
                <ProtectAuthUser>
                  <Otp />
                </ProtectAuthUser>
              </ProtectedOtp>
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
              path="wishlist"
              element={
                <ProtectUserHome>
                  <Provider>
                    <Wishlist />
                  </Provider>
                </ProtectUserHome>
              }
            />
            <Route
              path="cart"
              element={
                <ProtectUserHome>
                  <ShoppingCartPage />
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
              path="checkout"
              element={
                <ProtectUserHome>
                  <Checkout />
                </ProtectUserHome>
              }
            />
            <Route
              path="cart/checkout"
              element={
                <ProtectUserHome>
                  <Checkout />
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
            <Route
              path="profile"
              element={
                <ProtectUserHome>
                  <AccountLayout />
                </ProtectUserHome>
              }
            >
              <Route
                path=""
                element={
                  <ProtectUserHome>
                    <AccountOverview />
                  </ProtectUserHome>
                }
              />
              <Route
                path="manageAddress"
                element={
                  <ProtectUserHome>
                    <ManageAddress />
                  </ProtectUserHome>
                }
              />
              <Route
                path="addNew"
                element={
                  <ProtectUserHome>
                    <AddAddress />
                  </ProtectUserHome>
                }
              />
              <Route
                path="editAddress/:address"
                element={
                  <ProtectUserHome>
                    <EditAddress />
                  </ProtectUserHome>
                }
              />
            </Route>
          </Route>

          <Route
            path="admin/login"
            element={
              <ProtectedAuthAdmin>
                <AdminLogin />
              </ProtectedAuthAdmin>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedDashboardAdmin>
                <AdminLayout />
              </ProtectedDashboardAdmin>
            }
          >
            <Route
              path="dashboard"
              element={
                <ProtectedDashboardAdmin>
                  <Dashboard />
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedDashboardAdmin>
                  <Customers />
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="products"
              element={
                <ProtectedDashboardAdmin>
                  <Provider>
                    <Products />
                  </Provider>
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="products/add"
              element={
                <ProtectedDashboardAdmin>
                  <AddProduct />
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="products/edit"
              element={
                <ProtectedDashboardAdmin>
                  <Provider>
                    <EditProduct />
                  </Provider>
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="category"
              element={
                <ProtectedDashboardAdmin>
                  <Provider>
                    <Category />
                  </Provider>
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="category/edit"
              element={
                <ProtectedDashboardAdmin>
                  <Provider>
                    <EditCategory />
                  </Provider>
                </ProtectedDashboardAdmin>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
