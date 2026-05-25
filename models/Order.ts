import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  quantity: number;
  product: any;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  trackingId?: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  product: { type: Schema.Types.Mixed, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "paid",
    },
    trackingId: { type: String },
    shippingAddress: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Duplicate the ID field.
OrderSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
OrderSchema.set("toJSON", {
  virtuals: true,
});

export const Order = (mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)) as mongoose.Model<IOrder>;
