import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, AuditLogEntry, UserRole, AllegianceHouse } from '../types';

interface CreateUserPayload {
  username: string;
  callSign: string;
  email: string;
  password: string;
  role: UserRole;
  house: AllegianceHouse;
  clearanceLevel: number;
  notes?: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  auditLogs: AuditLogEntry[];
  isModerator: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  createUser: (payload: CreateUserPayload) => { success: boolean; error?: string; user?: UserAccount };
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => { success: boolean; error?: string };
  resetUserPassword: (userId: string, newPassword: string) => { success: boolean; error?: string };
  deleteUser: (userId: string) => { success: boolean; error?: string };
}

const STORAGE_USERS_KEY = 'woc_auth_users_v4';
const STORAGE_SESSION_KEY = 'woc_auth_session_v4';
const STORAGE_AUDIT_KEY = 'woc_auth_audit_v4';

const SEED_USERS: UserAccount[] = [
  {
    id: 'usr-creator-jmodd59',
    username: 'Jmodd59',
    callSign: 'Jmodd59 (Creator)',
    email: 'jmodd59@warofcrowns.com',
    password: 'Cjm_1712',
    role: 'creator',
    house: 'valerius',
    clearanceLevel: 5,
    status: 'active',
    createdBy: 'System Root',
    createdById: 'system',
    createdAt: '2026-09-14',
    lastLoginAt: 'Never',
    notes: 'Lead Creator & Game Developer of War of Crowns on Roblox.',
  }
];

const SEED_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-14 00:00 UTC',
    moderatorName: 'System Root',
    action: 'CREATOR_INIT',
    targetUser: 'Jmodd59 (Creator)',
    details: 'Initialized primary Creator account for Jmodd59 with Level 5 Clearance.',
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some((u: UserAccount) => u.username === 'Jmodd59')) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return SEED_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AUDIT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return SEED_LOGS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const storedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed?.username === 'Jmodd59') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to save audit logs to localStorage', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  }, [currentUser]);

  const addAuditLog = (moderatorName: string, action: string, targetUser: string, details: string) => {
    const entry: AuditLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      moderatorName,
      action,
      targetUser,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const login = (identifier: string, password: string): { success: boolean; error?: string } => {
    const trimmed = identifier.trim().toLowerCase();
    const user = users.find(
      (u) => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed
    );

    if (!user) {
      return {
        success: false,
        error: 'No account found with this username or email. Remember: accounts can only be authorized by the Creator or appointed moderators.'
      };
    }

    if (user.status === 'suspended') {
      return {
        success: false,
        error: 'This account has been suspended. Contact the Creator or moderation team.'
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        error: 'Invalid security passkey or password.'
      };
    }

    const updatedUser: UserAccount = {
      ...user,
      lastLoginAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
    };

    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    setCurrentUser(updatedUser);

    addAuditLog(
      user.callSign,
      'USER_LOGIN',
      user.callSign,
      `Authorized login session established (${user.role.toUpperCase()}).`
    );

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog(
        currentUser.callSign,
        'USER_LOGOUT',
        currentUser.callSign,
        'Active session terminated.'
      );
    }
    setCurrentUser(null);
  };

  // ONLY CREATOR AND MODERATORS CAN CREATE USERS
  const createUser = (payload: CreateUserPayload): { success: boolean; error?: string; user?: UserAccount } => {
    if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'creator')) {
      return {
        success: false,
        error: 'PERMISSION DENIED: Only authorized Creator and moderators can create user accounts.'
      };
    }

    const trimmedEmail = payload.email.trim().toLowerCase();
    const trimmedUsername = payload.username.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail || u.username.toLowerCase() === trimmedUsername)) {
      return {
        success: false,
        error: 'An account with this email address or username has already been provisioned.'
      };
    }

    if (payload.password.length < 6) {
      return {
        success: false,
        error: 'Security passkey must be at least 6 characters.'
      };
    }

    const newUser: UserAccount = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      username: payload.username.trim() || payload.email.split('@')[0],
      callSign: payload.callSign.trim() || 'Commander ' + payload.username,
      email: trimmedEmail,
      password: payload.password,
      role: payload.role,
      house: payload.house,
      clearanceLevel: payload.clearanceLevel || 1,
      status: 'active',
      createdBy: currentUser.callSign,
      createdById: currentUser.id,
      createdAt: new Date().toISOString().substring(0, 10),
      notes: payload.notes || `Provisioned by ${currentUser.callSign} on ${new Date().toLocaleDateString()}`,
    };

    setUsers((prev) => [newUser, ...prev]);

    addAuditLog(
      currentUser.callSign,
      'USER_PROVISIONED',
      newUser.callSign,
      `${currentUser.role === 'creator' ? 'Creator' : 'Moderator'} created ${newUser.role} account for ${newUser.username} (${newUser.email}).`
    );

    return { success: true, user: newUser };
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended'): { success: boolean; error?: string } => {
    if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'creator')) {
      return {
        success: false,
        error: 'PERMISSION DENIED: Only authorized Creator and moderators can modify user status.'
      };
    }

    if (userId === currentUser.id && status === 'suspended') {
      return {
        success: false,
        error: 'Cannot suspend your own active session.'
      };
    }

    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, error: 'User not found.' };

    if (target.role === 'creator' && currentUser.role !== 'creator') {
      return {
        success: false,
        error: 'PERMISSION DENIED: Creator accounts cannot be modified by moderators.'
      };
    }

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));

    addAuditLog(
      currentUser.callSign,
      status === 'suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      target.callSign,
      `Account status set to ${status}.`
    );

    return { success: true };
  };

  const resetUserPassword = (userId: string, newPassword: string): { success: boolean; error?: string } => {
    if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'creator')) {
      return {
        success: false,
        error: 'PERMISSION DENIED: Only authorized Creator and moderators can reset credentials.'
      };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, error: 'User not found.' };

    if (target.role === 'creator' && currentUser.role !== 'creator') {
      return {
        success: false,
        error: 'PERMISSION DENIED: Creator credentials cannot be reset by moderators.'
      };
    }

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u)));

    addAuditLog(
      currentUser.callSign,
      'PASSWORD_RESET',
      target.callSign,
      'Security credentials updated.'
    );

    return { success: true };
  };

  const deleteUser = (userId: string): { success: boolean; error?: string } => {
    if (!currentUser || (currentUser.role !== 'moderator' && currentUser.role !== 'creator')) {
      return {
        success: false,
        error: 'PERMISSION DENIED: Only authorized Creator and moderators can delete users.'
      };
    }

    if (userId === currentUser.id) {
      return {
        success: false,
        error: 'Cannot delete your active account.'
      };
    }

    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, error: 'User not found.' };

    if (target.role === 'creator') {
      return {
        success: false,
        error: 'CANNOT DELETE: The primary Creator account cannot be deleted.'
      };
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));

    addAuditLog(
      currentUser.callSign,
      'USER_REVOKED',
      target.callSign,
      `Account permanently revoked and deleted.`
    );

    return { success: true };
  };

  const isModerator = currentUser?.role === 'moderator' || currentUser?.role === 'creator';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        auditLogs,
        isModerator,
        login,
        logout,
        createUser,
        updateUserStatus,
        resetUserPassword,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
