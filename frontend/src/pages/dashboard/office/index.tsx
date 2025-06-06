import AuthContext from "@/contexts/AuthContext";
import React, { useContext } from "react";
import DashboardLayout from "../layout";
import Link from "next/link";
import { OfficeTypes } from "@/types/Office";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Office() {
  const { user, deleteOffice } = useContext(AuthContext);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <div className="flex-row flex">
          <CardTitle>Escritório</CardTitle>

          <div
            defaultValue="outline"
            className="flex w-full flex-col justify-start gap-6"
          >
            <div className="flex items-center justify-end lg:px-6">
              <Link href="/dashboard/office/add">
                <Button variant="outline" size="sm">
                  <PlusIcon />
                  <span className="hidden lg:inline">Adicionar escritório</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <CardDescription>Gerencie seus Escritório</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Table>
          <TableCaption>Lista de Escritórios</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.offices && user.offices.length > 0 ? (
              user.offices.map((office: OfficeTypes, index: number) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "left" }}>
                    {office.officialName || "N/A"}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
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
                          deleteOffice(office.id);
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
                  Nenhum escritório encontrado.
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
  );
}

Office.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Office;
