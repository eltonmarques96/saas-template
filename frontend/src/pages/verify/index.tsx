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
          console.log(response.status);
          if (response.status === 200) {
            alert("Token verificado com sucesso");
          } else {
            alert("Falha na verificação do token");
          }
        } catch (error) {
          console.error("Erro ao verificar o token:", error);
          alert("Erro ao verificar o token");
        } finally {
          window.location.href = "/";
        }
      }
    }
    verifyToken();
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Verify user</h1>
    </div>
  );
}
