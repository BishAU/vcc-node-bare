import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import ReportRegistration from '../forms/ReportRegistration';

interface ReportRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportRegistrationModal: React.FC<ReportRegistrationModalProps> = ({ isOpen, onClose }) => {
  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
            <ReportRegistration onSuccess={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportRegistrationModal;
