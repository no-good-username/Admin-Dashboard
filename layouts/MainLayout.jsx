// layouts/MainLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Home, Map, FileText, Bell, BarChart2, Settings } from "lucide-react";

const MainLayout = ({ children }) => {
  const location = useLocation();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/map", label: "Map View", icon: Map },
    { path: "/issues", label: "Issues", icon: FileText },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/analytics", label: "Analytics", icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold">Streetlight Monitor</h1>
        </div>
        <nav className="mt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-2 my-1 text-gray-700 ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
