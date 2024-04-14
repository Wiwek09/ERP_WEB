import { Container, Grid, TextField } from "@mui/material";
import { useHistory, useParams } from "react-router";
import { IParams } from "../../../../interfaces/params";
import { IVoucher } from "../../../../interfaces/voucher";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import TableComponent from "../components/TableComponent";
import { useState } from "react";
import { _deleteJournal_ } from "./helperFunctions";
import { DeleteDialog } from "../../../../components/dialogBox";
import { useAppSelector } from "../../../../app/hooks";
interface IProps {
  data: IVoucher;
  setData: any;
  debitAmount: number;
  setDebitAmount: any;
  setCreditAmount: any;
  creditAmount: number;
  accountList: any;
  setAddModalDialog: any;
  handleUdateDataOnDelete: Function;
}

const JournalForm = ({
  data,
  setData,
  debitAmount,
  setDebitAmount,
  creditAmount,
  setCreditAmount,
  accountList,
  setAddModalDialog,
  handleUdateDataOnDelete,
}: IProps) => {
  const { id }: IParams = useParams();
  const history = useHistory();
  const [openDialog, setOpenDialog] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const deleteJournal = async () => {
    const response = await _deleteJournal_(parseInt(id), data);
    if (response) {
      history.push("/journal");
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <TableComponent
          setData={setData}
          data={data}
          setDebitAmount={setDebitAmount}
          setCreditAmount={setCreditAmount}
          accountList={accountList}
          setAddModalDialog={setAddModalDialog}
          handleUdateDataOnDelete={handleUdateDataOnDelete}
          debitAmount={debitAmount}
          creditAmount={creditAmount}
        />
        <Grid container maxWidth="xl" spacing={2}>
          <Grid item xs={12} md={8} sx={{ mt: 5 }}>
            <TextField
              helperText="Add voucher description"
              placeholder="Description"
              value={data.Description ? data.Description : ""}
              onChange={(e) =>
                setData({ ...data, ["Description"]: e.target.value })
              }
              multiline
              rows={4}
              name="Description"
              label="Description"
              fullWidth
              required
              error
            />
          </Grid>
          <Grid container item xs={12} md={4}>
            <Grid
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <TextField
                id="outlined-required"
                label="Debit"
                size="small"
                type="number"
                sx={{ marginX: 2 }}
                fullWidth
                value={debitAmount.toFixed(2)}
              />

              <TextField
                id="outlined-required"
                label="Credit"
                size="small"
                type="number"
                sx={{ marginX: 2 }}
                fullWidth
                value={creditAmount.toFixed(2)}
              />
            </Grid>
            <Grid container sx={{ marginX: 4 }}>
              <input type="file" />
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "end", py: 4 }}>
            {id === "add" ? (
              <SaveButton variant="outlined" />
            ) : (
              <>
                {" "}
                <UpdateButton variant="outlined" />{" "}
                {loginedUserRole.includes("JournalDelete") ? (
                  <DeleteButton
                    variant="outlined"
                    onClick={(e) => setOpenDialog(true)}
                  />
                ) : (
                  ""
                )}{" "}
              </>
            )}

            <CloseButton variant="outlined" />
          </Grid>
        </Grid>
      </Container>
      <DeleteDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        name={data.Name}
        deleteData={deleteJournal}
      />
    </>
  );
};

export default JournalForm;
