import api from "@/services/api";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import md5 from "md5";
import Link from "next/link";
import { toast } from "sonner";
import { AppRootLayout } from "@/components/app-root-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Senhas não sao iguais");
      return;
    }

    if (!token) {
      setError("Token invalido");
      return;
    }

    try {
      const payload = {
        newPassword: md5(password),
        token,
      };

      if (password.length < 8) {
        setError("A senha deve ter no minino 8 caracteres");
        return;
      }

      const response = await api.post("/users/resetpassword", payload);
      if (response.status !== 200) {
        const data = await response.data();
        throw new Error(data.message || "Falha ao registrar conta");
      } else {
        toast("Senha alterada com sucesso");
      }
      router.push("/login");
    } catch {
      toast("Houve um erro ao alterar uma senha");
    }
  };

  return (
    <AppRootLayout>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset de Senha</CardTitle>
            <CardDescription>Insira a sua nova senha</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      className="form-control"
                      placeholder="Senha"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && error}
                  <div className="grid gap-2">
                    <Label htmlFor="password-confirmation">
                      Confirmação de Senha
                    </Label>
                    <Input
                      id="password-confirmation"
                      type="password"
                      className="form-control"
                      placeholder="Confirme a senha"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Resetar Senha
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-4 text-center text-sm underline underline-offset-4">
              <Link href="/login">Retornar ao login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppRootLayout>
  );
}
