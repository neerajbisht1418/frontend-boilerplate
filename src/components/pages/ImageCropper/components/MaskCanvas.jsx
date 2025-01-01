// src/components/MaskCanvas/index.jsx
import React from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { useCanvasTransform } from '../hooks/useCanvasTransform';
import CanvasControls from './CanvasControls';
import { useCanvasOperations } from '../hooks/useCanvasOperations';

const MaskCanvas = ({ maskImage, showMask, selectedCroppedImage, setCroppedMaskImage }) => {
    const canvasRef = React.useRef();

    const { loadedImages, imageDimensions } = useImageLoader({
        maskImage,
        selectedCroppedImage,
        canvasRef
    });

    const {
        fabricPosition,
        fabricScale,
        fabricRotation,
        isDragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        setFabricScale,
        setFabricRotation
    } = useCanvasTransform({ canvasRef });

    const {
        croppedImage,
        handleCrop,
        handleDownload,
        drawCanvas
    } = useCanvasOperations({
        canvasRef,
        loadedImages,
        fabricPosition,
        fabricScale,
        fabricRotation,
        imageDimensions,
        setCroppedMaskImage,
    });

    React.useEffect(() => {
        drawCanvas();
    }, [fabricPosition, fabricScale, fabricRotation, loadedImages]);

    if (!showMask) return null;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="border shadow-lg mt-4">
                <canvas
                    ref={canvasRef}
                    style={{
                        width: 'calc(100% - 50%)',
                        height: 'auto',
                        maxWidth: '100%',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        margin: "auto"
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
            </div>
            <CanvasControls
                fabricScale={fabricScale}
                fabricRotation={fabricRotation}
                setFabricScale={setFabricScale}
                setFabricRotation={setFabricRotation}
                handleCrop={handleCrop}
                handleDownload={handleDownload}
                croppedImage={croppedImage}
            />
        </div>
    );
};

export default MaskCanvas;