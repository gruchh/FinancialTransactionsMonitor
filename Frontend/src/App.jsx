import "./App.css";
import Navbar from "./components/navigation/Navbar";
import Sidebar from "./components/navigation/Sidebar";

function App() {
  return (
    <>
      <Navbar />
      {/* Demo Content */}
      {/* <div className="p-8 bg-gray-100 min-h-screen"> */}
      <div className="min-h-screen grid grid-cols-12 bg-gray-100 m-0">
        <div className="col-span-3 h-screen hidden md:block">
          <Sidebar />
        </div>
        <div className="col-span-12 md:col-span-9 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Hello world!</h1>
        </div>
      </div>
        
      {/* </div> */}
    </>
  );
}

export default App;
