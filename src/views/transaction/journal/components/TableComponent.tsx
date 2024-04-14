import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Autocomplete,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
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
import { useState } from "react";
import Ledgerbycus from "../../../../components/showRemain/ledgerbycus";

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
  setCreditAmount: any;
  accountList: any;
  setAddModalDialog: any;
  handleUdateDataOnDelete: Function;
  debitAmount: any;
  creditAmount: any;
}

interface IAccountList {
  label: string;
  value: any;
}

const TableComponent = ({
  setData,
  data,
  setDebitAmount,
  setCreditAmount,
  accountList,
  setAddModalDialog,
  handleUdateDataOnDelete,
  debitAmount,
  creditAmount,
}: IProps) => {
  const classes = useStyles();
  const AccountTransactionValues = data.AccountTransactionValues;
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);

  const addNewRow = () => {
    let lastRow = AccountTransactionValues.length - 1;
    if (
      AccountTransactionValues[lastRow].entityLists === null ||
      AccountTransactionValues[lastRow].AccountId === null ||
      (AccountTransactionValues[lastRow].Debit === 0 &&
        AccountTransactionValues[lastRow].Credit === 0)
    ) {
      toast.error("Fill the fields before procced");
    } else {
      const list = [
        ...AccountTransactionValues,
        {
          entityLists: null,
          AccountId: null,
          Debit: null,
          Credit: null,
          Description: null,
        },
      ];
      setData({ ...data, ["AccountTransactionValues"]: list });
    }
  };

  const canDeleteRow = (id: number) => {
    const currentItem = AccountTransactionValues.find((i: any) => i.Id === id);

    if (currentItem) {
      const { Debit = 0, Credit = 0 } = currentItem;
      const drAmt = debitAmount - Debit;
      const crAmt = creditAmount - Credit;
      if (drAmt === crAmt) {
        return true;
      }
      return false;
    }
    return true;
  };

  const deleteRow = async (index: number, id: number) => {
    if (canDeleteRow(id)) {
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
    } else {
      errorMessage("Debit and Credit amount must be equal");
    }
  };

  const onChangeFieldhandler = (e: any, ind: number) => {
    let name = e.target.name;
    let value = e.target.value;
    let list = [...AccountTransactionValues];
    switch (name) {
      case "entityLists":
        list[ind]["entityLists"] = value;
        list[ind]["Debit"] = 0;
        list[ind]["Credit"] = 0;
        break;
      case "AccountId":
        list[ind]["AccountId"] = value;
        break;
      case "Debit":
        list[ind]["Debit"] = value;
        break;
      case "Credit":
        list[ind]["Credit"] = value;
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

  setCreditAmount &&
    setCreditAmount(
      AccountTransactionValues.reduce((amt: number, val: any) => {
        return amt + parseFloat(val.Credit);
      }, 0)
    );

  return (
    <>
      <Table sx={{ mt: 3 }} aria-label="simple table">
        <TableHead>
          <TableRow component={Paper}>
            <TableCell width="5%" align="center">
              Dr/Cr
            </TableCell>
            <TableCell width="40%" align="center">
              Account
            </TableCell>
            {selectedCustomerId ? (
              <TableCell width="10%" align="center">
                Ledger Balance
              </TableCell>
            ) : (
              ""
            )}
            <TableCell width="10%" align="center">
              Debit
            </TableCell>
            <TableCell width="10%" align="center">
              Credit
            </TableCell>
            <TableCell width="20%" align="center">
              Description
            </TableCell>
            {AccountTransactionValues && AccountTransactionValues.length > 1 && (
              <TableCell width="5%" align="center">
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
                    <TableCell sx={{ paddingX: "2px" }} align="center">
                      <FormControl required fullWidth size="small">
                        <InputLabel id="type-select">Type</InputLabel>
                        <Select
                          labelId="type-select"
                          id="outlined-required"
                          label="Type"
                          size="small"
                          name="entityLists"
                          value={
                            item && item.entityLists ? item.entityLists : ""
                          }
                          onChange={(e) => onChangeFieldhandler(e, index)}
                        >
                          <MenuItem value={"Dr"}>Dr</MenuItem>
                          <MenuItem value={"Cr"}>Cr</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell
                      sx={{ paddingX: "2px" }}
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
                    <TableCell sx={{ paddingX: "2px" }} align="center">
                      <TextField
                        disabled={
                          AccountTransactionValues &&
                          AccountTransactionValues[index].entityLists === "Dr"
                            ? false
                            : true
                        }
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
                    <TableCell sx={{ paddingX: "2px" }} align="center">
                      <TextField
                        disabled={
                          AccountTransactionValues &&
                          AccountTransactionValues[index].entityLists === "Cr"
                            ? false
                            : true
                        }
                        required
                        fullWidth
                        id="outlined-required"
                        label="Credit"
                        size="small"
                        type="number"
                        InputProps={{
                          inputProps: {
                            min: "",
                          },
                        }}
                        value={item && item.Credit ? item.Credit : ""}
                        name="Credit"
                        onChange={(e) => onChangeFieldhandler(e, index)}
                      />
                    </TableCell>
                    <TableCell sx={{ paddingX: "2px" }} align="center">
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
                        <TableCell sx={{ paddingX: "2px" }} align="center">
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
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: 2 }}>
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
