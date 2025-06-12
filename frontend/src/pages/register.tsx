"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import md5 from "md5";
import Link from "next/link";
import { AppRootLayout } from "@/components/app-root-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (form.password !== form.passwordConfirm) {
        setError("Senhas nao sao iguais");
        return;
      }

      if (form.password.length < 8) {
        setError("A senha deve ter no minino 8 caracteres");
        return;
      }

      const hashedPassword = md5(form.password);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: hashedPassword,
      };

      const response = await api.post("/users", payload);

      if (response.status !== 201) {
        const data = await response.data();
        throw new Error(data.message || "Falha ao criar conta");
      } else {
        toast(
          "Sua conta criada. Por favor, olhe sua conta de email para verificar sua conta."
        );
      }

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Um erro inesperado aconteceu");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppRootLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Seja bem vindo</CardTitle>
          <CardDescription>Crie sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Primeiro Nome</Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Primeiro Nome"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Sobrenome"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    type="email"
                    className="form-control"
                    placeholder="E-mail"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Senha</Label>
                  <Input
                    type="password"
                    className="form-control"
                    placeholder="Senha"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Confirmação de Senha</Label>
                  <Input
                    type="password"
                    className="form-control"
                    placeholder="Confirmar Senha"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Criar Conta
                </Button>
              </div>
              {error ? <p>{error}</p> : <></>}
              <div className="text-center text-sm">
                Já possui uma conta?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Faça o login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppRootLayout>
  );
}
