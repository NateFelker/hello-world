import { AdapterResult, Intent, QueryInput } from '../types';
import { runLocalPlacesAdapter } from './localPlacesAdapter';
import { runGlobalRankedListAdapter } from './rankedCarsAdapter';

const FOOD_KEYWORDS = ['taco', 'restaurant', 'food', 'eat', 'dinner', 'lunch', 'brunch', 'pizza'];
const SPEED_KEYWORDS = ['fastest', '0-60', '0 to 60', 'cars', 'supercar', 'hypercar'];

export const detectIntent = (prompt: string): Intent => {
  const normalized = prompt.toLowerCase();
  if (FOOD_KEYWORDS.some((word) => normalized.includes(word))) return 'local_places';
  if (SPEED_KEYWORDS.some((word) => normalized.includes(word))) return 'global_ranked_list';
  return 'unknown';
};

export const routeIntent = async (input: QueryInput): Promise<AdapterResult> => {
  const intent = detectIntent(input.prompt);
  if (intent === 'local_places') {
    return runLocalPlacesAdapter(input);
  }
  if (intent === 'global_ranked_list') {
    return runGlobalRankedListAdapter(input);
  }

  return { cards: [], intent };
};
