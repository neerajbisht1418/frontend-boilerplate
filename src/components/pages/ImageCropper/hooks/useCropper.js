import { useState, useCallback, useRef } from 'react';
import { validateImageFile, readFileAsDataURL } from '../utils/file.utils';
import { CropperService } from '../services/cropper.service';

export const useCropper = (initialOptions = {}) => {
    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState(null);
    const [error, setError] = useState(null);
    const [croppedImages, setCroppedImages] = useState([]);
    const cropperRef = useRef(null);

    const handleImageLoad = useCallback(async (file) => {
        try {
            const validation = validateImageFile(file);
            if (!validation.isValid) throw new Error(validation.error);

            const dataUrl = await readFileAsDataURL(file);
            setImage(dataUrl);
            setError(null);
            console.log('Image loaded successfully');
        } catch (err) {
            setError(err.message);
            console.error('Error loading image:', err);
        }
    }, []);

    const handleCrop = useCallback(async (options = {}) => {
        try {
            if (!cropperRef.current?.cropper) throw new Error('Cropper not initialized');

            const result = await CropperService.cropImage(cropperRef.current.cropper, options);
            setCropData(result);
            setCroppedImages(prev => [...prev, result.dataUrl]);
            console.log('Image cropped successfully');
            return result;
        } catch (err) {
            setError(err.message);
            console.error('Error cropping image:', err);
            throw err;
        }
    }, []);

    const handleRestore = useCallback(() => {
        console.log('Restoring cropper to initial state');
        try {
            if (cropperRef.current?.cropper) {
                cropperRef.current.cropper.reset();
                setCropData(null);
                setCroppedImages([]);
                setError(null);
                console.log('Cropper successfully restored');
            }
        } catch (err) {
            setError('Failed to restore cropper');
            console.error('Error restoring cropper:', err);
        }
    }, []);

    const handleRepeat = useCallback(async (repetitions, direction, options = {}) => {
        try {
            if (!cropperRef.current?.cropper) throw new Error('Cropper not initialized');

            return await CropperService.createRepeatedPattern(
                cropperRef.current.cropper,
                repetitions,
                direction,
                options
            );
        } catch (err) {
            setError(err.message);
            console.error('Error creating pattern:', err);
            throw err;
        }
    }, []);

    return {
        image,
        cropData,
        error,
        cropperRef,
        croppedImages,
        handleImageLoad,
        handleCrop,
        handleRestore,
        handleRepeat,
    };
};