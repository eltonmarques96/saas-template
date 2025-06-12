"use client";

import { AppRootLayout } from "@/components/app-root-layout";
import api from "@/services/api";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Verify() {
  function getTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("token");
  }

  useEffect(() => {
    async function verifyToken() {
      const token = getTokenFromUrl();
      if (token) {
        try {
          const response = await api.put("/users/verify" + `?token=${token}`);
          if (response.status === 200) {
            toast("Token verificado com sucesso");
          } else {
            toast("Erro ao verificar token", {
              description: "Por favor, tente novamente.",
            });
          }
          window.location.href = "/login";
        } catch {
          toast("Erro ao verificar token", {
            description: "Por favor, tente novamente.",
          });
        }
      }
    }
    verifyToken();
  }, []);
  return (
    <AppRootLayout>
      <div style={{ minHeight: "100vh" }}>
        <h1>Usuário Verificado</h1>
      </div>
    </AppRootLayout>
  );
}
