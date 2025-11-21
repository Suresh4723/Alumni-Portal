import React, { useState } from 'react';
import { api } from '../services/api';
import { Plus } from 'lucide-react';

export default function DepartmentManagement() {
  const [depts, setDepts] = useState(api.getDepartments());
  const [name, setName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      api.createDepartment(name);
      setDepts(api.getDepartments());
      setName('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Department Management</h2>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-8">
        <input 
          type="text" 
          placeholder="New Department Name (e.g. Civil Engineering)" 
          className="flex-1 border rounded-lg px-4 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Add
        </button>
      </form>

      <div className="space-y-3">
        {depts.map(d => (
          <div key={d.id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
            <span className="font-medium text-gray-800">{d.name}</span>
            <span className="text-xs text-gray-400">ID: {d.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}