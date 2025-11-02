import React from 'react';
import { FaHome, FaTrophy, FaFootballBall, FaChartLine, FaCrown, FaShieldAlt, FaBullseye, FaChartBar, FaCrosshairs, FaBoxOpen, FaTrophy as FaWin, FaHandshake, FaStar } from 'react-icons/fa';
import { MdVerifiedUser } from 'react-icons/md';

const Sidebar = () => {
  const categories = [
    { id: 'freeTips', name: 'Free Tips', icon: FaHome, featured: true },
    { id: 'bankerTips', name: 'Banker Tips', icon: FaTrophy, featured: true },
    { id: 'free2Odds', name: 'Free 2 Odds', icon: FaFootballBall },
    { id: 'superSingle', name: 'Super Single', icon: FaCrown },
    { id: 'doubleChance', name: 'Double Chance', icon: FaShieldAlt },
    { id: 'over1.5Goals', name: 'Over 1.5 Goals', icon: FaBullseye },
    { id: 'over2.5Goals', name: 'Over 2.5 Goals', icon: FaChartBar },
    { id: 'overUnder3.5Goals', name: 'Over/Under 3.5 Goals', icon: FaCrosshairs },
    { id: 'btts', name: 'BTTS/GG', icon: FaChartLine },
    { id: 'overCorners', name: 'Over Corners', icon: FaBoxOpen },
    { id: 'correctScores', name: 'Correct Scores', icon: FaWin },
    { id: 'draws', name: 'Draws', icon: FaHandshake },
    { id: 'vvip', name: 'VVIP', icon: FaStar }
  ];

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">DP</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">DhronePredicts</h1>
            <p className="text-sm text-gray-600">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Prediction Categories
          </h2>
          <div className="space-y-1">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className={`sidebar-link ${category.featured ? 'featured' : ''}`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span className="flex-1">{category.name}</span>
                  {category.featured && (
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="space-y-1">
            <button className="w-full sidebar-link text-left">
              <FaTrophy className="w-5 h-5 mr-3" />
              Add New Prediction
            </button>
            <button className="w-full sidebar-link text-left">
              <MdVerifiedUser className="w-5 h-5 mr-3" />
              View All Predictions
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            DhronePredicts Management System v1.0
          </p>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;