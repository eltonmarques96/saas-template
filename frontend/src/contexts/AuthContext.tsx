import api from "@/services/api";
import { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  profilePhone?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextsaas.token": token } = parseCookies();
    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
    reloadUserData();
  }, []);

  async function reloadUserData() {
    try {
      const response = await api.get("auth/profile");
      if (response) {
        const { user, token } = response.data;
        setCookie(undefined, "nextsaas.token", token, {
          maxAge: 60 * 60 * 24 * 1, // 1 day
        });
        setUser(user);
      } else {
        throw new Error("errrrrror");
      }
    } catch (err) {
      setUser(null);
      api.defaults.headers["Authorization"] = ``;
      destroyCookie(null, "nextsaas.token");
      router.push("/login");
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      setCookie(undefined, "nextsaas.token", token, {
        maxAge: 60 * 60 * 24 * 1, // 1 day
      });
      setUser(user);

      router.push("/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      setUser(null);
    }
  }
  async function logout(): Promise<void> {
    destroyCookie(null, "nextsaas.token");
    setUser(null);
    api.defaults.headers["Authorization"] = ``;
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
