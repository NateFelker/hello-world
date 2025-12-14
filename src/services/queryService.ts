import { getSupabaseClient } from '../utils/supabaseClient';
import { CardData, Query, QueryInput } from '../types';
import { loadCards, loadQueries, persistCards, persistQueries } from './storage';

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createQuery = async (input: QueryInput): Promise<Query> => {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();
  const query: Query = {
    id: generateId(),
    title: input.prompt.trim().slice(0, 60) || 'New query',
    prompt: input.prompt,
    intent: input.intent ?? 'unknown',
    location_text: input.locationText ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    created_at: now,
    last_refreshed_at: now,
  };

  if (supabase) {
    await supabase.from('queries').insert(query);
  } else {
    const existing = await loadQueries();
    await persistQueries([query, ...existing]);
  }

  return query;
};

export const fetchQueries = async (): Promise<Query[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from('queries').select('*').order('last_refreshed_at', { ascending: false });
    return data ?? [];
  }
  return loadQueries();
};

export const fetchCards = async (queryId: string): Promise<CardData[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from('cards')
      .select('*')
      .eq('query_id', queryId)
      .order('rank', { ascending: true });
    return data ?? [];
  }
  return loadCards(queryId);
};

export const saveCards = async (queryId: string, cards: CardData[]) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('cards').delete().eq('query_id', queryId);
    await supabase.from('cards').insert(cards);
  }
  await persistCards(queryId, cards);
};

export const updateQueryRefresh = async (queryId: string) => {
  const supabase = getSupabaseClient();
  const ts = new Date().toISOString();
  if (supabase) {
    await supabase.from('queries').update({ last_refreshed_at: ts }).eq('id', queryId);
  } else {
    const queries = await loadQueries();
    const updated = queries.map((q) => (q.id === queryId ? { ...q, last_refreshed_at: ts } : q));
    await persistQueries(updated);
  }
};

export const upsertQuery = async (query: Query) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('queries').upsert(query);
  }
  const queries = await loadQueries();
  const existingIndex = queries.findIndex((q) => q.id === query.id);
  if (existingIndex >= 0) {
    queries[existingIndex] = query;
  } else {
    queries.unshift(query);
  }
  await persistQueries(queries);
};
