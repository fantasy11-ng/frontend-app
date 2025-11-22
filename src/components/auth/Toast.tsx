'use client';

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export default function Toast({ message, onClose, type = 'info' }: ToastProps) {
  const bgColor = type === 'success' 
    ? 'bg-gray-800' 
    : type === 'error' 
    ? 'bg-gray-800' 
    : 'bg-gray-800';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-4 min-w-[300px] max-w-md`}>
      <p className="flex-1 text-sm text-white">{message}</p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-medium transition-colors whitespace-nowrap"
      >
        Okay
      </button>
    </div>
  );
}

