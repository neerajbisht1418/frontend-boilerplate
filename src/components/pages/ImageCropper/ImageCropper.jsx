import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useCropper } from './hooks/useCropper';
import { DEFAULT_OPTIONS } from './constants/cropper.constants';
import { CropperService } from './services/cropper.service';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageCropper = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const fileInputRef = useRef(null);

    const {
        image,
        cropData,
        error,
        cropperRef,
        croppedImages,
        handleImageLoad,
        handleCrop,
        handleRestore,
        handleRepeat
    } = useCropper(DEFAULT_OPTIONS);

    useEffect(() => {
        if (fileInputRef.current && image) {
            fileInputRef.current.value = '';
        }
    }, [image]);

    const optimizeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                let { width, height } = img;
                setImageSize({ width, height });

                const MAX_DIMENSION = 2048;
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    if (width > height) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    } else {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to optimize image'));
                        }
                    },
                    'image/webp',
                    0.95
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);

            if (!ACCEPTED_TYPES.includes(file.type)) {
                throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)');
            }

            if (file.size > MAX_FILE_SIZE) {
                throw new Error('File size should be less than 100MB');
            }

            const optimizedBlob = await optimizeImage(file);
            await handleImageLoad(optimizedBlob);
        } catch (err) {
            console.error('Error processing image:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setIsCropping(true);
            const { canvas } = await handleCrop();
            await CropperService.downloadImage(canvas);
        } catch (err) {
            console.error('Error downloading image:', err);
        } finally {
            setIsCropping(false);
        }
    };

    const handleCreatePattern = async () => {
        try {
            setIsCropping(true);
            const canvas = await handleRepeat(3, 'horizontal');
            await CropperService.downloadImage(canvas, {
                fileName: 'pattern.png'
            });
        } catch (err) {
            console.error('Error creating pattern:', err);
        } finally {
            setIsCropping(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="space-y-4">
                <div className="flex gap-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        onClick={() => handleCrop()}
                        disabled={!image || isLoading || isCropping}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isCropping ? 'Cropping...' : 'Crop'}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!image || isLoading || isCropping}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                        {isCropping ? 'Processing...' : 'Download'}
                    </button>
                    <button
                        onClick={handleCreatePattern}
                        disabled={!image || isLoading || isCropping}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
                    >
                        {isCropping ? 'Creating...' : 'Create Pattern'}
                    </button>
                    <button
                        onClick={handleRestore}
                        disabled={!image || isLoading}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                    >
                        Restore
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2">Loading image...</span>
                    </div>
                )}

                {imageSize.width > 0 && (
                    <div className="text-sm text-gray-500">
                        Original image size: {imageSize.width} x {imageSize.height}
                    </div>
                )}

                {cropData && (
                    <div className="bg-gray-100 p-4 rounded-md">
                        <h4 className="text-sm font-semibold mb-2">Crop Coordinates:</h4>
                        <pre className="text-xs">
                            {JSON.stringify(cropData, null, 2)}
                        </pre>
                    </div>
                )}

                {image && !isLoading && (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <Cropper
                            ref={cropperRef}
                            src={image}
                            style={{ height: 600, width: '100%' }}
                            {...DEFAULT_OPTIONS}
                        />
                    </div>
                )}

                {croppedImages.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <h3 className="text-lg font-semibold">Cropped Images:</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {croppedImages.map((croppedImage, index) => (
                                <img
                                    key={index}
                                    src={croppedImage}
                                    alt={`Cropped image ${index + 1}`}
                                    className="max-w-full h-auto rounded-lg shadow-md"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCropper;
