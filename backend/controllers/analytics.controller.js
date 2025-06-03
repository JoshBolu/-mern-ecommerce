import Product from "../model/product.model.js";
import Order from "../model/order.model.js";
import User from "../model/user.model.js";

import { StatusCodes } from "http-status-codes";

const getAnalyticData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all document together
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

const getDatesinRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const getDailySalesOrders = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateArray = getDatesinRange(startDate, endDate);

    return dateArray.map((date) => {
      const foundData = dailySalesData.find(
        (item) => item._id === date.toISOString().split("T")[0]
      );
      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 1000 * 60 * 60 * 24 * 7); // 7 days ago

    const dailySalesData = await getDailySalesOrders(startDate, endDate);

    res.status(StatusCodes.OK).json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.error(`Error in analyticsContoller: ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};