import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  Paper,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useEffect, useState } from "react";

import { BiPlus } from "react-icons/bi";

import { toast } from "react-toastify";
import { IWarehouseType } from "../../warehouseType/components/addEdit";
import { getAllWarehouseTypes } from "../../../../services/warehouseTypeApi";
import { addWarehouseData } from "../../../../services/warehouseApi";
import { IWarehouse } from "../../../../interfaces/warehouse";
import { IOnChange, IOnSubmit } from "../../../../interfaces/event";
import InputField from "../../../../utils/customTextField";

interface IProps {
  openDialogWarehouse: any;
  setOpenDialogWarehouse: any;
  getRefreshList: any;
}
interface IList {
  label: "string";
  value: any;
}
const AddWarehouseModal = ({
  openDialogWarehouse,
  setOpenDialogWarehouse,
  getRefreshList,
}: IProps) => {
  const [data, setData] = useState<IWarehouse>({
    Name: "",
    WareHouseTypeId: 0,
    BranchId: 0,
    SortOrder: "",
  });
  const [warehouseType, setWarehouseType] = useState<IList[]>([]);

  const getWarehouseType = async () => {
    const response = await getAllWarehouseTypes();
    if (response) {
      setWarehouseType(
        response.map((item: IWarehouseType) => ({
          label: item.Name,
          value: item.Id,
        }))
      );
    }
  };

  useEffect(() => {
    getWarehouseType();
  }, []);

  const handleClose = () => {
    setOpenDialogWarehouse(false);
  };

  const addNewWarehouse = async () => {
    const response = await addWarehouseData(data);
    if (response) {
      setData({
        Name: "",
        WareHouseTypeId: 0,
        BranchId: 0,
        SortOrder: "",
      });
      getRefreshList();
      handleClose();
    } else {
      toast.error("Problem on Adding warehouse");
      handleClose();
    }
  };

  const onSubmit = (e: IOnSubmit) => {
    e.preventDefault();
    addNewWarehouse();
  };

  return (
    <>
      <>
        <Dialog
          open={openDialogWarehouse}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <DialogTitle
            id="form-dialog-title"
            sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}
          >
            Add new warehouse
          </DialogTitle>
          <Paper component="form" autoComplete="off" onSubmit={onSubmit}>
            <DialogContent sx={{ m: 2, p: 2, height: "240px" }}>
              <InputField
                helperText="please enter warehouse name"
                placeholder="Warehouse"
                value={data && data.Name}
                onChange={(e) => setData({ ...data, ["Name"]: e.target.value })}
                name="Warehouse"
                label="Warehouse"
                required
              />
              <Autocomplete
                disablePortal
                options={warehouseType && warehouseType}
                onChange={(e, v) =>
                  setData({ ...data, WareHouseTypeId: v.value })
                }
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText="Please select warehouse type"
                    placeholder="Warehouse type"
                    name="Warehouse type"
                    label="Warehouse type"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    sx={{ marginY: "15px" }}
                  />
                )}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} variant="outlined" color="primary">
                <HighlightOffIcon /> Cancel
              </Button>
              <Button type="submit" variant="outlined" color="success">
                <BiPlus /> Add
              </Button>
            </DialogActions>
          </Paper>
        </Dialog>
      </>
    </>
  );
};

export default AddWarehouseModal;
