import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/pages/login";

describe("Login Page", () => {
	it("renders the page", () => {
		render(<LoginPage />);
		const template = screen.getByText("Esqueceu sua senha?");
		expect(template).toBeDefined();
	});
});
