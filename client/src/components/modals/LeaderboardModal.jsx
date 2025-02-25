import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy } from 'react-icons/fa';

export default function LeaderboardModal({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // start animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/leaderboard');
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // wait
  };

  // rank with trophy for top 3
  const renderRank = (index) => {
    if (index === 0) {
      return (
        <div className="flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-900">1</span>
        </div>
      );
    } else if (index === 1) {
      return (
        <div className="flex items-center">
          <FaTrophy className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">2</span>
        </div>
      );
    } else if (index === 2) {
      return (
        <div className="flex items-center">
          <FaTrophy className="text-amber-700 mr-2" />
          <span className="text-sm font-medium text-gray-900">3</span>
        </div>
      );
    } else {
      return <div className="text-sm font-medium text-gray-900">#{index + 1}</div>;
    }
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
        className={`bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative transform transition-all duration-300 ${
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
        
        <div className="flex items-center justify-center mb-6">
          <FaTrophy className="text-yellow-500 mr-3 h-8 w-8" />
          <h2 className="text-3xl font-bold text-center">World Game Leaderboard</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id} className={
                    index === 0 ? "bg-yellow-50" : 
                    index === 1 ? "bg-gray-50" : 
                    index === 2 ? "bg-amber-50" : ""
                  }>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderRank(index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{entry.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-bold">{entry.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.game_mode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(entry.played_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}