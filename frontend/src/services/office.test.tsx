import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OfficeAdd from "../pages/dashboard/office/add";
import api from "@/services/api";

// filepath: /media/elton/Arquivos Windows/Projetos/myassociate/frontend/src/pages/dashboard/office/add.test.tsx

jest.mock("@/services/api");

describe("OfficeAdd Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the OfficeAdd component", () => {
    render(<OfficeAdd />);
    expect(screen.getByText("Criar escritório")).toBeInTheDocument();
    expect(screen.getByLabelText("Razao Social *")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome Fantasia *")).toBeInTheDocument();
    expect(screen.getByLabelText("Endereço *")).toBeInTheDocument();
    expect(screen.getByLabelText("País *")).toBeInTheDocument();
    expect(screen.getByLabelText("CNPJ ou CPF *")).toBeInTheDocument();
    expect(screen.getByLabelText("Telefone *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("Áreas de Atuação *")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<OfficeAdd />);
    const officialNameInput = screen.getByLabelText("Razao Social *");
    fireEvent.change(officialNameInput, { target: { value: "Test Office" } });
    expect(officialNameInput).toHaveValue("Test Office");
  });

  it("validates required fields", async () => {
    render(<OfficeAdd />);
    const submitButton = screen.getByText("Criar escritório");
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(
        "Informe a razão social do escritório (mínimo 5 caracteres)."
      )
    ).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: 201 });
    render(<OfficeAdd />);
    fireEvent.change(screen.getByLabelText("Razao Social *"), {
      target: { value: "Test Office" },
    });
    fireEvent.change(screen.getByLabelText("Nome Fantasia *"), {
      target: { value: "Test Fantasy" },
    });
    fireEvent.change(screen.getByLabelText("Endereço *"), {
      target: { value: "Test Address" },
    });
    fireEvent.change(screen.getByLabelText("País *"), {
      target: { value: "Test Country" },
    });
    fireEvent.change(screen.getByLabelText("CNPJ ou CPF *"), {
      target: { value: "123.456.789-00" },
    });
    fireEvent.change(screen.getByLabelText("Telefone *"), {
      target: { value: "(12) 34567-8901" },
    });
    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Áreas de Atuação *"), {
      target: { value: "criminal" },
    });

    fireEvent.click(screen.getByText("Criar escritório"));
    expect(api.post).toHaveBeenCalledWith(
      "/dashboard/office",
      expect.any(Object)
    );
  });

  it("resets the form when cancel button is clicked", () => {
    render(<OfficeAdd />);
    fireEvent.change(screen.getByLabelText("Razao Social *"), {
      target: { value: "Test Office" },
    });
    fireEvent.click(screen.getByText("Cancelar"));
  });
});
