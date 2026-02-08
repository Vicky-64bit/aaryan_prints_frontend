import React from 'react';
import Button from './Button';

const Modal = ({ children, onClose, title, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button variant="ghost" onClick={onClose} className="text-xl">
            ×
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;