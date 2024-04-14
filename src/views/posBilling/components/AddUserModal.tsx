import {
  TextField,
  Typography,
  Box,
  Dialog,
  IconButton,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IoMdClose } from "react-icons/io";
import { IOnChange, IOnSubmit } from "../../../interfaces/event";
import { IMinimumLedgerDetails } from "../interface";

interface IProps {
  displayStatus: boolean;
  setDisplayStatus: any;
  ledgerDetails: IMinimumLedgerDetails;
  setLedgerDetails: any;
  setInputData: (e: IOnChange) => void;
  onClickHandler: (e: IOnSubmit) => void;
}

const useStyles = makeStyles({
  closeIcon: {
    fontSize: "23px",
  },
});

const AddUserModal = ({
  displayStatus,
  setDisplayStatus,
  ledgerDetails,
  setLedgerDetails,
  setInputData,
  onClickHandler,
}: IProps) => {
  const classes = useStyles();

  const handleClose = () => {
    setDisplayStatus(false);
    setLedgerDetails({
      name: null,
      address: null,
      telephoneNo: null,
      email: null,
      panvat: null,
    });
  };

  return (
    <Dialog onClose={handleClose} open={displayStatus} maxWidth="xs" fullWidth>
      <Box
        sx={{ py: 2, px: 3 }}
        component="form"
        onSubmit={onClickHandler}
        autoComplete="off"
      >
        <Box>
          <Typography sx={{ fontSize: 20 }}>Add user</Typography>
          <IconButton
            sx={{ position: "absolute", top: "10px", right: "5px" }}
            onClick={handleClose}
          >
            <IoMdClose className={classes.closeIcon} />
          </IconButton>
        </Box>
        <Box sx={{ mt: 4 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            size="small"
            name="name"
            value={
              ledgerDetails && ledgerDetails.name ? ledgerDetails.name : ""
            }
            required
            onChange={setInputData}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            size="small"
            name="address"
            sx={{ mt: 4 }}
            value={
              ledgerDetails && ledgerDetails.address
                ? ledgerDetails.address
                : ""
            }
            onChange={setInputData}
          />
          <TextField
            label="Telephone No."
            variant="outlined"
            fullWidth
            size="small"
            name="telephoneNo"
            sx={{ mt: 4 }}
            value={
              ledgerDetails && ledgerDetails.telephoneNo
                ? ledgerDetails.telephoneNo
                : ""
            }
            required
            onChange={setInputData}
          />
          <TextField
            label="Email address"
            variant="outlined"
            fullWidth
            size="small"
            type="email"
            name="email"
            sx={{ mt: 4 }}
            value={
              ledgerDetails && ledgerDetails.email ? ledgerDetails.email : ""
            }
            onChange={setInputData}
          />
          <TextField
            label="PAN/AVT No."
            variant="outlined"
            fullWidth
            size="small"
            name="panvat"
            sx={{ mt: 4 }}
            value={
              ledgerDetails && ledgerDetails.panvat ? ledgerDetails.panvat : ""
            }
            onChange={setInputData}
          />
        </Box>
        <Box>
          <Button variant="outlined" fullWidth sx={{ mt: 4 }} type="submit">
            Add
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
export default AddUserModal;
