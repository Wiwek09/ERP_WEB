import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, MouseEvent } from "react";
import { ICompany } from "../../../../interfaces/company";
import preeti from "preeti";
import { CloseButton, UpdateButton } from "../../../../utils/buttons";
import { IOnChange, IOnSubmit } from "../../../../interfaces/event";
import { editCompanyApi } from "../../../../services/companyApi";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import { useAppDispatch } from "../../../../app/hooks";
import { setCompanyAction } from "../../../../features/companySlice";
import { useHistory } from "react-router";
import InputField from "../../../../utils/customTextField";
import Dropzone from "../../../../components/Dropzone";
import { BiPlus } from "react-icons/bi";
import {
  addProductPhotoDetails,
  editProductPhotoDetails,
} from "../../../../services/productApi";
import { uploadFileAPI } from "../../../../services/fileUploadApi";

interface IProps {
  data: ICompany;
}

const CenterItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#EEEEEE",
  ...theme.typography.body2,
  textAlign: "center",
}));

const EditCompanyForm = ({ data }: IProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [company, setCompany] = useState<ICompany>(data);
  const [refImage, setRefImage] = useState<File[] | null>(null);
  const [imageDetails, setImageDetails] = useState({});
  const [fontFamily, setFontFamily] = useState(
    company ? company.BillHeaderFront : ""
  );
  const [PrinterType, setPrinterType] = useState(
    company ? company.PrinterType : ""
  );
  const setCompanyDataInput = (e: IOnChange) => {
    const name = e.target.name;
    let value = e.target.value;
    setCompany({ ...company, [name]: value });
  };

  const handleFontChange = (event: SelectChangeEvent<string>) => {
    const newFontFamily = event.target.value as string;
    setFontFamily(newFontFamily);
    setCompany({ ...company, BillHeaderFront: newFontFamily });
  };
  const PrinterTypeChange = (event: SelectChangeEvent<string>) => {
    const newPrinterType = event.target.value as string;
    setPrinterType(newPrinterType);
    setCompany({ ...company, PrinterType: newPrinterType });
  };

  const updateCompany = async (e: IOnSubmit) => {
    e.preventDefault();
    const response = await editCompanyApi(company, company.Id);
    if (response !== -1) {
      dispatch(setCompanyAction(company));
      if (company.PhotoIdentity !== "") {
        // const response = await editProductPhotoDetails(company.Id, refImage);
        if (refImage) {
          const res = await uploadFileAPI(refImage, "Company", response);
        }
      } else {
        if (refImage) {
          const res = await uploadFileAPI(refImage, "Company", response);
        }
      }
      editMessage();
      history.push("/company");
    } else {
      errorMessage("Update operation failed.");
    }
  };

  return (
    <>
      <Paper
        sx={{ px: 2, pt: 2, pb: 4 }}
        component="form"
        autoComplete="off"
        onSubmit={updateCompany}
      >
        <Grid container spacing={2}>
          <Grid xs={12} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs sx={{ marginLeft: 1 }}>
                <Dropzone onDrop={(file) => setRefImage(file)} />
              </Grid>
              <Grid item xs>
                {
                  company.PhotoIdentity ? (
                    <Grid item xs>
                      <CenterItem>
                        <Typography variant="h5" component="h2">
                          Old Logo
                        </Typography>
                        <img
                          alt={company.IdentityFileName}
                          src={"data:image/png;base64," + company.PhotoIdentity}
                          height="150"
                        />
                      </CenterItem>
                    </Grid>
                  ) : (
                    ""
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Branch Code"
              name="BranchCode"
              value={company ? company.BranchCode : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Name (English)"
              name="NameEnglish"
              value={company ? company.NameEnglish : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Name (Nepali)"
              name="NameNepali"
              value={
                company && company.NameNepali ? preeti(company.NameNepali) : ""
              }
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Address"
              name="Address"
              value={company ? company.Address : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Street"
              name="Street"
              value={company ? company.Street : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="city"
              name="City"
              value={company ? company.City : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Discrict"
              name="District"
              value={company ? company.District : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Phone No"
              type="number"
              name="Phone"
              value={company ? company.Phone : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Email"
              type="email"
              name="Email"
              value={company ? company.Email : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Vat/Pan"
              type="number"
              name="Pan_Vat"
              value={company ? company.Pan_Vat : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Vat Rate"
              type="number"
              name="VATRate"
              value={company ? company.VATRate : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Excise Duty"
              type="number"
              name="ExciseDuty"
              value={company ? company.ExciseDuty : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <FormControl sx={{ width: "100%" }} size="small">
              <InputLabel id="font-weight">Bill Font-Family</InputLabel>
              <Select
                labelId="font-weight"
                id="font-weight"
                value={fontFamily}
                label="Age"
                onChange={handleFontChange}
                sx={{ width: "100%" }}
              >
                <MenuItem value="sans">Sans</MenuItem>
                <MenuItem value="sans-serif">Sans-Serif</MenuItem>
                <MenuItem value="monospace">MonoSpace</MenuItem>
                <MenuItem value="poppins">Poppins</MenuItem>
                <MenuItem value="arial">Arial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Bill Front Header Size "
              type="number"
              name="BillFrontSizeHeader"
              value={company ? company.BillFrontSizeHeader : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Bill-Item FontSize"
              type="number"
              name="BillFrontSizeItem"
              value={company ? company.BillFrontSizeItem : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
              <InputField
                label="Bill-Item FontWeight"
                type="number"
                name="BillFrontWeight"
                value={company ? company.BillFrontWeight : ""}
                onChange={setCompanyDataInput}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2 }}>
              <InputField
                label="Bill Font Header Weight"
                type="number"
                name="BillFrontWeightHeader"
                value={company ? company.BillFrontWeightHeader : ""}
                onChange={setCompanyDataInput}
              />
            </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <FormControl sx={{ width: "100%" }} size="small">
              <InputLabel id="font-weight">Printer Type</InputLabel>
              <Select
                labelId="font-weight"
                id="font-weight"
                value={PrinterType}
                label="Age"
                onChange={PrinterTypeChange}
                sx={{ width: "100%" }}
              >
                <MenuItem value="POS">POS</MenuItem>
                <MenuItem value="Laser">Laser</MenuItem>
              </Select>
            </FormControl>
          </Grid>          
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="Print Pages"
              type="number"
              name="FirstPageRow"
              value={company ? company.FirstPageRow : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              label="IRD username"
              name="IRD_UserName"
              value={company ? company.IRD_UserName : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2 }}>
            <InputField
              type="password"
              label="IRD password"
              name="IRD_Password"
              value={company ? company.IRD_Password : ""}
              onChange={setCompanyDataInput}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Description"
              multiline
              rows={5}
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
          <Grid xs={12} sx={{ mt: 2, textAlign: "end" }}>
            <UpdateButton />
            <CloseButton />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default EditCompanyForm;
