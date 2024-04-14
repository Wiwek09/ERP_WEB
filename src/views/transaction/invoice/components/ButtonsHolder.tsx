import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { IActionType } from "../interfaces";
import { IoMdAdd } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { DeleteDialog } from "../../../../components/dialogBox";
import { useState } from "react";
import { useAppSelector } from "../../../../app/hooks";

interface IProps {
  actionType: IActionType;
  addInvoice: () => void;
  updateInvoice: () => void;
  deleteInvoice: () => void;
  cancelInvoice: () => void;
  reset: () => void;
  deleteDialog: any;
}

const ButtonsHolder = ({
  actionType,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  cancelInvoice,
  reset,
  deleteDialog
}: IProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: 5 }}>
        <Box>
          {actionType === "add" ? (
            <>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                sx={{ mx: 1 }}
                startIcon={<IoMdAdd />}
                onClick={() => addInvoice()}
              >
                Save
              </Button>
              <Button
                type="submit"
                variant="outlined"
                color="error"
                sx={{ mx: 1 }}
                startIcon={<RiDeleteBack2Fill />}
                onClick={cancelInvoice}
              >
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                sx={{ mx: 1 }}
                onClick={updateInvoice}
              >
                <BiPlus /> update sales
              </Button>
              {
                loginedUserRole.includes("InvDelete")?
                <Button
                  type="submit"
                  variant="outlined"
                  color="error"
                  sx={{ mx: 1 }}
                  onClick={(e) => setOpenDialog(true)}
                >
                  <DeleteOutlineIcon />
                  Delete
                </Button> :
                ""
              }
              
              <Button
                type="submit"
                variant="outlined"
                color="error"
                sx={{ mx: 1 }}
                onClick={cancelInvoice}
                startIcon={<RiDeleteBack2Fill />}
              >
                CLOSE
              </Button>
            </>
          )}
        </Box>
      </Box>
      <DeleteDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        name="suman"
        deleteData={deleteInvoice}
      />
    </>
  );
};

export default ButtonsHolder;
