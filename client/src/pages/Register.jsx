import Navbar from '../components/Navbar';
import RegisterForm from '../components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <RegisterForm />
    </div>
  );
}