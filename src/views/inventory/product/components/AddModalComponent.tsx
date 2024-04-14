import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useState } from "react";
import { addCategory } from "../../../../services/categoryApi";
import { addBranch } from "../../../../services/branchApi";
import { addDepartment } from "../../../../services/departmentApi";
import { addUnitType } from "../../../../services/unitTypeApi";
import { toast } from "react-toastify";
import { IOnSubmit } from "../../../../interfaces/event";
import { BiPlus } from "react-icons/bi";
import InputField from "../../../../utils/customTextField";

interface IProps {
  openDialogAdd: any;
  setOpenDialogAdd: any;
  selectedHeading: string;
  getRefreshList: any;
}
const AddModalComponent = ({
  openDialogAdd,
  setOpenDialogAdd,
  selectedHeading,
  getRefreshList,
}: IProps) => {
  const handleClose = () => {
    setOpenDialogAdd(false);
  };

  const [name, setName] = useState("");
  const addingFunction = async () => {
    if (selectedHeading === "category") {
      const response = await addCategory({ Name: name });
      return response;
    } else if (selectedHeading === "branch") {
      const response = await addBranch({ NameEnglish: name });
      return response;
    } else if (selectedHeading === "department") {
      const response = await addDepartment({ Name: name });
      return response;
    } else if (selectedHeading === "unit type") {
      const response = await addUnitType({ Name: name });
      return response;
    }
  };

  const addItem = async () => {
    const response = await addingFunction();
    if (response === 1) {
      handleClose();
      setName("");
      getRefreshList(selectedHeading);
    } else {
      toast.error(`Problem on Adding ${selectedHeading}`);
      handleClose();
    }
  };

  const onSubmit = (e: IOnSubmit) => {
    e.preventDefault();
    addItem();
  };
  return (
    <>
      <Dialog
        open={openDialogAdd}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}
        >
          Add new {selectedHeading}
        </DialogTitle>
        <Paper autoComplete="off" component="form" onSubmit={onSubmit}>
          <DialogContent sx={{ m: 2, p: 2 }}>
            <InputField
              helperText={`please enter ${selectedHeading} name`}
              placeholder={selectedHeading}
              value={name && name}
              onChange={(e) => setName(e.target.value)}
              name={selectedHeading}
              label={selectedHeading}
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="outlined">
              <HighlightOffIcon /> Cancel
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

export default AddModalComponent;
