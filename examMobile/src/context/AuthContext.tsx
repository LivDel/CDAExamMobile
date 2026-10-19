/**
 * Contexte d'authentification pour gérer la session utilisateur
 * Simple, lisible, utilise React Context API
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { storageService, DEFAULT_USER } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Chargement initial de la session
  useEffect(() => {
    async function loadUser() {
      const storedUser = await storageService.getUser();
      // Si aucun utilisateur n'existe encore, on connecte par défaut Camille pour faciliter la démo
      if (storedUser) {
        setUser(storedUser);
      } else {
        await storageService.saveUser(DEFAULT_USER);
        setUser(DEFAULT_USER);
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Authentification simplifiée sans backend réel (exigence du cahier des charges)
    const activeUser: User = {
      id: user?.id || 'user-' + Date.now(),
      name: user?.name || email.split('@')[0] || 'Camille Martin',
      email: email.trim().toLowerCase(),
    };
    await storageService.saveUser(activeUser);
    setUser(activeUser);
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
    await storageService.saveUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await storageService.removeUser();
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider');
  }
  return context;
};
