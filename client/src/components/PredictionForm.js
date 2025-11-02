import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const PredictionForm = ({ prediction, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    match: '',
    prediction: '',
    odds: '',
    probability: '',
    category: 'freeTips',
    date: '',
    status: 'Pending',
    featured: false,
    note: ''
  });

  const categories = [
    { id: 'freeTips', name: 'Free Tips' },
    { id: 'bankerTips', name: 'Banker Tips' },
    { id: 'free2Odds', name: 'Free 2 Odds' },
    { id: 'superSingle', name: 'Super Single' },
    { id: 'doubleChance', name: 'Double Chance' },
    { id: 'over1.5Goals', name: 'Over 1.5 Goals' },
    { id: 'over2.5Goals', name: 'Over 2.5 Goals' },
    { id: 'overUnder3.5Goals', name: 'Over/Under 3.5 Goals' },
    { id: 'btts', name: 'BTTS/GG' },
    { id: 'overCorners', name: 'Over Corners' },
    { id: 'correctScores', name: 'Correct Scores' },
    { id: 'draws', name: 'Draws' },
    { id: 'vvip', name: 'VVIP' }
  ];

  const predictionTypes = [
    'Home Win',
    'Away Win',
    'Draw',
    'Over 0.5 Goals',
    'Over 1.5 Goals',
    'Over 2.5 Goals',
    'Over 3.5 Goals',
    'Under 2.5 Goals',
    'Both Teams To Score (Yes)',
    'Both Teams To Score (No)',
    'Double Chance',
    'Correct Score',
    'HT/FT',
    'Corner Over/Under',
    'First Goal Scorer',
    'Total Goals',
    'Asian Handicap',
    'Other'
  ];

  const statusOptions = ['Pending', 'Won', 'Lost'];

  useEffect(() => {
    if (prediction) {
      setFormData({
        match: prediction.match || '',
        prediction: prediction.prediction || '',
        odds: prediction.odds || '',
        probability: prediction.probability || '',
        category: prediction.category || 'freeTips',
        date: prediction.date || '',
        status: prediction.status || 'Pending',
        featured: prediction.featured || false,
        note: prediction.note || ''
      });
    }
  }, [prediction]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.match.trim()) {
      alert('Please enter the match details');
      return;
    }
    
    if (!formData.prediction.trim()) {
      alert('Please enter the prediction');
      return;
    }
    
    if (!formData.odds.trim()) {
      alert('Please enter the odds');
      return;
    }

    if (!formData.date) {
      alert('Please select the match date');
      return;
    }

    // Submit form data
    onSubmit(formData);
  };

  // Set today's date as default
  useEffect(() => {
    if (!prediction && !formData.date) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [prediction, formData.date]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {prediction ? 'Edit Prediction' : 'Add New Prediction'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Match */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match *
            </label>
            <input
              type="text"
              name="match"
              value={formData.match}
              onChange={handleChange}
              placeholder="e.g., Real Madrid vs Barcelona"
              className="input-field"
              required
            />
          </div>

          {/* Prediction Type and Odds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prediction *
              </label>
              <select
                name="prediction"
                value={formData.prediction}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select prediction type</option>
                {predictionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Odds *
              </label>
              <input
                type="text"
                name="odds"
                value={formData.odds}
                onChange={handleChange}
                placeholder="e.g., 1.85"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Category and Probability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Probability (%)
              </label>
              <input
                type="text"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                placeholder="e.g., 78%"
                className="input-field"
              />
            </div>
          </div>

          {/* Date and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured (highlight on homepage)
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes about this prediction..."
              className="input-field resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-6 py-2"
            >
              {prediction ? 'Update Prediction' : 'Create Prediction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;