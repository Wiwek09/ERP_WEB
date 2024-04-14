import { Avatar, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import preeti from "preeti";
import { IOnChange, IOnSubmit } from "../../../interfaces/event";
import { addCompanyApi } from "../../../services/companyApi";
import {
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import { useAppDispatch } from "../../../app/hooks";
import { setCompanyAction } from "../../../features/companySlice";
import { useHistory } from "react-router";
import { SaveButton } from "./../../../utils/buttons/index";
import { Box } from "@mui/system";

const CreateCompany = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [company, setCompany] = useState<any>({
    NameEnglish: "",
    NameNepali: "",
    Pan_Vat: "",
    Address: "",
    Street: "",
    City: "",
    District: "",
    Phone: "",
    Email: "",
    BranchCode: "",
    IRD_UserName: "",
    IRD_Password: "",
    PhotoIdentity: "",
    IdentityFileType: "",
    IdentityFileName: "",
    ServiceCharge: 0,
    Description: "",
    VATRate: 0,
    ExciseDuty: 0,
  });

  const setCompanyDataInput = (e: IOnChange) => {
    const name = e.target.name;
    let value = e.target.value;
    setCompany({ ...company, [name]: value });
  };

  const updateCompany = async (e: IOnSubmit) => {
    e.preventDefault();

    const response = await addCompanyApi(company);
    if (response !== -1) {
      dispatch(setCompanyAction(company));
      successMessage();
      history.push("/");
    } else {
      errorMessage();
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "92vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Grid container>
          <Grid
            lg={5}
            md={5}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRight: "1px solid rgba(224, 224, 224, 1)",
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="h5" sx={{ my: 3 }} color="primary.main">
                Welcome to D. Cube I.T. Solution Pvt. Ltd.
              </Typography>
              <Typography variant="body2">
                Start today by creating own company
              </Typography>
              <Avatar
                src="/Assets/createCompany.png"
                variant="square"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: { xs: "none", md: "block" },
                }}
              />
            </Box>
          </Grid>
          <Grid
            lg={7}
            md={7}
            xs={12}
            sx={{
              px: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                mt: 3,
                px: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
              component="form"
              autoComplete="off"
              onSubmit={updateCompany}
            >
              <Grid container spacing={2}>
                <Grid xs={12} sx={{ px: 2 }}>
                  <Typography color="primary.main" variant="h6">
                    Company Details
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    fullWidth
                    size="small"
                    required
                    label="Name (English)"
                    name="NameEnglish"
                    value={company ? company.NameEnglish : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Name (Nepali)"
                    name="NameNepali"
                    value={
                      company && company.NameNepali
                        ? preeti(company.NameNepali)
                        : ""
                    }
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Address"
                    name="Address"
                    value={company ? company.Address : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Street"
                    name="Street"
                    value={company ? company.Street : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="City"
                    name="City"
                    value={company ? company.City : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Discrict"
                    name="District"
                    value={company ? company.District : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Phone No"
                    name="Phone"
                    value={company ? company.Phone : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Email"
                    type="email"
                    name="Email"
                    value={company ? company.Email : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Vat/Pan"
                    type="number"
                    name="Pan_Vat"
                    value={company ? company.Pan_Vat : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Vat Rate"
                    type="number"
                    name="VATRate"
                    value={company ? company.VATRate : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Excise Duty"
                    type="number"
                    name="ExciseDuty"
                    value={company ? company.ExciseDuty : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="IRD username"
                    name="IRD_UserName"
                    value={company ? company.IRD_UserName : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="IRD password"
                    name="IRD_Password"
                    value={company ? company.IRD_Password : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label="Branch Code"
                    name="BranchCode"
                    value={company ? company.BranchCode : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Description"
                    multiline
                    rows={3}
                    fullWidth
                    style={{ width: "100%" }}
                    name="Description"
                    value={company ? company.Description : ""}
                    onChange={setCompanyDataInput}
                  />
                </Grid>
                <Grid xs={12} sx={{ mt: 2 }}>
                  <input type="file" style={{ marginLeft: "15px" }} />
                </Grid>
                <Grid xs={12} sx={{ mt: 2, px: 1, textAlign: "start" }}>
                  <SaveButton variant="contained" />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CreateCompany;
