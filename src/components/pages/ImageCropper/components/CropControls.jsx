const CropControls = ({ onCrop, onDownload, onRestore, onFileChange }) => (
    <div className="flex gap-4">
        <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
            onClick={onCrop}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
            Crop
        </button>
        <button
            onClick={onDownload}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
            Download Cropped
        </button>
        <button
            onClick={onRestore}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
            Restore
        </button>
    </div>
);

export default CropControls