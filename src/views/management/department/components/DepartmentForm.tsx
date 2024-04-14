import { Grid, Paper } from "@mui/material";
import { DeleteDialog } from "../../../../components/dialogBox";
import { IDepartment } from "../../../../interfaces/department";
import { IOnChange, IOnSubmit } from "../../../../interfaces/event";
import {
  AddBtn,
  CloseButton,
  DeleteButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";

interface IProps {
  actionType: string | number;
  department: IDepartment;
  updateDepartmentField: (e: IOnChange) => void;
  addDepartment: (e: IOnSubmit) => void;
  updateDepartment: (e: IOnSubmit) => void;
  deleteDepartment: () => void;
  showDeleteModal: boolean;
  setShowDeleteModal: any;
}

const DepartmentForm = ({
  actionType,
  department,
  updateDepartmentField,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  showDeleteModal,
  setShowDeleteModal,
}: IProps) => {
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
        onSubmit={actionType === "add" ? addDepartment : updateDepartment}
      >
        <Grid container spacing={2} maxWidth="md" sx={{ margin: "auto" }}>
          <Grid item xs={12} md={12}>
            <InputField
              label="Name"
              required
              name="Name"
              value={department && department.Name ? department.Name : ""}
              onChange={updateDepartmentField}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end" }}>
            {actionType === "add" ? (
              <>
                <AddBtn />
                <CloseButton />
              </>
            ) : (
              <>
                <UpdateButton />
                <DeleteButton
                  onClick={() => setShowDeleteModal(!showDeleteModal)}
                />
                <CloseButton />
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      <DeleteDialog
        openDialog={showDeleteModal}
        setOpenDialog={setShowDeleteModal}
        name={department.Name ? department.Name : ""}
        deleteData={deleteDepartment}
      />
    </>
  );
};

export default DepartmentForm;
