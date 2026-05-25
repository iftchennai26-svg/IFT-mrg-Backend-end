import { Router, Request, Response } from "express";
import { Order } from "../models/Order";
import { Book } from "../models/Book";

const router = Router();

// GET shop analytical stats for the Admin Dashboard
router.get("/", async (req: Request, res: Response) => {
  try {
    // 1. Calculate Total Sales Revenue
    const salesAggregation = await Order.aggregate([
      { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalSales = salesAggregation[0]?.totalRevenue || 0;

    // 2. Count Active Orders
    const activeOrdersCount = await Order.countDocuments({
      status: { $in: ["pending", "paid", "shipped"] },
    });

    // 3. Count Total Delivered Orders (books sold metric)
    const deliveredOrdersCount = await Order.countDocuments({
      status: { $in: ["delivered"] },
    });

    // 4. Count total books sold (sum of quantities in completed orders)
    const booksSoldAgg = await Order.aggregate([
      { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
      { $unwind: "$items" },
      { $group: { _id: null, totalBooksSold: { $sum: "$items.quantity" } } },
    ]);
    const totalBooksSold = booksSoldAgg[0]?.totalBooksSold || 0;

    // 5. Count Low Stock Books (stock < 5)
    const lowStockCount = await Book.countDocuments({ stock: { $lt: 5 } });

    // 6. Category Distribution
    const categoryAggregation = await Book.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const categoriesDistribution = categoryAggregation.map((cat) => ({
      name: cat._id || "Uncategorized",
      count: cat.count,
    }));

    // 7. Total Products Count
    const totalProductsCount = await Book.countDocuments();

    // 8. Recent Orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).exec();

    // 9. Top Selling Books (by quantity sold in orders)
    const topBooksAgg = await Order.aggregate([
      { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          bookName: { $first: "$items.product.name" },
          bookImage: { $first: "$items.product.imageUrl" },
          bookCategory: { $first: "$items.product.category" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.product.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // 10. Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenueAgg = await Order.aggregate([
      {
        $match: {
          status: { $in: ["paid", "shipped", "delivered"] },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTrend = monthlyRevenueAgg.map((m) => ({
      month: monthNames[m._id.month - 1],
      revenue: m.revenue,
      orders: m.orders,
    }));

    // 11. Order Status Distribution
    const orderStatusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const orderStatusDistribution = orderStatusAgg.map((s) => ({
      status: s._id,
      count: s.count,
    }));

    // 12. Total unique users who have ordered
    const uniqueUsersAgg = await Order.aggregate([
      { $group: { _id: "$userId" } },
      { $count: "total" },
    ]);
    const uniqueCustomers = uniqueUsersAgg[0]?.total || 0;

    res.json({
      totalSales,
      activeOrders: activeOrdersCount,
      deliveredOrders: deliveredOrdersCount,
      totalBooksSold,
      lowStockCount,
      totalProducts: totalProductsCount,
      categoriesDistribution,
      conversionRate: 12.4,
      recentOrders,
      topBooks: topBooksAgg,
      monthlyTrend,
      orderStatusDistribution,
      uniqueCustomers,
    });
  } catch (error) {
    console.error("Error generating analytics stats:", error);
    res.status(500).json({ error: "Failed to generate analytical stats" });
  }
});

export default router;
