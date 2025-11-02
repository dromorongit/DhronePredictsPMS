import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaSearch } from 'react-icons/fa';
import api from '../api/api';
import PredictionForm from './PredictionForm';
import PredictionTable from './PredictionTable';

const Dashboard = () => {
  const [predictions, setPredictions] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/predictions');
      setPredictions(response.data);
    } catch (error) {
      toast.error('Failed to fetch predictions');
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleAddPrediction = () => {
    setEditingPrediction(null);
    setShowForm(true);
  };

  const handleEditPrediction = (prediction) => {
    setEditingPrediction(prediction);
    setShowForm(true);
  };

  const handleDeletePrediction = async (prediction, category) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      await api.delete(`/predictions/${prediction.id}`, {
        data: { category }
      });
      
      toast.success('Prediction deleted successfully');
      fetchPredictions();
    } catch (error) {
      toast.error('Failed to delete prediction');
      console.error('Error deleting prediction:', error);
    }
  };

  const handleFormSubmit = async (predictionData) => {
    try {
      if (editingPrediction) {
        await api.put(`/predictions/${editingPrediction.id}`, predictionData);
        toast.success('Prediction updated successfully');
      } else {
        await api.post('/predictions', predictionData);
        toast.success('Prediction created successfully');
      }
      
      setShowForm(false);
      setEditingPrediction(null);
      fetchPredictions();
    } catch (error) {
      toast.error(editingPrediction ? 'Failed to update prediction' : 'Failed to create prediction');
      console.error('Error saving prediction:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPrediction(null);
  };

  // Filter predictions based on selected category and search term
  const getFilteredPredictions = () => {
    let filtered = [];

    if (selectedCategory === 'all') {
      // Get all predictions from all categories
      Object.entries(predictions).forEach(([category, categoryPredictions]) => {
        filtered.push(...categoryPredictions.map(p => ({ ...p, category })));
      });
    } else {
      // Get predictions from selected category
      filtered = predictions[selectedCategory]?.map(p => ({ ...p, category: selectedCategory })) || [];
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(prediction =>
        prediction.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getTotalStats = () => {
    const total = Object.values(predictions).reduce((sum, categoryPredictions) => sum + categoryPredictions.length, 0);
    const pending = Object.values(predictions).flat().filter(p => p.status === 'Pending').length;
    const won = Object.values(predictions).flat().filter(p => p.status === 'Won').length;
    const lost = Object.values(predictions).flat().filter(p => p.status === 'Lost').length;

    return { total, pending, won, lost };
  };

  const stats = getTotalStats();
  const filteredPredictions = getFilteredPredictions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FaFilter className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Predictions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <FaSearch className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FaEdit className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Won</p>
              <p className="text-2xl font-bold text-gray-900">{stats.won}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <FaTrash className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Lost</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lost}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search predictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field max-w-xs"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddPrediction}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Prediction</span>
          </button>
        </div>
      </div>

      {/* Predictions Table */}
      <PredictionTable
        predictions={filteredPredictions}
        onEdit={handleEditPrediction}
        onDelete={handleDeletePrediction}
      />

      {/* Prediction Form Modal */}
      {showForm && (
        <PredictionForm
          prediction={editingPrediction}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Dashboard;