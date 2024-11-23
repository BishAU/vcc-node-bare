import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-[2rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50 opacity-90" />

          {/* Content */}
          <div className="relative px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-black">{title}</div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
