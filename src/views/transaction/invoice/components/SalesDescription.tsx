import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { IoMdAdd } from "react-icons/io";

interface IProps {
  data: string;
  onChange: (name: string, value: any) => void;
}
const SalesDescription = ({ data, onChange }: IProps) => {
  return (
    <>
      <Box sx={{ marginTop: 3 }}>
        <TextField
          label="Sales description"
          placeholder="Sales description..."
          fullWidth={true}
          multiline={true}
          rows={2}
          value={data}
          onChange={(e) => onChange("description", e.target.value)}
        />
        <Box sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}>
          <Button variant="outlined" component="label" sx={{ marginLeft: 2 }}>
            <IoMdAdd />
            Upload File
            <input type="file" hidden />
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default SalesDescription;
