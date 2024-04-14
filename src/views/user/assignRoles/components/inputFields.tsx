import { useEffect, useState } from "react";
import { Autocomplete, Grid, Paper, TextField } from "@mui/material";
import { CloseButton, UpdateButton } from "../../../../utils/buttons";
import { getAllRoles } from "../../../../services/userRoleApi";
import FormHeader from "../../../../components/headers/formHeader";
import { IUserRole } from "../../../../interfaces/userRoles";
import { IUserRolesAssign } from "../../../../interfaces/roles";
import InputField from "../../../../utils/customTextField";

interface IProps {
  assignRole: IUserRolesAssign;
  setAssignRole: any;
  updateRole: any;
}

interface ISelectType {
  label: any;
  value: any;
}

const InputForm = ({ assignRole, setAssignRole, updateRole }: IProps) => {
  const [roles, setRoles] = useState<ISelectType[]>([]);
  const loadData = async () => {
    const roles: IUserRole[] = await getAllRoles();
    if (roles) {
      setRoles(
        roles.map((elm) => {
          return { label: elm.Name, value: elm.Id };
        })
      );
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const rolesValue =
    roles && roles.find((obj) => obj.value === assignRole.RoleName);
  return (
    <>
      <FormHeader headerName="Edit Assign Role" />
      <Paper
        component="form"
        autoComplete="off"
        sx={{ display: "flex", justifyContent: "center", mt: 2, py: 2, px: 2 }}
        onSubmit={updateRole}
      >
        <Grid container spacing={1} maxWidth="lg">
          <Grid item xs={12} md={6}>
            <InputField
              autoFocus
              name="Name"
              label="Name"
              placeholder="Name"
              value={assignRole ? assignRole.FullName : ""}
              onChange={(e) =>
                setAssignRole({ ...assignRole, FullName: e.target.value })
              }
              required
              helperText="Enter name"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disableClearable
              options={roles}
              onChange={(e, v) =>
                setAssignRole({ ...assignRole, RoleName: v.value })
              }
              value={rolesValue ? rolesValue.label : null}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Roles *"
                  variant="outlined"
                  fullWidth
                  size="small"
                  helperText="Select roles"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end" }}>
            <UpdateButton variant="outlined" />
            <CloseButton variant="outlined" />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default InputForm;
