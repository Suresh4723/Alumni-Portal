import React from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const users = api.getUsers();
  const testimonials = api.getTestimonials();
  const threads = api.getThreads();
  const departments = api.getDepartments();

  if (!user) return null;

  // Stats Calculation
  const totalAlumni = users.filter(u => u.role === UserRole.ALUMNI && u.isApproved).length;
  const pendingAlumni = users.filter(u => u.role === UserRole.ALUMNI && !u.isApproved).length;
  const totalThreads = threads.length;
  const myDeptAlumni = user.departmentId 
    ? users.filter(u => u.departmentId === user.departmentId && u.role === UserRole.ALUMNI).length 
    : 0;

  // Chart Data
  const deptData = departments.map(d => ({
    name: d.name.split(' ')[0], // Shorten name
    count: users.filter(u => u.departmentId === d.id && u.role === UserRole.ALUMNI).length
  }));

  const testimonialData = [
    { name: 'Approved', value: testimonials.filter(t => t.isApproved).length },
    { name: 'Pending', value: testimonials.filter(t => !t.isApproved).length },
  ];
  const COLORS = ['#0088FE', '#FFBB28'];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-500">{user.role.replace('_', ' ')} Dashboard</p>
        </div>
        {user.departmentId && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {departments.find(d => d.id === user.departmentId)?.name || 'Department'}
        </span>}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === UserRole.ALUMNI ? (
            <>
              <StatCard title="My Discussions" value={threads.filter(t => t.createdById === user.id).length} icon={MessageSquare} color="bg-blue-500" />
              <StatCard title="Dept. Alumni" value={myDeptAlumni} icon={Users} color="bg-green-500" />
            </>
        ) : (
            <>
              <StatCard title="Total Alumni" value={totalAlumni} icon={Users} color="bg-blue-600" />
              {user.role !== UserRole.PRINCIPAL && <StatCard title="Pending Requests" value={pendingAlumni} icon={Clock} color="bg-amber-500" />}
              <StatCard title="Discussions" value={totalThreads} icon={MessageSquare} color="bg-purple-500" />
              <StatCard title="Approved Stories" value={testimonials.filter(t => t.isApproved).length} icon={CheckCircle} color="bg-green-500" />
            </>
        )}
      </div>

      {/* Charts Area - Principal & Admin see aggregation */}
      {(user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN || user.role === UserRole.HOD) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Alumni Distribution by Department</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Testimonial Status</h3>
            <div className="h-64 flex justify-center">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={testimonialData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {testimonialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
             <div className="flex justify-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center"><div className="w-3 h-3 bg-[#0088FE] rounded-full mr-2"></div>Approved</div>
                <div className="flex items-center"><div className="w-3 h-3 bg-[#FFBB28] rounded-full mr-2"></div>Pending</div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}