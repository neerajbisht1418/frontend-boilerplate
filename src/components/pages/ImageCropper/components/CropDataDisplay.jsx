const CropDataDisplay = ({ cropData }) => (
    <div className="bg-gray-100 p-4 rounded-md">
        <h4 className="text-sm font-semibold mb-2">Crop Coordinates:</h4>
        <pre className="text-xs">{JSON.stringify(cropData, null, 2)}</pre>
    </div>
);

export default CropDataDisplay