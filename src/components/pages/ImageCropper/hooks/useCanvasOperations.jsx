import { useState } from 'react';
import { getContentBounds } from '../utils/canvasUtils';

export const useCanvasOperations = ({
    canvasRef,
    loadedImages,
    fabricPosition,
    fabricScale,
    fabricRotation,
    imageDimensions
}) => {
    const [croppedImage, setCroppedImage] = useState(null);

    const drawCanvas = () => {
        if (!canvasRef.current || !loadedImages.mask || !loadedImages.fabric) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw fabric
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
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        ctx.drawImage(loadedImages.mask, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.drawImage(loadedImages.mask, 0, 0);
        ctx.restore();
    };

    const handleCrop = () => {
        if (!canvasRef.current || !loadedImages.mask || !loadedImages.fabric) return;

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = imageDimensions.width;
        cropCanvas.height = imageDimensions.height;
        const cropCtx = cropCanvas.getContext('2d');

        // Draw fabric with transformations
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

        // Apply mask
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = imageDimensions.width;
        maskCanvas.height = imageDimensions.height;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.drawImage(loadedImages.mask, 0, 0);
        cropCtx.drawImage(maskCanvas, 0, 0);

        // Get bounds and create final cropped image
        const imageData = cropCtx.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
        const bounds = getContentBounds(imageData);

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = bounds.width;
        finalCanvas.height = bounds.height;
        const finalCtx = finalCanvas.getContext('2d');

        finalCtx.drawImage(cropCanvas,
            bounds.left, bounds.top, bounds.width, bounds.height,
            0, 0, bounds.width, bounds.height
        );

        const croppedDataUrl = finalCanvas.toDataURL('image/png', 1.0);
        setCroppedImage(croppedDataUrl);
    };

    const handleDownload = () => {
        if (!croppedImage) return;
        const link = document.createElement('a');
        link.download = 'cropped-fabric.png';
        link.href = croppedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        croppedImage,
        handleCrop,
        handleDownload,
        drawCanvas
    };
};