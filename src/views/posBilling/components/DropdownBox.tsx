import { Autocomplete, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import handleRenderOption from "../../../utils/autoSuggestHighlight";
import { IFormData } from "../interface";

interface IProps {
  label: string;
  name: string;
  options: IFormData[];
  value: number | null;
  onClickHandler: (name: string, value: number | null) => void;
  sx?: any;
  className?: any;
}

// Custom style
const useStyles = makeStyles({
  ledger: {
    float: "left",
    width: "calc(100% - 48px)",
  },
  other: {},
});

const DropdownBox = ({
  label,
  name,
  options,
  value,
  onClickHandler,
  sx,
}: IProps) => {
  const classes = useStyles();
  return (
    <Autocomplete
      sx={{ ...sx }}
      className={name === "ledger" ? classes.ledger : classes.other}
      disablePortal
      size="small"
      options={options ? options : []}
      renderInput={(params) => <TextField {...params} label={label} />}
      isOptionEqualToValue={(option: IFormData, value: IFormData) =>
        option.id === value.id
      }
      renderOption={handleRenderOption}
      value={
        options && value ? options.find((data) => data.id === value) : null
      }
      onChange={(event: any, newValue: IFormData | null) => {
        onClickHandler(name, newValue && newValue.id);
      }}
    />
  );
};

export default DropdownBox;
