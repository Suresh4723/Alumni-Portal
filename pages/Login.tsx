import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, pass);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials or account not approved.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">JNTUGV Alumni Portal</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition">
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
        </div>
        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>Demo Admin: admin@jntugv.edu / admin</p>
          <p>Demo Alumni: alumni@gmail.com / admin</p>
        </div>
      </div>
    </div>
  );
}