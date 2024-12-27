import { useState, useCallback } from 'react';
import { ERROR_CODES } from '../constants/errors';

export const useImageUpload = (handleError, startLoading, stopLoading) => {
  const [image, setImage] = useState('');
  
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      console.warn('No file selected');
      return;
    }

    if (!file.type.match(/^image\//)) {
      console.warn('Invalid file type:', file.type);
      handleError(ERROR_CODES.INVALID_FILE);
      return;
    }

    startLoading('fileLoad');
    console.log('Loading file:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    try {
      const imageDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      console.log('File loaded successfully');
      setImage(imageDataUrl);
    } catch (error) {
      console.error('File load error:', error);
      handleError(ERROR_CODES.FILE_LOAD, error);
    } finally {
      stopLoading();
    }
  }, [handleError, startLoading, stopLoading]);

  return { image, setImage, handleFileChange };
};