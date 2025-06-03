import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import LoadingSpinner from "./LoadingSpiner";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const AnalyticsCardData = [
    {
      title: "Total Users",
      value: analyticsData.users.toLocaleString(),
      icon: Users,
      color: "from-emerald-500 to-teal-700",
    },
    {
      title: "Total Products",
      value: analyticsData.products.toLocaleString(),
      icon: Package,
      color: "from-emerald-500 to-teal-700",
    },
    {
      title: "Total Sale",
      value: analyticsData.totalSales.toLocaleString(),
      icon: ShoppingCart,
      color: "from-emerald-500 to-teal-700",
    },
    {
      title: "Total Revenue",
      value: analyticsData.totalRevenue.toLocaleString(),
      icon: DollarSign,
      color: "from-emerald-500 to-teal-700",
    },
  ];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {AnalyticsCardData.map((item) => {
          return (
            <AnalyticsCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
            />
          );
        })}
      </div>

      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#ffffff" />
            <YAxis yAxisId="left" stroke="#10B981" />
            <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
              name="$ Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;