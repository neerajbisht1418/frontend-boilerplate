export const ERROR_CODES = {
    FILE_LOAD: 'ERROR_FILE_LOAD',
    INVALID_FILE: 'ERROR_INVALID_FILE',
    CROP_OPERATION: 'ERROR_CROP_OPERATION',
    DOWNLOAD_FAILED: 'ERROR_DOWNLOAD_FAILED',
  };
  
  export const ERROR_MESSAGES = {
    [ERROR_CODES.FILE_LOAD]: 'Failed to load the image file',
    [ERROR_CODES.INVALID_FILE]: 'Please select a valid image file',
    [ERROR_CODES.CROP_OPERATION]: 'Failed to crop the image',
    [ERROR_CODES.DOWNLOAD_FAILED]: 'Failed to download the cropped image',
  };