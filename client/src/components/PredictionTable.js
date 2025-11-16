import React from 'react';
import { FaEdit, FaTrash, FaStar, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const PredictionTable = ({ predictions, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Won':
        return 'bg-green-100 text-green-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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

  if (predictions.length === 0) {
    return (
      <div className="card text-center py-12">
        <FaChartLine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions found</h3>
        <p className="text-gray-600">Get started by adding your first prediction!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                League Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prediction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Odds
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {predictions.map((prediction) => (
              <tr key={prediction.id} className="hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {prediction.featured && (
                      <FaStar className="w-4 h-4 text-secondary mr-2" title="Featured" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {prediction.match}
                      </div>
                      {prediction.note && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {prediction.note}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prediction.leagueType || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prediction.prediction}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getCategoryName(prediction.category)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">
                    {prediction.odds}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    {prediction.probability && (
                      <>
                        <FaChartLine className="w-3 h-3 mr-1 text-gray-400" />
                        {prediction.probability}
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <FaCalendarAlt className="w-3 h-3 mr-1 text-gray-400" />
                    {prediction.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prediction.status)}`}>
                    {prediction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(prediction)}
                      className="text-primary hover:text-primary-dark transition duration-200"
                      title="Edit prediction"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(prediction, prediction.category)}
                      className="text-red-600 hover:text-red-900 transition duration-200"
                      title="Delete prediction"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionTable;