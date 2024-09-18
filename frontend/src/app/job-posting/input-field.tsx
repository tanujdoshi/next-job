import React, { useContext, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UserContext } from "../(context)/UserContext";

type InputFieldProps = {
  id: string;
  label: string;
  setValue: (value: string) => void;
  placeHolder?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  setValue,
  placeHolder,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { state } = useContext(UserContext);

  // Function to handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Box width={isTablet ? 250 : 350} mx={2}>
      <Box display="flex" flexDirection="row" marginTop={2}>
        <Typography>{label}</Typography>
        <Typography color="red">*</Typography>
      </Box>
      <TextField
        className="text-field"
        id={id}
        required
        fullWidth
        onChange={handleInputChange}
        placeholder={placeHolder}
        disabled={label === "Company Name" ? true : false}
        defaultValue={label === "Company Name" ? state.companyName : ""}
      />
    </Box>
  );
};

export default InputField;
