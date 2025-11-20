import React from 'react';
import { FaEdit, FaTrash, FaStar, FaCalendarAlt, FaChartLine, FaTrophy, FaClock } from 'react-icons/fa';

const MobilePredictionCard = ({ prediction, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Won':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getCategoryName = (categoryId) => {
    const categoryMap = {
      freeTips: 'Free Tips',
      bankerTips: 'Banker Tips',
      free2Odds: 'Free 2 Odds',
      superSingle: 'Super Single',
      doubleChance: 'Double Chance',
      'over1.5Goals': 'Over 1.5 Goals',
      'over2.5Goals': 'Over 2.5 Goals',
      'overUnder3.5Goals': 'Over/Under 3.5 Goals',
      btts: 'BTTS/GG',
      overCorners: 'Over Corners',
      correctScores: 'Correct Scores',
      draws: 'Draws',
      vvip: 'VVIP'
    };
    return categoryMap[categoryId] || categoryId;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
      {/* Header with match and status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            {prediction.featured && (
              <FaStar className="w-4 h-4 text-secondary mr-2" />
            )}
            <h3 className="font-semibold text-gray-900 text-sm">{prediction.match}</h3>
          </div>
          {prediction.leagueType && (
            <p className="text-xs text-gray-600">{prediction.leagueType}</p>
          )}
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(prediction.status)}`}>
          {prediction.status}
        </span>
      </div>

      {/* Prediction details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Prediction:</span>
          <span className="text-sm text-gray-900">{prediction.prediction}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Odds:</span>
          <span className="text-sm font-semibold text-primary">{prediction.odds}</span>
        </div>

        {prediction.probability && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Probability:</span>
            <div className="flex items-center text-sm text-gray-900">
              <FaChartLine className="w-3 h-3 mr-1 text-gray-400" />
              {prediction.probability}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Category:</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getCategoryName(prediction.category)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Date:</span>
          <div className="flex items-center text-sm text-gray-900">
            <FaCalendarAlt className="w-3 h-3 mr-1 text-gray-400" />
            {prediction.date}
            {prediction.time && (
              <>
                <FaClock className="w-3 h-3 ml-2 mr-1 text-gray-400" />
                {prediction.time}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {prediction.note && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-700">
          {prediction.note}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(prediction)}
          className="flex-1 flex items-center justify-center py-2 px-3 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition duration-200"
        >
          <FaEdit className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Edit</span>
        </button>
        <button
          onClick={() => onDelete(prediction, prediction.category)}
          className="flex-1 flex items-center justify-center py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200"
        >
          <FaTrash className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default MobilePredictionCard;