import { AdapterResult, CardAction, CardData, QueryInput } from '../types';
import cars from '../data/cars.json';

const buildActions = (name: string): CardAction[] => [
  {
    label: 'Web search',
    url: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
  },
  {
    label: 'Share',
    url: `https://www.google.com/search?q=${encodeURIComponent(name)}+0-60`,
  },
];

export const runGlobalRankedListAdapter = async (_input: QueryInput): Promise<AdapterResult> => {
  const sorted = [...cars].sort((a, b) => a.zero_to_sixty - b.zero_to_sixty);

  const cards: CardData[] = sorted.map((car, index) => ({
    id: `${car.name}-${index}`,
    query_id: '',
    rank: index + 1,
    title: car.name,
    subtitle: `${car.zero_to_sixty.toFixed(2)}s 0-60 • ${car.drivetrain}`,
    score: car.zero_to_sixty,
    reason: 'Ranked strictly by 0-60 time',
    data_json: {
      price: car.price,
      drivetrain: car.drivetrain,
      zero_to_sixty: car.zero_to_sixty,
    },
    actions_json: buildActions(car.name),
    source_urls: [
      `https://www.google.com/search?q=${encodeURIComponent(car.name + ' specs')}`,
    ],
  }));

  return { cards, intent: 'global_ranked_list' };
};
