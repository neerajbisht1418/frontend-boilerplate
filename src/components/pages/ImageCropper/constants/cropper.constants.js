export const ASPECT_RATIOS = {
    LANDSCAPE: 16 / 9,
    PORTRAIT: 9 / 16,
    SQUARE: 1,
    CUSTOM: null,
  };
  
  export const IMAGE_FORMATS = {
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    WEBP: 'image/webp'
  };
  
  export const DEFAULT_OPTIONS = {
    aspectRatio: ASPECT_RATIOS.LANDSCAPE,
    guides: true,
    background: false,
    responsive: true,
    checkOrientation: false,
    initialAspectRatio: 1,
  };
  