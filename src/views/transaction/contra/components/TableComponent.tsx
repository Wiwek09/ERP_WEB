import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Autocomplete, IconButton, Paper, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { toast } from "react-toastify";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiDelete } from "react-icons/fi";
import {
  IAccountTransactionValue,
  IVoucher,
} from "../../../../interfaces/voucher";
import { deleteJournalRow } from "../../../../services/journalApi";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { Box } from "@mui/system";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import Ledgerbycus from "../../../../components/showRemain/ledgerbycus";
import { useState } from "react";

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

interface IProps {
  setData: any;
  data: IVoucher;
  setDebitAmount: any;
  accountList: any;
  setAddModalDialog: any;
  handleUdateDataOnDelete: Function;
}

interface IAccountList {
  label: string;
  value: any;
}

const TableComponent = ({
  setData,
  data,
  setDebitAmount,
  accountList,
  setAddModalDialog,
  handleUdateDataOnDelete,
}: IProps) => {
  const classes = useStyles();
  const AccountTransactionValues = data.AccountTransactionValues;
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);

  const addNewRow = () => {
    let lastRow = AccountTransactionValues.length - 1;
    if (
      AccountTransactionValues[lastRow].AccountId === null ||
      AccountTransactionValues[lastRow].Debit === 0
    ) {
      toast.error("Fill the fields before procced");
    } else {
      const list = [
        ...AccountTransactionValues,
        {
          AccountId: null,
          Debit: 0,
          Description: null,
        },
      ];
      setData({ ...data, ["AccountTransactionValues"]: list });
    }
  };

  const deleteRow = async (index: number, id: number) => {
    if (id > 0) {
      const response = await deleteJournalRow(id);
      if (response) {
        handleUdateDataOnDelete(index);
        errorMessage("data deleted successfully");
      }
    }
    const list = [...AccountTransactionValues];
    list.splice(index, 1);
    setData({ ...data, ["AccountTransactionValues"]: list });
  };

  const onChangeFieldhandler = (e: any, ind: number) => {
    let name = e.target.name;
    let value = e.target.value;
    let list = [...AccountTransactionValues];
    switch (name) {
      case "AccountId":
        list[ind]["AccountId"] = value;
        break;
      case "Debit":
        list[ind]["Debit"] = value;
        break;
      case "Description":
        list[ind]["Description"] = value;
        break;
    }
    setData({ ...data, ["AccountTransactionValues"]: list });
  };

  const onChangeHandlerSelect = (index: number, value: number) => {
    let list = [...AccountTransactionValues];
    list[index]["AccountId"] = value;
    list[index]["LedgetBalance"] = value;
    setData({ ...data, ["AccountTransactionValues"]: list });
    setSelectedCustomerId(value);
  };

  setDebitAmount &&
    setDebitAmount(
      AccountTransactionValues.reduce((amt: number, val: any) => {
        return amt + parseFloat(val.Debit);
      }, 0)
    );

  return (
    <>
      <Table sx={{ mt: 3 }} aria-label="simple table">
        <TableHead>
          <TableRow component={Paper}>
            <TableCell width="40%" align="left">
              Account
            </TableCell>
            {selectedCustomerId ? (
              <TableCell width="10%" align="left">
                Ledger Balance
              </TableCell>
            ) : (
              ""
            )}
            <TableCell width="10%" align="left">
              Debit
            </TableCell>

            <TableCell width="20%" align="left">
              Description
            </TableCell>
            {AccountTransactionValues && AccountTransactionValues.length > 1 && (
              <TableCell width="5%" align="left">
                Action
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody sx={{ mt: 2 }}>
          {AccountTransactionValues &&
            AccountTransactionValues.map(
              (item: IAccountTransactionValue, index: number) => {
                let account =
                  accountList &&
                  accountList.find(
                    (obj: IAccountList) => obj.value === item.AccountId
                  );
                return (
                  <TableRow key={index}>
                    <TableCell
                      sx={{ paddingX: "1px" }}
                      align="left"
                      className={classes.flexProperty}
                    >
                      <Autocomplete
                        disablePortal
                        options={accountList && accountList}
                        value={account ? account.label : ""}
                        onChange={(e, v) =>
                          onChangeHandlerSelect(index, v.value)
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
                    </TableCell>
                    {item.LedgetBalance ? (
                      <TableCell>
                        <Ledgerbycus cusID={item.LedgetBalance} />
                      </TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell sx={{ paddingX: "1px" }} align="center">
                      <TextField
                        required
                        fullWidth
                        id="outlined-required"
                        InputProps={{
                          inputProps: {
                            min: "",
                          },
                        }}
                        type="number"
                        label="Debit"
                        size="small"
                        value={item && item.Debit ? item.Debit : ""}
                        name="Debit"
                        onChange={(e) => onChangeFieldhandler(e, index)}
                      />
                    </TableCell>

                    <TableCell sx={{ paddingX: "1px" }} align="center">
                      <TextField
                        fullWidth
                        id="outlined-required"
                        label="Description"
                        size="small"
                        value={item ? item.Description : ""}
                        name="Description"
                        onChange={(e) => onChangeFieldhandler(e, index)}
                      />
                    </TableCell>

                    {AccountTransactionValues &&
                      AccountTransactionValues.length > 1 && (
                        <TableCell sx={{ paddingX: "1px" }} align="center">
                          <IconButton
                            color="error"
                            onClick={(e) => deleteRow(index, item.Id)}
                          >
                            <FiDelete />
                          </IconButton>
                        </TableCell>
                      )}
                  </TableRow>
                );
              }
            )}
        </TableBody>
      </Table>
      <Box>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<BiPlus />}
          sx={{ mx: 1 }}
          onClick={addNewRow}
        >
          Add
        </Button>
      </Box>
    </>
  );
};

export default TableComponent;
