import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IOnSubmit } from "../../../interfaces/event";
import InputField from "../../../utils/customTextField";
import {
  addMasterLedger,
  getAllUnderLedger,
} from "../../../services/masterLedgerAPI";
import { IUnderGroupLedger } from "../../../interfaces/underGroupLedger";
import { IoMdClose } from "react-icons/io";
import { successMessage } from "../../../utils/messageBox/Messages";

interface IProps {
  openDialog: boolean;
  setOpenDialog: any;
  refreshFunction?: any;
}
interface IList {
  label: string;
  value: any;
}

const AddLedgerComponent = ({
  openDialog,
  setOpenDialog,
  refreshFunction,
}: IProps) => {
  const [ledgerData, setledgerData] = useState({
    Name: "",
    AccountTypeId: 0,
    Address: "",
    District: "",
    City: "",
    Street: "",
    PanNo: "",
    Telephone: "",
    Email: "",
  });
  const [underGroupMasterList, setUnderGroupMasterList] = useState<IList[]>([]);
  const getunderGroupMasterList = async () => {
    const response = await getAllUnderLedger();
    if (response) {
      setUnderGroupMasterList(
        response.map((data: IUnderGroupLedger) => ({
          label: data.Name,
          value: data.Id,
        }))
      );
    }
  };
  const handleClose = () => {
    setOpenDialog(false);
    setledgerData({
      Name: "",
      AccountTypeId: 0,
      Address: "",
      District: "",
      City: "",
      Street: "",
      PanNo: "",
      Telephone: "",
      Email: "",
    });
  };
  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    const response = await addMasterLedger(ledgerData);
    if (response > 0) {
      successMessage();
      setledgerData({
        Name: "",
        AccountTypeId: 0,
        Address: "",
        District: "",
        City: "",
        Street: "",
        PanNo: "",
        Telephone: "",
        Email: "",
      });
      refreshFunction();
      handleClose();
    }
  };

  useEffect(() => {
    getunderGroupMasterList();
  }, []);

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}
        >
          Add new ledger
          <IconButton
            sx={{ position: "absolute", top: "10px", right: "5px" }}
            onClick={handleClose}
          >
            <IoMdClose />
          </IconButton>
        </DialogTitle>
        <Paper autoComplete="off" component="form" onSubmit={onSubmit}>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter ledger name`}
              placeholder="Name"
              value={ledgerData && ledgerData.Name}
              onChange={(e) =>
                setledgerData({ ...ledgerData, Name: e.target.value })
              }
              name="Name"
              label="Name"
              required
            />
          </DialogContent>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <Autocomplete
              disablePortal
              options={underGroupMasterList && underGroupMasterList}
              value={
                underGroupMasterList &&
                underGroupMasterList.find(
                  (obj) => obj.value === ledgerData.AccountTypeId
                )
              }
              onChange={(e, v) =>
                setledgerData({ ...ledgerData, AccountTypeId: v.value })
              }
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Please select underGroup master"
                  placeholder="UnderGroup Master"
                  name="UnderGroup Master"
                  label="UnderGroup Master"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              )}
            />
          </DialogContent>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter Address`}
              placeholder="Address"
              value={ledgerData && ledgerData.Address}
              onChange={(e) =>
                setledgerData({ ...ledgerData, Address: e.target.value })
              }
              name="Address"
              label="Address"
            />
          </DialogContent>

          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter district`}
              placeholder="District"
              value={ledgerData && ledgerData.District}
              onChange={(e) =>
                setledgerData({ ...ledgerData, District: e.target.value })
              }
              name="District"
              label="District"
            />
          </DialogContent>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter city`}
              placeholder="City"
              value={ledgerData && ledgerData.City}
              onChange={(e) =>
                setledgerData({ ...ledgerData, City: e.target.value })
              }
              name="City"
              label="City"
            />
          </DialogContent>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter street`}
              placeholder="Name"
              value={ledgerData && ledgerData.Street}
              onChange={(e) =>
                setledgerData({ ...ledgerData, Street: e.target.value })
              }
              name="Street"
              label="Street"
            />
          </DialogContent>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter PAN No.`}
              placeholder="PAN No."
              value={ledgerData && ledgerData.PanNo}
              onChange={(e) =>
                setledgerData({ ...ledgerData, PanNo: e.target.value })
              }
              name="PanNo"
              label="PAN No."
            />
          </DialogContent>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter telepone No.`}
              placeholder="Telepone No."
              value={ledgerData && ledgerData.Telephone}
              onChange={(e) =>
                setledgerData({ ...ledgerData, Telephone: e.target.value })
              }
              type="number"
              name="Telephone"
              label="Telephone No."
            />
          </DialogContent>
          <DialogContent sx={{ mx: 2, px: 2, py: 1 }}>
            <InputField
              helperText={`please enter Email`}
              placeholder="Email"
              value={ledgerData && ledgerData.Email}
              onChange={(e) =>
                setledgerData({ ...ledgerData, Email: e.target.value })
              }
              type="email"
              name="Email"
              label="Email"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="outlined">
              <HighlightOffIcon />
              Cancel
            </Button>
            <Button type="submit" color="success" variant="outlined">
              <BiPlus /> Add
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default AddLedgerComponent;
