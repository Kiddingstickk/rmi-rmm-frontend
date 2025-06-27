export default function MinimalLoader() {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce" />
        </div>
      </div>
    );
  }
  