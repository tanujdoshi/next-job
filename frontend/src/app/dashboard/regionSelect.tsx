"use client";

import {
  Autocomplete,
  Button,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { GraphType, ICity, ICountry, IState } from "./types";
import { City, Country, State } from "country-state-city";
import { Dispatch, SetStateAction, useState } from "react";
import { GraphTypeOptions } from "./constants";

export const RegionSelect = (props: {
  handleChange: (value: string | null) => void;
  selectedPlace: {
    country?: string[] | undefined;
    state?: string[] | undefined;
    city?: string[] | undefined;
  };
  setSelectedPlace: Dispatch<
    SetStateAction<{
      country?: string[] | undefined;
      state?: string[] | undefined;
      city?: string[] | undefined;
    }>
  >;
}) => {
  const countries: ICountry[] = Country.getAllCountries().map((country) => {
    return { name: country.name, isoCode: country.isoCode };
  });

  const { selectedPlace, setSelectedPlace } = props;

  const [city, setCity] = useState<ICity[]>([]);
  const [state, setState] = useState<IState[]>([]);

  const hanldleCountryChange = (value: ICountry[]) => {
    var states: IState[] = [];
    let countries: string[] = [];
    value.forEach((country) => {
      countries.push(country.name);
      states.push(
        ...State.getStatesOfCountry(country.isoCode).map((state) => {
          return {
            name: state.name,
            isoCode: state.isoCode,
            isoCountryCode: state.countryCode,
          };
        })
      );
    });
    setSelectedPlace({ ...selectedPlace, country: countries });
    setState(states);
  };

  const handleStateChange = (value: IState[]) => {
    var cities: ICity[] = [];
    let states: string[] = [];
    value.forEach((state) => {
      states.push(state.name);
      cities.push(
        ...City.getCitiesOfState(state.isoCountryCode, state.isoCode).map(
          (city) => {
            return {
              name: city.name,
              isoStateCode: city.stateCode,
              isoCountryCode: city.countryCode,
            };
          }
        )
      );
    });
    setSelectedPlace({ ...selectedPlace, state: states });
    setCity(cities);
  };

  const handleCityChange = (value: ICity[]) => {
    var cities: string[] = [];
    value.forEach((city) => {
      cities.push(city.name);
    });
    setSelectedPlace({ ...selectedPlace, city: cities });
  };

  return (
    <>
      <Stack spacing={3}>
        <Divider textAlign="left">Change View</Divider>
        <Autocomplete
          id="tags-outlined"
          disableClearable
          options={GraphTypeOptions}
          filterSelectedOptions
          defaultValue={GraphTypeOptions[0]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Chart Type"
              placeholder="Chart Type"
            />
          )}
          onChange={(_, value) => {
            props.handleChange(value);
          }}
        />
        <Divider textAlign="left">Filter by Region</Divider>

        <Autocomplete
          multiple
          id="tags-outlined"
          options={countries}
          getOptionLabel={(option: ICountry) => option.name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="Countries" placeholder="Countries" />
          )}
          onChange={(_, value) => {
            hanldleCountryChange(value);
          }}
        />

        <Autocomplete
          multiple
          disabled={state.length === 0}
          id="tags-outlined"
          options={state}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="States/Provinces"
              placeholder="States/Provinces"
            />
          )}
          onChange={(_, value) => {
            handleStateChange(value);
          }}
        />
        <Autocomplete
          multiple
          disabled={city.length === 0}
          id="tags-outlined"
          options={city}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="Cities" placeholder="Cities" />
          )}
          onChange={(_, value) => {
            handleCityChange(value);
          }}
        />
      </Stack>
    </>
  );
};
