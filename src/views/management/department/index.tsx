import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllDepartments } from "../../../services/departmentApi";
import { IconButton, Tooltip } from "@mui/material";
import StyledLink from "../../../utils/link/styledLink";
import { BiEditAlt } from "react-icons/bi";
import { IDepartment } from "../../../interfaces/department";
import { Box } from "@mui/system";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import SmallTableContainer from "../../../components/dataGrid";
import { useAppSelector } from "../../../app/hooks";

interface IDepartmentData {
  id: number;
  Id: number;
  Name: string;
}

const Department = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<IDepartmentData[]>([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const setDepartmentData = async () => {
    try {
      setLoading(true);
      const response = await getAllDepartments();
      setDepartments(
        response.map((data: IDepartment, index: number) => {
          return { id: index + 1, Id: data.Id, Name: data.Name };
        })
      );
      setLoading(false);
    } catch {
      toast.error("There is a problem in the system. Please try agai leter.");
    }
  };

  useEffect(() => {
    setDepartmentData();
  }, []);

  const columns = [
    {
      field: "id",
      width: 150,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Name",
      width: 300,
      headerName: "Name",
      headerClassName: "super-app-theme--header",
    },
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
              <StyledLink to={`/department/${params.row.Id}`}>
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
      <Box>
        {
          loginedUserRole.includes("DeAdd")?
            <SmallGridHeader headerName="Department" path="department/add" />:
            <SmallGridHeader headerName="Department" path="DEADD" />
        }
        <SmallTableContainer
          loading={loading}
          Rows={departments ? departments : []}
          Columns={columns}
        />
      </Box>
    </>
  );
};

export default Department;
