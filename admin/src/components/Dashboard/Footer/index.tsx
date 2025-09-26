import React from "react";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<>
			<footer className="py-1 px-4 bg-gray-100 dark:bg-zinc-800 text-justify text-sm text-gray-500 dark:text-gray-400">
				<strong>&copy; {currentYear} ADMIN - APP 190</strong>
				<div className="float-right d-none d-sm-inline-block">
					<b>Versão</b> 1.0.0
				</div>
			</footer>
		</>
	);
};

export default Footer;
