import { useState, useEffect } from "react";
import {
  Grid,
  IconButton,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { IAutoComplete } from "../interfaces";
import { IVoucher, IDebit } from "../../../../interfaces/purchase";
import { BiPlus } from "react-icons/bi";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
// import isAccountAlreadyUsed from "./Products";
import { isAccountUsed } from "./accountUtils";

interface IProps {
  accountData: IAutoComplete[];
  selectedVoucher: IVoucher[];
  debitSection: IDebit[];
  addNewVoucher: () => void;
  updateSelectedVoucher: (
    index: number,
    name: string,
    value: any,
    accountId?: number,
    description?: string
  ) => void;
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
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {selectedVoucher.map((data, index) => {
            if (data.Credit > 0 || data.Debit > 0 || data.Id === 0) {
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
                            getAccountData(data.AccountId)
                            // debit && debit
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="Account" />
                          )}
                          onChange={(
                            event: any,
                            newValue: IAutoComplete | null
                          ) => {
                            const accountId = newValue ? newValue.id : null;
                            const isAccountUsed =
                              isAccountAlreadyUsed(accountId);

                            if (!isAccountUsed) {
                              updateSelectedVoucher(
                                index,
                                "AccountId",
                                newValue && newValue.id
                              );
                              setDebit(newValue);
                            } else {
                              newValue = null;
                            }
                          }}
                          renderOption={handleRenderOption}
                        />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          label="Debit"
                          size="small"
                          fullWidth
                          value={data.Credit > 0 ? data.Credit : data.Debit}
                          onChange={(e) => {
                            updateSelectedVoucher(
                              index,
                              "Debit",
                              parseInt(e.target.value)
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          label="Description"
                          size="small"
                          fullWidth
                          value={data.Description ? data.Description : ""}
                          onChange={(e) => {
                            updateSelectedVoucher(
                              index,
                              "Description",
                              e.target.value
                            );
                          }}
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
                              onClick={() => {
                                updateSelectedVoucher(index, "AccountId", null);
                                deleteSelectedVoucher(index);
                              }}
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
            }
          })}
        </Grid>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}>
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
          </Box>
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
