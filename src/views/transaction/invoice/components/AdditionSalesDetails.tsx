import { Autocomplete, Grid, IconButton, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { BiUserPlus } from "react-icons/bi";
import Ledgerbycus from "../../../../components/showRemain/ledgerbycus";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { IAdditionalSales, ICommonObj } from "../interfaces";

interface IProps {
  data: IAdditionalSales;
  onChange: (name: string, value: any | null) => void;
  branch: ICommonObj[];
  customer: ICommonObj[];
  warehouse: ICommonObj[];
  department: ICommonObj[];
  setDisplayUserModal: any;
}

interface ISalesType {
  id: string | null;
  label: string | null;
}

const salesType: ISalesType[] = [
  { id: "Cash Sales", label: "Cash Sales" },
  { id: "Credit Sales", label: "Credit Sales" },
];

const AdditionalSaleDetails = ({
  data,
  onChange,
  branch,
  customer,
  warehouse,
  department,
  setDisplayUserModal,
}: IProps) => {
  const [salesTypeValue, setSalesTypeValue] = useState<ISalesType | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    data.customer
  );

  const setSalesData = () => {
    if (data.salesType !== null || data.salesType === "") {
      setSalesTypeValue({ id: data.salesType, label: data.salesType });
    } else {
      setSalesTypeValue(null);
    }
  };

  useEffect(() => {
    setSalesData();
  }, [data]);

  const getCustomerValue = (): ICommonObj | null => {
    const customerData = customer.find((item) => item.id === data.customer);
    return customerData ? customerData : null;
  };

  const getBranchValue = (): ICommonObj | null => {
    const branchData = branch.find((item) => item.id === data.branch);
    return branchData ? branchData : null;
  };
  const getWarehouseValue = (): ICommonObj | null => {
    const warehouseData = warehouse.find((item) => item.id === data.warehouse);
    return warehouseData ? warehouseData : null;
  };
  const getDepartmentValue = (): ICommonObj | null => {
    const departmentData = department.find(
      (item) => item.id === data.department
    );
    return departmentData ? departmentData : null;
  };

  const getCustomerSelected = (e: any) => {
    let nnu: number = e?.id;
    onChange("customer", e && e?.id);
    setSelectedCustomerId(nnu);
  };

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={salesType}
              size="small"
              isOptionEqualToValue={(option: ISalesType, value: ISalesType) =>
                option.id === value.id
              }
              value={salesTypeValue === null ? null : salesTypeValue}
              renderInput={(params) => (
                <TextField {...params} label="Sales type" />
              )}
              onChange={(event: any, newValue: ISalesType | null) => {
                onChange("salesType", newValue && newValue.id);
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              fullWidth
              label="Sales date"
              value={data.salesDate ? data.salesDate : ""}
              onChange={(e) => onChange("salesDate", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Autocomplete
              style={{ width: "calc(100% - 50px)", float: "left" }}
              disablePortal
              options={customer}
              value={getCustomerValue()}
              size="small"
              isOptionEqualToValue={(option: ICommonObj, value: ICommonObj) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField {...params} label="Customer" />
              )}
              onChange={(event: any, newValue: ICommonObj | null) => {
                // onChange("customer", newValue && newValue.id);
                getCustomerSelected(newValue);
              }}
              renderOption={handleRenderOption}
            />
            <IconButton
              style={{
                float: "left",
                width: "45px",
                height: "38px",
                marginLeft: "5px",
              }}
              sx={{ border: 1, borderRadius: 1 }}
              onClick={(e) => setDisplayUserModal(true)}
            >
              <BiUserPlus />
            </IconButton>
          </Grid>
          {selectedCustomerId ? (
            <Grid item xs={12} md={3}>
              <Ledgerbycus cusID={selectedCustomerId} />
            </Grid>
          ) : (
            ""
          )}
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={12} md={2}>
            <TextField
              size="small"
              fullWidth
              label="Challan No."
              value={data.ChallanNo ? data.ChallanNo : ""}
              onChange={(e) => onChange("ChallanNo", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Vehicle No."
              value={data.vehicleNo ? data.vehicleNo : 0}
              onChange={(e) => onChange("vehicleNo", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Vehicle length"
              value={data.vehicleLength ? data.vehicleLength : 0}
              onChange={(e) => onChange("vehicleLength", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              size="small"
              fullWidth
              label="Vehicle height"
              value={data.vehicleHieght ? data.vehicleHieght : 0}
              onChange={(e) => onChange("vehicleHieght", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              size="small"
              fullWidth
              label="Vehicle width"
              value={data.vehicleWidth ? data.vehicleWidth : 0}
              onChange={(e) => onChange("vehicleWidth", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              options={branch}
              value={getBranchValue()}
              size="small"
              isOptionEqualToValue={(option: ICommonObj, value: ICommonObj) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField {...params} label="Select a branch" />
              )}
              onChange={(event: any, newValue: ICommonObj | null) => {
                onChange("branch", newValue && newValue.id);
              }}
              renderOption={handleRenderOption}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              options={warehouse}
              value={getWarehouseValue()}
              size="small"
              isOptionEqualToValue={(option: ICommonObj, value: ICommonObj) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField {...params} label="Select an warehouse" />
              )}
              onChange={(event: any, newValue: ICommonObj | null) => {
                onChange("warehouse", newValue && newValue.id);
              }}
              renderOption={handleRenderOption}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              options={department}
              value={getDepartmentValue()}
              size="small"
              isOptionEqualToValue={(option: ICommonObj, value: ICommonObj) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField {...params} label="Select a department" />
              )}
              onChange={(event: any, newValue: ICommonObj | null) => {
                onChange("department", newValue && newValue.id);
              }}
              renderOption={handleRenderOption}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdditionalSaleDetails;
