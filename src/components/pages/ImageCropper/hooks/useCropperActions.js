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

    const handleCrop = async (repetitionSettings, repetitionBothDirectionsSettings, fixedWidthSettings) => {
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

            if (fixedWidthSettings?.fixedWidthEnabled) {
                console.log("fixedWidthSettings", fixedWidthSettings)
                let dimensions = {
                    width: fixedWidthSettings?.width,
                    height: fixedWidthSettings?.calculatedHeight,
                }
                console.log("Repetition Both enabled, processing...");
                const repeatedCanvas = await createRepeatedImage(croppedCanvas, dimensions);
                finalImage = repeatedCanvas.toDataURL("image/png");
                console.log("Repeated image created successfully");

            } else if (repetitionBothDirectionsSettings?.repeatBothDirections) {
                console.log("repetitionBothDirectionsSettings", repetitionBothDirectionsSettings);

                let croppedWidth = croppedCanvas.width;
                let croppedHeight = croppedCanvas.height;

                // Target dimensions with 2:3 aspect ratio
                let dimensions = {
                    width: 1000,
                    height: 1500,
                };

                if (croppedWidth < dimensions.width || croppedHeight < dimensions.height) {
                    // Repeat the image if the cropped dimensions are smaller than the target dimensions
                    const repeatedCanvas = await createRepeatedImage(croppedCanvas, dimensions);
                    finalImage = repeatedCanvas.toDataURL("image/png");
                    console.log("Repeated image created successfully");
                } else {
                    // Maintain the 2:3 aspect ratio
                    const aspectWidth = 2;
                    const aspectHeight = 3;

                    let newWidth, newHeight;

                    // Calculate new dimensions based on the aspect ratio
                    if (croppedWidth / aspectWidth > croppedHeight / aspectHeight) {
                        // Base scaling on height
                        newHeight = croppedHeight;
                        newWidth = Math.ceil((newHeight * aspectWidth) / aspectHeight);
                    } else {
                        // Base scaling on width
                        newWidth = croppedWidth;
                        newHeight = Math.ceil((newWidth * aspectHeight) / aspectWidth);
                    }

                    // Ensure the new dimensions are larger than the target dimensions
                    newWidth = Math.max(newWidth, dimensions.width);
                    newHeight = Math.max(newHeight, dimensions.height);

                    const repeatedCanvas = await createRepeatedImage(croppedCanvas, {width : newWidth, height : newHeight});
                    finalImage = repeatedCanvas.toDataURL("image/png");
                    console.log("Image adjusted to maintain 2:3 aspect ratio successfully");
                }
            }
            else if (repetitionSettings.repetitionEnabled) {
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