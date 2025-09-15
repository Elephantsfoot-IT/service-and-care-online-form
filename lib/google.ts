"use server";

import {
  Client,
  GeocodingAddressComponentType,
} from "@googlemaps/google-maps-services-js";
import { AddressOption } from "./interface";

const client = new Client();

export const autocomplete = async (input: string) => {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        components: ["country:au"], // Components as an array of strings
      },
    });
    if (response.data.predictions) {
      const predictions: AddressOption[] = [];
      response.data.predictions.map((item) => {
        predictions.push({
          label: item.description,
          value: item.description,
          placeId: item.place_id,
        });
      });
      return predictions;
    }
  } catch (error) {
    console.log(error);
  }
};

export interface addressDetails {
  city: string;
  state: string;
  postcode: string;
  streetAddress: string;
}
export const fetchPlaceDetails = async (placeId: string) => {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        fields: ["address_component"], // Specify the fields you need
      },
    });

    const addressComponents = response.data.result.address_components;

    if (addressComponents) {
      const city = addressComponents.find((component) =>
        component.types.includes("locality" as GeocodingAddressComponentType)
      )?.long_name;
      const postcode = addressComponents.find((component) =>
        component.types.includes("postal_code" as GeocodingAddressComponentType)
      )?.long_name;
      const state = addressComponents.find((component) =>
        component.types.includes(
          "administrative_area_level_1" as GeocodingAddressComponentType
        )
      )?.short_name;
      const road = addressComponents.find((component) =>
        component.types.includes("route" as GeocodingAddressComponentType)
      )?.long_name;
      const streetNumber = addressComponents.find((component) =>
        component.types.includes(
          "street_number" as GeocodingAddressComponentType
        )
      )?.long_name;
      const subpremise = addressComponents.find((component) =>
        component.types.includes("subpremise" as GeocodingAddressComponentType)
      )?.long_name;

      const streetAddres = `${subpremise ? subpremise + "/" : ""}${
        streetNumber ? streetNumber + " " : ""
      }${road}`;
      const result = {
        city: city,
        state: state,
        postcode: postcode,
        streetAddress: streetAddres,
      } as addressDetails;
      return result;
    }
  } catch (error) {
    console.error("Error during place details request:", error);
    return null;
  }
};
