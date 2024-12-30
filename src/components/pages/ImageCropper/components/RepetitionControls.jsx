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
  const [repeatBothDirections, setRepeatBothDirections] = useState(false); // New state for repeating in both directions

  const updateSettings = (updates) => {
    const newSettings = {
      repetitionEnabled,
      aspectRatio: aspectRatio === 'custom' ? customRatio : aspectRatio,
      fixedDimension,
      targetDimension,
      repeatBothDirections, // Add repeatBothDirections to settings
      ...updates
    };
    console.log('Updating repetition settings:', newSettings);
    onChange(newSettings);
  };

  const handleRepetitionChange = () => {
    const newEnabled = !repetitionEnabled;
    setRepetitionEnabled(newEnabled);
    updateSettings({ repetitionEnabled: newEnabled });
  };

  const handleAspectRatioChange = (value) => {
    setAspectRatio(value);
    if (value !== 'custom') {
      updateSettings({ aspectRatio: value });
    }
  };

  const handleCustomRatioChange = (e) => {
    const value = e.target.value;
    setCustomRatio(value);
    updateSettings({ aspectRatio: value });
  };

  const handleFixedDimensionChange = (e) => {
    const value = e.target.value;
    setFixedDimension(value);
    updateSettings({ fixedDimension: value });
  };

  const handleDimensionChange = (e) => {
    const value = e.target.value;
    setTargetDimension(value);
    updateSettings({ targetDimension: value });
  };

  const handleRepeatBothDirectionsChange = () => {
    const newValue = !repeatBothDirections;
    setRepeatBothDirections(newValue);
    updateSettings({ repeatBothDirections: newValue });
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
              onChange={handleFixedDimensionChange}
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

          {/* Checkbox for repeating in both horizontal and vertical directions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={repeatBothDirections}
              onChange={handleRepeatBothDirectionsChange}
              className="form-checkbox"
            />
            <span>Repeat in Both Horizontal and Vertical Directions</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepetitionControls;
