"use client";

import api from "@/services/api";
import { useEffect } from "react";

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
          const response = await api.get("/user/verify" + `?token=${token}`);
          if (response.status === 200) {
            alert("Token verificado com sucesso");
          } else {
            alert("Falha na verificação do token");
          }
          window.location.href = "/login";
        } catch {
          alert("Erro ao verificar o token");
        }
      }
    }
    verifyToken();
  }, []);
  return (
    <div className="hold-transition login-page" style={{ minHeight: "100vh" }}>
      <h1>User Verified</h1>
    </div>
  );
}
