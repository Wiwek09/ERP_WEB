import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ReportOffIcon from '@mui/icons-material/ReportOff';
import React from "react";

interface IProps {
  openDialog: boolean;
  setOpenDialog: (e?: any) => void;
  name: string;
  deleteData: (e?: any) => void;
}
interface IPropsSave {
  openDialog: boolean;
  setOpenDialog: (e?: any) => void;
  name: string;
}

export const DeleteDialog = ({
  openDialog,
  setOpenDialog,
  name,
  deleteData,
}: IProps) => {
  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          Do you want to delete {name}?
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", m: 0, p: 0 }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ textAlign: "center" }}
            color="error"
          >
            <DeleteSweepIcon sx={{ textAlign: "center", fontSize: 100 }} />
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            <HighlightOffIcon /> Cancel
          </Button>
          <Button onClick={deleteData} color="error">
            <DeleteOutlineIcon /> Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const PermissionDialog = ({
  openDialog,
  setOpenDialog,
  name,
}: IPropsSave) => {
  const handleClose = () => {
    setOpenDialog(false);
    
  };
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          Sorry! No permission to Add {name}?
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", m: 0, p: 0 }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ textAlign: "center" }}
            color="secondary"
          >
            <ReportOffIcon sx={{ textAlign: "center", fontSize: 100 }} />
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const SaveProgressDialog = ({
  openDialog,
  setOpenDialog,
  name,
}: IPropsSave) => {
  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          {name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};