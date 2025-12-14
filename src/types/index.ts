export type Intent = 'local_places' | 'global_ranked_list' | 'unknown';

export interface QueryInput {
  prompt: string;
  locationText?: string;
  lat?: number;
  lng?: number;
  intent?: Intent;
}

export interface Query {
  id: string;
  user_id?: string | null;
  title: string;
  prompt: string;
  intent: Intent;
  location_text?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at?: string;
  last_refreshed_at?: string | null;
}

export interface CardAction {
  label: string;
  url: string;
}

export interface CardData {
  id: string;
  query_id: string;
  rank: number;
  title: string;
  subtitle?: string | null;
  score?: number | null;
  reason?: string | null;
  data_json?: Record<string, unknown>;
  actions_json?: CardAction[];
  source_urls?: string[] | null;
  created_at?: string;
}

export interface AdapterResult {
  cards: CardData[];
  intent: Intent;
}
