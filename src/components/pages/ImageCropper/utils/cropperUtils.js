import { toast } from 'react-toastify';

export const createImageDownloadLink = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  return { link, url };
};

export const calculateCropperBoundaries = (data, image) => {
  // Calculate the boundaries of the crop area
  const boundaries = {
    left: Math.round(data.x),
    right: Math.round(data.x + data.width),
    top: Math.round(data.y),
    bottom: Math.round(data.y + data.height),
    width: Math.round(data.width),
    height: Math.round(data.height),
    naturalWidth: Math.round(image.naturalWidth),
    naturalHeight: Math.round(image.naturalHeight),
  };

  // Check if any boundary exceeds the image canvas
  const isOutOfBounds = {
    left: boundaries.left < 0,
    right: boundaries.right > boundaries.naturalWidth,
    top: boundaries.top < 0,
    bottom: boundaries.bottom > boundaries.naturalHeight,
  };

  // Adjust boundaries if necessary
  if (isOutOfBounds.left) {
    boundaries.left = 0;
    boundaries.width = Math.min(boundaries.width, boundaries.naturalWidth);
  }
  if (isOutOfBounds.right) {
    boundaries.width = boundaries.naturalWidth - data.x;
    boundaries.right = boundaries.naturalWidth;
  }
  if (isOutOfBounds.top) {
    boundaries.top = 0;
    boundaries.height = Math.min(boundaries.height, boundaries.naturalHeight);
  }
  if (isOutOfBounds.bottom) {
    boundaries.height = boundaries.naturalHeight - data.y;
    boundaries.bottom = boundaries.naturalHeight;
  }

  return {
    boundaries,
    isOutOfBounds,
  };
};

export const roundCropData = (data, image) => {
  const { boundaries, isOutOfBounds } = calculateCropperBoundaries(data, image);
  return { ...boundaries, isOutOfBounds };
};

export const validateCropBounds = (cropperRef) => {
  if (!cropperRef.current?.cropper) return false;

  const image = cropperRef.current.cropper.getImageData();
  const data = cropperRef.current.cropper.getData();

  const isOutOfBounds = {
    left: data.x < 0,
    top: data.y < 0,
    right: data.x + data.width > image.naturalWidth,
    bottom: data.y + data.height > image.naturalHeight,
  };

  if (isOutOfBounds.left || isOutOfBounds.top || isOutOfBounds.right || isOutOfBounds.bottom) {
    if (isOutOfBounds.left || isOutOfBounds.top) {
      toast.error('Cropper is out of bounds at the top or left edge!');
    }
    if (isOutOfBounds.right || isOutOfBounds.bottom) {
      toast.error('Cropper is out of bounds at the right or bottom edge!');
    }
    return false;
  }

  return true;
};

export const validateRepetitionSettings = (settings) => {
  console.log('Validating repetition settings:', settings);

  if (!settings.repetitionEnabled) {
    console.log('Repetition not enabled, skipping validation');
    return true;
  }

  const { aspectRatio, targetDimension } = settings;

  if (!aspectRatio || !targetDimension) {
    console.error('Missing required repetition settings', {
      aspectRatio: !!aspectRatio,
      targetDimension: !!targetDimension
    });
    return false;
  }

  const parsedTarget = parseInt(targetDimension, 10);
  if (isNaN(parsedTarget) || parsedTarget <= 0) {
    console.error('Invalid target dimension:', targetDimension);
    return false;
  }

  console.log('Repetition settings valid');
  return true;
};

export const parseCustomRatio = (value) => {
  const parts = value.split(':');
  if (parts.length === 2) {
    const [width, height] = parts.map(Number);
    if (!isNaN(width) && !isNaN(height) && height !== 0) {
      return width / height;
    }
  }
  return null;
};

export const calculateRepetitionDimensions = (cropData, targetDimension, fixedDimension = 'width') => {
  console.log('Input:', { cropData, targetDimension, fixedDimension });

  const originalWidth = Math.round(cropData.width);
  const originalHeight = Math.round(cropData.height);
  const aspectRatio = originalWidth / originalHeight;
  
  console.log('Original dimensions:', {
    width: originalWidth,
    height: originalHeight,
    aspectRatio
  });

  let finalWidth, finalHeight;
  const parsedTarget = parseInt(targetDimension, 10);

  if (fixedDimension === 'width') {
    finalWidth = parsedTarget;
    finalHeight = Math.round(finalWidth / aspectRatio);
  } else {
    finalHeight = parsedTarget;
    finalWidth = Math.round(finalHeight * aspectRatio);
  }

  // Calculate how many complete repetitions are needed
  const horizontalCount = Math.ceil(finalWidth / originalWidth);
  const verticalCount = Math.ceil(finalHeight / originalHeight);

  console.log('Calculated repetitions:', {
    horizontalCount,
    verticalCount,
    finalWidth,
    finalHeight
  });

  return {
    width: finalWidth,
    height: finalHeight,
    originalWidth,
    originalHeight,
    horizontalCount,
    verticalCount
  };
};

export const createRepeatedImage = async (croppedCanvas, dimensions) => {
  console.log('Creating repeated image with dimensions:', dimensions);

  const finalCanvas = document.createElement('canvas');
  const ctx = finalCanvas.getContext('2d');

  // Set the canvas size to the calculated dimensions
  finalCanvas.width = dimensions.width;
  finalCanvas.height = dimensions.height;

  // Create a pattern from the original cropped canvas
  const pattern = ctx.createPattern(croppedCanvas, 'repeat');
  if (!pattern) {
    console.error('Failed to create pattern');
    return croppedCanvas;
  }

  // Fill the entire canvas with the pattern
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  return finalCanvas;
};