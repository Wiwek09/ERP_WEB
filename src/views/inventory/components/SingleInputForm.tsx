import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import { DeleteDialog } from "../../../components/dialogBox";
import FormHeader from "../../../components/headers/formHeader";
import { ICategory } from "../../../interfaces/category";
import { IUnitType } from "../../../interfaces/unitType";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../utils/buttons";
import InputField from "../../../utils/customTextField";


interface IProps {
  headerName: string;
  data: ICategory | IUnitType;
  setData: any;
  action: string;
  onSubmit: any;
  deleteFunction?: any;
}

const SingleInputForm = ({
  headerName,
  data,
  setData,
  action,
  onSubmit,
  deleteFunction,
}: IProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <>
      <FormHeader
        headerName={
          action === "add" ? `Add ${headerName}` : `Edit ${headerName}`
        }
      />
      <Paper
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
        sx={{
          py: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container maxWidth="md" spacing={4} sx={{ margin: "auto" }}>
          <Grid item xs={12} md={12}>
            <InputField
              name="Name"
              type="string"
              label="Name"
              value={data.Name}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              helperText="Please enter name"
              required
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
            {action === "add" ? (
              <SaveButton variant="outlined" />
            ) : (
              <>
                <UpdateButton variant="outlined" />
                <DeleteButton
                  variant="outlined"
                  onClick={(e) => setOpenDialog(true)}
                />
              </>
            )}

            <CloseButton variant="outlined" />
          </Grid>
        </Grid>
      </Paper>
      <DeleteDialog
        name={data ? data.Name : ""}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteData={deleteFunction}
      />
    </>
  );
};

export default SingleInputForm;
