export const calculateDimensions = (originalWidth, originalHeight, targetRatio) => {
    if (!targetRatio) return { width: originalWidth, height: originalHeight };

    const currentRatio = originalWidth / originalHeight;

    if (currentRatio > targetRatio) {
        return {
            width: originalHeight * targetRatio,
            height: originalHeight
        };
    }

    return {
        width: originalWidth,
        height: originalWidth / targetRatio
    };
};

export const duplicateImage = (cropData, repetitions, direction = 'horizontal') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const { width, height } = cropData;

    canvas.width = direction === 'horizontal' ? width * repetitions : width;
    canvas.height = direction === 'vertical' ? height * repetitions : height;

    for (let i = 0; i < repetitions; i++) {
        const x = direction === 'horizontal' ? width * i : 0;
        const y = direction === 'vertical' ? height * i : 0;
        ctx.drawImage(cropData, x, y);
    }

    return canvas;
};