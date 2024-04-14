import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IWarehouse } from "../../../interfaces/warehouse";
import {
  getAllWarehouseData,
  getAllWarehouseType,
} from "../../../services/warehouseApi";
import StyledLink from "../../../utils/link/styledLink";

interface IAdded {
  id: number;
}
type IGridWarehouseInterface = IWarehouse & IAdded;

const Warehouse = () => {
  const [warehouseDetails, setWarehouseDetails] = useState<
    IGridWarehouseInterface[]
  >([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    getWarehouseData();
  }, []);

  const getWarehouseData = async () => {
    setloading(true);

    const warehouseData: IWarehouse[] = await getAllWarehouseData();
    const warehouseTypeData = await getAllWarehouseType();

    const getWarehouseName = (WareHouseTypeId: number) => {
      for (let i = 0; i < warehouseTypeData.length; i++) {
        if (parseInt(warehouseTypeData[i].Id) === WareHouseTypeId) {
          return warehouseTypeData[i].Name;
        }
      }
      return "";
    };

    setWarehouseDetails(
      warehouseData.map((elm, i) => {
        let wareHouseTypeName = getWarehouseName(elm.WareHouseTypeId);
        return {
          id: i + 1,
          WareHouseType: wareHouseTypeName,
          ...elm,
        };
      })
    );
    setloading(false);
  };

  const Columns = [
    {
      field: "id",
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    { field: "Name", width: 300, headerClassName: "super-app-theme--header" },
    {
      field: "WareHouseType",
      width: 200,
      headerName: "WareHouse Type",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "SortOrder",
      width: 150,
      numeric: true,
      type: "number",
      headerName: "Sort Order",
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
            <IconButton>
              <StyledLink to={`/warehouse/${params.row.Id}`}>
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
          loginedUserRole.includes("WHAdd")?
          <SmallGridHeader headerName="WareHouse" path="/warehouse/add" />:
          <SmallGridHeader headerName="WareHouse" path="WHADD" />
      }
      <SmallTableContainer
        loading={loading}
        Rows={warehouseDetails}
        Columns={Columns}
      />
    </>
  );
};

export default Warehouse;
