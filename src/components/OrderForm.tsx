'use client';

import React, { useState } from 'react';

interface OrderFormProps {
  onAdd: (orderData: { customerEmail: string, item: string, amount: number }) => Promise<{ error?: string } | void>;
  onClose: () => void;
}

export default function OrderForm({ onAdd, onClose }: OrderFormProps) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await onAdd({
      customerEmail,
      item,
      amount: parseFloat(amount)
    });
    
    if (result && result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>📦 Create New Order</h2>
        <button className="btn-danger" onClick={onClose}>✕</button>
      </div>
      
      {error && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Customer Email</label>
          <input
            type="email"
            className="form-input"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            placeholder="customer@example.com"
          />
          <small style={{ color: '#64748b', fontSize: '0.8rem' }}>Customer must have an account to receive orders</small>
        </div>
        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input
            type="text"
            className="form-input"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
            placeholder="e.g. iPhone 15 Pro Max"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : '+ Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
