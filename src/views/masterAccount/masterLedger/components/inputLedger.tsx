import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  getAllMasterLedger,
  getAllUnderLedger,
} from "../../../../services/masterLedgerAPI";
import { IMasterLedger } from "../../../../interfaces/masterLedger";
import { IUnderGroupLedger } from "../../../../interfaces/underGroupLedger";
import InputField from "../../../../utils/customTextField";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { getAllBranch } from "../../../../services/branchApi";
import { IBranch } from "../../../../interfaces/branch";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { useParams } from "react-router-dom";
import { IParams } from "../../../../interfaces/params";
interface ISelectType {
  label: any;
  value: any;
}

interface IProps {
  allData: IMasterLedger;
  setAllData: any;
}

interface ISelect {
  label: string;
  value: number;
}

const InputLedger = ({ allData, setAllData }: IProps) => {
  const { id }: IParams = useParams();
  const [underLedger, setUnderLedger] = useState<ISelectType[]>([]);
  const [agent, setAgent] = useState<ISelectType[]>([]);
  const [branchList, setBranchList] = useState<any>([]);

  const loadData = async () => {
    const agents: IMasterLedger[] = await getAllMasterLedger();
    setAgent(
      agents.map((e) => {
        return {
          value: e.Id,
          label: e.Name,
        };
      })
    );

    const underGroupLedger: IUnderGroupLedger[] = await getAllUnderLedger();
    setUnderLedger(
      underGroupLedger.map((e) => {
        return {
          value: e.Id,
          label: e.Name,
        };
      })
    );

    const response = await getAllBranch();
    if (response) {
      setBranchList(
        response.map((item: IBranch) => ({
          label: item.NameEnglish,
          value: item.Id,
        }))
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if(id === "add"){
      if(agent.find((obj) => obj.label === allData.Name) || agent.find((obj) => obj.label.toLowerCase() === allData.Name)){
        errorMessage(`The name ${allData.Name} is already used...`);
      }
    }
    else{
    }
  }, [allData]);

  const agentValue = agent && agent.find((obj) => obj.value === allData.Agent);
  const accountTypeValue =
    underLedger &&
    underLedger.find((obj) => obj.value === allData.AccountTypeId);

  const inputHandler = (e: any) => {
    setAllData({
      ...allData,
      [e.target.name]: e.target.value,
    });
  };

  const optionsDrCr: ISelectType[] = [
    {
      label: "Dr",
      value: "Dr",
    },
    {
      label: "Cr",
      value: "Cr",
    },
  ];
  const DRCRValue =
    optionsDrCr && optionsDrCr.find((obj) => obj.value === allData.DRCR);
  const selectedBranch = branchList.find((obj: ISelect) => obj.value === allData.BranchId);

  return (
    <>
      <Grid container maxWidth="lg" spacing={2} sx={{ mx: "auto" }}>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={underLedger ? underLedger : []}
            value={accountTypeValue ? accountTypeValue.label : null}
            onChange={(e, v) =>
              setAllData({ ...allData, AccountTypeId: v.value })
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="UnderGroup Master"
                variant="outlined"
                size="small"
                error={!allData.AccountTypeId}
                required
                fullWidth
                helperText="Please choose undergroup master"
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={1}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item xs={12} sm={4}>
              <Autocomplete
                disablePortal
                options={optionsDrCr}
                value={DRCRValue ? DRCRValue.label : null}
                onChange={(e, v) => setAllData({ ...allData, DRCR: v.value })}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Debit/Credit"
                    variant="outlined"
                    size="small"
                    required
                    error={!allData.DRCR}
                    fullWidth
                    helperText="Select debit/credit"
                  />
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <InputField
                helperText="Please enter amount"
                placeholder="Amount"
                name="Amount"
                label="Amount"
                required
                type="number"
                error={!allData.Amount}
                value={allData.Amount}
                onChange={(e) => inputHandler(e)}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                fullWidth
                size="small"
                helperText="Please enter limit"
                placeholder="Credit Limit"
                name="CreditLimit"
                label="Credit Limit"
                type="number"
                value={allData.CreditLimit}
                onChange={(e) => inputHandler(e)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={1}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item sm={4} xs={12}>
              <TextField
                fullWidth
                size="small"
                helperText="Please enter days"
                placeholder="Credit Days"
                name="CreditDays"
                label="Credit Days"
                type="number"
                value={allData.CreditDays}
                onChange={(e) => inputHandler(e)}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Autocomplete
                disablePortal
                options={branchList}
                value={selectedBranch ? selectedBranch.label : null}
                onChange={(e, v) => setAllData({ ...allData, BranchId: v.value })}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="BranchId"
                    variant="outlined"
                    size="small"
                    error={!allData.BranchId}
                    fullWidth
                    helperText="Please choose Branch"
                  />
                )}
                renderOption={handleRenderOption}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={agent && agent}
            value={agentValue && agentValue ? agentValue.label : null}
            onChange={(e, v) => setAllData({ ...allData, Agent: v.value })}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Agent"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose agent"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={1}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item sm={4} xs={12}>
              <TextField
                fullWidth
                size="small"
                helperText="Please enter rate"
                placeholder="Rate of Interest"
                name="RateofInterest"
                label="Rate of Interest"
                type="number"
                value={allData.RateofInterest}
                onChange={(e) => inputHandler(e)}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                fullWidth
                size="small"
                helperText="Please enter guarentee"
                placeholder="Bank Guarentee"
                name="BankGuarentee"
                label="Bank Guarentee"
                type="number"
                value={allData.BankGuarentee}
                onChange={(e) => inputHandler(e)}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                fullWidth
                size="small"
                helperText="Please enter deposit"
                placeholder="Security Deposit"
                name="SecurityDeposit"
                label="Security Deposit"
                type="number"
                value={allData.SecurityDeposit}
                onChange={(e) => inputHandler(e)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter bank name"
            placeholder="Bank Name"
            name="BankName"
            label="Bank Name"
            value={allData.BankName ? allData.BankName : ""}
            onChange={(e) => inputHandler(e)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={1}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                size="small"
                helperText="format: YYYY.MM.DD"
                label="Expire Miti"
                inputProps={{
                  pattern:
                    "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
                }}
                value={
                  allData.ExpireMiti
                    ? allData.ExpireMiti.substring(0, 10).replaceAll("-", ".")
                    : ""
                }
                onChange={(e) =>
                  setAllData({ ...allData, ExpireMiti: e.target.value })
                }
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                disabled
                size="small"
                helperText="YYYY.MM.DD"
                label="Expire Date"
                value={
                  allData.ExpireDate ? allData.ExpireDate.substring(0, 10) : ""
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={4} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.InventoryValue}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    InventoryValue: !allData.InventoryValue,
                  })
                }
              />
            }
            label="Inventory values are Affected By ?"
          />
        </Grid>
        <Grid item lg={4} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.MaintainBilByBill}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    MaintainBilByBill: !allData.MaintainBilByBill,
                  })
                }
              />
            }
            label="Maintain balances bill by bill"
          />
        </Grid>
        <Grid item lg={4} md={6}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsAgent}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsAgent: !allData.IsAgent,
                  })
                }
              />
            }
            label="Agent"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default InputLedger;
