import { Checkbox, FormControlLabel, Grid } from "@mui/material";

const InputSetting = ({ allData, setAllData }: any) => {
  return (
    <>
      <Grid container maxWidth="lg" spacing={2} sx={{ mx: "auto" }}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsBillWiseOn}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsBillWiseOn: !allData.IsBillWiseOn,
                  })
                }
              />
            }
            label="Bill Wise On"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ISCostCentresOn}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ISCostCentresOn: !allData.ISCostCentresOn,
                  })
                }
              />
            }
            label="Cost Centres On"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsInterestOn}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsInterestOn: !allData.IsInterestOn,
                  })
                }
              />
            }
            label="Interest On"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.AllowInMobile}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    AllowInMobile: !allData.AllowInMobile,
                  })
                }
              />
            }
            label="Allow InMobile"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsCondensed}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsCondensed: !allData.IsCondensed,
                  })
                }
              />
            }
            label="Condensed"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.AffectsStock}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    AffectsStock: !allData.AffectsStock,
                  })
                }
              />
            }
            label="Affects Stock"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ForPayRoll}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ForPayRoll: !allData.ForPayRoll,
                  })
                }
              />
            }
            label="For PayRoll"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.InterestOnBillWise}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    InterestOnBillWise: !allData.InterestOnBillWise,
                  })
                }
              />
            }
            label="Interest On Bill Wise"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.OverRideInterest}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    OverRideInterest: !allData.OverRideInterest,
                  })
                }
              />
            }
            label="OverRide Interest"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.OverRideADVInterest}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    OverRideADVInterest: !allData.OverRideADVInterest,
                  })
                }
              />
            }
            label="OverRide ADV Interest"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.UseForVat}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    UseForVat: !allData.UseForVat,
                  })
                }
              />
            }
            label="Use For VAT"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IgnoreTDSExempt}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IgnoreTDSExempt: !allData.IgnoreTDSExempt,
                  })
                }
              />
            }
            label="Ignore TDS Exempt"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsTCSApplicable}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsTCSApplicable: !allData.IsTCSApplicable,
                  })
                }
              />
            }
            label="Is TCS Applicable"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsTDSApplicable}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsTDSApplicable: !allData.IsTDSApplicable,
                  })
                }
              />
            }
            label="Is TDS Applicable"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsFBTApplicable}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsFBTApplicable: !allData.IsFBTApplicable,
                  })
                }
              />
            }
            label="Is FBT Applicable"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsGSTApplicable}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsGSTApplicable: !allData.IsGSTApplicable,
                  })
                }
              />
            }
            label="Is GST Applicable"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ShowInPaySlip}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ShowInPaySlip: !allData.ShowInPaySlip,
                  })
                }
              />
            }
            label="Show In PaySlip"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.UseForGratuity}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    UseForGratuity: !allData.UseForGratuity,
                  })
                }
              />
            }
            label="Use For Gratuity"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.ForServiceTax}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    ForServiceTax: !allData.ForServiceTax,
                  })
                }
              />
            }
            label="For ServiceTax"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsInputCredit}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsInputCredit: !allData.IsInputCredit,
                  })
                }
              />
            }
            label="Is InputCredit"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsExempte}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsExempte: !allData.IsExempte,
                  })
                }
              />
            }
            label="Is Exempte"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsAbatementApplicable}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsAbatementApplicable: !allData.IsAbatementApplicable,
                  })
                }
              />
            }
            label="Is Abatement Applicable"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.TDSDeducteeIsSpecialRate}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    TDSDeducteeIsSpecialRate: !allData.TDSDeducteeIsSpecialRate,
                  })
                }
              />
            }
            label="TDS Deductee Is SpecialRate"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.Audited}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    Audited: !allData.Audited,
                  })
                }
              />
            }
            label="Audited"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default InputSetting;
