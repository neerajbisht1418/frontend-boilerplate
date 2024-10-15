// src/components/layout/Sidebar.jsx
import React from 'react';
import { Home, BarChart2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/analytics" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <BarChart2 size={20} />
          <span>Analytics</span>
        </Link>
        <Link to="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar



