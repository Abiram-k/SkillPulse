import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  User,
  LayoutGrid,
  Users,
  Package,
  Image as ImageIcon,
  Tag,
  CreditCard,
  Package2,
  Percent,
  Settings,
  LogOut,
  Edit,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "@/axiosIntercepters/AxiosInstance";
import { ChangeStatus } from "@/Components/ChangeStatus";
import { adminorderDetails, logoutAdmin } from "@/redux/adminSlice";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [spinner, setSpinner] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const currentPage = useRef();
  const [pageCount, setPageCount] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageClick = async (e) => {
    currentPage.current = e.selected + 1;
    fetchOrders();
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `/admin/order?search=${search}&filter=${filter}&page=${
          currentPage.current || 1
        }&limit=${postPerPage}`
      );
      setOrders(response.data?.orderData);
      setPageCount(response.data?.pageCount || 1);
    } catch (error) {
      if (
        error?.response.data.message == "Token not found" ||
        error?.response.data.message == "Failed to authenticate Admin"
      ) {
        dispatch(logoutAdmin());
      }
      console.log(error.message);
      alert(error?.response.data.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    // (async () => {
    //   try {
    //     const response = await axios.get(`/admin/order?filter=${filterOrders}`);
    //     setOrders(response.data?.orderData);
    //   } catch (error) {
    //     if (
    //       error?.response.data.message == "Token not found" ||
    //       error?.response.data.message == "Failed to authenticate Admin"
    //     ) {
    //       dispatch(logoutAdmin());
    //     }
    //     console.log(error.message);
    //     alert(error?.response.data.message);
    //   }
    // })();
  }, [filter]);

  const handleUpdatedStatus = (status) => {
    if (status) setUpdatedStatus(status);
  };

  const getStatusColor = (status) => {
    if (status === "processing") return "text-yellow-500";
    if (status === "shipped") return "text-blue-500";
    if (status === "delivered") return "text-green-500";
    if (status === "pending") return "text-orange-500";
    if (status === "cancelled") return "text-red-500";
    if (status === "returned") return "text-red-500";
    return "text-gray-500";
  };

  const handleOrderDetails = (id) => {
    dispatch(adminorderDetails(id));
    navigate("/admin/orders/details");
  };

  return (
    <>
      <span className=" px-4 lg:text-3xl font-bold mb-5 text-gray-400">
        Orders
      </span>
      <div className="flex mt-10 flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <button
          className="flex items-center text-gray-600 mb-4 lg:mb-0"
          onClick={handleRefresh}
        >
          <i className="fas fa-sync-alt mr-2"></i> Refresh
        </button>
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
          {/* <input
            type="text"
            placeholder="Search..."
            className="border rounded text-black px-4 py-2 w-full lg:w-auto"
            value={search}
            onChange={handleSearchChange}
          /> */}
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-600">Filter</span>
            <select
              className="border rounded px-2 py-1 font-mono text-black  "
              value={filter}
              onChange={handleFilter}
            >
              <option value="">Select Option</option>
              <option value="cancelled">Cancelled</option>
              <option value="shipped">Shipped</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen bg-black font-mono">
        {spinner && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <div className="flex-1 bg-black">
          <main className="p-6">
            <div className="bg-black rounded overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white text-lg mb-5">
                    <th className="px-6 py-3 text-left">ORDER ID</th>
                    <th className="px-6 py-3 text-left">PRODUCT</th>
                    <th className="px-4 py-3 text-left">ORDER DATE</th>
                    <th className="px-6 py-3 text-left">PRICE</th>
                    <th className="px-6 py-3 text-left">ADDRESS</th>
                    <th className="px-6 py-3 text-left">STATUS</th>
                    <th className="px-6 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) =>
                      order.orderItems.map((item, index) => (
                        <tr
                          key={index}
                          className={`border-t  border-gray-800 hover:scale-100 hover:duration-150 cursor-pointer ${
                            index % 2 == 0 && "bg-gray-900"
                          }`}
                        >
                          <td className="px-6 py-4 text-gray-200">
                            {order.orderId}
                          </td>
                          <td
                            className="px-6 py-4 text-white "
                            onClick={() => handleOrderDetails(order?._id)}
                          >
                            {item.product?.productName} x ({item.quantity})
                          </td>
                          <td className="px-6 py-4 text-white">
                            {order.orderDate}
                          </td>
                          <td className="px-6 py-4 text-white">
                            {item.product.salesPrice * item.quantity}
                          </td>
                          <td className="px-6 py-4 text-white whitespace-pre-line">
                            {order.address.address},{order.address.pincode}
                          </td>
                          <td
                            className={`px-6 py-4 ${getStatusColor(
                              item.productStatus
                            )}`}
                          >
                            {item.productStatus}
                          </td>
                          <td className="px-6 py-4">
                            {item.productStatus !== "delivered" && (
                              <ChangeStatus
                                updatedState={handleUpdatedStatus}
                                orderId={order.orderId}
                                productId={item._id}
                                currentStatus={item.productStatus}
                              />
                            )}
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <p className="mt-10 ms-10  flex justify-center align-middle items-center font-semibold ">
                      No orders were founded
                    </p>
                  )}
                </tbody>
              </table>
              <ReactPaginate
                className="flex justify-center border-gray-700 items-center  space-x-2 mt-4"
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                marginPagesDisplayed={2}
                containerClassName="flex flex-wrap justify-center gap-2"
                pageClassName="flex items-center"
                pageLinkClassName="px-4 py-2 border border-gray-400 rounded-md text-sm  transition duration-200"
                previousClassName="flex items-center"
                previousLinkClassName="px-4 py-2 border rounded-md text-sm hover:bg-gray-700 transition duration-200"
                nextClassName="flex items-center"
                nextLinkClassName="px-4 py-2 border rounded-md text-sm hover:bg-gray-700 transition duration-200"
                activeClassName="bg-blue-500 text-white "
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default OrderManagement;
