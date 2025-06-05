import Link from "next/link";
import DashboardLayout from "../layout";
import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import { DocumentTypes } from "@/types/Document";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AWSService from "@/services/aws";

function Document() {
  const { user, deleteDocument } = useContext(AuthContext);
  async function downloadDocument(
    path: string,
    documentName: string = "Documento.pdf"
  ) {
    try {
      const awsInstance = AWSService.Instance;
      const url = await awsInstance.downloadFileFromAWS(path);
      console.log(url);
      if (url) {
        const fileResponse = await fetch(url);
        const blob = await fileResponse.blob();

        // Cria um link para download
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = documentName; // Nome sugerido para o usuário
        document.body.appendChild(link);
        link.click();
      } else {
        console.error("Erro no downlaod");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Card className="@container/card">
        <CardHeader className="relative">
          <div className="flex-row flex">
            <CardTitle>Documentos</CardTitle>
            <div
              defaultValue="outline"
              className="flex w-full flex-col justify-start gap-6"
            >
              <div className="flex items-center justify-end lg:px-6">
                <Link href="/dashboard/documents/add">
                  <Button variant="outline" size="sm">
                    <PlusIcon />
                    <span className="hidden lg:inline">
                      Adicionar documento
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <CardDescription>Gerencie seus documentos</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-1 sm:px-6 sm:pt-6">
          <Table>
            <TableCaption>Lista de Documentos</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user?.documents && user.documents.length > 0 ? (
                user.documents.map((document: DocumentTypes, index: number) => (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: "left" }}>
                      {document.name || "N/A"}
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {/* <button
                        className="btn btn-sm btn-secondary mr-2"
                        onClick={() => generateResume(document.id)}
                      >
                        Fazer Resumo
                      </button> */}
                      <Button
                        className="btn btn-sm btn-info mr-2"
                        onClick={() =>
                          downloadDocument(document.address, document.name)
                        }
                      >
                        Download
                      </Button>
                      {/* <button
                                  className="btn btn-sm btn-warning mr-2"
                                  onClick={() => {
                                    window.location.href = `/dashboard/office/edit/${document.id}`;
                                  }}
                                >
                                  Editar
                                </button> */}
                      <Button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          if (
                            confirm(
                              "Tem certeza que deseja excluir este escritório?"
                            )
                          ) {
                            deleteDocument(document.id);
                          }
                        }}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : user ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Nenhum documento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

Document.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Document;
