import React from 'react';
import './LazyLoadingIndicator.css';

function LazyLoadingIndicator() {
  return (
    <div className="lazy-container">
      <div className="lazy-box">
        <div className="clock" />
      </div>
    </div>
  );
}

export default LazyLoadingIndicator;