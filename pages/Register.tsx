import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { api } from '../services/api';
import { UserRole } from '../types';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const depts = api.getDepartments();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.ALUMNI, // Default
    departmentId: depts[0]?.id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
    alert('Registration successful! Please wait for Admin approval.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Join the Community</h1>
          <p className="text-gray-500">Create your alumni account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Request</label>
            <select 
              className="w-full border rounded-lg px-4 py-2"
              value={formData.role}
              onChange={(e: any) => setFormData({...formData, role: e.target.value})}
            >
              <option value={UserRole.ALUMNI}>Alumni</option>
              {/* In a real app, higher roles might be invite-only, but exposed here for demo */}
              <option value={UserRole.HOD}>HOD</option>
              <option value={UserRole.COORDINATOR}>Coordinator</option>
              <option value={UserRole.PRINCIPAL}>Principal</option>
            </select>
          </div>

          {(formData.role === UserRole.ALUMNI || formData.role === UserRole.HOD || formData.role === UserRole.COORDINATOR) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                className="w-full border rounded-lg px-4 py-2"
                value={formData.departmentId}
                onChange={e => setFormData({...formData, departmentId: e.target.value})}
              >
                {depts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition">
            Register
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}