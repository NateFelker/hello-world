import { Query } from './index';

export type RootStackParamList = {
  Home: undefined;
  Results: { query: Query };
};
