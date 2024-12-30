import { useState, useCallback, useRef } from 'react';
import { roundCropData, createImageDownloadLink, validateCropBounds, calculateRepetitionDimensions, createRepeatedImage } from '../utils/cropperUtils';
import { ERROR_CODES } from '../constants/errors';
import { toast } from 'react-toastify';

export const useCropperActions = (handleError, startLoading, stopLoading) => {
    const [croppedImages, setCroppedImages] = useState([]);
    const [cropData, setCropData] = useState(null);
    const cropperRef = useRef(null);

    const handleCropChange = useCallback(() => {
        if (!cropperRef.current?.cropper) {
            console.warn('Cropper not initialized');
            return;
        }

        try {
            const data = cropperRef.current.cropper.getData();
            const image = cropperRef.current.cropper.getImageData();
            console.log("data", data)
            console.log("image", image)
            const roundedData = roundCropData(data, image);
            console.log('Crop area updated:', roundedData);
            setCropData(roundedData);
        } catch (error) {
            console.error('Error getting crop data:', error);
        }
    }, []);

    const handleCrop = async (repetitionSettings) => {
        console.log('Starting crop with settings:', repetitionSettings);

        if (!validateCropBounds(cropperRef)) {
            console.error('Invalid crop bounds');
            return;
        }

        if (!cropperRef.current?.cropper) {
            console.error('Cropper not initialized');
            toast.error('Cropper not initialized.');
            return;
        }

        startLoading('crop');
        try {
            const cropData = cropperRef.current.cropper.getData(true); // Get actual pixel values
            console.log('Original crop data:', cropData);

            // Get the cropped canvas
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });

            let finalImage;
            if (repetitionSettings.repetitionEnabled) {
                // Calculate dimensions for repetition
                const dimensions = calculateRepetitionDimensions(
                    cropData,
                    parseInt(repetitionSettings.targetDimension, 10),
                    repetitionSettings.fixedDimension || 'width'
                );

                // Create the repeated image
                const repeatedCanvas = await createRepeatedImage(croppedCanvas, dimensions);

                // Convert to data URL with high quality
                finalImage = repeatedCanvas.toDataURL('image/png', 1.0);

                console.log('Created repeated image with dimensions:', {
                    width: repeatedCanvas.width,
                    height: repeatedCanvas.height
                });
            } else {
                finalImage = croppedCanvas.toDataURL('image/png', 1.0);
                console.log('Created single crop');
            }

            setCroppedImages(prev => [...prev, finalImage]);
            toast.success('Crop successful!');
        } catch (error) {
            console.error('Crop failed:', error);
            handleError('CROP_OPERATION_FAILED', error);
        } finally {
            stopLoading();
        }
    };


    const handleDownload = useCallback(async () => {
        if (!cropperRef.current?.cropper) {
            console.warn('Cropper not initialized');
            return;
        }

        startLoading('download');
        console.log('Starting download preparation');

        try {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();

            const blob = await new Promise(resolve => {
                croppedCanvas.toBlob(resolve, 'image/png');
            });

            if (!blob) throw new Error('Failed to create blob');

            console.log('Blob created:', {
                size: `${(blob.size / 1024).toFixed(2)} KB`,
                type: blob.type
            });

            const { link, url } = createImageDownloadLink(blob, `cropped-image-${Date.now()}.png`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log('Download completed successfully');
        } catch (error) {
            console.error('Download failed:', error);
            handleError(ERROR_CODES.DOWNLOAD_FAILED, error);
        } finally {
            stopLoading();
        }
    }, [handleError, startLoading, stopLoading]);

    const handleRestore = useCallback(() => {
        console.log('Restoring cropper to initial state');

        if (cropperRef.current?.cropper) {
            cropperRef.current.cropper.reset();
            setCroppedImages([]);
            setCropData(null);
            console.log('Cropper reset complete');
        } else {
            console.warn('Cropper not initialized');
        }
    }, []);

    return {
        cropperRef,
        cropData,
        croppedImages,
        handleCropChange,
        handleCrop,
        handleDownload,
        handleRestore,
    };
};