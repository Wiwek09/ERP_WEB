import { Grid, TextField } from "@mui/material";

interface IProps {
  description: string;
  setDescription: (name: string, value: any) => void;
}

const AdditionalVoucherDtl = ({ description, setDescription }: IProps) => {
  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <TextField
            label="Voucher description"
            placeholder="Voucher description..."
            fullWidth={true}
            multiline={true}
            rows={3}
            value={description}
            onChange={(e) => setDescription("description", e.target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AdditionalVoucherDtl;
