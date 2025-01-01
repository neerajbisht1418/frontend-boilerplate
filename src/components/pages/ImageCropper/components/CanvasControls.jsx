import React from 'react';

const CanvasControls = ({
    fabricScale,
    fabricRotation,
    setFabricScale,
    setFabricRotation,
    handleCrop,
    handleDownload,
}) => {
    return (
        <div className="w-full max-w-md space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Scale: {fabricScale.toFixed(2)}x
                </label>
                <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={fabricScale}
                    onChange={(e) => setFabricScale(parseFloat(e.target.value))}
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Rotation: {fabricRotation}°
                </label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={fabricRotation}
                    onChange={(e) => setFabricRotation(parseInt(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleCrop}
                    className="flex-1"
                >
                    Crop Fabric
                </button>
                <button
                    onClick={handleDownload}
                    className="flex-1"
                >
                    Download
                </button>
            </div>
        </div>
    );
};

export default CanvasControls;