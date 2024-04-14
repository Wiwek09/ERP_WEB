import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DeleteDialog } from "../../../../components/dialogBox";
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IUnderGroupLedger } from "../../../../interfaces/underGroupLedger";
import { getAllUnderLedger } from "../../../../services/masterLedgerAPI";
import { deleteTransactionType } from "../../../../services/transactionTypeApi";
import {
  DeleteButton,
  CloseButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import {
  deleteMessage,
  errorMessage,
} from "../../../../utils/messageBox/Messages";

const InputForm = ({ allData, setAllData, id }: any) => {
  const [underLedger, setUnderLedger] = useState<ISelectType[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const loadData = async () => {
    const underGroupLedger: IUnderGroupLedger[] = await getAllUnderLedger();
    if (underGroupLedger) {
      setUnderLedger(
        underGroupLedger.map((e) => {
          return {
            value: e.Id,
            label: e.Name,
          };
        })
      );
    }
  };

  const sourceAccValue =
    underLedger &&
    underLedger.find((obj) => obj.value === allData.SourceAccountTypeId);

  const targetAccValue =
    underLedger &&
    underLedger.find((obj) => obj.value === allData.TargetAccountTypeId);

  const defaultSourceAccValue =
    underLedger &&
    underLedger.find((obj) => obj.value === allData.DefaultSourceAccountId);

  const defaultTargetAccValue =
    underLedger &&
    underLedger.find((obj) => obj.value === allData.DefaultTargetAccountId);

  useEffect(() => {
    loadData();
  }, []);

  const history = useHistory();

  const deleteData = async () => {
    const res = await deleteTransactionType(id);
    if (res === 1) {
      deleteMessage();
      history.push("/transaction-type");
    } else {
      errorMessage();
    }
  };
  return (
    <>
      <Grid container maxWidth="lg" spacing={2} sx={{ mx: "auto", px: 2 }}>
        <Grid item xs={12} md={6}>
          <InputField
            helperText="Please enter name"
            placeholder="Name"
            name="Name"
            label="Name"
            required
            autoFocus
            value={allData.Name ? allData.Name : ""}
            onChange={(e) => setAllData({ ...allData, Name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}></Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={underLedger && underLedger}
            value={sourceAccValue ? sourceAccValue.label : null}
            onChange={(e, v) =>
              setAllData({ ...allData, SourceAccountTypeId: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Source Account Type"
                variant="outlined"
                size="small"
                required
                error={!allData.SourceAccountTypeId}
                fullWidth
                helperText="Please choose source account type"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={underLedger && underLedger}
            value={targetAccValue ? targetAccValue.label : null}
            onChange={(e, v) =>
              setAllData({ ...allData, TargetAccountTypeId: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Target Account Type"
                variant="outlined"
                size="small"
                required
                error={!allData.TargetAccountTypeId}
                fullWidth
                helperText="Please choose target account type"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={underLedger && underLedger}
            value={defaultSourceAccValue ? defaultSourceAccValue.label : null}
            onChange={(e, v) =>
              setAllData({ ...allData, DefaultSourceAccountId: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Default Source Account"
                variant="outlined"
                size="small"
                required
                error={!allData.DefaultSourceAccountId}
                fullWidth
                helperText="Please choose default source account"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={underLedger && underLedger}
            value={defaultTargetAccValue ? defaultTargetAccValue.label : null}
            onChange={(e, v) =>
              setAllData({ ...allData, DefaultTargetAccountId: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Default Target Account"
                variant="outlined"
                size="small"
                required
                error={!allData.DefaultTargetAccountId}
                fullWidth
                helperText="Please choose default target account"
              />
            )}
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
