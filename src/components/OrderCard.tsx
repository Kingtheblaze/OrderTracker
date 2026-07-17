'use client';

import React, { useState } from 'react';
import OrderTimeline from './OrderTimeline';

interface TrackingEntry {
  status: string;
  timestamp: string;
  updatedBy: string;
}

export interface OrderData {
  _id: string;
  customerName: string;
  customerEmail: string;
  item: string;
  amount: number;
  status: 'Order Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingHistory: TrackingEntry[];
  createdAt: string;
}

interface OrderCardProps {
  order: OrderData;
  role: 'customer' | 'manager';
  onStatusChange?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
}

const STATUS_OPTIONS = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderCard({ order, role, onStatusChange, onDelete }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onStatusChange) return;
    setIsUpdating(true);
    await onStatusChange(order._id, e.target.value);
    setIsUpdating(false);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Order Placed': return 'status-placed';
      case 'Confirmed': return 'status-confirmed';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Out for Delivery': return 'status-out';
      case 'Delivered': return 'status-delivered';
      default: return 'status-placed';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Placed': return '📦';
      case 'Confirmed': return '✅';
      case 'Processing': return '⚙️';
      case 'Shipped': return '🚚';
      case 'Out for Delivery': return '🏍️';
      case 'Delivered': return '🎉';
      default: return '📦';
    }
  };

  return (
    <div className="glass-panel order-card animate-fade-in">
      <div className="card-header">
        <div>
          <div className="order-id">ORDER #{order._id.substring(order._id.length - 8).toUpperCase()}</div>
          <h3 className="customer-name">{order.item}</h3>
          {role === 'manager' && (
            <div className="customer-email-tag">
              👤 {order.customerName} • {order.customerEmail}
            </div>
          )}
        </div>
        <div className={`status-badge ${getStatusClass(order.status)}`}>
          {getStatusIcon(order.status)} {order.status}
        </div>
      </div>

      <div className="order-details">
        <div className="detail-row">
          <span className="detail-label">Amount</span>
          <span className="detail-value amount-value">₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Ordered On</span>
          <span className="detail-value">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <button className="btn-timeline" onClick={() => setShowTimeline(!showTimeline)}>
        {showTimeline ? 'Hide Tracking' : '📍 Track Order'}
      </button>

      {showTimeline && (
        <div className="animate-fade-in">
          <OrderTimeline trackingHistory={order.trackingHistory} currentStatus={order.status} />
        </div>
      )}

      {role === 'manager' && (
        <div className="card-footer">
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={order.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            className="btn-danger"
            onClick={() => onDelete && onDelete(order._id)}
            title="Delete Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
