import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navigation/Navbar";
import Sidebar from "../../components/Navigation/Sidebar";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="h-screen grid grid-cols-12 bg-gray-100 m-0 overflow-hidden">
        <div className="col-span-3 h-full hidden md:block">
          <Sidebar />
        </div>
        <div className="col-span-12 md:col-span-9 flex flex-col items-start justify-start p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Dashboard;