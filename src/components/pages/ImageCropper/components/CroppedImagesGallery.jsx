const CroppedImagesGallery = ({onSelect, images }) => (
    <div className="mt-4 space-y-4">
        <h3 className="text-lg font-semibold">Cropped Images:</h3>
        <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
                <img
                    onClick={() => onSelect(image)}
                    key={index}
                    src={image}
                    alt={`Cropped image ${index + 1}`}
                    className="max-w-full h-auto rounded-lg shadow-md"
                />
            ))}
        </div>
    </div>
);

export default CroppedImagesGallery