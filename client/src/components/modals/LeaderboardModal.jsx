import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy, FaGlobeAmericas } from 'react-icons/fa';
import { useAuth } from '../../hooks/Auth';

function LeaderboardModal({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('World');
  const { user } = useAuth();

  const continentFilters = [
    'World', 
    'North America', 
    'South America', 
    'Europe', 
    'Asia', 
    'Africa', 
    'Oceania'
  ];

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
        setFilteredLeaderboard(response.data.filter(entry => entry.game_mode === 'World'));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // filter
  useEffect(() => {
    setFilteredLeaderboard(
      leaderboard.filter(entry => entry.game_mode === activeFilter)
    );
  }, [activeFilter, leaderboard]);

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

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // check if current user is in leaderboard
  const isUserInLeaderboard = user && filteredLeaderboard.some(entry => entry.username === user.username);

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
        className={`bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative transform transition-all duration-300 h-[80vh] ${
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
          <>
            {/* Filter buttons */}
            <div className="mb-4 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {continentFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {filter === 'World' && <FaGlobeAmericas className="inline mr-1" />}
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              // Message only for authenticated users who aren't on the leaderboard
              !isUserInLeaderboard && (
                <div className="mb-4 p-4 rounded bg-gray-100">
                  <p className="text-sm">
                    <span className="font-medium">You're not on the {activeFilter} leaderboard yet.</span> Keep playing to earn your spot!
                  </p>
                </div>
              )
            ) : (
              // Message for non-authenticated users
              <div className="mb-4 p-4 rounded bg-gray-100">
                <p className="text-sm">
                  <span className="font-medium">Register an account</span> to get your name on the leaderboard and track your progress!
                </p>
              </div>
            )}
          
            <div className="overflow-auto max-h-[60vh]">
              <table className="min-w-full">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Game Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No data available for {activeFilter}
                      </td>
                    </tr>
                  ) : (
                    filteredLeaderboard.map((entry, index) => {
                      const isCurrentUser = user && entry.username === user.username;
                      
                      // set background class based on rank and current user
                      let bgClass = "";
                      if (isCurrentUser) {
                        bgClass = "bg-blue-100"; // blue background for current user
                      } else if (index === 0) {
                        bgClass = "bg-yellow-50"; // Gold (1st)
                      } else if (index === 1) {
                        bgClass = "bg-gray-50"; // Silver (2nd)
                      } else if (index === 2) {
                        bgClass = "bg-amber-50"; // Bronze (3rd)
                      } else if (index % 2 === 1) {
                        bgClass = "bg-gray-50";
                      }
                      
                      return (
                        <tr key={entry.id} className={bgClass}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderRank(index)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {entry.username} {isCurrentUser && <span className="text-blue-500 ml-2">(You)</span>}
                            </div>
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LeaderboardModal;