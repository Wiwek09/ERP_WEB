import { Autocomplete, Container, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { IParams } from "../../../../interfaces/params";
import { IVoucher } from "../../../../interfaces/voucher";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import { _deleteContra_ } from "./helperFunction";
import TableComponent from "./TableComponent";
import { makeStyles } from "@mui/styles";
import { IoIosAddCircleOutline } from "react-icons/io";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { DeleteDialog } from "../../../../components/dialogBox";
import { useAppSelector } from "../../../../app/hooks";
import Ledgerbycus from "../../../../components/showRemain/ledgerbycus";

interface IProps {
  data: IVoucher;
  setData: any;
  debitAmount: number;
  setDebitAmount: any;
  sourceAccountList: any;
  setAddModalDialog: any;
  handleUdateDataOnDelete: Function;
}
interface IAccountList {
  label: string;
  value: any;
}
const useStyles = makeStyles({
  accounts: {
    float: "left",
    width: "calc(100% - 48px)",
  },
  addAccounts: {
    float: "left",
    marginLeft: "5px",
    paddingTop: "7px",
    paddingBottom: "4px",
    display: "block",
    width: "39px",
    fontSize: 38,
    cursor: "pointer",
    border: "1px solid",
    borderRadius: "4px",
  },
  flexProperty: {
    display: "flex",
  },
});
const ContraForm = ({
  data,
  setData,
  debitAmount,
  setDebitAmount,
  sourceAccountList,
  setAddModalDialog,
  handleUdateDataOnDelete,
}: IProps) => {
  const classes = useStyles();
  const { id }: IParams = useParams();
  const history = useHistory();
  const [openDialog, setOpenDialog] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const deleteContra = async () => {
    const response = await _deleteContra_(parseInt(id), data);
    if (response) {
      history.push("/contra");
    }
  };
  const sourceAccount =
    sourceAccountList &&
    sourceAccountList.find(
      (obj: IAccountList) => obj.value === data.SourceAccountTypeId
    );

  return (
    <>
      <Container maxWidth="xl">
        <Grid container maxWidth="xl" spacing={2}>
          <Grid
            item
            xs={12}
            md={10}
            sx={{ mt: 5 }}
            className={classes.flexProperty}
          >
            <Autocomplete
              disablePortal
              options={sourceAccountList && sourceAccountList}
              value={sourceAccount ? sourceAccount.label : ""}
              onChange={(e, v) =>
                setData({ ...data, SourceAccountTypeId: v.value })
              }
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="AccountId"
                  label="Account"
                  variant="outlined"
                  required
                  size="small"
                />
              )}
              className={classes.accounts}
              renderOption={handleRenderOption}
            />
            <IoIosAddCircleOutline
              onClick={(e) => setAddModalDialog(true)}
              className={classes.addAccounts}
            />
          </Grid>
          <Grid item xs={12} md={2} sx={{ mt: 5 }}>
            <Ledgerbycus cusID={data.SourceAccountTypeId} />
          </Grid>
          <Grid item xs={12} md={12}>
            <TableComponent
              setData={setData}
              data={data}
              setDebitAmount={setDebitAmount}
              accountList={sourceAccountList}
              setAddModalDialog={setAddModalDialog}
              handleUdateDataOnDelete={handleUdateDataOnDelete}
            />
          </Grid>

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
                {loginedUserRole.includes("BankDelete") ? (
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
        deleteData={deleteContra}
      />
    </>
  );
};

export default ContraForm;
