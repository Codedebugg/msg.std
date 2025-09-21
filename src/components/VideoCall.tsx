import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from 'lucide-react';
import { Contact } from '../App';

interface VideoCallProps {
  contact: Contact;
  onEndCall: () => void;
}

export function VideoCall({ contact, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col ${isFullscreen ? '' : 'bottom-4 right-4 w-80 h-60 rounded-lg'}`}>
      {/* Video Areas */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {!isVideoOff ? (
            <img 
              src={contact.avatar} 
              alt={contact.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-600">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg">
          <div className="w-full h-full bg-gradient-to-br from-green-700 to-blue-700 flex items-center justify-center">
            {!isVideoOff ? (
              <div className="w-8 h-8 bg-white rounded-full"></div>
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Call Info */}
        <div className="absolute top-4 left-4 text-white">
          <h2 className="text-xl font-semibold">{contact.username}</h2>
          <p className="text-sm opacity-80">{formatCallDuration(callDuration)}</p>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 p-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black bg-opacity-90">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full transition-colors ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          <button
            onClick={onEndCall}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}