import { useState, useCallback, useRef } from 'react';
import { roundCropData, createImageDownloadLink } from '../utils/cropperUtils';
import { ERROR_CODES } from '../constants/errors';

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
            const roundedData = roundCropData(data);
            console.log('Crop area updated:', roundedData);
            setCropData(roundedData);
        } catch (error) {
            console.error('Error getting crop data:', error);
        }
    }, []);

    const handleCrop = useCallback(async () => {
        if (!cropperRef.current?.cropper) {
            console.warn('Cropper not initialized');
            return;
        }

        startLoading('crop');
        console.log('Starting crop operation');

        try {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            const croppedImage = croppedCanvas.toDataURL("image/png");

            console.log('Crop successful', {
                width: croppedCanvas.width,
                height: croppedCanvas.height,
                dataSize: `${(croppedImage.length / 1024).toFixed(2)} KB`
            });

            setCroppedImages(prev => [...prev, croppedImage]);
        } catch (error) {
            console.error('Crop operation failed:', error);
            handleError(ERROR_CODES.CROP_OPERATION, error);
        } finally {
            stopLoading();
        }
    }, [handleError, startLoading, stopLoading]);

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