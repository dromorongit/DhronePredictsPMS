import React from 'react';
import { FaHome, FaPlus, FaList, FaCog } from 'react-icons/fa';

const MobileNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FaHome },
    { id: 'predictions', name: 'Predictions', icon: FaList },
    { id: 'add', name: 'Add', icon: FaPlus, primary: true },
    { id: 'settings', name: 'Settings', icon: FaCog },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition duration-200 ${
                tab.primary
                  ? 'bg-primary text-white shadow-lg'
                  : activeTab === tab.id
                  ? 'text-primary bg-blue-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${tab.primary ? 'mb-1' : ''}`} />
              {!tab.primary && (
                <span className="text-xs mt-1">{tab.name}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;