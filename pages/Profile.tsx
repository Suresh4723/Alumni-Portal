import React, { useState } from 'react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { UserRole } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const [testimonial, setTestimonial] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!user) return null;

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (testimonial.trim()) {
      api.addTestimonial(user.id, user.name, user.departmentId, testimonial);
      setTestimonial('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <img src={user.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-100" />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 font-medium">{user.role} {user.departmentId && `• Dept ID: ${user.departmentId}`}</p>
          <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="bg-gray-50 px-4 py-2 rounded border">
                <span className="text-xs text-gray-500 block">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
             </div>
             <div className="bg-gray-50 px-4 py-2 rounded border">
                <span className="text-xs text-gray-500 block">Joined</span>
                <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Alumni Only: Submit Testimonial */}
      {user.role === UserRole.ALUMNI && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Share Your Story</h2>
          <p className="text-gray-600 text-sm mb-4">Submit a testimonial about your experience at JNTUGV. It will be reviewed by the admin before appearing on the homepage.</p>
          
          <form onSubmit={handleSubmitTestimonial}>
            <textarea 
              className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-primary focus:outline-none"
              rows={4}
              placeholder="Write your testimonial here..."
              value={testimonial}
              onChange={e => setTestimonial(e.target.value)}
            />
            <div className="mt-4 flex justify-between items-center">
              {submitted ? <span className="text-green-600 font-medium">Submitted for review!</span> : <span></span>}
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}