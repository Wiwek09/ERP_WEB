import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FiDelete } from "react-icons/fi";
import { AiFillEdit } from "react-icons/ai";
import { ISelectedProducts } from "../interface";
import { IProduct } from "../../../interfaces/purchase";

const useStyles = makeStyles({
  qtyBtn: {
    margin: "0",
    padding: "2px 4px",
    width: "20px",
  },
  deleteIcon: {
    fontSize: "15px",
    color: "red",
  },
  editIcon: {
    fontSize: "15px",
  },
});

// Interface for props
interface IProps {
  product: ISelectedProducts[];
  rangepriceproduct: IProduct[];

  findrange: (rangepriceproduct: IProduct) => void;
  increateQty: (index: number) => void;
  editProduct: (index: number) => void;
  setInputQty: (name: string, value: any,index:number) => void;
  deleteProduct: (index: number) => void;
}

const PosTable = ({
  product,
  rangepriceproduct,
  increateQty,
  setInputQty,
  editProduct,
  deleteProduct,
}: IProps) => {
  const classes = useStyles();

  const quantityCheck = (e: any, index: number) => {
    setInputQty("InitialQty",e,index)
  }
  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 2 }}
      style={{ height: "250px" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: 14 }} style={{ minWidth: "200px" }}>
              Products
            </TableCell>
            <TableCell sx={{ fontSize: 14 }} style={{ minWidth: "100px" }}>
              Qty
            </TableCell>
            <TableCell sx={{ fontSize: 14 }}>Price&nbsp;(Rs.)</TableCell>
            <TableCell sx={{ fontSize: 14 }}>Dic&nbsp;(Rs.)</TableCell>
            <TableCell sx={{ fontSize: 14 }}>Total&nbsp;(Rs)</TableCell>
            <TableCell sx={{ fontSize: 14 }}>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {product &&
            product.map((data, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    {data.ItemName}
                    <IconButton onClick={() => editProduct(index)}>
                      <AiFillEdit className={classes.editIcon} />
                    </IconButton>
                  </TableCell>
                  {/* <TableCell>
                    <IconButton
                      sx={{ fontSize: 13, border: 1, borderRadius: 1 }}
                      className={classes.qtyBtn}
                      onClick={() => decreaseQty(index)}
                    >
                      -
                    </IconButton>
                    <Typography
                      sx={{ display: "inline-block", fontSize: 13, px: 1 }}
                    > */}
                    <TableCell>
                      <TextField
                        label="Qty"
                        name="InitialQty"
                        variant="outlined"
                        fullWidth
                        size="small"
                        type="number"
                        InputProps={{ inputProps: { min: "" } }}
                        value={data && data.InitialQty ? data.InitialQty : ""}
                        onChange={(e) =>  quantityCheck(e.target.value, index)}
                      />
                     </TableCell>
                    {/* </Typography>
                    <IconButton
                      sx={{ fontSize: 13, border: 1, borderRadius: 1 }}
                      className={classes.qtyBtn}
                      onClick={() => increateQty(index)}
                    >
                      +
                    </IconButton>
                  </TableCell> */}
                  
                  <TableCell>{data.UnitPrice}</TableCell>
                  <TableCell>
                    {data.Discount}
                  </TableCell>
                  <TableCell>
                    {((data.UnitPrice * data.InitialQty) - data.Discount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => deleteProduct(index)}>
                      <FiDelete className={classes.deleteIcon} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default PosTable;
