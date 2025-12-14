import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { AdapterResult, CardData, CardAction, QueryInput } from '../types';

interface PlacesResult {
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  geometry?: { location?: { lat: number; lng: number } };
  place_id: string;
  opening_hours?: { open_now?: boolean };
  business_status?: string;
  types?: string[];
  international_phone_number?: string;
  website?: string;
}

const mapsUrlFromPlace = (place: PlacesResult) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;

const scorePlace = (place: PlacesResult, keywords: string[]): number => {
  const base = (place.rating ?? 0) * (place.user_ratings_total ?? 0);
  const relevance = keywords.some((k) => place.name.toLowerCase().includes(k)) ? 1.2 : 1;
  return base * relevance;
};

const buildActions = (place: PlacesResult): CardAction[] => {
  const encoded = encodeURIComponent(place.name);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  const appleMaps = `http://maps.apple.com/?q=${encoded}`;
  const actions: CardAction[] = [
    { label: 'Open in Google Maps', url: mapsUrl },
    { label: 'Open in Apple Maps', url: appleMaps },
  ];
  if (place.international_phone_number) {
    actions.push({ label: 'Call', url: `tel:${place.international_phone_number}` });
  }
  if (place.website) {
    actions.push({ label: 'Website', url: place.website });
  }
  return actions;
};

export const runLocalPlacesAdapter = async (input: QueryInput): Promise<AdapterResult> => {
  const apiKey = Constants.expoConfig?.extra?.googlePlacesApiKey as string | undefined;
  const normalizedKeywords = input.prompt.toLowerCase().split(/\s+/);

  if (!apiKey || !input.lat || !input.lng) {
    return { cards: [], intent: 'local_places' };
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${encodeURIComponent(
      input.prompt
    )}&location=${input.lat},${input.lng}&radius=4000&type=restaurant&key=${apiKey}`
  );
  const json = await response.json();
  const results = (json.results as PlacesResult[]) ?? [];

  const sorted = results
    .map((place) => ({
      place,
      score: scorePlace(place, normalizedKeywords),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const cards: CardData[] = sorted.map(({ place, score }, index) => ({
    id: `${place.place_id}-${index}`,
    query_id: '',
    rank: index + 1,
    title: place.name,
    subtitle: place.vicinity ?? 'Restaurant',
    score,
    reason: `Rating ${place.rating ?? 'N/A'} x ${place.user_ratings_total ?? 0} reviews`,
    data_json: {
      open_now: place.opening_hours?.open_now,
      types: place.types,
      business_status: place.business_status,
      location: place.geometry?.location,
    },
    actions_json: buildActions(place),
    source_urls: [
      Linking.createURL(mapsUrlFromPlace(place)),
    ],
  }));

  return { cards, intent: 'local_places' };
};
