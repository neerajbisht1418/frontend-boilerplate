import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { DEFAULT_CROPPER_CONFIG } from '../constants/cropperConfigs';

const ImageCropperCanvas = ({ image, cropperRef, onReady, onChange }) => (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Cropper
            ref={cropperRef}
            src={image}
            style={{ height: DEFAULT_CROPPER_CONFIG.height, width: '100%' }}
            {...DEFAULT_CROPPER_CONFIG}
            onReady={onReady}
            cropend={onChange}
            cropmove={onChange}
        />
    </div>
);

export default ImageCropperCanvas