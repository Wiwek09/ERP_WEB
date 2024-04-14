import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useAppSelector } from "../../../app/hooks";
import { IGrandDetails } from "../interface";

interface IProps {
  data: IGrandDetails;
}

const useStyles = makeStyles({
  dataCntr: {
    float: "right",
    paddingLeft: "15px",
  },
});

const GrandDetails = ({ data }: IProps) => {
  const classes = useStyles();
  const companyName = useAppSelector((state) => state.company.data);
  return (
    <>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: "inline-block", width: "100%" }}>
          <Box className={classes.dataCntr}>
            {data.taxable === 0 ? (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              >
                Rs. {data && data.amount.toFixed(2)}
              </Typography>
            ) : (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              >
                Rs. {data && data.amount.toFixed(2)}
              </Typography>
            )}
            <Typography
              sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
            >
              Rs. {data && data.discount.toFixed(2)}
            </Typography>

            {data.taxable === 0 ? (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              ></Typography>
            ) : (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              >
                {/* Rs. {data && data.taxable.toFixed(2)} */}
                Rs. {data && data.taxableafterdic.toFixed(2)}
              </Typography>
            )}
            {data.taxable === 0 ? (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              ></Typography>
            ) : (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              >
                {/* Rs. {data && data.nonTaxable.toFixed(2)} */}
                Rs. {data && data.nonTaxableafterdic.toFixed(2)}
              </Typography>
            )}

            {data.tax === 0 ? (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              ></Typography>
            ) : (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
              >
                {/* Rs. {data && data.tax.toFixed(2)} */}
                Rs.{data && data.taxafterdic.toFixed(2)}
              </Typography>
            )}
            <Typography
              sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
            >
              Rs.{" "}
              {data &&
                (data.amount + data.taxafterdic - data.discount).toFixed(2)}
            </Typography>
          </Box>
          <Box className={classes.dataCntr}>
            {data.taxable === 0 ? (
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Sub-total:
              </Typography>
            ) : (
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Total:
              </Typography>
            )}
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
              Discount:
            </Typography>

            {data.taxable === 0 ? (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold" }}
              ></Typography>
            ) : (
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Taxable:
              </Typography>
            )}
            {data.taxable === 0 ? (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold" }}
              ></Typography>
            ) : (
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Non-Taxable:
              </Typography>
            )}

            {data.tax === 0 ? (
              <Typography
                sx={{ fontSize: 16, fontWeight: "bold" }}
              ></Typography>
            ) : (
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Tax:
              </Typography>
            )}
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
              Grand Total:
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default GrandDetails;
