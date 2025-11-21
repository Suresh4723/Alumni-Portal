import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { Check, X, Trash2, Search, Clock } from 'lucide-react';

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState(api.getUsers());
  const [filter, setFilter] = useState<'all' | 'pending'>('all');
  const [search, setSearch] = useState('');

  // Coordinators only see Pending Alumni
  const canDelete = user?.role === UserRole.ADMIN;

  const handleApprove = (id: string) => {
    api.updateUser(id, { isApproved: true });
    setUsers(api.getUsers());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      api.deleteUser(id);
      setUsers(api.getUsers());
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : !u.isApproved;
    
    // Coordinators only see Alumni in their dept or general
    if (user?.role === UserRole.COORDINATOR) {
       return matchesSearch && matchesFilter && u.role === UserRole.ALUMNI && (!u.departmentId || u.departmentId === user.departmentId);
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold">User Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
           </div>
           <select 
            className="border rounded-lg px-4 py-2" 
            value={filter} 
            onChange={(e: any) => setFilter(e.target.value)}
           >
             <option value="all">All Users</option>
             <option value="pending">Pending Approval</option>
           </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Name</th>
              <th className="p-4 font-medium text-gray-500">Role</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={u.profilePic} className="w-8 h-8 rounded-full" alt="" />
                    <div>
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    u.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' :
                    u.role === UserRole.ALUMNI ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  {u.isApproved ? (
                    <span className="text-green-600 font-medium text-sm flex items-center gap-1"><Check size={14}/> Active</span>
                  ) : (
                    <span className="text-amber-600 font-medium text-sm flex items-center gap-1"><Clock size={14}/> Pending</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {!u.isApproved && (
                      <button 
                        onClick={() => handleApprove(u.id)}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {canDelete && u.id !== user?.id && (
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No users found matching criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}