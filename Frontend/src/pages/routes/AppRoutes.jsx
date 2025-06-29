import { Route, Routes } from "react-router-dom";
import LoginPage from "../Auth/LoginPage";
import HomePage from "../HomePage/HomePage";
import NotFound from "../NotFound/NotFound";
import Dashboard from "../Dashboard/Dashboard";
import WalletSummary from "../../components/Dashboard/WalletSummary";
import TradesList from "../../components/Trade/TradesList";
import { TradeForm } from "../../components/Trade/TradeForm/TradeForm";
import TradesAnalytics from "../../components/Trade/TradesAnalytics";

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
