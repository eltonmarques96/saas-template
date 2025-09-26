import React from "react";
import DashboardLayout from "./layout";
import Link from "next/link";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOverview } from "@/types/Admin";

function DashboardHome() {
	const overviewMutation = useQuery({
		queryKey: ["adminOverview"],
		queryFn: async () => await loadOverView(),
	});
	async function loadOverView(): Promise<AdminOverview> {
		const response = await api.get("/overview");
		return response.data;
	}

	return (
		<>
			<div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
				<Card className="@container/card">
					<CardHeader className="relative">
						<CardDescription>Ocorrências</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
							{overviewMutation.isPending ? (
								<>
									<Skeleton className="h-[20px] w-[100px] rounded-full" />
								</>
							) : overviewMutation.data ? (
								overviewMutation.data.total_ocorrencias
							) : (
								0
							)}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<Link href="/dashboard/" className="small-box-footer">
							Mais Informações <i className="fas fa-arrow-circle-right" />
						</Link>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader className="relative">
						<CardDescription>CICOMs</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
							{overviewMutation.isPending ? (
								<>
									<Skeleton className="h-[20px] w-[100px] rounded-full" />
								</>
							) : overviewMutation.data ? (
								overviewMutation.data.total_cicoms
							) : (
								0
							)}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<Link href="/dashboard/" className="small-box-footer">
							Mais Informações <i className="fas fa-arrow-circle-right" />
						</Link>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader className="relative">
						<CardDescription>Usuários</CardDescription>
						<CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
							{overviewMutation.isPending ? (
								<>
									<Skeleton className="h-[20px] w-[100px] rounded-full" />
								</>
							) : overviewMutation.data ? (
								overviewMutation.data.total_usuarios
							) : (
								0
							)}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<Link href="/dashboard/" className="small-box-footer">
							Mais Informações <i className="fas fa-arrow-circle-right" />
						</Link>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader className="relative">
						<CardDescription>Veículos</CardDescription>
						<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
							{overviewMutation.isPending ? (
								<>
									<Skeleton className="h-[20px] w-[100px] rounded-full" />
								</>
							) : overviewMutation.data ? (
								overviewMutation.data.total_veiculos
							) : (
								0
							)}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<Link href="/dashboard/" className="small-box-footer">
							Mais Informações <i className="fas fa-arrow-circle-right" />
						</Link>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader className="relative">
						<CardDescription>Celulares</CardDescription>
						<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
							{overviewMutation.isPending ? (
								<>
									<Skeleton className="h-[20px] w-[100px] rounded-full" />
								</>
							) : overviewMutation.data ? (
								overviewMutation.data.total_celulares
							) : (
								0
							)}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<Link href="/dashboard/" className="small-box-footer">
							Mais Informações <i className="fas fa-arrow-circle-right" />
						</Link>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader className="relative">
						<CardDescription>Bicicletas</CardDescription>
						<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
							{overviewMutation.isPending ? (
								<>
									<Skeleton className="h-[20px] w-[100px] rounded-full" />
								</>
							) : overviewMutation.data ? (
								overviewMutation.data.total_bicicletas
							) : (
								0
							)}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<Link href="/dashboard/" className="small-box-footer">
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
