/* eslint-disable react-hooks/exhaustive-deps */
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

interface AuthContextData {
  user: UserTypes | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  reloadUserData: () => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  deleteOffice: (officeId: string) => Promise<void>;
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
    const { "simulaia.token": token } = parseCookies();
    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      reloadUserData();
    }
  }, []);

  async function reloadUserData() {
    try {
      setLoading(true);
      const response = await api.get("auth/profile");
      if (response) {
        const { user, token } = response.data;
        setCookie(undefined, "simulaia.token", token, {
          maxAge: 60 * 60 * 24 * 1,
          path: "/",
        });
        setUser(user);
      } else {
        throw new Error("errrrrror");
      }
    } catch {
      setUser(null);
      api.defaults.headers["Authorization"] = ``;
      destroyCookie(null, "simulaia.token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const hashedPassword = md5(password);
      const response = await api.post("/auth/login", {
        email,
        password: hashedPassword,
      });
      const { token, user } = response.data;
      setCookie(undefined, "simulaia.token", token, {
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
      });
      setUser(user);

      router.push("/dashboard");
    } catch {
      alert("Erro ao realizar login");
      setUser(null);
    }
  }

  async function logout(): Promise<void> {
    destroyCookie(null, "simulaia.token", { path: "/" });
    destroyCookie(null, "simulaia.token", { path: "/dashboard" });
    setUser(null);
    api.defaults.headers["Authorization"] = ``;
    router.push("/login");
  }

  async function deleteDocument(documentId: string) {
    try {
      setLoading(true);
      await api.delete(`/documents/${documentId}`);
      toast("Documento deletado com sucesso");
      await reloadUserData();
    } catch (error) {
      alert("Falha ao deletar documento");
      console.error("Error deleting document:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteOffice(officeId: string) {
    try {
      await api.delete(`/offices/${officeId}`);
      toast("Escritório deletado com sucesso");
      await reloadUserData();
    } catch {
      alert("Falha ao deletar escritório");
    }
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
        deleteDocument,
        deleteOffice,
      }}
    >
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
