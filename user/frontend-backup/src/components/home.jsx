import React from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { Home as HomeIcon, Music, ListMusic, LogOut, Search } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();



  return (
    <div className="w-full h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 p-5 flex flex-col justify-between h-full fixed">
        <div>
          <h1 className="text-2xl font-bold mb-5">MusicHub</h1>
          <ul className="space-y-4">
            <li className={`flex items-center space-x-3 cursor-pointer hover:text-gray-400 ${location.pathname === "/home" ? "text-gray-300" : ""}`}>
              <Link to="/home" className="flex items-center space-x-3">
                <HomeIcon size={20} /> <span>Home</span>
              </Link>
            </li>
            <li className={`flex items-center space-x-3 cursor-pointer hover:text-gray-400 ${location.pathname === "/home/library" ? "text-gray-300" : ""}`}>
              <Link to="/home/library" className="flex items-center space-x-3">
                <Music size={20} /> <span>Library</span>
              </Link>
            </li>
            <li className={`flex items-center space-x-3 cursor-pointer hover:text-gray-400 ${location.pathname === "/home/playlists" ? "text-gray-300" : ""}`}>
              <Link to="/home/playlists" className="flex items-center space-x-3">
                <ListMusic size={20} /> <span>Playlists</span>
              </Link>
            </li>
          </ul>
        </div>
        
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 p-8 overflow-auto">
       
        <Outlet />
      </main>
    </div>
  );
};

export default Home;













