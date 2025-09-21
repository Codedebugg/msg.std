import { useState, useEffect } from 'react';
import { Contact, Message, FriendRequest, User } from '../App';

export function useMessaging(currentUserId?: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Mock users database for friend search
  const mockUsers: User[] = [
    {
      id: 'user1',
      username: 'alice_student',
      email: 'alice@student.edu',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'online'
    },
    {
      id: 'user2',
      username: 'bob_learns',
      email: 'bob@student.edu',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'away'
    },
    {
      id: 'user3',
      username: 'charlie_dev',
      email: 'charlie@student.edu',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'offline',
      lastSeen: '2 hours ago'
    },
    {
      id: 'user4',
      username: 'diana_code',
      email: 'diana@student.edu',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'online'
    },
    {
      id: 'user5',
      username: 'evan_study',
      email: 'evan@student.edu',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'away'
    }
  ];

  useEffect(() => {
    if (currentUserId) {
      // Load user's data from localStorage or initialize empty
      const storedContacts = localStorage.getItem(`contacts_${currentUserId}`);
      const storedMessages = localStorage.getItem(`messages_${currentUserId}`);
      const storedRequests = localStorage.getItem(`friendRequests_${currentUserId}`);

      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      }
      if (storedRequests) {
        const parsedRequests = JSON.parse(storedRequests);
        const requestsWithDates = parsedRequests.map((req: any) => ({
          ...req,
          timestamp: new Date(req.timestamp)
        }));
        setFriendRequests(requestsWithDates);
      }
    }
  }, [currentUserId]);

  const saveToStorage = (key: string, data: any) => {
    if (currentUserId) {
      localStorage.setItem(`${key}_${currentUserId}`, JSON.stringify(data));
    }
  };

  const sendMessage = (contactId: string, content: string, type: 'text' | 'image' | 'file' | 'voice') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      contactId,
      content,
      timestamp: new Date(),
      sent: true,
      delivered: false,
      read: false,
      type
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveToStorage('messages', updatedMessages);

    // Simulate message delivery and auto-reply
    setTimeout(() => {
      const deliveredMessages = updatedMessages.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, delivered: true }
          : msg
      );
      setMessages(deliveredMessages);
      saveToStorage('messages', deliveredMessages);

      // Auto-reply simulation
      setTimeout(() => {
        const replies = [
          'Thanks for the message!',
          'Got it! 👍',
          'Sure, let me check that.',
          'Sounds good!',
          'I\'ll get back to you soon.',
        ];
        
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          contactId,
          content: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date(),
          sent: false,
          delivered: true,
          read: false,
          type: 'text'
        };

        const finalMessages = [...deliveredMessages, autoReply];
        setMessages(finalMessages);
        saveToStorage('messages', finalMessages);

        // Update unread count
        const updatedContacts = contacts.map(contact =>
          contact.id === contactId
            ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
            : contact
        );
        setContacts(updatedContacts);
        saveToStorage('contacts', updatedContacts);
      }, 2000);
    }, 1000);
  };

  const markAsRead = (contactId: string) => {
    const updatedMessages = messages.map(msg =>
      msg.contactId === contactId && !msg.sent
        ? { ...msg, read: true }
        : msg
    );
    setMessages(updatedMessages);
    saveToStorage('messages', updatedMessages);

    const updatedContacts = contacts.map(contact =>
      contact.id === contactId
        ? { ...contact, unreadCount: 0 }
        : contact
    );
    setContacts(updatedContacts);
    saveToStorage('contacts', updatedContacts);
  };

  const sendFriendRequest = async (username: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const targetUser = mockUsers.find(u => u.username === username && u.id !== currentUserId);
    if (!targetUser) return false;

    // Check if already friends or request exists
    const isAlreadyFriend = contacts.some(c => c.id === targetUser.id);
    const requestExists = friendRequests.some(r => 
      r.fromUser.id === currentUserId && r.toUserId === targetUser.id
    );

    if (isAlreadyFriend || requestExists) return false;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      fromUser: currentUser,
      toUserId: targetUser.id,
      status: 'pending',
      timestamp: new Date()
    };

    const updatedRequests = [...friendRequests, newRequest];
    setFriendRequests(updatedRequests);
    saveToStorage('friendRequests', updatedRequests);

    return true;
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;

    // Add to contacts
    const newContact: Contact = {
      ...request.fromUser,
      unreadCount: 0
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveToStorage('contacts', updatedContacts);

    // Update request status
    const updatedRequests = friendRequests.map(r =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    );
    setFriendRequests(updatedRequests);
    saveToStorage('friendRequests', updatedRequests);
  };

  const rejectFriendRequest = (requestId: string) => {
    const updatedRequests = friendRequests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    );
    setFriendRequests(updatedRequests);
    saveToStorage('friendRequests', updatedRequests);
  };

  return {
    contacts,
    messages,
    friendRequests,
    sendMessage,
    markAsRead,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
  };
}