import api from "@/services/api";
import { UserTypes } from "@/types/User";
import { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import md5 from "md5";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface AuthContextData {
  user: UserTypes | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  reloadUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserTypes | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { adminsimulaia: token } = parseCookies();
    if (token) {
      //api.defaults.headers["Authorization"] = `Bearer ${token}`;
      //reloadUserData();
    }
  }, []);

  async function reloadUserData() {
    try {
      setLoading(true);
      const response = await api.get("auth/profile");
      if (response) {
        const { user, token } = response.data;
        setCookie(undefined, "adminsimulaia", token, {
          maxAge: 60 * 60 * 24 * 1,
          path: "/",
        });
        setUser(user);
      } else {
        throw new Error("Erro na autenticação");
      }
    } catch {
      setUser(null);
      api.defaults.headers["Authorization"] = ``;
      destroyCookie(null, "adminsimulaia");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const hashedPassword = md5(password);
      const response = await api.post("/login", {
        email,
        password: hashedPassword,
      });
      const { token, user } = response.data;
      setCookie(undefined, "adminsimulaia", token, {
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
      });
      setUser(user);

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        toast("Erro ao realizar login", {
          description: err.response?.data.message,
        });
      } else {
        toast("Erro ao realizar login", {
          description: "Por favor, tente novamente",
        });
      }
      await logout();
    }
  }

  async function logout(): Promise<void> {
    destroyCookie(null, "adminsimulaia", { path: "/" });
    destroyCookie(null, "adminsimulaia", { path: "/dashboard" });
    setUser(null);
    api.defaults.headers["Authorization"] = ``;
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        loading,
        logout,
        user,
        reloadUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Erro ao autenticar");
  }
  return context;
};

export default AuthContext;
