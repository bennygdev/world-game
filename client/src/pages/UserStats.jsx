import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/Auth';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function UserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

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
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // do not render anything while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // no auth > login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">{error}</div>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.game_mode} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{stat.game_mode} Mode</h2>
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
    </div>
    </>
  );
}

export default UserStats;