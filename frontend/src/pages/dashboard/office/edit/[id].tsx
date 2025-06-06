/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import DashboardLayout from "../../layout";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import AuthContext from "@/contexts/AuthContext";
import { toast } from "sonner";

function EditOffice() {
  const { reloadUserData } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [officialName, setOfficialName] = useState("");
  const [fantasyName, setFantasyName] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOfficeDetails();
    }
  }, [id]);

  const fetchOfficeDetails = async () => {
    try {
      const response = await api.get(`/offices/${id}`);
      const officeData = response.data;
      setOfficialName(officeData.officialName || "");
      setFantasyName(officeData.fantasyName || "");
      setCnpjCpf(officeData.companyCode || "");
      setDescription(officeData.description || "");
      setPhone(officeData.phone || "");
      setEmail(officeData.email || "");
      setAddress(officeData.address || "");
      setLogo(null); // Assuming logo is not fetched as a file
    } catch (error) {
      console.error("Error fetching office details:", error);
    } finally {
      setLoading(false);
    }
  };

  async function editOffice(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!logo) {
        const githubLogoUrl =
          "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
        const response = await fetch(githubLogoUrl);
        const blob = await response.blob();
        const file = new File([blob], "github-logo.png", { type: blob.type });
        setLogo(file);
      }
      const formData = {
        officialName,
        fantasyName,
        companyCode: cnpjCpf,
        description,
        phone,
        email,
        address,
      };
      const response = await api.put("/offices/" + id, { updates: formData });

      if (response.status !== 200) {
        throw new Error("Failed to create office");
      }
      reloadUserData();
      toast("Escritório editado com sucesso!");
      router.push("/dashboard/office");
    } catch {
      toast("Erro ao editar o escritório", {
        description: "Por favor, tente novamente.",
      });
    }
  }
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 my-auto">
            <div className="col-sm-7">
              <h1 className="m-0">Editar escritório</h1>
            </div>
            <div className="row col-sm-5">
              <div className="col-sm-6"></div>
              <div className="col-sm-6 my-auto">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link href="/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/dashboard/office">Escritórios</Link>
                  </li>
                  <li className="breadcrumb-item active">Criar</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Editar Escritório</h3>
                </div>
                <form
                  onSubmit={async (e) => {
                    await editOffice(e);
                  }}
                >
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="officeName">Nome do Escritório</label>
                      <input
                        type="text"
                        className="form-control"
                        id="officeName"
                        placeholder="Digite o nome do escritório"
                        value={officialName}
                        onChange={(e) => setOfficialName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="officeFantasyName">Nome Fantasia</label>
                      <input
                        type="text"
                        className="form-control"
                        id="officeFantasyName"
                        placeholder="Digite o nome fantasia"
                        value={fantasyName}
                        onChange={(e) => setFantasyName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="officePhone">Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        id="officePhone"
                        placeholder="Digite o telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="officeEmail">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="officeEmail"
                        placeholder="Digite o email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="officeAddress">Endereço</label>
                      <input
                        type="text"
                        className="form-control"
                        id="officeAddress"
                        placeholder="Digite o endereço"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="officeDescription">Descrição</label>
                      <textarea
                        className="form-control"
                        id="officeDescription"
                        placeholder="Digite a descrição"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

EditOffice.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EditOffice;
