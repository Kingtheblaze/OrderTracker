import mongoose, { Schema, Document } from 'mongoose';

export interface ITrackingEntry {
  status: string;
  timestamp: Date;
  updatedBy: string;
}

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  item: string;
  amount: number;
  status: 'Order Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingHistory: ITrackingEntry[];
  createdAt: Date;
}

const TrackingEntrySchema: Schema = new Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true }
}, { _id: false });

const OrderSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Order Placed'
  },
  trackingHistory: [TrackingEntrySchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
