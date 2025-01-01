import { useState } from 'react';
import { getContentBounds } from '../utils/canvasUtils';

/**
 * Hook for handling canvas operations such as drawing, cropping, and downloading images.
 * Includes detailed logging and fallback behavior.
 */
export const useCanvasOperations = ({
    canvasRef,          // Reference to the canvas element
    loadedImages,       // Object containing `mask` and `fabric` images
    fabricPosition,     // Object with x, y coordinates for fabric position
    fabricScale,        // Scaling factor for the fabric
    fabricRotation,     // Rotation angle for the fabric (in degrees)
    imageDimensions,
    setCroppedMaskImage   // Dimensions of the image (width, height)
}) => {
    const [croppedImage, setCroppedImage] = useState(null); // Holds the cropped image URL

    /**
     * Draws the content onto the canvas, applying fabric transformations and mask effects.
     */
    const drawCanvas = () => {
        console.log('Starting to draw the canvas.');

        if (!canvasRef.current) {
            console.error('Canvas reference is null.');
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!loadedImages.mask) {
            console.error('Mask image is not loaded. Cannot proceed.');
            return;
        }

        if (!loadedImages.fabric) {
            console.warn('Fabric image is not loaded. Displaying only the mask.');
            ctx.drawImage(loadedImages.mask, 0, 0, canvas.width, canvas.height);
            console.log('Displayed only the mask image.');
            return;
        }

        // Draw fabric
        console.log('Drawing fabric with transformations.');
        ctx.save();
        ctx.translate(fabricPosition.x + canvas.width / 2, fabricPosition.y + canvas.height / 2);
        ctx.rotate((fabricRotation * Math.PI) / 180);
        ctx.scale(fabricScale, fabricScale);
        ctx.drawImage(
            loadedImages.fabric,
            -loadedImages.fabric.width / 2,
            -loadedImages.fabric.height / 2
        );
        ctx.restore();

        // Apply mask and effects
        console.log('Applying mask and effects.');
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        ctx.drawImage(loadedImages.mask, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.drawImage(loadedImages.mask, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        console.log('Canvas drawing completed.');
    };

    /**
     * Crops the canvas content based on the calculated bounds.
     * The cropped image is stored in state for display or debugging.
     */
    const handleCrop = () => {
        console.log('Starting cropping process.');

        if (!canvasRef.current) {
            console.error('Canvas reference is null. Cannot crop image.');
            return;
        }

        if (!loadedImages.mask || !loadedImages.fabric) {
            console.warn('Missing required images (mask or fabric). Cannot crop.');
            return;
        }

        // Create a temporary canvas for cropping
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = imageDimensions.width;
        cropCanvas.height = imageDimensions.height;
        const cropCtx = cropCanvas.getContext('2d');

        // Draw fabric with transformations on the crop canvas
        console.log('Drawing fabric with transformations on the crop canvas.');
        cropCtx.save();
        cropCtx.translate(fabricPosition.x + cropCanvas.width / 2, fabricPosition.y + cropCanvas.height / 2);
        cropCtx.rotate((fabricRotation * Math.PI) / 180);
        cropCtx.scale(fabricScale, fabricScale);
        cropCtx.drawImage(
            loadedImages.fabric,
            -loadedImages.fabric.width / 2,
            -loadedImages.fabric.height / 2
        );
        cropCtx.restore();

        // Apply the mask on the crop canvas
        console.log('Applying the mask on the crop canvas.');
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = imageDimensions.width;
        maskCanvas.height = imageDimensions.height;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.drawImage(loadedImages.mask, 0, 0);
        cropCtx.drawImage(maskCanvas, 0, 0);

        // Get content bounds for cropping
        console.log('Calculating bounds for cropping.');
        const imageData = cropCtx.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
        const bounds = getContentBounds(imageData);
        console.log('Content bounds:', bounds);

        // Create the final cropped canvas
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = bounds.width;
        finalCanvas.height = bounds.height;
        const finalCtx = finalCanvas.getContext('2d');

        finalCtx.drawImage(
            cropCanvas,
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height,
            0,
            0,
            bounds.width,
            bounds.height
        );

        // Generate the cropped image URL and save it in state
        const croppedDataUrl = finalCanvas.toDataURL('image/png', 1.0);
        setCroppedMaskImage(prev => [...prev, croppedDataUrl])
        setCroppedImage(croppedDataUrl);
        console.log('Cropping completed. Cropped image URL:', croppedDataUrl);
    };

    /**
     * Downloads the current canvas or cropped image as a PNG file.
     */
    const handleDownload = () => {
        console.log('Downloading image.');

        const dataUrl = croppedImage || canvasRef.current?.toDataURL('image/png', 1.0);

        if (!dataUrl) {
            console.error('No image data available for download.');
            return;
        }

        const link = document.createElement('a');
        link.download = croppedImage ? 'cropped-fabric.png' : 'fabric-output.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Image downloaded successfully.');
    };

    return {
        croppedImage,    // The cropped image URL
        handleCrop,      // Function to crop the image
        handleDownload,  // Function to download the canvas or cropped image
        drawCanvas,      // Function to draw fabric and mask on the canvas
    };
};
