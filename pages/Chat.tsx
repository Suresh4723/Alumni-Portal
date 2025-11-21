import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { User, ChatMessage, UserRole } from '../types';
import { Send, MessageSquare } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const allUsers = api.getUsers();
    
    // If HOD: See Alumni in their Dept
    if (user.role === UserRole.HOD) {
        setContacts(allUsers.filter(u => u.role === UserRole.ALUMNI && u.departmentId === user.departmentId));
    } 
    // If Alumni: See HOD of their Dept
    else if (user.role === UserRole.ALUMNI) {
        setContacts(allUsers.filter(u => u.role === UserRole.HOD && u.departmentId === user.departmentId));
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedContact) {
      const load = () => {
        setMessages(api.getMessages(user.id, selectedContact.id));
      };
      load();
      const interval = setInterval(load, 2000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [user, selectedContact]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user || !selectedContact) return;
    api.sendMessage(user.id, selectedContact.id, input);
    setMessages(api.getMessages(user.id, selectedContact.id));
    setInput('');
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Contacts List */}
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <div className="p-4 border-b bg-white">
          <h2 className="font-bold text-gray-800">Messages</h2>
        </div>
        {contacts.map(c => (
          <div 
            key={c.id} 
            onClick={() => setSelectedContact(c)}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition ${selectedContact?.id === c.id ? 'bg-blue-50 border-r-4 border-primary' : ''}`}
          >
            <img src={c.profilePic} className="w-10 h-10 rounded-full" alt="" />
            <div>
              <p className="font-bold text-sm text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-500">{c.role}</p>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
            <div className="p-4 text-gray-500 text-sm text-center">No contacts found.</div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b flex items-center gap-3 bg-white shadow-sm z-10">
              <img src={selectedContact.profilePic} className="w-8 h-8 rounded-full" alt="" />
              <span className="font-bold text-gray-800">{selectedContact.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(m => {
                const isMe = m.senderId === user.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl px-4 py-2 ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none'}`}>
                      <p>{m.message}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                type="text" 
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition">
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}