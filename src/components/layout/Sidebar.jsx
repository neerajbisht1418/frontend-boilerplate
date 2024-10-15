import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Settings } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`
    }
  >
    <Icon size={20} />
    <span>{children}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="bg-white text-gray-800 w-64 min-h-screen p-4 border-r border-gray-200">
      <div className="text-2xl font-bold mb-8">Your Logo</div>
      <nav className="space-y-2">
        <SidebarLink to="/dashboard" icon={Home}>Dashboard</SidebarLink>
        <SidebarLink to="/analytics" icon={BarChart2}>Analytics</SidebarLink>
        <SidebarLink to="/settings" icon={Settings}>Settings</SidebarLink>
      </nav>
    </aside>
  );
};

export default Sidebar;