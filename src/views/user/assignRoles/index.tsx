import { IconButton, Paper, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { getAssignRoles } from "../../../services/assignRolesApi";
import { getAllRoles } from "../../../services/userRoleApi";
import StyledLink from "../../../utils/link/styledLink";

interface IState {
  id: number;
  Id: string;
  FullNames: string;
  RolesNames: string;
}

const AssignRoles = () => {
  const [getRoles, setSetroles] = useState<IState[]>([]);
  const [loading, setloading] = useState(false);

  const loadData = async () => {
    setloading(true);
    let data: any = [];
    const res = await getAssignRoles();
    const roles = await getAllRoles();

    const getRolesById = (id: any) => {
      for (let i = 0; i < roles.length; i++) {
        if (id === roles[i].Id) {
          return roles[i].Name;
        }
      }
      return "";
    };
    res.forEach((elm: any, i: number) => {
      data.push({
        id: i + 1,
        Id: elm.Id,
        FullNames: elm.FirstName + elm.LastName,
        RolesNames: getRolesById(elm.RoleName),
      });
    });
    setSetroles(data);
    setloading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 150,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "FullNames",
      width: 300,
      headerName: "Name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "RolesNames",
      width: 300,
      headerName: "Role",
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
              <StyledLink to={`/assign-roles/${params.row.Id}`}>
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
      <SmallGridHeader headerName="Assign Roles" addDisable />
      <Paper sx={{ mt: 2 }}>
        <SmallTableContainer
          loading={loading}
          Columns={Columns}
          Rows={getRoles ? getRoles : []}
        />
      </Paper>
    </>
  );
};

export default AssignRoles;
