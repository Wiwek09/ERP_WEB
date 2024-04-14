import { Autocomplete, Grid, IconButton, TextField } from "@mui/material";
import { useEffect } from "react";
import { BiUserPlus } from "react-icons/bi";
import { useParams } from "react-router-dom";
import Ledgerbycus from "../../../../components/showRemain/ledgerbycus";
import { IImportBillDetail } from "../../../../interfaces/importBill";
import { IParams } from "../../../../interfaces/params";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { IAutoComplete, IVoucherType } from "../interfaces";
import { updateProduct } from "../../../inventory/product/components/helperFunctions";

interface IProps {
  branch: IAutoComplete[];
  warehouse: IAutoComplete[];
  department: IAutoComplete[];
  customer: IAutoComplete[];
  voucherType: IVoucherType[];
  data: IImportBillDetail;
  updateData: (name: string, value: any | null) => void;
  setDisplayUserModal: any;
}

const ImportBillDetail = ({
  branch,
  warehouse,
  department,
  customer,
  voucherType,
  data,
  updateData,
  setDisplayUserModal,
}: IProps) => {
  const { id }: IParams = useParams();

  useEffect(() => {
    updateData("voucherType", "Purchase Import");
  }, [voucherType]);

  const getVoucherTypeValue = (): IVoucherType | null => {
    if (data.voucherType === "Purchase Vat") {
      return { id: "Purchase Vat", label: "Purchase Vat" };
    } else if (data.voucherType === "Purchase Non Vat") {
      return { id: "Purchase Non Vat", label: "Purchase Non Vat" };
    } else if (data.voucherType === "Purchase Import") {
      return { id: "Purchase Import", label: "Purchase Import" };
    } else if (data.voucherType === "Purchases Capital") {
      return { id: "Purchases Capital", label: "Purchases Capital" };
    } else {
      return null;
    }
  };

  const getCustomerValue = (): IAutoComplete | null => {
    for (let index = 0; index < customer.length; index++) {
      const element = customer[index];
      if (data.customer === element.id) {
        return { id: element.id, label: element.label };
      }
    }
    return null;
  };

  const getBranchValue = (): IAutoComplete | null => {
    for (let index = 0; index < branch.length; index++) {
      const element = branch[index];
      if (data.branch === element.id) {
        return { id: element.id, label: element.label };
      }
    }
    return null;
  };

  const getWarehouseValue = (): IAutoComplete | null => {
    for (let index = 0; index < warehouse.length; index++) {
      const element = warehouse[index];
      if (data.warehouse === element.id) {
        return { id: element.id, label: element.label };
      }
    }
    return null;
  };

  const getDepartmentValue = (): IAutoComplete | null => {
    for (let index = 0; index < department.length; index++) {
      const element = department[index];
      if (data.department === element.id) {
        return { id: element.id, label: element.label };
      }
    }
    return null;
  };

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12} md={6}>
        {id === "add" ? (
          <Autocomplete
            disablePortal
            options={voucherType}
            size="small"
            isOptionEqualToValue={(option: IVoucherType, value: IVoucherType) =>
              option.id === value.id
            }
            value={getVoucherTypeValue()}
            renderInput={(params) => (
              <TextField {...params} label="Voucher type" />
            )}
            onChange={(event: any, newValue: IVoucherType | null) => {
              updateData("voucherType", newValue !== null ? newValue.id : 0);
            }}
          />
        ) : (
          <Autocomplete
            disabled
            disablePortal
            options={voucherType}
            size="small"
            isOptionEqualToValue={(option: IVoucherType, value: IVoucherType) =>
              option.id === value.id
            }
            value={getVoucherTypeValue()}
            renderInput={(params) => (
              <TextField {...params} label="Voucher type" />
            )}
            onChange={(event: any, newValue: IVoucherType | null) => {
              updateData(
                "voucherType",
                newValue !== null ? newValue.id : "voucherType"
              );
            }}
          />
        )}
      </Grid> */}
      {/* <Grid item xs={12} md={4}>
        <TextField
          label="Invoice No"
          size="small"
          fullWidth
          value={data.invoiceNo}
          onChange={(e) => updateData("invoiceNo", e.target.value)}
        />
      </Grid> */}
      <Grid item xs={12} md={4}>
        <TextField
          helperText="format: YYYY.MM.DD"
          inputProps={{
            pattern:
              "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-2])))",
          }}
          label="Voucher Date"
          size="small"
          fullWidth
          value={data.voucherDate}
          onChange={(e) => updateData("voucherDate", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Autocomplete
          style={{ width: "calc(100% - 50px)", float: "left" }}
          disablePortal
          options={customer}
          size="small"
          isOptionEqualToValue={(option: IAutoComplete, value: IAutoComplete) =>
            option.id === value.id
          }
          value={getCustomerValue()}
          renderInput={(params) => (
            <TextField {...params} label="Select Supplier" />
          )}
          onChange={(event: any, newValue: IAutoComplete | null) => {
            updateData("customer", newValue !== null ? newValue.id : 0);
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
      <Grid item xs={12} md={2}>
        <Ledgerbycus cusID={data.customer} />
      </Grid>
      <Grid item xs={12} md={3} sx={{ marginTop: 2 }}>
        <TextField
          label="Invoice No"
          size="small"
          fullWidth
          value={data.invoiceNo}
          onChange={(e) => updateData("invoiceNo", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={3} sx={{ marginTop: 2 }}>
        <Autocomplete
          disablePortal
          options={branch}
          size="small"
          isOptionEqualToValue={(option: IAutoComplete, value: IAutoComplete) =>
            option.id === value.id
          }
          value={getBranchValue()}
          renderInput={(params) => <TextField {...params} label="Branch" />}
          onChange={(event: any, newValue: IAutoComplete | null) => {
            updateData("branch", newValue !== null ? newValue.id : 0);
          }}
          renderOption={handleRenderOption}
        />
      </Grid>
      <Grid item xs={12} md={3} sx={{ marginTop: 2 }}>
        <Autocomplete
          disablePortal
          options={warehouse}
          size="small"
          isOptionEqualToValue={(option: IAutoComplete, value: IAutoComplete) =>
            option.id === value.id
          }
          value={getWarehouseValue()}
          renderInput={(params) => <TextField {...params} label="Warehouse" />}
          onChange={(event: any, newValue: IAutoComplete | null) => {
            updateData("warehouse", newValue !== null ? newValue.id : 0);
          }}
          renderOption={handleRenderOption}
        />
      </Grid>
      <Grid item xs={12} md={3} sx={{ marginTop: 2 }}>
        <Autocomplete
          disablePortal
          options={department}
          size="small"
          isOptionEqualToValue={(option: IAutoComplete, value: IAutoComplete) =>
            option.id === value.id
          }
          value={getDepartmentValue()}
          renderInput={(params) => <TextField {...params} label="Department" />}
          onChange={(event: any, newValue: IAutoComplete | null) => {
            updateData("department", newValue !== null ? newValue.id : 0);
          }}
          renderOption={handleRenderOption}
        />
      </Grid>
      <Grid item xs={12} md={4} sx={{ marginTop: 2 }}>
        <TextField
          label="Pragyapan Patra Number"
          size="small"
          fullWidth
          value={data.ppNo}
          onChange={(e) => updateData("ppNo", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={4} sx={{ marginTop: 2 }}>
        <TextField
          label="LC/Draft No"
          size="small"
          fullWidth
          value={data.draftNo}
          onChange={(e) => updateData("draftNo", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={4} sx={{ marginTop: 2 }}>
        <TextField
          label="Exchange Rate"
          size="small"
          type="number"
          fullWidth
          value={data.exchangeRate}
          onChange={(e) => {
            updateData("exchangeRate", e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ImportBillDetail;
