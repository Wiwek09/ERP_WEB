import { Autocomplete, Grid, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { DeleteDialog } from "../../../../components/dialogBox";
import FormHeader from "../../../../components/headers/formHeader";
import { IBillTerm } from "../../../../interfaces/billTerm";
import { getAllMasterLedger } from "../../../../services/masterLedgerAPI";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import {
  amountType,
  applicableOn,
  termType,
} from "../../transactionType/helper/types";

interface IProps {
  headerName: string;
  data: IBillTerm;
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
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [ledgerData, setLedgerData] = useState<Array<any>>([]);
  const [selectedTerm, setSelectedTerm] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedApplicable, setSelectedApplicable] = useState<any>(null);
  const [selectedLedger, setSelectedLedger] = useState<any>(null);

  useEffect(() => {
    getAllMasterLedger().then((response) => {
      if (response) {
        let ledgerData: any = response.map((elm: any) => {
          return {
            value: elm.Id.toString(),
            label: elm.Name,
          };
        });

        setLedgerData(ledgerData);
      }
    });
  }, []);

  useEffect(() => {
    setSelectedType(amountType.find((item) => item.value === data.Type));
    setSelectedTerm(termType.find((item) => item.value === data.TermType));
    setSelectedApplicable(
      applicableOn.find((item) => item.value === data.ApplicableOn)
    );
    setSelectedLedger(
      ledgerData.find((item: any) => item.value === data.LinkedLedgerId)
    );
  }, [ledgerData]);

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
          p: 5,
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              options={termType}
              value={selectedTerm}
              onChange={(e, v) => {
                setSelectedTerm(
                  termType.find((item) => item.value === v.value)
                );
                setData({ ...data, TermType: v.value });
              }}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Term Type"
                  variant="outlined"
                  size="small"
                  required
                  error={!data.TermType}
                  fullWidth
                  helperText="Please choose term type"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              options={applicableOn}
              value={selectedApplicable}
              onChange={(e, v) => {
                setSelectedApplicable(
                  applicableOn.find((item) => item.value === v.value)
                );
                setData({ ...data, ApplicableOn: v.value });
              }}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Applicable On"
                  variant="outlined"
                  size="small"
                  required
                  error={!data.ApplicableOn}
                  fullWidth
                  helperText="Please choose applicable on"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              options={amountType}
              value={selectedType}
              onChange={(e, v) => {
                setSelectedType(
                  amountType.find((item) => item.value === v.value)
                );
                setData({ ...data, Type: v.value });
              }}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type"
                  variant="outlined"
                  size="small"
                  required
                  error={!data.Type}
                  fullWidth
                  helperText="Please choose type"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              name="Rate"
              type="number"
              label="Rate"
              value={data.Rate}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              helperText="Please enter name"
              required
              autoFocus
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              options={ledgerData || []}
              value={selectedLedger}
              onChange={(e, v) => {
                setSelectedLedger(
                  ledgerData.find((item) => item.value === v.value)
                );
                setData({ ...data, LinkedLedgerId: v.value });
              }}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Linked Ledger"
                  variant="outlined"
                  size="small"
                  required
                  error={!data.Type}
                  fullWidth
                  helperText="Please choose linked ledger"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
            {action === "add" ? (
              <SaveButton variant="outlined" />
            ) : (
              <>
                <UpdateButton variant="outlined" />
                {loginedUserRole.includes("BTDelete") && (
                  <DeleteButton
                    variant="outlined"
                    onClick={(e) => setOpenDialog(true)}
                  />
                )}
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
