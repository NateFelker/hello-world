import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardData, Query } from '../types';

const QUERY_KEY = 'cached_queries';
const CARD_KEY_PREFIX = 'cached_cards';

export const persistQueries = async (queries: Query[]) => {
  await AsyncStorage.setItem(QUERY_KEY, JSON.stringify(queries));
};

export const loadQueries = async (): Promise<Query[]> => {
  const stored = await AsyncStorage.getItem(QUERY_KEY);
  return stored ? (JSON.parse(stored) as Query[]) : [];
};

export const persistCards = async (queryId: string, cards: CardData[]) => {
  await AsyncStorage.setItem(`${CARD_KEY_PREFIX}:${queryId}`, JSON.stringify(cards));
};

export const loadCards = async (queryId: string): Promise<CardData[]> => {
  const stored = await AsyncStorage.getItem(`${CARD_KEY_PREFIX}:${queryId}`);
  return stored ? (JSON.parse(stored) as CardData[]) : [];
};
