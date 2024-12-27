import { IMAGE_FORMATS } from "../constants/cropper.constants";
import { generateFileName } from "../utils/file.utils";

export class CropperService {
    static async cropImage(cropper, options = {}) {
      try {
        const canvas = cropper.getCroppedCanvas(options);
        return {
          canvas,
          dataUrl: canvas.toDataURL(options.format || IMAGE_FORMATS.PNG, options.quality || 1)
        };
      } catch (error) {
        console.error('Error cropping image:', error);
        throw new Error('Failed to crop image');
      }
    }
  
    static async downloadImage(canvas, options = {}) {
      return new Promise((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = options.fileName || generateFileName();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            resolve();
          }, options.format || IMAGE_FORMATS.PNG, options.quality || 1);
        } catch (error) {
          reject(error);
        }
      });
    }
  
    static async createRepeatedPattern(cropper, repetitions, direction, options = {}) {
      const { canvas } = await this.cropImage(cropper, options);
      return duplicateImage(canvas, repetitions, direction);
    }
  }