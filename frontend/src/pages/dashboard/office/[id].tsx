import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import { Button, Card, Spin } from "antd";
import DashboardLayout from "../layout";
import Link from "next/link";
import { OfficeTypes } from "@/types/Office";
import AuthContext from "@/contexts/AuthContext";

const OfficeDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { deleteOffice } = useContext(AuthContext);
  const [office, setOffice] = useState<OfficeTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      try {
        const response = await api.get(`/offices/${id}`);
        setOffice(response.data);
      } catch (error) {
        console.error("Error fetching office details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOfficeDetails();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/dashboard/office/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      if (id && office) {
        await deleteOffice(office.id);
        router.push("/dashboard/office");
      }
    } catch (error) {
      console.error("Error deleting office:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!office) {
    return <p>Office not found.</p>;
  }

  return (
    <div>
      <div className="content-header">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 my-auto">
              <div className="col-sm-7">
                <h1>{office.fantasyName}</h1>
              </div>
              <div className="row col-sm-5">
                <div className="col-sm-6">
                  <div className="actions">
                    <Button
                      type="primary"
                      className=" btn btn-sm btn-primary mr-4"
                      onClick={handleEdit}
                    >
                      Editar
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={handleDelete}
                      className=" btn btn-sm btn-danger"
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
                <div className="col-sm-6 my-auto">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link href="/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href="/dashboard/office">Escritórios</Link>
                    </li>
                    <li className="breadcrumb-item active">Editar</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Card>
          <p>
            <strong>Razão Social:</strong> {office.officialName}
          </p>
          <p>
            <strong>Descrição:</strong> {office.description}
          </p>
          <p>
            <strong>Telefone:</strong> {office.phone}
          </p>
          <p>
            <strong>Endereços:</strong> {office.address}
          </p>
        </Card>
      </div>
    </div>
  );
};

OfficeDetails.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OfficeDetails;
