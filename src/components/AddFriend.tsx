import React, { useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';

interface AddFriendProps {
  onClose: () => void;
  onSendRequest: (username: string) => Promise<boolean>;
  currentUserId: string;
}

export function AddFriend({ onClose, onSendRequest, currentUserId }: AddFriendProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendRequest = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const success = await onSendRequest(searchTerm.trim());
      if (success) {
        setMessage('Friend request sent!');
        setSearchTerm('');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage('User not found or request already sent');
      }
    } catch (error) {
      setMessage('Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendRequest();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-96 border border-gray-700">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add Friend</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {message && (
              <div className={`text-sm text-center p-2 rounded-lg ${
                message.includes('sent') 
                  ? 'text-green-400 bg-green-900/20 border border-green-800' 
                  : 'text-red-400 bg-red-900/20 border border-red-800'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Sending...' : 'Send Friend Request'}</span>
            </button>
          </form>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Enter the exact username of the person you want to add as a friend.
          </div>
        </div>
      </div>
    </div>
  );
}