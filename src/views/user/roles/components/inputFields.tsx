import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useHistory } from "react-router";
import { DeleteDialog } from "../../../../components/dialogBox";
import { IOnSubmit } from "../../../../interfaces/event";
import { deleteRoles } from "../../../../services/userRoleApi";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import { errorMessage } from "../../../../utils/messageBox/Messages";

interface IProps {
  id: string;
  onSubmit: (e: IOnSubmit) => void;
  allData: any;
  setAllData: any;
}

const InputForm = ({ allData, setAllData, onSubmit, id }: IProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();
  const deleteData = async () => {
    const res = await deleteRoles(id);
    if (res === 1) {
      setOpenDialog(false);
      history.push("/user-roles");
      return;
    } else {
      errorMessage();
      setOpenDialog(false);
    }
  };

  return (
    <>
      <Paper
        component="form"
        autoComplete="off"
        method="post"
        onSubmit={onSubmit}
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container maxWidth="lg" spacing={0.8}>
          <Grid item xs={12} md={6}>
            <InputField
              autoFocus
              helperText={allData.Name === "" ? "No name found" : "Enter name"}
              placeholder="Name"
              label="Name"
              required
              value={allData.Name ? allData.Name : ""}
              onChange={(e: any) =>
                setAllData({ ...allData, Name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              helperText={
                allData.Description === ""
                  ? "No description found"
                  : "Enter description"
              }
              placeholder="Description"
              label="Description"
              required
              value={allData.Description ? allData.Description : ""}
              onChange={(e) =>
                setAllData({ ...allData, Description: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: "600", fontSize: 21, marginTop: "8px" }}
            >
              Permissions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>
              POS/Billing
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.PosBilling}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      PosBilling: !allData.PosBilling,
                    })
                  }
                />
              }
              label="Pos/Billing"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>
              Transaction
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Invoice}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Invoice: !allData.Invoice,
                    })
                  }
                />
              }
              label="Invoice"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.InvAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          InvAdd: !allData.InvAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.InvEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          InvEdit: !allData.InvEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.InvDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          InvDelete: !allData.InvDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.InvView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          InvView: !allData.InvView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Purchase}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Purchase: !allData.Purchase,
                    })
                  }
                />
              }
              label="Purchase"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PurAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PurAdd: !allData.PurAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PurEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PurEdit: !allData.PurEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PurDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PurDelete: !allData.PurDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PurView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PurView: !allData.PurView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Receipt}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Receipt: !allData.Receipt,
                    })
                  }
                />
              }
              label="Receipt"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.ReceiptAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          ReceiptAdd: !allData.ReceiptAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.ReceiptEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          ReceiptEdit: !allData.ReceiptEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.ReceiptDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          ReceiptDelete: !allData.ReceiptDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.ReceiptView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          ReceiptView: !allData.ReceiptView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Payment}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Payment: !allData.Payment,
                    })
                  }
                />
              }
              label="Payment"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PaymentAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PaymentAdd: !allData.PaymentAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PaymentEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PaymentEdit: !allData.PaymentEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PaymentDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PaymentDelete: !allData.PaymentDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PaymentView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PaymentView: !allData.PaymentView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12}>
            <Divider />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.BankCash}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      BankCash: !allData.BankCash,
                    })
                  }
                />
              }
              label="Bank/Cash"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BankAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BankAdd: !allData.BankAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BankEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BankEdit: !allData.BankEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BankDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BankDelete: !allData.BankDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BankView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BankView: !allData.BankView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.SalesReturn}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      SalesReturn: !allData.SalesReturn,
                    })
                  }
                />
              }
              label="Sales Return"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.SRAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          SRAdd: !allData.SRAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.SREdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          SREdit: !allData.SREdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.SRDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          SRDelete: !allData.SRDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.SRView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          SRView: !allData.SRView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.PurchaseReturn}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      PurchaseReturn: !allData.PurchaseReturn,
                    })
                  }
                />
              }
              label="Purchase Return"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PRAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PRAdd: !allData.PRAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PREdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PREdit: !allData.PREdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PRDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PRDelete: !allData.PRDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PRView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PRView: !allData.PRView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.ImportBill}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      ImportBill: !allData.ImportBill,
                    })
                  }
                />
              }
              label="Import Bill"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.IBAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          IBAdd: !allData.IBAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.IBEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          IBEdit: !allData.IBEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.IBDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          IBDelete: !allData.IBDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.IBView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          IBView: !allData.IBView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Journal}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Journal: !allData.Journal,
                    })
                  }
                />
              }
              label="Journal"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.JournalAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          JournalAdd: !allData.JournalAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.JournalEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          JournalEdit: !allData.JournalEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.JournalDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          JournalDelete: !allData.JournalDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.JournalView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          JournalView: !allData.JournalView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>
              Transaction Miscellaneous
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.OrderManagement}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      OrderManagement: !allData.OrderManagement,
                    })
                  }
                />
              }
              label="Order Management"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.OMAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          OMAdd: !allData.OMAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.OMEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          OMEdit: !allData.OMEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.OMDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          OMDelete: !allData.OMDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.OMView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          OMView: !allData.OMView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.OMInvoice}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          OMInvoice: !allData.OMInvoice,
                        })
                      }
                    />
                  }
                  label=" Create Invoice"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Quotation}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Quotation: !allData.Quotation,
                    })
                  }
                />
              }
              label="Quotation"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.QuotationAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          QuotationAdd: !allData.QuotationAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.QuotationEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          QuotationEdit: !allData.QuotationEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.QuotationDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          QuotationDelete: !allData.QuotationDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.QuotationView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          QuotationView: !allData.QuotationView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.QuotationInvoice}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          QuotationInvoice: !allData.QuotationInvoice,
                        })
                      }
                    />
                  }
                  label="Place Order"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.PurchaseOrder}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      PurchaseOrder: !allData.PurchaseOrder,
                    })
                  }
                />
              }
              label="Purchase Order"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.POAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          POAdd: !allData.POAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.POEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          POEdit: !allData.POEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.PODelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          PODelete: !allData.PODelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.POView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          POView: !allData.POView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12}>
            <Divider light />
          </Grid> */}
          {/* added here */}
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.GetCustomers}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      GetCustomers: !allData.GetCustomers,
                    })
                  }
                />
              }
              label="Customer"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>Report</Typography>
          </Grid>

          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.TrialBalance}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      TrialBalance: !allData.TrialBalance,
                    })
                  }
                />
              }
              label="Trial Balance"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.AccountBalance}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Accounting: !allData.Accounting,
                    })
                  }
                />
              }
              label="Account Balance"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.ProfitLoss}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      ProfitLoss: !allData.ProfitLoss,
                    })
                  }
                />
              }
              label="Profit & Loss"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.BalanceSheet}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      BalanceSheet: !allData.BalanceSheet,
                    })
                  }
                />
              }
              label="Balance Sheet"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.SalesDateWise}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      SalesDateWise: !allData.SalesDateWise,
                    })
                  }
                />
              }
              label="Sales Date Wise"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.ItemWiseProfit}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      ItemWiseProfit: !allData.ItemWiseProfit,
                    })
                  }
                />
              }
              label="Sales Date Profit"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.MaterializedView}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      MaterializedView: !allData.MaterializedView,
                    })
                  }
                />
              }
              label="Materialized View"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.SalesReturnBook}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      SalesReturnBook: !allData.SalesReturnBook,
                    })
                  }
                />
              }
              label="Sales Return Book"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.SalesBook}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      SalesBook: !allData.SalesBook,
                    })
                  }
                />
              }
              label="Sales Book"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.PurchaseBook}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      PurchaseBook: !allData.PurchaseBook,
                    })
                  }
                />
              }
              label="Purchase Book"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.PurchaseReturnBook}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      PurchaseReturnBook: !allData.PurchaseReturnBook,
                    })
                  }
                />
              }
              label="Purchase Return Book"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.ItemStockLedger}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      ItemStockLedger: !allData.ItemStockLedger,
                    })
                  }
                />
              }
              label="Item Stock Ledger"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.StockInHand}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      StockInHand: !allData.StockInHand,
                    })
                  }
                />
              }
              label="Stock In Hand"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Audit}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Audit: !allData.Audit,
                    })
                  }
                />
              }
              label="Audit Trial"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.DebtorsReport}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      DebtorsReport: !allData.DebtorsReport,
                    })
                  }
                />
              }
              label="Debtors Report"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.CreditorsReport}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      CreditorsReport: !allData.CreditorsReport,
                    })
                  }
                />
              }
              label="Creditors Report"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.AllItemWiseProfit}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      AllItemWiseProfit: !allData.AllItemWiseProfit,
                    })
                  }
                />
              }
              label="Item Wise Profit"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.StockAgeingReport}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      StockAgeingReport: !allData.StockAgeingReport,
                    })
                  }
                />
              }
              label="Stock Ageing Report"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.CustomerReport}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      CustomerReport: !allData.CustomerReport,
                    })
                  }
                />
              }
              label="Customer Report"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.DebtorsAgeingReport}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      DebtorsAgeingReport: !allData.DebtorsAgeingReport,
                    })
                  }
                />
              }
              label="Debtors Ageing Report"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Ledger}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Ledger: !allData.Ledger,
                    })
                  }
                />
              }
              label="Ledger"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>
              Master Account
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.MasterLedger}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      MasterLedger: !allData.MasterLedger,
                    })
                  }
                />
              }
              label="Master Ledger"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.MLAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        MLAdd: !allData.MLAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.MasterLedger2}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      MasterLedger2: !allData.MasterLedger2,
                    })
                  }
                />
              }
              label="Master Ledger 2"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.GroupLedger}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      GroupLedger: !allData.GroupLedger,
                    })
                  }
                />
              }
              label="Group Ledger"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.TransactionType}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      TransactionType: !allData.TransactionType,
                    })
                  }
                />
              }
              label="Transaction Type"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.BillTerm}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      BillTerm: !allData.BillTerm,
                    })
                  }
                />
              }
              label="Bill Term"
            />
            <Grid container spacing={0.2}>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BTAdd}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BTAdd: !allData.BTAdd,
                        })
                      }
                    />
                  }
                  label="Add"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BTEdit}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BTEdit: !allData.BTEdit,
                        })
                      }
                    />
                  }
                  label="Edit"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BTDelete}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BTDelete: !allData.BTDelete,
                        })
                      }
                    />
                  }
                  label="Delete"
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  sx={{ px: 2, pl: 4 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={allData.BTView}
                      onChange={(e) =>
                        setAllData({
                          ...allData,
                          BTView: !allData.BTView,
                        })
                      }
                    />
                  }
                  label="View"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider light />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>Inventory</Typography>
          </Grid>

          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Products}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Products: !allData.Products,
                    })
                  }
                />
              }
              label="Products"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.ProductAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        ProductAdd: !allData.ProductAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>

          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Category}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Category: !allData.Category,
                    })
                  }
                />
              }
              label="Category"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.CategoryAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        CategoryAdd: !allData.CategoryAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.UnitType}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      UnitType: !allData.UnitType,
                    })
                  }
                />
              }
              label="Unit Type"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.UTAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        UTAdd: !allData.UTAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Warehouse}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Warehouse: !allData.Warehouse,
                    })
                  }
                />
              }
              label="Warehouse"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.WHAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        WHAdd: !allData.WHAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.WHEdit}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        WHEdit: !allData.WHEdit,
                      })
                    }
                  />
                }
                label="Edit"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.WarehouseType}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      WarehouseType: !allData.WarehouseType,
                    })
                  }
                />
              }
              label="Warehouse Type"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.WHTAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        WHTAdd: !allData.WHTAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>
              Management
            </Typography>
          </Grid>

          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Departments}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Departments: !allData.Departments,
                    })
                  }
                />
              }
              label="Department"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.DeAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        DeAdd: !allData.DeAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.DeEdit}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        DeEdit: !allData.DeEdit,
                      })
                    }
                  />
                }
                label="Edit"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.FinancialYear}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      FinancialYear: !allData.FinancialYear,
                    })
                  }
                />
              }
              label="Financial"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.FYAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        FYAdd: !allData.FYAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Company}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Company: !allData.Company,
                    })
                  }
                />
              }
              label="Company"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Branch}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Branch: !allData.Branch,
                    })
                  }
                />
              }
              label="Branch"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.BranchAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        BranchAdd: !allData.BranchAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>SMS</Typography>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.SMS}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      SMS: !allData.SMS,
                    })
                  }
                />
              }
              label="SMS"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ px: 1, fontWeight: "600" }}>User</Typography>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Users}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Users: !allData.Users,
                    })
                  }
                />
              }
              label="Users"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.UserAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        UserAdd: !allData.UserAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.AssignRoles}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      AssignRoles: !allData.AssignRoles,
                    })
                  }
                />
              }
              label="Assign Roles"
            />
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.Roles}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      Roles: !allData.Roles,
                    })
                  }
                />
              }
              label="Roles"
            />
            <Grid item xs>
              <FormControlLabel
                sx={{ px: 2, pl: 4 }}
                control={
                  <Checkbox
                    color="primary"
                    checked={allData.RoleAdd}
                    onChange={(e) =>
                      setAllData({
                        ...allData,
                        RoleAdd: !allData.RoleAdd,
                      })
                    }
                  />
                }
                label="Add"
              />
            </Grid>
          </Grid>
          <Grid item lg={3} md={6} xs={6}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allData.ChangePassword}
                  onChange={(e) =>
                    setAllData({
                      ...allData,
                      ChangePassword: !allData.ChangePassword,
                    })
                  }
                />
              }
              label="Change Password"
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "end", marginTop: "10px" }}>
            {id === "add" ? (
              <>
                <SaveButton variant="outlined" />
                <CloseButton variant="outlined" />
              </>
            ) : (
              <>
                <UpdateButton variant="outlined" />
                <DeleteButton
                  variant="outlined"
                  onClick={(e) => setOpenDialog(true)}
                />
                <CloseButton variant="outlined" />
              </>
            )}
          </Grid>
        </Grid>
        <DeleteDialog
          setOpenDialog={setOpenDialog}
          openDialog={openDialog}
          name={allData.Name ? allData.Name : ""}
          deleteData={deleteData}
        />
      </Paper>
    </>
  );
};

export default InputForm;
