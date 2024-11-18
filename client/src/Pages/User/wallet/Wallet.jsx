import React, { useEffect, useState } from "react";
import axios from "@/axiosIntercepters/AxiosInstance";
import { format } from "date-fns";

import { useSelector } from "react-redux";
const Wallet = () => {
  const [walletData, setWalletData] = useState({});
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/wallet/${user._id}`);
        setWalletData(response.data.wallet);
        console.log("Wallet data : ", response.data.wallet);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  return (
    <div className="flex flex-col  space-y-6 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="flex justify-between bg-gray-900 p-4 rounded">
        <div className="flex items-center gap-2 justify-center">
          <i className="fa-solid fa-wallet text-yellow-500 text-xl"></i>
          <p className="text-white font-bold text-xl">Wallet Balance</p>
        </div>

        <p className="font-bold text-green-600 text-xl">
          {walletData?.totalAmount ? (walletData?.totalAmount).toFixed(2) : "0"}{" "}
          ₹
        </p>
      </div>
      <section className="bg-gray-900 p-6 rounded-lg ">
        <h3 className="text-red-500 text-xl font-bold mb-4 lg:mb-10">
          WALLET HISTORY
        </h3>

        <div
          className="hidden sm:grid grid-cols-4 gap-4 text-sm font-semibold tracking-widest mb-4 lg:mb-8 lg:text-md font-sans pb-2 border-b-4 border-gray-700 
        "
        >
          <span className="lg:ms-3">DESCRIPTION</span>
          <span>DATE</span>
          <span>AMOUNT</span>
          <span>TRANSACTION ID</span>
        </div>
        {walletData?.transaction?.map((transact) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-3 lg:mt-6 text-sm sm:text-base text-gray-300
           "
          >
            <div className="sm:col-span-1 ">{transact.description}</div>
            <div className="sm:col-span-1">
              {format(transact.date, "dd-MM-yyyy")}
            </div>
            <div
              className={`sm:col-span-1 ${
                transact.amount > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {parseInt(transact.amount).toFixed(2)} ₹
            </div>
            <div className="sm:col-span-1">{transact.transactionId}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Wallet;
