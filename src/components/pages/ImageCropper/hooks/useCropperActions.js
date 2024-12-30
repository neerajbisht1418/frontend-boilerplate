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

    const handleCrop = async (repetitionSettings, repetitionBothDirectionsSettings) => {
        console.log("Starting crop operation with settings:", repetitionSettings);

        if (!validateCropBounds(cropperRef)) {
            console.error("Invalid crop bounds");
            return;
        }

        if (!cropperRef.current?.cropper) {
            console.error("Cropper not initialized");
            toast.error("Cropper not initialized.");
            return;
        }
        startLoading("crop");
        try {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            let finalImage;

            if (repetitionBothDirectionsSettings?.repeatBothDirections) {
                console.log("repetitionBothDirectionsSettings", repetitionBothDirectionsSettings)
                let dimensions = {
                    width: repetitionBothDirectionsSettings?.width,
                    height: repetitionBothDirectionsSettings?.height,
                }
                console.log("Repetition Both enabled, processing...");
                const repeatedCanvas = await createRepeatedImage(croppedCanvas, dimensions);
                finalImage = repeatedCanvas.toDataURL("image/png");
                console.log("Repeated image created successfully");

            } else if (repetitionSettings.repetitionEnabled) {
                console.log("Repetition enabled, processing...");
                const cropData = cropperRef.current.cropper.getData();
                const dimensions = calculateRepetitionDimensions(
                    cropData,
                    parseInt(repetitionSettings.targetDimension, 10),
                    repetitionSettings.fixedDimension,
                    repetitionSettings
                );

                const repeatedCanvas = await createRepeatedImage(croppedCanvas, dimensions);
                finalImage = repeatedCanvas.toDataURL("image/png");
                console.log("Repeated image created successfully");
            } else {
                finalImage = croppedCanvas.toDataURL("image/png");
                console.log("Single crop created successfully");
            }

            setCroppedImages((prev) => [...prev, finalImage]);
            toast.success("Crop operation completed!");
        } catch (error) {
            console.error("Crop operation failed:", error);
            handleError("CROP_OPERATION_FAILED", error);
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