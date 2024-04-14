import { Avatar, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IFinancialYear } from "../../../interfaces/financialYear";
import { SaveButton } from "../../../utils/buttons";
interface IProps {
  data: IFinancialYear;
  setData: any;
  onSubmit: any;
}
const InputForm = ({ data, setData, onSubmit }: IProps) => {
  return (
    <>
      <Box
        sx={{
          minHeight: "92vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid container>
            <Grid
              lg={7}
              md={6}
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
                <Typography variant="h4" sx={{ my: 2 }} color="primary.main">
                  Welcome to D. Cube I.T. Solution Pvt. Ltd.
                </Typography>
                <Typography variant="body2">
                  Start by adding financial year
                </Typography>
                <Avatar
                  src="/Assets/createFinancialYear.png"
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
              lg={5}
              md={6}
              xs={12}
              sx={{
                px: 2,
              }}
            >
              <Box
                component="form"
                autoComplete="off"
                onSubmit={onSubmit}
                sx={{
                  px: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Grid container spacing={2}>
                  <Grid xs={12} sx={{ px: 2, mt: 6 }}>
                    <Typography color="primary.main" variant="h6">
                      Financial Year Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      helperText="format: YYYY.YYY"
                      placeholder="Name"
                      name="Name"
                      label="Name"
                      value={data && data.Name}
                      onChange={(e) =>
                        setData({ ...data, Name: e.target.value })
                      }
                      inputProps={{ pattern: "[1-9][0-9]{3}.[0-9]{3}" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      required
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      required
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
                          "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      type="date"
                      value={
                        data.StartDate ? data.StartDate.substring(0, 10) : ""
                      }
                      onChange={(e) =>
                        setData({ ...data, StartDate: e.target.value })
                      }
                      helperText="English Start Date"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      type="date"
                      value={
                        data && data.EndDate
                          ? data.EndDate.substring(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setData({ ...data, EndDate: e.target.value })
                      }
                      helperText="English End Date"
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ textAlign: "start" }}>
                    <SaveButton variant="contained" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default InputForm;
