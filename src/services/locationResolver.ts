import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { QueryInput } from '../types';

interface Coordinates {
  lat: number;
  lng: number;
}

const geocodeLocationText = async (locationText: string): Promise<Coordinates | null> => {
  const apiKey = Constants.expoConfig?.extra?.googlePlacesApiKey as string | undefined;
  if (!apiKey) return null;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationText)}&key=${apiKey}`
  );
  if (!response.ok) return null;

  const data = await response.json();
  const first = data.results?.[0];
  if (!first?.geometry?.location) return null;

  return {
    lat: first.geometry.location.lat,
    lng: first.geometry.location.lng,
  };
};

const getDeviceLocation = async (): Promise<Coordinates | null> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const { coords } = await Location.getCurrentPositionAsync({});
  return { lat: coords.latitude, lng: coords.longitude };
};

export const resolveQueryLocation = async (input: QueryInput): Promise<QueryInput> => {
  try {
    if (input.locationText) {
      const geocoded = await geocodeLocationText(input.locationText);
      if (geocoded) {
        return { ...input, ...geocoded };
      }
    }

    if (typeof input.lat === 'number' && typeof input.lng === 'number') {
      return input;
    }

    const current = await getDeviceLocation();
    if (current) {
      return { ...input, ...current, locationText: input.locationText ?? 'Current location' };
    }
  } catch (error) {
    console.warn('Failed to resolve location', error);
  }

  return input;
};
