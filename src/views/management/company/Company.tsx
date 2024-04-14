import { Paper } from "@mui/material";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { useAppSelector } from "../../../app/hooks";
import CompanyTable from "./components/CompanyTable";

const Company = () => {
  const company = useAppSelector((state) => state.company.data);

  return (
    <>
      <SmallGridHeader headerName="Company" addDisable={true} />
      <Paper>
        <CompanyTable companyData={company} />
      </Paper>
    </>
  );
};

export default Company;
