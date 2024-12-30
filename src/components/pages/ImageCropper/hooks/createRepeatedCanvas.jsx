export const createRepeatedCanvas = (croppedCanvas, repetitionSettings) => {
    const { rows, columns, spacing, targetWidth } = repetitionSettings;

    const aspectRatio = croppedCanvas.width / croppedCanvas.height;
    const targetHeight = targetWidth / aspectRatio;

    const canvasWidth = columns * targetWidth + (columns - 1) * spacing;
    const canvasHeight = rows * targetHeight + (rows - 1) * spacing;

    console.log('Creating repeated canvas with settings:', {
        rows,
        columns,
        spacing,
        targetWidth,
        targetHeight,
        canvasWidth,
        canvasHeight,
    });

    const repeatedCanvas = document.createElement('canvas');
    repeatedCanvas.width = canvasWidth;
    repeatedCanvas.height = canvasHeight;

    const ctx = repeatedCanvas.getContext('2d');
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const x = col * (targetWidth + spacing);
            const y = row * (targetHeight + spacing);
            ctx.drawImage(croppedCanvas, x, y, targetWidth, targetHeight);
        }
    }

    console.log('Repetition canvas created successfully');
    return repeatedCanvas;
};
