import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaSearch, FaTrophy, FaChartLine, FaClock, FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';
import api from '../api/api';
import PredictionForm from './PredictionForm';
import PredictionTable from './PredictionTable';
import MobilePredictionCard from './MobilePredictionCard';
import MobileNav from './MobileNav';
import ConfirmationModal from './ConfirmationModal';

const Dashboard = () => {
  const [predictions, setPredictions] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [predictionToDelete, setPredictionToDelete] = useState(null);

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

  const handleDeletePrediction = (prediction, category) => {
    setPredictionToDelete({ prediction, category });
    setShowDeleteModal(true);
  };

  const confirmDeletePrediction = async () => {
    if (!predictionToDelete) return;

    try {
      await api.delete(`/predictions/${predictionToDelete.prediction.id}`, {
        data: { category: predictionToDelete.category }
      });

      toast.success('Prediction deleted successfully');
      fetchPredictions();
    } catch (error) {
      toast.error('Failed to delete prediction');
      console.error('Error deleting prediction:', error);
    }
  };

  const cancelDeletePrediction = () => {
    setShowDeleteModal(false);
    setPredictionToDelete(null);
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'add') {
      handleAddPrediction();
    }
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
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-4 gap-6">
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
                <FaClock className="w-6 h-6 text-yellow-600" />
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
                <FaCheckCircle className="w-6 h-6 text-green-600" />
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
                <FaTimesCircle className="w-6 h-6 text-red-600" />
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
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
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
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden pb-20">
        {/* Mobile Header Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <FaTrophy className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 mr-3">
                <FaClock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Pending</p>
                <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <FaCheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Won</p>
                <p className="text-lg font-bold text-gray-900">{stats.won}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100 mr-3">
                <FaTimesCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Lost</p>
                <p className="text-lg font-bold text-gray-900">{stats.lost}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="mb-4">
          <div className="flex space-x-2 mb-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 input-field text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field w-full text-sm"
            />
          </div>
        </div>

        {/* Mobile Predictions List */}
        <div className="space-y-3">
          {filteredPredictions.length === 0 ? (
            <div className="text-center py-12">
              <FaChartLine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions found</h3>
              <p className="text-gray-600">Get started by adding your first prediction!</p>
            </div>
          ) : (
            filteredPredictions.map((prediction) => (
              <MobilePredictionCard
                key={prediction.id}
                prediction={prediction}
                onEdit={handleEditPrediction}
                onDelete={handleDeletePrediction}
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Prediction Form Modal */}
      {showForm && (
        <PredictionForm
          prediction={editingPrediction}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeletePrediction}
        onConfirm={confirmDeletePrediction}
        title="Delete Prediction"
        message={`Are you sure you want to delete the prediction for "${predictionToDelete?.prediction?.match}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default Dashboard;