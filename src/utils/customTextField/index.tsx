import { TextField } from "@mui/material";
interface IProps {
  name?: string;
  value: string | number;
  type?: string;
  label: string;
  onChange?: (e: any) => void;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  inputProps?: any;
  error?: boolean;
  disabled?: any;
}

export default function InputField(props: IProps) {
  const {
    name,
    type,
    label,
    value,
    onChange,
    helperText,
    required,
    autoFocus,
    placeholder,
    disabled,
    inputProps,
    error,
    ...other
  } = props;

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      helperText={helperText}
      label={label}
      name={name}
      type={type || "text"}
      size="small"
      autoComplete="off"
      fullWidth
      required={required ? true : false}
      autoFocus={autoFocus ? true : false}
      value={value}
      onChange={onChange}
      error={!value}
      inputProps={inputProps}
      disabled={disabled ? true : false}
      {...other}
    />
  );
}
