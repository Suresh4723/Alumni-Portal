import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Landing() {
  const testimonials = api.getTestimonials().filter(t => t.isApproved).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">JNTUGV Alumni</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Join Network</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative bg-blue-50 pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Connect with your</span>
            <span className="block text-primary">Alma Mater</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            The official alumni portal for JNTU-GV. Reconnect with classmates, mentor juniors, and stay updated with university news.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/register" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 md:py-4 md:text-lg">
              Get Started
            </Link>
            <Link to="/login" className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Alumni Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.id} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <p className="text-gray-600 italic mb-4">"{t.text}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold">
                    {t.alumniName[0]}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-gray-900">{t.alumniName}</p>
                    <p className="text-xs text-gray-500">Alumni</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 JNTU-GV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}