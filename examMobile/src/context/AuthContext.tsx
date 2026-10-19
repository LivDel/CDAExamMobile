/**
 * Contexte d'authentification pour gérer la session utilisateur
 * Authentification dynamique locale avec persistance AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserAccount } from '../types/user';
import { storageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Chargement de la session existante sans connexion forcée
  useEffect(() => {
    async function initAuth() {
      // Préparer les comptes démo au premier lancement
      await storageService.getAccounts();
      const storedUser = await storageService.getUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        // L'utilisateur reste déconnecté pour afficher l'écran de connexion / inscription
        setUser(null);
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password?.trim() || '';

    const accounts = await storageService.getAccounts();
    const matchedAccount = accounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (!matchedAccount || matchedAccount.password !== cleanPassword) {
      setIsLoading(false);
      return { success: false, error: 'auth.errorInvalidCredentials' };
    }

    const sessionUser: User = {
      id: matchedAccount.id,
      name: matchedAccount.name,
      email: matchedAccount.email,
    };

    await storageService.saveUser(sessionUser);
    setUser(sessionUser);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password.trim();

    const accounts = await storageService.getAccounts();
    const existing = accounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'auth.errorEmailExists' };
    }

    const newAccount: UserAccount = {
      id: 'user-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
    };

    await storageService.saveAccount(newAccount);

    const sessionUser: User = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
    };

    await storageService.saveUser(sessionUser);
    setUser(sessionUser);
    setIsLoading(false);
    return { success: true };
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
