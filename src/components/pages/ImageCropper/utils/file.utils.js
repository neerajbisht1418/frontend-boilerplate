// src/utils/file.utils.js
export const validateImageFile = (file) => {
    if (!file) return { isValid: false, error: 'No file selected' };
    if (!file.type.match(/^image\//)) {
      return { isValid: false, error: 'Invalid file type' };
    }
    return { isValid: true, error: null };
  };
  
  export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  export const generateFileName = (prefix = 'cropped', extension = 'png') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-${timestamp}.${extension}`;
  };