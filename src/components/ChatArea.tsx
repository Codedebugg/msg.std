import React, { useState, useRef, useEffect } from 'react';
import { Send, Video, Phone, MoreVertical, Paperclip, Smile, Mic } from 'lucide-react';
import { Contact, Message, User } from '../App';

interface ChatAreaProps {
  user: User;
  contact: Contact;
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'image' | 'file' | 'voice') => void;
  onVideoCall: () => void;
  onMarkAsRead: () => void;
}

export function ChatArea({ user, contact, messages, onSendMessage, onVideoCall, onMarkAsRead }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    onMarkAsRead();
  }, [messages, onMarkAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), 'text');
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      {/* Chat Header */}
      <div className="p-4 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={contact.avatar} 
              alt={contact.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            {contact.status === 'online' && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-white">{contact.username}</h2>
            <p className="text-sm text-gray-400">
              {contact.status === 'online' ? 'Online' : `Last seen ${contact.lastSeen}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={onVideoCall}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-full transition-colors"
          >
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sent
                    ? 'bg-green-600 text-white rounded-br-sm'
                    : 'bg-gray-700 text-white rounded-bl-sm'
                }`}
              >
                {message.type === 'text' ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm">{message.fileName || 'File'}</span>
                  </div>
                )}
                
                <div className={`flex items-center justify-end space-x-1 mt-1 ${
                  message.sent ? 'text-green-200' : 'text-gray-400'
                }`}>
                  <span className="text-xs">{formatTime(message.timestamp)}</span>
                  {message.sent && (
                    <div className="flex space-x-1">
                      <div className={`w-3 h-3 ${message.delivered ? 'text-green-300' : 'text-green-400'}`}>
                        ✓
                      </div>
                      {message.read && (
                        <div className="w-3 h-3 text-green-300">✓</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 pr-12 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          
          {newMessage.trim() ? (
            <button
              type="submit"
              className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="button"
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}