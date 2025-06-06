import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";
import DashboardLayout from "./layout";

function DashboardPlans() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <p className="text-2xl font-light">
        {user?.firstName}, o seu plano atual é o: <b>{user?.plan}</b>
      </p>
    </>
  );
}

DashboardPlans.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPlans;
