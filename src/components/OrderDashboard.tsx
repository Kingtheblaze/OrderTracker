'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import OrderForm from './OrderForm';
import OrderCard, { OrderData } from './OrderCard';

export default function OrderDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async (orderData: { customerEmail: string, item: string, amount: number }) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Failed to create order' };
      }

      setOrders([data, ...orders]);
      return {};
    } catch (error) {
      return { error: 'Network error' };
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(order => order._id === id ? updatedOrder : order));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setOrders(orders.filter(order => order._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete order', error);
    }
  };

  if (!user) return null;
  const isManager = user.role === 'manager';

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Order Placed' || o.status === 'Confirmed').length,
    inTransit: orders.filter(o => o.status === 'Shipped' || o.status === 'Out for Delivery').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title">
            {isManager ? 'Manager Dashboard' : 'My Orders'}
          </h1>
          <p className="subtitle">
            {isManager ? 'Manage all customer orders and update tracking' : 'Track your orders in real-time'}
          </p>
        </div>
        {isManager && (
          <button
            className="btn-primary btn-lg"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Create Order'}
          </button>
        )}
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>📦</div>
          <div className="stat-info">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>⏳</div>
          <div className="stat-info">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>🚚</div>
          <div className="stat-info">
            <span className="stat-number">{stats.inTransit}</span>
            <span className="stat-label">In Transit</span>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>✅</div>
          <div className="stat-info">
            <span className="stat-number">{stats.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
      </div>

      {showForm && isManager && (
        <div className="animate-fade-in">
          <OrderForm onAdd={handleAddOrder} onClose={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 grid-md-2 grid-lg-3">
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Orders Found</h3>
              <p>{isManager ? 'Click "+ Create Order" to add a new order.' : 'You have no orders yet. Your orders will appear here once a manager creates one for you.'}</p>
            </div>
          ) : (
            orders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                role={user.role}
                onStatusChange={isManager ? handleStatusChange : undefined}
                onDelete={isManager ? handleDelete : undefined}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
