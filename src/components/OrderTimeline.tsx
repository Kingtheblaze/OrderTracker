'use client';

import React from 'react';

interface TrackingEntry {
  status: string;
  timestamp: string;
  updatedBy: string;
}

const ALL_STATUSES = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTimeline({ trackingHistory, currentStatus }: { trackingHistory: TrackingEntry[], currentStatus: string }) {
  const currentIndex = ALL_STATUSES.indexOf(currentStatus);

  return (
    <div className="timeline">
      {ALL_STATUSES.map((status, index) => {
        const entry = trackingHistory.find(t => t.status === status);
        const isCompleted = index <= currentIndex && entry;
        const isCurrent = status === currentStatus;

        return (
          <div key={status} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="timeline-dot">
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <span className="dot-number">{index + 1}</span>
              )}
            </div>
            {index < ALL_STATUSES.length - 1 && <div className={`timeline-line ${isCompleted && index < currentIndex ? 'completed' : ''}`}></div>}
            <div className="timeline-content">
              <span className="timeline-status">{status}</span>
              {entry && (
                <span className="timeline-date">
                  {new Date(entry.timestamp).toLocaleDateString('en-IN', { 
                    day: 'numeric', month: 'short', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
