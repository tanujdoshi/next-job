import React from "react";
import {
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Typography,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import { JobFilterProps } from "@/app/job-listings/types";

const Filter: React.FC<JobFilterProps> = ({
  checked,
  setChecked,
  handleCheckChange,
  minFilterAmount,
  setMinFilterAmount,
  maxFilterAmount,
  setMaxFilterAmount,
  minFilterAmountError,
  setMinFilterAmountError,
  maxFilterAmountError,
  setMaxFilterAmountError,
}) => {
  function handleMinFilterAmountChange(event: any) {
    var temp = event.target.value;
    setMinFilterAmount(temp);
    if (isNaN(temp)) {
      setMinFilterAmountError(true);
      return;
    }
    if (temp < 0) {
      setMinFilterAmountError(true);
    } else {
      setMinFilterAmountError(false);
    }
  }

  function handleMaxFilterAmountChange(event: any) {
    var temp = event.target.value;

    setMaxFilterAmount(temp);
    if (isNaN(temp)) {
      setMaxFilterAmountError(true);
      return;
    }

    if (temp < 0) {
      setMaxFilterAmountError(true);
    } else {
      setMaxFilterAmountError(false);
    }
  }

  function handleButtonClick() {
    setMinFilterAmount(0);
    setMaxFilterAmount(0);
    setMinFilterAmountError(false);
    setMaxFilterAmountError(false);
    setChecked({
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
    });
  }
  return (
    <Container>
      <Typography variant="h6" component="h6" sx={{ textAlign: "center" }}>
        Job Filters
      </Typography>
      <Grid
        container
        spacing={1}
        direction={"column"}
        sx={{ textAlign: "left" }}
        mt={2}
      >
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked["fullTime"]}
                onChange={handleCheckChange}
                name="fullTime"
                color="primary"
              />
            }
            label="Full-time"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked["partTime"]}
                onChange={handleCheckChange}
                name="partTime"
                color="primary"
              />
            }
            label="Part-time"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked["contract"]}
                onChange={handleCheckChange}
                name="contract"
                color="primary"
              />
            }
            label="Contract"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked["internship"]}
                onChange={handleCheckChange}
                name="internship"
                color="primary"
              />
            }
            label="Internship"
          />
        </Grid>
      </Grid>
      <Grid container direction={"column"} spacing={1} mt={5}>
        <Grid item xs={12}>
          <TextField
            error={minFilterAmountError}
            id="min-outlined-adornment-amount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography color={minFilterAmountError ? "#d32f2f" : ""}>
                    $
                  </Typography>
                </InputAdornment>
              ),
            }}
            label="Min-Amount"
            value={minFilterAmount}
            onChange={handleMinFilterAmountChange}
            helperText={minFilterAmountError ? "Invalid Amount" : ""}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <TextField
            error={maxFilterAmountError}
            id="max-outlined-adornment-amount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography color={minFilterAmountError ? "#d32f2f" : ""}>
                    $
                  </Typography>
                </InputAdornment>
              ),
            }}
            value={maxFilterAmount}
            label="Max-Amount"
            onChange={handleMaxFilterAmountChange}
            helperText={maxFilterAmountError ? "Invalid Amount" : ""}
          />
        </Grid>
      </Grid>
      <Grid container direction={"column"} spacing={1} mt={5}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#003060" }}
            onClick={handleButtonClick}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Filter;
