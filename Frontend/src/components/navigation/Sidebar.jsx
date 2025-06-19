import { useNavigate } from 'react-router-dom';
import { sidebarItems } from "./SidebarItems";
import { useAppContext } from "../../context/AppContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const handleNavigation = (itemName) => {
    switch (itemName) {
      case "Dashboard":
        navigate("/");
        break;
      case "Add new":
        navigate("/dashboard/trades/add");
        break;
      case "Analytics":
        navigate("trades/analytics");
        break;
      case "Trades":
        navigate("/dashboard/trades");
        break;
      case "Logout":
        logout();
        navigate("/");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="bg-gray-800 p-4 overflow-y-auto h-full">
      <ul className="flex flex-col w-full">
        <li className="my-px">
          <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">
            Projects
          </span>
        </li>
        {sidebarItems.map((item, index) => (
          <li key={index} className="my-px">
            <button
              onClick={() => handleNavigation(item.name)}
              className={`flex items-center h-12 px-4 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors w-full text-left ${
                item.active ? "bg-gray-100 text-gray-600" : ""
              }`}
            >
              <span className={`flex items-center justify-center text-lg ${item.color || "text-gray-200"}`}>
                <svg
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path d={item.icon}></path>
                </svg>
              </span>
              <span className="ml-3 font-medium">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;