import { Route, Routes } from "react-router-dom";
import App from "../App";
import LoginPage from "../components/Auth/LoginPage";
import Dashboard from "../components/Dashboard/Dashboard";
import NotFound from "../components/NotFound/NotFound";
import TradeForm from "../components/Trades/TradeForm";
import TradesList from "../components/Trades/TradesList";
import TradesAnalytics from "../components/Trades/TradesAnalytics";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<App />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trades" element={<TradesList />} />
        <Route path="/trades/add" element={<TradeForm />} />
        <Route path="/analytics" element={<TradesAnalytics/>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  ); 
}
export default AppRoutes;