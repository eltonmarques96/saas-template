import React from "react";
import DashboardLayout from "../layout";
import api from "@/services/api";
import { areasOfLawOptions } from "@/types/Office";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function OfficeAdd() {
  const router = useRouter();
  const [officialName, setOfficialName] = React.useState("");
  const [fantasyName, setFantasyName] = React.useState("");
  const [cnpjCpf, setCnpjCpf] = React.useState("");
  const [areasOfLaw, setAreasOfLaw] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [logo, setLogo] = React.useState<File | null>(null);
  const [address, setAddress] = React.useState("");
  const [country, setCountry] = React.useState("");

  async function createOffice(e: React.FormEvent<HTMLFormElement>) {
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
      const userData = {
        officialName,
        fantasyName,
        companyCode: cnpjCpf,
        area: areasOfLaw,
        description,
        phone,
        email,
        logo,
        address,
        country,
      };
      const response = await api.post("/offices", userData);
      if (response.status !== 201) {
        throw new Error("Erro ao criar escritório");
      }
      toast("Escrritório criado com sucesso!");
      router.push("/dashboard/office");
    } catch {
      toast("Erro ao criar escritório", {
        description: "Por favor, tente novamente.",
      });
    }
  }
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Crie um escritório</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => createOffice(e)}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="officialName">
                        Razao Social <span>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="officialName"
                        className="form-control"
                        minLength={5}
                        required
                        value={officialName}
                        onChange={(e) => setOfficialName(e.target.value)}
                        title="Informe a razão social do escritório (mínimo 5 caracteres)."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fantasyName">
                        Nome Fantasia <span>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="fantasyName"
                        className="form-control"
                        minLength={5}
                        required
                        value={fantasyName}
                        onChange={(e) => setFantasyName(e.target.value)}
                        title="Informe o nome fantasia do escritório (mínimo 5 caracteres)."
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">
                        Endereço <span>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="address"
                        className="form-control"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        title="Informe o endereço do escritório."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">
                        País <span>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="country"
                        className="form-control"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        title="Informe o país do escritório."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cnpjCpf">
                        CNPJ ou CPF <span>*</span>
                      </Label>
                      <Input
                        type="text"
                        id="cnpjCpf"
                        className="form-control"
                        minLength={8}
                        required
                        pattern="\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}"
                        maxLength={18}
                        value={cnpjCpf}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters

                          if (value.length <= 11) {
                            // CPF mask
                            value = value.replace(/(\d{3})(\d)/, "$1.$2");
                            value = value.replace(/(\d{3})(\d)/, "$1.$2");
                            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                          } else {
                            // CNPJ mask
                            value = value.replace(/^(\d{2})(\d)/, "$1.$2");
                            value = value.replace(
                              /^(\d{2})\.(\d{3})(\d)/,
                              "$1.$2.$3"
                            );
                            value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
                            value = value.replace(/(\d{4})(\d)/, "$1-$2");
                          }

                          setCnpjCpf(value);
                        }}
                        title="Informe um CNPJ ou CPF válido."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">
                        Telefone <span>*</span>
                      </Label>
                      <Input
                        type="tel"
                        id="phone"
                        className="form-control"
                        pattern="\(\d{2}\) \d{4,5}-\d{4}"
                        placeholder="(XX) XXXXX-XXXX"
                        required
                        value={phone}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters

                          if (value.length > 10) {
                            value = value.replace(
                              /^(\d{2})(\d{5})(\d{4})$/,
                              "($1) $2-$3"
                            );
                          } else {
                            value = value.replace(
                              /^(\d{2})(\d{4})(\d{4})$/,
                              "($1) $2-$3"
                            );
                          }

                          setPhone(value);
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (!/\(\d{2}\) \d{4,5}-\d{4}/.test(value)) {
                            toast(
                              "Por favor, insira um número de telefone válido no formato (XX) XXXXX-XXXX."
                            );
                          }
                        }}
                        title="Informe um número de telefone válido no formato (XX) XXXXX-XXXX."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">
                        Email <span>*</span>
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        title="Informe um endereço de email válido."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="inputAreasOfLaw">
                        Áreas de Atuação <span>*</span>
                      </Label>
                      <Select required defaultValue="" value={areasOfLaw[0]}>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Área de Atuação" />
                        </SelectTrigger>
                        <SelectContent>
                          {areasOfLawOptions
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                  setAreasOfLaw([option.value]);
                                }}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <small className="form-text text-muted">
                        Segure Ctrl (ou Command no Mac) para selecionar
                        múltiplas opções.
                      </small>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="inputDescription">Descriçao</Label>
                      <Textarea
                        id="inputDescription"
                        className="form-control"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        title="Informe uma descrição opcional para o escritório."
                      />
                    </div>

                    {/* <div className="form-group">
                    <Label htmlFor="logo">Logo</Label>
                    <Input>
                      type="file"
                      id="logo"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      title="Envie uma imagem para o logo do escritório (opcional)."
                    />
                  </div> */}

                    <div className="grid gap-2">
                      <div className="row">
                        <Button
                          className="btn btn-secondary"
                          onClick={() => {
                            setOfficialName("");
                            setFantasyName("");
                            setCnpjCpf("");
                            setAreasOfLaw([]);
                            setDescription("");
                            setPhone("");
                            setEmail("");
                            setLogo(null);
                            setAddress("");
                            setCountry("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="btn btn-success float-right"
                        >
                          Criar escritório
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

OfficeAdd.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OfficeAdd;
