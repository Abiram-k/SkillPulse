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
import Checkout from "./Pages/User/checkout/CheckOut";
import ManageOrders from "./Pages/User/manageOrders/manageOrders";
import OrderManagement from "./Pages/Admin/orderManagement/OrderManagement";
import Brand from "./Pages/Admin/brandManagement/Brand";
import EditBrand from "./Pages/Admin/brandManagement/EditBrand";
import Contact from "./Pages/User/contact/Contact";
import About from "./Pages/User/about/About";
import ForgotPassword from "./Pages/User/forgotPassword/ForgotPassword";
import EmailVerification from "./Pages/User/forgotPassword/EmailVerification";
import Wallet from "./Pages/User/wallet/Wallet";
import CouponManagement from "./Pages/Admin/couponManagment/CouponManagement";
import Coupon from "./Pages/User/coupon/Coupon";
import { Toaster } from "./Components/ui/toaster";
import ProtectCheckout from "./Protected/ProtectCheckout";
import OrderReport from "./Pages/Admin/SalesReport/OrderReport";
import AddCoupon from "./Pages/Admin/couponManagment/AddCoupon";
import ToastNotification from "./Components/ToastNotification";
import BannerManagement from "./Pages/Admin/bannerManagement/BannerManagement";
import RefundPage from "./Pages/User/refundPage/RefundPage";
import ReturnRequests from "./Pages/Admin/returnRequests/ReturnRequests";
function App() {
  return (
    <>
      <ToastNotification />
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
            path="/forgotPassword"
            element={
              <ProtectAuthUser>
                <ForgotPassword />
              </ProtectAuthUser>
            }
          />
          <Route
            path="/verifyEmail"
            element={
              <ProtectAuthUser>
                <EmailVerification />
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
              path="search"
              element={
                <ProtectUserHome>
                  <SearchProducts />
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
              path="contact"
              element={
                <ProtectUserHome>
                  <Contact />
                </ProtectUserHome>
              }
            />
            <Route
              path="coupon"
              element={
                <ProtectUserHome>
                  <Coupon />
                </ProtectUserHome>
              }
            />
            <Route
              path="about"
              element={
                <ProtectUserHome>
                  <About />
                </ProtectUserHome>
              }
            />

            <Route
              path="checkout"
              element={
                <ProtectUserHome>
                  <ProtectCheckout>
                    <Checkout />
                  </ProtectCheckout>
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
                path="Myorders"
                element={
                  <ProtectUserHome>
                    <ManageOrders />
                  </ProtectUserHome>
                }
              />
              <Route
                path="Myorders/refund"
                element={
                  <ProtectUserHome>
                    <RefundPage />
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
                path="wallet"
                element={
                  <ProtectUserHome>
                    <Wallet />
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
              path="notifications"
              element={
                <ProtectedDashboardAdmin>
                  <ReturnRequests />
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="orderReport"
              element={
                <ProtectedDashboardAdmin>
                  <OrderReport />
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedDashboardAdmin>
                  <OrderManagement />
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
              path="coupon"
              element={
                <ProtectedDashboardAdmin>
                  <CouponManagement />
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="coupon/add"
              element={
                <ProtectedDashboardAdmin>
                  <AddCoupon />
                </ProtectedDashboardAdmin>
              }
            />
            <Route
              path="bannerMangement"
              element={
                <ProtectedDashboardAdmin>
                  <BannerManagement />
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
              path="brand"
              element={
                <ProtectedDashboardAdmin>
                  <Provider>
                    <Brand />
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
            <Route
              path="brand/edit"
              element={
                <ProtectedDashboardAdmin>
                  <Provider>
                    <EditBrand />
                  </Provider>
                </ProtectedDashboardAdmin>
              }
            />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
