import React, { ChangeEvent, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

interface NumericInputProps {
  label: string;
  id: string;
  placeholder: string;
  required: boolean;
  fullWidth: boolean;
}

const NumericInput: React.FC<NumericInputProps> = ({
  label,
  id,
  placeholder,
  required,
  fullWidth,
}) => {
  const [value, setValue] = useState("");

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="row" marginTop={2.5}>
        <Typography>{label}</Typography>
        <Typography color="red">*</Typography>
      </Box>
      <TextField
        className="text-field"
        id={id}
        placeholder={placeholder}
        required={required}
        fullWidth={fullWidth}
        value={value}
        onChange={handleValueChange}
      />
    </>
  );
};

export default NumericInput;
