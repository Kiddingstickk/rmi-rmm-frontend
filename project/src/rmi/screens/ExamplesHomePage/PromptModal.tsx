import React from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  onReview: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, onViewProfile, onReview }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">What would you like to do?</h2>
        <div className="flex flex-col space-y-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              onViewProfile();
              onClose();
            }}
          >
            View Profile
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={() => {
              onReview();
              onClose();
            }}
          >
            Review Interviewer
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default PromptModal;
