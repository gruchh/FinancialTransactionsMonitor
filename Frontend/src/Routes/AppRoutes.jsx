import App from "../App";
import Dashboard from "../components/Dashboard/Dashboard";
import NotFound from "../components/NotFound/NotFound";
import { Routes, Route } from 'react-router-dom';


function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={< Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
