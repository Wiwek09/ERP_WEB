import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router";
import { DeleteDialog } from "../../../../components/dialogBox";
import { deleteWarehouseType } from "../../../../services/warehouseTypeApi";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { IWarehouseType } from "./addEdit";

interface IProps {
  onSubmit: any;
  data: IWarehouseType;
  setData: any;
  id: string;
}

const AddEditForm = ({ onSubmit, data, setData, id }: IProps) => {
  const history = useHistory();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const deleteData = async () => {
    const response = await deleteWarehouseType(id);
    if (response === 1) {
      setOpenDialog(false);
      history.push("/warehouse-types");
    } else {
      errorMessage();
    }
  };

  return (
    <>
      <Paper
        sx={{
          py: 2,
          mt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& > :not(style)": { m: 1 },
        }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <Grid container spacing={2} maxWidth="md" sx={{ margin: "auto" }}>
          <Grid item xs={12} md={12}>
            <InputField
              helperText="Enter warehouse type name"
              value={data ? data.Name : ""}
              onChange={(e) => setData({ ...data, Name: e.target.value })}
              name="Name"
              label="Name"
              required
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end" }}>
            {id === "add" ? (
              <>
                <SaveButton />
                <CloseButton />
              </>
            ) : (
              <>
                <UpdateButton />
                <DeleteButton onClick={() => setOpenDialog(true)} />
                <CloseButton />
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      <DeleteDialog
        name={data ? data.Name : ""}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteData={deleteData}
      />
    </>
  );
};

export default AddEditForm;
