"use client";

import { AppRootLayout } from "@/components/app-root-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthContext from "@/contexts/AuthContext";
import Link from "next/link";
import { useContext, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signIn } = useContext(AuthContext);
  const { loading } = useContext(AuthContext);

  async function submitForm(event: React.FormEvent) {
    try {
      event.preventDefault();

      await signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        if ((error as import("axios").AxiosError).response?.status === 403) {
          toast("Login Realizado com sucesso");
        } else {
          toast("Erro ao realizar login", {
            description: "Por favor, tente novamente.",
          });
        }
      } else {
        toast("Erro ao editar o escritório", {
          description: "Por favor, tente novamente.",
        });
      }
    }
  }

  return (
    <AppRootLayout>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Insira o seu login e senha abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitForm}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    disabled={loading}
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Senha"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Login
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Crie aqui
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppRootLayout>
  );
}
