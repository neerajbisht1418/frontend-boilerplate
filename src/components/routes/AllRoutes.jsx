import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Welcome from "../pages/Welcome";
import ImageCropper from "../pages/ImageCropper/ImageCropper";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="*" element={<NotFound />} />
        <Route path="image-cropper" element={<ImageCropper />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
