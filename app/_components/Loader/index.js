import React from 'react';
import ProgressBar from './ProgressBar';

export default function MyLoader({ height }) {
  return (
    <div style={{ position: 'relative', height: height || 60, textAlign: 'center' }}>
      <ProgressBar
        style={{ transform: 'scale(0.5)' }}
        type="circular"
        mode="indeterminate"
        multicolor
      />
    </div>
  );
}
