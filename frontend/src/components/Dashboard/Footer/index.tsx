import AuthContext from "@/contexts/AuthContext";
import React, { useContext } from "react";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	const { user } = useContext(AuthContext);

	return (
		<>
			{user && user.plan === "free" ? (
				<>
					<footer className="py-2 px-4 bg-gray-100 dark:bg-zinc-800 text-justify align-bottom text-sm text-gray-500 dark:text-gray-400">
						<div className="pt-22 flex flex-row justify-between">
							<strong>&copy; {currentYear} SaaS Template</strong>
							<div></div>
							<div className="float-right d-none d-sm-inline-block">
								<b>Versão</b> 1.0.0
							</div>
						</div>
					</footer>
				</>
			) : (
				<>
					<footer className="py-1 px-4 bg-gray-100 dark:bg-zinc-800 text-justify text-sm text-gray-500 dark:text-gray-400">
						<strong>&copy; {currentYear} SaaS Template</strong>
						<div className="float-right d-none d-sm-inline-block">
							<b>Versão</b> 1.0.0
						</div>
					</footer>
				</>
			)}
		</>
	);
};

export default Footer;
