import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('cl_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        console.error("Invalid session data");
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    // In a real app, verify password. Here we mock it.
    const usersRaw = localStorage.getItem('cl_users');
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('cl_session', JSON.stringify(foundUser));
      return foundUser;
    }
    return null;
  };

  const signup = (name: string, email: string, role: 'student' | 'teacher') => {
    const usersRaw = localStorage.getItem('cl_users');
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    
    if (users.find(u => u.email === email)) {
      throw new Error("Email already exists");
    }

    const newUser: User = { id: Date.now().toString(), name, email, role };
    users.push(newUser);
    localStorage.setItem('cl_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('cl_session', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cl_session');
    window.location.href = '/'; // Hard reload to clear states
  };

  return { user, loading, login, signup, logout };
}
