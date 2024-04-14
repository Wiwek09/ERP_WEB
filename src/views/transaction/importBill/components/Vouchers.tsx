import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { IDebit, IVoucher } from "../../../../interfaces/importBill";
import { IAutoComplete } from "../interfaces";
// import isAccountAlreadyUsed from "./Products";
import { isAccountUsed } from "./accountUtils";

interface IProps {
  accountData: IAutoComplete[];
  selectedVoucher: IVoucher[];
  debitSection: IDebit[];
  addNewVoucher: () => void;
  updateSelectedVoucher: (index: number, name: string, value: any) => void;
  deleteSelectedVoucher: (index: number) => void;
  total: number;
  grandTotal: number;
}

const Vouchers = ({
  accountData,
  selectedVoucher,
  debitSection,
  updateSelectedVoucher,
  addNewVoucher,
  deleteSelectedVoucher,
  total,
  grandTotal,
}: IProps) => {
  const [debit, setDebit] = useState<any>([]);
  const [credit, setCredit] = useState<any>(0);
  // const [grandtotal, setGrandTotal] = useState<any>(grandTotal);

  // useEffect(() => {
  //   setGrandTotal(grandTotal);
  // }, [grandTotal]);
  const getAccountData = (id: number): IAutoComplete | null => {
    for (let index = 0; index < accountData.length; index++) {
      const element = accountData[index];
      if (id === element.id) {
        return { id: element.id, label: element.label };
      }
    }
    return null;
  };

  function isAccountAlreadyUsed(accountId: any) {
    const selectedAccounts = [debit];

    return isAccountUsed(accountId, selectedAccounts);
  }

  return (
    <>
      <Box sx={{ marginTop: 3 }}>
        {/* <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {selectedVoucher.map((data, index) => {
            // {debitSection.map((data, index) => {
            return (
              <>
                <Grid item xs={12} key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        options={accountData}
                        size="small"
                        isOptionEqualToValue={(
                          option: IAutoComplete,
                          value: IAutoComplete
                        ) => option.id === value.id}
                        value={
                          // getAccountData(data.AccountId)
                          debit && debit
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Account" />
                        )}
                        onChange={(
                          event: any,
                          newValue: IAutoComplete | null
                        ) => {
                          const accountId = newValue ? newValue.id : null;
                          const isAccountUsed = isAccountAlreadyUsed(accountId);

                          if (!isAccountUsed) {
                            // updateSelectedVoucher(
                            //   index,
                            //   "AccountId",
                            //   newValue && newValue.id
                            // );
                            setDebit(newValue);
                          } else {
                            newValue = null;
                          }

                          // updateSelectedVoucher(
                          //   index,
                          //   "AccountId",
                          //   newValue && newValue.id
                          // );
                          // setDebit(newValue);
                        }}
                        renderOption={handleRenderOption}
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        label="Credit"
                        size="small"
                        fullWidth
                        value={credit > 0 ? credit : data.Debit}
                        onChange={(e) =>
                          // updateSelectedVoucher(
                          //   index,
                          //   "Debit",
                          //   parseInt(e.target.value)
                          // )
                          setCredit(e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        label="Description"
                        size="small"
                        fullWidth
                        value={data.Description}
                        // onChange={(e) =>
                        //   updateSelectedVoucher(
                        //     index,
                        //     "Description",
                        //     e.target.value
                        //   )
                        // }
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                      key={`delete${index}`}
                    >
                      <Box>
                        {selectedVoucher.length > 1 ? (
                          <IconButton
                            onClick={() => deleteSelectedVoucher(index)}
                          >
                            <BackspaceIcon sx={{ color: "red" }} />
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            );
          })}
        </Grid> */}
        <Box>
          {/* <Box sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}>
            <TextField
              label="Total"
              size="small"
              value={total + credit}
              type="number"
              // onChange={(e: any) => setGrandTotal(grandtotal - e)}
            />
            <Button
              variant="outlined"
              onClick={addNewVoucher}
              sx={{ marginLeft: 2 }}
            >
              <BiPlus />
              Add
            </Button>
          </Box> */}
          <Box sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}>
            <TextField
              label="Grand total"
              size="small"
              // value={grandtotal}
              value={Number(grandTotal + total) || grandTotal}
              type="number"
            />
            <Button variant="outlined" component="label" sx={{ marginLeft: 2 }}>
              <BiPlus />
              Upload File
              <input type="file" hidden />
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Vouchers;
