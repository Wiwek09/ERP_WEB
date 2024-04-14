import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IUnitType } from "../../../interfaces/unitType";
import { getAllUnitType } from "../../../services/unitTypeApi";
import StyledLink from "../../../utils/link/styledLink";

const UnitType = () => {
  const [unitType, setUnitType] = useState<IUnitType[]>([]);
  const [loading, setLoading] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const getUnitTypeList = async () => {
    setLoading(true);
    const response = await getAllUnitType();
    setUnitType(
      response &&
        response.map((unitType: IUnitType, index: number) => ({
          ...unitType,
          id: index + 1,
        }))
    );
    setLoading(false);
  };

  useEffect(() => {
    getUnitTypeList();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 100,
      headerName: "SN",
      headerClassName: "super-app-theme---header",
    },
    {
      field: "Name",
      width: 600,
      headerName: "Unit Type",
      headerClassName: "super-app-theme---header",
    },
    {
      field: "Action",
      width: 200,
      sortable: false,
      type: "number",
      headerClassName: "super-app-theme--header",

      renderCell: (params: any) => {
        return (
          <>
            <StyledLink to={`/unit-type/${params.row.Id}`}>
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
        loginedUserRole.includes("UTAdd") ?
        <SmallGridHeader headerName="Unit Type" path="unit-type/add" /> :
        <SmallGridHeader headerName="Unit Type" path="UTADD" />
      }
      
      <SmallTableContainer
        loading={loading}
        Rows={unitType ? unitType : []}
        Columns={Columns}
      />
    </>
  );
};

export default UnitType;
