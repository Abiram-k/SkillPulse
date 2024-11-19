"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/axiosIntercepters/AxiosInstance";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
export default function Chart({ orders }) {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (orders && orders.length > 0) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const initialMonthData = months.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
      }, {});

      orders.forEach((order, index) => {
        const [day, month, year] = order.orderDate.split("/");
        initialMonthData[months[month - 1]] += 1;
      });

      const monthlyOrders = months.map((month) => ({
        month,
        orders: initialMonthData[month],
      }));

      setChartData(monthlyOrders);
    }
  }, [orders]);

  return (
    <Card className="w-full font-mono">
      {chartData.length > 0 ? (
        <>
          {" "}
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #cccccc",
                    }}
                    labelStyle={{ color: "#333333" }}
                  />
                  <Bar dataKey="orders" fill="#2563eb" name="orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total desktop visitors for the last 6 months
            </div>
          </CardFooter>
        </>
      ) : (
        <p>Nothing to show</p>
      )}
    </Card>
  );
}
