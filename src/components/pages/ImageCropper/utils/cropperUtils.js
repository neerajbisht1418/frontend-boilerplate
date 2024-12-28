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