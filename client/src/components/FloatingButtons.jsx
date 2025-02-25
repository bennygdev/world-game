import { useAuth } from '../hooks/Auth';
import { FaTrophy, FaChartBar, FaSignOutAlt, FaUser } from 'react-icons/fa';

function FloatingButtons({ 
  onLoginClick, 
  // onRegisterClick, 
  onLeaderboardClick, 
  onStatsClick 
}) {
  const { user, logout } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50 flex space-x-3">
      <button 
        onClick={onLeaderboardClick}
        className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
        title="Leaderboard"
      >
        <FaTrophy className="h-6 w-6 text-yellow-500" />
      </button>
      
      {user && (
        <button 
          onClick={onStatsClick}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          title="My Stats"
        >
          <FaChartBar className="h-6 w-6 text-blue-500" />
        </button>
      )}
      
      {user ? (
        <button 
          onClick={logout}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          title="Logout"
        >
          <FaSignOutAlt className="h-6 w-6 text-red-500" />
        </button>
      ) : (
        <button 
          onClick={onLoginClick}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          title="Login/Register"
        >
          <FaUser className="h-6 w-6 text-gray-600" />
        </button>
      )}
    </div>
  );
}

export default FloatingButtons;