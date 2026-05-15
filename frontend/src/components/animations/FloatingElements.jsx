import React from 'react';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Static background elements - no animation to prevent instability */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-400/15 rounded-full blur-2xl"></div>
    </div>
  );
};

export default FloatingElements;