import React, { useState } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../utils/CONSTANTS";

interface CustomAutoCompleteProps {
    onPlaceChanged: (place: google.maps.places.AutocompleteOptions) => void;
}

const CustomAutoComplete = (props: CustomAutoCompleteProps) => {
    const [searchResult, setSearchResult] = useState<google.maps.places.Autocomplete>();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    });

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setSearchResult(autocomplete);
    }

    const onPlaceChanged = () => {
        if (searchResult != null) {
            const place = searchResult.getPlace();
            const name = place.name;
            const status = place.business_status;
            const formattedAddress = place.formatted_address;
            props.onPlaceChanged(place);
        } else {
            alert("Please enter text");
        }
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <div id="searchColumn">
                <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                    <input
                        type="text"
                        placeholder="Search Location..."
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `100%`,
                            height: `32px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`
                        }}
                    />
                </Autocomplete>
            </div>
        </div>
    );
}

export default CustomAutoComplete;
