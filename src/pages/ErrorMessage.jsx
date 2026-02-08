const ErrorMessage = ({ message }) => (
  <div className="text-center mt-28 min-h-screen flex items-center justify-center">
    <div className="max-w-md">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorMessage;