import * as React from "react";
import { QrCode } from "@mui/icons-material";
import { BiBarcode, BiQrScan } from "react-icons/bi";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, Button, Checkbox, Tab, Tabs, TextField } from "@mui/material";
import QRCode from "react-qr-code";
import ClickToPrint, { BarCode } from "./CompToPrint";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleQrValue,
  updateActiveTab,
  updatePrintSetting,
} from "../../../../features/productAllSlice/printqr";
import { RootState } from "../../../../app/store";
import { Controller, Form, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface PrintQrProps {
  itemCode: string;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function PrintQr({ itemCode }: PrintQrProps) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    dispatch(toggleQrValue(itemCode));
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton color="warning" onClick={handleClickOpen}>
        <QrCode />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, marginTop: "1rem" }}
          id="customized-dialog-title"
        >
          <PrintTabs />
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 0,
            top: 4,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <ClickToPrint />
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

function CustomTabPanel(props: TabPanelProps) {
  const dispatch = useDispatch();
  const { children, value, index, ...other } = props;

  if (value === 0) {
    dispatch(updateActiveTab("qrcode"));
  } else if (value === 1) {
    dispatch(updateActiveTab("barcode"));
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3 }}>
          <Typography sx={{ display: "flex", gap: 3 }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function PrintTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            icon={<BiQrScan />}
            iconPosition={"start"}
            label="Print QrCode"
            {...a11yProps(0)}
          />
          <Tab
            icon={<BiBarcode />}
            iconPosition={"start"}
            label="Print BarCode"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PrintComp />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PrintComp />
      </CustomTabPanel>
    </Box>
  );
}

interface data {
  imageSize: any;
  imagesNum: any;
}

function PrintComp() {
  const dispatch = useDispatch();
  const {
    QrValue,
    activeTab,
    printSetting: {
      imageSize,
      imagesNum,
      rowGap,
      columnGap,
      marginTop,
      marginLeft,
    },
  } = useSelector((state: RootState) => state.printqrData);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      imageSize: imageSize,
      imagesNum: imagesNum,
      rowGap: rowGap,
      columnGap: columnGap,
      marginTop: marginTop,
      marginLeft: marginLeft,
    },
  });

  function onSubmit(data: data) {
    dispatch(updatePrintSetting(data));
    toast.success("Print Setting Updated...");
  }

  return (
    <>
      <Box>
        {activeTab === "qrcode" ? (
          <QRCode value={QrValue} size={120} />
        ) : (
          <BarCode value={QrValue} />
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              id="outlined-basic"
              label="Item Code"
              variant="outlined"
              defaultValue={QrValue}
              InputProps={{
                readOnly: true,
              }}
            />
            <ControlledTextField
              name="imagesNum"
              control={control}
              errors={errors}
              label="Images Num"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <ControlledTextField
              name="imageSize"
              control={control}
              errors={errors}
              label="Image Size"
            />
            <ControlledTextField
              name="rowGap"
              control={control}
              errors={errors}
              label="Row Gap"
            />
            <ControlledTextField
              name="columnGap"
              control={control}
              errors={errors}
              label="Column Gap"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: "3" }}>
              <ControlledTextField
                name="marginTop"
                control={control}
                errors={errors}
                label="Top Margin"
              />
            </Box>
            <Box sx={{ flex: "3" }}>
              <ControlledTextField
                name="marginLeft"
                control={control}
                errors={errors}
                label="Left Margin"
              />
            </Box>

            <Button type="submit" sx={{ flex: "4" }} variant="outlined">
              Update Setting
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
}

interface ControlledTextFieldProps {
  name: string;
  control: any;
  errors: any;
  label: string;
}

const ControlledTextField: React.FC<ControlledTextFieldProps> = ({
  name,
  control,
  errors,
  label,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
        validate: (value) => {
          const regex = /^[0-9]*$/;
          if (!regex.test(value.toString())) {
            return "Number Only";
          }
        },
      }}
      render={({ field }) => (
        <TextField
          {...field}
          error={Boolean(errors[name])}
          helperText={errors[name] ? errors[name].message : null}
          id="outlined-basic"
          label={label}
          variant="outlined"
        />
      )}
    />
  );
};
