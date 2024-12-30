import React, { useState, useEffect } from 'react';

const RepetitionBothDirectionsControls = ({ onChange }) => {
    const [repeatBothDirections, setRepeatBothDirections] = useState(false);
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [errors, setErrors] = useState({ width: '', height: '' });

    const validateInputs = () => {
        const newErrors = { width: '', height: '' };

        // Validate width (must be a number and greater than 0)
        if (!width || isNaN(width) || width <= 0) {
            newErrors.width = 'Width must be a positive number';
        }

        // Validate height (must be a number and greater than 0)
        if (!height || isNaN(height) || height <= 0) {
            newErrors.height = 'Height must be a positive number';
        }

        setErrors(newErrors);
        return !newErrors.width && !newErrors.height;
    };

    const handleRepeatBothDirectionsChange = () => {
        setRepeatBothDirections(!repeatBothDirections);
        // Reset width and height when toggling the checkbox
        if (!repeatBothDirections) {
            setWidth('');
            setHeight('');
            setErrors({ width: '', height: '' });
        }
        onChange({ repeatBothDirections: !repeatBothDirections, width: '', height: '' });
    };

    const handleWidthChange = (e) => {
        const value = e.target.value;
        setWidth(value);
        if (errors.width) validateInputs(); // Revalidate after change
    };

    const handleHeightChange = (e) => {
        const value = e.target.value;
        setHeight(value);
        if (errors.height) validateInputs(); // Revalidate after change
    };

    const handleSubmit = () => {
        if (validateInputs()) {
            onChange({ repeatBothDirections, width, height });
        }
    };

    return (
        <div className="space-y-4">
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={repeatBothDirections}
                    onChange={handleRepeatBothDirectionsChange}
                    className="form-checkbox"
                />
                <span>Enable Repetition in Both Directions</span>
            </label>

            {repeatBothDirections && (
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium">Width (px)</label>
                        <input
                            type="number"
                            value={width}
                            onChange={handleWidthChange}
                            className="block w-full mt-1 border rounded-md shadow-sm"
                        />
                        {errors.width && <p className="text-red-500 text-xs">{errors.width}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Height (px)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={handleHeightChange}
                            className="block w-full mt-1 border rounded-md shadow-sm"
                        />
                        {errors.height && <p className="text-red-500 text-xs">{errors.height}</p>}
                    </div>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Apply Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepetitionBothDirectionsControls;
