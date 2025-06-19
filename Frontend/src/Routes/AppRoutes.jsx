import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFound from "../pages/NotFound/NotFound";
import Dashboard from "../pages/Dashboard/Dashboard";
import TradesList from "../components/Trades/TradesList";
import WalletSummary from "../components/Dashboard/WalletSummary";
import { TradeForm } from "../components/Trades/TradeForm/TradeForm";
import TradesAnalytics from "../components/Trades/TradesAnalytics";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<WalletSummary />} />
        <Route path="trades" element={<TradesList />} />
        <Route path="trades/add" element={<TradeForm />} />
        <Route path="trades/analytics" element={<TradesAnalytics />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default AppRoutes;
