import React from 'react';
import { X, Check, UserX } from 'lucide-react';
import { FriendRequest } from '../App';

interface FriendRequestsProps {
  requests: FriendRequest[];
  onClose: () => void;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function FriendRequests({ requests, onClose, onAccept, onReject }: FriendRequestsProps) {
  const pendingRequests = requests.filter(req => req.status === 'pending');

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-96 max-h-96 flex flex-col border border-gray-700">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Friend Requests</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto p-2">
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center">
              <UserX className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No pending friend requests</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={request.fromUser.avatar} 
                    alt={request.fromUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{request.fromUser.username}</h3>
                    <p className="text-sm text-gray-400">{formatTime(request.timestamp)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAccept(request.id)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onReject(request.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}