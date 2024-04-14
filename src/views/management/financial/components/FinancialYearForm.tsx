import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import { DeleteDialog } from "../../../../components/dialogBox";
import { IFinancialYear } from "../../../../interfaces/financialYear";
import { getAllFinancialYearApi } from "../../../../services/financialYearApi";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";

interface IProps {
  id: string;
  data: IFinancialYear;
  setData: any;
  onSubmit: any;
  deleteFunction: any;
}

const FinancialYearForm = ({
  id,
  data,
  setData,
  onSubmit,
  deleteFunction,
}: IProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <>
      <Paper
        component="form"
        autoComplete="off"
        method="post"
        onSubmit={onSubmit}
        sx={{
          py: 2,
          mt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container maxWidth="lg" spacing={2}>
          <Grid item xs={12} md={6}>
            <InputField
              placeholder="Start date"
              name="Start date"
              label="Start date"
              type="date"
              value={
                data && data.StartDate ? data.StartDate.substring(0, 10) : ""
              }
              onChange={(e) => setData({ ...data, StartDate: e.target.value })}
              autoFocus
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputField
              placeholder="End date"
              name="End date"
              label="End date"
              type="date"
              value={data && data.EndDate ? data.EndDate.substring(0, 10) : ""}
              onChange={(e) => setData({ ...data, EndDate: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              helperText="format: YYYY.MM.DD"
              placeholder="Nepali start date"
              name="Nepali start date"
              label="Nepali start date"
              value={data ? data.NepaliStartDate : ""}
              onChange={(e) =>
                setData({ ...data, NepaliStartDate: e.target.value })
              }
              inputProps={{
                pattern:
                  "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              helperText="formate: YYYY.MM.DD"
              placeholder="Nepali end date"
              name="Nepali end date"
              label="Nepali end date"
              value={data ? data.NepaliEndDate : ""}
              onChange={(e) =>
                setData({ ...data, NepaliEndDate: e.target.value })
              }
              inputProps={{
                pattern:
                  "((?:19|20)[0-9][0-9]).(0?[1-9]|1[012]).(0?[1-9]|[12][0-9]|3[02])",
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              helperText="format: YYYY.YYY"
              placeholder="Name"
              name="Name"
              label="Name"
              value={data && data.Name}
              onChange={(e) => setData({ ...data, Name: e.target.value })}
              inputProps={{ pattern: "[1-9][0-9]{3}.[0-9]{3}" }}
              required
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end" }}>
            {id === "add" ? (
              <SaveButton variant="outlined" />
            ) : (
              <>
                <UpdateButton />
                <DeleteButton onClick={(e: any) => setOpenDialog(true)} />
              </>
            )}
            <CloseButton variant="outlined" />
          </Grid>
        </Grid>
        <DeleteDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          name={data.Name}
          deleteData={deleteFunction}
        />
      </Paper>
    </>
  );
};

export default FinancialYearForm;
