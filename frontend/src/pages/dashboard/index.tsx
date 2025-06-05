import AuthContext from "@/contexts/AuthContext";
import React, { useContext } from "react";
import DashboardLayout from "./layout";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardHome() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>
              {user?.offices?.length ?? 0 > 0 ? "Escritórios" : "Escritório"}
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {user?.offices.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <Link href="/dashboard/office" className="small-box-footer">
              Mais Informações <i className="fas fa-arrow-circle-right" />
            </Link>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>
              {user?.documents?.length ?? 0 > 0 ? "Documentos" : "Documento"}
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {user?.offices.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <Link href="/dashboard/documents" className="small-box-footer">
              Mais Informações <i className="fas fa-arrow-circle-right" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

DashboardHome.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardHome;
