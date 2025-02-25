import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/Auth';
import axios from 'axios';

export default function UserStatsModal({ onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // start animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    } else {
      setError('You must be logged in to view statistics');
      setLoading(false);
    }
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // wait
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      
      <div 
        className={`bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative transform transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <h2 className="text-3xl font-bold mb-6 text-center">Your Statistics</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            {stats.map((stat) => (
              <div key={stat.game_mode} className="bg-gray-50 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">{stat.game_mode} Mode</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">High Score:</span>
                    <span className="font-medium">{stat.high_score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Games Played:</span>
                    <span className="font-medium">{stat.total_games_played}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Streak:</span>
                    <span className="font-medium">{stat.best_streak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Played:</span>
                    <span className="font-medium">
                      {stat.last_played ? new Date(stat.last_played).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}