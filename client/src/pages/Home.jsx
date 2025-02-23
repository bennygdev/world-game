import { useAuth } from '../hooks/Auth';
import Navbar from '../components/Navbar';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center">
          {user ? `Welcome, ${user.username}!` : 'Welcome, Guest!'}
        </h2>
      </main>
    </div>
  );
}