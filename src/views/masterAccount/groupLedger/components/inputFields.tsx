import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DeleteDialog } from "../../../../components/dialogBox";

import { IUnderGroupLedger } from "../../../../interfaces/underGroupLedger";
import { deleteUnderLedger } from "../../../../services/groupLedgerApi";
import { getAllUnderLedger } from "../../../../services/masterLedgerAPI";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import {
  deleteMessage,
  errorMessage,
} from "../../../../utils/messageBox/Messages";

interface ISelectType {
  label: any;
  value: any;
}
const InputForm = ({ allData, setAllData, id }: any) => {
  const [underLedger, setUnderLedger] = useState<ISelectType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const loadData = async () => {
    const underGroupLedger: IUnderGroupLedger[] = await getAllUnderLedger();
    if (underGroupLedger) {
      setUnderLedger(
        underGroupLedger.map((e: any) => {
          return {
            value: e.Id,
            label: e.Name,
          };
        })
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const accountTypeValue =
    underLedger &&
    underLedger.find((obj: any) => obj.value == allData.UnderGroupLedger);

  const inputHandler = (e: any) => {
    setAllData({
      ...allData,
      [e.target.name]: e.target.value,
    });
  };

  const history = useHistory();
  const deleteData = async () => {
    const res = await deleteUnderLedger(id);
    if (res === 1) {
      deleteMessage();
      history.push("/group-ledger");
      setOpenDialog(false);
    } else {
      errorMessage();
      setOpenDialog(false);
    }
  };

  return (
    <>
      <Grid container maxWidth="lg" spacing={2} sx={{ mx: "auto", px: 2 }}>
        <Grid item xs={12} md={4}>
          <InputField
            helperText="Please enter name"
            placeholder="Name"
            name="Name"
            label="Name"
            required
            autoFocus
            value={allData.Name ? allData.Name : ""}
            onChange={(e) => inputHandler(e)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            disablePortal
            options={underLedger && underLedger}
            value={accountTypeValue ? accountTypeValue.label : null}
            onChange={(e, v) =>
              setAllData({ ...allData, UnderGroupLedger: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="UnderGroup Ledger"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose undergroup ledger"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "Liabilities",
                value: "Liabilities",
              },
              {
                label: "Assets",
                value: "Assets",
              },
              {
                label: "Expenses",
                value: "Expenses",
              },
              {
                label: "Income",
                value: "Income",
              },
            ]}
            value={allData.NatureofGroup}
            onChange={(e, v) =>
              setAllData({ ...allData, NatureofGroup: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nature of Group"
                variant="outlined"
                size="small"
                error={!allData.NatureofGroup}
                required
                fullWidth
                helperText="Please choose nature group"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "Dr",
                value: "Dr",
              },
              {
                label: "Cr",
                value: "Cr",
              },
            ]}
            value={allData.DefaultFilterType}
            onChange={(e, v) =>
              setAllData({ ...allData, DefaultFilterType: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Default Filter Type"
                variant="outlined"
                size="small"
                required
                error={!allData.DefaultFilterType}
                fullWidth
                helperText="Please choose default filter type"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "Dr",
                value: "Dr",
              },
              {
                label: "Cr",
                value: "Cr",
              },
            ]}
            value={allData.WorkingRule}
            onChange={(e, v) =>
              setAllData({ ...allData, WorkingRule: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Working Rule"
                variant="outlined"
                size="small"
                required
                error={!allData.WorkingRule}
                fullWidth
                helperText="Please choose working rule"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "Dr",
                value: "Dr",
              },
              {
                label: "Cr",
                value: "Cr",
              },
            ]}
            value={allData.SortOrder}
            onChange={(e, v) => setAllData({ ...allData, SortOrder: v.value })}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sort Order"
                variant="outlined"
                required
                error={!allData.SortOrder}
                size="small"
                fullWidth
                helperText="Please choose sort order"
              />
            )}
          />
        </Grid>

        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ISBILLWISEON}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ISBILLWISEON: !allData.ISBILLWISEON,
                  })
                }
              />
            }
            label="BillWiseOn"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ISREVENUE}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ISREVENUE: !allData.ISREVENUE,
                  })
                }
              />
            }
            label="Revenue"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ISADDABLE}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ISADDABLE: !allData.ISADDABLE,
                  })
                }
              />
            }
            label="Addable"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ISCONDENSED}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ISCONDENSED: !allData.ISCONDENSED,
                  })
                }
              />
            }
            label="Condensed"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.AFFECTSSTOCK}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    AFFECTSSTOCK: !allData.AFFECTSSTOCK,
                  })
                }
              />
            }
            label="Affects Stock"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.SORTPOSITION}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    SORTPOSITION: !allData.SORTPOSITION,
                  })
                }
              />
            }
            label="Sort Position"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.DebitCreditBalanceReporting}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    DebitCreditBalanceReporting:
                      !allData.DebitCreditBalanceReporting,
                  })
                }
              />
            }
            label="Debit Credit Balance Reporting"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.UsedforCalculation}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    UsedforCalculation: !allData.UsedforCalculation,
                  })
                }
              />
            }
            label="Used For Calculation"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.GroupSubLedger}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    GroupSubLedger: !allData.GroupSubLedger,
                  })
                }
              />
            }
            label="Group Sub Ledger"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.PurchaseInvoiceAllocation}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    PurchaseInvoiceAllocation:
                      !allData.PurchaseInvoiceAllocation,
                  })
                }
              />
            }
            label="Purchase Invoice Allocation"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ISCOSTCENTRESON}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ISCOSTCENTRESON: !allData.ISCOSTCENTRESON,
                  })
                }
              />
            }
            label="Cost Center On"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ISDEEMEDPOSITIVE}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ISDEEMEDPOSITIVE: !allData.ISDEEMEDPOSITIVE,
                  })
                }
              />
            }
            label="Demand Positive"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.AFFECTSGROSSPROFIT}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    AFFECTSGROSSPROFIT: !allData.AFFECTSGROSSPROFIT,
                  })
                }
              />
            }
            label="Affects Gross Profit"
          />
        </Grid>
        <Grid item lg={3} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.TRACKNEGATIVEBALANCES}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    TRACKNEGATIVEBALANCES: !allData.TRACKNEGATIVEBALANCES,
                  })
                }
              />
            }
            label="Track Negative Balances"
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "end" }}>
          {id === "add" ? (
            <>
              <SaveButton variant="outlined" />
              <CloseButton variant="outlined" />
            </>
          ) : (
            <>
              <UpdateButton variant="outlined" />
              <DeleteButton
                variant="outlined"
                onClick={() => setOpenDialog(true)}
              />
              <CloseButton variant="outlined" />
            </>
          )}
        </Grid>
        <DeleteDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          name={allData ? allData.Name : ""}
          deleteData={deleteData}
        />
      </Grid>
    </>
  );
};

export default InputForm;
