import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid, Paper } from "@mui/material";

import InputLedger from "./inputLedger";
import InputSetting from "./inputSetting";
import InputTaxation from "./inputTaxation";
import InputAddress from "./inputAddress";

import { toast } from "react-toastify";
import { useHistory } from "react-router";
import {
  SaveButton,
  CloseButton,
  DeleteButton,
  UpdateButton,
} from "../../../../utils/buttons";
import { deleteMasterLedger } from "../../../../services/masterLedgerAPI";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { DeleteDialog } from "../../../../components/dialogBox";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const LedgerTabs = ({ allData, setAllData, onSubmit, id }: any) => {
  const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const history = useHistory();

  const onDelete = async () => {
    const res = await deleteMasterLedger(id);
    if (res === 1) {
      toast.success("Successfully deleted", { autoClose: 1500 });
      history.push("/master-ledger");
      setOpenDialog(false);
      return;
    } else {
      setOpenDialog(false);
      errorMessage();
    }
  };

  return (
    <>
      <Paper
        sx={{
          py: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& > :not(style)": { m: 1 },
        }}
      >
        <Box
          sx={{ width: "100%" }}
          component="form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Ledger Tabs"
            >
              <Tab label="Ledger" {...a11yProps(0)} />
              <Tab label="Taxation" {...a11yProps(1)} />
              <Tab label="Setting" {...a11yProps(2)} />
              <Tab label="Address" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <InputLedger allData={allData} setAllData={setAllData} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <InputTaxation allData={allData} setAllData={setAllData} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <InputSetting allData={allData} setAllData={setAllData} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <InputAddress allData={allData} setAllData={setAllData} />
          </TabPanel>
          <Grid
            xs={11}
            sx={{
              mx: "auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
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
                  onClick={() => setOpenDialog(true)}
                />
                <CloseButton variant="outlined" />
              </>
            )}
          </Grid>
        </Box>
        <DeleteDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          name={allData ? allData.Name : ""}
          deleteData={onDelete}
        />
      </Paper>
    </>
  );
};

export default LedgerTabs;
