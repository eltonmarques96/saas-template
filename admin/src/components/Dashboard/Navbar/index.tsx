import Link from "next/link";
import React from "react";
import {
	CameraIcon,
	ClipboardListIcon,
	DatabaseIcon,
	FileCodeIcon,
	FileIcon,
	FileTextIcon,
	HelpCircleIcon,
	SearchIcon,
	SettingsIcon,
	HomeIcon,
	UserIcon,
	PhoneIncoming,
	AlertCircleIcon,
	User2Icon,
	UsersRoundIcon,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/Dashboard/Navbar/Navmain";
import { NavUser } from "@/components/Dashboard/Navbar/Navuser";

export function Navbar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		navMain: [
			{
				title: "Home",
				url: "/dashboard",
				icon: HomeIcon,
			},
			{
				title: "Ocorrências",
				url: "/dashboard/bicicleta",
				icon: AlertCircleIcon,
			},
			{
				title: "CICOMs",
				url: "/dashboard/bicicleta",
				icon: PhoneIncoming,
			},
			{
				title: "Usuários",
				url: "/dashboard/celular",
				icon: UserIcon,
			},
			{
				title: "Admin",
				url: "/dashboard/celular",
				icon: UsersRoundIcon,
			},
		],
		navClouds: [
			{
				title: "Capture",
				icon: CameraIcon,
				isActive: true,
				url: "#",
				items: [
					{
						title: "Active Proposals",
						url: "#",
					},
					{
						title: "Archived",
						url: "#",
					},
				],
			},
			{
				title: "Proposal",
				icon: FileTextIcon,
				url: "#",
				items: [
					{
						title: "Active Proposals",
						url: "#",
					},
					{
						title: "Archived",
						url: "#",
					},
				],
			},
			{
				title: "Prompts",
				icon: FileCodeIcon,
				url: "#",
				items: [
					{
						title: "Active Proposals",
						url: "#",
					},
					{
						title: "Archived",
						url: "#",
					},
				],
			},
		],
		navSecondary: [
			{
				title: "Settings",
				url: "#",
				icon: SettingsIcon,
			},
			{
				title: "Get Help",
				url: "#",
				icon: HelpCircleIcon,
			},
			{
				title: "Search",
				url: "#",
				icon: SearchIcon,
			},
		],
		documents: [
			{
				name: "Data Library",
				url: "#",
				icon: DatabaseIcon,
			},
			{
				name: "Reports",
				url: "#",
				icon: ClipboardListIcon,
			},
			{
				name: "Word Assistant",
				url: "#",
				icon: FileIcon,
			},
		],
	};

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="/dashboard">
								<span className="text-base font-semibold">Admin - APP 190</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}

export default Navbar;
