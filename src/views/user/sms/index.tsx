import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import FormHeader from "../../../components/headers/formHeader";
import { ISMS } from "../../../interfaces/sms";
import {
  addSMSKey,
  deleteSMSKey,
  editSMSKey,
  getAllSMSKey,
} from "../../../services/smsKeyApi";
import { DeleteButton } from "../../../utils/buttons";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import { DeleteDialog } from "../../../components/dialogBox";
import { useHistory } from "react-router-dom";

export default function SMS() {
  const history = useHistory();
  const [credit, setCredit] = useState("");
  const [apikeyvalue, setapikeyvalue] = useState("");
  const [apisender, setapisender] = useState("");
  const [apiroute, setapiroute] = useState("");
  const [allData, setAllData] = useState([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    //worked with adding proxy
    // axios.get('/miscapi/261ECF1642B009/getBalance/true')
    //   .then(res => {
    //     const dtta = res.data;
    //     setCredit(dtta[0].BALANCE)
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    handleGETCredit();
    handleGetSMSApiKey();
  }, []);
  //get remain credit
  const handleGETCredit = async () => {
    await axios
      .get(
        "https://spellsms.com/login/api/miscapi/26DF202044817B6ECE8220EE9A4CBBB6/getBalance/true",
        {
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      )
      .then((resp) => {
        setCredit(resp.data.credits[0].credits);
      })
      .catch((error) => console.error(`Error: ${error}`));
  };
  const handleGetSMSApiKey = async () => {
    const res = await getAllSMSKey();
    if (res) {
      if (res.length === 1) {
        setAllData(res);
        setapikeyvalue(res[0].SMSAPIKey);
        setapiroute(res[0].Routeid);
        setapisender(res[0].Senderid);
      } else {
        setAllData(res);
        setapikeyvalue("");
      }
    } else {
      errorMessage("No SMSAPIKEY set.");
    }
  };

  const handleChangeKey = (v: any) => {
    setapikeyvalue(v);
  };
  const handleChangeRoute = (v: any) => {
    setapiroute(v);
  };
  const handleChangesender = (v: any) => {
    setapisender(v);
  };

  const onHandleAdd = async () => {
    const response = await addSMSKey({
      Id: 0,
      SMSAPIKey: apikeyvalue,
      Routeid: apiroute,
      Senderid: apisender,
    });
    if (response === 1) {
      successMessage();
    } else {
      errorMessage();
    }
  };
  const onHandleUpdate = async () => {
    const keyId: ISMS = allData[0];
    var keyValue: number = Number(keyId.Id);
    const response = await editSMSKey(keyValue, {
      Id: keyId.Id,
      SMSAPIKey: apikeyvalue,
      Routeid: apiroute,
      Senderid: apisender,
    });
    if (response === 1) {
      editMessage();
      return true;
    } else {
      errorMessage();
      return false;
    }
  };
  const deleteSMSAPIKey = async () => {
    const keyId: ISMS = allData[0];
    var keyValue: number = Number(keyId.Id);
    const response = await deleteSMSKey(keyValue);
    if (response) {
      history.push("/sms");
    }
  };

  return (
    <>
      <FormHeader headerName="SMS" />
      <Paper sx={{ padding: 2 }}>
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Paper
                sx={{
                  background: (theme) =>
                    theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                }}
              >
                <TextField value={credit} label="Credit Remain" size="small" />
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container>
                <Grid item xs={12} md={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Add API Key</FormLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    sx={{ mt: 5, mb: 2 }}
                    value={apikeyvalue}
                    label="API KEY"
                    size="small"
                    fullWidth
                    required
                    variant="outlined"
                    onChange={(e: any) => handleChangeKey(e.target.value)}
                  />
                </Grid>
                <Grid spacing={2} item xs={12} md={6} sx={{ mb: 2 }}>
                  <TextField
                    label="Route ID"
                    value={apiroute}
                    size="small"
                    fullWidth
                    required
                    variant="outlined"
                    onChange={(e: any) => handleChangeRoute(e.target.value)}
                  />
                </Grid>
                <Grid spacing={2} item xs={12} md={6} sx={{ mb: 2 }}>
                  <TextField
                    label="Sender ID"
                    size="small"
                    value={apisender}
                    fullWidth
                    required
                    variant="outlined"
                    onChange={(e: any) => handleChangesender(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
                  {allData.length === 0 ? (
                    <Button
                      color="success"
                      variant="outlined"
                      sx={{ ml: 2 }}
                      onClick={onHandleAdd}
                    >
                      <BiPlus />
                      Add
                    </Button>
                  ) : allData.length === 1 ? (
                    <>
                      <Button
                        color="success"
                        variant="outlined"
                        sx={{ ml: 2 }}
                        onClick={onHandleUpdate}
                      >
                        <BiPlus />
                        Update
                      </Button>
                      <DeleteButton
                        variant="outlined"
                        onClick={(e) => setOpenDialog(true)}
                      />
                    </>
                  ) : allData.length > 1 ? (
                    <Button
                      color="success"
                      variant="outlined"
                      sx={{ ml: 2 }}
                      disabled
                    >
                      <BiPlus />
                      Add
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <DeleteDialog
        name={apikeyvalue}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteData={deleteSMSAPIKey}
      />
    </>
    // <div>SMS {credit}</div>
  );
}
