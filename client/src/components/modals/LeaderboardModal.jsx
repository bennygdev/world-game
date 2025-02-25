import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../hooks/Auth';

function LeaderboardModal({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
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

  // check if current user is in leaderboard
  const isUserInLeaderboard = user && leaderboard.some(entry => entry.username === user.username);

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
          <>
            {user ? (
              // Message only for authenticated users who aren't on the leaderboard
              !isUserInLeaderboard && (
                <div className="mb-4 p-4 rounded bg-gray-50">
                  <p className="text-sm">
                    <span className="font-medium">You're not on the leaderboard yet.</span> Keep playing to earn your spot!
                  </p>
                </div>
              )
            ) : (
              // Message for non-authenticated users
              <div className="mb-4 p-4 rounded bg-gray-50">
                <p className="text-sm">
                  <span className="font-medium">Register an account</span> to get your name on the leaderboard and track your progress!
                </p>
              </div>
            )}
          
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
                  {leaderboard.map((entry, index) => {
                    // Determine if this row is the current user
                    const isCurrentUser = user && entry.username === user.username;
                    
                    // Set background class based on rank and current user
                    let bgClass = "";
                    if (isCurrentUser) {
                      bgClass = "bg-blue-100"; // Blue background for current user
                    } else if (index === 0) {
                      bgClass = "bg-yellow-50"; // Gold for first place
                    } else if (index === 1) {
                      bgClass = "bg-gray-50"; // Silver for second place
                    } else if (index === 2) {
                      bgClass = "bg-amber-50"; // Bronze for third place
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
                  })}
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