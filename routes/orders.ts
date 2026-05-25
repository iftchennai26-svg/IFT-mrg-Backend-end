import { Router, Request, Response } from "express";
import { Order } from "../models/Order";
import { Book } from "../models/Book";

const router = Router();

// GET all orders (optionally filtered by userId)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId: String(userId) } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).exec();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET single order
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST create order (Checkout sync)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, items, total, status, trackingId, shippingAddress } = req.body;

    const newOrder = new Order({
      userId,
      items,
      total,
      status: status || "paid",
      trackingId,
      shippingAddress,
    });

    await newOrder.save();

    // Adjust inventory stock levels
    for (const item of items) {
      try {
        if (item.productId && !item.productId.startsWith("guest-") && !item.productId.includes("-")) {
          // If productId is a valid MongoDB ObjectId
          await Book.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
          });
        }
      } catch (err) {
        console.error("Failed to decrement stock for item:", item.productId, err);
      }
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT update order status
router.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const { status, trackingId } = req.body;
    if (status && !["pending", "paid", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updateFields: any = { updatedAt: new Date() };
    if (status) updateFields.status = status;
    if (trackingId) updateFields.trackingId = trackingId;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// DELETE order
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;
