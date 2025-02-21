import { useAuth } from './Auth';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">World Game</h1>
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
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center">
          {user ? `Welcome, ${user.username}!` : 'Welcome, Guest!'}
        </h2>
      </main>
    </div>
  );
}