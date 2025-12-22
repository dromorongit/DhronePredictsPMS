import React, { useState, useEffect } from 'react';
import { FaTrophy, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PublicVVIP = () => {
  const [completedPredictions, setCompletedPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompletedVVIPPredictions();
  }, []);

  const fetchCompletedVVIPPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple API endpoints to handle CORS and different server configurations
      const apiEndpoints = [
        'https://dhronepredictionspms.up.railway.app/api/predictions?status=Won',
        'https://dhronepredictionspms.up.railway.app/api/predictions?category=vvip&status=Won',
        '/api/predictions?status=Won', // Fallback to relative path
      ];

      let predictions = null;
      let lastError = null;

      for (const endpoint of apiEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('API Response:', data);
          
          // Extract VVIP predictions from the response
          if (data.vvip && Array.isArray(data.vvip)) {
            // Response is grouped by category
            predictions = data.vvip.filter(pred => pred.status === 'Won');
          } else if (Array.isArray(data)) {
            // Response is an array of predictions
            predictions = data.filter(pred => 
              pred.category === 'vvip' && pred.status === 'Won'
            );
          } else if (data && typeof data === 'object') {
            // Handle other response formats
            const vvipData = data.vvip || [];
            predictions = Array.isArray(vvipData) 
              ? vvipData.filter(pred => pred.status === 'Won')
              : [];
          }
          
          if (predictions && predictions.length > 0) {
            break; // Success, exit the loop
          }
          
        } catch (err) {
          console.warn(`Failed with endpoint ${endpoint}:`, err);
          lastError = err;
        }
      }

      if (predictions && predictions.length > 0) {
        setCompletedPredictions(predictions);
      } else {
        // If all endpoints fail, show empty state with error info
        setError(lastError ? `Failed to load predictions: ${lastError.message}` : 'No completed predictions found');
        setCompletedPredictions([]);
      }
      
    } catch (err) {
      console.error('Error fetching VVIP predictions:', err);
      setError('Failed to load completed predictions. Please try again later.');
      setCompletedPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Won':
        return <FaCheckCircle className="text-green-500" />;
      case 'Lost':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading completed VVIP predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Predictions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCompletedVVIPPredictions}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <FaTrophy className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VVIP Predictions</h1>
              <p className="text-gray-600">Previously completed tips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {completedPredictions.length === 0 ? (
          <div className="text-center py-12">
            <FaTrophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed predictions yet</h3>
            <p className="text-gray-600">Check back later for completed VVIP tips.</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaTrophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{completedPredictions.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <FaCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Won</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {completedPredictions.filter(p => p.status === 'Won').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-100 mr-3">
                    <FaTimesCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lost</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {completedPredictions.filter(p => p.status === 'Lost').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictions List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Completed Predictions</h2>
              {completedPredictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prediction.match}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(prediction.status)}`}>
                          {getStatusIcon(prediction.status)}
                          <span className="ml-1">{prediction.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Prediction:</span>
                          <p className="text-gray-900">{prediction.prediction}</p>
                        </div>
                        <div>
                          <span className="font-medium">League:</span>
                          <p className="text-gray-900">{prediction.leagueType}</p>
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>
                          <p className="text-gray-900">
                            {prediction.date} {prediction.time && `at ${prediction.time}`}
                          </p>
                        </div>
                      </div>
                      
                      {(prediction.odds || prediction.probability) && (
                        <div className="mt-3 flex space-x-6 text-sm">
                          {prediction.odds && (
                            <div>
                              <span className="font-medium text-gray-600">Odds:</span>
                              <span className="ml-1 text-gray-900 font-semibold">{prediction.odds}</span>
                            </div>
                          )}
                          {prediction.probability && (
                            <div>
                              <span className="font-medium text-gray-600">Probability:</span>
                              <span className="ml-1 text-gray-900 font-semibold">{prediction.probability}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {prediction.note && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-600">Note:</span>
                          <p className="text-gray-900 mt-1">{prediction.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicVVIP;