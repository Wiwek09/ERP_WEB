import { IconButton, Paper, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { getAllWarehouseTypes } from "../../../services/warehouseTypeApi";
import StyledLink from "../../../utils/link/styledLink";

const WareHouseType = () => {
  const [warehouseTypes, setWarehouseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const getData = async () => {
    setLoading(true);
    const data: any = await getAllWarehouseTypes();

    if (data) {
      let warehouseTypeData: any = [];
      data.forEach((element: any, index: any) => {
        warehouseTypeData.push({
          id: element.Id,
          "S.N.": index + 1,
          Name: element.Name,
        });
      });
      setWarehouseTypes(warehouseTypeData);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const Columns = [
    {
      field: "S.N.",
      width: 150,
      numeric: true,
      headerClassName: "super-app-theme--header",
    },
    { field: "Name", width: 500, headerClassName: "super-app-theme--header" },
    {
      field: "Action",
      width: 150,
      sortable: false,
      type: "number",
      headerClassName: "super-app-theme--header",

      renderCell: (params: any) => {
        return (
          <>
            <IconButton>
              <StyledLink to={`/warehouse-type/${params.row.id}`}>
                <Tooltip title="Edit" followCursor={true}>
                  <IconButton color="success">
                    <BiEditAlt />
                  </IconButton>
                </Tooltip>
              </StyledLink>
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {
        loginedUserRole.includes("WHTAdd") ?
        <SmallGridHeader
        headerName="Warehouse Types"
        path="/warehouse-type/add"
      /> :
      <SmallGridHeader
        headerName="Warehouse Types"
        path="WHTADD"
      />
      }
      
      <Paper sx={{ mt: 2 }}>
        <SmallTableContainer
          loading={loading}
          Rows={warehouseTypes}
          Columns={Columns}
        />
      </Paper>
    </>
  );
};

export default WareHouseType;
