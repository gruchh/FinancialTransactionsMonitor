import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navigation/Navbar";
import Sidebar from "./components/Navigation/Sidebar";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen grid grid-cols-12 bg-gray-100 m-0">
        <div className="col-span-3 h-screen hidden md:block">
          <Sidebar />
        </div>
        <div className="col-span-12 md:col-span-9 flex items-center justify-center">
          <Outlet />
        </div>
      </div>
        
    </>
  );
}

export default App;
