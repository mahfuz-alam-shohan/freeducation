import type { DeviceType } from "../core/types/layout";
import type { AdminSession } from "../core/security/session";
import type { User, UserRole } from "../data/models";

// Custom hooks for common operations

export const useDeviceDetection = (userAgent: string | null): DeviceType => {
  const agent = userAgent?.toLowerCase() ?? "";
  if (/mobi|android|iphone|ipod/.test(agent)) {
    return "mobile";
  }
  if (/tablet|ipad/.test(agent)) {
    return "tablet";
  }
  return "desktop";
};

export const useAuth = (session: AdminSession | null) => {
  return {
    isAuthenticated: !!session,
    user: session,
    isAdmin: session?.email?.endsWith("@gmail.com") ?? false,
  };
};

export const useUserPermissions = (user: User | null) => {
  return {
    canManageUsers: user?.role === "admin",
    canManageContent: ["admin", "teacher"].includes(user?.role ?? ""),
    canViewContent: !!user,
    isStudent: user?.role === "student",
    isTeacher: user?.role === "teacher",
    isAdmin: user?.role === "admin",
  };
};

export const useValidation = () => {
  const validateEmail = (email: string): boolean => {
    return email.endsWith("@gmail.com") && email.includes("@");
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
  };

  const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
  };

  const validateDateOfBirth = (date: string): boolean => {
    const dateObj = new Date(date);
    const now = new Date();
    const minAge = 10; // Minimum 10 years old
    const maxAge = 120; // Maximum 120 years old
    
    return !isNaN(dateObj.getTime()) && 
           dateObj <= now && 
           dateObj >= new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate()) &&
           dateObj <= new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
  };

  return {
    validateEmail,
    validatePassword,
    validateRequired,
    validateDateOfBirth,
  };
};

export const useApiError = () => {
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred.";
  };

  const isNetworkError = (error: unknown): boolean => {
    return error instanceof Error && 
           (error.message.includes("fetch") || 
            error.message.includes("network") ||
            error.message.includes("connection"));
  };

  const isValidationError = (error: unknown): boolean => {
    return error instanceof Error && 
           error.message.includes("validation") ||
           error.message.includes("required") ||
           error.message.includes("invalid");
  };

  return {
    getErrorMessage,
    isNetworkError,
    isValidationError,
  };
};

export const useLocalStorage = () => {
  const setItem = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Failed to set localStorage item:", error);
    }
  };

  const getItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("Failed to get localStorage item:", error);
      return null;
    }
  };

  const removeItem = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove localStorage item:", error);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
  };
};
