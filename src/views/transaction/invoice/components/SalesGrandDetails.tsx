import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { IGrandDetails } from "../interfaces";

interface IProps {
  data: IGrandDetails;
}

const SalesGrandDetails = ({ data }: IProps) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          marginTop: { xs: 3, md: 0 },
        }}
      >
        <Box style={{ width: "100%", maxWidth: "400px" }}>
          <TextField
            label="Total amount:"
            fullWidth={true}
            value={data.amount.toFixed(2)}
            size="small"
          />
          <br />
          <br />
          <TextField
            label="Discount:"
            size="small"
            fullWidth={true}
            value={data.discount.toFixed(2)}
          />
          <br />
          <br />
          <TextField
            label="Taxable:"
            fullWidth={true}
            value={data.taxabledic.toFixed(2)}
            size="small"
          />
          <br />
          <br />
          <TextField
            label="Non-taxable:"
            fullWidth={true}
            value={data.nontaxabledic.toFixed(2)}
            size="small"
          />
          <br />
          <br />
          <TextField
            label="Excise duty:"
            size="small"
            fullWidth={true}
            value={data.exciseDuty.toFixed(2)}
          />
          <br />
          <br />
          <TextField
            label="Tax:"
            size="small"
            fullWidth={true}
            value={data.taxdic.toFixed(2)}
          />
          <br />
          <br />
          <TextField
            label="Grand total:"
            size="small"
            fullWidth={true}
            value={data.grandTotal.toFixed(2)}
          />
        </Box>
      </Box>
    </>
  );
};

export default SalesGrandDetails;
