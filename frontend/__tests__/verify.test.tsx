import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Verify from "@/pages/verify";

describe("Verify Page", () => {
  it("renders the page", () => {
    render(<Verify />);
    expect(screen.getByText(/Usuário Verificado/i)).toBeInTheDocument();
  });
});
