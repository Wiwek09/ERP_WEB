import { Autocomplete, Grid, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {
  SaveButton,
  CloseButton,
  UpdateButton,
  DeleteButton,
} from "../../../../utils/buttons";
import {
  deleteWarehouseData,
  getAllWarehouseType,
} from "../../../../services/warehouseApi";
import { getAllBranch } from "../../../../services/branchApi";
import { IBranch } from "../../../../interfaces/branch";
import { IWarehouse } from "../../../../interfaces/warehouse";
import { useHistory } from "react-router";
import {
  deleteMessage,
  errorMessage,
} from "../../../../utils/messageBox/Messages";
import InputField from "../../../../utils/customTextField";
import { DeleteDialog } from "../../../../components/dialogBox";

interface IWarehouseType {
  Id: number;
  Name: string;
}
interface ISelectType {
  label: any;
  value: any;
}
interface IProps {
  allData: IWarehouse;
  setAllData: any;
  onSubmit: (e: any) => void;
  id: string;
}

const InputFormWarehouse = ({ allData, setAllData, onSubmit, id }: IProps) => {
  const [warehouseType, setWarehouseType] = useState<ISelectType[]>([]);
  const [branchDetails, setBranchDetails] = useState<ISelectType[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const history = useHistory();
  const getWareHouseType = async () => {
    const res: IWarehouseType[] = await getAllWarehouseType();
    setWarehouseType(
      res.map((item) => {
        return { label: item.Name, value: item.Id };
      })
    );
  };

  const getBranchData = async () => {
    const res: IBranch[] = await getAllBranch();
    setBranchDetails(
      res.map((item) => {
        return { label: item.NameEnglish, value: item.Id };
      })
    );
  };

  const branchValue =
    branchDetails &&
    branchDetails.find((obj) => obj.value === allData.BranchId);

  const warehouseValue =
    warehouseType &&
    warehouseType.find((obj) => obj.value === allData.WareHouseTypeId);

  const deleteData = async () => {
    try {
      const res = await deleteWarehouseData(id);
      if (res === 1) {
        setOpenDialog(false);
        deleteMessage();
        history.push("/warehouse");
      }
    } catch (error) {
      errorMessage();
    }
  };

  useEffect(() => {
    getWareHouseType();
    getBranchData();
  }, []);

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
        <Grid container maxWidth="lg" spacing={2}>
          <Grid item xs={12} md={6}>
            <InputField
              helperText="Enter warehouse name"
              placeholder="Name"
              value={allData.Name}
              onChange={(e) => setAllData({ ...allData, Name: e.target.value })}
              name="Name"
              label="Name"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputField
              helperText="Enter sort order"
              type="number"
              placeholder="Sort Order"
              value={allData.SortOrder}
              onChange={(e) =>
                setAllData({ ...allData, SortOrder: e.target.value })
              }
              name="SortOrder"
              label="Sort Order"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              options={warehouseType}
              onChange={(e, v) =>
                setAllData({ ...allData, WareHouseTypeId: v.value })
              }
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              value={warehouseValue ? warehouseValue?.label : ""}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!allData.WareHouseTypeId}
                  label="WareHouse Type"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Select warehouse type"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              options={branchDetails ? branchDetails : []}
              defaultValue={branchDetails.find((v) => {
                if (v.value === allData.BranchId) {
                  return v.label[0];
                }
              })}
              value={branchValue ? branchValue?.label : ""}
              onChange={(e, v) => setAllData({ ...allData, BranchId: v.value })}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!allData.BranchId}
                  label="Branch"
                  variant="outlined"
                  fullWidth
                  size="small"
                  helperText="Select branch"
                />
              )}
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
        name={allData ? allData.Name : ""}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteData={deleteData}
      />
    </>
  );
};

export default InputFormWarehouse;
