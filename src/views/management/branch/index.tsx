import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import SmallGridHeader from "../../../components/headers/smallTableHeader";
import { getAllBranch } from "../../../services/branchApi";
import { IBranch } from "../../../interfaces/branch";
import StyledLink from "../../../utils/link/styledLink";
import { IconButton, Tooltip } from "@mui/material";
import { BiEditAlt } from "react-icons/bi";
import SmallTableContainer from "../../../components/dataGrid";
import preeti from "preeti";
import { useAppSelector } from "../../../app/hooks";

interface IBranchData {
  id: number;
  Id: number;
  NameEnglish: string;
  NameNepali: string;
}

const Branch = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [branch, setBranch] = useState<IBranchData[]>([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const setBranchData = async () => {
    setLoading(true);
    const response = await getAllBranch();
    try {
      setBranch(
        response.map((data: IBranch, index: number) => {
          return {
            id: index + 1,
            Id: data.Id,
            NameEnglish: data.NameEnglish,
            NameNepali: preeti(data.NameNepali !== null ? data.NameNepali : ""),
          };
        })
      );
      setLoading(false);
    } catch {
      // Set the error message here.....
    }
  };

  useEffect(() => {
    setBranchData();
  }, []);

  const columns = [
    {
      field: "id",
      width: 150,
      headerName: "SN",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "NameEnglish",
      width: 300,
      headerName: "English name",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "NameNepali",
      width: 300,
      headerName: "Nepali name",
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
              <StyledLink to={`/branch/${params.row.Id}`}>
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
          loginedUserRole.includes("BranchAdd") ?
          <SmallGridHeader headerName="Branch" path="branch/add" /> :
          <SmallGridHeader headerName="Branch" path="BRAADD" />
        }
        
        <SmallTableContainer
          loading={loading}
          Rows={branch ? branch : []}
          Columns={columns}
        />
      </Box>
    </>
  );
};
export default Branch;
