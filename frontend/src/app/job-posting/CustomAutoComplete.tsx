import React, { useState } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { TextField } from "@mui/material";

interface CustomAutoCompleteProps {
  onPlaceChanged: (place: google.maps.places.AutocompleteOptions) => void;
}

const CustomAutoComplete = (props: CustomAutoCompleteProps) => {
  const [searchResult, setSearchResult] =
    useState<google.maps.places.Autocomplete>();

  const GOOGLE_MAPS_API_KEY = "AIzaSyD68WiiOkLTkfqzyg24wpJjhNuEjILBdj8";
  const GOOGLE_PLACES_API_KEY = "AIzaSyCWjxMcjuvFjJs0UQYjmfOJjn3Yy7GvD2o";

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchResult(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      props.onPlaceChanged(place);
    } else {
      alert("Please enter text");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div id="searchColumn">
        <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
          <TextField
            type="text"
            placeholder="Search Location..."
            className="text-field"
            fullWidth
            required
          ></TextField>
        </Autocomplete>
      </div>
    </div>
  );
};

export default CustomAutoComplete;
