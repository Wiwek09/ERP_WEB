import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper, IconButton, Tooltip } from "@mui/material";
import { BiEditAlt } from "react-icons/bi";
import preeti from "preeti";
import StyledLink from "../../../../utils/link/styledLink";
import { ICompany } from "../../../../interfaces/company";

interface IProps {
  companyData: ICompany;
}

const CompanyTable = ({ companyData }: IProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Branch&nbsp;code</TableCell>
            <TableCell>Name&nbsp;(English)</TableCell>
            <TableCell>Name&nbsp;(Nepali)</TableCell>
            <TableCell>Phone&nbsp;number</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vat/pan</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{companyData && companyData.BranchCode}</TableCell>
            <TableCell>{companyData && companyData.NameEnglish}</TableCell>
            <TableCell>
              {companyData && companyData.NameNepali
                ? preeti(companyData.NameNepali)
                : ""}
            </TableCell>
            <TableCell>{companyData && companyData.Phone}</TableCell>
            <TableCell>{companyData && companyData.Email}</TableCell>
            <TableCell>{companyData && companyData.Pan_Vat}</TableCell>
            <TableCell>
              <StyledLink to={`/company/edit`}>
                <Tooltip title="Edit" followCursor={true}>
                  <IconButton color="success">
                    <BiEditAlt />
                  </IconButton>
                </Tooltip>
              </StyledLink>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompanyTable;
