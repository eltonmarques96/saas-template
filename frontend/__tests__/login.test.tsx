import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/pages/login";
import { toast } from "sonner";

jest.mock("sonner", () => ({
	toast: jest.fn(),
}));

describe("Login Page", () => {
	it("renders the page", () => {
		render(<LoginPage />);
		screen.debug();
	});

	it("renders the page and insert information on login and password", () => {
		render(<LoginPage />);
		const emailInput = screen.getByPlaceholderText(/email/i);
		const passwordInput = screen.getByPlaceholderText(/senha/i);

		fireEvent.change(emailInput, { target: { value: "testuser" } });
		fireEvent.change(passwordInput, { target: { value: "testpass" } });

		expect(emailInput).toHaveValue("testuser");
		expect(passwordInput).toHaveValue("testpass");
	});

	it("chama a função de submit ao enviar o formulário", async () => {
		render(<LoginPage />);

		const emailInput = screen.getByPlaceholderText(/email/i);
		const passwordInput = screen.getByPlaceholderText(/senha/i);

		const submitButton = screen.getByRole("button", { name: /Login/i });

		fireEvent.change(emailInput, { target: { value: "meu@email.com" } });
		fireEvent.change(passwordInput, { target: { value: "minhasenha" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast).toHaveBeenCalledTimes(1);
		});
	});
});
