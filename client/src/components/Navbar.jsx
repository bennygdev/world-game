import { useAuth } from '../hooks/Auth';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold">
              {user ? `Welcome, ${user.username}!` : 'Welcome, Guest!'}
            </h1>
            <div className="flex space-x-4">
              <Link to="/" className="text-black hover:text-gray-800">
                Home
              </Link>
              <Link to="/leaderboard" className="text-black hover:text-gray-800">
                Leaderboard
              </Link>
              {user && (
                <Link to="/stats" className="text-black hover:text-gray-800">
                  My Stats
                </Link>
              )}
            </div>
          </div>
          <div className="space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="text-blue-600 hover:text-blue-800"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
                <Link to="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}