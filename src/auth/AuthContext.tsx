import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5089";
const TOKEN_STORAGE_KEY = "ourlibrary_token";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );

  const login = useCallback(async (password: string) => {
    const response = await fetch(`${API_URL}/v1/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// For attaching the token to fetch calls made outside a component (or where
// re-rendering on auth change isn't needed) without threading it through props.
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
