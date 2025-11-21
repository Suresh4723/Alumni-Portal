import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../App';
import { Thread, UserRole } from '../types';
import { MessageSquare, Plus, Send, User as UserIcon } from 'lucide-react';

export default function Forum() {
  const { user } = useAuth();
  const [threads, setThreads] = useState(api.getThreads());
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  // Only Alumni, HOD, Coord can create threads
  const canCreate = user && [UserRole.ALUMNI, UserRole.HOD, UserRole.COORDINATOR].includes(user.role);
  // Principal/Admin read-only replies? Prompt says "All roles (except principal/admin) can reply"
  const canReply = user && [UserRole.ALUMNI, UserRole.HOD, UserRole.COORDINATOR].includes(user.role);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newThreadTitle.trim()) {
      api.createThread(newThreadTitle, user);
      setThreads(api.getThreads());
      setNewThreadTitle('');
      setShowCreate(false);
    }
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && selectedThread && replyText.trim()) {
      api.replyToThread(selectedThread.id, replyText, user);
      setThreads(api.getThreads()); // Refresh list
      // Refresh selected thread reference
      const updated = api.getThreads().find(t => t.id === selectedThread.id);
      if (updated) setSelectedThread(updated);
      setReplyText('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Thread List */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">Discussions</h2>
          {canCreate && (
            <button onClick={() => setShowCreate(!showCreate)} className="p-2 bg-white border rounded-md hover:bg-gray-100 text-primary">
              <Plus size={20} />
            </button>
          )}
        </div>
        
        {showCreate && (
          <form onSubmit={handleCreate} className="p-4 border-b bg-blue-50">
             <input
              type="text"
              placeholder="Topic title..."
              className="w-full border p-2 rounded mb-2"
              value={newThreadTitle}
              onChange={e => setNewThreadTitle(e.target.value)}
              autoFocus
             />
             <button type="submit" className="w-full bg-primary text-white py-1 rounded text-sm">Start Thread</button>
          </form>
        )}

        <div className="flex-1 overflow-y-auto">
          {threads.map(t => (
            <div 
              key={t.id}
              onClick={() => setSelectedThread(t)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedThread?.id === t.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''}`}
            >
              <h3 className="font-bold text-gray-900 text-sm mb-1">{t.title}</h3>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{t.createdByName}</span>
                <div className="flex items-center gap-1">
                   <MessageSquare size={12} /> {t.messages.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thread Content */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border flex flex-col h-full">
        {selectedThread ? (
          <>
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-gray-900">{selectedThread.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Started by {selectedThread.createdByName} on {new Date(selectedThread.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {selectedThread.messages.length === 0 ? (
                <p className="text-center text-gray-400 italic">No replies yet. Be the first!</p>
              ) : (
                selectedThread.messages.map((msg, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon size={14} className="text-gray-600"/>
                      </div>
                      <span className="font-bold text-sm text-gray-800">{msg.senderName}</span>
                      <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            {canReply ? (
              <form onSubmit={handleReply} className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Send size={20} />
                  </button>
                </div>
              </form>
            ) : (
                <div className="p-4 border-t bg-gray-100 text-center text-sm text-gray-500">
                    Login as Alumni, HOD, or Coordinator to reply.
                </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p>Select a thread to view discussions</p>
          </div>
        )}
      </div>
    </div>
  );
}