import { useState, useEffect } from 'react';

export const useImageLoader = ({ maskImage, selectedCroppedImage, canvasRef }) => {
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [loadedImages, setLoadedImages] = useState({ mask: null, fabric: null });

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const loadImage = async (src, imageType) => {
            if (!src) return;

            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = () => {
                if (imageType === 'mask') {
                    setImageDimensions({ width: img.width, height: img.height });
                    canvas.width = img.width;
                    canvas.height = img.height;
                }
                setLoadedImages(prev => ({ ...prev, [imageType]: img }));
            };

            img.onerror = (error) => {
                console.error(`Error loading ${imageType} image:`, error);
            };

            // For imported images (mask)
            if (imageType === 'mask') {
                const response = await fetch(src);
                const blob = await response.blob();
                img.src = URL.createObjectURL(blob);
            } else {
                // For data URLs (cropped images)
                img.src = src;
            }
        };

        loadImage(maskImage, 'mask');
        if (selectedCroppedImage) {
            loadImage(selectedCroppedImage, 'fabric');
        }
    }, [maskImage, selectedCroppedImage]);

    console.log("loadedImages", loadedImages)

    return { loadedImages, imageDimensions };
};