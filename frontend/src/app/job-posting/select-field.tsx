

import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  Box,
  Select,
  Typography,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  setValue: (value: string) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  options,
  setValue,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box width={isTablet ? 250 : 350} mx={2}>
      <Box display="flex" flexDirection="row" marginTop={2}>
        <Typography>{label}</Typography>
        <Typography color="red">*</Typography>
      </Box>
      <Select
        className="selector"
        labelId={`${id}-select-label`}
        id={`${id}-select`}
        value={value}
        onChange={(e: SelectChangeEvent) => setValue(e.target.value as string)}
        autoWidth
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default SelectField;
