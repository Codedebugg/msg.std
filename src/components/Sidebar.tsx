import React, { useState } from 'react';
import { Search, UserPlus, Users, Settings, LogOut, MessageCircle, Bell } from 'lucide-react';
import { Contact, Message, User } from '../App';

interface SidebarProps {
  user: User;
  contacts: Contact[];
  activeContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
  onShowFriendRequests: () => void;
  onShowAddFriend: () => void;
  onLogout: () => void;
  messages: Message[];
  friendRequestsCount: number;
}

export function Sidebar({ 
  user, 
  contacts, 
  activeContact, 
  onContactSelect, 
  onShowFriendRequests, 
  onShowAddFriend, 
  onLogout, 
  messages,
  friendRequestsCount 
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLastMessage = (contactId: string) => {
    const contactMessages = messages.filter(m => m.contactId === contactId);
    return contactMessages[contactMessages.length - 1];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Messages</h1>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onShowFriendRequests}
              className="relative p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Users className="w-5 h-5" />
              {friendRequestsCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {friendRequestsCount}
                </div>
              )}
            </button>
            <button 
              onClick={onShowAddFriend}
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-full transition-colors"
            >
              <UserPlus className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No contacts yet</p>
            <p className="text-sm text-gray-500">Add friends to start chatting!</p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const lastMessage = getLastMessage(contact.id);
            const isActive = activeContact?.id === contact.id;
            
            return (
              <div
                key={contact.id}
                onClick={() => onContactSelect(contact)}
                className={`p-4 cursor-pointer border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                  isActive ? 'bg-gray-700 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={contact.avatar} 
                      alt={contact.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {contact.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">
                        {contact.username}
                      </h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-400">
                          {formatTime(lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate">
                        {lastMessage 
                          ? lastMessage.type === 'text' 
                            ? lastMessage.content 
                            : `📎 ${lastMessage.type}`
                          : contact.status === 'online' 
                            ? 'Online' 
                            : `Last seen ${contact.lastSeen}`
                        }
                      </p>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}