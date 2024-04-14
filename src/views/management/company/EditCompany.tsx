import { useAppSelector } from "../../../app/hooks";
import FormHeader from "../../../components/headers/formHeader";
import EditCompanyForm from "./components/EditCompanyForm";

const EditCompany = () => {
  const company = useAppSelector((state) => state.company.data);
  return (
    <>
      <FormHeader headerName="Edit company" />
      <EditCompanyForm data={company} />
    </>
  );
};

export default EditCompany;
