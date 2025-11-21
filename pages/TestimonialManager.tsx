import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../App';
import { Check, X, Trash2 } from 'lucide-react';
import { UserRole } from '../types';

export default function TestimonialManager() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState(api.getTestimonials());

  const handleAction = (id: string, approve: boolean) => {
    api.approveTestimonial(id, approve);
    setTestimonials(api.getTestimonials());
  };

  // Filter logic based on role
  const filtered = testimonials.filter(t => {
    if (user?.role === UserRole.HOD) {
      return t.departmentId === user.departmentId; // HOD sees only their dept
    }
    return true; // Admin/Principal see all
  });

  const pending = filtered.filter(t => !t.isApproved);
  const approved = filtered.filter(t => t.isApproved);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4 text-amber-600">Pending Approval</h2>
        {pending.length === 0 ? (
           <p className="text-gray-500 italic">No pending testimonials.</p>
        ) : (
          <div className="grid gap-4">
            {pending.map(t => (
              <div key={t.id} className="border rounded-lg p-4 flex justify-between items-start bg-amber-50">
                <div>
                  <p className="text-gray-800 italic">"{t.text}"</p>
                  <p className="text-sm font-bold mt-2">{t.alumniName}</p>
                  <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {user?.role === UserRole.ADMIN && ( // Only Admin approves for now
                    <button onClick={() => handleAction(t.id, true)} className="p-2 bg-green-200 text-green-800 rounded hover:bg-green-300">
                        <Check size={16} />
                    </button>
                  )}
                  <button onClick={() => handleAction(t.id, false)} className="p-2 bg-red-200 text-red-800 rounded hover:bg-red-300">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4 text-green-700">Approved Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-4">
            {approved.map(t => (
              <div key={t.id} className="border rounded-lg p-4 bg-white">
                <p className="text-gray-600 italic">"{t.text}"</p>
                <p className="text-sm font-bold mt-2 text-gray-900">{t.alumniName}</p>
                <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}