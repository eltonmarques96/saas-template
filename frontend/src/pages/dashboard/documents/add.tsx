import DashboardLayout from "../layout";
import { useContext, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";
import AWSService from "@/services/aws";
import AuthContext from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function DocumentAdd() {
  const router = useRouter();
  const { user, reloadUserData } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB

    if (!allowedTypes.includes(file.type)) {
      setMessage("Somente arquivo docx e PDF são permitidos");
      setDocumentFile(null);
      return;
    }

    if (file.size > maxSizeInBytes) {
      setMessage("Não é permitido arquivos acima de 3Mb");
      setDocumentFile(null);
      return;
    }

    setDocumentFile(file);
    setMessage("");
    if (fileURL) {
      URL.revokeObjectURL(fileURL);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
    }
  };

  async function createDocument(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!documentFile) {
        setMessage("Por favor, selecione um documento");
        return;
      }

      const awsInstance = AWSService.Instance;
      const preSignedURL = await awsInstance.generatePreSignedURL(
        documentFile,
        user!.id
      );
      if (!preSignedURL) {
        throw new Error("Erron on get pre signed URL");
      }
      const putResult = await awsInstance.uploadFileToAWS(
        preSignedURL,
        documentFile
      );
      if (!putResult) {
        throw new Error("Error on upload file to AWS");
      }
      await api.post("/documents", {
        name,
        type: "documento",
        address: preSignedURL,
      });

      toast("Documento criado com Sucesso");
      await reloadUserData();
      router.push("/dashboard/documents");
    } catch {
      toast("Erro ao criar Documento", {
        description: "Por favor, tente novamente.",
      });
    }
  }

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Crie um documento</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => createDocument(e)}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="documentName">
                        Nome do Documento <span>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="documentName"
                        className="form-control"
                        minLength={3}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        title="Informe o nome do documento"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="logo">Documento</Label>
                      <Input
                        type="file"
                        id="file"
                        accept=".pdf,.docx"
                        className="form-control"
                        onChange={handleFileChange}
                        title="Adicione aqui o documento a ser importado"
                      />
                    </div>
                    {message && <p className="text-red-500">{message}</p>}

                    <div className="grid gap-2">
                      <div className="row">
                        <Button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setName("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="btn btn-success float-right"
                        >
                          Salvar Documento
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

DocumentAdd.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DocumentAdd;
