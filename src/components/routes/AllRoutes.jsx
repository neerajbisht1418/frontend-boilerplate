import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Welcome from "../pages/Welcome";
import Dashboard from "../pages/Dashboard";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
