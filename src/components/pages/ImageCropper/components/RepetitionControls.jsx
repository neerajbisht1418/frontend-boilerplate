// src/features/image-cropper/components/RepetitionControls.jsx
import React, { useState } from 'react';

const commonAspectRatios = [
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
];

const RepetitionControls = ({ onChange }) => {
  const [repetitionEnabled, setRepetitionEnabled] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('');
  const [customRatio, setCustomRatio] = useState('');
  const [fixedDimension, setFixedDimension] = useState('width');
  const [targetDimension, setTargetDimension] = useState('');

  const handleRepetitionChange = () => {
    setRepetitionEnabled(!repetitionEnabled);
    onChange({ repetitionEnabled: !repetitionEnabled });
  };

  const handleAspectRatioChange = (value) => {
    setAspectRatio(value);
    if (value !== 'custom') {
      onChange({ aspectRatio: value });
    }
  };

  const handleCustomRatioChange = (e) => {
    const value = e.target.value;
    setCustomRatio(value);
    onChange({ aspectRatio: value });
  };

  const handleDimensionChange = (e) => {
    const value = e.target.value;
    setTargetDimension(value);
    onChange({ targetDimension: value });
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={repetitionEnabled}
          onChange={handleRepetitionChange}
          className="form-checkbox"
        />
        <span>Enable Repetition</span>
      </label>

      {repetitionEnabled && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => handleAspectRatioChange(e.target.value)}
              className="block w-full mt-1 border rounded-md shadow-sm"
            >
              <option value="">Select Aspect Ratio</option>
              {commonAspectRatios.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
            {aspectRatio === 'custom' && (
              <input
                type="text"
                placeholder="Enter custom ratio (e.g., 4:3)"
                value={customRatio}
                onChange={handleCustomRatioChange}
                className="block w-full mt-2 border rounded-md shadow-sm"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Fix Dimension</label>
            <select
              value={fixedDimension}
              onChange={(e) => setFixedDimension(e.target.value)}
              className="block w-full mt-1 border rounded-md shadow-sm"
            >
              <option value="width">Width</option>
              <option value="height">Height</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Target {fixedDimension === 'width' ? 'Width' : 'Height'} (px)
            </label>
            <input
              type="number"
              value={targetDimension}
              onChange={handleDimensionChange}
              className="block w-full mt-1 border rounded-md shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RepetitionControls;
