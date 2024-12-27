import React from 'react';
import { useImageUpload } from './hooks/useImageUpload';
import { useCropperActions } from './hooks/useCropperActions';
import { useErrorHandler } from './hooks/useErrorHandler';
import { useLoadingState } from './hooks/useLoadingState';
import CropControls from './components/CropControls';
import CropDataDisplay from './components/CropDataDisplay';
import CroppedImagesGallery from './components/CroppedImagesGallery';
import ImageCropperCanvas from './components/ImageCropperCanvas';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const ImageCropper = () => {
    const { error, handleError } = useErrorHandler();
    const { loading, startLoading, stopLoading } = useLoadingState();
    const { image, handleFileChange } = useImageUpload(handleError, startLoading, stopLoading);
    const {
        cropperRef,
        cropData,
        croppedImages,
        handleCropChange,
        handleCrop,
        handleDownload,
        handleRestore,
    } = useCropperActions(handleError, startLoading, stopLoading);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <ErrorDisplay error={error} />
            <LoadingSpinner loading={loading} />

            <div className="space-y-4">
                <CropControls
                    onFileChange={handleFileChange}
                    onCrop={handleCrop}
                    onDownload={handleDownload}
                    onRestore={handleRestore}
                />

                {cropData && <CropDataDisplay cropData={cropData} />}

                {image && (
                    <ImageCropperCanvas
                        image={image}
                        cropperRef={cropperRef}
                        onReady={() => console.log('Cropper component initialized')}
                        onChange={handleCropChange}
                    />
                )}

                {croppedImages.length > 0 && (
                    <CroppedImagesGallery images={croppedImages} />
                )}
            </div>
        </div>
    );
};

export default ImageCropper;