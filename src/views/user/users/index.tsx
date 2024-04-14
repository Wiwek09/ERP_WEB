import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useAppSelector } from "../../../app/hooks";
import SmallTableContainer from "../../../components/dataGrid";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { IUser } from "../../../interfaces/user";
import { getAllUsers } from "../../../services/userApi";
import StyledLink from "../../../utils/link/styledLink";

interface IaddedOne {
  id: number;
  displyingName: string;
}
type IGridUserInterface = IUser & IaddedOne;

const User = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IGridUserInterface[]>([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const getUsers = async () => {
    setLoading(true);
    const response: IUser[] = await getAllUsers();
    try {
      setUsers(
        response &&
          response.map((user, index) => {
            return {
              ...user,
              id: index + 1,
              displyingName: user.FirstName + " " + user.LastName,
            };
          })
      );
    } catch {
      return -1;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const Columns = [
    {
      field: "id",
      width: 100,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "displyingName",
      width: 200,
      headerName: "Name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "UserName",
      width: 200,
      headerName: "User Name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Email",
      width: 250,
      numeric: true,
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
            <StyledLink to={`/users/${params.row.Id}`}>
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
      {loginedUserRole.includes("UserAdd") ? (
        <SmallGridHeader headerName="Users" path="users/add" />
      ) : (
        <SmallGridHeader headerName="Users" path="USRADD" />
      )}
      <SmallTableContainer
        loading={loading}
        Rows={users ? users : []}
        Columns={Columns}
      />
    </>
  );
};

export default User;
