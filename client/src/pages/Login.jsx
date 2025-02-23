import Navbar from '../components/Navbar';
import LoginForm from '../components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoginForm />
    </div>
  );
}