import { Autocomplete, IconButton, Paper, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { BiUserPlus } from "react-icons/bi";
import { IFormData, IPosSelectedFormData } from "../interface";
import DropdownBox from "./DropdownBox";

interface IPrpos {
  branch: IFormData[];
  warehouse: IFormData[];
  department: IFormData[];
  ledger: IFormData[];
  selectedData: IPosSelectedFormData;
  updateSelectedData: (name: string, value: any | null) => void;
  displayAddUserModal: () => void;
}

// Custom style
const useStyles = makeStyles({
  addLedger: {
    float: "left",
    marginLeft: "8px",
    paddingTop: "7px",
    paddingBottom: "4px",
    display: "block",
    width: "40px",
  },
});
interface ISalesType {
  id: string | null;
  label: string | null;
}
const salesType: ISalesType[] = [
  { id: "Cash Sales", label: "Cash Sales" },
  { id: "Credit Sales", label: "Credit Sales" },
];

const PosForm = ({
  branch,
  warehouse,
  department,
  ledger,
  selectedData,
  updateSelectedData,
  displayAddUserModal,
}: IPrpos) => {
  const classes = useStyles();
  const [salesTypeValue, setSalesTypeValue] = useState<ISalesType | null>(null);

  const setSalesData = () => {
    if (selectedData.salesType !== null || selectedData.salesType === "") {
      setSalesTypeValue({
        id: selectedData.salesType,
        label: selectedData.salesType,
      });
    } else {
      setSalesTypeValue(null);
    }
  };

  useEffect(() => {
    setSalesData();
  }, [selectedData]);

  return (
    <Paper
      sx={{
        p: 2,
        display: "inline-block",
        width: "100%",
      }}
    >
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={salesType}
        size="small"
        isOptionEqualToValue={(option: ISalesType, value: ISalesType) =>
          option.id === value.id
        }
        value={salesTypeValue === null ? null : salesTypeValue}
        renderInput={(params) => <TextField {...params} label="Sales type" />}
        onChange={(event: any, newValue: ISalesType | null) => {
          updateSelectedData("salesType", newValue?.id);
        }}
      />
      <DropdownBox
        label="Select a branch"
        name="branch"
        sx={{ mt: 2 }}
        options={branch.length > 0 ? branch : branch}
        value={selectedData && selectedData.branch}
        onClickHandler={updateSelectedData}
      />

      <DropdownBox
        label="Select an warehouse"
        name="warehouse"
        sx={{ mt: 2 }}
        options={warehouse}
        value={selectedData && selectedData.warehouse}
        onClickHandler={updateSelectedData}
      />
      <DropdownBox
        label="Select a department"
        name="department"
        sx={{ mt: 2 }}
        options={department}
        value={selectedData && selectedData.department}
        onClickHandler={updateSelectedData}
      />
      <DropdownBox
        label="Select a customer"
        name="ledger"
        sx={{ mt: 2 }}
        options={ledger}
        value={selectedData && selectedData.ledger}
        onClickHandler={updateSelectedData}
      />
      <IconButton
        className={classes.addLedger}
        sx={{ border: 1, borderRadius: 1, mt: 2 }}
        size="small"
        onClick={displayAddUserModal}
      >
        <BiUserPlus />
      </IconButton>
    </Paper>
  );
};

export default PosForm;
