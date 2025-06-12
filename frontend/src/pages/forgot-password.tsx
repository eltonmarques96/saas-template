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
import api from "@/services/api";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users/forgotpassword", {
        email,
      });
      toast("Link com reset de senha enviado para o seu e-mail");
    } catch {
      toast("Erro ao resetar sua senha", {
        description: "Por favor, tente novamente.",
      });
    }
  };

  return (
    <AppRootLayout>
      <div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Resete a sua senha</CardTitle>
            <CardDescription>Insira o seu e-mail abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="password">E-Mail</Label>
                  <Input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope"></span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                onClick={(event) => submitForm(event)}
              >
                Resetar senha
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="underline underline-offset-4">
                Retornar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppRootLayout>
  );
}
