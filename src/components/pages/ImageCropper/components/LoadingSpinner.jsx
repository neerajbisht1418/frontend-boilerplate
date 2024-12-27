const LoadingSpinner = ({ loading }) => {
  if (!loading.isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="text-gray-700">
            {loading.operation === 'fileLoad' && 'Loading image...'}
            {loading.operation === 'crop' && 'Cropping image...'}
            {loading.operation === 'download' && 'Preparing download...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner