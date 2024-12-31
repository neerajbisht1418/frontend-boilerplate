import React, { useEffect, useState } from 'react';
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
import RepetitionControls from './components/RepetitionControls';
import { validateRepetitionSettings } from './utils/cropperUtils';
import RepetitionBothDirectionsControls from './components/RepetitionBothDirectionsControls';
import FixedWidthAspectRatioControls from './components/FixedWidthAspectRatioControls';

const ImageCropper = () => {
    const [selectedCroppedImage, setSelectedCroppedImage] = useState(null)
    const [repetitionSettings, setRepetitionSettings] = useState({});
    const [repetitionBothDirectionsSettings, setRepetitionBothDirectionsSettings] = useState({
        repeatBothDirections: false,
        width: '',
        height: ''
    });
    const [fixedWidthSettings, setFixedWidthSettings] = useState({
        fixedWidthEnabled: false,
        width: '',
        aspectRatio: '',
        calculatedHeight: ''
    });
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

    const handleRepetitionSettingsChange = (newSettings) => {
        setRepetitionSettings((prevSettings) => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    const handleRepetitionBothSettingsChange = (newSettings) => {
        setRepetitionBothDirectionsSettings((prevSettings) => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    const enhancedHandleCrop = async () => {
        if (repetitionSettings.repetitionEnabled && !validateRepetitionSettings(repetitionSettings)) {
            return;
        }
        await handleCrop(repetitionSettings, repetitionBothDirectionsSettings, fixedWidthSettings);
    };

    const handleSelectedCroppedImage = (image) => {
        setSelectedCroppedImage(image)
    }

    const handleFixedWidthSettingsChange = (newSettings) => {
        setFixedWidthSettings(prevSettings => ({
            ...prevSettings,
            ...newSettings
        }));
    };

    useEffect(() => {
        setFixedWidthSettings({ ...fixedWidthSettings, width: cropData?.width })
    }, [cropData?.width])

    return (
        <div className="max-w-4xl mx-auto p-4">
            <ErrorDisplay error={error} />
            <LoadingSpinner loading={loading} />

            <div className="space-y-4">
                <CropControls
                    onFileChange={handleFileChange}
                    onCrop={enhancedHandleCrop}
                    onDownload={handleDownload}
                    onRestore={handleRestore}
                />
                <RepetitionControls
                    settings={repetitionSettings}
                    onChange={handleRepetitionSettingsChange}
                />

                <RepetitionBothDirectionsControls
                    settings={repetitionBothDirectionsSettings}
                    onChange={handleRepetitionBothSettingsChange}
                />

                <FixedWidthAspectRatioControls
                    settings={fixedWidthSettings}
                    onChange={handleFixedWidthSettingsChange}
                    cropData={cropData}
                />

                {cropData && <CropDataDisplay cropData={cropData} />}

                {image && (
                    <ImageCropperCanvas
                        image={image}
                        cropperRef={cropperRef}
                        onReady={() => console.log('Cropper initialized')}
                        onChange={handleCropChange}
                        aspectRatio={repetitionSettings.repetitionEnabled ?
                            parseFloat(repetitionSettings.aspectRatio) : undefined}
                    />
                )}

                {croppedImages.length > 0 && (
                    <CroppedImagesGallery onSelect={handleSelectedCroppedImage} images={croppedImages} />
                )}
            </div>
        </div>
    );
};

export default ImageCropper;