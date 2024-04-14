import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IFinancialYear } from "../../../interfaces/financialYear";
import { getAllFinancialYearApi } from "../../../services/financialYearApi";
import StyledLink from "../../../utils/link/styledLink";

const Financial = () => {
  const [financialYearList, setFinancialYearList] = useState([]);
  const [loading, setLoading] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const getData = async () => {
    setLoading(true);
    const response = await getAllFinancialYearApi();
    if (response) {
      setFinancialYearList(
        response.map((financial: IFinancialYear, index: number) => ({
          id: index + 1,
          ...financial,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 100,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Name",
      width: 150,
      headerName: "Name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "NepaliStartDate",
      width: 200,
      headerName: "Nepali Start Date",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "NepaliEndDate",
      width: 200,
      headerName: "Nepali End Date",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "StartDate",
      width: 200,
      headerName: "Start Date",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "EndDate",
      width: 200,
      headerName: "End Date",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Action",
      width: 100,
      sortable: false,
      type: "number",
      headerClassName: "super-app-theme--header",

      renderCell: (params: any) => {
        return (
          <>
            <StyledLink to={`/financial/${params.row.Id}`}>
              <Tooltip title="Edit" followCursor={true}>
                <IconButton color="success">
                  <BiEditAlt />
                </IconButton>
              </Tooltip>
            </StyledLink>
          </>
        );
      },
    },
  ];
  return (
    <>
      {
        loginedUserRole.includes("FYAdd") ?
        <SmallGridHeader headerName={"Financial Year"} path="/financial/add" /> :
        <SmallGridHeader headerName={"Financial Year"} path="FYADD" />
      }
      
      <SmallTableContainer
        Rows={financialYearList}
        Columns={Columns}
        loading={loading}
      />
    </>
  );
};

export default Financial;
