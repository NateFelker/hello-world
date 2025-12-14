import { AdapterResult, CardData, Query, QueryInput } from '../types';
import { createQuery, saveCards, updateQueryRefresh, upsertQuery } from './queryService';
import { routeIntent } from './intentRouter';
import { resolveQueryLocation } from './locationResolver';

const attachQueryId = (queryId: string, cards: CardData[]): CardData[] =>
  cards.map((card, index) => ({ ...card, query_id: queryId, rank: index + 1 }));

export const executeQuery = async (input: QueryInput): Promise<{ query: Query; cards: CardData[] }> => {
  const enrichedInput = await resolveQueryLocation(input);
  const adapterResult: AdapterResult = await routeIntent(enrichedInput);
  const query = await createQuery({ ...enrichedInput, intent: adapterResult.intent });
  const cards = attachQueryId(query.id, adapterResult.cards);
  await saveCards(query.id, cards);
  await updateQueryRefresh(query.id);
  return { query, cards };
};

export const refreshExistingQuery = async (query: Query): Promise<CardData[]> => {
  const adapterInput = await resolveQueryLocation({
    prompt: query.prompt,
    locationText: query.location_text ?? undefined,
    lat: query.lat ?? undefined,
    lng: query.lng ?? undefined,
    intent: query.intent,
  });
  const adapterResult = await routeIntent(adapterInput);
  const cards = attachQueryId(query.id, adapterResult.cards);
  await saveCards(query.id, cards);
  await upsertQuery({ ...query, intent: adapterResult.intent, lat: adapterInput.lat, lng: adapterInput.lng });
  await updateQueryRefresh(query.id);
  return cards;
};
