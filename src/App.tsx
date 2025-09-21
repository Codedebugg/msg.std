import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { VideoCall } from './components/VideoCall';
import { FriendRequests } from './components/FriendRequests';
import { AddFriend } from './components/AddFriend';
import { useAuth } from './hooks/useAuth';
import { useMessaging } from './hooks/useMessaging';
import './index.css';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface Contact extends User {
  unreadCount?: number;
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: Date;
  sent: boolean;
  delivered: boolean;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
}

export interface FriendRequest {
  id: string;
  fromUser: User;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}

function App() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const { messages, contacts, friendRequests, sendMessage, markAsRead, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useMessaging(user?.id);

  const handleVideoCall = (contact: Contact) => {
    setActiveContact(contact);
    setIsVideoCallActive(true);
  };

  const handleEndCall = () => {
    setIsVideoCallActive(false);
  };

  if (!isAuthenticated || !user) {
    return <AuthScreen onLogin={login} onRegister={register} />;
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      <Sidebar 
        user={user}
        contacts={contacts}
        activeContact={activeContact}
        onContactSelect={setActiveContact}
        onShowFriendRequests={() => setShowFriendRequests(true)}
        onShowAddFriend={() => setShowAddFriend(true)}
        onLogout={logout}
        messages={messages}
        friendRequestsCount={friendRequests.filter(req => req.status === 'pending').length}
      />
      
      <div className="flex-1 flex flex-col">
        {activeContact ? (
          <ChatArea
            user={user}
            contact={activeContact}
            messages={messages.filter(m => m.contactId === activeContact.id)}
            onSendMessage={(content, type) => sendMessage(activeContact.id, content, type)}
            onVideoCall={() => handleVideoCall(activeContact)}
            onMarkAsRead={() => markAsRead(activeContact.id)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-green-900 to-blue-900 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-700">
                  <span className="text-4xl">💬</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Student Messenger</h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Connect with your classmates through instant messaging and video calls. 
                Add friends and select a contact to start chatting!
              </p>
            </div>
          </div>
        )}
      </div>

      {isVideoCallActive && activeContact && (
        <VideoCall 
          contact={activeContact}
          onEndCall={handleEndCall}
        />
      )}

      {showFriendRequests && (
        <FriendRequests 
          requests={friendRequests}
          onClose={() => setShowFriendRequests(false)}
          onAccept={acceptFriendRequest}
          onReject={rejectFriendRequest}
        />
      )}

      {showAddFriend && (
        <AddFriend 
          onClose={() => setShowAddFriend(false)}
          onSendRequest={sendFriendRequest}
          currentUserId={user.id}
        />
      )}
    </div>
  );
}

export default App;