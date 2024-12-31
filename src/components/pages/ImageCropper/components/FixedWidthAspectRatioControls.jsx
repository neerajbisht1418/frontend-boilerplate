import React from 'react';

const FixedWidthAspectRatioControls = ({ settings, onChange, cropData }) => {
  const {
    fixedWidthEnabled = false,
    width = cropData?.width || "",
    aspectRatio = '',
    calculatedHeight = ''
  } = settings;

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    const height = aspectRatio ? Math.round(newWidth / aspectRatio) : '';

    onChange({
      width: newWidth,
      calculatedHeight: height
    });
  };

  const handleAspectRatioChange = (e) => {
    const newAspectRatio = e.target.value;
    const height = width ? Math.round(width / newAspectRatio) : '';

    onChange({
      aspectRatio: newAspectRatio,
      calculatedHeight: height
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fixedWidthEnabled"
            checked={fixedWidthEnabled}
            onChange={(e) => onChange({ fixedWidthEnabled: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="fixedWidthEnabled" className="text-sm font-medium text-gray-700">
            Enable Fixed Width with Aspect Ratio
          </label>
        </div>

        {fixedWidthEnabled && (
          <div className="space-y-3">
            <div className="flex flex-col">
              <label htmlFor="width" className="text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={handleWidthChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter width"
                min="1"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="aspectRatio" className="text-sm font-medium text-gray-700 mb-1">
                Aspect Ratio (width/height)
              </label>
              <input
                type="number"
                id="aspectRatio"
                value={aspectRatio}
                onChange={handleAspectRatioChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., 1.5 for 3:2"
                step="0.01"
                min="0.01"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Calculated Height (px)
              </label>
              <input
                type="number"
                value={calculatedHeight}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedWidthAspectRatioControls;