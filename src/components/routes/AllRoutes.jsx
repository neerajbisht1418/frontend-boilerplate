import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Welcome from "../pages/Welcome";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
