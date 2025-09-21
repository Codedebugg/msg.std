import { useState, useEffect } from 'react';
import { User } from '../App';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user database
  const [users, setUsers] = useState<User[]>([
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
    }
  ]);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const generateAvatar = (username: string) => {
    const avatars = [
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser && password.length >= 6) {
      const userData = { ...foundUser, status: 'online' as const };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    }
    return null;
  };

  const register = async (username: string, email: string, password: string): Promise<User | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (users.some(u => u.email === email || u.username === username)) {
      return null;
    }

    if (password.length < 6) {
      return null;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      avatar: generateAvatar(username),
      status: 'online'
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return {
    user,
    isAuthenticated,
    users,
    login,
    register,
    logout
  };
}