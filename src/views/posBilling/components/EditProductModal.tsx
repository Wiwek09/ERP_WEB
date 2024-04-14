import {
  TextField,
  Typography,
  Box,
  Dialog,
  IconButton,
  Button,
  Autocomplete,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IoMdClose } from "react-icons/io";
import { IOnSubmit } from "../../../interfaces/event";
import { ISelectedProducts } from "../interface";

interface IProps {
  displayStatus: boolean;
  setDisplayStatus: any;
  data: ISelectedProducts | null;
  setData: any;
  setInput: (name: string, value: any) => void;
  updateProduct: (E: IOnSubmit) => void;
}

const useStyles = makeStyles({
  closeIcon: {
    fontSize: "23px",
  },
});

const EditProductModal = ({
  displayStatus,
  setDisplayStatus,
  data,
  setData,
  setInput,
  updateProduct,
}: IProps) => {
  const classes = useStyles();

  const handleClose = () => {
    setDisplayStatus(false);
    setData();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={displayStatus}
      style={{ maxWidth: "550px", margin: "auto" }}
      fullWidth
    >
      <Box sx={{ py: 2, px: 3 }} component="form" onSubmit={updateProduct}>
        <Box sx={{ pb: 2, borderBottom: 1, borderColor: "#d4d2d2" }}>
          <Typography sx={{ fontSize: 18 }}>
            {data && data.ItemName ? data.ItemName : ""}
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: "10px", right: "5px" }}
            onClick={handleClose}
          >
            <IoMdClose className={classes.closeIcon} />
          </IconButton>
        </Box>
        <Box sx={{ mt: 6 }}>

        <TextField
            label="Qty"
            name="InitialQty"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
            InputProps={{ inputProps: { min: "" } }}
           
            value={data && data.InitialQty ? data.InitialQty : ""}
            onChange={(e) =>  setInput("InitialQty", (e.target.value))}
          />
          <TextField
            label="Price"
            name="InitialPrice"
             variant="outlined"
            fullWidth
            size="small"
            type="number"
            InputProps={{ inputProps: { min: "" } }}
            sx={{ mt: 4 }}
            value={data && data.InitialPrice ? data.InitialPrice : ""}
            onChange={(e) => setInput("InitialPrice", (e.target.value))}
          />
         
          <Autocomplete
            disablePortal
            id="TaxType"
            fullWidth
            size="small"
            sx={{ mt: 4 }}
            options={[
              { id: "Inclusive", label: "Inclusive" },
              { id: "Exclusive", label: "Exclusive" },
            ]}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={
              data && data.TaxType
                ? { id: data.TaxType, label: data.TaxType }
                : null
            }
            renderInput={(params) => <TextField {...params} label="Tax type" />}
            onChange={(e, values) => setInput("TaxType", values && values.id)}
          />
          <TextField
            label="Tax"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            sx={{ mt: 4 }}
            value={data && data.TaxValue ? data.TaxValue : ""}
            onChange={(e) => setInput("TaxValue", (e.target.value))}
          />
          <Autocomplete
            disablePortal
            fullWidth
            size="small"
            sx={{ mt: 4 }}
            options={[
              { id: "Percent", label: "Percent" },
              { id: "Fixed", label: "Fixed" },
            ]}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={
              data && data.DiscountType
                ? { id: data.DiscountType, label: data.DiscountType }
                : null
            }
            renderInput={(params) => (
              <TextField {...params} label="Discount type" />
            )}
            onChange={(e, values) =>
              setInput("DiscountType", values && values.id)
            }
          />
          <TextField
            label="Discount"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            sx={{ mt: 4 }}
            value={data && data.DiscountValue ? data.DiscountValue : ""}
            onChange={(e) =>
              setInput("DiscountValue", (e.target.value))
            }
          />
          
        </Box>
        <Box>
          <Button variant="outlined" fullWidth sx={{ mt: 4 }} type="submit">
            Update
          </Button>
          <Button variant="outlined" color="error" fullWidth sx={{ mt: 3 }}  onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditProductModal;
