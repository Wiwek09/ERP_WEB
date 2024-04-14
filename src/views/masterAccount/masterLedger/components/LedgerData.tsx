import { 
    Paper, 
    TableContainer,
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell,
    Tooltip,
    IconButton,
} from "@mui/material";
import { BiEditAlt } from "react-icons/bi";
import StyledLink from "../../../../utils/link/styledLink";
import { errorMessage } from "../../../../utils/messageBox/Messages";
const LedgerData = ({allData}:any) => { 
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow sx={{ bgcolor: "primary.tableHeader" }}>
                        <TableCell align="left">S.N</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>PAN</TableCell>
                        <TableCell>Telephone</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allData.length > 0?
                    allData.map((elm:any, i:number) => {
                        return(
                            <TableRow sx={{ bgcolor: "primary.tableHeader" }}>
                                <TableCell>{elm.Id}</TableCell>
                                <TableCell>{elm.Name}</TableCell>
                                <TableCell>{elm.PanNo}</TableCell>
                                <TableCell>{elm.Telephone}</TableCell>
                                <TableCell>
                                <IconButton>
                                    <StyledLink to={`/master-ledger/${elm.Id}`}>
                                        <Tooltip title="Edit" followCursor={true}>
                                        <IconButton color="success">
                                            <BiEditAlt />
                                        </IconButton>
                                        </Tooltip>
                                    </StyledLink>
                                </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    }):
                    <h1>
                        No data available
                    </h1>
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LedgerData;
