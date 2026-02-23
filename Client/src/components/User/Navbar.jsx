import { NavLink } from 'react-router-dom';
import chatbotimage from "../assets/chatbot.png";
import { Menu, Search, LogOut, LayoutDashboard, Upload, MessageSquare, Info, Bot } from 'lucide-react';

const Navbar = ({ onLogout }) => (
  <div className="navbar bg-[#1a1a1a] border-b border-[#4CAF50]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] px-4 md:px-8 py-3 sticky top-0 z-50">
    <div className="navbar-start">
      <div className="dropdown">
        <button tabIndex={0} className="btn btn-ghost btn-circle text-[#4CAF50] hover:bg-[#4CAF50]/10">
          <Menu size={28} />
        </button>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-4 shadow-2xl bg-[#2a2a2a] text-white rounded-xl w-64 border border-[#4CAF50]/20 space-y-3">
          <NavLink to="/yourturf" className="group">
            <li className="flex items-center p-3 rounded-lg hover:bg-[#4CAF50]/10 transition-colors">
              <LayoutDashboard size={18} className="mr-3 text-[#4CAF50]" />
              <span className="font-semibold">Your Turfs</span>
            </li>
          </NavLink>
          <NavLink to="/ownerHome" className="group">
            <li className="flex items-center p-3 rounded-lg hover:bg-[#4CAF50]/10 transition-colors">
              <Upload size={18} className="mr-3 text-[#4CAF50]" />
              <span className="font-semibold">Upload Turf</span>
            </li>
          </NavLink>
          <li className="flex items-center p-3 rounded-lg hover:bg-[#4CAF50]/10 transition-colors cursor-pointer">
            <MessageSquare size={18} className="mr-3 text-[#4CAF50]" />
            <span className="font-semibold">Feedback</span>
          </li>
          <li className="flex items-center p-3 rounded-lg hover:bg-[#4CAF50]/10 transition-colors cursor-pointer">
            <Info size={18} className="mr-3 text-[#4CAF50]" />
            <span className="font-semibold">About</span>
          </li>
          <NavLink to='/AiChatBot'>
            <li className="flex items-center p-3 rounded-lg hover:bg-[#4CAF50]/10 transition-colors">
              <Bot size={18} className="mr-3 text-[#4CAF50]" />
              <span className="font-semibold flex-1">Chat AI</span>
              <img src={chatbotimage} className='w-5 ml-2 rounded-full ring-1 ring-[#4CAF50]' alt="AI" />
            </li>
          </NavLink>
          <div className="border-t border-gray-700 my-2"></div>
          <li 
            className="flex items-center p-3 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer" 
            onClick={onLogout}
          >
            <LogOut size={18} className="mr-3" />
            <span className="font-bold">Logout</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="navbar-center">
      <NavLink to="/userHome" className="flex items-center group">
        <span className="text-3xl font-black text-white tracking-tighter group-hover:text-[#4CAF50] transition-colors">
          TURF<span className="text-[#4CAF50]">ER</span>
        </span>
      </NavLink>
    </div>
    <div className="navbar-end">
      <button className="btn btn-ghost btn-circle text-white hover:text-[#4CAF50] hover:bg-[#4CAF50]/10">
        <Search size={24} />
      </button>
    </div>
  </div>
);

export default Navbar;
