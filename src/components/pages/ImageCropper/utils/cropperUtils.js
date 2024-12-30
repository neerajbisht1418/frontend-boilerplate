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

export const calculateRepetitionDimensions = (cropData, targetDimension, fixedDimension = 'width', repetitionSettings) => {
  console.log('Calculating repetition dimensions:', {
    cropData,
    targetDimension,
    fixedDimension,
    repetitionSettings
  });

  const { width: cropWidth, height: cropHeight } = cropData;
  if (!cropWidth || !cropHeight) {
    console.error('Invalid crop data, missing width or height.');
    return null;
  }

  // Parse aspect ratio from string (e.g., "2:4" -> { x: 2, y: 4 })
  const [aspectRatioWidth, aspectRatioHeight] = repetitionSettings.aspectRatio.split(':').map(Number);
  if (!aspectRatioWidth || !aspectRatioHeight) {
    console.error('Invalid aspect ratio:', repetitionSettings.aspectRatio);
    return null;
  }

  // Calculate the aspect ratio and fix it to 1 decimal place
  let aspectRatio = aspectRatioWidth / aspectRatioHeight;
  aspectRatio = aspectRatio.toFixed(1);  // Fixed to 1 decimal place

  console.log('Parsed and fixed aspect ratio:', aspectRatio);

  let finalWidth, finalHeight;

  if (fixedDimension === 'width') {
    // Fixed width, calculate height based on aspect ratio
    finalWidth = targetDimension;
    finalHeight = finalWidth / aspectRatio; // Maintain aspect ratio
    console.log('Fixed width calculation:', { finalWidth, finalHeight });
  } else if (fixedDimension === 'height') {
    // Fixed height, calculate width based on aspect ratio
    finalHeight = targetDimension;
    finalWidth = finalHeight * aspectRatio; // Maintain aspect ratio
    console.log('Fixed height calculation:', { finalWidth, finalHeight });
  } else {
    console.error('Invalid fixed dimension provided.');
    return null;
  }

  // Ensure height is calculated and not null
  if (!finalHeight) {
    console.error('Calculated height is invalid or null.');
    return null;
  }

  // Calculate repetitions based on final dimensions
  const horizontalRepetitions = Math.ceil(finalWidth / cropWidth);
  const verticalRepetitions = Math.ceil(finalHeight / cropHeight);

  console.log('Repetition calculations:', { horizontalRepetitions, verticalRepetitions });

  const finalDimensions = {
    width: finalWidth,
    height: finalHeight,
    horizontalRepetitions,
    verticalRepetitions
  };

  console.log('Calculated final dimensions:', finalDimensions);
  return finalDimensions;
};

export const createRepeatedImage = async (croppedCanvas, dimensions) => {
  console.log("Creating repeated image with dimensions:", dimensions);

  const finalCanvas = document.createElement("canvas");
  const ctx = finalCanvas.getContext("2d");

  // Set final canvas size
  finalCanvas.width = dimensions.width;
  finalCanvas.height = dimensions.height;

  // Fill with white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  const pattern = ctx.createPattern(croppedCanvas, "repeat");
  ctx.fillStyle = pattern;

  // Calculate the number of repetitions for horizontal and vertical
  const horizontalRepetitions = Math.ceil(dimensions.width / croppedCanvas.width);
  const verticalRepetitions = Math.ceil(dimensions.height / croppedCanvas.height);

  // Repeat horizontally and vertically
  for (let i = 0; i < horizontalRepetitions; i++) {
    for (let j = 0; j < verticalRepetitions; j++) {
      ctx.drawImage(
        croppedCanvas,
        i * croppedCanvas.width,
        j * croppedCanvas.height,
        croppedCanvas.width,
        croppedCanvas.height
      );
    }
  }

  console.log("Repeated image created");
  return finalCanvas;
};
