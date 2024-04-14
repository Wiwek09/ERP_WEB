import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IUserRole } from "../../../interfaces/userRoles";
import { getAllRoles } from "../../../services/userRoleApi";
import StyledLink from "../../../utils/link/styledLink";
import { errorMessage } from "../../../utils/messageBox/Messages";

const Roles = () => {
  const [allData, setAllData] = useState<IUserRole[]>([]);

  const [loading, setloading] = useState<boolean>(false);

  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  useEffect(() => {
    const loadData = async () => {
      setloading(true);
      try {
        const res: IUserRole[] = await getAllRoles();

        setAllData(
          res &&
            res.map((elm, i) => {
              return {
                id: i + 1,
                ...elm,
              };
            })
        );
        setloading(false);
      } catch (error) {
        errorMessage();
      }
    };
    loadData();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 200,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Name",
      width: 250,
      headerName: "Name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Description",
      width: 250,
      headerName: "Description",
      headerClassName: "super-app-theme--header",
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
            <IconButton>
              <StyledLink to={`/user-roles/${params.row.Id}`}>
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
      {loginedUserRole.includes("RoleAdd") ? (
        <SmallGridHeader headerName="User Roles" path="user-roles/add" />
      ) : (
        <SmallGridHeader headerName="User Roles" path="ROLADD" />
      )}

      <SmallTableContainer loading={loading} Rows={allData} Columns={Columns} />
    </>
  );
};

export default Roles;
