export const createImageDownloadLink = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    return { link, url };
  };
  
  export const roundCropData = (cropData) => ({
    x: Math.round(cropData.x),
    y: Math.round(cropData.y),
    width: Math.round(cropData.width),
    height: Math.round(cropData.height),
  });