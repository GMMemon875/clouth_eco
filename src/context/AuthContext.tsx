import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, IRegisterData } from '../types/auth';
import {
  fetchCurrentProfile,
  loginCustomerApi,
  loginAdminApi,
  registerCustomerApi,
  logoutApi,
  updateProfileApi,
  changePasswordApi,
  requestPasswordResetApi,
  resetPasswordApi,
  setAuthToken,
} from '../api/authApi';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginCustomer: (email: string, pass: string) => Promise<IUser>;
  loginAdmin: (email: string, pass: string) => Promise<IUser>;
  registerCustomer: (data: IRegisterData) => Promise<IUser>;
  logout: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    area?: string;
    landmark?: string;
  }) => Promise<IUser>;
  changePassword: (curr: string, next: string, confirm: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (token: string, next: string, confirm: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const profile = await fetchCurrentProfile();
        if (isMounted) {
          setUser(profile);
        }
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginCustomer = async (email: string, pass: string): Promise<IUser> => {
    const data = await loginCustomerApi(email, pass);
    setUser(data.user);
    return data.user;
  };

  const loginAdmin = async (email: string, pass: string): Promise<IUser> => {
    const data = await loginAdminApi(email, pass);
    setUser(data.user);
    return data.user;
  };

  const registerCustomer = async (formData: IRegisterData): Promise<IUser> => {
    const data = await registerCustomerApi(formData);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await logoutApi();
    setAuthToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    area?: string;
    landmark?: string;
  }): Promise<IUser> => {
    const updated = await updateProfileApi(updates);
    setUser(updated);
    return updated;
  };

  const changePassword = async (curr: string, next: string, confirm: string) => {
    await changePasswordApi(curr, next, confirm);
  };

  const requestPasswordReset = async (email: string): Promise<string> => {
    return await requestPasswordResetApi(email);
  };

  const resetPassword = async (token: string, next: string, confirm: string): Promise<string> => {
    return await resetPasswordApi(token, next, confirm);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        loginCustomer,
        loginAdmin,
        registerCustomer,
        logout,
        updateProfile,
        changePassword,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
