import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFound from "../pages/NotFound/NotFound";
import Dashboard from "../pages/Dashboard/Dashboard";
import TradesList from "../components/Trades/TradesList";
import WalletSummary from "../components/Dashboard/WalletSummary";

function AppRoutes() {
  return (
<Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<WalletSummary />} />
        <Route path="trade" element={<TradesList />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  ); 
}
export default AppRoutes;